# figma-ds-cli

CLI that controls Figma Desktop directly. No API key needed.

## Setup

Figma must be running. Then:
```bash
node src/index.js connect
```

## What Users Might Ask → Commands

### Canvas Awareness (Smart Positioning)

"Show what's on canvas"
```bash
node src/index.js canvas info
```

"Get next free position"
```bash
node src/index.js canvas next           # Returns { x, y } for next free spot
node src/index.js canvas next -d below  # Position below existing content
```

**Smart Positioning**: All `create` commands auto-position to avoid overlaps when no `-x` is specified.

### Variable Binding

"Bind color variable to fill"
```bash
node src/index.js bind fill "primary/500"
node src/index.js bind fill "background/default" -n "1:234"
```

"Bind variable to stroke, radius, gap, padding"
```bash
node src/index.js bind stroke "border/default"
node src/index.js bind radius "radius/md"
node src/index.js bind gap "spacing/md"
node src/index.js bind padding "spacing/lg"
```

"List available variables"
```bash
node src/index.js bind list
node src/index.js bind list -t COLOR
node src/index.js bind list -t FLOAT
```

### Sizing Control (Auto-Layout)

"Hug contents"
```bash
node src/index.js sizing hug
node src/index.js sizing hug -a h    # Horizontal only
```

"Fill container"
```bash
node src/index.js sizing fill
node src/index.js sizing fill -a v   # Vertical only
```

"Fixed size"
```bash
node src/index.js sizing fixed 320 200
```

### Layout Shortcuts

"Set padding"
```bash
node src/index.js padding 16              # All sides
node src/index.js padding 16 24           # Vertical, horizontal
node src/index.js padding 16 24 16 24     # Top, right, bottom, left
```

"Set gap"
```bash
node src/index.js gap 16
```

"Align items"
```bash
node src/index.js align center
node src/index.js align start
node src/index.js align stretch
```

### Quick Primitives (Fast Design)

**All create commands auto-position to avoid overlaps** when no `-x` is specified.

"Create a rectangle"
```bash
node src/index.js create rect "Card" -w 320 -h 200 --fill "#ffffff" --radius 12
```

"Create a circle"
```bash
node src/index.js create circle "Avatar" -w 48 --fill "#3b82f6"
```

"Add text"
```bash
node src/index.js create text "Hello World" -s 24 -c "#000000" -w bold
```

"Create a line"
```bash
node src/index.js create line -l 200 -c "#e4e4e7"
```

"Create an auto-layout frame"
```bash
node src/index.js create autolayout "Card" -d col -g 16 -p 24 --fill "#ffffff" --radius 12
```

"Create an icon"
```bash
node src/index.js create icon lucide:star -s 24 -c "#f59e0b"
```

"Group selection"
```bash
node src/index.js create group "Header"
```

"Make selection a component"
```bash
node src/index.js create component "Button"
```

### Modify Elements

"Change fill color"
```bash
node src/index.js set fill "#3b82f6"           # On selection
node src/index.js set fill "#3b82f6" -n "1:234" # On specific node
```

"Add stroke"
```bash
node src/index.js set stroke "#e4e4e7" -w 1
```

"Change corner radius"
```bash
node src/index.js set radius 12
```

"Resize element"
```bash
node src/index.js set size 320 200
```

"Move element"
```bash
node src/index.js set pos 100 100
```

"Set opacity"
```bash
node src/index.js set opacity 0.5
```

"Apply auto-layout to frame"
```bash
node src/index.js set autolayout row -g 8 -p 16
```

"Rename node"
```bash
node src/index.js set name "Header"
```

### Select, Find & Inspect

"Select a node"
```bash
node src/index.js select "1:234"
```

"Find nodes by name"
```bash
node src/index.js find "Button"
node src/index.js find "Card" -t FRAME
```

"Get node properties"
```bash
node src/index.js get              # Selection
node src/index.js get "1:234"      # Specific node
```

### Duplicate & Delete

"Duplicate selection"
```bash
node src/index.js duplicate
node src/index.js dup "1:234" --offset 50
```

"Delete selection"
```bash
node src/index.js delete
node src/index.js delete "1:234"
```

### Arrange

"Arrange all frames"
```bash
node src/index.js arrange -g 100          # Single row
node src/index.js arrange -g 100 -c 3     # 3 columns
```

### Design Tokens & Variables

"Create a design system"
```bash
node src/index.js tokens ds
```

"Add Tailwind colors"
```bash
node src/index.js tokens tailwind
```

"Create spacing tokens"
```bash
node src/index.js tokens spacing
```

"Show all variables"
```bash
node src/index.js var list
```

"Create a color variable"
```bash
node src/index.js var create "primary/500" -c "CollectionId" -t COLOR -v "#3b82f6"
```

### FigJam

"List FigJam pages"
```bash
node src/index.js fj list
```

"Add a sticky note"
```bash
node src/index.js fj sticky "Text here" -x 100 -y 100
```

"Add a sticky with color"
```bash
node src/index.js fj sticky "Note" -x 100 -y 100 --color "#FEF08A"
```

"Create a shape"
```bash
node src/index.js fj shape "Label" -x 200 -y 100 -w 200 -h 100
```

"Connect two elements"
```bash
node src/index.js fj connect "NODE_ID_1" "NODE_ID_2"
```

"Show elements on page"
```bash
node src/index.js fj nodes
```

"Delete an element"
```bash
node src/index.js fj delete "NODE_ID"
```

"Run JavaScript in FigJam"
```bash
node src/index.js fj eval "figma.currentPage.children.length"
```

### Figma Design

"Create a frame"
```bash
node src/index.js create frame "Card" -w 320 -h 200 --fill "#ffffff" --radius 12
```

"Add an icon"
```bash
node src/index.js create icon lucide:star -s 24 -c "#f59e0b"
node src/index.js create icon mdi:home -s 32
```

"Find all frames"
```bash
node src/index.js raw query "//FRAME"
```

"Find all components"
```bash
node src/index.js raw query "//COMPONENT"
```

"Find nodes named Button"
```bash
node src/index.js raw query "//*[contains(@name, 'Button')]"
```

"Select a node"
```bash
node src/index.js raw select "1:234"
```

"Export a node as PNG"
```bash
node src/index.js raw export "1:234" --scale 2
```

"Run JavaScript in Figma"
```bash
node src/index.js eval "figma.currentPage.name"
```

### Export

"Export variables as CSS"
```bash
node src/index.js export css
```

"Export as Tailwind config"
```bash
node src/index.js export tailwind
```

"Take a screenshot"
```bash
node src/index.js export screenshot -o screenshot.png
```

## Advanced: Custom JavaScript

For complex operations, use `eval` with Figma Plugin API:

"Scale content and center it"
```bash
node src/index.js eval "
const node = figma.getNodeById('1:234');
node.rescale(1.2);
const frame = node.parent;
node.x = (frame.width - node.width) / 2;
node.y = (frame.height - node.height) / 2;
"
```

"Switch to dark mode" (for library variables)
```bash
node src/index.js eval "
const node = figma.getNodeById('1:234');

function findModeCollection(n) {
  if (n.boundVariables) {
    for (const [prop, binding] of Object.entries(n.boundVariables)) {
      const b = Array.isArray(binding) ? binding[0] : binding;
      if (b && b.id) {
        const variable = figma.variables.getVariableById(b.id);
        if (variable) {
          const col = figma.variables.getVariableCollectionById(variable.variableCollectionId);
          if (col && col.modes.length > 1) return { col, modes: col.modes };
        }
      }
    }
  }
  if (n.children) {
    for (const c of n.children) {
      const found = findModeCollection(c);
      if (found) return found;
    }
  }
  return null;
}

const found = findModeCollection(node);
if (found) {
  const darkMode = found.modes.find(m => m.name.includes('Dark'));
  if (darkMode) node.setExplicitVariableModeForCollection(found.col, darkMode.modeId);
}
"
```

"Rename all frames"
```bash
node src/index.js eval "
figma.currentPage.children
  .filter(n => n.type === 'FRAME')
  .forEach((f, i) => f.name = 'Screen-' + (i + 1));
"
```

## FigJam Advanced: Sections and Layouts

"Create a section in FigJam"
```bash
node src/index.js fj eval "
(async function() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  const section = figma.createSection();
  section.name = 'My Section';
  section.x = 0;
  section.y = 0;
  section.resizeWithoutConstraints(2000, 1000);
  section.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
})()
"
```

## Key Things to Know

1. **Always run from this directory** (where package.json is)

2. **Node IDs** look like `1:234` or `2:30`. Get them from query output or `fj nodes`.

3. **Use rescale() not resize()** when scaling, to avoid breaking layers.

4. **Library variables** cannot be accessed via `getLocalVariableCollections()`. Find them through `boundVariables` on nodes.

5. **FigJam eval needs IIFE** for async or to avoid variable conflicts:
   ```javascript
   (async function() { ... })()
   ```

6. **Font loading in FigJam** is required before setting text:
   ```javascript
   await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
   ```

## Creating Designs Best Practices

### WICHTIG: Elemente INNERHALB von Frames erstellen

Wenn der User "erstelle ein Design" sagt:
1. **Erstelle einen Frame** mit Auto-Layout als Container
2. **Alle Elemente INNERHALB** des Frames mit `frame.appendChild(element)`
3. **Nie lose Elemente** direkt auf dem Canvas

```javascript
// RICHTIG: Elemente innerhalb eines Frames
const frame = figma.createFrame();
frame.layoutMode = 'VERTICAL';
frame.itemSpacing = 16;
frame.paddingTop = 24;
// ...

const title = figma.createText();
title.characters = 'Title';
frame.appendChild(title);  // INNERHALB des Frames

const body = figma.createText();
body.characters = 'Body';
frame.appendChild(body);   // INNERHALB des Frames
```

### Zwei Ebenen der Positionierung

1. **Frames auf Canvas** → Smart Positioning (nebeneinander, nie überlappend)
2. **Elemente in Frame** → appendChild + Auto-Layout

```javascript
// Mehrere Cards nebeneinander auf Canvas
for (const cardData of cards) {
  // Smart position für jeden Frame
  let smartX = 0;
  figma.currentPage.children.forEach(n => {
    smartX = Math.max(smartX, n.x + n.width);
  });
  smartX += 40; // Gap zwischen Frames

  const card = figma.createFrame();
  card.x = smartX;
  card.layoutMode = 'VERTICAL';

  // Elemente INNERHALB der Card
  const title = figma.createText();
  card.appendChild(title);
}
```

### Weitere Best Practices

1. **Always check available variables and components first** before creating designs:
   ```bash
   node src/index.js var list                    # List all variables
   node src/index.js col list                    # List variable collections
   node src/index.js eval 'figma.root.children.map(p => p.name)'  # List pages
   ```
   Then explore component pages to find reusable components.

2. **Use existing components** (Avatar, Button, Calendar, etc.) instead of building from scratch.

3. **Bind variables** for colors, spacing, and border radius to maintain design system consistency.

4. **Place new frames on canvas without overlapping** existing designs:
   ```javascript
   // Get rightmost position of existing frames
   const frames = figma.currentPage.children.filter(n => n.type === "FRAME");
   let maxX = 0;
   frames.forEach(f => { maxX = Math.max(maxX, f.x + f.width); });

   // Position new frame with 100px gap
   newFrame.x = maxX + 100;
   newFrame.y = 0;
   ```

5. **Reposition overlapping frames** if needed:
   ```javascript
   const frames = figma.currentPage.children.filter(n => n.name.includes("MyDesign"));
   let currentX = 0;
   frames.forEach(f => {
     f.x = currentX;
     f.y = 0;
     currentX += f.width + 100;  // 100px gap
   });
   ```

## Shape Types (FigJam)

ROUNDED_RECTANGLE, RECTANGLE, ELLIPSE, DIAMOND, TRIANGLE_UP, TRIANGLE_DOWN, PARALLELOGRAM_RIGHT, PARALLELOGRAM_LEFT

## Query Syntax (XPath-like)

- `//FRAME` - all frames
- `//COMPONENT` - all components
- `//*[@name='Card']` - by exact name
- `//*[@name^='Button']` - name starts with
- `//*[contains(@name, 'Icon')]` - name contains
