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

### Advanced

- Execute any Figma Plugin API code directly
- Render complex UI from JSX-like syntax
- Full programmatic control over Figma

## Quick Start

**1. Download**

```bash
git clone https://github.com/silships/figma-cli.git
cd figma-cli
npm install
```

**2. Connect to Figma**

```bash
node src/index.js connect
```

**3. Use with Claude Code**

```bash
claude
```

Then just ask:
> "Create Tailwind colors"
> "Add a card component"
> "Export variables as CSS"

The included `CLAUDE.md` teaches Claude all commands.

## How It Works

Connects to Figma Desktop via Chrome DevTools Protocol (CDP). No API key needed because it uses your existing Figma session.

```
┌─────────────┐      WebSocket (CDP)      ┌─────────────┐
│ figma-ds-cli │ ◄───────────────────────► │   Figma     │
│    (CLI)    │      localhost:9222       │  Desktop    │
└─────────────┘                           └─────────────┘
```

## Requirements

- Node.js 18+
- Figma Desktop
- macOS, Windows, or Linux

## Author

**Sil Bormüller** - [intodesignsystems.com](https://intodesignsystems.com)

## License

MIT
