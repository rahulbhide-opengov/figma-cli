# figma-cli

<p align="center">
  <img src="https://img.shields.io/npm/v/figma-cli?color=blue" alt="npm version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license">
</p>

CLI for managing Figma design systems. Create variables, components, export tokens, and more.

**No API key required.** Works directly with Figma Desktop.

```
  ███████╗██╗ ██████╗ ███╗   ███╗ █████╗        ██████╗██╗     ██╗
  ██╔════╝██║██╔════╝ ████╗ ████║██╔══██╗      ██╔════╝██║     ██║
  █████╗  ██║██║  ███╗██╔████╔██║███████║█████╗██║     ██║     ██║
  ██╔══╝  ██║██║   ██║██║╚██╔╝██║██╔══██║╚════╝██║     ██║     ██║
  ██║     ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║      ╚██████╗███████╗██║
  ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝       ╚═════╝╚══════╝╚═╝
```

## Installation

```bash
npm install -g figma-cli
```

## Quick Start

```bash
figma-cli init
```

That's it. The wizard will:
1. ✓ Check Node.js version
2. ✓ Install dependencies
3. ✓ Patch Figma for CLI access
4. ✓ Start Figma and connect

## Usage

### Start Figma (after initial setup)

```bash
figma-cli connect
```

### Create Design Tokens

```bash
# Tailwind CSS color palette (220 colors)
figma-cli tokens tailwind

# Spacing scale (4px base)
figma-cli tokens spacing

# Border radii
figma-cli tokens radii
```

### Manage Variables

```bash
# List all variables
figma-cli var list

# Create a variable
figma-cli var create "primary/500" -c "CollectionId" -t COLOR -v "#3b82f6"

# Find variables
figma-cli var find "primary/*"
```

### Manage Collections

```bash
# List collections
figma-cli col list

# Create collection
figma-cli col create "Color - Semantic"
```

### Create Elements

```bash
# Create a frame
figma-cli create frame "Card" -w 320 -h 200 --fill "#ffffff" --radius 12

# Create an icon (150k+ Iconify icons)
figma-cli create icon lucide:star -s 24 -c "#f59e0b"
figma-cli create icon mdi:home -s 32 -c "#3b82f6"
```

### Render JSX

Create complex UI directly from React-like JSX:

```bash
figma-cli render '<Frame w={320} h={200} bg="#fff" rounded={12} p={24} flex="col" gap={16}>
  <Text size={18} weight="bold" color="#111">Card Title</Text>
  <Text size={14} color="#666">Description</Text>
</Frame>'
```

### Export

```bash
# Screenshot
figma-cli export screenshot -o screenshot.png

# Variables as CSS custom properties
figma-cli export css

# Variables as Tailwind config
figma-cli export tailwind
```

### Advanced

```bash
# Execute Figma Plugin API code
figma-cli eval "figma.currentPage.name"

# Run any figma-use command
figma-cli raw query "//COMPONENT"
figma-cli raw lint
```

## How It Works

figma-cli connects to Figma Desktop via Chrome DevTools Protocol. No API key needed because it uses your existing Figma session.

```
┌─────────────┐      Chrome DevTools      ┌─────────────┐
│  figma-cli  │ ◄──────Protocol─────────► │   Figma     │
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
