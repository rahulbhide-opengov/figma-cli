/**
 * CDS Design System Binder
 *
 * Post-creation binding engine. After a component is rendered as a visual frame
 * with hardcoded hex values, this module generates Figma eval code that:
 *
 * 1. Walks the frame tree
 * 2. Matches fills/strokes to known CDS color variables
 * 3. Binds them to Figma Variables (so they update when variables change)
 * 4. Applies Figma Text Styles to text nodes
 * 5. Can convert the frame to a Figma Component
 *
 * Source of truth: https://github.com/rahulbhide-opengov/CDS-Design-System
 */

import dsEngine from './ds-engine.js';

const { loadTokens, resolveToken, toHex } = dsEngine;

/**
 * Build a reverse map: hex color → variable name (without -- prefix).
 * Covers all CDS color tokens including primary/secondary scales,
 * grey scale, semantic colors, state colors, and component colors.
 */
export function buildReverseColorMap() {
  const { categories } = loadTokens();
  const map = {};

  const semanticPrefixes = [
    'text/', 'background/', 'primary/main', 'primary/light', 'primary/dark',
    'primary/contrast', 'secondary/main', 'secondary/light', 'secondary/dark',
    'secondary/contrast', 'error/', 'warning/', 'success/', 'info/',
    'action/', 'divider', 'border/',
  ];

  function isSemantic(varName) {
    return semanticPrefixes.some(p => varName.includes(p));
  }

  for (const catName of ['colors', 'components']) {
    const cat = categories[catName] || {};
    for (const [key, val] of Object.entries(cat)) {
      const hex = toHex(val);
      if (hex && hex.startsWith('#')) {
        const varName = key.replace(/^--/, '');
        const normalized = hex.toLowerCase();
        if (!map[normalized] || (isSemantic(varName) && !isSemantic(map[normalized]))) {
          map[normalized] = varName;
        }
      }
    }
  }

  return map;
}

/**
 * Build a typography style map: "fontSize|fontWeight" → style name.
 * Covers all CDS typography categories including headings, body, button,
 * chip, avatar, table, alert, dialog, badge, tooltip, stepper, etc.
 */
export function buildTypographyMap() {
  const { categories } = loadTokens();
  const typo = categories.typography || {};
  const styles = {};

  // Order matters: later entries override earlier ones for same fontSize|weight key.
  // Most-specific/rare styles first, most-common styles LAST so they win collisions.
  const styleGroups = [
    // Rare/specific styles first (lose collisions)
    'rating/icon',
    'slider/value-label',
    'stepper/label',
    'bottom-nav/actions', 'bottom-nav/default',
    'menu-item/default', 'menu-item/dense',
    'helper-text',
    'badge', 'tooltip',
    'avatar/large', 'avatar/medium', 'avatar/small',
    'chip/large', 'chip/medium', 'chip/small',
    'table/header', 'table/cell', 'table/footer',
    'alert/title', 'alert/description',
    'dialog/title', 'dialog/content',
    'input/label/small', 'input/label/medium', 'input/label/large',
    'input/value/small', 'input/value/medium', 'input/value/large',
    'input/helper', 'input/description',
    'caption', 'overline',
    // Common styles LAST (win collisions for same fontSize|weight)
    'subtitle/1', 'subtitle/2',
    'button/large', 'button/medium', 'button/small',
    'body/large', 'body/medium', 'body/small', 'body/extra-small',
    'display/1', 'display/2', 'display/3', 'display/4', 'display/5',
    'heading/h1', 'heading/h2', 'heading/h3', 'heading/h4', 'heading/h5', 'heading/h6',
  ];

  for (const styleName of styleGroups) {
    const sizeKey = `--typography/${styleName}/font-size`;
    const weightKey = `--typography/${styleName}/font-weight`;
    const lineHeightKey = `--typography/${styleName}/line-height`;

    const size = typo[sizeKey];
    const weight = typo[weightKey];
    if (size && weight) {
      const key = `${parseInt(size)}|${weight}`;
      styles[key] = {
        name: `CDS/${styleName}`,
        fontSize: parseInt(size),
        fontWeight: weight,
        lineHeight: lineHeightKey && typo[lineHeightKey] ? parseFloat(typo[lineHeightKey]) : null,
        fontFamily: 'DM Sans',
      };
    }
  }

  return styles;
}

/**
 * Generate Figma eval code that creates all CDS Text Styles.
 */
export function generateTextStylesCode() {
  const typoMap = buildTypographyMap();
  const lines = [`(async function() {`];
  lines.push(`  const existing = figma.getLocalTextStyles();`);
  lines.push(`  const existingNames = new Set(existing.map(s => s.name));`);
  lines.push(`  let created = 0;`);

  for (const [, style] of Object.entries(typoMap)) {
    const w = parseInt(style.fontWeight);
    const fontStyle = w >= 700 ? 'Bold' : w >= 600 ? 'SemiBold' : w >= 500 ? 'Medium' : 'Regular';

    lines.push(`  if (!existingNames.has(${JSON.stringify(style.name)})) {`);
    lines.push(`    try {`);
    lines.push(`      await figma.loadFontAsync({ family: 'DM Sans', style: ${JSON.stringify(fontStyle)} });`);
    lines.push(`      const s = figma.createTextStyle();`);
    lines.push(`      s.name = ${JSON.stringify(style.name)};`);
    lines.push(`      s.fontName = { family: 'DM Sans', style: ${JSON.stringify(fontStyle)} };`);
    lines.push(`      s.fontSize = ${style.fontSize};`);
    if (style.lineHeight && style.lineHeight > 4) {
      lines.push(`      s.lineHeight = { value: ${Math.round(style.lineHeight)}, unit: 'PIXELS' };`);
    }
    lines.push(`      created++;`);
    lines.push(`    } catch(e) {}`);
    lines.push(`  }`);
  }

  lines.push(`  return 'Created ' + created + ' CDS text styles';`);
  lines.push(`})()`);
  return lines.join('\n');
}

/**
 * Generate Figma eval code that binds all fills/strokes in a frame tree
 * to their matching CDS Figma Variables, and applies Text Styles.
 */
export function generateBindingCode(frameName) {
  const reverseMap = buildReverseColorMap();
  const typoMap = buildTypographyMap();

  const lines = [`(async function() {`];

  lines.push(`  const target = figma.currentPage.children`);
  lines.push(`    .filter(n => n.name === ${JSON.stringify(frameName)} || n.name.startsWith(${JSON.stringify(frameName + '/')}))`);
  lines.push(`    .pop();`);
  lines.push(`  if (!target) return 'Frame not found: ${frameName}';`);

  lines.push(`  const allVars = figma.variables.getLocalVariables('COLOR');`);
  lines.push(`  const floatVars = figma.variables.getLocalVariables('FLOAT');`);
  lines.push(`  const textStyles = figma.getLocalTextStyles();`);

  lines.push(`  function findVar(name) { return allVars.find(v => v.name === name); }`);
  lines.push(`  function findFloatVar(name) { return floatVars.find(v => v.name === name); }`);
  lines.push(`  function findTextStyle(name) { return textStyles.find(s => s.name === name); }`);

  lines.push(`  const colorMap = ${JSON.stringify(reverseMap)};`);
  lines.push(`  const typoMap = ${JSON.stringify(typoMap)};`);

  lines.push(`  function rgbToHex(c) {`);
  lines.push(`    if (!c) return '';`);
  lines.push(`    const r = Math.round((c.r || 0) * 255);`);
  lines.push(`    const g = Math.round((c.g || 0) * 255);`);
  lines.push(`    const b = Math.round((c.b || 0) * 255);`);
  lines.push(`    return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');`);
  lines.push(`  }`);

  lines.push(`  let boundColors = 0, boundStrokes = 0, boundText = 0, boundRadius = 0;`);
  lines.push(`  function walkAndBind(node) {`);

  // Bind fills
  lines.push(`    if (node.fills && Array.isArray(node.fills) && node.fills.length > 0) {`);
  lines.push(`      const fill = node.fills[0];`);
  lines.push(`      if (fill.type === 'SOLID' && fill.color) {`);
  lines.push(`        const hex = rgbToHex(fill.color).toLowerCase();`);
  lines.push(`        const varName = colorMap[hex];`);
  lines.push(`        if (varName) {`);
  lines.push(`          const v = findVar(varName);`);
  lines.push(`          if (v) {`);
  lines.push(`            try { const nf = figma.variables.setBoundVariableForPaint(fill, 'color', v); node.fills = [nf]; boundColors++; } catch(e) {}`);
  lines.push(`          }`);
  lines.push(`        }`);
  lines.push(`      }`);
  lines.push(`    }`);

  // Bind strokes
  lines.push(`    if (node.strokes && Array.isArray(node.strokes) && node.strokes.length > 0) {`);
  lines.push(`      const stroke = node.strokes[0];`);
  lines.push(`      if (stroke.type === 'SOLID' && stroke.color) {`);
  lines.push(`        const hex = rgbToHex(stroke.color).toLowerCase();`);
  lines.push(`        const varName = colorMap[hex];`);
  lines.push(`        if (varName) {`);
  lines.push(`          const v = findVar(varName);`);
  lines.push(`          if (v) {`);
  lines.push(`            try { const ns = figma.variables.setBoundVariableForPaint(stroke, 'color', v); node.strokes = [ns]; boundStrokes++; } catch(e) {}`);
  lines.push(`          }`);
  lines.push(`        }`);
  lines.push(`      }`);
  lines.push(`    }`);

  // Bind corner radius
  lines.push(`    if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {`);
  lines.push(`      const rVarNames = [`);
  lines.push(`        'border-radius/extra-small', 'border-radius/small', 'border-radius/medium',`);
  lines.push(`        'border-radius/large', 'border-radius/button', 'border-radius/input',`);
  lines.push(`        'border-radius/card', 'border-radius/chip', 'border-radius/dialog'`);
  lines.push(`      ];`);
  lines.push(`      for (const rn of rVarNames) {`);
  lines.push(`        const fv = findFloatVar(rn);`);
  lines.push(`        if (fv) {`);
  lines.push(`          try {`);
  lines.push(`            const val = Object.values(fv.valuesByMode)[0];`);
  lines.push(`            if (val === node.cornerRadius) {`);
  lines.push(`              node.setBoundVariable('cornerRadius', fv);`);
  lines.push(`              boundRadius++;`);
  lines.push(`              break;`);
  lines.push(`            }`);
  lines.push(`          } catch(e) {}`);
  lines.push(`        }`);
  lines.push(`      }`);
  lines.push(`    }`);

  // Apply text styles
  lines.push(`    if (node.type === 'TEXT') {`);
  lines.push(`      const key = node.fontSize + '|' + (node.fontWeight || (node.fontName ? (node.fontName.style === 'Bold' ? '700' : node.fontName.style === 'SemiBold' ? '600' : node.fontName.style === 'Medium' ? '500' : '400') : '400'));`);
  lines.push(`      const match = typoMap[key];`);
  lines.push(`      if (match) {`);
  lines.push(`        const ts = findTextStyle(match.name);`);
  lines.push(`        if (ts) {`);
  lines.push(`          try { node.textStyleId = ts.id; boundText++; } catch(e) {}`);
  lines.push(`        }`);
  lines.push(`      }`);

  // Bind text fills
  lines.push(`      if (node.fills && Array.isArray(node.fills) && node.fills.length > 0) {`);
  lines.push(`        const fill = node.fills[0];`);
  lines.push(`        if (fill.type === 'SOLID' && fill.color) {`);
  lines.push(`          const hex = rgbToHex(fill.color).toLowerCase();`);
  lines.push(`          const varName = colorMap[hex];`);
  lines.push(`          if (varName) {`);
  lines.push(`            const v = findVar(varName);`);
  lines.push(`            if (v) {`);
  lines.push(`              try { const nf = figma.variables.setBoundVariableForPaint(fill, 'color', v); node.fills = [nf]; boundColors++; } catch(e) {}`);
  lines.push(`            }`);
  lines.push(`          }`);
  lines.push(`        }`);
  lines.push(`      }`);
  lines.push(`    }`);

  // Recurse
  lines.push(`    if ('children' in node) {`);
  lines.push(`      for (const child of node.children) { walkAndBind(child); }`);
  lines.push(`    }`);
  lines.push(`  }`);

  lines.push(`  walkAndBind(target);`);
  lines.push(`  return 'Bound: ' + boundColors + ' fills, ' + boundStrokes + ' strokes, ' + boundRadius + ' radii, ' + boundText + ' text styles';`);
  lines.push(`})()`);

  return lines.join('\n');
}

/**
 * Generate code to convert a frame into a Figma Component.
 */
export function generateComponentConversionCode(frameName) {
  const lines = [`(function() {`];
  lines.push(`  const frame = figma.currentPage.children`);
  lines.push(`    .filter(n => n.name === ${JSON.stringify(frameName)} || n.name.startsWith(${JSON.stringify(frameName + '/')}))`);
  lines.push(`    .pop();`);
  lines.push(`  if (!frame || frame.type !== 'FRAME') return 'Frame not found: ${frameName}';`);
  lines.push(`  const component = figma.createComponentFromNode(frame);`);
  lines.push(`  return 'Converted to component: ' + component.name + ' (id: ' + component.id + ')';`);
  lines.push(`})()`);
  return lines.join('\n');
}

/**
 * Generate the full setup code: push variables + create text styles.
 * Returns an array of { label, code } objects to run in sequence.
 */
export function generateFullSetupSteps() {
  const steps = dsEngine.generateFullVariablePushCode();
  steps.push({ label: 'Creating CDS text styles', code: generateTextStylesCode() });
  return steps;
}

export default {
  buildReverseColorMap,
  buildTypographyMap,
  generateTextStylesCode,
  generateBindingCode,
  generateComponentConversionCode,
  generateFullSetupSteps,
};
