# figma-ds-cli

CLI for managing Figma design systems via Chrome DevTools Protocol.

## Quick Start

```bash
# Run commands from this directory
node src/index.js eval "figma.currentPage.name"
node src/index.js raw query "//FRAME"
```

## Documentation

- `docs/ARCHITECTURE.md` - How it works (CDP, figma-use, Plugin API)
- `docs/COMMANDS.md` - All available commands
- `docs/TECHNIQUES.md` - Advanced patterns (variable modes, scaling, batch ops)
- `docs/CLAUDE-SESSION.md` - Quick reference for Claude sessions

## Key Techniques

### Variable Mode Switching (Library Variables)

Access collection through `boundVariables` on nodes, not `getLocalVariableCollections()`:

```javascript
const variable = figma.variables.getVariableById(binding.id);
const col = figma.variables.getVariableCollectionById(variable.variableCollectionId);
node.setExplicitVariableModeForCollection(col, mode.modeId);
```

### Scaling

Use `rescale()` not `resize()` to avoid breaking layers:

```javascript
node.rescale(1.2);
node.x = (frameW - node.width) / 2;  // center
node.y = (frameH - node.height) / 2;
```

## npm

- Package: `figma-ds-cli`
- Version: 1.1.0
- Publish: `npm publish --otp=CODE`
