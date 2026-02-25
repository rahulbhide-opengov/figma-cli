# figma-ds-cli

<p align="center">
  <img src="https://img.shields.io/badge/Figma-Desktop-purple" alt="Figma Desktop">
  <img src="https://img.shields.io/badge/No_API_Key-Required-green" alt="No API Key">
  <img src="https://img.shields.io/badge/Claude_Code-Ready-blue" alt="Claude Code">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License">
</p>

<p align="center">
  <b>Control Figma directly from your terminal.</b><br>
  Full read/write access to Figma Desktop via Chrome DevTools Protocol.<br>
  No API key, no plugins, no MCP server setup.
</p>

```
  ███████╗██╗ ██████╗ ███╗   ███╗ █████╗       ██████╗ ███████╗       ██████╗██╗     ██╗
  ██╔════╝██║██╔════╝ ████╗ ████║██╔══██╗      ██╔══██╗██╔════╝      ██╔════╝██║     ██║
  █████╗  ██║██║  ███╗██╔████╔██║███████║█████╗██║  ██║███████╗█████╗██║     ██║     ██║
  ██╔══╝  ██║██║   ██║██║╚██╔╝██║██╔══██║╚════╝██║  ██║╚════██║╚════╝██║     ██║     ██║
  ██║     ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║      ██████╔╝███████║      ╚██████╗███████╗██║
  ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝      ╚═════╝ ╚══════╝       ╚═════╝╚══════╝╚═╝
```

## What is This?

A CLI that connects directly to Figma Desktop and gives you complete control:

- **Design Tokens** — Create variables, collections, modes (Light/Dark), bind to nodes
- **Create Anything** — Frames, text, shapes, icons (150k+ from Iconify), components
- **Team Libraries** — Import and use components, styles, variables from any library
- **Analyze Designs** — Colors, typography, spacing, find repeated patterns
- **Lint & Accessibility** — Contrast checker, touch targets, design rules
- **Export** — PNG, SVG, JSX, Storybook stories, CSS variables, Tailwind config
- **Batch Operations** — Rename layers, find/replace text, create 100 variables at once
- **Works with Claude Code** — Just ask in natural language, Claude knows all commands

## Why This CLI?

Other tools require MCP servers, API keys, or complex setup. This one doesn't.

| | figma-ds-cli | MCP-based tools |
|---|---|---|
| **Setup** | Download ZIP, `npm install`, done | Configure MCP server + client |
| **API Key** | Not needed | Personal Access Token or OAuth |
| **Claude Code** | Just run `claude` | Manual MCP configuration |
| **AI Knowledge** | `CLAUDE.md` included, AI knows everything | Teach AI manually |
| **Designer-friendly** | Yes | Requires technical setup |

### The CLAUDE.md Advantage

This project includes a `CLAUDE.md` file that Claude reads automatically. It contains:

- All available commands and their syntax
- Best practices (e.g., "use `render` for text-heavy designs")
- Common requests mapped to solutions

**Example:** You type "Create Tailwind colors" → Claude already knows to run `node src/index.js tokens tailwind` because it's documented in `CLAUDE.md`.

No explaining. No teaching. Just ask.

### Extra Features

Things you get here that MCP tools don't have:

- **150k+ Iconify icons** — Insert any icon instantly
- **Unsplash integration** — Stock photos in one command
- **Tailwind/shadcn presets** — Complete color systems ready to go
- **Lorem ipsum generator** — Placeholder text
- **FigJam support** — Sticky notes, shapes, connectors
- **8 lint rules** — Catch design issues automatically
- **Color blindness simulation** — Test accessibility
- **XPath queries** — Find nodes with `//FRAME[@width > 300]`

---

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

## Full Feature List

### Design Tokens & Variables

- Create complete design systems (colors, spacing, typography, radii)
- Create Tailwind CSS color palettes (all 22 color families, 50-950 shades)
- Create and manage variable collections
- **Variable modes** (Light/Dark/Mobile) with per-mode values
- **Batch create** up to 100 variables at once
- **Batch update** variable values across modes
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
- **Component sets with variants**

### Modify Elements

- Change fill and stroke colors
- Set corner radius
- Resize and move
- Apply auto-layout (row/column, gap, padding)
- Set sizing mode (hug/fill/fixed)
- Rename nodes
- Duplicate nodes
- Delete nodes
- **Flip nodes** (horizontal/vertical)
- **Scale vectors**

### Find & Select

- Find nodes by name
- Find nodes by type (FRAME, COMPONENT, TEXT, etc.)
- **XPath-like queries** (`//FRAME[@width > 300]`)
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
- **Export multiple sizes** (@1x, @2x, @3x)
- Take screenshots
- **Export to JSX** (React code)
- **Export to Storybook** stories
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
- **Contrast checker** (WCAG AA/AAA compliance)
- **Check text contrast** against background
- **Find and replace text** across all layers
- **Select same** (fill, stroke, font, size)
- **Color blindness simulation** (deuteranopia, protanopia, tritanopia)

### Query & Analysis

- **Analyze colors** — usage frequency, variable bindings
- **Analyze typography** — all font combinations used
- **Analyze spacing** — gap/padding values, grid compliance
- **Find clusters** — detect repeated patterns (potential components)
- **Visual diff** — compare two nodes
- **Create diff patch** — structural patches between versions

### Lint & Accessibility

- **Design linting** with 8+ rules:
  - `no-default-names` — detect unnamed layers
  - `no-deeply-nested` — flag excessive nesting
  - `no-empty-frames` — find empty frames
  - `prefer-auto-layout` — suggest auto-layout
  - `no-hardcoded-colors` — check variable usage
  - `color-contrast` — WCAG AA/AAA compliance
  - `touch-target-size` — minimum 44x44 check
  - `min-text-size` — minimum 12px text
- **Accessibility snapshot** — extract interactive elements tree

### Component Variants

- Create component sets with variants
- Add variant properties
- Combine frames into component sets
- **Organize variants** into grid with labels
- **Auto-generate component sets** from similar frames

### Component Documentation

- **Add descriptions** to components (supports markdown)
- **Document with template** (usage, props, notes)
- Read component descriptions

### CSS Grid Layout

- Set up grid layout with columns and rows
- Configure column/row gaps
- Auto-reorganize children into grid

### Console & Debugging

- **Capture console logs** from Figma
- **Execute code with log capture**
- **Reload page**
- **Navigate to files**

### Advanced

- Execute any Figma Plugin API code directly
- Render complex UI from JSX-like syntax
- Full programmatic control over Figma
- Match vectors to Iconify icons

### Not Supported (requires REST API)

- Comments (read/write/delete) — requires Figma API key
- Version history
- Team/project management

---

## Author

**Sil Bormüller** — [intodesignsystems.com](https://intodesignsystems.com)

## License

MIT
