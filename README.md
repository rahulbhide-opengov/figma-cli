# figma-ds-cli

CLI for controlling Figma Desktop directly. **No API key required.**

```
  ███████╗██╗ ██████╗ ███╗   ███╗ █████╗       ██████╗ ███████╗       ██████╗██╗     ██╗
  ██╔════╝██║██╔════╝ ████╗ ████║██╔══██╗      ██╔══██╗██╔════╝      ██╔════╝██║     ██║
  █████╗  ██║██║  ███╗██╔████╔██║███████║█████╗██║  ██║███████╗█████╗██║     ██║     ██║
  ██╔══╝  ██║██║   ██║██║╚██╔╝██║██╔══██║╚════╝██║  ██║╚════██║╚════╝██║     ██║     ██║
  ██║     ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║      ██████╔╝███████║      ╚██████╗███████╗██║
  ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝      ╚═════╝ ╚══════╝       ╚═════╝╚══════╝╚═╝
```

## Requirements

- Node.js 18+
- Figma Desktop (free account works)
- macOS, Windows, or Linux

## Installation

### Option A: Download ZIP (Simple)

Best for designers who want to try it once:

1. Click the green **Code** button above
2. Select **Download ZIP**
3. Unzip the folder
4. Open Terminal and navigate to the folder:

```bash
cd ~/Downloads/figma-cli-main
npm install
```

### Option B: Git Clone (Always Latest)

Best if you want automatic updates:

```bash
git clone https://github.com/silships/figma-cli.git
cd figma-cli
npm install
```

To update to the latest version anytime:

```bash
git pull
npm install
```

## Quick Start

**1. Connect to Figma**

```bash
node src/index.js connect
```

This starts Figma with remote debugging enabled.

**2. Use with Claude Code**

```bash
claude
```

Then just ask:

> "Create Tailwind colors"

> "Add a card component"

> "Export variables as CSS"

The included `CLAUDE.md` teaches Claude all commands automatically.

## How It Works

Connects to Figma Desktop via Chrome DevTools Protocol (CDP). No API key needed because it uses your existing Figma session.

```
┌─────────────┐      WebSocket (CDP)      ┌─────────────┐
│ figma-ds-cli │ ◄───────────────────────► │   Figma     │
│    (CLI)    │      localhost:9222       │  Desktop    │
└─────────────┘                           └─────────────┘
```

---

## What It Can Do

### Design Tokens & Variables

- Create complete design systems (colors, spacing, typography, radii)
- Create Tailwind CSS color palettes (all 22 color families, 50-950 shades)
- Create and manage variable collections
- Create COLOR, FLOAT, STRING variables
- Bind variables to node properties (fill, stroke, gap, padding, radius)
- Export variables as CSS custom properties
- Export variables as Tailwind config

### Create Elements

- Frames with auto-layout
- Rectangles, circles, ellipses
- Text with custom fonts, sizes, weights
- Lines
- Icons (150,000+ from Iconify: Lucide, Material Design, Heroicons, etc.)
- Groups
- Components from frames
- Component instances

### Modify Elements

- Change fill and stroke colors
- Set corner radius
- Resize and move
- Apply auto-layout (row/column, gap, padding)
- Set sizing mode (hug/fill/fixed)
- Rename nodes
- Duplicate nodes
- Delete nodes

### Find & Select

- Find nodes by name
- Find nodes by type (FRAME, COMPONENT, TEXT, etc.)
- Select nodes by ID
- Get node properties
- Get node tree structure

### Canvas Operations

- List all nodes on canvas
- Arrange frames in grid or column
- Delete all nodes
- Zoom to fit content
- Smart positioning (auto-place without overlaps)

### Export

- Export nodes as PNG (with scale factor)
- Export nodes as SVG
- Take screenshots
- Export variables as CSS
- Export variables as Tailwind config

### FigJam Support

- Create sticky notes
- Create shapes with text
- Connect elements with arrows
- List FigJam elements
- Run JavaScript in FigJam context

### Team Libraries

- List available library variable collections
- Import variables from libraries
- Import components from libraries
- Create instances of library components
- Import and apply library styles (color, text, effect)
- Bind library variables to node properties
- Swap component instances to different library components
- List all enabled libraries

### Designer Utilities

- **Batch rename layers** (with patterns: {n}, {name}, {type})
- **Case conversion** (camelCase, PascalCase, snake_case, kebab-case)
- **Lorem ipsum generator** (words, sentences, paragraphs)
- **Fill text with placeholder content**
- **Insert images from URL**
- **Unsplash integration** (random stock photos by keyword)
- **Export multiple sizes** (@1x, @2x, @3x)
- **Contrast checker** (WCAG AA/AAA compliance)
- **Check text contrast** against background
- **Find and replace text** across all layers
- **Select same fill** color
- **Select same stroke** color
- **Select same font** and size
- **Select same size** nodes
- **Color blindness simulation** (deuteranopia, protanopia, tritanopia)

### Export & Convert

- **Export to JSX** - Convert any Figma node to React JSX code
- **Export to Storybook** - Generate Storybook stories from components
- **Visual diff** - Compare two nodes and find differences
- **Create diff patch** - Generate structural patches between versions

### Query & Analysis

- **XPath-like queries** - Find nodes with powerful selectors
  - `//FRAME` - all frames
  - `//TEXT[@fontSize > 20]` - text larger than 20px
  - `//FRAME[contains(@name, 'Card')]` - frames with 'Card' in name
- **Analyze colors** - Color usage frequency, variable bindings
- **Analyze typography** - All font combinations used
- **Analyze spacing** - Gap/padding values, grid compliance
- **Find clusters** - Detect repeated patterns (potential components)

### Vector Operations

- Get vector path data
- Set vector path data
- Scale vectors
- Flip nodes (horizontal/vertical)

### Lint & Accessibility

- **Design linting** with 8+ rules:
  - `no-default-names` - Detect unnamed layers
  - `no-deeply-nested` - Flag excessive nesting
  - `no-empty-frames` - Find empty frames
  - `prefer-auto-layout` - Suggest auto-layout
  - `no-hardcoded-colors` - Check variable usage
  - `color-contrast` - WCAG AA/AAA compliance
  - `touch-target-size` - Minimum 44x44 check
  - `min-text-size` - Minimum 12px text
- **Accessibility snapshot** - Extract interactive elements tree

### Component Variants

- Create component sets with variants
- Add variant properties
- Combine frames into component sets

### CSS Grid Layout

- Set up grid layout with columns and rows
- Configure column/row gaps
- Auto-reorganize children into grid

### Advanced

- Execute any Figma Plugin API code directly
- Render complex UI from JSX-like syntax
- Full programmatic control over Figma
- Match vectors to Iconify icons

### Not Supported (requires REST API)

- Comments (read/write/delete) - requires Figma API key
- Version history
- Team/project management

---

## Author

**Sil Bormüller** - [intodesignsystems.com](https://intodesignsystems.com)

## License

MIT
