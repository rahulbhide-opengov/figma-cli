# figma-ds-cli

CLI that controls Figma Desktop directly. No API key needed.
**Has a built-in CDS Design System with 322 tokens and 26 components.**

## CRITICAL: Natural Language Interface

**NEVER show `node src/index.js` commands to the user.** The user speaks plain English. You figure out and run the right command silently. The user should never need to know a CLI exists.

### How This Works
1. User says something like "Create a login form" or "Add a button"
2. **FIRST: Make sure a Figma file is selected** (see File Selection below)
3. You determine the right command from the mappings below
4. You run the command(s) silently
5. You report back what was created in plain English

---

## CRITICAL: File Selection (Before Creating ANY Design)

**Before creating any design**, you MUST have a target Figma file. **Ask the user directly:**

### If user provided a Figma URL in their message
→ Run `node src/index.js connect "THE_URL"` and proceed. No need to ask.

### If NO Figma URL was provided
→ Ask the user immediately:

> "Before I start, where should I create the designs?
> - **Paste a Figma file URL** if you have an existing file
> - **Say 'new file'** and I'll create a fresh one for you"

Then based on the answer:
- **User pastes a URL** → Run `node src/index.js connect "URL"` then proceed
- **User says "new file"** or "create new" → Run `node src/index.js new-file "Design Name"` then proceed
- **User gives a name** like "call it Dashboard Designs" → Run `node src/index.js new-file "Dashboard Designs"` then proceed

## CRITICAL: Session File Lock

**Once a file is selected, ALL commands for the rest of this conversation go to that same file.** Do NOT ask again. Do NOT switch files unless the user explicitly says:
- "Switch to a different file"
- "Use this file instead: [URL]"
- "Create a new file for this"

This means: if the user asks to create a button, then a card, then a full page — all of them go into the same file that was chosen at the start. Never re-ask, never re-connect, never lose track of the file.

### Example Conversations

**Example 1 — URL provided:**
> User: "Here's my file https://figma.com/design/abc123/App — create a settings page"
> Agent: *runs `node src/index.js connect "https://figma.com/design/abc123/App"`*
> Agent: *creates settings page — no questions asked*
> User: "Now add a button too"
> Agent: *creates button in the SAME file — does not ask again*

**Example 2 — No URL:**
> User: "Build me a login screen"
> Agent: "Before I start, where should I create the designs? Paste a Figma file URL, or say 'new file' and I'll create one."
> User: "New file, call it Login Screens"
> Agent: *runs `node src/index.js new-file "Login Screens"`*
> Agent: *creates login screen*
> User: "Also add a forgot-password flow"
> Agent: *creates it in "Login Screens" — same file, no re-asking*

**Example 3 — Switching files mid-session:**
> User: "Actually, put the next design in a different file"
> Agent: "Sure — paste a URL or say 'new file'."
> User: "https://figma.com/design/xyz789/Other-Project"
> Agent: *runs `node src/index.js connect "https://figma.com/design/xyz789/Other-Project"`*
> Agent: *all subsequent commands now go to this new file*

---

## IMPORTANT: CDS Design System is the DEFAULT

This CLI includes the **CDS (Corporate Design System)** with 322 tokens and 26 ready-made components. **ALWAYS use the `ds` commands first** when creating anything. Only fall back to raw `render`/`eval` for custom one-off elements not covered by a component.

### CDS Design System Quick Facts
- **Primary:** #4b3fff | **Error:** #d33423 | **Warning:** #ed6c02 | **Success:** #2e7d32
- **Font:** DM Sans | **Body:** 14px | **H2:** 24px | **H1:** 48px
- **Spacing:** 4px grid (spacing/4 = 16px, spacing/6 = 24px, spacing/8 = 32px)
- **Button heights:** 32px (S), 40px (M), 48px (L)
- **Border radius:** 4px (small), 8px (medium/button), 12px (large/card/dialog)
- **Dark mode:** Full dark theme color set included

---

## IMPORTANT: What Users Say → What You Run

Below is the complete mapping. User says the LEFT side. You silently run the RIGHT side. Never expose the command.

### Creating Components

| User says | You run |
|-----------|---------|
| "Create a button" / "Add a button" / "Make a CTA" | `node src/index.js ds create button` |
| "Create an outlined button" / "Secondary button" | `node src/index.js ds create button -v outlined` |
| "Create a text button" / "Tertiary button" | `node src/index.js ds create button -v text` |
| "Create a large submit button" | `node src/index.js ds create button -s large --label "Submit"` |
| "Create a delete button" / "Destructive button" | `node src/index.js ds create button --color error --label "Delete"` |
| "Create a disabled button" | `node src/index.js ds create button --disabled --label "Unavailable"` |
| "Create a text field" / "Add an input" / "Email field" | `node src/index.js ds create textfield --label "Email" --variant outlined` |
| "Create a filled input" | `node src/index.js ds create textfield --variant filled --label "Name"` |
| "Create a card" / "Add a content card" | `node src/index.js ds create card --title "Title" --body "Description"` |
| "Create an outlined card" | `node src/index.js ds create card --title "Title" -v outlined` |
| "Create a dialog" / "Add a modal" / "Confirmation popup" | `node src/index.js ds create dialog --title "Confirm" --body "Are you sure?"` |
| "Create a chip" / "Add a tag" / "Filter chip" | `node src/index.js ds create chip --label "Active"` |
| "Create a primary chip" | `node src/index.js ds create chip --label "Active" --color primary` |
| "Create a tooltip" | `node src/index.js ds create tooltip` |
| "Create a snackbar" / "Toast notification" | `node src/index.js ds create snackbar` |
| "Create a sidebar" / "Navigation menu" / "Sidenav" | `node src/index.js ds create navigation` |
| "Create breadcrumbs" | `node src/index.js ds create breadcrumb` |
| "Create a timeline" / "Activity timeline" | `node src/index.js ds create timeline` |
| "Create a stepper" / "Step indicator" / "Progress steps" | `node src/index.js ds create stepper` |
| "Create a data table" / "Table" / "Grid" | `node src/index.js ds create datatable` |
| "Create a page heading" / "Page title section" | `node src/index.js ds create pageheading --title "Page Title"` |
| "Create a section heading" | `node src/index.js ds create sectionheading --title "Section"` |
| "Create a form" / "Registration form" / "Sign up form" | `node src/index.js ds create formlayout --title "Form Title"` |
| "Create an avatar" | `node src/index.js ds create avatar` |
| "Create an accordion" / "Expandable sections" / "FAQ" | `node src/index.js ds create accordion` |
| "Create radio buttons" / "Radio group" | `node src/index.js ds create radio` |
| "Create a toggle" / "Switch" / "On/off toggle" | `node src/index.js ds create switch` |
| "Create toggle buttons" / "Segmented control" | `node src/index.js ds create togglebutton` |
| "Create a dropdown" / "Select menu" / "Combobox" | `node src/index.js ds create select` |
| "Create a skeleton loader" / "Loading placeholder" | `node src/index.js ds create skeleton` |
| "Create a list" / "Item list" | `node src/index.js ds create list` |
| "Create a button group" | `node src/index.js ds create buttongroup` |
| "Create an icon button" | `node src/index.js ds create iconbutton` |
| "Create a date picker" / "Calendar" | `node src/index.js ds create datepicker` |

### Creating Full Pages

| User says | You run |
|-----------|---------|
| "Create a dashboard" / "Dashboard page" / "Overview page" | `node src/index.js ds page dashboard` |
| "Create a form page" / "Create account page" / "Registration page" | `node src/index.js ds page form` |
| "Create a landing page" / "Marketing page" / "Homepage" | `node src/index.js ds page landing` |
| "Create a settings page" / "Preferences page" | `node src/index.js ds page settings` |
| "Create a mobile dashboard" / "Dashboard for mobile" | `node src/index.js ds page dashboard --mobile` |
| "Create a mobile form" | `node src/index.js ds page form --mobile` |

### Connection & Figma Files

| User says | You run |
|-----------|---------|
| "Initiate project" / "Set up" / "Connect" | `node src/index.js connect` |
| "Connect to this file: https://figma.com/design/abc..." | `node src/index.js connect "https://figma.com/design/abc..."` |
| "Here's my Figma file: [URL]" / "Use this file: [URL]" | `node src/index.js connect "[URL]"` |
| User pastes any figma.com URL | `node src/index.js connect "[URL]"` |
| "New file" / "Create a new Figma file" / "Start fresh" | `node src/index.js new-file "File Name"` |
| "New file called [Name]" | `node src/index.js new-file "[Name]"` |
| "Switch to a different file" / "Use this file instead" | Ask for URL or new file name, then `connect` or `new-file` |

**IMPORTANT:** The `connect` command NEVER closes or restarts Figma. It only connects to what's already running. If Figma isn't running, it starts it. If it's already running, it reuses the connection.

**IMPORTANT:** Once a file is selected, **stick with it for the entire session**. Never re-ask, never switch unless the user explicitly requests it.

### Design System Tokens

| User says | You run |
|-----------|---------|
| "Push tokens to Figma" / "Create design variables" / "Set up the design system" | `node src/index.js ds tokens push` |
| "Push just the colors" / "Create color variables" | `node src/index.js ds tokens push --category colors` |
| "Push spacing tokens" | `node src/index.js ds tokens push --category spacing` |
| "Add dark mode" / "Create dark theme" | `node src/index.js ds tokens push-dark` |
| "What tokens do we have?" / "Show the design system" | `node src/index.js ds info` |
| "List all components" / "What can you create?" | `node src/index.js ds list` |
| "Show me all colors" / "List the color tokens" | `node src/index.js ds tokens list -c colors` |
| "Show spacing scale" | `node src/index.js ds tokens list -c spacing` |
| "Show typography tokens" | `node src/index.js ds tokens list -c typography` |

### Token Lookups

| User says | You run |
|-----------|---------|
| "What's the primary color?" | `node src/index.js ds resolve "colors/primary/main"` |
| "What color is error?" / "Red color value?" | `node src/index.js ds resolve "colors/error/main"` |
| "What's the button height?" | `node src/index.js ds resolve "sizing/button/medium"` |
| "What font do we use?" | `node src/index.js ds resolve "typography/font-family/primary"` |
| "What's spacing 4?" / "16px spacing token?" | `node src/index.js ds resolve "spacing/4"` |
| "Card border radius?" | `node src/index.js ds resolve "border-radius/card"` |
| "Find all button tokens" | `node src/index.js ds search "button"` |
| "Search for primary" | `node src/index.js ds search "primary"` |

### Showcases & Documentation

| User says | You run |
|-----------|---------|
| "Show all button variants" / "Button showcase" | `node src/index.js ds showcase button` |
| "Show all card styles" | `node src/index.js ds showcase card` |
| "Document the button component" | `node src/index.js ds showcase button -d col` |

### Complex / Multi-Component Requests

When users ask for something that requires multiple components, compose them:

| User says | What you do |
|-----------|-------------|
| "Create a login page" | Run `ds page form` OR compose: pageheading + formlayout (email + password fields) + button |
| "Create a user profile card" | Run `ds create card --title "John Doe" --body "Senior Designer"` then add avatar with `ds create avatar` |
| "Create a settings panel with toggles" | Run `ds page settings` which includes accordion + switches |
| "Create a checkout flow" | Run `ds create stepper` with steps, then `ds create formlayout` for each step |
| "Design a notification system" | Compose: snackbar + dialog + chip for different notification types |
| "Create a data dashboard" | Run `ds page dashboard` then add more cards/tables as needed |

For truly custom layouts not covered by any component, use the `render` command with CDS token values:
```bash
node src/index.js render '<Frame name="Custom" w={1200} flex="col" bg="#ffffff" p={32} gap={24} rounded={12}>
  <Text size={24} weight="700" color="#212121" font="DM Sans">Custom Section</Text>
  <Text size={14} color="#666666" w="fill">Use CDS token values: primary=#4b3fff, spacing=multiples of 4px</Text>
</Frame>'
```

---

## CRITICAL: Handling Long / Detailed Prompts (ChatGPT-style)

Users will paste long, detailed prompts describing entire screens, user flows, or multi-section layouts. These prompts may come from ChatGPT, a product spec, or a design brief. **You MUST decompose them into CDS components and build the screen.**

### Step-by-Step Decomposition Process

When you receive a detailed prompt:

**Step 1: Identify the screen type and dimensions**
- Is it desktop (1440px), tablet (768px), or mobile (375px)?
- Is it a full page or a single component?
- What is the primary purpose? (dashboard, form, settings, data view, landing)

**Step 2: Break the prompt into SECTIONS (top to bottom)**
Read the prompt and mentally divide it into vertical sections. Common patterns:
- Header / Navigation bar
- Page heading with breadcrumbs
- Filter/action bar (search, chips, buttons)
- Main content (table, cards, form, timeline)
- Secondary content (sidebar, stats)
- Footer / Actions

**Step 3: Map each section to CDS components**
For EACH section, pick the closest CDS component(s):

| Prompt describes... | Use this CDS component |
|---------------------|----------------------|
| Navigation / sidebar / menu | `navigation` |
| Page title, breadcrumbs, description | `pageheading` |
| Section title with action | `sectionheading` |
| Form with fields | `formlayout` (customize fields array) |
| Data table / grid / list of records | `datatable` (customize columns/rows) |
| Cards showing stats / info | `card` (one per stat) |
| Filters / tags / categories | `chip` (multiple) |
| Search input / text input | `textfield` |
| Action buttons | `button` (set variant, color, label) |
| Confirmation dialog / modal | `dialog` |
| Toggle settings / preferences | `switch` or `accordion` |
| Progress / steps / wizard | `stepper` |
| Activity feed / history | `timeline` |
| User avatars / profiles | `avatar` |
| Dropdown / select menus | `select` |
| Loading states | `skeleton` |
| Notifications / alerts | `snackbar` |
| Radio options / single select | `radio` |
| Date selection | `datepicker` |

**Step 4: Build it using `render` with ONE parent frame**

**CRITICAL: Always create ONE parent frame containing all sections.** Never create sections as separate floating frames.

Use the `render` command to build a complete screen with nested components. Construct the JSX by:
1. Creating the outer `<Frame>` with the page dimensions and `flex="col"`
2. Nesting each section as a child `<Frame>`
3. Using CDS token values for ALL colors, spacing, typography, and sizing
4. Getting component JSX from `ds create <component> --json` for reference

### CDS Token Cheat Sheet (Use These Values ALWAYS)

```
COLORS:
  Primary:        #4b3fff    (buttons, active states, links)
  Primary Light:  #7b6bff    (hover backgrounds)
  Primary Dark:   #3829cc    (pressed states)
  Error:          #d33423    (errors, delete buttons)
  Warning:        #ed6c02    (warnings)
  Success:        #2e7d32    (success states)
  Info:           #0288d1    (info messages)
  Text Primary:   #212121    (headings, body text)
  Text Secondary: #666666    (descriptions, labels, placeholders)
  Text Disabled:  #9e9e9e    (disabled text)
  Background:     #ffffff    (page background)
  Paper:          #ffffff    (card/panel background)
  Elevation 1:    #f5f5f5    (table headers, subtle backgrounds)
  Border:         #e0e0e0    (borders, dividers)
  Hover:          #f5f5f5    (row/item hover)
  Selected:       rgba(75,63,255,0.08)  (selected items)

TYPOGRAPHY (font: "DM Sans"):
  Display 1:  80px / 700 weight (hero titles, desktop only)
  Display 2:  60px / 700 weight (secondary heroes)
  H1:         48px / 700 weight (page titles desktop)
  H2:         24px / 700 weight (section titles, mobile page titles)
  H3:         20px / 700 weight (subsection titles, card titles)
  H4:         18px / 700 weight (smaller headings)
  Body Large: 16px / 400 weight (important body text)
  Body Med:   14px / 400 weight (default body text)
  Body Small: 12px / 400 weight (captions, helper text)
  Button:     14px / 700 weight (button labels)
  Overline:   12px / 700 weight (uppercase labels)

SPACING (4px grid):
  4px  (tight)    8px  (small)     12px (compact)
  16px (default)  20px (medium)    24px (comfortable)
  32px (large)    48px (section)   80px (page padding)

SIZING:
  Button:  32px (S)  40px (M)  48px (L)
  Input:   32px (S)  40px (M)  48px (L)
  Icon:    16px (S)  24px (M)  32px (L)  40px (XL)
  Avatar:  24px (S)  40px (M)  56px (L)  96px (XL)
  Nav:     256px (default)  64px (slim)

BORDER RADIUS:
  4px  (small/input/tooltip)
  8px  (medium/button)
  12px (large/card/dialog)
  16px (xlarge/chip)
  9999px (full/circle/pill)

ELEVATION (shadows):
  Cards:    shadow="0 2 8 #0000001a"
  Dropdowns: shadow="0 4 12 #0000001a"
  Dialogs:  shadow="0 8 24 #00000033"
```

### Example: Decomposing a Long Prompt

**User prompt:**
> "Design a User Management screen. It should have a sidebar navigation on the left with items for Dashboard, Users (active), Roles, and Settings. The main content area should have a page heading 'User Management' with breadcrumbs showing Home > Admin > Users. Below the heading there should be a search input, filter chips for Active/Inactive/All, and an 'Add User' button aligned to the right. Then a data table with columns: Name, Email, Role, Status, and Actions. Show 5 sample rows. At the bottom of the table show pagination info."

**Your decomposition:**

1. **Outer layout**: 1440px, horizontal split (nav 256px + content area)
2. **Left**: `navigation` with items [Dashboard, Users, Roles, Settings], activeIndex=1
3. **Right content area**: vertical stack
   - `pageheading` with title="User Management", breadcrumbs=["Home","Admin"]
   - **Filter bar**: horizontal row with `textfield` (search) + `chip` x3 + `button` (Add User)
   - `datatable` with 5 columns and 5 rows
   - **Pagination**: text footer

**Then build as ONE render command:**
```bash
node src/index.js render '<Frame name="User Management" w={1440} h={900} flex="row" bg="#ffffff">
  <Frame name="Sidebar" w={256} h="fill" flex="col" bg="#ffffff" py={8} stroke="#e0e0e0" strokeWidth={1}>
    <Frame w="fill" h={64} flex="row" items="center" px={16} gap={12}>
      <Frame w={32} h={32} bg="#4b3fff" rounded={8} />
      <Text size={16} weight="700" color="#212121">Admin Panel</Text>
    </Frame>
    <Frame w="fill" h={1} bg="#e0e0e0" />
    <Frame w="fill" h={48} flex="row" items="center" px={16} gap={16} rounded={8}>
      <Frame w={24} h={24} bg="#212121" rounded={4} opacity={0.4} />
      <Text size={14} color="#212121">Dashboard</Text>
    </Frame>
    <Frame w="fill" h={48} flex="row" items="center" px={16} gap={16} bg="rgba(75,63,255,0.08)" rounded={8}>
      <Frame w={24} h={24} bg="#4b3fff" rounded={4} opacity={0.4} />
      <Text size={14} weight="700" color="#4b3fff">Users</Text>
    </Frame>
    <Frame w="fill" h={48} flex="row" items="center" px={16} gap={16} rounded={8}>
      <Frame w={24} h={24} bg="#212121" rounded={4} opacity={0.4} />
      <Text size={14} color="#212121">Roles</Text>
    </Frame>
    <Frame w="fill" h={48} flex="row" items="center" px={16} gap={16} rounded={8}>
      <Frame w={24} h={24} bg="#212121" rounded={4} opacity={0.4} />
      <Text size={14} color="#212121">Settings</Text>
    </Frame>
  </Frame>
  <Frame name="Content" grow={1} flex="col" p={32} gap={24}>
    <Frame flex="row" items="center" gap={8}>
      <Text size={14} color="#666666">Home</Text>
      <Text size={14} color="#9e9e9e">/</Text>
      <Text size={14} color="#666666">Admin</Text>
      <Text size={14} color="#9e9e9e">/</Text>
      <Text size={14} weight="500" color="#212121">Users</Text>
    </Frame>
    <Text size={24} weight="700" color="#212121">User Management</Text>
    <Frame name="Filters" w="fill" flex="row" items="center" gap={12}>
      <Frame w={280} h={40} flex="row" items="center" px={12} bg="#ffffff" stroke="#e0e0e0" strokeWidth={1} rounded={4} grow={1}>
        <Text size={14} color="#9e9e9e">Search users...</Text>
      </Frame>
      <Frame h={32} px={12} flex="row" items="center" bg="rgba(75,63,255,0.08)" rounded={16}>
        <Text size={13} weight="500" color="#4b3fff">Active</Text>
      </Frame>
      <Frame h={32} px={12} flex="row" items="center" bg="#e0e0e0" rounded={16}>
        <Text size={13} weight="500" color="#212121">Inactive</Text>
      </Frame>
      <Frame h={32} px={12} flex="row" items="center" bg="#e0e0e0" rounded={16}>
        <Text size={13} weight="500" color="#212121">All</Text>
      </Frame>
      <Frame h={40} px={16} flex="row" items="center" bg="#4b3fff" rounded={8}>
        <Text size={14} weight="700" color="#ffffff">Add User</Text>
      </Frame>
    </Frame>
    <Frame name="Table" w="fill" flex="col" stroke="#e0e0e0" strokeWidth={1} rounded={8} overflow="hidden">
      <Frame w="fill" flex="row" bg="#f5f5f5">
        <Frame w={200} h={48} flex="row" items="center" px={16}><Text size={14} weight="700" color="#212121">Name</Text></Frame>
        <Frame w={240} h={48} flex="row" items="center" px={16}><Text size={14} weight="700" color="#212121">Email</Text></Frame>
        <Frame w={140} h={48} flex="row" items="center" px={16}><Text size={14} weight="700" color="#212121">Role</Text></Frame>
        <Frame w={120} h={48} flex="row" items="center" px={16}><Text size={14} weight="700" color="#212121">Status</Text></Frame>
        <Frame grow={1} h={48} flex="row" items="center" px={16}><Text size={14} weight="700" color="#212121">Actions</Text></Frame>
      </Frame>
      <Frame w="fill" flex="row" stroke="#e0e0e0" strokeWidth={1}>
        <Frame w={200} h={52} flex="row" items="center" px={16}><Text size={14} color="#212121">Sarah Johnson</Text></Frame>
        <Frame w={240} h={52} flex="row" items="center" px={16}><Text size={14} color="#212121">sarah@company.com</Text></Frame>
        <Frame w={140} h={52} flex="row" items="center" px={16}><Text size={14} color="#212121">Admin</Text></Frame>
        <Frame w={120} h={52} flex="row" items="center" px={16}><Frame h={24} px={8} bg="#2e7d32" rounded={12}><Text size={12} color="#ffffff">Active</Text></Frame></Frame>
        <Frame grow={1} h={52} flex="row" items="center" px={16}><Text size={12} color="#4b3fff">Edit</Text></Frame>
      </Frame>
      <Frame w="fill" flex="row" stroke="#e0e0e0" strokeWidth={1}>
        <Frame w={200} h={52} flex="row" items="center" px={16}><Text size={14} color="#212121">Mike Chen</Text></Frame>
        <Frame w={240} h={52} flex="row" items="center" px={16}><Text size={14} color="#212121">mike@company.com</Text></Frame>
        <Frame w={140} h={52} flex="row" items="center" px={16}><Text size={14} color="#212121">Editor</Text></Frame>
        <Frame w={120} h={52} flex="row" items="center" px={16}><Frame h={24} px={8} bg="#2e7d32" rounded={12}><Text size={12} color="#ffffff">Active</Text></Frame></Frame>
        <Frame grow={1} h={52} flex="row" items="center" px={16}><Text size={12} color="#4b3fff">Edit</Text></Frame>
      </Frame>
      <Frame w="fill" flex="row" stroke="#e0e0e0" strokeWidth={1}>
        <Frame w={200} h={52} flex="row" items="center" px={16}><Text size={14} color="#212121">Lisa Park</Text></Frame>
        <Frame w={240} h={52} flex="row" items="center" px={16}><Text size={14} color="#212121">lisa@company.com</Text></Frame>
        <Frame w={140} h={52} flex="row" items="center" px={16}><Text size={14} color="#212121">Viewer</Text></Frame>
        <Frame w={120} h={52} flex="row" items="center" px={16}><Frame h={24} px={8} bg="#9e9e9e" rounded={12}><Text size={12} color="#ffffff">Inactive</Text></Frame></Frame>
        <Frame grow={1} h={52} flex="row" items="center" px={16}><Text size={12} color="#4b3fff">Edit</Text></Frame>
      </Frame>
    </Frame>
    <Frame w="fill" flex="row" items="center" justify="between">
      <Text size={12} color="#666666">Showing 1-3 of 48 users</Text>
      <Frame flex="row" gap={8}>
        <Frame w={32} h={32} flex="row" items="center" justify="center" stroke="#e0e0e0" strokeWidth={1} rounded={4}><Text size={12} color="#666666">←</Text></Frame>
        <Frame w={32} h={32} flex="row" items="center" justify="center" bg="#4b3fff" rounded={4}><Text size={12} color="#ffffff">1</Text></Frame>
        <Frame w={32} h={32} flex="row" items="center" justify="center" stroke="#e0e0e0" strokeWidth={1} rounded={4}><Text size={12} color="#212121">2</Text></Frame>
        <Frame w={32} h={32} flex="row" items="center" justify="center" stroke="#e0e0e0" strokeWidth={1} rounded={4}><Text size={12} color="#212121">3</Text></Frame>
        <Frame w={32} h={32} flex="row" items="center" justify="center" stroke="#e0e0e0" strokeWidth={1} rounded={4}><Text size={12} color="#666666">→</Text></Frame>
      </Frame>
    </Frame>
  </Frame>
</Frame>'
```

### Rules for Building Screens from Prompts

1. **ALWAYS use ONE parent frame** with `flex="col"` or `flex="row"` for the whole screen
2. **ALWAYS use CDS token values** from the cheat sheet above — never guess colors or sizes
3. **ALWAYS use `w="fill"` on child sections** so they stretch to parent width
4. **Use semantic naming**: name each `<Frame>` clearly (e.g. "Sidebar", "FilterBar", "Table")
5. **For layouts with sidebars**: outer frame `flex="row"`, sidebar fixed width, content `grow={1}`
6. **For stacked sections**: outer frame `flex="col"`, each section `w="fill"`
7. **Button sizing**: 40px height (medium) is the default, use 48px for primary CTAs
8. **Text hierarchy**: H2 (24px) for page title, H3 (20px) for section title, 14px for body
9. **Consistent spacing**: 32px page padding, 24px between sections, 16px within components, 8px tight gaps
10. **Status badges**: use small rounded frames with semantic colors (green=active, red=error, gray=inactive)
11. **If the prompt mentions responsive/mobile**: create a second frame at 375px width with stacked layout, larger touch targets (48px), and simplified navigation
12. **If the prompt mentions dark mode**: swap background to #121212, paper to #1e1e1e, text to rgba(255,255,255,0.87), borders to rgba(255,255,255,0.12)

### Handling Ambiguity in Prompts

- If the prompt says "table" or "list of items" → use `datatable` or build a custom table with `<Frame>` rows
- If the prompt says "form" → use `formlayout` or build custom with `textfield` components
- If the prompt says "navigation" without specifics → default to left sidebar (256px)
- If the prompt says "cards" without count → create 3 cards in a row
- If the prompt says "responsive" → create both desktop (1440px) and mobile (375px) versions
- If the prompt doesn't specify colors → use CDS defaults (primary=#4b3fff, bg=#ffffff)
- If the prompt says "modern" / "clean" → CDS already IS clean and modern, just use it
- If the prompt mentions specific data → use that data in the components (table rows, card titles, etc.)
- If the prompt says "like Google/Material" → CDS is Material-based, so you're already matching

### Building Multiple Screens

If the prompt describes multiple screens (e.g. "create the user list screen AND the user detail screen"):
1. Build each screen as a separate `render` command
2. Smart positioning will place them side-by-side automatically
3. Name each frame clearly: "User List", "User Detail"

---

## IMPORTANT: After Setup Show These Examples

When setup is complete, show ONLY natural language examples:

```
Ready! Your CDS Design System is loaded (322 tokens, 26 components).

Try asking:

  "Create a button"
  "Design a login form"
  "Build a dashboard page"
  "Push design tokens to Figma"
  "Show all card variants"
  "What's our primary color?"
  "Create a navigation sidebar"
  "Make a mobile settings page"
```

**NEVER show `node src/index.js` commands. NEVER.** The user just talks. You run commands.

---

## IMPORTANT: Creating a Full Webpage in Figma

When user asks to "create a website", "design a landing page", or similar:

### Step 1: Create Design System First
```bash
node src/index.js tokens ds
```
This creates IDS Base colors: gray, primary (blue), accent (purple), plus semantic colors.

### Step 2: Create Page Frame with Sections Inside

**CRITICAL:** Always create ONE parent frame with vertical auto-layout that contains all sections.

```bash
# RECOMMENDED: One frame with all sections nested inside
node src/index.js render '<Frame name="Landing Page" w={1440} flex="col" bg="#0a0a0f">
  <Frame name="Hero" w="fill" h={800} flex="col" justify="center" items="center" gap={24} p={80}>
    <Text size={64} weight="bold" color="#fff">Headline</Text>
    <Text size={20} color="#a1a1aa">Subheadline</Text>
    <Frame bg="#3b82f6" px={32} py={16} rounded={8}><Text size={16} weight="medium" color="#fff">CTA Button</Text></Frame>
  </Frame>
  <Frame name="Features" w="fill" flex="row" gap={40} p={80} bg="#111">
    <Frame flex="col" gap={12} grow={1}><Text size={24} weight="bold" color="#fff">Feature 1</Text></Frame>
    <Frame flex="col" gap={12} grow={1}><Text size={24} weight="bold" color="#fff">Feature 2</Text></Frame>
    <Frame flex="col" gap={12} grow={1}><Text size={24} weight="bold" color="#fff">Feature 3</Text></Frame>
  </Frame>
  <Frame name="Footer" w="fill" h={200} flex="col" justify="center" items="center" bg="#0a0a0f">
    <Text size={14} color="#71717a">© 2024 Company</Text>
  </Frame>
</Frame>'
```

**Why one parent frame?**
- Responsive: Parent can resize, children adapt with `w="fill"`
- Exportable: One frame = one design
- Organized: Clear hierarchy in layers panel

### If Sections Already Exist Separately

Wrap existing sections in a parent frame:
```bash
node src/index.js eval "(function() {
  const sectionNames = ['Hero', 'Features', 'Footer'];
  const sections = sectionNames.map(name => figma.currentPage.findOne(n => n.name.includes(name))).filter(Boolean);
  if (sections.length === 0) return 'No sections found';

  const page = figma.createFrame();
  page.name = 'Landing Page';
  page.x = sections[0].x;
  page.y = sections[0].y;
  page.layoutMode = 'VERTICAL';
  page.primaryAxisSizingMode = 'AUTO';
  page.counterAxisSizingMode = 'FIXED';
  page.resize(1440, 100);
  page.fills = sections[0].fills;

  sections.forEach(s => {
    s.x = 0; s.y = 0;
    page.appendChild(s);
    s.layoutSizingHorizontal = 'FILL';
  });

  return 'Created page with ' + sections.length + ' sections';
})()"
```

### Step 3: Use Variables for Colors

After creating, bind colors to variables:
```bash
node src/index.js bind fill "background/default"
node src/index.js bind fill "primary/500" -n "BUTTON_ID"
```

### Design Tips for Webpages
- **Hero:** Full-width, centered content, big headline, CTA button
- **Sections:** Consistent width (1440px desktop, 375px mobile)
- **Dark themes:** Use gray/900-950 for backgrounds, gray/100-300 for text
- **Light themes:** Use white/gray-50 for backgrounds, gray/800-950 for text
- **Spacing:** Use 80px padding for sections, 24-40px gaps between elements

---

## IMPORTANT: When User Says "Initiate Project"

Run these steps:

### Step 1: Install dependencies
```bash
npm install
```

### Step 2: Connect to Figma
```bash
node src/index.js connect
```

This command **NEVER closes, kills, or restarts Figma**. It only:
- Checks if Figma's debug port is reachable
- If Figma isn't running at all → starts it (fresh start, no kill)
- If Figma is running without debug port → asks user to quit and reopen manually
- If Figma is running with debug port → uses it as-is

### If user provides a Figma file URL:
```bash
node src/index.js connect "https://www.figma.com/design/abc123/My-File"
```
This navigates to that file without touching Figma itself.

### If no URL is provided:
The agent should ask: "Share a Figma file URL so I can connect to the right file."

If permission error → user needs Full Disk Access (see below).

### Step 3: Show examples
When connected, show:
```
Ready! CDS Design System loaded (322 tokens, 26 components).

Share a Figma file link and try:
  "Create a button"
  "Design a login form"
  "Build me a dashboard"
```

---

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

## After Setup: Show Natural Language Examples

When setup is complete, show ONLY natural language examples. **NEVER show CLI commands.**

```
Ready! CDS Design System loaded (322 tokens, 26 components).

Try:
  "Create a button"
  "Design a login form"
  "Build me a dashboard"
  "Push design tokens to Figma"
  "What's our primary color?"
  "Create a card with title and image"
  "Show all button variants"
  "Make a mobile settings page"
```

**CRITICAL: NEVER show `node src/index.js` commands to the user. They type natural language. You silently run the right commands and report results in plain English.**

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
3. **NEVER use `npx figma-use render` directly** - It has NO smart positioning! Always use `node src/index.js render`
4. **Use `eval` ONLY for**: Variable bindings, deletions, moves, property changes on existing nodes
5. **For multiple frames**: Use `render-batch` with JSON array (one process, fast)
6. **Convert frames to components**: `node src/index.js node to-component "id1" "id2"`
7. **Always verify with `node tree`**: Check all children are present after creation

## CRITICAL: Smart Positioning

The `render` command automatically positions new frames to the RIGHT of existing content (100px gap).

```bash
# CORRECT - uses smart positioning
node src/index.js render '<Frame name="Card" w={300} h={200} bg="#fff" p={24}><Text>Hello</Text></Frame>'

# WRONG - will overlap at (0,0)
node src/index.js eval "const f = figma.createFrame(); f.name = 'Card';"

# WRONG - npx figma-use has NO smart positioning!
npx figma-use render --stdin  # DON'T USE THIS DIRECTLY
```

**IMPORTANT:** Never use `npx figma-use render` directly. Always use `node src/index.js render` which wraps it with smart positioning.

## CRITICAL: Multiple Frames = Use render-batch

**NEVER call render multiple times in a loop** - each call spawns a new process (slow).

For multiple frames, use `render-batch` with a JSON array:
```bash
# Horizontal layout (default)
node src/index.js render-batch '[
  "<Frame name=\"Card 1\" w={300} h={200} bg=\"#fff\" p={24}><Text>Card 1</Text></Frame>",
  "<Frame name=\"Card 2\" w={300} h={200} bg=\"#fff\" p={24}><Text>Card 2</Text></Frame>"
]'

# Vertical layout (use -d col)
node src/index.js render-batch '[
  "<Frame name=\"Card 1\" w={300} h={200} bg=\"#fff\" p={24}><Text>Card 1</Text></Frame>",
  "<Frame name=\"Card 2\" w={300} h={200} bg=\"#fff\" p={24}><Text>Card 2</Text></Frame>"
]' -d col

# Custom gap
node src/index.js render-batch '[...]' -g 24
```

Options:
- `-d row` - Horizontal layout (default)
- `-d col` - Vertical layout
- `-g <n>` - Gap between frames (default: 40)

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

"Export node as JSX/React code"
```bash
node src/index.js export-jsx "1:234"              # Output to stdout
node src/index.js export-jsx "1:234" --pretty     # Formatted output
node src/index.js export-jsx "1:234" -o Card.jsx  # Save to file
node src/index.js export-jsx --match-icons        # Match vectors to Iconify
```

"Export components as Storybook stories"
```bash
node src/index.js export-storybook "1:234"
node src/index.js export-storybook "1:234" -o Button.stories.jsx
```

### Design Analysis & Linting

"Lint design for issues"
```bash
node src/index.js lint                          # Check all rules
node src/index.js lint --fix                    # Auto-fix issues
node src/index.js lint --rule color-contrast    # Specific rule
node src/index.js lint --preset accessibility   # Use preset
node src/index.js lint --json                   # JSON output
```

Available presets: `recommended`, `strict`, `accessibility`, `design-system`

Available lint rules:
- `no-default-names` - detect unnamed layers
- `no-deeply-nested` - flag excessive nesting
- `no-empty-frames` - find empty frames
- `prefer-auto-layout` - suggest auto-layout
- `no-hardcoded-colors` - check variable usage
- `color-contrast` - WCAG AA/AAA compliance
- `touch-target-size` - minimum 44x44 check
- `min-text-size` - minimum 12px text

"Analyze color usage"
```bash
node src/index.js analyze colors          # Human readable
node src/index.js analyze colors --json   # JSON output
```

"Analyze typography"
```bash
node src/index.js analyze typography
node src/index.js analyze type --json     # alias
```

"Analyze spacing (gap/padding)"
```bash
node src/index.js analyze spacing
```

"Find repeated patterns (potential components)"
```bash
node src/index.js analyze clusters
```

### Node Operations

"Show node tree structure"
```bash
node src/index.js node tree              # Current selection
node src/index.js node tree "1:234"      # Specific node
node src/index.js node tree -d 5         # Deeper depth
```

"Show variable bindings"
```bash
node src/index.js node bindings          # Current selection
node src/index.js node bindings "1:234"  # Specific node
```

"Convert frames to components"
```bash
node src/index.js node to-component "1:234" "1:235" "1:236"
```

"Delete nodes by ID"
```bash
node src/index.js node delete "1:234"
node src/index.js node delete "1:234" "1:235"
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

### Render Command Reference (figma-use)

**Uses `figma-use render` under the hood - full JSX support!**

**Elements:**
- `<Frame>` - Auto-layout frame
- `<Rectangle>` - Rectangle shape
- `<Ellipse>` - Circle/oval
- `<Text>` - Text layer
- `<Line>` - Line
- `<Image>` - Image (with src URL)
- `<SVG>` - SVG (with src URL or inline)
- `<Icon>` - Lucide icon
- `<Instance>` - Component instance

**Size & Position:**
```jsx
w={320} h={200}        // Fixed size
w="fill" h="fill"      // Fill parent
minW={100} maxW={500}  // Constraints
x={100} y={50}         // Position
```

**Layout (Auto-layout):**
```jsx
flex="row"             // Direction: "row" | "col"
gap={16}               // Spacing between items
wrap={true}            // Enable flex wrap
justify="between"      // Main axis: "start" | "center" | "end" | "between"
items="center"         // Cross axis: "start" | "center" | "end"
p={24}                 // Padding all sides
px={16} py={8}         // Padding x/y axis
pt={8} pr={16}...      // Individual padding
stretch={true}         // Stretch to fill cross-axis
grow={1}               // Flex grow
```

**Appearance:**
```jsx
bg="#3B82F6"           // Fill color
stroke="#E4E4E7"       // Stroke color
strokeWidth={1}        // Stroke thickness
opacity={0.5}          // Opacity
```

**Corners & Effects:**
```jsx
rounded={16}           // Corner radius
roundedTL={8}          // Individual corners
overflow="hidden"      // Clip content (important!)
shadow="0 4 12 #0001"  // Drop shadow
blur={10}              // Layer blur
rotate={45}            // Rotation
```

**Text:**
```jsx
<Text size={18} weight="bold" color="#000" font="Inter">Hello</Text>
```

### Auto-Layout Best Practices

**IMPORTANT:** To avoid clipped/cut-off content:

1. **Don't set fixed w/h** unless you specifically want fixed size
2. **Use `w="fill"`** for nested frames/text that should fill parent width
3. **Only use `overflow="hidden"`** when you want clipping

```bash
# GOOD: Gallery that grows with content (no fixed size)
node src/index.js render '<Frame name="Gallery" flex="row" gap={24} p={40} bg="#f4f4f5">
  <Frame name="Card 1" w={200} h={150} bg="#fff" rounded={8} />
  <Frame name="Card 2" w={200} h={150} bg="#fff" rounded={8} />
</Frame>'

# BAD: Fixed size = content may be clipped
<Frame w={800} h={400} overflow="hidden">
```

**NOTE:** For component instances, use `eval` - see "Using Component Instances" below.

### Using Component Instances

**NOTE:** `<Instance>` does NOT work with `render` command. Use `eval` instead:

```bash
# Create instance of a component by name
node src/index.js eval "(function() {
  const comp = figma.currentPage.findOne(n => n.type === 'COMPONENT' && n.name === 'Button - Primary');
  if (!comp) return 'Component not found';
  const instance = comp.createInstance();
  instance.x = 100;
  instance.y = 100;
  return instance.id;
})()"
```

To create a frame WITH component instances inside:
```bash
# Step 1: Create the container frame
node src/index.js render '<Frame name="Form" w={400} h={300} bg="#fff" flex="col" gap={16} p={24} />'

# Step 2: Add instances via eval
node src/index.js eval "(function() {
  const frame = figma.currentPage.findOne(n => n.name === 'Form');
  const button = figma.currentPage.findOne(n => n.type === 'COMPONENT' && n.name === 'Button - Primary');
  if (frame && button) {
    const instance = button.createInstance();
    frame.appendChild(instance);
  }
  return 'Done';
})()"
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
