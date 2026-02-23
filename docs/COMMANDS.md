# Commands Reference

## Setup & Connection

```bash
# Initial setup (patches Figma, installs dependencies)
figma-ds-cli

# Connect to running Figma
figma-ds-cli connect
```

## Design Tokens

```bash
# IDS Base Design System (71 variables, 5 collections)
figma-ds-cli tokens ds

# Tailwind CSS colors (220 variables)
figma-ds-cli tokens tailwind

# Spacing scale (4px base)
figma-ds-cli tokens spacing

# Border radii
figma-ds-cli tokens radii
```

## Variables

```bash
# List all variables
figma-ds-cli var list

# Create a variable
figma-ds-cli var create "primary/500" -c "CollectionId" -t COLOR -v "#3b82f6"

# Find variables by pattern
figma-ds-cli var find "primary/*"
```

## Collections

```bash
# List collections
figma-ds-cli col list

# Create collection
figma-ds-cli col create "Color - Semantic"
```

## Create Elements

```bash
# Create a frame
figma-ds-cli create frame "Card" -w 320 -h 200 --fill "#ffffff" --radius 12

# Create an icon (Iconify, 150k+ icons)
figma-ds-cli create icon lucide:star -s 24 -c "#f59e0b"
figma-ds-cli create icon mdi:home -s 32 -c "#3b82f6"
```

## JSX Rendering

```bash
# Create complex UI from JSX
figma-ds-cli render '<Frame w={320} h={200} bg="#fff" rounded={12} p={24} flex="col" gap={16}>
  <Text size={18} weight="bold" color="#111">Card Title</Text>
  <Text size={14} color="#666">Description</Text>
</Frame>'
```

## Export

```bash
# Screenshot current view
figma-ds-cli export screenshot -o screenshot.png

# Export variables as CSS custom properties
figma-ds-cli export css

# Export as Tailwind config
figma-ds-cli export tailwind
```

## Raw Commands

```bash
# Execute arbitrary JavaScript
figma-ds-cli eval "figma.currentPage.name"

# Run figma-use commands directly
figma-ds-cli raw query "//COMPONENT"
figma-ds-cli raw lint
figma-ds-cli raw select "1:234"
figma-ds-cli raw export "1:234" --scale 2
```

## Query Syntax

The query command uses XPath-like syntax:

```bash
# All frames
figma-ds-cli raw query "//FRAME"

# Frames with specific name
figma-ds-cli raw query "//FRAME[@name='Card']"

# All components
figma-ds-cli raw query "//COMPONENT"

# All groups
figma-ds-cli raw query "//GROUP"

# Name starts with
figma-ds-cli raw query "//*[@name^='session-']"

# Name contains
figma-ds-cli raw query "//*[contains(@name, 'Button')]"
```

## Selection

```bash
# Select by ID
figma-ds-cli raw select "1:234"

# Select multiple
figma-ds-cli raw select "1:234,1:235,1:236"

# Clear selection
figma-ds-cli eval "figma.currentPage.selection = []"
```

## Export Nodes

```bash
# Export at 2x scale
figma-ds-cli raw export "1:234" --scale 2

# Export with suffix
figma-ds-cli raw export "1:234" --scale 2 --suffix "_dark"
```
