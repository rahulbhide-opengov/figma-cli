# figma-ds-cli

<p align="center">
  <img src="https://img.shields.io/npm/v/figma-ds-cli?color=blue" alt="npm version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license">
</p>

CLI for managing Figma design systems. Create variables, components, export tokens, and more.

**No API key required.** Works directly with Figma Desktop.

```
  ███████╗██╗ ██████╗ ███╗   ███╗ █████╗       ██████╗ ███████╗
  ██╔════╝██║██╔════╝ ████╗ ████║██╔══██╗      ██╔══██╗██╔════╝
  █████╗  ██║██║  ███╗██╔████╔██║███████║█████╗██║  ██║███████╗
  ██╔══╝  ██║██║   ██║██║╚██╔╝██║██╔══██║╚════╝██║  ██║╚════██║
  ██║     ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║      ██████╔╝███████║
  ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝      ╚═════╝ ╚══════╝
```

## Installation

```bash
npm install -g figma-ds-cli
```

## Quick Start

```bash
npx figma-ds-cli
```

That's it. One command:
1. ✓ Installs dependencies
2. ✓ Patches Figma for CLI access
3. ✓ Starts Figma and connects
4. ✓ Shows available commands

## For Designers (with Claude Code)

No terminal knowledge needed. Just talk to Claude:

**1. Download this repo**

Click "Code" → "Download ZIP" → Unzip the folder

**2. Open Claude Code in that folder**

```bash
cd ~/Downloads/figma-cli-main
claude
```

**3. Tell Claude what you want**

> "Install Node.js if needed, then install dependencies and connect to Figma"

Claude handles everything. Then just ask:

> "Create Tailwind colors in Figma"
> "Add a sticky note to FigJam"
> "Export my variables as CSS"

Claude reads the documentation and runs the right commands for you.

## Usage

### Start Figma (after initial setup)

```bash
figma-ds-cli connect
```

### Create Design System (Recommended)

```bash
# IDS Base Design System (71 variables, 5 collections)
figma-ds-cli tokens ds
```

Creates a complete, production-ready design system:
- **Color - Primitives**: gray, primary, accent (50-950 scales)
- **Color - Semantic**: background, foreground, border, action, feedback
- **Spacing**: xs to 3xl (4px base)
- **Typography**: sizes + weights
- **Border Radii**: none to full

### Create Individual Token Presets

```bash
# Tailwind CSS color palette (220 colors)
figma-ds-cli tokens tailwind

# Spacing scale (4px base)
figma-ds-cli tokens spacing

# Border radii
figma-ds-cli tokens radii
```

### Manage Variables

```bash
# List all variables
figma-ds-cli var list

# Create a variable
figma-ds-cli var create "primary/500" -c "CollectionId" -t COLOR -v "#3b82f6"

# Find variables
figma-ds-cli var find "primary/*"
```

### Manage Collections

```bash
# List collections
figma-ds-cli col list

# Create collection
figma-ds-cli col create "Color - Semantic"
```

### Create Elements

```bash
# Create a frame
figma-ds-cli create frame "Card" -w 320 -h 200 --fill "#ffffff" --radius 12

# Create an icon (150k+ Iconify icons)
figma-ds-cli create icon lucide:star -s 24 -c "#f59e0b"
figma-ds-cli create icon mdi:home -s 32 -c "#3b82f6"
```

### Render JSX

Create complex UI directly from React-like JSX:

```bash
figma-ds-cli render '<Frame w={320} h={200} bg="#fff" rounded={12} p={24} flex="col" gap={16}>
  <Text size={18} weight="bold" color="#111">Card Title</Text>
  <Text size={14} color="#666">Description</Text>
</Frame>'
```

### Export

```bash
# Screenshot
figma-ds-cli export screenshot -o screenshot.png

# Variables as CSS custom properties
figma-ds-cli export css

# Variables as Tailwind config
figma-ds-cli export tailwind
```

### FigJam

Full FigJam support with sticky notes, shapes, connectors:

```bash
# List open FigJam pages
figma-ds-cli fj list

# Create sticky note
figma-ds-cli fj sticky "Hello World!" -x 100 -y 100

# Create shape with text
figma-ds-cli fj shape "Box" -x 200 -y 100 -w 200 -h 100

# Connect two elements
figma-ds-cli fj connect "2:30" "2:34"

# List elements
figma-ds-cli fj nodes

# Execute FigJam JavaScript
figma-ds-cli fj eval "figma.currentPage.children.length"
```

### Advanced

```bash
# Execute Figma Plugin API code
figma-ds-cli eval "figma.currentPage.name"

# Run any figma-use command
figma-ds-cli raw query "//COMPONENT"
figma-ds-cli raw lint
```

## How It Works

figma-ds-cli connects to Figma Desktop via Chrome DevTools Protocol. No API key needed because it uses your existing Figma session.

```
┌─────────────┐      Chrome DevTools      ┌─────────────┐
│  figma-ds-cli  │ ◄──────Protocol─────────► │   Figma     │
│   (CLI)     │      (localhost:9222)     │  Desktop    │
└─────────────┘                           └─────────────┘
```

## Requirements

- Node.js 18+
- Figma Desktop (free account works)
- macOS (Windows/Linux support coming)

## Credits

Built on top of [figma-use](https://github.com/dannote/figma-use) by dannote.

## Author

**Sil Bormüller**
- Website: [intodesignsystems.com](https://intodesignsystems.com)
- GitHub: [@silships](https://github.com/silships)

## License

MIT
