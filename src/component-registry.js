/**
 * Component Registry — CDS Design System v3.1
 *
 * Maps ALL CDS visual components to Figma JSX blueprints.
 * All token values sourced from ds-engine.js which reads the CDS token spec.
 *
 * Source of truth: https://github.com/rahulbhide-opengov/CDS-Design-System
 *
 * 50 visual components in 10 categories:
 *
 * BUTTONS:     Button, IconButton, ButtonGroup, FAB, ToggleButton
 * FORMS:       TextField, Select, Checkbox, Radio, Switch, Rating, Slider,
 *              Autocomplete, FileUpload
 * LAYOUT:      Card, Paper, Divider, Accordion
 * NAVIGATION:  Navigation, AppBar, Tabs, Breadcrumb, Stepper,
 *              BottomNavigation, Drawer, Menu, Pagination
 * DATA:        DataTable, List, Avatar, AvatarGroup, Chip, Badge, Timeline,
 *              Typography, ImageList
 * FEEDBACK:    Alert, Dialog, Tooltip, Snackbar, Skeleton, Progress,
 *              Backdrop, LinearProgress, CircularProgress
 * BRANDING:    Logo, OpenGovWand
 * PAGE:        PageHeading, SectionHeading, FormLayout
 * PATTERNS:    LoginForm, Dashboard, ProfileCard, ContactForm
 */

import dsEngine from './ds-engine.js';

const { resolveToken, resolveResponsiveToken, px, responsivePx, toHex, getOpacity, getComponentTokens, getTypographyStyle, getResponsiveTypographyStyle, getColorGroup, getBreakpointWidths } = dsEngine;

let _activeBreakpoint = 'desktop';

/**
 * Set the active breakpoint for component rendering.
 * All subsequent component renders will use this breakpoint's token values.
 * @param {'desktop'|'tablet'|'mobile'} bp
 */
export function setBreakpoint(bp) {
  _activeBreakpoint = ['desktop', 'tablet', 'mobile'].includes(bp) ? bp : 'desktop';
}

export function getActiveBreakpoint() {
  return _activeBreakpoint;
}

const t = (name) => resolveResponsiveToken(name, _activeBreakpoint) || resolveToken(name) || '';
const h = (name) => toHex(name);
const p = (name) => responsivePx(name, _activeBreakpoint);

function colors() {
  return {
    primary: h('--colors/primary/main'),
    primaryLight: h('--colors/primary/light'),
    primary100: h('--colors/primary/100'),
    primary200: h('--colors/primary/200'),
    primary400: h('--colors/primary/400'),
    primaryDark: h('--colors/primary/dark'),
    primaryContrast: h('--colors/primary/contrast-text'),
    secondary: h('--colors/secondary/main'),
    secondaryLight: h('--colors/secondary/light'),
    secondaryDark: h('--colors/secondary/dark'),
    secondaryContrast: h('--colors/secondary/contrast-text'),
    error: h('--colors/error/main'),
    errorContrast: h('--colors/error/contrast-text'),
    errorLight: h('--colors/error/light'),
    warning: h('--colors/warning/main'),
    warningLight: h('--colors/warning/light'),
    success: h('--colors/success/main'),
    successLight: h('--colors/success/light'),
    info: h('--colors/info/main'),
    infoLight: h('--colors/info/light'),
    textPrimary: h('--colors/text/primary'),
    textSecondary: h('--colors/text/secondary'),
    textTertiary: h('--colors/text/tertiary'),
    textDisabled: h('--colors/text/disabled'),
    textHint: h('--colors/text/hint'),
    bgDefault: h('--colors/background/default'),
    bgPaper: h('--colors/background/paper'),
    bgTertiary: h('--colors/background/tertiary'),
    bgElevation1: h('--colors/background/paper-elevation-1'),
    grey50: h('--colors/grey/50'),
    grey100: h('--colors/grey/100'),
    grey200: h('--colors/grey/200'),
    grey300: h('--colors/grey/300'),
    grey400: h('--colors/grey/400'),
    grey500: h('--colors/grey/500'),
    grey700: h('--colors/grey/700'),
    grey900: h('--colors/grey/900'),
    border: h('--colors/border/default'),
    borderFocus: h('--colors/border/focus'),
    divider: h('--colors/divider'),
    actionHover: h('--colors/action/hover'),
    actionSelected: h('--colors/action/selected'),
    actionDisabled: h('--colors/action/disabled'),
    actionDisabledBg: h('--colors/action/disabled-background'),
    primaryStateHover: t('--colors/primary-states/hover'),
    primaryStateSelected: t('--colors/primary-states/selected'),
    primaryStateFocusVisible: t('--colors/primary-states/focus-visible'),
  };
}

function radius(name) {
  return p(`--border-radius/${name}`);
}

function spacing(n) {
  return p(`--spacing/${n}`);
}

const components = {};

// ---------------------------------------------------------------------------
// BUTTON — CDS: weight 500, sizes 28/32/40, radius 4
// ---------------------------------------------------------------------------
components.button = {
  name: 'Button',
  description: 'CDS action button with contained, outlined, and text variants',
  variants: ['contained', 'outlined', 'text'],
  sizes: ['small', 'medium', 'large'],
  colors: ['primary', 'secondary', 'error'],

  render({ variant = 'contained', size = 'medium', label = 'Button', color = 'primary', disabled = false, breakpoint } = {}) {
    if (breakpoint) setBreakpoint(breakpoint);
    const c = colors();
    const btnH = p(`--sizing/button/${size}`);
    const typo = getResponsiveTypographyStyle(`button/${size}`, _activeBreakpoint);
    const fontSize = typo ? parseInt(typo['font-size']) : 14;
    const fontWeight = typo ? typo['font-weight'] : '500';
    const r = radius('button');
    const px_pad = size === 'small' ? 16 : size === 'large' ? 26 : 22;

    const colorMap = {
      primary: { bg: c.primary, text: c.primaryContrast, border: c.primary },
      secondary: { bg: c.secondary, text: c.secondaryContrast, border: c.secondary },
      error: { bg: c.error, text: c.errorContrast, border: c.error },
    };
    const col = colorMap[color] || colorMap.primary;

    if (disabled) {
      col.bg = c.actionDisabledBg;
      col.text = c.actionDisabled;
      col.border = c.actionDisabledBg;
    }

    if (variant === 'contained') {
      return `<Frame name="Button/${variant}/${size}" h={${btnH}} flex="row" items="center" justify="center" px={${px_pad}} bg="${col.bg}" rounded={${r}} gap={8}>
  <Text size={${fontSize}} weight="${fontWeight}" color="${col.text}">${label}</Text>
</Frame>`;
    }

    if (variant === 'outlined') {
      return `<Frame name="Button/${variant}/${size}" h={${btnH}} flex="row" items="center" justify="center" px={${px_pad}} bg="${c.bgPaper}" stroke="${col.border}" strokeWidth={1} rounded={${r}} gap={8}>
  <Text size={${fontSize}} weight="${fontWeight}" color="${col.bg}">${label}</Text>
</Frame>`;
    }

    return `<Frame name="Button/${variant}/${size}" h={${btnH}} flex="row" items="center" justify="center" px={${px_pad}} rounded={${r}} gap={8}>
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
// ICON BUTTON — CDS: touch target 48px min
// ---------------------------------------------------------------------------
components.iconbutton = {
  name: 'Icon Button',
  description: 'CDS icon-only button',
  sizes: ['small', 'medium', 'large'],

  render({ size = 'medium', variant = 'default' } = {}) {
    const c = colors();
    const dim = p(`--sizing/button/${size}`);
    const touchDim = Math.max(dim, 48);
    const iconSize = p(`--sizing/icon/${size === 'large' ? 'large' : size === 'small' ? 'small' : 'medium'}`);
    const bg = variant === 'contained' ? c.primary : 'transparent';
    const iconColor = variant === 'contained' ? '#ffffff' : c.textTertiary;

    return `<Frame name="IconButton/${size}" w={${touchDim}} h={${touchDim}} flex="row" items="center" justify="center" rounded={${touchDim}} bg="${bg}">
  <Frame w={${iconSize}} h={${iconSize}} bg="${iconColor}" rounded={${Math.round(iconSize * 0.2)}} opacity={0.7} />
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// BUTTON GROUP
// ---------------------------------------------------------------------------
components.buttongroup = {
  name: 'Button Group',
  description: 'CDS group of related buttons',

  render({ buttons = ['One', 'Two', 'Three'], variant = 'outlined' } = {}) {
    const c = colors();
    const r = radius('button');

    const items = buttons.map(btn =>
      `  <Frame h={32} px={16} flex="row" items="center" justify="center" stroke="${c.border}" strokeWidth={1}>
    <Text size={14} weight="500" color="${c.primary}">${btn}</Text>
  </Frame>`
    ).join('\n');

    return `<Frame name="ButtonGroup" flex="row" rounded={${r}} overflow="hidden">
${items}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// TEXT FIELD — CDS: radius 4, sizes 28/32/40
// ---------------------------------------------------------------------------
components.textfield = {
  name: 'Text Field',
  description: 'CDS form input with outlined and filled variants',
  variants: ['outlined', 'filled'],
  sizes: ['small', 'medium', 'large'],

  render({ variant = 'outlined', size = 'medium', label = 'Label', placeholder = 'Enter text...', error = false, helperText = '', readOnly = false } = {}) {
    const c = colors();
    const inputH = p(`--sizing/input/${size}`);
    const r = radius('input');
    const labelStyle = getResponsiveTypographyStyle(`input/label/${size}`, _activeBreakpoint) || {};
    const labelSize = parseInt(labelStyle['font-size'] || '14');
    const valueStyle = getResponsiveTypographyStyle(`input/value/${size}`, _activeBreakpoint) || {};
    const valueSize = parseInt(valueStyle['font-size'] || '16');
    const helperStyle = getResponsiveTypographyStyle('input/helper', _activeBreakpoint) || {};
    const helperSize = parseInt(helperStyle['font-size'] || '14');
    const borderColor = error ? c.error : c.border;
    const labelColor = error ? c.error : c.textSecondary;

    const readOnlyBg = readOnly ? 'rgba(75,63,255,0.04)' : (variant === 'filled' ? c.bgElevation1 : c.bgPaper);

    const fieldContent = variant === 'filled'
      ? `<Frame name="Input Container" w="fill" h={${inputH}} flex="row" items="center" px={12} bg="${readOnlyBg}" roundedTL={${r}} roundedTR={${r}} stroke="${borderColor}" strokeWidth={1}>
    <Text size={${valueSize}} color="${readOnly ? c.textPrimary : c.textDisabled}" w="fill">${placeholder}</Text>
  </Frame>`
      : `<Frame name="Input Container" w="fill" h={${inputH}} flex="row" items="center" px={12} bg="${readOnlyBg}" stroke="${borderColor}" strokeWidth={1} rounded={${r}}>
    <Text size={${valueSize}} color="${readOnly ? c.textPrimary : c.textDisabled}" w="fill">${placeholder}</Text>
  </Frame>`;

    const helperJsx = helperText
      ? `\n  <Text size={${helperSize}} color="${error ? c.error : c.textSecondary}">${helperText}</Text>`
      : '';

    return `<Frame name="TextField/${variant}/${size}" w={280} flex="col" gap={4}>
  <Text size={${labelSize}} weight="400" color="${labelColor}">${label}</Text>
  ${fieldContent}${helperJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SELECT / AUTOCOMPLETE
// ---------------------------------------------------------------------------
components.select = {
  name: 'Select',
  description: 'CDS dropdown select',

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
  <Text size={14} weight="400" color="${c.textSecondary}">${label}</Text>
  <Frame w="fill" h={32} flex="row" items="center" px={12} bg="${c.bgPaper}" stroke="${c.border}" strokeWidth={1} rounded={${r}} gap={8}>
    <Text size={14} color="${c.textDisabled}" w="fill">${placeholder}</Text>
    <Text size={12} color="${c.textSecondary}">▼</Text>
  </Frame>${dropdownJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// CHECKBOX
// ---------------------------------------------------------------------------
components.checkbox = {
  name: 'Checkbox',
  description: 'CDS checkbox with label',

  render({ checked = false, label = 'Accept terms', disabled = false } = {}) {
    const c = colors();
    const boxColor = checked ? c.primary : c.textTertiary;
    const bg = checked ? c.primary : 'transparent';

    return `<Frame name="Checkbox" flex="row" items="center" gap={8}>
  <Frame w={20} h={20} rounded={2} stroke="${boxColor}" strokeWidth={2} bg="${bg}" flex="row" items="center" justify="center">
    ${checked ? `<Text size={14} weight="700" color="#ffffff">✓</Text>` : ''}
  </Frame>
  <Text size={14} color="${disabled ? c.textDisabled : c.textPrimary}">${label}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// RADIO — CDS primary color for checked state
// ---------------------------------------------------------------------------
components.radio = {
  name: 'Radio',
  description: 'CDS radio button group',

  render({ options = ['Option A', 'Option B', 'Option C'], selected = 0, label = 'Choose one' } = {}) {
    const c = colors();

    const items = options.map((opt, i) => {
      const isSelected = i === selected;
      const ringColor = isSelected ? c.primary : c.textTertiary;
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
// SWITCH — CDS primary track color
// ---------------------------------------------------------------------------
components.switch = {
  name: 'Switch',
  description: 'CDS toggle switch',

  render({ checked = false, label = 'Enable notifications', disabled = false } = {}) {
    const c = colors();
    const trackColor = checked ? c.primary : c.grey500;
    const thumbColor = checked ? '#ffffff' : '#fafafa';

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
  description: 'CDS toggle button group',

  render({ options = ['Left', 'Center', 'Right'], selected = 1 } = {}) {
    const c = colors();

    const items = options.map((opt, i) => {
      const isSelected = i === selected;
      const bg = isSelected ? c.actionSelected : 'transparent';
      return `  <Frame h={32} px={16} flex="row" items="center" justify="center" bg="${bg}" stroke="${c.border}" strokeWidth={1}>
    <Text size={14} weight="${isSelected ? '600' : '400'}" color="${isSelected ? c.primary : c.textPrimary}">${opt}</Text>
  </Frame>`;
    }).join('\n');

    return `<Frame name="ToggleButtonGroup" flex="row" rounded={${radius('button')}} overflow="hidden">
${items}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// CHIP — CDS: radius extraSmall (2px), sizes 28/32/40
// ---------------------------------------------------------------------------
components.chip = {
  name: 'Chip',
  description: 'CDS compact element for filters and tags',
  variants: ['filled', 'outlined'],

  render({ variant = 'filled', label = 'Chip', color = 'default', deletable = false, size = 'medium' } = {}) {
    const c = colors();
    const chipH = p(`--sizing/chip/${size}`);
    const px_val = 12;
    const r = radius('chip');
    const iconSize = 18;
    const typo = getResponsiveTypographyStyle(`chip/${size}`, _activeBreakpoint) || {};
    const fontSize = parseInt(typo['font-size'] || '14');

    let bgColor, textColor;
    if (color === 'primary') {
      bgColor = variant === 'filled' ? c.primary100 : c.bgPaper;
      textColor = c.primary;
    } else if (color === 'secondary') {
      bgColor = variant === 'filled' ? c.secondaryLight : c.bgPaper;
      textColor = c.secondary;
    } else if (color === 'error') {
      bgColor = variant === 'filled' ? c.errorLight : c.bgPaper;
      textColor = variant === 'filled' ? '#ffffff' : c.error;
    } else {
      bgColor = variant === 'filled' ? c.grey300 : c.bgPaper;
      textColor = c.textPrimary;
    }
    const strokeAttr = variant === 'outlined' ? ` stroke="${c.border}" strokeWidth={1}` : '';

    const deleteIcon = deletable
      ? `\n    <Frame w={${iconSize}} h={${iconSize}} bg="${textColor}" rounded={${iconSize / 2}} opacity={0.6} />`
      : '';

    return `<Frame name="Chip/${variant}/${size}" h={${chipH}} flex="row" items="center" px={${px_val}} gap={4} bg="${bgColor}" rounded={${r}}${strokeAttr}>
  <Text size={${fontSize}} weight="500" color="${textColor}">${label}</Text>${deleteIcon}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// AVATAR — CDS: sizes 24/40/56
// ---------------------------------------------------------------------------
components.avatar = {
  name: 'Avatar',
  description: 'CDS user avatar',
  sizes: ['small', 'medium', 'large'],

  render({ size = 'medium', initials = 'AB', color = 'primary' } = {}) {
    const c = colors();
    const dim = p(`--sizing/avatar/${size}`);
    const bg = color === 'primary' ? c.primary : color === 'secondary' ? c.secondary : c.grey400;
    const typo = getResponsiveTypographyStyle(`avatar/${size}`, _activeBreakpoint) || {};
    const fontSize = parseInt(typo['font-size'] || String(Math.round(dim * 0.35)));

    return `<Frame name="Avatar/${size}" w={${dim}} h={${dim}} bg="${bg}" rounded={${dim}} flex="row" items="center" justify="center">
  <Text size={${fontSize}} weight="400" color="#ffffff">${initials}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// BADGE
// ---------------------------------------------------------------------------
components.badge = {
  name: 'Badge',
  description: 'CDS notification badge',

  render({ count = 5, color = 'error' } = {}) {
    const c = colors();
    const bg = color === 'primary' ? c.primary : c.error;

    return `<Frame name="Badge" w={20} h={20} bg="${bg}" rounded={10} flex="row" items="center" justify="center">
  <Text size={12} weight="500" color="#ffffff">${count}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// CARD — CDS: radius small (4px), elevation 1
// ---------------------------------------------------------------------------
components.card = {
  name: 'Card',
  description: 'CDS content container',
  variants: ['elevated', 'outlined'],

  render({ variant = 'elevated', title = 'Card Title', subtitle = '', body = 'Card content goes here.', hasActions = false, width = 320 } = {}) {
    const c = colors();
    const r = radius('card');
    const h3 = getResponsiveTypographyStyle('heading/h4', _activeBreakpoint) || {};

    const strokeAttr = variant === 'outlined' ? ` stroke="${c.border}" strokeWidth={1}` : '';
    const shadowAttr = variant === 'elevated' ? ' shadow="0 2 4 #0000001a"' : '';
    const subtitleJsx = subtitle
      ? `\n    <Text size={12} color="${c.textSecondary}" w="fill">${subtitle}</Text>`
      : '';
    const actionsJsx = hasActions
      ? `\n  <Frame name="Actions" w="fill" flex="row" gap={8} justify="end" pt={8}>
    ${components.button.render({ variant: 'text', size: 'small', label: 'Cancel' })}
    ${components.button.render({ variant: 'contained', size: 'small', label: 'Confirm' })}
  </Frame>`
      : '';

    return `<Frame name="Card/${variant}" w={${width}} flex="col" bg="${c.bgPaper}" rounded={${r}} p={${spacing(4)}}${strokeAttr}${shadowAttr} overflow="hidden" gap={${spacing(3)}}>
  <Frame name="Header" w="fill" flex="col" gap={4}>
    <Text size={${parseInt(h3['font-size'] || '20')}} weight="${h3['font-weight'] || '600'}" color="${c.textPrimary}" w="fill">${title}</Text>${subtitleJsx}
  </Frame>
  <Text size={14} color="${c.textSecondary}" w="fill">${body}</Text>${actionsJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// DIALOG — CDS: title weight 600, content 14px
// ---------------------------------------------------------------------------
components.dialog = {
  name: 'Dialog',
  description: 'CDS modal dialog',

  render({ title = 'Dialog Title', body = 'Are you sure you want to proceed?', confirmLabel = 'Confirm', cancelLabel = 'Cancel' } = {}) {
    const c = colors();
    const tok = getComponentTokens('dialog');
    const r = radius('dialog');
    const maxW = parseInt(tok['max-width'] || '560');
    const contentPad = parseInt(tok['content-padding'] || '24');
    const titleH = parseInt(tok['title-height'] || '64');
    const actionsH = parseInt(tok['actions-height'] || '52');
    const actionsSpacing = parseInt(tok['actions-spacing'] || '8');
    const dialogTypo = getResponsiveTypographyStyle('dialog/title', _activeBreakpoint) || {};

    return `<Frame name="Dialog/Backdrop" w={800} h={600} flex="col" items="center" justify="center" bg="#00000052">
  <Frame name="Dialog" w={${maxW}} flex="col" bg="${c.bgPaper}" rounded={${r}} shadow="0 8 24 #00000033" overflow="hidden">
    <Frame name="Title" w="fill" h={${titleH}} flex="row" items="center" px={${contentPad}}>
      <Text size={${parseInt(dialogTypo['font-size'] || '20')}} weight="${dialogTypo['font-weight'] || '600'}" color="${c.textPrimary}" w="fill">${title}</Text>
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
// ALERT — CDS: 4 severities, radius 4px
// ---------------------------------------------------------------------------
components.alert = {
  name: 'Alert',
  description: 'CDS alert/notification banner',
  variants: ['error', 'warning', 'info', 'success'],

  render({ severity = 'info', title = '', message = 'This is an alert message.', hasClose = true } = {}) {
    const c = colors();
    const bgMap = { error: '#fdeded', warning: '#fff4e5', info: '#e5f6fd', success: '#edf7ed' };
    const colorMap = { error: c.error, warning: c.warning, info: c.info, success: c.success };
    const bg = bgMap[severity] || bgMap.info;
    const fg = colorMap[severity] || colorMap.info;
    const r = radius('alert');
    const alertTitleTypo = getResponsiveTypographyStyle('alert/title', _activeBreakpoint) || {};

    const titleJsx = title
      ? `\n    <Text size={${parseInt(alertTitleTypo['font-size'] || '18')}} weight="${alertTitleTypo['font-weight'] || '600'}" color="${fg}">${title}</Text>`
      : '';
    const closeJsx = hasClose
      ? `\n  <Text size={18} color="${fg}" opacity={0.6}>✕</Text>`
      : '';

    return `<Frame name="Alert/${severity}" w={400} flex="row" items="start" px={16} py={12} bg="${bg}" rounded={${r}} gap={12}>
  <Text size={22} color="${fg}">ℹ</Text>
  <Frame flex="col" gap={4} grow={1}>${titleJsx}
    <Text size={14} color="${fg}" w="fill">${message}</Text>
  </Frame>${closeJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// TOOLTIP
// ---------------------------------------------------------------------------
components.tooltip = {
  name: 'Tooltip',
  description: 'CDS contextual information popup',

  render({ text = 'Tooltip text' } = {}) {
    const tok = getComponentTokens('tooltip');
    const pxVal = parseInt(tok['padding-horizontal'] || '8');
    const pyVal = parseInt(tok['padding-vertical'] || '4');
    const r = radius('tooltip');

    return `<Frame name="Tooltip" flex="row" items="center" px={${pxVal}} py={${pyVal}} bg="#616161" rounded={${r}}>
  <Text size={12} weight="500" color="#ffffff">${text}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SNACKBAR
// ---------------------------------------------------------------------------
components.snackbar = {
  name: 'Snackbar',
  description: 'CDS brief notification',

  render({ message = 'Action completed successfully', hasAction = true, actionLabel = 'Undo' } = {}) {
    const c = colors();
    const tok = getComponentTokens('snackbar');
    const w = parseInt(tok['width'] || '344');
    const minH = parseInt(tok['min-height'] || '48');
    const pxVal = parseInt(tok['padding-horizontal'] || '16');

    const actionJsx = hasAction
      ? `\n  <Text size={14} weight="500" color="${c.primary}">${actionLabel}</Text>`
      : '';

    return `<Frame name="Snackbar" w={${w}} h={${minH}} flex="row" items="center" px={${pxVal}} bg="#323232" rounded={4} gap={8}>
  <Text size={14} color="#ffffff" w="fill">${message}</Text>${actionJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SKELETON
// ---------------------------------------------------------------------------
components.skeleton = {
  name: 'Skeleton',
  description: 'CDS loading placeholder',

  render({ variant = 'card', width = 320 } = {}) {
    const c = colors();
    const skeletonBg = c.grey300;

    if (variant === 'text') {
      return `<Frame name="Skeleton/text" w={${width}} flex="col" gap={8}>
  <Frame w="fill" h={12} bg="${skeletonBg}" rounded={2} />
  <Frame w={${Math.round(width * 0.8)}} h={12} bg="${skeletonBg}" rounded={2} />
  <Frame w={${Math.round(width * 0.6)}} h={12} bg="${skeletonBg}" rounded={2} />
</Frame>`;
    }

    return `<Frame name="Skeleton/card" w={${width}} flex="col" gap={12} p={16} bg="${c.bgPaper}" rounded={${radius('card')}} stroke="${c.border}" strokeWidth={1}>
  <Frame w="fill" h={180} bg="${skeletonBg}" rounded={${radius('medium')}} />
  <Frame w={${Math.round(width * 0.7)}} h={16} bg="${skeletonBg}" rounded={2} />
  <Frame w="fill" h={12} bg="${skeletonBg}" rounded={2} />
  <Frame w={${Math.round(width * 0.5)}} h={12} bg="${skeletonBg}" rounded={2} />
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// PROGRESS
// ---------------------------------------------------------------------------
components.progress = {
  name: 'Progress',
  description: 'CDS progress bar / circular indicator',

  render({ variant = 'linear', value = 60 } = {}) {
    const c = colors();

    if (variant === 'circular') {
      return `<Frame name="Progress/circular" w={40} h={40} rounded={40} stroke="${c.primary}" strokeWidth={4} bg="transparent" flex="row" items="center" justify="center">
  <Text size={12} weight="500" color="${c.textPrimary}">${value}%</Text>
</Frame>`;
    }

    return `<Frame name="Progress/linear" w={200} flex="col" gap={4}>
  <Frame w="fill" h={4} bg="${c.grey200}" rounded={2}>
    <Frame w={${Math.round(200 * value / 100)}} h={4} bg="${c.primary}" rounded={2} />
  </Frame>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// LIST
// ---------------------------------------------------------------------------
components.list = {
  name: 'List',
  description: 'CDS vertical list',

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
      <Frame w={20} h={20} bg="${c.textTertiary}" rounded={4} opacity={0.4} />
    </Frame>
    <Frame flex="col" gap={2} grow={1}>
      <Text size={14} weight="500" color="${c.textPrimary}">${item.primary}</Text>
      <Text size={12} color="${c.textSecondary}">${item.secondary}</Text>
    </Frame>
  </Frame>`
    ).join('\n');

    return `<Frame name="List" w={${width}} flex="col" bg="${c.bgPaper}" rounded={${radius('card')}} stroke="${c.border}" strokeWidth={1} overflow="hidden">
${listItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// NAVIGATION (SIDENAV) — CDS: drawer width 240
// ---------------------------------------------------------------------------
components.navigation = {
  name: 'Navigation',
  description: 'CDS sidebar navigation',

  render({ items = ['Dashboard', 'Users', 'Settings', 'Reports', 'Help'], activeIndex = 0, variant = 'default' } = {}) {
    const c = colors();
    const tok = getComponentTokens('nav');
    const w = variant === 'slim' ? parseInt(tok['width-slim'] || '64') : parseInt(tok['width-default'] || '240');
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
    <Text size={14} weight="${isActive ? '600' : '400'}" color="${textColor}" w="fill">${item}</Text>
  </Frame>`;
    }).join('\n');

    return `<Frame name="Navigation/${variant}" w={${w}} h={600} flex="col" bg="${c.bgPaper}" py={8} gap={2} stroke="${c.border}" strokeWidth={1}>
  <Frame name="Logo" w="fill" h={64} flex="row" items="center" px={${itemPx}} gap={12}>
    <Frame w={32} h={32} bg="${c.primary}" rounded={8} />
    <Text size={16} weight="600" color="${c.textPrimary}">App Name</Text>
  </Frame>
  <Frame name="Divider" w="fill" h={1} bg="${c.divider}" />
${navItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// APP BAR — CDS: height 64 desktop, elevation 4
// ---------------------------------------------------------------------------
components.appbar = {
  name: 'App Bar',
  description: 'CDS top navigation bar',

  render({ title = 'App Title', hasMenu = true, hasActions = true } = {}) {
    const c = colors();
    const h = 64;

    const menuIcon = hasMenu
      ? `  <Frame w={24} h={24} bg="#ffffff" rounded={4} opacity={0.8} />`
      : '';
    const actions = hasActions
      ? `  <Frame flex="row" gap={8}>
    <Frame w={24} h={24} bg="#ffffff" rounded={4} opacity={0.7} />
    <Frame w={24} h={24} bg="#ffffff" rounded={4} opacity={0.7} />
  </Frame>`
      : '';

    return `<Frame name="AppBar" w={1440} h={${h}} flex="row" items="center" px={24} bg="${c.primary}" gap={16} shadow="0 2 4 #0000001a">
${menuIcon}
  <Text size={20} weight="600" color="#ffffff" w="fill">${title}</Text>
${actions}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// TABS — CDS: primary selected indicator
// ---------------------------------------------------------------------------
components.tabs = {
  name: 'Tabs',
  description: 'CDS navigation tabs',

  render({ tabs = ['Tab One', 'Tab Two', 'Tab Three'], activeIndex = 0 } = {}) {
    const c = colors();

    const tabItems = tabs.map((tab, i) => {
      const isActive = i === activeIndex;
      const textColor = isActive ? c.primary : c.textSecondary;
      const indicator = isActive ? `\n    <Frame w="fill" h={2} bg="${c.primary}" />` : `\n    <Frame w="fill" h={2} bg="transparent" />`;

      return `  <Frame flex="col" items="center" px={16} py={12} grow={1}>
    <Text size={14} weight="500" color="${textColor}">${tab}</Text>${indicator}
  </Frame>`;
    }).join('\n');

    return `<Frame name="Tabs" w={400} flex="row" bg="${c.bgPaper}" stroke="${c.border}" strokeWidth={1}>
${tabItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// BREADCRUMB
// ---------------------------------------------------------------------------
components.breadcrumb = {
  name: 'Breadcrumb',
  description: 'CDS navigation breadcrumb trail',

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
// STEPPER
// ---------------------------------------------------------------------------
components.stepper = {
  name: 'Stepper',
  description: 'CDS multi-step progress indicator',

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
      <Text size={14} weight="600" color="#ffffff">${i + 1}</Text>
    </Frame>
    <Text size={14} weight="${isActive ? '600' : '400'}" color="${textColor}">${step}</Text>
  </Frame>${connector}`;
      }).join('\n');

      return `<Frame name="Stepper/horizontal" flex="row" items="center" gap={16} w="fill">
${stepItems}
</Frame>`;
    }

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
        <Text size={14} weight="600" color="#ffffff">${i + 1}</Text>
      </Frame>${connector}
    </Frame>
    <Frame flex="col" gap={4} pb={20}>
      <Text size={14} weight="${isActive ? '600' : '400'}" color="${textColor}">${step}</Text>
    </Frame>
  </Frame>`;
    }).join('\n');

    return `<Frame name="Stepper/vertical" flex="col" w={300}>
${stepItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// TIMELINE
// ---------------------------------------------------------------------------
components.timeline = {
  name: 'Timeline',
  description: 'CDS vertical timeline',

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
      const dotColor = ev.status === 'completed' || ev.status === 'active' ? c.primary : c.textDisabled;
      const isLast = i === events.length - 1;
      const connector = isLast ? '' : `\n      <Frame w={${connW}} grow={1} bg="${c.border}" />`;

      return `  <Frame name="TimelineItem/${ev.title}" w="fill" flex="row" gap={${spacing_h}}>
    <Frame flex="col" items="center" w={${dotSize + 8}}>
      <Frame w={${dotSize}} h={${dotSize}} bg="${dotColor}" rounded={${dotSize}} />${connector}
    </Frame>
    <Frame flex="col" gap={4} pb={${isLast ? 0 : spacing_v}}>
      <Text size={14} weight="600" color="${c.textPrimary}">${ev.title}</Text>
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
// DATA TABLE — CDS: header 50px, cell 50px, header weight 600
// ---------------------------------------------------------------------------
components.datatable = {
  name: 'Data Table',
  description: 'CDS tabular data display',

  render({ columns = ['Name', 'Email', 'Role', 'Status'], rows = [
    ['John Doe', 'john@example.com', 'Admin', 'Active'],
    ['Jane Smith', 'jane@example.com', 'Editor', 'Active'],
    ['Bob Wilson', 'bob@example.com', 'Viewer', 'Inactive'],
  ], width = 800 } = {}) {
    const c = colors();
    const tok = getComponentTokens('table');
    const headerH = parseInt(tok['header-height'] || '50');
    const rowH = parseInt(tok['row-height'] || '50');
    const cellPx = parseInt(tok['cell-padding-horizontal'] || '16');
    const colW = Math.floor(width / columns.length);

    const headerCells = columns.map(col =>
      `    <Frame w={${colW}} h={${headerH}} flex="row" items="center" px={${cellPx}}>
      <Text size={14} weight="600" color="${c.textPrimary}">${col}</Text>
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

    return `<Frame name="DataTable" w={${width}} flex="col" bg="${c.bgPaper}" rounded={${radius('card')}} stroke="${c.border}" strokeWidth={1} overflow="hidden">
  <Frame name="Header" w="fill" flex="row" bg="${c.grey50}">
${headerCells}
  </Frame>
${dataRows}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// DATE PICKER
// ---------------------------------------------------------------------------
components.datepicker = {
  name: 'Date Picker',
  description: 'CDS calendar date selector',

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
    <Text size={16} weight="600" color="${c.textPrimary}" w="fill">${month}</Text>
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

// ---------------------------------------------------------------------------
// PAGE HEADING
// ---------------------------------------------------------------------------
components.pageheading = {
  name: 'Page Heading',
  description: 'CDS page title with breadcrumbs and actions',

  render({ title = 'Page Title', breadcrumbs = ['Home', 'Section'], description = '', chips = [], hasActions = false, variant = 'desktop' } = {}) {
    const c = colors();
    const isMobile = variant === 'mobile';
    const titleSize = isMobile ? 32 : 48;
    const containerPad = isMobile ? spacing(4) : spacing(8);

    const breadcrumbJsx = breadcrumbs.length > 0
      ? `\n  ${components.breadcrumb.render({ items: [...breadcrumbs, title] })}`
      : '';
    const chipsJsx = chips.length > 0
      ? `\n  <Frame flex="row" gap={8}>\n${chips.map(ch => `    ${components.chip.render({ label: ch, variant: 'filled' })}`).join('\n')}\n  </Frame>`
      : '';
    const descJsx = description
      ? `\n  <Text size={14} color="${c.textSecondary}" w="fill">${description}</Text>`
      : '';
    const actionsJsx = hasActions
      ? `\n  <Frame flex="row" gap={8}>
    ${components.button.render({ variant: 'outlined', size: 'medium', label: 'Edit' })}
    ${components.button.render({ variant: 'contained', size: 'medium', label: 'Create New' })}
  </Frame>`
      : '';

    return `<Frame name="PageHeading/${variant}" w={${isMobile ? 390 : 1200}} flex="col" gap={8} p={${containerPad}}>
  ${breadcrumbJsx}
  <Text size={${titleSize}} weight="600" color="${c.textPrimary}" w="fill">${title}</Text>${chipsJsx}${descJsx}${actionsJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SECTION HEADING
// ---------------------------------------------------------------------------
components.sectionheading = {
  name: 'Section Heading',
  description: 'CDS section title with optional action',

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
    <Text size={20} weight="600" color="${c.textPrimary}">${title}</Text>${descJsx}
  </Frame>${actionJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// FORM LAYOUT
// ---------------------------------------------------------------------------
components.formlayout = {
  name: 'Form Layout',
  description: 'CDS structured form',

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

    return `<Frame name="FormLayout" w={${maxW}} flex="col" gap={${fieldSpacing}} p={${spacing(4)}} bg="${c.bgPaper}" rounded={${radius('card')}} stroke="${c.border}" strokeWidth={1}>
  <Text size={24} weight="600" color="${c.textPrimary}">${title}</Text>
  <Frame name="Divider" w="fill" h={1} bg="${c.divider}" />
${fieldsJsx}${submitJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// ACCORDION
// ---------------------------------------------------------------------------
components.accordion = {
  name: 'Accordion',
  description: 'CDS expandable sections',

  render({ items = [
    { title: 'Section 1', content: 'Content for section 1.', expanded: true },
    { title: 'Section 2', content: 'Content for section 2.', expanded: false },
    { title: 'Section 3', content: 'Content for section 3.', expanded: false },
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

    return `<Frame name="Accordion" w={${width}} flex="col" bg="${c.bgPaper}" rounded={${radius('card')}} overflow="hidden">
${sections}
</Frame>`;
  }
};


// ---------------------------------------------------------------------------
// FAB — CDS: Floating Action Button, sizes 32/40/50
// ---------------------------------------------------------------------------
components.fab = {
  name: 'FAB',
  description: 'CDS floating action button',
  sizes: ['small', 'medium', 'large'],

  render({ size = 'medium', color = 'primary', icon = '+' } = {}) {
    const c = colors();
    const dim = p(`--sizing/fab/${size}`);
    const bg = color === 'primary' ? c.primary : color === 'secondary' ? c.secondary : c.grey300;
    const textColor = color === 'primary' || color === 'secondary' ? '#ffffff' : c.textPrimary;
    const fontSize = size === 'large' ? 28 : size === 'small' ? 18 : 22;

    return `<Frame name="FAB/${size}" w={${dim}} h={${dim}} bg="${bg}" rounded={${dim}} flex="row" items="center" justify="center" shadow="0 3 5 #0000001a">
  <Text size={${fontSize}} weight="500" color="${textColor}">${icon}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// DIVIDER — CDS: horizontal/vertical
// ---------------------------------------------------------------------------
components.divider = {
  name: 'Divider',
  description: 'CDS visual separator',
  variants: ['horizontal', 'vertical'],

  render({ orientation = 'horizontal', width = 400, height = 200 } = {}) {
    const c = colors();
    if (orientation === 'vertical') {
      return `<Frame name="Divider/vertical" w={1} h={${height}} bg="${c.divider}" />`;
    }
    return `<Frame name="Divider/horizontal" w={${width}} h={1} bg="${c.divider}" />`;
  }
};

// ---------------------------------------------------------------------------
// PAPER — CDS: elevation surface, radius 4px
// ---------------------------------------------------------------------------
components.paper = {
  name: 'Paper',
  description: 'CDS elevated surface container',
  variants: ['elevation', 'outlined'],

  render({ variant = 'elevation', elevation = 'low', width = 320, height = 200, content = '' } = {}) {
    const c = colors();
    const r = radius('paper');
    const elevMap = { none: 0, low: 2, medium: 4, high: 8 };
    const elev = elevMap[elevation] || 2;
    const shadow = elev === 0 ? '' : ` shadow="0 ${elev} ${elev * 2} #0000001a"`;
    const strokeAttr = variant === 'outlined' ? ` stroke="${c.border}" strokeWidth={1}` : '';

    return `<Frame name="Paper/${variant}" w={${width}} h={${height}} bg="${c.bgPaper}" rounded={${r}}${strokeAttr}${shadow} p={${spacing(4)}}>
  ${content ? `<Text size={14} color="${c.textPrimary}" w="fill">${content}</Text>` : ''}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// RATING — CDS: star rating, sizes 20/24/32
// ---------------------------------------------------------------------------
components.rating = {
  name: 'Rating',
  description: 'CDS star rating input',
  sizes: ['small', 'medium', 'large'],

  render({ value = 3, max = 5, size = 'medium', readOnly = false } = {}) {
    const c = colors();
    const starSize = p(`--sizing/rating/${size}`);
    const filledColor = '#faaf00';
    const emptyColor = c.grey300;

    const stars = Array.from({ length: max }, (_, i) => {
      const filled = i < value;
      return `  <Text size={${starSize}} color="${filled ? filledColor : emptyColor}">★</Text>`;
    }).join('\n');

    return `<Frame name="Rating/${size}" flex="row" gap={4} items="center">
${stars}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SLIDER — CDS: track 4px, thumb 20px
// ---------------------------------------------------------------------------
components.slider = {
  name: 'Slider',
  description: 'CDS range slider input',

  render({ value = 40, min = 0, max = 100, showLabel = false, width = 240 } = {}) {
    const c = colors();
    const trackH = 4;
    const thumbSize = 20;
    const percent = ((value - min) / (max - min)) * 100;
    const filledW = Math.round(width * percent / 100);

    const labelJsx = showLabel
      ? `\n  <Frame w={28} h={24} bg="${c.primary}" rounded={4} flex="row" items="center" justify="center" x={${filledW - 14}} y={-30}>
    <Text size={12} weight="500" color="#ffffff">${value}</Text>
  </Frame>`
      : '';

    return `<Frame name="Slider" w={${width}} flex="col" gap={8}>
  ${labelJsx}
  <Frame w="fill" h={${trackH}} bg="${c.grey300}" rounded={2}>
    <Frame w={${filledW}} h={${trackH}} bg="${c.primary}" rounded={2} />
  </Frame>
  <Frame w={${thumbSize}} h={${thumbSize}} bg="${c.primary}" rounded={${thumbSize}} shadow="0 1 3 #0000004d" x={${filledW - thumbSize / 2}} y={-8} />
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// AUTOCOMPLETE — CDS: input + dropdown with search
// ---------------------------------------------------------------------------
components.autocomplete = {
  name: 'Autocomplete',
  description: 'CDS searchable select dropdown',

  render({ label = 'Country', placeholder = 'Search...', options = ['United States', 'Canada', 'United Kingdom', 'Australia'], open = true } = {}) {
    const c = colors();
    const r = radius('input');

    const dropdownJsx = open
      ? `\n  <Frame name="Dropdown" w="fill" flex="col" bg="${c.bgPaper}" rounded={${r}} stroke="${c.border}" strokeWidth={1} shadow="0 4 12 #0000001a">
${options.map(opt => `    <Frame w="fill" h={40} flex="row" items="center" px={12}>
      <Text size={14} color="${c.textPrimary}">${opt}</Text>
    </Frame>`).join('\n')}
  </Frame>`
      : '';

    return `<Frame name="Autocomplete" w={280} flex="col" gap={4}>
  <Text size={14} weight="400" color="${c.textSecondary}">${label}</Text>
  <Frame w="fill" h={32} flex="row" items="center" px={12} bg="${c.bgPaper}" stroke="${c.border}" strokeWidth={1} rounded={${r}} gap={8}>
    <Text size={14} color="${c.textDisabled}" w="fill">${placeholder}</Text>
    <Text size={12} color="${c.textSecondary}">▼</Text>
  </Frame>${dropdownJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// FILE UPLOAD — CDS: dashed border dropzone
// ---------------------------------------------------------------------------
components.fileupload = {
  name: 'File Upload',
  description: 'CDS drag-and-drop file upload zone',

  render({ text = 'Drag & drop files here, or click to browse', maxSize = '10 MB', multiple = true } = {}) {
    const c = colors();
    const r = radius('card');

    return `<Frame name="FileUpload" w={400} h={180} flex="col" items="center" justify="center" gap={12} p={32} bg="${c.bgPaper}" rounded={${r}} stroke="${c.primary}" strokeWidth={2}>
  <Frame w={48} h={48} bg="${c.primary200}" rounded={24} flex="row" items="center" justify="center">
    <Text size={24} color="${c.primary}">↑</Text>
  </Frame>
  <Text size={14} color="${c.textSecondary}" w="fill">${text}</Text>
  <Text size={12} color="${c.textDisabled}">Max file size: ${maxSize}${multiple ? ' • Multiple files allowed' : ''}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// DRAWER — CDS: side panel, width 240/320
// ---------------------------------------------------------------------------
components.drawer = {
  name: 'Drawer',
  description: 'CDS side drawer panel',

  render({ variant = 'permanent', anchor = 'left', items = ['Dashboard', 'Users', 'Settings'], activeIndex = 0, title = 'App Name' } = {}) {
    const c = colors();
    const w = 240;

    const navItems = items.map((item, i) => {
      const isActive = i === activeIndex;
      const bg = isActive ? 'rgba(75,63,255,0.08)' : 'transparent';
      return `  <Frame w="fill" h={48} flex="row" items="center" px={16} gap={16}${isActive ? ` bg="${bg}"` : ''} rounded={8}>
    <Frame w={24} h={24} bg="${isActive ? c.primary : c.textTertiary}" rounded={4} opacity={0.4} />
    <Text size={14} weight="${isActive ? '600' : '400'}" color="${isActive ? c.primary : c.textPrimary}">${item}</Text>
  </Frame>`;
    }).join('\n');

    return `<Frame name="Drawer/${variant}" w={${w}} h={600} flex="col" bg="${c.bgPaper}" stroke="${c.border}" strokeWidth={1} py={8} gap={2}>
  <Frame w="fill" h={64} flex="row" items="center" px={16} gap={12}>
    <Frame w={32} h={32} bg="${c.primary}" rounded={8} />
    <Text size={16} weight="600" color="${c.textPrimary}">${title}</Text>
  </Frame>
  <Frame w="fill" h={1} bg="${c.divider}" />
${navItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// BOTTOM NAVIGATION — CDS: height 56px
// ---------------------------------------------------------------------------
components.bottomnavigation = {
  name: 'Bottom Navigation',
  description: 'CDS mobile bottom tab bar',

  render({ items = ['Home', 'Search', 'Favorites', 'Profile'], activeIndex = 0 } = {}) {
    const c = colors();

    const navItems = items.map((item, i) => {
      const isActive = i === activeIndex;
      const textColor = isActive ? c.primary : c.textTertiary;
      return `  <Frame flex="col" items="center" gap={4} grow={1}>
    <Frame w={24} h={24} bg="${textColor}" rounded={4} opacity={${isActive ? '1' : '0.5'}} />
    <Text size={12} weight="500" color="${textColor}">${item}</Text>
  </Frame>`;
    }).join('\n');

    return `<Frame name="BottomNavigation" w={390} h={56} flex="row" items="center" px={8} bg="${c.bgPaper}" shadow="0 -1 3 #0000001a">
${navItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// MENU — CDS: dropdown menu, item height 48px
// ---------------------------------------------------------------------------
components.menu = {
  name: 'Menu',
  description: 'CDS dropdown/context menu',

  render({ items = ['Edit', 'Duplicate', 'Delete'], selectedIndex = -1 } = {}) {
    const c = colors();
    const r = radius('card');

    const menuItems = items.map((item, i) => {
      const isSelected = i === selectedIndex;
      const bg = isSelected ? 'rgba(75,63,255,0.08)' : 'transparent';
      const isDanger = item.toLowerCase() === 'delete' || item.toLowerCase() === 'remove';
      const textColor = isDanger ? c.error : c.textPrimary;
      return `  <Frame w="fill" h={48} flex="row" items="center" px={16} gap={12} bg="${bg}">
    <Text size={14} color="${textColor}">${item}</Text>
  </Frame>`;
    }).join('\n');

    return `<Frame name="Menu" w={200} flex="col" bg="${c.bgPaper}" rounded={${r}} shadow="0 4 12 #0000001a" stroke="${c.border}" strokeWidth={1} overflow="hidden" py={8}>
${menuItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// PAGINATION — CDS: rounded/circular, sizes 26/32/40
// ---------------------------------------------------------------------------
components.pagination = {
  name: 'Pagination',
  description: 'CDS page navigation controls',

  render({ total = 10, current = 3, size = 'medium', shape = 'circular' } = {}) {
    const c = colors();
    const itemSize = p(`--sizing/pagination/${size}`);
    const r = shape === 'circular' ? itemSize : 4;
    const pages = [1, 2, 3, '...', total - 1, total];

    const pageItems = pages.map(page => {
      const isCurrent = page === current;
      const bg = isCurrent ? c.primary : 'transparent';
      const textColor = isCurrent ? '#ffffff' : c.textPrimary;
      return `  <Frame w={${itemSize}} h={${itemSize}} bg="${bg}" rounded={${r}} flex="row" items="center" justify="center">
    <Text size={${size === 'small' ? 12 : 14}} color="${textColor}">${page}</Text>
  </Frame>`;
    }).join('\n');

    return `<Frame name="Pagination" flex="row" items="center" gap={4}>
  <Frame w={${itemSize}} h={${itemSize}} rounded={${r}} flex="row" items="center" justify="center">
    <Text size={14} color="${c.textSecondary}">‹</Text>
  </Frame>
${pageItems}
  <Frame w={${itemSize}} h={${itemSize}} rounded={${r}} flex="row" items="center" justify="center">
    <Text size={14} color="${c.textSecondary}">›</Text>
  </Frame>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// AVATAR GROUP — CDS: stacked avatars
// ---------------------------------------------------------------------------
components.avatargroup = {
  name: 'Avatar Group',
  description: 'CDS stacked avatar cluster',

  render({ count = 4, max = 3, size = 'medium' } = {}) {
    const c = colors();
    const dim = p(`--sizing/avatar/${size}`);
    const colorPalette = [c.primary, c.secondary, c.error, c.success, c.info, c.warning];
    const overlap = Math.round(dim * 0.3);

    const avatars = Array.from({ length: Math.min(count, max) }, (_, i) => {
      const bg = colorPalette[i % colorPalette.length];
      const initials = String.fromCharCode(65 + i);
      return `  <Frame w={${dim}} h={${dim}} bg="${bg}" rounded={${dim}} flex="row" items="center" justify="center" stroke="#ffffff" strokeWidth={2}>
    <Text size={${Math.round(dim * 0.35)}} weight="400" color="#ffffff">${initials}</Text>
  </Frame>`;
    }).join('\n');

    const extraCount = count - max;
    const extra = extraCount > 0
      ? `\n  <Frame w={${dim}} h={${dim}} bg="${c.grey300}" rounded={${dim}} flex="row" items="center" justify="center" stroke="#ffffff" strokeWidth={2}>
    <Text size={${Math.round(dim * 0.3)}} weight="500" color="${c.textPrimary}">+${extraCount}</Text>
  </Frame>`
      : '';

    return `<Frame name="AvatarGroup" flex="row">
${avatars}${extra}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// IMAGE LIST — CDS: responsive image grid
// ---------------------------------------------------------------------------
components.imagelist = {
  name: 'Image List',
  description: 'CDS image grid layout',

  render({ cols = 3, gap = 8, itemHeight = 160, items = 6, width = 480 } = {}) {
    const c = colors();
    const itemW = Math.floor((width - gap * (cols - 1)) / cols);

    const images = Array.from({ length: items }, (_, i) =>
      `  <Frame w={${itemW}} h={${itemHeight}} bg="${c.grey200}" rounded={4} flex="row" items="center" justify="center">
    <Text size={12} color="${c.textDisabled}">Image ${i + 1}</Text>
  </Frame>`
    ).join('\n');

    return `<Frame name="ImageList" w={${width}} flex="row" gap={${gap}} wrap={true}>
${images}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// BACKDROP — CDS: overlay
// ---------------------------------------------------------------------------
components.backdrop = {
  name: 'Backdrop',
  description: 'CDS fullscreen overlay backdrop',

  render({ opacity = 'standard' } = {}) {
    return `<Frame name="Backdrop" w={800} h={600} bg="rgba(0,0,0,0.5)" flex="row" items="center" justify="center">
  <Frame w={40} h={40} rounded={40} stroke="#ffffff" strokeWidth={3} />
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// LINEAR PROGRESS — CDS: horizontal bar
// ---------------------------------------------------------------------------
components.linearprogress = {
  name: 'Linear Progress',
  description: 'CDS horizontal progress bar',

  render({ value = 60, variant = 'determinate', color = 'primary', width = 200 } = {}) {
    const c = colors();
    const barColor = color === 'secondary' ? c.secondary : color === 'error' ? c.error : c.primary;
    const barW = variant === 'indeterminate' ? Math.round(width * 0.4) : Math.round(width * value / 100);

    return `<Frame name="LinearProgress" w={${width}} h={4} bg="${c.grey200}" rounded={2}>
  <Frame w={${barW}} h={4} bg="${barColor}" rounded={2} />
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// CIRCULAR PROGRESS — CDS: spinner
// ---------------------------------------------------------------------------
components.circularprogress = {
  name: 'Circular Progress',
  description: 'CDS circular spinner indicator',

  render({ size = 'medium', value = 75, showLabel = true } = {}) {
    const c = colors();
    const sizeMap = { small: 20, medium: 40, large: 60 };
    const dim = sizeMap[size] || 40;

    return `<Frame name="CircularProgress/${size}" w={${dim}} h={${dim}} rounded={${dim}} stroke="${c.primary}" strokeWidth={${size === 'small' ? 2 : 4}} bg="transparent" flex="row" items="center" justify="center">
  ${showLabel && size !== 'small' ? `<Text size={${size === 'large' ? 16 : 12}} weight="500" color="${c.textPrimary}">${value}%</Text>` : ''}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// TYPOGRAPHY — CDS: showcase display of all type styles
// ---------------------------------------------------------------------------
components.typography = {
  name: 'Typography',
  description: 'CDS typography scale showcase',

  render({ variant = 'showcase' } = {}) {
    const c = colors();

    return `<Frame name="Typography/showcase" w={600} flex="col" gap={16} p={32} bg="${c.bgPaper}" rounded={${radius('card')}}>
  <Text size={60} weight="600" color="${c.textPrimary}">Display 1</Text>
  <Text size={48} weight="600" color="${c.textPrimary}">Heading H1</Text>
  <Text size={32} weight="600" color="${c.textPrimary}">Heading H2</Text>
  <Text size={24} weight="600" color="${c.textPrimary}">Heading H3</Text>
  <Text size={20} weight="600" color="${c.textPrimary}">Heading H4</Text>
  <Text size={16} weight="600" color="${c.textPrimary}">Heading H5</Text>
  <Text size={14} weight="600" color="${c.textPrimary}">Heading H6</Text>
  <Frame w="fill" h={1} bg="${c.divider}" />
  <Text size={16} weight="400" color="${c.textPrimary}">Subtitle 1 — Regular weight for subtitles</Text>
  <Text size={14} weight="500" color="${c.textPrimary}">Subtitle 2 — Medium weight for emphasis</Text>
  <Text size={14} weight="400" color="${c.textPrimary}">Body 1 — Primary body text for content</Text>
  <Text size={12} weight="400" color="${c.textSecondary}">Body 2 — Secondary body text, smaller</Text>
  <Text size={14} weight="500" color="${c.primary}">BUTTON — Medium weight, no uppercase</Text>
  <Text size={12} weight="500" color="${c.textSecondary}">Caption — Small text for labels</Text>
  <Text size={12} weight="400" color="${c.textTertiary}">OVERLINE — Uppercase small text</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// LOGO — OpenGov branding
// ---------------------------------------------------------------------------
components.logo = {
  name: 'Logo',
  description: 'OpenGov logo placeholder with CDS branding',

  render({ type = 'logo', variant = 'fullcolor', size = 'medium' } = {}) {
    const c = colors();
    const sizeMap = {
      small: { w: 80, h: 23 },
      medium: { w: 120, h: 34 },
      large: { w: 200, h: 57 },
    };
    const dims = sizeMap[size] || sizeMap.medium;

    if (type === 'wand') {
      const wSize = size === 'small' ? 32 : size === 'large' ? 64 : 48;
      return `<Frame name="OpenGovWand/${variant}/${size}" w={${wSize}} h={${wSize}} bg="${c.primary}" rounded={${Math.round(wSize * 0.2)}} flex="row" items="center" justify="center">
  <Text size={${Math.round(wSize * 0.5)}} weight="600" color="#ffffff">✦</Text>
</Frame>`;
    }

    const bg = variant === 'white' || variant === 'reverse' ? c.grey900 : c.bgPaper;
    const textColor = variant === 'white' || variant === 'reverse' ? '#ffffff' :
                       variant === 'blurple' ? c.primary :
                       variant === 'gray' ? c.grey500 :
                       variant === 'black' ? c.grey900 : c.primary;

    return `<Frame name="Logo/${variant}/${size}" w={${dims.w}} h={${dims.h}} bg="${bg}" flex="row" items="center" justify="center" rounded={4}>
  <Text size={${Math.round(dims.h * 0.45)}} weight="600" color="${textColor}">OpenGov</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// PATTERN: LOGIN FORM — CDS standard login pattern
// ---------------------------------------------------------------------------
components.loginform = {
  name: 'Login Form',
  description: 'CDS standard login page pattern',

  render({ title = 'Sign In', hasLogo = true, hasForgotPassword = true, hasSignUp = true } = {}) {
    const c = colors();
    const r = radius('card');

    const logoJsx = hasLogo
      ? `\n    ${components.logo.render({ size: 'medium', variant: 'fullcolor' })}`
      : '';
    const forgotJsx = hasForgotPassword
      ? `\n    <Text size={14} weight="500" color="${c.primary}">Forgot password?</Text>`
      : '';
    const signUpJsx = hasSignUp
      ? `\n    <Frame w="fill" flex="row" items="center" justify="center" gap={4}>
      <Text size={14} color="${c.textSecondary}">Don't have an account?</Text>
      <Text size={14} weight="500" color="${c.primary}">Sign Up</Text>
    </Frame>`
      : '';

    return `<Frame name="Pattern/LoginForm" w={400} flex="col" items="center" gap={24} p={32} bg="${c.bgPaper}" rounded={${r}} shadow="0 4 12 #0000001a">
    ${logoJsx}
    <Text size={24} weight="600" color="${c.textPrimary}">${title}</Text>
    ${components.textfield.render({ label: 'Email', placeholder: 'email@example.com', size: 'medium' })}
    ${components.textfield.render({ label: 'Password', placeholder: '••••••••', size: 'medium' })}
    ${forgotJsx}
    ${components.button.render({ variant: 'contained', size: 'large', label: 'Sign In', color: 'primary' })}
    <Frame w="fill" flex="row" items="center" gap={8}>
      <Frame h={1} bg="${c.divider}" grow={1} />
      <Text size={12} color="${c.textDisabled}">OR</Text>
      <Frame h={1} bg="${c.divider}" grow={1} />
    </Frame>${signUpJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// PATTERN: DASHBOARD — CDS dashboard layout
// ---------------------------------------------------------------------------
components.dashboard = {
  name: 'Dashboard',
  description: 'CDS dashboard layout pattern',

  render({ title = 'Dashboard', metrics = [
    { label: 'Total Users', value: '12,847' },
    { label: 'Revenue', value: '$48,290' },
    { label: 'Active Now', value: '2,345' },
    { label: 'Conversion', value: '3.2%' },
  ] } = {}) {
    const c = colors();

    const metricCards = metrics.map(m =>
      `    <Frame flex="col" gap={8} p={${spacing(4)}} bg="${c.bgPaper}" rounded={${radius('card')}} grow={1} shadow="0 1 3 #0000001a">
      <Text size={12} weight="500" color="${c.textSecondary}">${m.label}</Text>
      <Text size={24} weight="600" color="${c.textPrimary}">${m.value}</Text>
    </Frame>`
    ).join('\n');

    return `<Frame name="Pattern/Dashboard" w={1200} flex="col" gap={24} p={${spacing(6)}} bg="${c.bgDefault}">
  ${components.appbar.render({ title })}
  <Frame w="fill" flex="row" gap={24}>
${metricCards}
  </Frame>
  <Frame w="fill" flex="row" gap={24}>
    <Frame flex="col" gap={16} grow={2} p={${spacing(4)}} bg="${c.bgPaper}" rounded={${radius('card')}} shadow="0 1 3 #0000001a">
      <Text size={18} weight="600" color="${c.textPrimary}">Recent Activity</Text>
      ${components.list.render({ width: 600 })}
    </Frame>
    <Frame flex="col" gap={16} grow={1} p={${spacing(4)}} bg="${c.bgPaper}" rounded={${radius('card')}} shadow="0 1 3 #0000001a">
      <Text size={18} weight="600" color="${c.textPrimary}">Quick Actions</Text>
      ${components.button.render({ variant: 'contained', size: 'medium', label: 'New Report' })}
      ${components.button.render({ variant: 'outlined', size: 'medium', label: 'Export Data' })}
      ${components.button.render({ variant: 'outlined', size: 'medium', label: 'Settings' })}
    </Frame>
  </Frame>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// PATTERN: PROFILE CARD — CDS user profile card
// ---------------------------------------------------------------------------
components.profilecard = {
  name: 'Profile Card',
  description: 'CDS user profile card pattern',

  render({ name = 'John Doe', role = 'Product Designer', email = 'john@example.com', hasActions = true } = {}) {
    const c = colors();
    const r = radius('card');

    const actionsJsx = hasActions
      ? `\n  <Frame w="fill" flex="row" gap={8} justify="center">
    ${components.button.render({ variant: 'outlined', size: 'small', label: 'Message' })}
    ${components.button.render({ variant: 'contained', size: 'small', label: 'Follow' })}
  </Frame>`
      : '';

    return `<Frame name="Pattern/ProfileCard" w={320} flex="col" items="center" gap={16} p={${spacing(6)}} bg="${c.bgPaper}" rounded={${r}} shadow="0 2 4 #0000001a">
  ${components.avatar.render({ size: 'large', initials: name.split(' ').map(n => n[0]).join('') })}
  <Frame flex="col" items="center" gap={4}>
    <Text size={20} weight="600" color="${c.textPrimary}">${name}</Text>
    <Text size={14} color="${c.textSecondary}">${role}</Text>
    <Text size={12} color="${c.textTertiary}">${email}</Text>
  </Frame>${actionsJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// PATTERN: CONTACT FORM — CDS multi-field form
// ---------------------------------------------------------------------------
components.contactform = {
  name: 'Contact Form',
  description: 'CDS contact/feedback form pattern',

  render({ title = 'Contact Us', hasAlert = true } = {}) {
    const c = colors();
    const r = radius('card');

    const alertJsx = hasAlert
      ? `\n  ${components.alert.render({ severity: 'info', message: 'We typically respond within 24 hours.' })}`
      : '';

    return `<Frame name="Pattern/ContactForm" w={480} flex="col" gap={24} p={${spacing(6)}} bg="${c.bgPaper}" rounded={${r}} shadow="0 2 4 #0000001a">
  <Text size={24} weight="600" color="${c.textPrimary}">${title}</Text>
  <Frame w="fill" flex="row" gap={16}>
    ${components.textfield.render({ label: 'First Name', placeholder: 'John' })}
    ${components.textfield.render({ label: 'Last Name', placeholder: 'Doe' })}
  </Frame>
  ${components.textfield.render({ label: 'Email', placeholder: 'john@example.com' })}
  <Frame name="TextArea" w="fill" flex="col" gap={4}>
    <Text size={14} weight="400" color="${c.textSecondary}">Message</Text>
    <Frame w="fill" h={120} flex="col" p={12} bg="${c.bgPaper}" stroke="${c.border}" strokeWidth={1} rounded={${radius('input')}}>
      <Text size={14} color="${c.textDisabled}">Tell us how we can help...</Text>
    </Frame>
  </Frame>${alertJsx}
  <Frame w="fill" flex="row" justify="end" gap={12}>
    ${components.button.render({ variant: 'text', size: 'medium', label: 'Cancel' })}
    ${components.button.render({ variant: 'contained', size: 'medium', label: 'Send Message' })}
  </Frame>
</Frame>`;
  }
};


// ============================================================================
// REGISTRY API
// ============================================================================

export function getComponent(name) {
  const key = name.toLowerCase().replace(/[\s\-_]/g, '');
  return components[key] || null;
}

export function listComponents() {
  return Object.entries(components).map(([key, comp]) => ({
    key,
    name: comp.name,
    description: comp.description,
    variants: comp.variants || [],
    sizes: comp.sizes || [],
    colors: comp.colors || [],
  }));
}

export function renderComponent(name, options = {}) {
  if (options.breakpoint) setBreakpoint(options.breakpoint);
  const comp = getComponent(name);
  if (!comp) return null;
  return comp.render(options);
}

export function renderAllVariants(name) {
  const comp = getComponent(name);
  if (!comp || !comp.renderAll) {
    return comp ? [comp.render()] : [];
  }
  return comp.renderAll();
}

/**
 * Render a component at all 3 breakpoints side by side.
 * Returns an array of 3 JSX strings: [desktopJsx, tabletJsx, mobileJsx]
 */
export function renderResponsive(name, options = {}) {
  const bpWidths = getBreakpointWidths();
  const breakpoints = ['desktop', 'tablet', 'mobile'];
  const results = [];

  for (const bp of breakpoints) {
    setBreakpoint(bp);
    const jsx = renderComponent(name, { ...options, breakpoint: bp });
    if (jsx) {
      results.push({
        breakpoint: bp,
        width: bpWidths[bp],
        jsx,
      });
    }
  }

  setBreakpoint('desktop');
  return results;
}

/**
 * Render a full page at a specific breakpoint width.
 * Adjusts the frame width and all component tokens to the breakpoint.
 */
export function buildResponsivePage(pageConfig) {
  const bp = pageConfig.breakpoint || 'desktop';
  setBreakpoint(bp);
  const bpWidths = getBreakpointWidths();
  const width = pageConfig.width || bpWidths[bp];
  return buildPage({ ...pageConfig, width });
}

/**
 * Render a page at all 3 breakpoints.
 * Returns array of { breakpoint, width, jsx } for batch rendering.
 */
export function buildResponsivePageSet(pageConfig) {
  const bpWidths = getBreakpointWidths();
  const breakpoints = ['desktop', 'tablet', 'mobile'];
  const results = [];

  for (const bp of breakpoints) {
    setBreakpoint(bp);
    const width = bpWidths[bp];
    const pageName = `${pageConfig.name || 'Page'} — ${bp.charAt(0).toUpperCase() + bp.slice(1)}`;
    const jsx = buildPage({ ...pageConfig, name: pageName, width });
    results.push({ breakpoint: bp, width, jsx });
  }

  setBreakpoint('desktop');
  return results;
}

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
  renderResponsive,
  buildPage,
  buildResponsivePage,
  buildResponsivePageSet,
  setBreakpoint,
  getActiveBreakpoint,
  components,
};
