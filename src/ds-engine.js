/**
 * Design System Engine
 *
 * Loads tokens from design-system-tokens.ts and resolves them
 * for use in Figma component generation. This is the bridge between
 * your design system spec and Figma's API.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_TOKEN_PATH = resolve(__dirname, '../design-system/tokens.ts');

// Raw token data extracted from design-system-tokens.ts
let _tokensCache = null;
let _tokenFilePath = null;

/**
 * Parse the TypeScript token file and extract all token maps.
 * Works without a TS compiler by regex-extracting the object literals.
 */
export function loadTokens(filePath) {
  const tokenPath = filePath || DEFAULT_TOKEN_PATH;

  if (_tokensCache && _tokenFilePath === tokenPath) return _tokensCache;

  if (!existsSync(tokenPath)) {
    throw new Error(`Token file not found: ${tokenPath}\nExpected at: ${DEFAULT_TOKEN_PATH}`);
  }

  const src = readFileSync(tokenPath, 'utf-8');

  const categories = {
    typography: extractTokenMap(src, 'typographyTokens'),
    colors: extractTokenMap(src, 'colorTokens'),
    colorsDark: extractTokenMap(src, 'darkThemeColorTokens'),
    spacing: extractTokenMap(src, 'spacingTokens'),
    sizing: extractTokenMap(src, 'sizingTokens'),
    borderRadius: extractTokenMap(src, 'borderRadiusTokens'),
    elevation: extractTokenMap(src, 'elevationTokens'),
    zIndex: extractTokenMap(src, 'zIndexTokens'),
    components: extractTokenMap(src, 'componentTokens'),
    transitions: extractTokenMap(src, 'transitionTokens'),
    breakpoints: extractTokenMap(src, 'breakpointTokens'),
    legacyAliases: extractTokenMap(src, 'legacyTokenAliases'),
  };

  const all = {};
  for (const [cat, tokens] of Object.entries(categories)) {
    if (cat === 'legacyAliases' || cat === 'colorsDark') continue;
    Object.assign(all, tokens);
  }

  _tokensCache = { categories, all };
  _tokenFilePath = tokenPath;
  return _tokensCache;
}

/**
 * Extract a `const NAME: ... = { ... };` block from TS source.
 */
function extractTokenMap(src, varName) {
  const re = new RegExp(`export\\s+const\\s+${varName}[^=]*=\\s*\\{`, 'm');
  const match = re.exec(src);
  if (!match) return {};

  let depth = 0;
  let start = match.index + match[0].length - 1;
  let end = start;

  for (let i = start; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }

  const block = src.slice(start, end);
  const tokens = {};

  // Line-by-line parsing handles complex values with nested quotes
  const lines = block.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;

    // Match: 'key': 'value'  or  'key': "value"  (key always starts with --)
    const keyMatch = trimmed.match(/^['"](-{2}[^'"]+)['"]\s*:\s*/);
    if (!keyMatch) continue;

    const key = keyMatch[1];
    const rest = trimmed.slice(keyMatch[0].length);

    // Extract value: find the opening quote, then capture everything until
    // we find the matching closing quote followed by comma or end
    const quoteChar = rest[0];
    if (quoteChar === "'" || quoteChar === '"') {
      // Find matching close: scan for the quote char that's followed by , or end-of-content
      let valueEnd = -1;
      for (let i = 1; i < rest.length; i++) {
        if (rest[i] === quoteChar && (i + 1 >= rest.length || rest[i + 1] === ',' || rest[i + 1] === ' ' || rest[i + 1] === '\n')) {
          valueEnd = i;
          break;
        }
      }
      if (valueEnd > 0) {
        tokens[key] = rest.slice(1, valueEnd);
      }
    } else {
      // Numeric or unquoted value
      const numMatch = rest.match(/^(\d+(?:\.\d+)?)/);
      if (numMatch) {
        tokens[key] = numMatch[1];
      }
    }
  }

  return tokens;
}

/**
 * Resolve a token name to its value. Handles legacy aliases.
 */
export function resolveToken(name, theme = 'light') {
  const { categories, all } = loadTokens();

  if (theme === 'dark' && categories.colorsDark[name]) {
    return categories.colorsDark[name];
  }

  if (all[name]) return all[name];

  const alias = categories.legacyAliases[name];
  if (alias && all[alias]) return all[alias];

  return null;
}

/**
 * Get all tokens in a category.
 */
export function getCategory(categoryName) {
  const { categories } = loadTokens();
  return categories[categoryName] || {};
}

/**
 * Get a structured typography style by name (e.g. 'heading/h2', 'body/medium', 'button/large')
 */
export function getTypographyStyle(styleName) {
  const { categories } = loadTokens();
  const typo = categories.typography;
  const prefix = `--typography/${styleName}/`;

  const style = {};
  for (const [key, value] of Object.entries(typo)) {
    if (key.startsWith(prefix)) {
      const prop = key.slice(prefix.length);
      style[prop] = value;
    }
  }

  if (Object.keys(style).length === 0) return null;
  return style;
}

/**
 * Get a structured component token set (e.g. 'button', 'dialog', 'table')
 */
export function getComponentTokens(componentName) {
  const { categories } = loadTokens();
  const comp = categories.components;
  const prefix = `--component/${componentName}/`;

  const tokens = {};
  for (const [key, value] of Object.entries(comp)) {
    if (key.startsWith(prefix)) {
      const prop = key.slice(prefix.length);
      tokens[prop] = value;
    }
  }
  return tokens;
}

/**
 * Get color tokens for a semantic group (e.g. 'primary', 'error', 'text', 'background')
 */
export function getColorGroup(groupName, theme = 'light') {
  const { categories } = loadTokens();
  const base = categories.colors;
  const dark = categories.colorsDark;
  const prefix = `--colors/${groupName}/`;

  const colors = {};
  const source = theme === 'dark' ? { ...base, ...dark } : base;

  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith(prefix)) {
      const prop = key.slice(prefix.length);
      colors[prop] = value;
    }
  }
  return colors;
}

/**
 * Parse a token value that contains 'px' to a number.
 */
export function px(tokenNameOrValue) {
  const val = resolveToken(tokenNameOrValue) || tokenNameOrValue;
  if (typeof val === 'number') return val;
  const n = parseFloat(String(val));
  return isNaN(n) ? 0 : n;
}

/**
 * Convert a hex or rgba color to Figma-compatible hex.
 * For rgba with alpha < 1, blend against white background
 * to produce a visually accurate solid color.
 */
export function toHex(tokenNameOrValue) {
  const val = resolveToken(tokenNameOrValue) || tokenNameOrValue;
  if (!val) return '#000000';

  if (String(val).startsWith('#')) return val;

  // Parse rgba(r, g, b, a)
  const rgbaMatch = String(val).match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    let r = parseInt(rgbaMatch[1]);
    let g = parseInt(rgbaMatch[2]);
    let b = parseInt(rgbaMatch[3]);
    const a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;

    // Blend with white background for semi-transparent colors
    if (a < 1) {
      r = Math.round(r * a + 255 * (1 - a));
      g = Math.round(g * a + 255 * (1 - a));
      b = Math.round(b * a + 255 * (1 - a));
    }

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  return val;
}

/**
 * Extract opacity from an rgba value (0-1). Returns 1 for hex colors.
 */
export function getOpacity(tokenNameOrValue) {
  const val = resolveToken(tokenNameOrValue) || tokenNameOrValue;
  const rgbaMatch = String(val).match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\)/);
  if (rgbaMatch) return parseFloat(rgbaMatch[1]);
  return 1;
}

/**
 * Get token stats for display.
 */
export function getTokenStats() {
  const { categories, all } = loadTokens();
  const stats = { total: Object.keys(all).length, byCategory: {} };
  for (const [name, tokens] of Object.entries(categories)) {
    if (name === 'legacyAliases') {
      stats.legacyAliases = Object.keys(tokens).length;
    } else {
      stats.byCategory[name] = Object.keys(tokens).length;
    }
  }
  return stats;
}

/**
 * Search tokens by partial name match.
 */
export function searchTokens(query) {
  const { all } = loadTokens();
  const q = query.toLowerCase();
  const results = {};
  for (const [key, value] of Object.entries(all)) {
    if (key.toLowerCase().includes(q)) {
      results[key] = value;
    }
  }
  return results;
}

/**
 * Generate Figma variable creation code for a category of tokens.
 * Returns JS code string for Figma eval.
 */
export function generateFigmaVariableCode(categoryName, collectionName) {
  const tokens = getCategory(categoryName);
  if (!tokens || Object.keys(tokens).length === 0) return null;

  const colorTokenKeys = Object.keys(tokens).filter(k =>
    k.includes('color') || k.includes('Color') ||
    String(tokens[k]).startsWith('#') || String(tokens[k]).startsWith('rgba')
  );
  const floatTokenKeys = Object.keys(tokens).filter(k => !colorTokenKeys.includes(k));

  const lines = [`(async function() {`];
  lines.push(`  const collections = figma.variables.getLocalVariableCollections();`);
  lines.push(`  let col = collections.find(c => c.name === ${JSON.stringify(collectionName)});`);
  lines.push(`  if (!col) col = figma.variables.createVariableCollection(${JSON.stringify(collectionName)});`);
  lines.push(`  const colId = col.id;`);
  lines.push(`  const modeId = col.modes[0].modeId;`);
  lines.push(`  const existing = figma.variables.getLocalVariables().filter(v => v.variableCollectionId === colId);`);
  lines.push(`  const existingNames = new Set(existing.map(v => v.name));`);
  lines.push(`  let created = 0;`);

  // Helper for hex -> Figma RGB
  lines.push(`  function hexToRgb(hex) {`);
  lines.push(`    hex = hex.replace('#', '');`);
  lines.push(`    return { r: parseInt(hex.substr(0,2),16)/255, g: parseInt(hex.substr(2,2),16)/255, b: parseInt(hex.substr(4,2),16)/255 };`);
  lines.push(`  }`);
  lines.push(`  function rgbaToFigma(str) {`);
  lines.push(`    const m = str.match(/rgba?\\((\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)(?:\\s*,\\s*([\\d.]+))?\\)/);`);
  lines.push(`    if (!m) return null;`);
  lines.push(`    return { r: parseInt(m[1])/255, g: parseInt(m[2])/255, b: parseInt(m[3])/255, a: m[4] ? parseFloat(m[4]) : 1 };`);
  lines.push(`  }`);

  for (const key of colorTokenKeys) {
    const val = tokens[key];
    const varName = key.replace(/^--/, '');
    lines.push(`  if (!existingNames.has(${JSON.stringify(varName)})) {`);
    lines.push(`    try {`);
    lines.push(`      const v = figma.variables.createVariable(${JSON.stringify(varName)}, colId, 'COLOR');`);
    if (String(val).startsWith('#')) {
      lines.push(`      v.setValueForMode(modeId, hexToRgb(${JSON.stringify(val)}));`);
    } else if (String(val).startsWith('rgba')) {
      lines.push(`      const c = rgbaToFigma(${JSON.stringify(val)});`);
      lines.push(`      if (c) v.setValueForMode(modeId, { r: c.r, g: c.g, b: c.b });`);
    }
    lines.push(`      created++;`);
    lines.push(`    } catch(e) {}`);
    lines.push(`  }`);
  }

  for (const key of floatTokenKeys) {
    const val = tokens[key];
    const varName = key.replace(/^--/, '');
    const num = parseFloat(String(val));
    if (isNaN(num)) continue;
    lines.push(`  if (!existingNames.has(${JSON.stringify(varName)})) {`);
    lines.push(`    try {`);
    lines.push(`      const v = figma.variables.createVariable(${JSON.stringify(varName)}, colId, 'FLOAT');`);
    lines.push(`      v.setValueForMode(modeId, ${num});`);
    lines.push(`      created++;`);
    lines.push(`    } catch(e) {}`);
    lines.push(`  }`);
  }

  lines.push(`  return 'Created ' + created + ' variables in ' + ${JSON.stringify(collectionName)};`);
  lines.push(`})()`);
  return lines.join('\n');
}

/**
 * Generate dark mode variable code for a collection that already has light mode.
 */
export function generateDarkModeCode(collectionName) {
  const { categories } = loadTokens();
  const darkTokens = categories.colorsDark;
  if (!darkTokens || Object.keys(darkTokens).length === 0) return null;

  const lines = [`(async function() {`];
  lines.push(`  const collections = figma.variables.getLocalVariableCollections();`);
  lines.push(`  const col = collections.find(c => c.name === ${JSON.stringify(collectionName)});`);
  lines.push(`  if (!col) return 'Collection not found: ${collectionName}';`);
  lines.push(`  let darkMode = col.modes.find(m => m.name.toLowerCase().includes('dark'));`);
  lines.push(`  if (!darkMode) { col.addMode('Dark'); darkMode = col.modes.find(m => m.name.toLowerCase().includes('dark')); }`);
  lines.push(`  if (!darkMode) return 'Could not create Dark mode';`);
  lines.push(`  const modeId = darkMode.modeId;`);
  lines.push(`  const vars = figma.variables.getLocalVariables('COLOR').filter(v => v.variableCollectionId === col.id);`);
  lines.push(`  function hexToRgb(hex) { hex = hex.replace('#',''); return { r: parseInt(hex.substr(0,2),16)/255, g: parseInt(hex.substr(2,2),16)/255, b: parseInt(hex.substr(4,2),16)/255 }; }`);
  lines.push(`  function rgbaToFigma(str) { const m = str.match(/rgba?\\((\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)(?:\\s*,\\s*([\\d.]+))?\\)/); if (!m) return null; return { r: parseInt(m[1])/255, g: parseInt(m[2])/255, b: parseInt(m[3])/255 }; }`);
  lines.push(`  let updated = 0;`);

  for (const [key, val] of Object.entries(darkTokens)) {
    const varName = key.replace(/^--/, '');
    lines.push(`  { const v = vars.find(x => x.name === ${JSON.stringify(varName)});`);
    lines.push(`    if (v) {`);
    if (String(val).startsWith('#')) {
      lines.push(`      v.setValueForMode(modeId, hexToRgb(${JSON.stringify(val)})); updated++;`);
    } else if (String(val).startsWith('rgba')) {
      lines.push(`      const c = rgbaToFigma(${JSON.stringify(val)}); if (c) { v.setValueForMode(modeId, c); updated++; }`);
    }
    lines.push(`    }`);
    lines.push(`  }`);
  }

  lines.push(`  return 'Updated ' + updated + ' dark mode values in ' + ${JSON.stringify(collectionName)};`);
  lines.push(`})()`);
  return lines.join('\n');
}

export default {
  loadTokens,
  resolveToken,
  getCategory,
  getTypographyStyle,
  getComponentTokens,
  getColorGroup,
  px,
  toHex,
  getOpacity,
  getTokenStats,
  searchTokens,
  generateFigmaVariableCode,
  generateDarkModeCode,
};
