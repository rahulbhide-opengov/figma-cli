/**
 * Component Registry
 *
 * Maps design system components to Figma JSX blueprints.
 * Each component reads token values from ds-engine.js so
 * generated designs always match the design system spec.
 *
 * Components: Button, TextField, Card, Dialog, Tooltip, Snackbar,
 * Chip, Breadcrumb, Navigation, Timeline, Stepper, DatePicker,
 * DataTable, PageHeading, SectionHeading, FormLayout, Avatar,
 * Accordion, Radio, Switch, ToggleButton, Select, Skeleton,
 * List, ButtonGroup, IconButton
 */

import dsEngine from './ds-engine.js';

const { resolveToken, px, toHex, getOpacity, getComponentTokens, getTypographyStyle, getColorGroup } = dsEngine;

// Shorthand helpers
const t = (name) => resolveToken(name) || '';
const h = (name) => toHex(name);
const p = (name) => px(name);

// Common token references
function colors(theme = 'light') {
  return {
    primary: h('--colors/primary/main'),
    primaryLight: h('--colors/primary/light'),
    primaryDark: h('--colors/primary/dark'),
    primaryContrast: h('--colors/primary/contrast-text'),
    secondary: h('--colors/secondary/main'),
    error: h('--colors/error/main'),
    errorContrast: h('--colors/error/contrast-text'),
    warning: h('--colors/warning/main'),
    success: h('--colors/success/main'),
    info: h('--colors/info/main'),
    textPrimary: h('--colors/text/primary'),
    textSecondary: h('--colors/text/secondary'),
    textDisabled: h('--colors/text/disabled'),
    bgDefault: h('--colors/background/default'),
    bgPaper: h('--colors/background/paper'),
    bgElevation1: h('--colors/background/paper-elevation-1'),
    border: h('--colors/border/default'),
    borderFocus: h('--colors/border/focus'),
    divider: h('--colors/divider'),
    actionHover: h('--colors/action/hover'),
    actionSelected: h('--colors/action/selected'),
    actionDisabled: h('--colors/action/disabled'),
    actionDisabledBg: h('--colors/action/disabled-background'),
  };
}

function radius(name) {
  return p(`--border-radius/${name}`);
}

function spacing(n) {
  return p(`--spacing/${n}`);
}

// ============================================================================
// COMPONENT BLUEPRINTS
// ============================================================================

const components = {};

// ---------------------------------------------------------------------------
// BUTTON
// ---------------------------------------------------------------------------
components.button = {
  name: 'Button',
  description: 'Primary action button with contained, outlined, and text variants',
  variants: ['contained', 'outlined', 'text'],
  sizes: ['small', 'medium', 'large'],

  render({ variant = 'contained', size = 'medium', label = 'Button', color = 'primary', disabled = false } = {}) {
    const c = colors();
    const h = p(`--sizing/button/${size}`);
    const typo = getTypographyStyle(`button/${size}`);
    const fontSize = typo ? parseInt(typo['font-size']) : 14;
    const fontWeight = typo ? typo['font-weight'] : '700';
    const r = radius('button');
    const px_pad = size === 'small' ? 12 : size === 'large' ? 24 : 16;

    const colorMap = {
      primary: { bg: c.primary, text: c.primaryContrast, border: c.primary },
      secondary: { bg: c.secondary, text: '#ffffff', border: c.secondary },
      error: { bg: c.error, text: c.errorContrast, border: c.error },
    };
    const col = colorMap[color] || colorMap.primary;

    if (disabled) {
      col.bg = c.actionDisabledBg;
      col.text = c.actionDisabled;
      col.border = c.actionDisabledBg;
    }

    if (variant === 'contained') {
      return `<Frame name="Button/${variant}/${size}" h={${h}} flex="row" items="center" justify="center" px={${px_pad}} bg="${col.bg}" rounded={${r}} gap={8}>
  <Text size={${fontSize}} weight="${fontWeight}" color="${col.text}">${label}</Text>
</Frame>`;
    }

    if (variant === 'outlined') {
      return `<Frame name="Button/${variant}/${size}" h={${h}} flex="row" items="center" justify="center" px={${px_pad}} bg="${c.bgDefault}" stroke="${col.border}" strokeWidth={1} rounded={${r}} gap={8}>
  <Text size={${fontSize}} weight="${fontWeight}" color="${col.bg}">${label}</Text>
</Frame>`;
    }

    // text variant
    return `<Frame name="Button/${variant}/${size}" h={${h}} flex="row" items="center" justify="center" px={${px_pad}} rounded={${r}} gap={8}>
  <Text size={${fontSize}} weight="${fontWeight}" color="${col.bg}">${label}</Text>
</Frame>`;
  },

  renderAll() {
    const items = [];
    for (const variant of this.variants) {
      for (const size of this.sizes) {
        items.push(this.render({ variant, size, label: `${variant} ${size}` }));
      }
    }
    return items;
  }
};

// ---------------------------------------------------------------------------
// TEXT FIELD
// ---------------------------------------------------------------------------
components.textfield = {
  name: 'Text Field',
  description: 'Form input with filled, outlined, and standard variants',
  variants: ['filled', 'outlined'],
  sizes: ['small', 'medium', 'large'],

  render({ variant = 'outlined', size = 'medium', label = 'Label', placeholder = 'Enter text...', error = false, helperText = '' } = {}) {
    const c = colors();
    const inputH = p(`--sizing/input/${size}`);
    const r = radius('input');
    const labelStyle = getTypographyStyle(`input/label/${size}`) || {};
    const labelSize = parseInt(labelStyle['font-size'] || '14');
    const bodyStyle = getTypographyStyle('body/medium') || {};
    const bodySize = parseInt(bodyStyle['font-size'] || '14');
    const helperStyle = getTypographyStyle('helper-text') || {};
    const helperSize = parseInt(helperStyle['font-size'] || '12');
    const borderColor = error ? c.error : c.border;
    const labelColor = error ? c.error : c.textSecondary;

    const fieldContent = variant === 'filled'
      ? `<Frame name="Input Container" w="fill" h={${inputH}} flex="row" items="center" px={12} bg="${c.bgElevation1}" roundedTL={${r}} roundedTR={${r}} stroke="${borderColor}" strokeWidth={1}>
    <Text size={${bodySize}} color="${c.textPrimary}" w="fill">${placeholder}</Text>
  </Frame>`
      : `<Frame name="Input Container" w="fill" h={${inputH}} flex="row" items="center" px={12} bg="${c.bgDefault}" stroke="${borderColor}" strokeWidth={1} rounded={${r}}>
    <Text size={${bodySize}} color="${c.textDisabled}" w="fill">${placeholder}</Text>
  </Frame>`;

    const helperJsx = helperText
      ? `\n  <Text size={${helperSize}} color="${error ? c.error : c.textSecondary}">${helperText}</Text>`
      : '';

    return `<Frame name="TextField/${variant}/${size}" w={280} flex="col" gap={4}>
  <Text size={${labelSize}} weight="500" color="${labelColor}">${label}</Text>
  ${fieldContent}${helperJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// CARD
// ---------------------------------------------------------------------------
components.card = {
  name: 'Card',
  description: 'Content container with optional header, body, and actions',
  variants: ['elevated', 'outlined'],

  render({ variant = 'elevated', title = 'Card Title', subtitle = '', body = 'Card content goes here. This is the body area for any content.', hasActions = false, width = 320 } = {}) {
    const c = colors();
    const r = radius('card');
    const h2 = getTypographyStyle('heading/h3') || {};
    const bodyStyle = getTypographyStyle('body/medium') || {};
    const captionStyle = getTypographyStyle('caption') || {};

    const strokeAttr = variant === 'outlined' ? ` stroke="${c.border}" strokeWidth={1}` : '';
    const shadowAttr = variant === 'elevated' ? ' shadow="0 2 8 #0000001a"' : '';
    const subtitleJsx = subtitle
      ? `\n    <Text size={${parseInt(captionStyle['font-size'] || '12')}} color="${c.textSecondary}" w="fill">${subtitle}</Text>`
      : '';
    const actionsJsx = hasActions
      ? `\n  <Frame name="Actions" w="fill" flex="row" gap={8} justify="end" pt={8}>
    ${components.button.render({ variant: 'text', size: 'small', label: 'Cancel' })}
    ${components.button.render({ variant: 'contained', size: 'small', label: 'Confirm' })}
  </Frame>`
      : '';

    return `<Frame name="Card/${variant}" w={${width}} flex="col" bg="${c.bgPaper}" rounded={${r}} p={${spacing(6)}}${strokeAttr}${shadowAttr} overflow="hidden" gap={${spacing(3)}}>
  <Frame name="Header" w="fill" flex="col" gap={4}>
    <Text size={${parseInt(h2['font-size'] || '20')}} weight="${h2['font-weight'] || '700'}" color="${c.textPrimary}" w="fill">${title}</Text>${subtitleJsx}
  </Frame>
  <Text size={${parseInt(bodyStyle['font-size'] || '14')}} color="${c.textSecondary}" w="fill">${body}</Text>${actionsJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// DIALOG
// ---------------------------------------------------------------------------
components.dialog = {
  name: 'Dialog',
  description: 'Modal dialog with title, content, and action buttons',

  render({ title = 'Dialog Title', body = 'Are you sure you want to proceed with this action?', confirmLabel = 'Confirm', cancelLabel = 'Cancel' } = {}) {
    const c = colors();
    const tok = getComponentTokens('dialog');
    const r = radius('dialog');
    const minW = parseInt(tok['min-width'] || '280');
    const maxW = parseInt(tok['max-width'] || '560');
    const contentPad = parseInt(tok['content-padding'] || '24');
    const titleH = parseInt(tok['title-height'] || '64');
    const actionsH = parseInt(tok['actions-height'] || '52');
    const actionsSpacing = parseInt(tok['actions-spacing'] || '8');

    return `<Frame name="Dialog/Backdrop" w={800} h={600} flex="col" items="center" justify="center" bg="#00000052">
  <Frame name="Dialog" w={${maxW}} flex="col" bg="${c.bgPaper}" rounded={${r}} shadow="0 8 24 #00000033" overflow="hidden">
    <Frame name="Title" w="fill" h={${titleH}} flex="row" items="center" px={${contentPad}}>
      <Text size={20} weight="700" color="${c.textPrimary}" w="fill">${title}</Text>
    </Frame>
    <Frame name="Content" w="fill" flex="col" px={${contentPad}} pb={${contentPad}}>
      <Text size={14} color="${c.textSecondary}" w="fill">${body}</Text>
    </Frame>
    <Frame name="Actions" w="fill" h={${actionsH}} flex="row" items="center" justify="end" px={${contentPad}} gap={${actionsSpacing}}>
      ${components.button.render({ variant: 'text', size: 'medium', label: cancelLabel })}
      ${components.button.render({ variant: 'contained', size: 'medium', label: confirmLabel })}
    </Frame>
  </Frame>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// CHIP
// ---------------------------------------------------------------------------
components.chip = {
  name: 'Chip',
  description: 'Compact element for filters, tags, and selections',
  variants: ['filled', 'outlined'],

  render({ variant = 'filled', label = 'Chip', color = 'default', deletable = false } = {}) {
    const c = colors();
    const tok = getComponentTokens('chip');
    const h = parseInt(tok['height'] || '32');
    const px_val = parseInt(tok['padding-horizontal'] || '12');
    const r = radius('chip');
    const iconSize = parseInt(tok['icon-size'] || '18');

    const bgColor = color === 'primary' ? c.primary
      : color === 'error' ? c.error
      : variant === 'filled' ? '#e0e0e0' : c.bgDefault;
    const textColor = (color === 'primary' || color === 'error') ? '#ffffff'
      : c.textPrimary;
    const strokeAttr = variant === 'outlined' ? ` stroke="${c.border}" strokeWidth={1}` : '';

    const deleteIcon = deletable
      ? `\n    <Frame w={${iconSize}} h={${iconSize}} bg="${textColor}" rounded={${iconSize / 2}} opacity={0.6} />`
      : '';

    return `<Frame name="Chip/${variant}" h={${h}} flex="row" items="center" px={${px_val}} gap={4} bg="${bgColor}" rounded={${r}}${strokeAttr}>
  <Text size={13} weight="500" color="${textColor}">${label}</Text>${deleteIcon}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// TOOLTIP
// ---------------------------------------------------------------------------
components.tooltip = {
  name: 'Tooltip',
  description: 'Contextual information popup',

  render({ text = 'Tooltip text', position = 'top' } = {}) {
    const tok = getComponentTokens('tooltip');
    const maxW = parseInt(tok['max-width'] || '300');
    const pxVal = parseInt(tok['padding-horizontal'] || '8');
    const pyVal = parseInt(tok['padding-vertical'] || '4');
    const r = radius('tooltip');

    return `<Frame name="Tooltip" flex="row" items="center" px={${pxVal}} py={${pyVal}} bg="#616161" rounded={${r}}>
  <Text size={12} color="#ffffff">${text}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SNACKBAR
// ---------------------------------------------------------------------------
components.snackbar = {
  name: 'Snackbar',
  description: 'Brief notification at bottom of screen',

  render({ message = 'Action completed successfully', hasAction = true, actionLabel = 'Undo' } = {}) {
    const tok = getComponentTokens('snackbar');
    const w = parseInt(tok['width'] || '344');
    const minH = parseInt(tok['min-height'] || '48');
    const pxVal = parseInt(tok['padding-horizontal'] || '16');

    const actionJsx = hasAction
      ? `\n  <Text size={14} weight="700" color="${colors().primary}">${actionLabel}</Text>`
      : '';

    return `<Frame name="Snackbar" w={${w}} h={${minH}} flex="row" items="center" px={${pxVal}} bg="#323232" rounded={4} gap={8}>
  <Text size={14} color="#ffffff" w="fill">${message}</Text>${actionJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// NAVIGATION (SIDENAV)
// ---------------------------------------------------------------------------
components.navigation = {
  name: 'Navigation',
  description: 'Sidebar navigation with expandable items',

  render({ items = ['Dashboard', 'Users', 'Settings', 'Reports', 'Help'], activeIndex = 0, variant = 'default' } = {}) {
    const c = colors();
    const tok = getComponentTokens('nav');
    const w = variant === 'slim' ? parseInt(tok['width-slim'] || '64') : parseInt(tok['width-default'] || '256');
    const itemH = parseInt(tok['item-height'] || '48');
    const itemPx = parseInt(tok['item-padding-horizontal'] || '16');
    const iconSize = parseInt(tok['icon-size'] || '24');
    const iconSpacing = parseInt(tok['icon-spacing'] || '16');

    const navItems = items.map((item, i) => {
      const isActive = i === activeIndex;
      const bg = isActive ? 'rgba(75,63,255,0.08)' : 'transparent';
      const textColor = isActive ? c.primary : c.textPrimary;
      const bgAttr = isActive ? ` bg="${bg}"` : '';
      return `  <Frame name="NavItem/${item}" w="fill" h={${itemH}} flex="row" items="center" px={${itemPx}} gap={${iconSpacing}}${bgAttr} rounded={8}>
    <Frame w={${iconSize}} h={${iconSize}} bg="${textColor}" rounded={4} opacity={0.4} />
    <Text size={14} weight="${isActive ? '700' : '400'}" color="${textColor}" w="fill">${item}</Text>
  </Frame>`;
    }).join('\n');

    return `<Frame name="Navigation/${variant}" w={${w}} h={600} flex="col" bg="${c.bgPaper}" py={8} gap={2} stroke="${c.border}" strokeWidth={1}>
  <Frame name="Logo" w="fill" h={64} flex="row" items="center" px={${itemPx}} gap={12}>
    <Frame w={32} h={32} bg="${c.primary}" rounded={8} />
    <Text size={16} weight="700" color="${c.textPrimary}">App Name</Text>
  </Frame>
  <Frame name="Divider" w="fill" h={1} bg="${c.divider}" />
${navItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// BREADCRUMB
// ---------------------------------------------------------------------------
components.breadcrumb = {
  name: 'Breadcrumb',
  description: 'Navigation breadcrumb trail',

  render({ items = ['Home', 'Products', 'Laptops', 'MacBook Pro'] } = {}) {
    const c = colors();
    const tok = getComponentTokens('breadcrumb');
    const itemSpacing = parseInt(tok['item-spacing'] || '8');

    const crumbs = items.map((item, i) => {
      const isLast = i === items.length - 1;
      const color = isLast ? c.textPrimary : c.textSecondary;
      const separator = isLast ? '' : `\n    <Text size={14} color="${c.textDisabled}">/</Text>`;
      return `  <Text size={14} color="${color}" weight="${isLast ? '500' : '400'}">${item}</Text>${separator}`;
    }).join('\n');

    return `<Frame name="Breadcrumb" flex="row" items="center" gap={${itemSpacing}}>
${crumbs}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// TIMELINE
// ---------------------------------------------------------------------------
components.timeline = {
  name: 'Timeline',
  description: 'Vertical timeline with events',

  render({ events = [
    { title: 'Order Placed', description: 'Your order has been confirmed', status: 'completed' },
    { title: 'Processing', description: 'Order is being prepared', status: 'active' },
    { title: 'Shipped', description: 'Awaiting shipment', status: 'pending' },
  ] } = {}) {
    const c = colors();
    const tok = getComponentTokens('timeline');
    const dotSize = parseInt(tok['dot-size'] || '12');
    const connW = parseInt(tok['connector-width'] || '2');
    const spacing_h = parseInt(tok['spacing-horizontal'] || '16');
    const spacing_v = parseInt(tok['spacing-vertical'] || '24');

    const items = events.map((ev, i) => {
      const dotColor = ev.status === 'completed' ? c.primary
        : ev.status === 'active' ? c.primary
        : c.textDisabled;
      const isLast = i === events.length - 1;
      const connector = isLast ? '' : `\n      <Frame w={${connW}} grow={1} bg="${c.border}" />`;

      return `  <Frame name="TimelineItem/${ev.title}" w="fill" flex="row" gap={${spacing_h}}>
    <Frame flex="col" items="center" w={${dotSize + 8}}>
      <Frame w={${dotSize}} h={${dotSize}} bg="${dotColor}" rounded={${dotSize}} />${connector}
    </Frame>
    <Frame flex="col" gap={4} pb={${isLast ? 0 : spacing_v}}>
      <Text size={14} weight="700" color="${c.textPrimary}">${ev.title}</Text>
      <Text size={12} color="${c.textSecondary}">${ev.description}</Text>
    </Frame>
  </Frame>`;
    }).join('\n');

    return `<Frame name="Timeline" w={300} flex="col">
${items}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// STEPPER
// ---------------------------------------------------------------------------
components.stepper = {
  name: 'Stepper',
  description: 'Multi-step progress indicator',

  render({ steps = ['Details', 'Address', 'Payment', 'Review'], activeStep = 1, orientation = 'horizontal' } = {}) {
    const c = colors();
    const tok = getComponentTokens('stepper');
    const stepSize = parseInt(tok['step-size'] || '40');
    const connH = parseInt(tok['connector-height'] || '2');
    const labelSpacing = parseInt(tok['label-spacing'] || '8');

    if (orientation === 'horizontal') {
      const stepItems = steps.map((step, i) => {
        const isActive = i === activeStep;
        const isCompleted = i < activeStep;
        const dotBg = isActive || isCompleted ? c.primary : c.textDisabled;
        const textColor = isActive ? c.primary : isCompleted ? c.textPrimary : c.textDisabled;
        const connector = i < steps.length - 1
          ? `\n    <Frame grow={1} h={${connH}} bg="${isCompleted ? c.primary : c.border}" />`
          : '';

        return `  <Frame flex="col" items="center" gap={${labelSpacing}}>
    <Frame w={${stepSize}} h={${stepSize}} bg="${dotBg}" rounded={${stepSize}} flex="row" items="center" justify="center">
      <Text size={14} weight="700" color="#ffffff">${i + 1}</Text>
    </Frame>
    <Text size={12} weight="${isActive ? '700' : '400'}" color="${textColor}">${step}</Text>
  </Frame>${connector}`;
      }).join('\n');

      return `<Frame name="Stepper/horizontal" flex="row" items="center" gap={16} w="fill">
${stepItems}
</Frame>`;
    }

    // vertical
    const stepItems = steps.map((step, i) => {
      const isActive = i === activeStep;
      const isCompleted = i < activeStep;
      const dotBg = isActive || isCompleted ? c.primary : c.textDisabled;
      const textColor = isActive ? c.primary : isCompleted ? c.textPrimary : c.textDisabled;
      const connector = i < steps.length - 1
        ? `\n      <Frame w={${connH}} grow={1} bg="${isCompleted ? c.primary : c.border}" />`
        : '';

      return `  <Frame flex="row" gap={12}>
    <Frame flex="col" items="center">
      <Frame w={${stepSize}} h={${stepSize}} bg="${dotBg}" rounded={${stepSize}} flex="row" items="center" justify="center">
        <Text size={14} weight="700" color="#ffffff">${i + 1}</Text>
      </Frame>${connector}
    </Frame>
    <Frame flex="col" gap={4} pb={20}>
      <Text size={14} weight="${isActive ? '700' : '400'}" color="${textColor}">${step}</Text>
    </Frame>
  </Frame>`;
    }).join('\n');

    return `<Frame name="Stepper/vertical" flex="col" w={300}>
${stepItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// DATA TABLE
// ---------------------------------------------------------------------------
components.datatable = {
  name: 'Data Table',
  description: 'Tabular data display with header and rows',

  render({ columns = ['Name', 'Email', 'Role', 'Status'], rows = [
    ['John Doe', 'john@example.com', 'Admin', 'Active'],
    ['Jane Smith', 'jane@example.com', 'Editor', 'Active'],
    ['Bob Wilson', 'bob@example.com', 'Viewer', 'Inactive'],
  ], width = 800 } = {}) {
    const c = colors();
    const tok = getComponentTokens('table');
    const headerH = parseInt(tok['header-height'] || '56');
    const rowH = parseInt(tok['row-height'] || '52');
    const cellPx = parseInt(tok['cell-padding-horizontal'] || '16');
    const colW = Math.floor(width / columns.length);

    const headerCells = columns.map(col =>
      `    <Frame w={${colW}} h={${headerH}} flex="row" items="center" px={${cellPx}}>
      <Text size={14} weight="700" color="${c.textPrimary}">${col}</Text>
    </Frame>`
    ).join('\n');

    const dataRows = rows.map((row, ri) =>
      `  <Frame name="Row ${ri + 1}" w="fill" flex="row" stroke="${c.border}" strokeWidth={1}>
${row.map((cell, ci) =>
      `    <Frame w={${colW}} h={${rowH}} flex="row" items="center" px={${cellPx}}>
      <Text size={14} color="${c.textPrimary}">${cell}</Text>
    </Frame>`
    ).join('\n')}
  </Frame>`
    ).join('\n');

    return `<Frame name="DataTable" w={${width}} flex="col" bg="${c.bgPaper}" rounded={${radius('medium')}} stroke="${c.border}" strokeWidth={1} overflow="hidden">
  <Frame name="Header" w="fill" flex="row" bg="${c.bgElevation1}">
${headerCells}
  </Frame>
${dataRows}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// PAGE HEADING
// ---------------------------------------------------------------------------
components.pageheading = {
  name: 'Page Heading',
  description: 'Page title with breadcrumbs, description, and actions',

  render({ title = 'Page Title', breadcrumbs = ['Home', 'Section'], description = '', chips = [], hasActions = false, variant = 'desktop' } = {}) {
    const c = colors();
    const tok = getComponentTokens('heading');
    const isMobile = variant === 'mobile';

    const titleSize = isMobile ? 24 : 48;
    const titleWeight = '700';
    const descSize = isMobile ? 14 : 16;
    const containerPad = isMobile ? spacing(4) : spacing(8);

    const breadcrumbJsx = breadcrumbs.length > 0
      ? `\n  ${components.breadcrumb.render({ items: [...breadcrumbs, title] })}`
      : '';

    const chipsJsx = chips.length > 0
      ? `\n  <Frame flex="row" gap={8}>\n${chips.map(ch => `    ${components.chip.render({ label: ch, variant: 'filled' })}`).join('\n')}\n  </Frame>`
      : '';

    const descJsx = description
      ? `\n  <Text size={${descSize}} color="${c.textSecondary}" w="fill">${description}</Text>`
      : '';

    const actionsJsx = hasActions
      ? `\n  <Frame flex="row" gap={8}>
    ${components.button.render({ variant: 'outlined', size: 'medium', label: 'Edit' })}
    ${components.button.render({ variant: 'contained', size: 'medium', label: 'Create New' })}
  </Frame>`
      : '';

    return `<Frame name="PageHeading/${variant}" w={${isMobile ? 375 : 1200}} flex="col" gap={8} p={${containerPad}}>
  ${breadcrumbJsx}
  <Text size={${titleSize}} weight="${titleWeight}" color="${c.textPrimary}" w="fill">${title}</Text>${chipsJsx}${descJsx}${actionsJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SECTION HEADING
// ---------------------------------------------------------------------------
components.sectionheading = {
  name: 'Section Heading',
  description: 'Section title with optional description and action',

  render({ title = 'Section Title', description = '', hasAction = false, actionLabel = 'View All' } = {}) {
    const c = colors();
    const descJsx = description
      ? `\n  <Text size={14} color="${c.textSecondary}" w="fill">${description}</Text>`
      : '';

    const actionJsx = hasAction
      ? `\n  ${components.button.render({ variant: 'text', size: 'small', label: actionLabel })}`
      : '';

    return `<Frame name="SectionHeading" w="fill" flex="row" items="center" gap={16}>
  <Frame flex="col" gap={4} grow={1}>
    <Text size={20} weight="700" color="${c.textPrimary}">${title}</Text>${descJsx}
  </Frame>${actionJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// FORM LAYOUT
// ---------------------------------------------------------------------------
components.formlayout = {
  name: 'Form Layout',
  description: 'Structured form with labeled fields and sections',

  render({ title = 'Form Title', fields = [
    { label: 'First Name', placeholder: 'Enter first name' },
    { label: 'Last Name', placeholder: 'Enter last name' },
    { label: 'Email', placeholder: 'email@example.com' },
    { label: 'Password', placeholder: '••••••••' },
  ], hasSubmit = true } = {}) {
    const c = colors();
    const tok = getComponentTokens('form');
    const fieldSpacing = parseInt(tok['field-spacing-vertical'] || '24');
    const maxW = parseInt(tok['field-max-width'] || '500');

    const fieldsJsx = fields.map(f =>
      `  ${components.textfield.render({ label: f.label, placeholder: f.placeholder, size: 'medium' })}`
    ).join('\n');

    const submitJsx = hasSubmit
      ? `\n  <Frame flex="row" gap={12} pt={8}>
    ${components.button.render({ variant: 'text', size: 'medium', label: 'Cancel' })}
    ${components.button.render({ variant: 'contained', size: 'medium', label: 'Submit' })}
  </Frame>`
      : '';

    return `<Frame name="FormLayout" w={${maxW}} flex="col" gap={${fieldSpacing}} p={${spacing(6)}} bg="${c.bgPaper}" rounded={${radius('card')}} stroke="${c.border}" strokeWidth={1}>
  <Text size={24} weight="700" color="${c.textPrimary}">${title}</Text>
  <Frame name="Divider" w="fill" h={1} bg="${c.divider}" />
${fieldsJsx}${submitJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// AVATAR
// ---------------------------------------------------------------------------
components.avatar = {
  name: 'Avatar',
  description: 'User avatar circle',
  sizes: ['small', 'medium', 'large', 'xlarge'],

  render({ size = 'medium', initials = 'AB', color = 'primary' } = {}) {
    const c = colors();
    const dim = p(`--sizing/avatar/${size}`);
    const bg = color === 'primary' ? c.primary : color === 'secondary' ? c.secondary : c.textDisabled;
    const fontSize = Math.round(dim * 0.4);

    return `<Frame name="Avatar/${size}" w={${dim}} h={${dim}} bg="${bg}" rounded={${dim}} flex="row" items="center" justify="center">
  <Text size={${fontSize}} weight="700" color="#ffffff">${initials}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// ACCORDION
// ---------------------------------------------------------------------------
components.accordion = {
  name: 'Accordion',
  description: 'Expandable content sections',

  render({ items = [
    { title: 'Section 1', content: 'Content for section 1 goes here with details.', expanded: true },
    { title: 'Section 2', content: 'Content for section 2 goes here with details.', expanded: false },
    { title: 'Section 3', content: 'Content for section 3 goes here with details.', expanded: false },
  ], width = 400 } = {}) {
    const c = colors();

    const sections = items.map(item => {
      const contentJsx = item.expanded
        ? `\n    <Frame w="fill" flex="col" px={16} pb={16}>
      <Text size={14} color="${c.textSecondary}" w="fill">${item.content}</Text>
    </Frame>`
        : '';

      return `  <Frame name="AccordionItem" w="fill" flex="col" stroke="${c.border}" strokeWidth={1}>
    <Frame w="fill" h={48} flex="row" items="center" px={16} gap={8}>
      <Text size={14} weight="500" color="${c.textPrimary}" w="fill">${item.title}</Text>
      <Text size={14} color="${c.textSecondary}">${item.expanded ? '▲' : '▼'}</Text>
    </Frame>${contentJsx}
  </Frame>`;
    }).join('\n');

    return `<Frame name="Accordion" w={${width}} flex="col" bg="${c.bgPaper}" rounded={${radius('medium')}} overflow="hidden">
${sections}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// RADIO
// ---------------------------------------------------------------------------
components.radio = {
  name: 'Radio',
  description: 'Radio button group for single selection',

  render({ options = ['Option A', 'Option B', 'Option C'], selected = 0, label = 'Choose one' } = {}) {
    const c = colors();

    const items = options.map((opt, i) => {
      const isSelected = i === selected;
      const ringColor = isSelected ? c.primary : c.textSecondary;
      return `  <Frame flex="row" items="center" gap={8}>
    <Frame w={20} h={20} rounded={20} stroke="${ringColor}" strokeWidth={2} flex="row" items="center" justify="center">
      ${isSelected ? `<Frame w={10} h={10} bg="${c.primary}" rounded={10} />` : ''}
    </Frame>
    <Text size={14} color="${c.textPrimary}">${opt}</Text>
  </Frame>`;
    }).join('\n');

    return `<Frame name="RadioGroup" flex="col" gap={12}>
  <Text size={14} weight="500" color="${c.textPrimary}">${label}</Text>
${items}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SWITCH
// ---------------------------------------------------------------------------
components.switch = {
  name: 'Switch',
  description: 'Toggle switch for on/off states',

  render({ checked = false, label = 'Enable notifications', disabled = false } = {}) {
    const c = colors();
    const trackColor = checked ? c.primary : '#bdbdbd';
    const thumbColor = checked ? '#ffffff' : '#fafafa';
    const thumbX = checked ? 20 : 0;

    return `<Frame name="Switch" flex="row" items="center" gap={12}>
  <Frame w={42} h={22} bg="${trackColor}" rounded={11} px={2} flex="row" items="center">
    <Frame w={18} h={18} bg="${thumbColor}" rounded={18} shadow="0 1 3 #00000033" />
  </Frame>
  <Text size={14} color="${disabled ? c.textDisabled : c.textPrimary}">${label}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// TOGGLE BUTTON
// ---------------------------------------------------------------------------
components.togglebutton = {
  name: 'Toggle Button',
  description: 'Button group with selectable options',

  render({ options = ['Left', 'Center', 'Right'], selected = 1 } = {}) {
    const c = colors();

    const items = options.map((opt, i) => {
      const isSelected = i === selected;
      const bg = isSelected ? c.actionSelected : 'transparent';
      return `  <Frame h={40} px={16} flex="row" items="center" justify="center" bg="${bg}" stroke="${c.border}" strokeWidth={1}>
    <Text size={14} weight="${isSelected ? '700' : '400'}" color="${isSelected ? c.primary : c.textPrimary}">${opt}</Text>
  </Frame>`;
    }).join('\n');

    return `<Frame name="ToggleButtonGroup" flex="row" rounded={${radius('button')}} overflow="hidden">
${items}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SELECT / AUTOCOMPLETE
// ---------------------------------------------------------------------------
components.select = {
  name: 'Select',
  description: 'Dropdown select with options list',

  render({ label = 'Country', placeholder = 'Select...', options = ['United States', 'Canada', 'United Kingdom'], open = true } = {}) {
    const c = colors();
    const r = radius('input');

    const dropdownJsx = open
      ? `\n  <Frame name="Dropdown" w="fill" flex="col" bg="${c.bgPaper}" rounded={${r}} stroke="${c.border}" strokeWidth={1} shadow="0 4 12 #0000001a">
${options.map(opt => `    <Frame w="fill" h={40} flex="row" items="center" px={12}>
      <Text size={14} color="${c.textPrimary}">${opt}</Text>
    </Frame>`).join('\n')}
  </Frame>`
      : '';

    return `<Frame name="Select" w={280} flex="col" gap={4}>
  <Text size={14} weight="500" color="${c.textSecondary}">${label}</Text>
  <Frame w="fill" h={40} flex="row" items="center" px={12} bg="${c.bgDefault}" stroke="${c.border}" strokeWidth={1} rounded={${r}} gap={8}>
    <Text size={14} color="${c.textDisabled}" w="fill">${placeholder}</Text>
    <Text size={12} color="${c.textSecondary}">▼</Text>
  </Frame>${dropdownJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SKELETON
// ---------------------------------------------------------------------------
components.skeleton = {
  name: 'Skeleton',
  description: 'Loading placeholder animation',

  render({ variant = 'card', width = 320 } = {}) {
    const c = colors();
    const skeletonBg = '#e0e0e0';

    if (variant === 'text') {
      return `<Frame name="Skeleton/text" w={${width}} flex="col" gap={8}>
  <Frame w="fill" h={12} bg="${skeletonBg}" rounded={4} />
  <Frame w={${Math.round(width * 0.8)}} h={12} bg="${skeletonBg}" rounded={4} />
  <Frame w={${Math.round(width * 0.6)}} h={12} bg="${skeletonBg}" rounded={4} />
</Frame>`;
    }

    return `<Frame name="Skeleton/card" w={${width}} flex="col" gap={12} p={16} bg="${c.bgPaper}" rounded={${radius('card')}} stroke="${c.border}" strokeWidth={1}>
  <Frame w="fill" h={180} bg="${skeletonBg}" rounded={${radius('medium')}} />
  <Frame w={${Math.round(width * 0.7)}} h={16} bg="${skeletonBg}" rounded={4} />
  <Frame w="fill" h={12} bg="${skeletonBg}" rounded={4} />
  <Frame w={${Math.round(width * 0.5)}} h={12} bg="${skeletonBg}" rounded={4} />
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// LIST
// ---------------------------------------------------------------------------
components.list = {
  name: 'List',
  description: 'Vertical list of items with icons and actions',

  render({ items = [
    { primary: 'Inbox', secondary: '12 new messages' },
    { primary: 'Starred', secondary: '4 items' },
    { primary: 'Sent', secondary: 'Last sent 2h ago' },
    { primary: 'Drafts', secondary: '2 drafts' },
  ], width = 320 } = {}) {
    const c = colors();

    const listItems = items.map(item =>
      `  <Frame w="fill" h={56} flex="row" items="center" px={16} gap={16}>
    <Frame w={40} h={40} bg="${c.bgElevation1}" rounded={20} flex="row" items="center" justify="center">
      <Frame w={20} h={20} bg="${c.textSecondary}" rounded={4} opacity={0.4} />
    </Frame>
    <Frame flex="col" gap={2} grow={1}>
      <Text size={14} weight="500" color="${c.textPrimary}">${item.primary}</Text>
      <Text size={12} color="${c.textSecondary}">${item.secondary}</Text>
    </Frame>
  </Frame>`
    ).join('\n');

    return `<Frame name="List" w={${width}} flex="col" bg="${c.bgPaper}" rounded={${radius('medium')}} stroke="${c.border}" strokeWidth={1} overflow="hidden">
${listItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// BUTTON GROUP
// ---------------------------------------------------------------------------
components.buttongroup = {
  name: 'Button Group',
  description: 'Group of related buttons',

  render({ buttons = ['One', 'Two', 'Three'], variant = 'outlined' } = {}) {
    const c = colors();
    const r = radius('button');

    const items = buttons.map(btn =>
      `  <Frame h={40} px={16} flex="row" items="center" justify="center" stroke="${c.border}" strokeWidth={1}>
    <Text size={14} weight="500" color="${c.primary}">${btn}</Text>
  </Frame>`
    ).join('\n');

    return `<Frame name="ButtonGroup" flex="row" rounded={${r}} overflow="hidden">
${items}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// ICON BUTTON
// ---------------------------------------------------------------------------
components.iconbutton = {
  name: 'Icon Button',
  description: 'Button with icon only, for compact actions',
  sizes: ['small', 'medium', 'large'],

  render({ size = 'medium', variant = 'default' } = {}) {
    const c = colors();
    const dim = p(`--sizing/button/${size}`);
    const iconSize = Math.round(dim * 0.5);
    const bg = variant === 'contained' ? c.primary : 'transparent';
    const iconColor = variant === 'contained' ? '#ffffff' : c.textSecondary;

    return `<Frame name="IconButton/${size}" w={${dim}} h={${dim}} flex="row" items="center" justify="center" rounded={${dim}} bg="${bg}">
  <Frame w={${iconSize}} h={${iconSize}} bg="${iconColor}" rounded={${Math.round(iconSize * 0.2)}} opacity={0.7} />
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// DATE PICKER (Simplified calendar view)
// ---------------------------------------------------------------------------
components.datepicker = {
  name: 'Date Picker',
  description: 'Calendar date selector',

  render({ month = 'February 2026', selectedDay = 15 } = {}) {
    const c = colors();
    const tok = getComponentTokens('datepicker');
    const calW = parseInt(tok['calendar-width'] || '320');
    const headerH = parseInt(tok['header-height'] || '56');
    const daySize = parseInt(tok['day-button-size'] || '40');

    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const weekdayJsx = weekdays.map(d =>
      `    <Frame w={${daySize}} h={${daySize}} flex="row" items="center" justify="center">
      <Text size={12} weight="500" color="${c.textSecondary}">${d}</Text>
    </Frame>`
    ).join('\n');

    // Simplified: show 2 rows of days
    const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const dayRows = [];
    for (let i = 0; i < days.length; i += 7) {
      const row = days.slice(i, i + 7).map(d => {
        const isSelected = d === selectedDay;
        const bg = isSelected ? c.primary : 'transparent';
        const textColor = isSelected ? '#ffffff' : c.textPrimary;
        return `      <Frame w={${daySize}} h={${daySize}} flex="row" items="center" justify="center" bg="${bg}" rounded={${daySize}}>
        <Text size={14} color="${textColor}">${d}</Text>
      </Frame>`;
      }).join('\n');
      dayRows.push(`    <Frame flex="row">\n${row}\n    </Frame>`);
    }

    return `<Frame name="DatePicker" w={${calW}} flex="col" bg="${c.bgPaper}" rounded={${radius('dialog')}} stroke="${c.border}" strokeWidth={1} shadow="0 4 12 #0000001a" overflow="hidden">
  <Frame name="Header" w="fill" h={${headerH}} flex="row" items="center" justify="center" px={16} gap={8}>
    <Text size={14} color="${c.textSecondary}">◀</Text>
    <Text size={16} weight="700" color="${c.textPrimary}" w="fill">${month}</Text>
    <Text size={14} color="${c.textSecondary}">▶</Text>
  </Frame>
  <Frame name="Weekdays" w="fill" flex="row" px={8}>
${weekdayJsx}
  </Frame>
  <Frame name="Days" w="fill" flex="col" px={8} pb={8}>
${dayRows.join('\n')}
  </Frame>
</Frame>`;
  }
};


// ============================================================================
// REGISTRY API
// ============================================================================

/**
 * Get component blueprint by name (case-insensitive, flexible matching).
 */
export function getComponent(name) {
  const key = name.toLowerCase().replace(/[\s\-_]/g, '');
  return components[key] || null;
}

/**
 * List all registered components.
 */
export function listComponents() {
  return Object.entries(components).map(([key, comp]) => ({
    key,
    name: comp.name,
    description: comp.description,
    variants: comp.variants || [],
    sizes: comp.sizes || [],
  }));
}

/**
 * Render a component by name with options.
 */
export function renderComponent(name, options = {}) {
  const comp = getComponent(name);
  if (!comp) return null;
  return comp.render(options);
}

/**
 * Render all variants of a component (for showcase/documentation).
 */
export function renderAllVariants(name) {
  const comp = getComponent(name);
  if (!comp || !comp.renderAll) {
    return comp ? [comp.render()] : [];
  }
  return comp.renderAll();
}

/**
 * Build a full page layout from an array of section configs.
 * Each section: { component: 'name', options: {}, wrapper: { w, bg, p } }
 */
export function buildPage(pageConfig) {
  const {
    name = 'Page',
    width = 1440,
    bg = colors().bgDefault,
    sections = []
  } = pageConfig;

  const sectionJsx = sections.map(section => {
    const jsx = renderComponent(section.component, section.options || {});
    if (!jsx) return '';

    const wrap = section.wrapper || {};
    const sectionW = wrap.w || 'fill';
    const sectionBg = wrap.bg ? ` bg="${wrap.bg}"` : '';
    const sectionP = wrap.p ? ` p={${wrap.p}}` : ` p={${spacing(8)}}`;
    const sectionItems = wrap.items ? ` items="${wrap.items}"` : ' items="center"';

    return `  <Frame name="${section.component}" w="${sectionW}" flex="col"${sectionItems}${sectionP}${sectionBg}>
    ${jsx}
  </Frame>`;
  }).join('\n');

  return `<Frame name="${name}" w={${width}} flex="col" bg="${bg}">
${sectionJsx}
</Frame>`;
}

export default {
  getComponent,
  listComponents,
  renderComponent,
  renderAllVariants,
  buildPage,
  components,
};
