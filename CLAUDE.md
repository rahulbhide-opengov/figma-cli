# figma-ds-cli

CLI that controls Figma Desktop directly. No API key needed.

## IMPORTANT: Fresh Mac Setup

If `node` command is not found, install Node.js first:

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH (Apple Silicon Macs)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/opt/homebrew/bin/brew shellenv)"

# Install Node.js
brew install node

# Verify
node -v
```

Then run the CLI:
```bash
node src/index.js connect
```

## IMPORTANT: macOS Full Disk Access

If you see "permission" or "EPERM" error, Terminal needs Full Disk Access:

1. Open **System Settings**
2. Go to **Privacy & Security → Full Disk Access**
3. Click **+** and add **Terminal** (or iTerm/VS Code)
4. Quit Terminal completely (Cmd+Q)
5. Reopen Terminal and try again

## IMPORTANT: Website Recreation Workflow

When user asks to "recreate", "rebuild", "copy", or "clone" a website:

### One-Command Recreation (RECOMMENDED)
```bash
node src/index.js recreate-url "https://example.com" --name "My Page"
```

This does everything automatically:
1. Analyzes the page with Playwright (1440px desktop viewport)
2. Extracts exact CSS values (colors, fonts, sizes, positions)
3. Generates Figma code
4. Creates the page in Figma (~4-5 seconds total)

**Options:**
- `-w, --width <n>` - Viewport width (default: 1440)
- `-h, --height <n>` - Viewport height (default: 900)
- `--name <name>` - Frame name (default: "Recreated Page")

**Examples:**
```bash
# Desktop (default 1440px)
node src/index.js recreate-url "https://notion.so/login" --name "Notion Login"

# Mobile
node src/index.js recreate-url "https://notion.so/login" -w 375 -h 812 --name "Notion Mobile"
```

### Manual Analysis Only
If you need just the data without creating in Figma:
```bash
node src/index.js analyze-url "https://example.com/page" --screenshot
```

Returns JSON with all elements:
```json
{
  "bodyBg": "#fffefc",
  "elements": [
    { "type": "heading", "text": "Title", "fontSize": 22, "fontWeight": 600, "color": "#040404", "x": 560, "y": 146 },
    { "type": "button", "text": "Continue", "w": 360, "h": 40, "bgColor": "#2383e2", "borderRadius": 8 }
  ]
}
```

### Alternative: Screenshot Only
If Playwright fails, use capture-website-cli:
```bash
npx --yes capture-website-cli "https://example.com" --output=/tmp/site.png --width=1440 --height=900
```
Then `Read /tmp/site.png` to view and analyze visually.

## After Setup: Show Designer-Friendly Examples

When setup is complete, show these natural language examples (NOT CLI commands):

```
Ready! Try asking:

"Create a blue rectangle"
"Add Tailwind colors to my file"
"Create a card with title and description"
"Show me what's on the canvas"
"Find all frames named Button"
```

IMPORTANT: Never show `node src/index.js` commands to designers. They just type natural language and you execute the right commands.

## Setup

Figma must be running. Then:
```bash
node src/index.js connect
```

## Speed Daemon (Auto-Start)

The `connect` command automatically starts a background daemon that keeps the WebSocket connection open. This makes all subsequent commands ~10x faster.

```bash
node src/index.js connect
# Output:
# ✓ Figma started
# ✓ Connected to Figma
# ✓ Speed daemon running (commands are now 10x faster)
```

**Manual daemon control (if needed):**
```bash
node src/index.js daemon status   # Check if running
node src/index.js daemon restart  # Restart if issues
node src/index.js daemon stop     # Stop daemon
```

## Key Learnings

1. **ALWAYS use `render` for creating frames** - It has smart positioning (no overlaps) and handles fonts correctly
2. **NEVER use `eval` to create visual elements** - No smart positioning, elements will overlap at (0,0)
3. **Use `eval` ONLY for**: Variable bindings, deletions, moves, property changes on existing nodes
4. **Use `npx figma-use` directly** - Faster than wrapper commands, especially with daemon
5. **Write scripts to `/tmp/`** - Run with `npx figma-use eval "$(cat /tmp/script.js)"`
6. **Convert frames with `node to-component`** - `npx figma-use node to-component "id1 id2 id3"`
7. **Always verify with `node tree`** - Check all children are present after creation

## CRITICAL: Smart Positioning

The `render` command automatically positions new frames to the RIGHT of existing content (100px gap).

```bash
# CORRECT - uses smart positioning
node src/index.js render '<Frame name="Card" w={300} h={200} bg="#fff" p={24}><Text>Hello</Text></Frame>'

# WRONG - will overlap at (0,0)
node src/index.js eval "const f = figma.createFrame(); f.name = 'Card';"
```

## CRITICAL: Multiple Frames = Use render-batch

**NEVER call render multiple times in a loop** - each call spawns a new process (slow).

For multiple frames, use `render-batch` with a JSON array:
```bash
node src/index.js render-batch '[
  "<Frame name=\"Card 1\" w={300} h={200} bg=\"#fff\" p={24}><Text>Card 1</Text></Frame>",
  "<Frame name=\"Card 2\" w={300} h={200} bg=\"#fff\" p={24}><Text>Card 2</Text></Frame>",
  "<Frame name=\"Card 3\" w={300} h={200} bg=\"#fff\" p={24}><Text>Card 3</Text></Frame>"
]'
```

This creates all frames in ONE process with ONE connection = much faster.

If you MUST use eval to create elements, ALWAYS include smart positioning code:
```javascript
// Get next free X position FIRST
let smartX = 0;
figma.currentPage.children.forEach(n => { smartX = Math.max(smartX, n.x + n.width); });
smartX += 100;

// Then create element at smartX
const frame = figma.createFrame();
frame.x = smartX;
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

"Add an image from URL"
```bash
node src/index.js create image "https://example.com/photo.png"
node src/index.js create image "https://example.com/photo.png" -w 200  # Scale to width
node src/index.js create image "https://example.com/photo.png" -w 200 -h 200  # Fixed size
```

"Screenshot a website and import as reference"
```bash
node src/index.js screenshot-url "https://notion.com/login"
node src/index.js screenshot-url "https://example.com" --full  # Full page
node src/index.js screenshot-url "https://example.com" -w 1920 -h 1080  # Custom size
```
Use this when user asks to "recreate" or "rebuild" a website. Screenshot first, then use as visual reference.

"Remove background from image" (select image in Figma first)
```bash
node src/index.js remove-bg
```
Note: Requires remove.bg API key (free, 50 images/month). Get one at https://www.remove.bg/api
Then save it: `node src/index.js config set removebgApiKey YOUR_KEY`

"Group selection"
```bash
node src/index.js create group "Header"
```

"Make selection a component"
```bash
node src/index.js create component "Button"
```

"Render a card with JSX (RECOMMENDED for complex designs)"
```bash
node src/index.js render '<Frame name="Card" w={320} h={180} bg="#fff" rounded={16} flex="col" gap={8} p={24}>
  <Text size={20} weight="bold" color="#111">Title</Text>
  <Text size={14} color="#666" w="fill">Description</Text>
</Frame>'
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

"Add Tailwind/shadcn primitive colors" (slate, gray, blue, red, etc. with 50-950 shades)
```bash
node src/index.js tokens tailwind
```

**Note:** This creates 22 color families (slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose) with 11 shades each (50-950). These are the Tailwind CSS colors that shadcn/ui is built on. NOT the shadcn/ui semantic colors (background, foreground, card, etc.).

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

### "Create shadcn colors" or "Create Tailwind colors"

When users ask for "shadcn colors" or "Tailwind colors", they usually mean the **primitive color palette** (22 color families with 50-950 shades), NOT the shadcn/ui semantic colors (background, foreground, etc.).

```bash
# Create Tailwind/shadcn primitive colors (242 variables)
node src/index.js tokens tailwind
```

This creates: slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose (each with 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950).

### Visualize Color Palette on Canvas

Create color swatches bound to variables for any color system:

**Step 1: Create color palette frames with render**
```bash
# Create a row of color swatches for one color family
node src/index.js render '<Frame name="blue" flex="row" x={0} y={0}>
  <Frame name="50" w={80} h={60} bg="#eff6ff" />
  <Frame name="100" w={80} h={60} bg="#dbeafe" />
  <Frame name="500" w={80} h={60} bg="#3b82f6" />
  <Frame name="900" w={80} h={60} bg="#1e3a8a" />
</Frame>'
```

**Step 2: Bind swatches to variables**
```javascript
// Save as /tmp/bind-palette.js, then run: npx figma-use eval "$(cat /tmp/bind-palette.js)"
const colors = [
  { name: 'blue', frameId: '2:123' },  // Replace with actual frame IDs
  { name: 'red', frameId: '2:456' }
];
const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

const allVars = figma.variables.getLocalVariables('COLOR');
colors.forEach(color => {
  const parentFrame = figma.getNodeById(color.frameId);
  if (!parentFrame) return;
  parentFrame.children.forEach((swatch, i) => {
    const varName = color.name + '/' + shades[i];
    const variable = allVars.find(v => v.name === varName);
    if (variable && swatch.type === 'FRAME') {
      swatch.fills = [figma.variables.setBoundVariableForPaint(
        { type: 'SOLID', color: { r: 1, g: 1, b: 1 } }, 'color', variable
      )];
    }
  });
});
```

**Step 3: Verify bindings**
```bash
npx figma-use node bindings "2:123"  # Check if fills show $blue/50
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

"Run JavaScript from file" (RECOMMENDED for complex scripts)
```bash
# Write script to temp file, then run
node src/index.js run /tmp/my-script.js

# Or use --file option
node src/index.js eval --file /tmp/my-script.js
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

5. **Avoid stray elements**: Always use `render` command for frames with text. Using `eval` with async functions can create elements outside their parent frames. Clean up with:
   ```bash
   npx figma-use arrange --mode column --gap 20  # See what's on page
   npx figma-use node delete "2:123"             # Delete stray nodes
   ```

6. **FigJam eval needs IIFE** for async or to avoid variable conflicts:
   ```javascript
   (async function() { ... })()
   ```

6. **Font loading in FigJam** is required before setting text:
   ```javascript
   await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
   ```

## Creating Designs Best Practices

### IMPORTANT: Use `render` Command for Complex Designs

When creating frames with text inside, **always use the `render` command** instead of `eval`:

```bash
# CORRECT: Use render with JSX syntax
node src/index.js render '<Frame name="Card" w={320} h={180} bg="#fff" rounded={16} flex="col" gap={8} p={24}>
  <Text size={12} weight="medium" color="#1e3a8a">Tag</Text>
  <Text size={20} weight="bold" color="#1e3a8a">Title</Text>
  <Text size={14} color="#64748b" w="fill">Description text here</Text>
</Frame>'
```

**Why?** The `eval` command with async functions has issues with font loading and appendChild timing. The `render` command handles fonts and nesting correctly.

### Render Command Reference

**Supported JSX Elements:**
- `<Frame>` - Auto-layout frame (container)
- `<Text>` - Text with content
- `<Rectangle>` / `<Rect>` - Rectangle shape
- `<Image>` - Image placeholder
- `<Icon>` - Icon placeholder
- `<Instance>` - Component instance

```bash
# Frame with auto-layout
<Frame name="Name" w={320} h={180} bg="#color" rounded={16} flex="col" gap={8} p={24}>

# Text with fill width (prevents overflow)
<Text size={14} color="#color" w="fill">Content</Text>

# Rectangle
<Rectangle w={100} h={100} bg="#e4e4e7" rounded={8} />

# Component Instance (by ID or name)
<Instance component="2:28" />
<Instance name="Card - Basic" />

# Position on canvas
<Frame x={1000} y={0} ...>
```

### Using Component Instances

Create a gallery with existing components:
```bash
node src/index.js render '<Frame name="Card Gallery" w={1200} h={400} bg="#f4f4f5" flex="row" gap={24} p={40}>
  <Instance name="Card - Basic" />
  <Instance name="Card - CTA" />
  <Instance name="Card - Image" />
</Frame>'
```

Or by component ID:
```bash
node src/index.js render '<Frame name="Cards" flex="row" gap={24}>
  <Instance component="2:28" />
  <Instance component="2:29" />
</Frame>'
```

### IMPORTANT: Create Elements INSIDE Frames

When user says "create a design":
1. **Use the `render` command** - it has smart positioning built-in
2. **All elements INSIDE** the frame automatically with JSX nesting
3. **Never loose elements** directly on canvas

```bash
# ALWAYS USE RENDER - has smart positioning, no overlaps
node src/index.js render '<Frame name="Card" w={300} h={200} bg="#fff" rounded={16} flex="col" gap={12} p={24}>
  <Text size={16} weight="bold">Title</Text>
  <Text size={14} color="#666" w="fill">Body text that might be longer</Text>
</Frame>'
```

**DO NOT use eval to create frames** - they will overlap at (0,0).

### Auto-Layout Text Settings (CRITICAL)

Text layers that should NOT overflow the frame:
```javascript
text.layoutSizingHorizontal = 'FILL';  // Text fills container width
text.textAutoResize = 'HEIGHT';        // Height grows with content (wrapping)
```

Without these settings, text will overflow frame boundaries!

### Two Levels of Positioning

1. **Frames on Canvas** → Smart Positioning (side by side, never overlapping)
2. **Elements in Frame** → appendChild + Auto-Layout

### Complete Card Example with Variables

```javascript
(async function() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

  // Get variables
  const cardBg = figma.variables.getVariableById('VariableID:1:5');
  const cardFg = figma.variables.getVariableById('VariableID:1:6');
  const mutedFg = figma.variables.getVariableById('VariableID:1:14');
  const border = figma.variables.getVariableById('VariableID:1:19');
  const col = figma.variables.getVariableCollectionById('VariableCollectionId:1:2');

  // Smart Position
  let smartX = 0;
  figma.currentPage.children.forEach(n => {
    smartX = Math.max(smartX, n.x + n.width);
  });
  smartX += 40;

  // Card Frame with Auto-Layout
  const card = figma.createFrame();
  card.name = 'Card';
  card.x = smartX;
  card.y = 0;
  card.resize(300, 200);
  card.cornerRadius = 16;
  card.layoutMode = 'VERTICAL';
  card.primaryAxisSizingMode = 'FIXED';
  card.counterAxisSizingMode = 'FIXED';
  card.itemSpacing = 12;
  card.paddingTop = 24;
  card.paddingBottom = 24;
  card.paddingLeft = 24;
  card.paddingRight = 24;
  card.clipsContent = true;
  card.strokeWeight = 1;

  // Variable binding for fills
  card.fills = [figma.variables.setBoundVariableForPaint(
    {type:'SOLID',color:{r:1,g:1,b:1}}, 'color', cardBg
  )];
  card.strokes = [figma.variables.setBoundVariableForPaint(
    {type:'SOLID',color:{r:0.9,g:0.9,b:0.9}}, 'color', border
  )];

  // Set Light/Dark Mode
  card.setExplicitVariableModeForCollection(col.id, col.modes[0].modeId);

  // Title - FILL width
  const title = figma.createText();
  title.fontName = {family:'Inter',style:'Bold'};
  title.characters = 'Card Title';
  title.fontSize = 20;
  title.fills = [figma.variables.setBoundVariableForPaint(
    {type:'SOLID',color:{r:0,g:0,b:0}}, 'color', cardFg
  )];
  title.layoutSizingHorizontal = 'FILL';
  card.appendChild(title);

  // Description - FILL width + HEIGHT auto
  const desc = figma.createText();
  desc.fontName = {family:'Inter',style:'Regular'};
  desc.characters = 'Description text that wraps nicely.';
  desc.fontSize = 14;
  desc.fills = [figma.variables.setBoundVariableForPaint(
    {type:'SOLID',color:{r:0.5,g:0.5,b:0.5}}, 'color', mutedFg
  )];
  desc.layoutSizingHorizontal = 'FILL';
  desc.textAutoResize = 'HEIGHT';
  card.appendChild(desc);
})()
```

### Additional Best Practices

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
