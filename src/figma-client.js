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

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default FigmaClient;
