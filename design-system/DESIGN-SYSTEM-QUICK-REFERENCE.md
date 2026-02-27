# Design System Quick Reference Guide

**One-page cheat sheet for designers and developers**

---

## 🎨 Foundation Tokens

### Spacing (4px Grid)
```css
--spacing/0: 0px     --spacing/1: 4px    --spacing/2: 8px
--spacing/3: 12px    --spacing/4: 16px ★ --spacing/5: 20px
--spacing/6: 24px    --spacing/8: 32px   --spacing/12: 48px
```
★ Most common: `--spacing/4` (16px)

### Typography
```css
Display 1: 80px (page titles, desktop)
H1: 48px    H2: 24px ★   H3: 20px    H4: 18px
H5: 14px    H6: 12px
Body Large: 16px    Body Medium: 14px ★    Body Small: 12px
Caption: 12px    Overline: 12px uppercase
```
★ Most common: Body Medium 14px, H2 24px

### Colors
```css
Primary: #4b3fff
Error: #d33423    Warning: #ed6c02    Success: #2e7d32    Info: #0288d1

Text Primary: rgba(0,0,0,0.87)
Text Secondary: rgba(0,0,0,0.6)
Text Disabled: rgba(0,0,0,0.38)

Background Default: #ffffff
Background Paper: #ffffff
```

### Common Sizes
```css
Button/Input: 32px (S)  40px (M) ★  48px (L)
Icon: 16px (S)  24px (M) ★  32px (L)  40px (XL)
Avatar: 24px (S)  40px (M)  56px (L)  96px (XL)
```

### Border Radius
```css
None: 0    Small: 4px    Medium: 8px ★    Large: 12px
XLarge: 16px    Full: 9999px (circle)
```

### Elevation (Shadows)
```css
0: None    1: Nav/Sidebar    2: Cards ★    4: Dropdowns
6: Snackbar    8: FAB    12: Dialog    24: Critical
```

### Breakpoints
```css
xs: 0px    sm: 600px    md: 900px    lg: 1200px    xl: 1536px
Mobile: <768px    Tablet: 768-1199px    Desktop: 1200px+
```

---

## 🧩 Component Quick Selector

### Buttons
| Need | Use | Size |
|------|-----|------|
| Primary action | Contained | 40px (M) |
| Secondary action | Outlined | 40px (M) |
| Inline/tertiary | Text | 40px (M) |
| Icon only | Icon Button | 40px (M) |
| Floating primary | FAB | 56×56px |

**States:** Default, Hover, Active, Focus, Disabled, Loading

### Text Inputs
| Type | Use | Input |
|------|-----|-------|
| General text | Most forms | `<input type="text">` |
| Email | Email addresses | `<input type="email">` |
| Password | Passwords | `<input type="password">` |
| Long text | Comments, bio | `<textarea>` |
| Date | Date selection | Date Picker component |

**Variants:** Filled (default), Outlined, Standard
**Sizes:** 32px (S), 40px (M) ★, 48px (L)

### Feedback & Notifications
| Need | Use | Dismissal |
|------|-----|-----------|
| Brief confirmation | Snackbar | Auto (4-7s) |
| Important message | Dialog | User action |
| Helpful tip | Tooltip | Auto on hover |
| Form error | Inline error | Persistent |

### Navigation
| Need | Use | Width |
|------|-----|-------|
| App navigation | Sidenav | 256px (default) |
| Location hierarchy | Breadcrumbs | Auto width |
| Multi-step process | Stepper | Full width |
| Filters/categories | Chips | Auto width |

### Data Display
| Need | Use | Layout |
|------|-----|--------|
| Tabular data | Data Table | Full width |
| Event timeline | Timeline | Vertical |
| Content cards | Card | 280px+ |
| Progress steps | Stepper | Horizontal |

---

## 📱 Responsive Rules

### Mobile (<768px)
- Full-width inputs and buttons
- Input height: 48px minimum (touch targets)
- Font size: 16px minimum (prevents zoom on iOS)
- Stack all multi-column layouts vertically
- Hide/collapse navigation → drawer overlay
- Use bottom sheets for dialogs

### Tablet (768-1199px)
- Reduce spacing by 25%
- 2-column layouts OK for simple forms
- Standard input height: 40px
- Navigation can be slim or full

### Desktop (1200px+)
- Maximum container width: 1200px
- Comfortable spacing (24-32px)
- Multi-column layouts
- Full navigation visible
- Hover states active

---

## ♿ Accessibility Checklist

### Every Interactive Element
- [ ] Min 44×44px touch target
- [ ] 4.5:1 contrast ratio (text)
- [ ] Visible focus indicator
- [ ] Keyboard accessible
- [ ] ARIA label or text

### Forms
- [ ] Every input has a `<label>`
- [ ] Required fields marked
- [ ] Error messages clear and specific
- [ ] Error announced to screen readers
- [ ] `aria-invalid="true"` on errors

### Buttons
- [ ] Use `<button>` not `<div>`
- [ ] Include text or `aria-label`
- [ ] Disabled state: `disabled` + `aria-disabled="true"`
- [ ] Loading state: `aria-busy="true"`

### Modals/Dialogs
- [ ] `role="dialog"` and `aria-modal="true"`
- [ ] Focus trapped inside
- [ ] Escape key closes
- [ ] Focus returns to trigger on close

### Images
- [ ] `alt` text on all images
- [ ] Decorative images: `alt=""`
- [ ] Complex images: detailed description

---

## 🎯 Common Patterns

### Form Field
```html
<label for="email">Email *</label>
<input id="email" type="email" required aria-invalid="false">
<span class="helper">We'll never share your email</span>
<span class="error" role="alert">Please enter a valid email</span>
```

### Button Group
```html
<div class="button-group">
  <button class="outlined">Cancel</button>
  <button class="contained">Submit</button>
</div>
```

### Card
```html
<div class="card">
  <header>
    <h3>Card Title</h3>
    <button aria-label="More options">⋮</button>
  </header>
  <div class="content">Card content here</div>
  <footer>
    <button>Action 1</button>
    <button>Action 2</button>
  </footer>
</div>
```

### Snackbar
```html
<div role="status" aria-live="polite" class="snackbar">
  <span>Item saved successfully</span>
  <button>Undo</button>
  <button aria-label="Close">×</button>
</div>
```

---

## 🚫 Common Mistakes

### Don'ts
❌ Don't use placeholders as labels
❌ Don't make all fields required
❌ Don't use color alone to convey meaning
❌ Don't nest buttons or links
❌ Don't use `<div>` for buttons
❌ Don't hide focus outlines
❌ Don't forget mobile optimization
❌ Don't use tiny touch targets (<44px)
❌ Don't hardcode values (use tokens)
❌ Don't skip heading levels (H2 → H4)

### Do's
✅ Always label form fields
✅ Mark required fields clearly
✅ Provide clear error messages
✅ Use semantic HTML
✅ Support keyboard navigation
✅ Test with screen readers
✅ Design mobile-first
✅ Use design tokens
✅ Maintain heading hierarchy
✅ Provide sufficient contrast

---

## 🎨 Design Tokens Usage

### In CSS
```css
.button {
  height: var(--sizing/button/medium);
  padding: 0 var(--spacing/4);
  background: var(--colors/primary/main);
  color: var(--colors/primary/contrast-text);
  border-radius: var(--border-radius/button);
  font: var(--typography/button/medium);
  transition: background-color var(--transition/duration/shortest);
}
```

### In Figma
1. Use Variables panel
2. Search for token name
3. Apply to property
4. Variables auto-update everywhere

---

## 📏 Layout Grid

### Container Max Widths
```
xs: 444px    sm: 600px    md: 900px
lg: 1200px ★    xl: 1536px
```

### Page Padding
```
Mobile: 16px
Tablet: 24px
Desktop: 32px
```

### Section Spacing
```
Mobile: 32px
Desktop: 48-64px
```

---

## 🔤 Typography Scale

### Hierarchy
```
Page Title (H1): 48-80px
Section Title (H2): 24px
Subsection (H3): 20px
Component Title (H4): 18px
Small Section (H5): 14px
Tiny Heading (H6): 12px

Body Text: 14-16px
Caption: 12px
```

### Line Height
```
Tight: 1.2 (headings)
Normal: 1.5 (body text)
Loose: 1.8 (long-form)
```

---

## 🎭 State Indicators

### Interactive States
```css
Default    → Base appearance
Hover      → +brightness, cursor: pointer
Active     → Pressed, darker
Focus      → Outline, keyboard navigation
Disabled   → Opacity 0.38, cursor: not-allowed
Loading    → Spinner, disabled
```

### Status Colors
```
Success: Green (#2e7d32)
Error: Red (#d33423)
Warning: Orange (#ed6c02)
Info: Blue (#0288d1)
```

---

## 🔍 Finding the Right Component

### Flowchart

**User Action Needed?**
- Yes → Button, Chip (action), or Link
- No → Continue

**Collecting Input?**
- Yes → Text Field, Select, Date Picker, Checkbox, Radio
- No → Continue

**Showing Feedback?**
- Brief → Snackbar (toast)
- Important → Dialog (modal)
- Tip → Tooltip
- No → Continue

**Navigation?**
- App sections → Sidenav
- Location → Breadcrumbs
- Steps → Stepper
- No → Continue

**Displaying Data?**
- Table → Data Table
- Timeline → Timeline
- Cards → Card
- No → Continue

**Content Organization?**
- Page → Page Heading
- Section → Section Heading
- Group → Card or Fieldset

---

## 📦 Component Combinations

### Login Form
```
Page Heading
  ↓
Form Layout (single-column)
  ↓
Text Field (email)
Text Field (password)
  ↓
Button (contained, primary)
  ↓
Snackbar (success/error feedback)
```

### Settings Page
```
Page Heading + Actions
  ↓
Section Headings (H5)
  ↓
Form Fields (grouped)
  ↓
Buttons (save/cancel)
  ↓
Snackbar (confirmation)
```

### Dashboard
```
Navigation (Sidenav)
  ↓
Page Heading
  ↓
Cards (metrics)
  ↓
Data Table (recent activity)
```

---

## ⚡ Performance Tips

1. **Lazy load** heavy components (tables, modals)
2. **Virtualize** long lists (1000+ items)
3. **Debounce** search/filter inputs (300ms)
4. **Optimize** images (WebP, lazy load)
5. **Minimize** animations on low-end devices
6. **Cache** frequently used data
7. **Paginate** large datasets (25-50 items)

---

## 🧪 Testing Checklist

### Visual Testing
- [ ] All breakpoints (mobile, tablet, desktop)
- [ ] Light and dark themes
- [ ] All component states
- [ ] Print styles

### Functional Testing
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader (NVDA, JAWS, VoiceOver)
- [ ] Touch gestures (mobile)
- [ ] Forms submit correctly
- [ ] Validation works

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Android)

---

## 📖 Documentation Links

- **Full Documentation:** `DESIGN-SYSTEM-MASTER-INDEX.md`
- **Token Specification:** `design-system-tokens.ts`
- **Migration Guide:** `DESIGN-SYSTEM-MIGRATION-README.md`
- **Component Checklists:** `COMPONENT-MIGRATION-CHECKLISTS.md`

---

## 🚀 Quick Start

1. **Review this cheat sheet**
2. **Check Foundation Tokens** (spacing, typography, colors)
3. **Use Component Quick Selector** to find right component
4. **Apply Responsive Rules** for all breakpoints
5. **Verify Accessibility Checklist** before launch
6. **Test across devices and browsers**

---

**Need More Details?** See full documentation in `DESIGN-SYSTEM-MASTER-INDEX.md`

**Version:** 1.0.0 | **Date:** 2026-02-26