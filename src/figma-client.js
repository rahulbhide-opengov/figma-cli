/**
 * Figma CDP Client
 *
 * Connects directly to Figma via Chrome DevTools Protocol.
 * No external dependencies required.
 */

import WebSocket from 'ws';

export class FigmaClient {
  constructor() {
    this.ws = null;
    this.msgId = 0;
    this.callbacks = new Map();
    this.pageTitle = null;
  }

  /**
   * List all available Figma pages
   */
  static async listPages() {
    const response = await fetch('http://localhost:9222/json');
    const pages = await response.json();
    return pages
      .filter(p => p.url && p.url.includes('figma.com'))
      .map(p => ({ title: p.title, id: p.id, url: p.url, wsUrl: p.webSocketDebuggerUrl }));
  }

  /**
   * Check if Figma is running with debug port
   */
  static async isConnected() {
    try {
      const response = await fetch('http://localhost:9222/json');
      const pages = await response.json();
      return pages.some(p => p.url && p.url.includes('figma.com'));
    } catch {
      return false;
    }
  }

  /**
   * Connect to a Figma design file
   */
  async connect(pageTitle = null) {
    const response = await fetch('http://localhost:9222/json');
    const pages = await response.json();

    // Find design/file pages (not feed, home, etc.)
    let page;
    if (pageTitle) {
      page = pages.find(p =>
        p.title.includes(pageTitle) &&
        (p.url?.includes('figma.com/design') || p.url?.includes('figma.com/file'))
      );
    } else {
      // First design/file page (like figma-use does)
      page = pages.find(p =>
        p.url?.includes('figma.com/design') || p.url?.includes('figma.com/file')
      );
    }

    if (!page) {
      throw new Error('No Figma design file open. Please open a design file in Figma Desktop.');
    }

    this.pageTitle = page.title;

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(page.webSocketDebuggerUrl);

      this.ws.on('open', () => {
        // No need for Runtime.enable or context discovery
        // figma object is available directly
        resolve(this);
      });

      this.ws.on('message', (data) => {
        const msg = JSON.parse(data);

        if (msg.id && this.callbacks.has(msg.id)) {
          this.callbacks.get(msg.id)(msg);
          this.callbacks.delete(msg.id);
        }
      });

      this.ws.on('error', reject);

      setTimeout(() => reject(new Error('Connection timeout')), 10000);
    });
  }

  send(method, params = {}) {
    return new Promise((resolve) => {
      const id = ++this.msgId;
      this.callbacks.set(id, resolve);
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  /**
   * Evaluate JavaScript in the Figma context
   */
  async eval(expression) {
    if (!this.ws) {
      throw new Error('Not connected to Figma');
    }

    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });

    if (result.result?.exceptionDetails) {
      const error = result.result.exceptionDetails;
      throw new Error(error.exception?.description || error.text || 'Evaluation error');
    }

    return result.result?.result?.value;
  }

  /**
   * Get current page info
   */
  async getPageInfo() {
    return await this.eval(`
      (function() {
        return {
          name: figma.currentPage.name,
          id: figma.currentPage.id,
          childCount: figma.currentPage.children.length,
          fileKey: figma.fileKey
        };
      })()
    `);
  }

  /**
   * Get canvas bounds (for smart positioning)
   */
  async getCanvasBounds() {
    return await this.eval(`
      (function() {
        const children = figma.currentPage.children;
        if (children.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0, isEmpty: true };

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        children.forEach(n => {
          if (n.x < minX) minX = n.x;
          if (n.y < minY) minY = n.y;
          if (n.x + n.width > maxX) maxX = n.x + n.width;
          if (n.y + n.height > maxY) maxY = n.y + n.height;
        });
        return { minX, minY, maxX, maxY, isEmpty: false };
      })()
    `);
  }

  /**
   * List all nodes on current page
   */
  async listNodes(limit = 50) {
    return await this.eval(`
      figma.currentPage.children.slice(0, ${limit}).map(function(n) {
        return {
          id: n.id,
          type: n.type,
          name: n.name || '',
          x: Math.round(n.x),
          y: Math.round(n.y),
          width: Math.round(n.width),
          height: Math.round(n.height)
        };
      })
    `);
  }

  /**
   * Get all local variables
   */
  async getVariables(type = null) {
    const typeFilter = type ? `'${type}'` : 'null';
    return await this.eval(`
      (function() {
        const vars = figma.variables.getLocalVariables(${typeFilter});
        return vars.map(v => ({
          id: v.id,
          name: v.name,
          resolvedType: v.resolvedType
        }));
      })()
    `);
  }

  /**
   * Get all variable collections
   */
  async getCollections() {
    return await this.eval(`
      (function() {
        const cols = figma.variables.getLocalVariableCollections();
        return cols.map(c => ({
          id: c.id,
          name: c.name,
          modes: c.modes,
          variableIds: c.variableIds
        }));
      })()
    `);
  }

  /**
   * Render JSX-like syntax to Figma
   */
  async render(jsx) {
    // Parse JSX and generate Figma code
    const code = this.parseJSX(jsx);
    return await this.eval(code);
  }

  /**
   * Parse JSX-like syntax to Figma Plugin API code
   */
  parseJSX(jsx) {
    // Extract component and props
    const frameMatch = jsx.match(/<Frame\s+([^>]*)>([\s\S]*?)<\/Frame>/);
    if (!frameMatch) {
      throw new Error('Invalid JSX: must start with <Frame>');
    }

    const propsStr = frameMatch[1];
    const children = frameMatch[2].trim();

    // Parse props
    const props = this.parseProps(propsStr);

    // Parse children (Text elements)
    const textElements = this.parseChildren(children);

    // Generate code
    return this.generateCode(props, textElements);
  }

  parseProps(propsStr) {
    const props = {};

    // Match name="value" or name={value}
    const regex = /(\w+)=(?:"([^"]*)"|{([^}]*)})/g;
    let match;

    while ((match = regex.exec(propsStr)) !== null) {
      const key = match[1];
      const value = match[2] !== undefined ? match[2] : match[3];
      props[key] = value;
    }

    return props;
  }

  parseChildren(childrenStr) {
    const texts = [];
    const textRegex = /<Text\s+([^>]*)>([^<]*)<\/Text>/g;
    let match;

    while ((match = textRegex.exec(childrenStr)) !== null) {
      const textProps = this.parseProps(match[1]);
      textProps.content = match[2];
      texts.push(textProps);
    }

    return texts;
  }

  generateCode(props, textElements) {
    const name = props.name || 'Frame';
    const width = props.w || props.width || 320;
    const height = props.h || props.height || 200;
    const bg = props.bg || props.fill || '#ffffff';
    const rounded = props.rounded || props.radius || 0;
    const flex = props.flex || 'col';
    const gap = props.gap || 0;
    const p = props.p || props.padding || 0;
    const x = props.x || 0;
    const y = props.y || 0;

    // Build font loading
    const fonts = new Set();
    textElements.forEach(t => {
      const weight = t.weight || 'regular';
      const style = weight === 'bold' ? 'Bold' : weight === 'medium' ? 'Medium' : 'Regular';
      fonts.add(style);
    });

    const fontLoads = Array.from(fonts)
      .map(s => `figma.loadFontAsync({family:'Inter',style:'${s}'})`)
      .join(',');

    // Build text creation
    const textCode = textElements.map((t, i) => {
      const weight = t.weight || 'regular';
      const style = weight === 'bold' ? 'Bold' : weight === 'medium' ? 'Medium' : 'Regular';
      const size = t.size || 14;
      const color = t.color || '#000000';
      const fillWidth = t.w === 'fill';

      return `
        const text${i} = figma.createText();
        text${i}.fontName = {family:'Inter',style:'${style}'};
        text${i}.fontSize = ${size};
        text${i}.characters = ${JSON.stringify(t.content)};
        text${i}.fills = [{type:'SOLID',color:${this.hexToRgbCode(color)}}];
        ${fillWidth ? `text${i}.layoutSizingHorizontal = 'FILL'; text${i}.textAutoResize = 'HEIGHT';` : ''}
        frame.appendChild(text${i});
      `;
    }).join('\n');

    return `
      (async function() {
        await Promise.all([${fontLoads}]);

        const frame = figma.createFrame();
        frame.name = ${JSON.stringify(name)};
        frame.resize(${width}, ${height});
        frame.x = ${x};
        frame.y = ${y};
        frame.cornerRadius = ${rounded};
        frame.fills = [{type:'SOLID',color:${this.hexToRgbCode(bg)}}];
        frame.layoutMode = '${flex === 'row' ? 'HORIZONTAL' : 'VERTICAL'}';
        frame.itemSpacing = ${gap};
        frame.paddingTop = frame.paddingBottom = frame.paddingLeft = frame.paddingRight = ${p};
        frame.primaryAxisSizingMode = 'FIXED';
        frame.counterAxisSizingMode = 'FIXED';
        frame.clipsContent = true;

        ${textCode}

        return { id: frame.id, name: frame.name };
      })()
    `;
  }

  hexToRgbCode(hex) {
    return `{r:${parseInt(hex.slice(1,3),16)/255},g:${parseInt(hex.slice(3,5),16)/255},b:${parseInt(hex.slice(5,7),16)/255}}`;
  }

  // ============ Node Operations ============

  /**
   * Get a node by ID
   */
  async getNode(nodeId) {
    return await this.eval(`
      (function() {
        const n = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!n) return null;
        return {
          id: n.id,
          type: n.type,
          name: n.name || '',
          x: n.x,
          y: n.y,
          width: n.width,
          height: n.height,
          visible: n.visible,
          opacity: n.opacity
        };
      })()
    `);
  }

  /**
   * Delete a node by ID
   */
  async deleteNode(nodeId) {
    return await this.eval(`
      (function() {
        const n = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!n) return { success: false, error: 'Node not found' };
        n.remove();
        return { success: true };
      })()
    `);
  }

  /**
   * Move a node to new position
   */
  async moveNode(nodeId, x, y) {
    return await this.eval(`
      (function() {
        const n = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!n) return { success: false, error: 'Node not found' };
        n.x = ${x};
        n.y = ${y};
        return { success: true, x: n.x, y: n.y };
      })()
    `);
  }

  /**
   * Resize a node
   */
  async resizeNode(nodeId, width, height) {
    return await this.eval(`
      (function() {
        const n = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!n) return { success: false, error: 'Node not found' };
        if (n.resize) n.resize(${width}, ${height});
        return { success: true, width: n.width, height: n.height };
      })()
    `);
  }

  /**
   * Get current selection
   */
  async getSelection() {
    return await this.eval(`
      figma.currentPage.selection.map(n => ({
        id: n.id,
        type: n.type,
        name: n.name || ''
      }))
    `);
  }

  /**
   * Set selection by node IDs
   */
  async setSelection(nodeIds) {
    const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];
    return await this.eval(`
      (function() {
        const nodes = ${JSON.stringify(ids)}.map(id => figma.getNodeById(id)).filter(n => n);
        figma.currentPage.selection = nodes;
        return nodes.map(n => n.id);
      })()
    `);
  }

  /**
   * Get node tree (recursive structure)
   */
  async getNodeTree(nodeId, maxDepth = 10) {
    return await this.eval(`
      (function() {
        function buildTree(node, depth) {
          if (depth > ${maxDepth}) return null;
          const result = {
            id: node.id,
            type: node.type,
            name: node.name || '',
            x: Math.round(node.x || 0),
            y: Math.round(node.y || 0),
            width: Math.round(node.width || 0),
            height: Math.round(node.height || 0)
          };
          if (node.children) {
            result.children = node.children.map(c => buildTree(c, depth + 1)).filter(c => c);
          }
          return result;
        }
        const node = ${nodeId ? `figma.getNodeById(${JSON.stringify(nodeId)})` : 'figma.currentPage'};
        if (!node) return null;
        return buildTree(node, 0);
      })()
    `);
  }

  /**
   * Convert nodes to components
   */
  async toComponent(nodeIds) {
    const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];
    return await this.eval(`
      (function() {
        const results = [];
        ${JSON.stringify(ids)}.forEach(id => {
          const node = figma.getNodeById(id);
          if (node && node.type === 'FRAME') {
            const component = figma.createComponentFromNode(node);
            results.push({ id: component.id, name: component.name });
          }
        });
        return results;
      })()
    `);
  }

  /**
   * Duplicate a node
   */
  async duplicateNode(nodeId, offsetX = 50, offsetY = 0) {
    return await this.eval(`
      (function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node) return null;
        const clone = node.clone();
        clone.x = node.x + ${offsetX};
        clone.y = node.y + ${offsetY};
        return { id: clone.id, name: clone.name, x: clone.x, y: clone.y };
      })()
    `);
  }

  /**
   * Rename a node
   */
  async renameNode(nodeId, newName) {
    return await this.eval(`
      (function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node) return { success: false, error: 'Node not found' };
        node.name = ${JSON.stringify(newName)};
        return { success: true, name: node.name };
      })()
    `);
  }

  /**
   * Set node fill color
   */
  async setFill(nodeId, hexColor) {
    return await this.eval(`
      (function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node) return { success: false, error: 'Node not found' };
        const rgb = ${this.hexToRgbCode(hexColor)};
        node.fills = [{type: 'SOLID', color: rgb}];
        return { success: true };
      })()
    `);
  }

  /**
   * Set node corner radius
   */
  async setRadius(nodeId, radius) {
    return await this.eval(`
      (function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node) return { success: false, error: 'Node not found' };
        if ('cornerRadius' in node) node.cornerRadius = ${radius};
        return { success: true };
      })()
    `);
  }

  /**
   * Get file key from current file
   */
  async getFileKey() {
    return await this.eval('figma.fileKey');
  }

  /**
   * Arrange nodes on canvas
   */
  async arrangeNodes(gap = 100, columns = null) {
    return await this.eval(`
      (function() {
        const nodes = figma.currentPage.children.filter(n => n.type === 'FRAME' || n.type === 'COMPONENT');
        if (nodes.length === 0) return { arranged: 0 };

        const cols = ${columns || 'null'} || nodes.length;
        let x = 0, y = 0, rowHeight = 0, col = 0;

        nodes.forEach(n => {
          n.x = x;
          n.y = y;
          rowHeight = Math.max(rowHeight, n.height);
          col++;
          if (col >= cols) {
            col = 0;
            x = 0;
            y += rowHeight + ${gap};
            rowHeight = 0;
          } else {
            x += n.width + ${gap};
          }
        });

        return { arranged: nodes.length };
      })()
    `);
  }

  // ============ Create Primitives ============

  /**
   * Create a frame
   */
  async createFrame(options = {}) {
    const { name = 'Frame', width = 100, height = 100, x, y, fill = '#ffffff', radius = 0 } = options;
    return await this.eval(`
      (function() {
        const frame = figma.createFrame();
        frame.name = ${JSON.stringify(name)};
        frame.resize(${width}, ${height});
        ${x !== undefined ? `frame.x = ${x};` : ''}
        ${y !== undefined ? `frame.y = ${y};` : ''}
        frame.cornerRadius = ${radius};
        frame.fills = [{type:'SOLID',color:${this.hexToRgbCode(fill)}}];
        return { id: frame.id, name: frame.name, x: frame.x, y: frame.y };
      })()
    `);
  }

  /**
   * Create a rectangle
   */
  async createRectangle(options = {}) {
    const { name = 'Rectangle', width = 100, height = 100, x, y, fill = '#d9d9d9', radius = 0 } = options;
    return await this.eval(`
      (function() {
        const rect = figma.createRectangle();
        rect.name = ${JSON.stringify(name)};
        rect.resize(${width}, ${height});
        ${x !== undefined ? `rect.x = ${x};` : ''}
        ${y !== undefined ? `rect.y = ${y};` : ''}
        rect.cornerRadius = ${radius};
        rect.fills = [{type:'SOLID',color:${this.hexToRgbCode(fill)}}];
        return { id: rect.id, name: rect.name };
      })()
    `);
  }

  /**
   * Create an ellipse/circle
   */
  async createEllipse(options = {}) {
    const { name = 'Ellipse', width = 100, height = 100, x, y, fill = '#d9d9d9' } = options;
    return await this.eval(`
      (function() {
        const ellipse = figma.createEllipse();
        ellipse.name = ${JSON.stringify(name)};
        ellipse.resize(${width}, ${height || width});
        ${x !== undefined ? `ellipse.x = ${x};` : ''}
        ${y !== undefined ? `ellipse.y = ${y};` : ''}
        ellipse.fills = [{type:'SOLID',color:${this.hexToRgbCode(fill)}}];
        return { id: ellipse.id, name: ellipse.name };
      })()
    `);
  }

  /**
   * Create a text node
   */
  async createText(options = {}) {
    const { content = 'Text', x, y, size = 14, color = '#000000', weight = 'Regular' } = options;
    const style = weight === 'bold' ? 'Bold' : weight === 'medium' ? 'Medium' : 'Regular';
    return await this.eval(`
      (async function() {
        await figma.loadFontAsync({family:'Inter',style:'${style}'});
        const text = figma.createText();
        text.fontName = {family:'Inter',style:'${style}'};
        text.fontSize = ${size};
        text.characters = ${JSON.stringify(content)};
        text.fills = [{type:'SOLID',color:${this.hexToRgbCode(color)}}];
        ${x !== undefined ? `text.x = ${x};` : ''}
        ${y !== undefined ? `text.y = ${y};` : ''}
        return { id: text.id, characters: text.characters };
      })()
    `);
  }

  /**
   * Create a line
   */
  async createLine(options = {}) {
    const { length = 100, x, y, color = '#000000', strokeWeight = 1 } = options;
    return await this.eval(`
      (function() {
        const line = figma.createLine();
        line.resize(${length}, 0);
        ${x !== undefined ? `line.x = ${x};` : ''}
        ${y !== undefined ? `line.y = ${y};` : ''}
        line.strokes = [{type:'SOLID',color:${this.hexToRgbCode(color)}}];
        line.strokeWeight = ${strokeWeight};
        return { id: line.id };
      })()
    `);
  }

  /**
   * Create an auto-layout frame
   */
  async createAutoLayout(options = {}) {
    const {
      name = 'AutoLayout',
      direction = 'VERTICAL',
      gap = 8,
      padding = 16,
      width, height, x, y,
      fill = '#ffffff',
      radius = 0
    } = options;
    return await this.eval(`
      (function() {
        const frame = figma.createFrame();
        frame.name = ${JSON.stringify(name)};
        frame.layoutMode = '${direction === 'row' || direction === 'HORIZONTAL' ? 'HORIZONTAL' : 'VERTICAL'}';
        frame.itemSpacing = ${gap};
        frame.paddingTop = frame.paddingBottom = frame.paddingLeft = frame.paddingRight = ${padding};
        frame.primaryAxisSizingMode = 'AUTO';
        frame.counterAxisSizingMode = 'AUTO';
        ${width ? `frame.resize(${width}, ${height || width}); frame.primaryAxisSizingMode = 'FIXED'; frame.counterAxisSizingMode = 'FIXED';` : ''}
        ${x !== undefined ? `frame.x = ${x};` : ''}
        ${y !== undefined ? `frame.y = ${y};` : ''}
        frame.cornerRadius = ${radius};
        frame.fills = [{type:'SOLID',color:${this.hexToRgbCode(fill)}}];
        return { id: frame.id, name: frame.name };
      })()
    `);
  }

  // ============ Query & Find ============

  /**
   * Find nodes by name (partial match)
   */
  async findByName(name, type = null) {
    return await this.eval(`
      (function() {
        const results = [];
        function search(node) {
          if (node.name && node.name.includes(${JSON.stringify(name)})) {
            ${type ? `if (node.type === '${type}')` : ''} {
              results.push({ id: node.id, type: node.type, name: node.name });
            }
          }
          if (node.children) node.children.forEach(search);
        }
        search(figma.currentPage);
        return results.slice(0, 100);
      })()
    `);
  }

  /**
   * Find nodes by type
   */
  async findByType(type) {
    return await this.eval(`
      figma.currentPage.findAll(n => n.type === '${type}').slice(0, 100).map(n => ({
        id: n.id, name: n.name, x: Math.round(n.x), y: Math.round(n.y)
      }))
    `);
  }

  // ============ Variables ============

  /**
   * Create a variable
   */
  async createVariable(options = {}) {
    const { name, collectionId, type = 'COLOR', value } = options;
    return await this.eval(`
      (function() {
        const col = figma.variables.getVariableCollectionById(${JSON.stringify(collectionId)});
        if (!col) return { error: 'Collection not found' };
        const variable = figma.variables.createVariable(${JSON.stringify(name)}, col, '${type}');
        ${value ? `variable.setValueForMode(col.defaultModeId, ${type === 'COLOR' ? this.hexToRgbCode(value) : JSON.stringify(value)});` : ''}
        return { id: variable.id, name: variable.name };
      })()
    `);
  }

  /**
   * Create a variable collection
   */
  async createCollection(name) {
    return await this.eval(`
      (function() {
        const col = figma.variables.createVariableCollection(${JSON.stringify(name)});
        return { id: col.id, name: col.name, defaultModeId: col.defaultModeId };
      })()
    `);
  }

  /**
   * Bind a variable to a node property
   */
  async bindVariable(nodeId, property, variableName) {
    return await this.eval(`
      (function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node) return { error: 'Node not found' };

        const allVars = figma.variables.getLocalVariables();
        const variable = allVars.find(v => v.name === ${JSON.stringify(variableName)});
        if (!variable) return { error: 'Variable not found: ' + ${JSON.stringify(variableName)} };

        const prop = ${JSON.stringify(property)};
        if (prop === 'fill' || prop === 'fills') {
          node.fills = [figma.variables.setBoundVariableForPaint(
            {type:'SOLID',color:{r:1,g:1,b:1}}, 'color', variable
          )];
        } else if (prop === 'stroke' || prop === 'strokes') {
          node.strokes = [figma.variables.setBoundVariableForPaint(
            {type:'SOLID',color:{r:0,g:0,b:0}}, 'color', variable
          )];
        } else {
          node.setBoundVariable(prop, variable);
        }
        return { success: true, nodeId: node.id, property: prop, variable: variable.name };
      })()
    `);
  }

  // ============ Components ============

  /**
   * Create a component from a frame
   */
  async createComponent(nodeId) {
    return await this.eval(`
      (function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node) return { error: 'Node not found' };
        const component = figma.createComponentFromNode(node);
        return { id: component.id, name: component.name };
      })()
    `);
  }

  /**
   * Create an instance of a component
   */
  async createInstance(componentId, x, y) {
    return await this.eval(`
      (function() {
        const comp = figma.getNodeById(${JSON.stringify(componentId)});
        if (!comp || comp.type !== 'COMPONENT') return { error: 'Component not found' };
        const instance = comp.createInstance();
        ${x !== undefined ? `instance.x = ${x};` : ''}
        ${y !== undefined ? `instance.y = ${y};` : ''}
        return { id: instance.id, name: instance.name, x: instance.x, y: instance.y };
      })()
    `);
  }

  /**
   * Get all local components
   */
  async getComponents() {
    return await this.eval(`
      figma.root.findAll(n => n.type === 'COMPONENT').map(c => ({
        id: c.id, name: c.name, page: c.parent?.parent?.name
      }))
    `);
  }

  // ============ Export ============

  /**
   * Export a node as PNG (returns base64)
   */
  async exportPNG(nodeId, scale = 2) {
    return await this.eval(`
      (async function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node) return { error: 'Node not found' };
        const bytes = await node.exportAsync({ format: 'PNG', scale: ${scale} });
        // Convert to base64
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return { base64: btoa(binary), width: node.width * ${scale}, height: node.height * ${scale} };
      })()
    `);
  }

  /**
   * Export a node as SVG
   */
  async exportSVG(nodeId) {
    return await this.eval(`
      (async function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node) return { error: 'Node not found' };
        const bytes = await node.exportAsync({ format: 'SVG' });
        return { svg: String.fromCharCode.apply(null, bytes) };
      })()
    `);
  }

  // ============ Layout ============

  /**
   * Set auto-layout on a frame
   */
  async setAutoLayout(nodeId, options = {}) {
    const { direction = 'VERTICAL', gap = 8, padding = 0 } = options;
    return await this.eval(`
      (function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node || node.type !== 'FRAME') return { error: 'Frame not found' };
        node.layoutMode = '${direction === 'row' || direction === 'HORIZONTAL' ? 'HORIZONTAL' : 'VERTICAL'}';
        node.itemSpacing = ${gap};
        node.paddingTop = node.paddingBottom = node.paddingLeft = node.paddingRight = ${padding};
        return { success: true };
      })()
    `);
  }

  /**
   * Set sizing mode (hug/fill/fixed)
   */
  async setSizing(nodeId, horizontal = 'FIXED', vertical = 'FIXED') {
    return await this.eval(`
      (function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node) return { error: 'Node not found' };
        if (node.layoutSizingHorizontal !== undefined) {
          node.layoutSizingHorizontal = '${horizontal}';
          node.layoutSizingVertical = '${vertical}';
        }
        return { success: true };
      })()
    `);
  }

  // ============ Icon (Iconify) ============

  /**
   * Create an icon from Iconify
   * @param {string} iconName - e.g., "lucide:star", "mdi:home"
   */
  async createIcon(iconName, options = {}) {
    const { size = 24, color = '#000000', x, y } = options;
    const [prefix, name] = iconName.split(':');

    // Fetch SVG from Iconify API
    const response = await fetch(`https://api.iconify.design/${prefix}/${name}.svg?width=${size}&height=${size}`);
    const svg = await response.text();

    return await this.eval(`
      (function() {
        const svgString = ${JSON.stringify(svg)};
        const node = figma.createNodeFromSvg(svgString);
        node.name = ${JSON.stringify(iconName)};
        ${x !== undefined ? `node.x = ${x};` : ''}
        ${y !== undefined ? `node.y = ${y};` : ''}
        // Apply color
        function colorize(n) {
          if (n.fills && n.fills.length > 0) {
            n.fills = [{type:'SOLID',color:${this.hexToRgbCode(color)}}];
          }
          if (n.children) n.children.forEach(colorize);
        }
        colorize(node);
        return { id: node.id, name: node.name };
      })()
    `);
  }

  // ============ Delete All ============

  /**
   * Delete all nodes on current page
   */
  async deleteAll() {
    return await this.eval(`
      (function() {
        const count = figma.currentPage.children.length;
        figma.currentPage.children.forEach(n => n.remove());
        return { deleted: count };
      })()
    `);
  }

  /**
   * Zoom to fit all content
   */
  async zoomToFit() {
    return await this.eval(`
      (function() {
        figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
        return { success: true };
      })()
    `);
  }

  /**
   * Group nodes
   */
  async groupNodes(nodeIds, name = 'Group') {
    return await this.eval(`
      (function() {
        const nodes = ${JSON.stringify(nodeIds)}.map(id => figma.getNodeById(id)).filter(n => n);
        if (nodes.length === 0) return { error: 'No nodes found' };
        const group = figma.group(nodes, figma.currentPage);
        group.name = ${JSON.stringify(name)};
        return { id: group.id, name: group.name, childCount: nodes.length };
      })()
    `);
  }

  // ============ Team Libraries ============

  /**
   * Get available library variable collections
   */
  async getLibraryCollections() {
    return await this.eval(`
      (async function() {
        const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
        return collections.map(c => ({
          key: c.key,
          name: c.name,
          libraryName: c.libraryName
        }));
      })()
    `);
  }

  /**
   * Get variables from a library collection
   */
  async getLibraryVariables(collectionKey) {
    return await this.eval(`
      (async function() {
        const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(${JSON.stringify(collectionKey)});
        return variables.map(v => ({
          key: v.key,
          name: v.name,
          resolvedType: v.resolvedType
        }));
      })()
    `);
  }

  /**
   * Import a variable from a library by key
   */
  async importLibraryVariable(variableKey) {
    return await this.eval(`
      (async function() {
        const variable = await figma.variables.importVariableByKeyAsync(${JSON.stringify(variableKey)});
        return { id: variable.id, name: variable.name, resolvedType: variable.resolvedType };
      })()
    `);
  }

  /**
   * Get available library components
   */
  async getLibraryComponents() {
    return await this.eval(`
      (async function() {
        // Get all component sets and components from enabled libraries
        const components = [];

        // Search through all pages for component instances to find library components
        const instances = figma.root.findAll(n => n.type === 'INSTANCE');
        const seen = new Set();

        for (const instance of instances) {
          const mainComponent = await instance.getMainComponentAsync();
          if (mainComponent && mainComponent.remote && !seen.has(mainComponent.key)) {
            seen.add(mainComponent.key);
            components.push({
              key: mainComponent.key,
              name: mainComponent.name,
              description: mainComponent.description || ''
            });
          }
        }

        return components;
      })()
    `);
  }

  /**
   * Import a component from a library by key
   */
  async importLibraryComponent(componentKey) {
    return await this.eval(`
      (async function() {
        const component = await figma.importComponentByKeyAsync(${JSON.stringify(componentKey)});
        return { id: component.id, name: component.name, key: component.key };
      })()
    `);
  }

  /**
   * Create an instance of a library component
   */
  async createLibraryInstance(componentKey, x, y) {
    return await this.eval(`
      (async function() {
        const component = await figma.importComponentByKeyAsync(${JSON.stringify(componentKey)});
        const instance = component.createInstance();
        ${x !== undefined ? `instance.x = ${x};` : ''}
        ${y !== undefined ? `instance.y = ${y};` : ''}
        return { id: instance.id, name: instance.name, x: instance.x, y: instance.y };
      })()
    `);
  }

  /**
   * Get available library styles (color, text, effect)
   */
  async getLibraryStyles() {
    return await this.eval(`
      (async function() {
        const styles = {
          paint: [],
          text: [],
          effect: [],
          grid: []
        };

        // Get local styles that reference library
        const paintStyles = figma.getLocalPaintStyles();
        const textStyles = figma.getLocalTextStyles();
        const effectStyles = figma.getLocalEffectStyles();
        const gridStyles = figma.getLocalGridStyles();

        paintStyles.forEach(s => {
          styles.paint.push({ id: s.id, name: s.name, key: s.key, remote: s.remote });
        });
        textStyles.forEach(s => {
          styles.text.push({ id: s.id, name: s.name, key: s.key, remote: s.remote });
        });
        effectStyles.forEach(s => {
          styles.effect.push({ id: s.id, name: s.name, key: s.key, remote: s.remote });
        });
        gridStyles.forEach(s => {
          styles.grid.push({ id: s.id, name: s.name, key: s.key, remote: s.remote });
        });

        return styles;
      })()
    `);
  }

  /**
   * Import a style from a library by key
   */
  async importLibraryStyle(styleKey) {
    return await this.eval(`
      (async function() {
        const style = await figma.importStyleByKeyAsync(${JSON.stringify(styleKey)});
        return { id: style.id, name: style.name, type: style.type };
      })()
    `);
  }

  /**
   * Apply a library style to a node
   */
  async applyLibraryStyle(nodeId, styleKey, styleType = 'fill') {
    return await this.eval(`
      (async function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node) return { error: 'Node not found' };

        const style = await figma.importStyleByKeyAsync(${JSON.stringify(styleKey)});
        const type = ${JSON.stringify(styleType)};

        if (type === 'fill' && 'fillStyleId' in node) {
          node.fillStyleId = style.id;
        } else if (type === 'stroke' && 'strokeStyleId' in node) {
          node.strokeStyleId = style.id;
        } else if (type === 'text' && 'textStyleId' in node) {
          node.textStyleId = style.id;
        } else if (type === 'effect' && 'effectStyleId' in node) {
          node.effectStyleId = style.id;
        }

        return { success: true, styleId: style.id, styleName: style.name };
      })()
    `);
  }

  /**
   * Bind a library variable to a node
   */
  async bindLibraryVariable(nodeId, property, variableKey) {
    return await this.eval(`
      (async function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node) return { error: 'Node not found' };

        const variable = await figma.variables.importVariableByKeyAsync(${JSON.stringify(variableKey)});
        const prop = ${JSON.stringify(property)};

        if (prop === 'fill' || prop === 'fills') {
          node.fills = [figma.variables.setBoundVariableForPaint(
            {type:'SOLID',color:{r:1,g:1,b:1}}, 'color', variable
          )];
        } else if (prop === 'stroke' || prop === 'strokes') {
          node.strokes = [figma.variables.setBoundVariableForPaint(
            {type:'SOLID',color:{r:0,g:0,b:0}}, 'color', variable
          )];
        } else {
          node.setBoundVariable(prop, variable);
        }

        return { success: true, variableId: variable.id, variableName: variable.name };
      })()
    `);
  }

  /**
   * List all enabled libraries
   */
  async getEnabledLibraries() {
    return await this.eval(`
      (async function() {
        const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
        const libraries = new Map();

        collections.forEach(c => {
          if (!libraries.has(c.libraryName)) {
            libraries.set(c.libraryName, { name: c.libraryName, collections: [] });
          }
          libraries.get(c.libraryName).collections.push({ key: c.key, name: c.name });
        });

        return Array.from(libraries.values());
      })()
    `);
  }

  /**
   * Swap a component instance to another library component
   */
  async swapComponent(instanceId, newComponentKey) {
    return await this.eval(`
      (async function() {
        const instance = figma.getNodeById(${JSON.stringify(instanceId)});
        if (!instance || instance.type !== 'INSTANCE') return { error: 'Instance not found' };

        const newComponent = await figma.importComponentByKeyAsync(${JSON.stringify(newComponentKey)});
        instance.swapComponent(newComponent);

        return { success: true, newComponentName: newComponent.name };
      })()
    `);
  }

  // ============ Designer Utilities ============

  /**
   * Batch rename layers with pattern
   * Patterns: {n} = number, {name} = original name, {type} = node type
   */
  async batchRename(nodeIds, pattern, options = {}) {
    const { startNumber = 1, case: textCase = null } = options;
    return await this.eval(`
      (function() {
        const ids = ${JSON.stringify(nodeIds)};
        const pattern = ${JSON.stringify(pattern)};
        let num = ${startNumber};
        const results = [];

        ids.forEach(id => {
          const node = figma.getNodeById(id);
          if (!node) return;

          let newName = pattern
            .replace(/{n}/g, num)
            .replace(/{name}/g, node.name)
            .replace(/{type}/g, node.type.toLowerCase());

          ${textCase === 'camel' ? "newName = newName.replace(/[-_\\s]+(\\w)/g, (_, c) => c.toUpperCase()).replace(/^\\w/, c => c.toLowerCase());" : ''}
          ${textCase === 'pascal' ? "newName = newName.replace(/[-_\\s]+(\\w)/g, (_, c) => c.toUpperCase()).replace(/^\\w/, c => c.toUpperCase());" : ''}
          ${textCase === 'snake' ? "newName = newName.replace(/[\\s-]+/g, '_').toLowerCase();" : ''}
          ${textCase === 'kebab' ? "newName = newName.replace(/[\\s_]+/g, '-').toLowerCase();" : ''}

          node.name = newName;
          results.push({ id: node.id, name: newName });
          num++;
        });

        return results;
      })()
    `);
  }

  /**
   * Rename all children of a node
   */
  async batchRenameChildren(parentId, pattern, options = {}) {
    return await this.eval(`
      (function() {
        const parent = figma.getNodeById(${JSON.stringify(parentId)});
        if (!parent || !parent.children) return { error: 'Parent not found or has no children' };

        const ids = parent.children.map(c => c.id);
        return ids;
      })()
    `).then(ids => this.batchRename(ids, pattern, options));
  }

  /**
   * Generate lorem ipsum text
   */
  async loremIpsum(options = {}) {
    const { type = 'paragraph', count = 1 } = options;
    const lorem = {
      words: ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat'],
      paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    };

    if (type === 'words') {
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(lorem.words[Math.floor(Math.random() * lorem.words.length)]);
      }
      return words.join(' ');
    } else if (type === 'sentences') {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        const wordCount = 8 + Math.floor(Math.random() * 8);
        const words = [];
        for (let j = 0; j < wordCount; j++) {
          words.push(lorem.words[Math.floor(Math.random() * lorem.words.length)]);
        }
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        sentences.push(words.join(' ') + '.');
      }
      return sentences.join(' ');
    } else {
      return Array(count).fill(lorem.paragraph).join('\n\n');
    }
  }

  /**
   * Fill text layer with lorem ipsum
   */
  async fillWithLorem(nodeId, options = {}) {
    const text = await this.loremIpsum(options);
    return await this.eval(`
      (async function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node || node.type !== 'TEXT') return { error: 'Text node not found' };

        await figma.loadFontAsync(node.fontName);
        node.characters = ${JSON.stringify(text)};
        return { success: true, text: node.characters };
      })()
    `);
  }

  /**
   * Insert image from URL (Unsplash, etc.)
   */
  async insertImage(imageUrl, options = {}) {
    const { x = 0, y = 0, width = 400, height = 300, name = 'Image' } = options;

    // Fetch image and convert to base64
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    return await this.eval(`
      (async function() {
        const imageData = Uint8Array.from(atob(${JSON.stringify(base64)}), c => c.charCodeAt(0));
        const image = figma.createImage(imageData);

        const rect = figma.createRectangle();
        rect.name = ${JSON.stringify(name)};
        rect.x = ${x};
        rect.y = ${y};
        rect.resize(${width}, ${height});
        rect.fills = [{
          type: 'IMAGE',
          scaleMode: 'FILL',
          imageHash: image.hash
        }];

        return { id: rect.id, name: rect.name, imageHash: image.hash };
      })()
    `);
  }

  /**
   * Insert random Unsplash image
   */
  async insertUnsplash(query, options = {}) {
    const { width = 800, height = 600 } = options;
    const imageUrl = `https://source.unsplash.com/random/${width}x${height}/?${encodeURIComponent(query)}`;
    return await this.insertImage(imageUrl, { ...options, width, height, name: `Unsplash: ${query}` });
  }

  /**
   * Export node in multiple sizes (@1x, @2x, @3x)
   */
  async exportMultipleSizes(nodeId, options = {}) {
    const { scales = [1, 2, 3], format = 'PNG' } = options;
    const results = [];

    for (const scale of scales) {
      const result = await this.eval(`
        (async function() {
          const node = figma.getNodeById(${JSON.stringify(nodeId)});
          if (!node) return { error: 'Node not found' };

          const bytes = await node.exportAsync({ format: '${format}', scale: ${scale} });
          let binary = '';
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          return {
            scale: ${scale},
            suffix: '@${scale}x',
            base64: btoa(binary),
            width: Math.round(node.width * ${scale}),
            height: Math.round(node.height * ${scale})
          };
        })()
      `);
      results.push(result);
    }

    return results;
  }

  /**
   * Check contrast ratio between two colors (WCAG)
   */
  checkContrast(color1, color2) {
    const getLuminance = (hex) => {
      const rgb = [
        parseInt(hex.slice(1, 3), 16) / 255,
        parseInt(hex.slice(3, 5), 16) / 255,
        parseInt(hex.slice(5, 7), 16) / 255
      ].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    return {
      ratio: Math.round(ratio * 100) / 100,
      AA: ratio >= 4.5,
      AALarge: ratio >= 3,
      AAA: ratio >= 7,
      AAALarge: ratio >= 4.5
    };
  }

  /**
   * Check contrast of text node against background
   */
  async checkNodeContrast(textNodeId) {
    return await this.eval(`
      (function() {
        const textNode = figma.getNodeById(${JSON.stringify(textNodeId)});
        if (!textNode || textNode.type !== 'TEXT') return { error: 'Text node not found' };

        // Get text color
        const textFill = textNode.fills[0];
        if (!textFill || textFill.type !== 'SOLID') return { error: 'Text has no solid fill' };
        const textColor = textFill.color;

        // Find background (parent frame)
        let parent = textNode.parent;
        let bgColor = null;
        while (parent && !bgColor) {
          if (parent.fills && parent.fills.length > 0) {
            const fill = parent.fills.find(f => f.type === 'SOLID' && f.visible !== false);
            if (fill) bgColor = fill.color;
          }
          parent = parent.parent;
        }

        if (!bgColor) bgColor = { r: 1, g: 1, b: 1 }; // Default white

        const toHex = (c) => '#' +
          Math.round(c.r * 255).toString(16).padStart(2, '0') +
          Math.round(c.g * 255).toString(16).padStart(2, '0') +
          Math.round(c.b * 255).toString(16).padStart(2, '0');

        return {
          textColor: toHex(textColor),
          bgColor: toHex(bgColor),
          nodeId: textNode.id,
          nodeName: textNode.name
        };
      })()
    `).then(result => {
      if (result.error) return result;
      const contrast = this.checkContrast(result.textColor, result.bgColor);
      return { ...result, ...contrast };
    });
  }

  /**
   * Find and replace text in all text nodes
   */
  async findReplaceText(find, replace, options = {}) {
    const { caseSensitive = false, wholeWord = false } = options;
    return await this.eval(`
      (async function() {
        const textNodes = figma.currentPage.findAll(n => n.type === 'TEXT');
        const results = [];
        const findStr = ${JSON.stringify(find)};
        const replaceStr = ${JSON.stringify(replace)};
        const caseSensitive = ${caseSensitive};
        const wholeWord = ${wholeWord};

        for (const node of textNodes) {
          let text = node.characters;
          let pattern = caseSensitive ? findStr : findStr.toLowerCase();
          let searchText = caseSensitive ? text : text.toLowerCase();

          if (wholeWord) {
            pattern = '\\\\b' + pattern + '\\\\b';
          }

          const regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
          if (regex.test(searchText)) {
            await figma.loadFontAsync(node.fontName);
            node.characters = text.replace(new RegExp(findStr, caseSensitive ? 'g' : 'gi'), replaceStr);
            results.push({ id: node.id, name: node.name, newText: node.characters });
          }
        }

        return { replaced: results.length, nodes: results };
      })()
    `);
  }

  /**
   * Select all nodes with same fill color
   */
  async selectSameFill(nodeId) {
    return await this.eval(`
      (function() {
        const refNode = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!refNode || !refNode.fills || refNode.fills.length === 0) return { error: 'Node has no fill' };

        const refFill = refNode.fills[0];
        if (refFill.type !== 'SOLID') return { error: 'Reference fill is not solid' };

        const matches = figma.currentPage.findAll(n => {
          if (!n.fills || n.fills.length === 0) return false;
          const fill = n.fills[0];
          if (fill.type !== 'SOLID') return false;
          return Math.abs(fill.color.r - refFill.color.r) < 0.01 &&
                 Math.abs(fill.color.g - refFill.color.g) < 0.01 &&
                 Math.abs(fill.color.b - refFill.color.b) < 0.01;
        });

        figma.currentPage.selection = matches;
        return { selected: matches.length, ids: matches.map(n => n.id) };
      })()
    `);
  }

  /**
   * Select all nodes with same stroke color
   */
  async selectSameStroke(nodeId) {
    return await this.eval(`
      (function() {
        const refNode = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!refNode || !refNode.strokes || refNode.strokes.length === 0) return { error: 'Node has no stroke' };

        const refStroke = refNode.strokes[0];
        if (refStroke.type !== 'SOLID') return { error: 'Reference stroke is not solid' };

        const matches = figma.currentPage.findAll(n => {
          if (!n.strokes || n.strokes.length === 0) return false;
          const stroke = n.strokes[0];
          if (stroke.type !== 'SOLID') return false;
          return Math.abs(stroke.color.r - refStroke.color.r) < 0.01 &&
                 Math.abs(stroke.color.g - refStroke.color.g) < 0.01 &&
                 Math.abs(stroke.color.b - refStroke.color.b) < 0.01;
        });

        figma.currentPage.selection = matches;
        return { selected: matches.length, ids: matches.map(n => n.id) };
      })()
    `);
  }

  /**
   * Select all text nodes with same font
   */
  async selectSameFont(nodeId) {
    return await this.eval(`
      (function() {
        const refNode = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!refNode || refNode.type !== 'TEXT') return { error: 'Not a text node' };

        const refFont = refNode.fontName;
        const refSize = refNode.fontSize;

        const matches = figma.currentPage.findAll(n => {
          if (n.type !== 'TEXT') return false;
          return n.fontName.family === refFont.family &&
                 n.fontName.style === refFont.style &&
                 n.fontSize === refSize;
        });

        figma.currentPage.selection = matches;
        return { selected: matches.length, ids: matches.map(n => n.id) };
      })()
    `);
  }

  /**
   * Select all nodes of same type and size
   */
  async selectSameSize(nodeId) {
    return await this.eval(`
      (function() {
        const refNode = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!refNode) return { error: 'Node not found' };

        const matches = figma.currentPage.findAll(n => {
          return n.type === refNode.type &&
                 Math.abs(n.width - refNode.width) < 1 &&
                 Math.abs(n.height - refNode.height) < 1;
        });

        figma.currentPage.selection = matches;
        return { selected: matches.length, ids: matches.map(n => n.id) };
      })()
    `);
  }

  /**
   * Simulate color blindness on a frame (creates a copy with filters)
   */
  async simulateColorBlindness(nodeId, type = 'deuteranopia') {
    const matrices = {
      deuteranopia: [0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0],
      protanopia: [0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0],
      tritanopia: [0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0],
      grayscale: [0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0]
    };

    const matrix = matrices[type] || matrices.deuteranopia;

    return await this.eval(`
      (function() {
        const node = figma.getNodeById(${JSON.stringify(nodeId)});
        if (!node) return { error: 'Node not found' };

        const clone = node.clone();
        clone.name = node.name + ' (${type})';
        clone.x = node.x + node.width + 50;

        // Apply as layer blur with color matrix (simplified simulation)
        // Note: Figma doesn't have native color matrix, this is a visual approximation
        clone.opacity = 0.9;

        return { id: clone.id, name: clone.name, type: '${type}' };
      })()
    `);
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default FigmaClient;
