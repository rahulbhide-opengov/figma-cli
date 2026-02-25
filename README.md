# figma-ds-cli

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license">
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue" alt="platform">
</p>

CLI for managing Figma design systems. Create variables, components, export tokens, and more.

**No API key required.** Works directly with Figma Desktop.

```
  ███████╗██╗ ██████╗ ███╗   ███╗ █████╗       ██████╗ ███████╗       ██████╗██╗     ██╗
  ██╔════╝██║██╔════╝ ████╗ ████║██╔══██╗      ██╔══██╗██╔════╝      ██╔════╝██║     ██║
  █████╗  ██║██║  ███╗██╔████╔██║███████║█████╗██║  ██║███████╗█████╗██║     ██║     ██║
  ██╔══╝  ██║██║   ██║██║╚██╔╝██║██╔══██║╚════╝██║  ██║╚════██║╚════╝██║     ██║     ██║
  ██║     ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║      ██████╔╝███████║      ╚██████╗███████╗██║
  ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝      ╚═════╝ ╚══════╝       ╚═════╝╚══════╝╚═╝
```

## Quick Start (with Claude Code)

No terminal knowledge needed. Just talk to Claude:

**1. Download this repo**

Click "Code" → "Download ZIP" → Unzip the folder

**2. Open Claude Code in that folder**

macOS / Linux:
```bash
cd ~/Downloads/figma-cli-main
claude
```

Windows (PowerShell):
```powershell
cd $HOME\Downloads\figma-cli-main
claude
```

**3. First message to Claude:**

> "Setup: install dependencies and connect to Figma"

Claude reads the included CLAUDE.md and knows all commands. After setup, just ask:

> "Create Tailwind colors in Figma"
> "Add a sticky note to FigJam"
> "Export my variables as CSS"

**Note:** No `/init` needed. The CLAUDE.md already contains all documentation.

**Works on:** macOS, Windows, and Linux.

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

### Create Elements (Primitives)

```bash
# Create a frame
figma-ds-cli create frame "Card" -w 320 -h 200 --fill "#ffffff" --radius 12

# Create a rectangle
figma-ds-cli create rect "Box" -w 200 -h 100 --fill "#3b82f6" --radius 8

# Create a circle
figma-ds-cli create circle "Avatar" -w 48 --fill "#ef4444"

# Create text
figma-ds-cli create text "Hello World" -s 24 -c "#000" -w bold

# Create a line
figma-ds-cli create line --x1 0 --y1 0 --x2 200 --y2 0

# Create auto-layout frame
figma-ds-cli create autolayout "Stack" -d col -g 16 -p 24

# Create an icon (150k+ Iconify icons)
figma-ds-cli create icon lucide:star -s 24 -c "#f59e0b"
figma-ds-cli create icon mdi:home -s 32 -c "#3b82f6"

# Group selection
figma-ds-cli create group "Header"

# Convert to component
figma-ds-cli create component "Button"
```

### Modify Elements

```bash
# Set fill color
figma-ds-cli set fill "#3b82f6"

# Set stroke
figma-ds-cli set stroke "#e4e4e7" -w 1

# Set corner radius
figma-ds-cli set radius 12

# Resize
figma-ds-cli set size 320 200

# Move
figma-ds-cli set pos 100 100

# Apply auto-layout
figma-ds-cli set autolayout row -g 8

# Rename
figma-ds-cli set name "Header"
```

### Find & Inspect

```bash
# Select node
figma-ds-cli select "1:234"

# Find by name
figma-ds-cli find "Button"

# Get properties
figma-ds-cli get "1:234"

# Delete
figma-ds-cli delete "1:234"

# Duplicate
figma-ds-cli dup "1:234"

# Arrange frames
figma-ds-cli arrange -g 100 -c 3
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
- macOS, Windows, or Linux

## For Claude Code Users

The `CLAUDE.md` file contains all commands and best practices. Claude reads it automatically, no `/init` needed. Don't overwrite it.

## Credits

Built on top of [figma-use](https://github.com/dannote/figma-use) by dannote.

## Author

**Sil Bormüller**
- Website: [intodesignsystems.com](https://intodesignsystems.com)
- GitHub: [@silships](https://github.com/silships)

## License

MIT
