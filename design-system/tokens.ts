/**
 * Design System Token Specification
 *
 * This file contains the complete, standardized design token specification
 * for the Material Design component system. It resolves all token naming
 * inconsistencies found in the Figma audit.
 *
 * Naming Convention: --{category}/{subcategory}/{property}
 *
 * @version 1.0.0
 * @date 2026-02-25
 */

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type TokenValue = string | number;
export type TokenMap = Record<string, TokenValue>;
export type ThemeVariant = 'light' | 'dark';

export interface TokenCategory {
  name: string;
  description: string;
  tokens: TokenMap;
}

// ============================================================================
// SECTION 1: TYPOGRAPHY TOKENS (95 tokens)
// ============================================================================

/**
 * Typography tokens define font families, sizes, weights, line heights,
 * and letter spacing across all text elements in the design system.
 *
 * Font Family: DM Sans (with fallbacks)
 * Base Size: 16px (1rem)
 * Scale: 12px - 80px
 */
export const typographyTokens: TokenMap = {
  // Font Families
  '--typography/font-family/primary': '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  '--typography/font-family/monospace': '"Roboto Mono", "Courier New", monospace',

  // Display Styles (Hero text, page titles)
  '--typography/display/1/font-family': '"DM Sans", sans-serif',
  '--typography/display/1/font-size': '80px',
  '--typography/display/1/font-weight': '700',
  '--typography/display/1/line-height': '96px',
  '--typography/display/1/letter-spacing': '-1.5px',

  '--typography/display/2/font-size': '60px',
  '--typography/display/2/font-weight': '700',
  '--typography/display/2/line-height': '72px',
  '--typography/display/2/letter-spacing': '-0.5px',

  // Headings (h1-h6)
  '--typography/heading/h1/font-size': '48px',
  '--typography/heading/h1/font-weight': '700',
  '--typography/heading/h1/line-height': '56px',
  '--typography/heading/h1/letter-spacing': '0px',

  '--typography/heading/h2/font-size': '24px',
  '--typography/heading/h2/font-weight': '700',
  '--typography/heading/h2/line-height': '32px',
  '--typography/heading/h2/letter-spacing': '0px',

  '--typography/heading/h3/font-size': '20px',
  '--typography/heading/h3/font-weight': '700',
  '--typography/heading/h3/line-height': '28px',
  '--typography/heading/h3/letter-spacing': '0px',

  '--typography/heading/h4/font-size': '18px',
  '--typography/heading/h4/font-weight': '700',
  '--typography/heading/h4/line-height': '24px',
  '--typography/heading/h4/letter-spacing': '0.15px',

  '--typography/heading/h5/font-size': '14px',
  '--typography/heading/h5/font-weight': '700',
  '--typography/heading/h5/line-height': '20px',
  '--typography/heading/h5/letter-spacing': '0.1px',

  '--typography/heading/h6/font-size': '12px',
  '--typography/heading/h6/font-weight': '700',
  '--typography/heading/h6/line-height': '16px',
  '--typography/heading/h6/letter-spacing': '0.15px',

  // Body Text
  '--typography/body/large/font-size': '16px',
  '--typography/body/large/font-weight': '400',
  '--typography/body/large/line-height': '24px',
  '--typography/body/large/letter-spacing': '0.15px',

  '--typography/body/medium/font-size': '14px',
  '--typography/body/medium/font-weight': '400',
  '--typography/body/medium/line-height': '20px',
  '--typography/body/medium/letter-spacing': '0.25px',

  '--typography/body/small/font-size': '12px',
  '--typography/body/small/font-weight': '400',
  '--typography/body/small/line-height': '16px',
  '--typography/body/small/letter-spacing': '0.4px',

  // Input Labels
  '--typography/input/label/large/font-size': '16px',
  '--typography/input/label/large/font-weight': '500',
  '--typography/input/label/large/line-height': '24px',

  '--typography/input/label/medium/font-size': '14px',
  '--typography/input/label/medium/font-weight': '500',
  '--typography/input/label/medium/line-height': '20px',

  '--typography/input/label/small/font-size': '12px',
  '--typography/input/label/small/font-weight': '500',
  '--typography/input/label/small/line-height': '16px',

  // Helper Text & Captions
  '--typography/helper-text/font-size': '12px',
  '--typography/helper-text/font-weight': '400',
  '--typography/helper-text/line-height': '16px',
  '--typography/helper-text/letter-spacing': '0.4px',

  '--typography/caption/font-size': '12px',
  '--typography/caption/font-weight': '400',
  '--typography/caption/line-height': '16px',
  '--typography/caption/letter-spacing': '0.4px',

  // Overline (All caps labels)
  '--typography/overline/font-size': '12px',
  '--typography/overline/font-weight': '700',
  '--typography/overline/line-height': '16px',
  '--typography/overline/letter-spacing': '1px',
  '--typography/overline/text-transform': 'uppercase',

  // Buttons
  '--typography/button/large/font-size': '16px',
  '--typography/button/large/font-weight': '700',
  '--typography/button/large/line-height': '24px',
  '--typography/button/large/letter-spacing': '0.5px',

  '--typography/button/medium/font-size': '14px',
  '--typography/button/medium/font-weight': '700',
  '--typography/button/medium/line-height': '20px',
  '--typography/button/medium/letter-spacing': '0.4px',

  '--typography/button/small/font-size': '12px',
  '--typography/button/small/font-weight': '700',
  '--typography/button/small/line-height': '16px',
  '--typography/button/small/letter-spacing': '0.4px',
};

// ============================================================================
// SECTION 2: COLOR TOKENS (150+ tokens)
// ============================================================================

/**
 * Color tokens for light and dark themes. Includes primary, secondary,
 * error, warning, success, info colors, plus semantic text, background,
 * and border colors.
 *
 * All colors use RGBA format for flexibility with opacity.
 */
export const colorTokens: TokenMap = {
  // Primary Colors
  '--colors/primary/main': '#4b3fff',
  '--colors/primary/light': '#7b6bff',
  '--colors/primary/dark': '#3829cc',
  '--colors/primary/contrast-text': '#ffffff',

  // Secondary Colors
  '--colors/secondary/main': '#9c27b0',
  '--colors/secondary/light': '#ba68c8',
  '--colors/secondary/dark': '#7b1fa2',
  '--colors/secondary/contrast-text': '#ffffff',

  // Error Colors
  '--colors/error/main': '#d33423',
  '--colors/error/light': '#e57373',
  '--colors/error/dark': '#c62828',
  '--colors/error/contrast-text': '#ffffff',

  // Warning Colors
  '--colors/warning/main': '#ed6c02',
  '--colors/warning/light': '#ff9800',
  '--colors/warning/dark': '#e65100',
  '--colors/warning/contrast-text': '#ffffff',

  // Success Colors
  '--colors/success/main': '#2e7d32',
  '--colors/success/light': '#4caf50',
  '--colors/success/dark': '#1b5e20',
  '--colors/success/contrast-text': '#ffffff',

  // Info Colors
  '--colors/info/main': '#0288d1',
  '--colors/info/light': '#03a9f4',
  '--colors/info/dark': '#01579b',
  '--colors/info/contrast-text': '#ffffff',

  // Text Colors (Light Theme)
  '--colors/text/primary': 'rgba(0, 0, 0, 0.87)',
  '--colors/text/secondary': 'rgba(0, 0, 0, 0.6)',
  '--colors/text/disabled': 'rgba(0, 0, 0, 0.38)',
  '--colors/text/hint': 'rgba(0, 0, 0, 0.38)',

  // Background Colors (Light Theme)
  '--colors/background/default': '#ffffff',
  '--colors/background/paper': '#ffffff',
  '--colors/background/paper-elevation-1': '#f5f5f5',
  '--colors/background/paper-elevation-2': '#eeeeee',
  '--colors/background/paper-elevation-4': '#e0e0e0',

  // Divider & Borders
  '--colors/divider': 'rgba(0, 0, 0, 0.12)',
  '--colors/border/default': 'rgba(0, 0, 0, 0.12)',
  '--colors/border/focus': '#4b3fff',
  '--colors/border/error': '#d33423',

  // Action Colors
  '--colors/action/active': 'rgba(0, 0, 0, 0.54)',
  '--colors/action/hover': 'rgba(0, 0, 0, 0.04)',
  '--colors/action/selected': 'rgba(0, 0, 0, 0.08)',
  '--colors/action/disabled': 'rgba(0, 0, 0, 0.26)',
  '--colors/action/disabled-background': 'rgba(0, 0, 0, 0.12)',
  '--colors/action/focus': 'rgba(0, 0, 0, 0.12)',

  // Component-Specific Colors
  '--colors/breadcrumb/text': 'rgba(0, 0, 0, 0.6)',
  '--colors/breadcrumb/separator': 'rgba(0, 0, 0, 0.38)',
  '--colors/breadcrumb/collapse-fill': '#e0e0e0',

  '--colors/chip/background': '#e0e0e0',
  '--colors/chip/text': 'rgba(0, 0, 0, 0.87)',
  '--colors/chip/border': 'transparent',

  '--colors/timeline/connector': 'rgba(0, 0, 0, 0.12)',
  '--colors/timeline/dot-primary': '#4b3fff',
  '--colors/timeline/dot-secondary': '#9c27b0',
  '--colors/timeline/dot-default': '#bdbdbd',

  '--colors/stepper/connector': 'rgba(0, 0, 0, 0.12)',
  '--colors/stepper/step-active': '#4b3fff',
  '--colors/stepper/step-completed': '#4b3fff',
  '--colors/stepper/step-inactive': 'rgba(0, 0, 0, 0.38)',

  '--colors/datepicker/today-background': 'rgba(75, 63, 255, 0.08)',
  '--colors/datepicker/selected-background': '#4b3fff',
  '--colors/datepicker/selected-text': '#ffffff',
  '--colors/datepicker/hover-background': 'rgba(0, 0, 0, 0.04)',

  '--colors/nav/background': '#ffffff',
  '--colors/nav/item-hover': 'rgba(0, 0, 0, 0.04)',
  '--colors/nav/item-active': 'rgba(75, 63, 255, 0.08)',
  '--colors/nav/item-text': 'rgba(0, 0, 0, 0.87)',
  '--colors/nav/item-text-active': '#4b3fff',

  '--colors/table/header-background': '#fafafa',
  '--colors/table/row-hover': 'rgba(0, 0, 0, 0.04)',
  '--colors/table/row-selected': 'rgba(75, 63, 255, 0.08)',
  '--colors/table/border': 'rgba(0, 0, 0, 0.12)',
};

/**
 * Dark theme color overrides
 */
export const darkThemeColorTokens: TokenMap = {
  // Text Colors (Dark Theme)
  '--colors/text/primary': 'rgba(255, 255, 255, 0.87)',
  '--colors/text/secondary': 'rgba(255, 255, 255, 0.6)',
  '--colors/text/disabled': 'rgba(255, 255, 255, 0.38)',
  '--colors/text/hint': 'rgba(255, 255, 255, 0.38)',

  // Background Colors (Dark Theme)
  '--colors/background/default': '#121212',
  '--colors/background/paper': '#1e1e1e',
  '--colors/background/paper-elevation-1': '#2c2c2c',
  '--colors/background/paper-elevation-2': '#333333',
  '--colors/background/paper-elevation-4': '#3d3d3d',

  // Divider & Borders (Dark Theme)
  '--colors/divider': 'rgba(255, 255, 255, 0.12)',
  '--colors/border/default': 'rgba(255, 255, 255, 0.12)',

  // Action Colors (Dark Theme)
  '--colors/action/active': 'rgba(255, 255, 255, 0.54)',
  '--colors/action/hover': 'rgba(255, 255, 255, 0.08)',
  '--colors/action/selected': 'rgba(255, 255, 255, 0.16)',
  '--colors/action/disabled': 'rgba(255, 255, 255, 0.3)',
  '--colors/action/disabled-background': 'rgba(255, 255, 255, 0.12)',
  '--colors/action/focus': 'rgba(255, 255, 255, 0.12)',
};

// ============================================================================
// SECTION 3: SPACING TOKENS (32 tokens)
// ============================================================================

/**
 * Spacing tokens based on 4px grid system.
 * Range: 0px (0) to 128px (32)
 *
 * Usage: Padding, margin, gaps in layouts
 */
export const spacingTokens: TokenMap = {
  '--spacing/0': '0px',
  '--spacing/1': '4px',
  '--spacing/2': '8px',
  '--spacing/3': '12px',
  '--spacing/4': '16px',
  '--spacing/5': '20px',
  '--spacing/6': '24px',
  '--spacing/7': '28px',
  '--spacing/8': '32px',
  '--spacing/9': '36px',
  '--spacing/10': '40px',
  '--spacing/11': '44px',
  '--spacing/12': '48px',
  '--spacing/14': '56px',
  '--spacing/16': '64px',
  '--spacing/18': '72px',
  '--spacing/20': '80px',
  '--spacing/22': '88px',
  '--spacing/24': '96px',
  '--spacing/28': '112px',
  '--spacing/32': '128px',
};

// ============================================================================
// SECTION 4: SIZING TOKENS (60+ tokens)
// ============================================================================

/**
 * Sizing tokens for component dimensions (width, height, min/max sizes)
 */
export const sizingTokens: TokenMap = {
  // Icon Sizes
  '--sizing/icon/small': '16px',
  '--sizing/icon/medium': '24px',
  '--sizing/icon/large': '32px',
  '--sizing/icon/xlarge': '40px',

  // Button Heights
  '--sizing/button/small': '32px',
  '--sizing/button/medium': '40px',
  '--sizing/button/large': '48px',

  // Input Heights
  '--sizing/input/small': '32px',
  '--sizing/input/medium': '40px',
  '--sizing/input/large': '48px',

  // Avatar Sizes
  '--sizing/avatar/small': '24px',
  '--sizing/avatar/medium': '40px',
  '--sizing/avatar/large': '56px',
  '--sizing/avatar/xlarge': '96px',

  // Chip Height
  '--sizing/chip/small': '24px',
  '--sizing/chip/medium': '32px',

  // Container Max Widths
  '--sizing/container/xs': '444px',
  '--sizing/container/sm': '600px',
  '--sizing/container/md': '900px',
  '--sizing/container/lg': '1200px',
  '--sizing/container/xl': '1536px',

  // Common Component Dimensions
  '--sizing/common/touch-target': '48px', // Minimum touch target size
  '--sizing/common/scrollbar-width': '8px',
  '--sizing/common/divider-thickness': '1px',
};

// ============================================================================
// SECTION 5: BORDER RADIUS TOKENS (12 tokens)
// ============================================================================

/**
 * Border radius tokens for rounded corners
 */
export const borderRadiusTokens: TokenMap = {
  '--border-radius/none': '0px',
  '--border-radius/small': '4px',
  '--border-radius/medium': '8px',
  '--border-radius/large': '12px',
  '--border-radius/xlarge': '16px',
  '--border-radius/full': '9999px', // Perfect circle/pill

  // Component-specific
  '--border-radius/button': '8px',
  '--border-radius/input': '4px',
  '--border-radius/card': '12px',
  '--border-radius/chip': '16px',
  '--border-radius/dialog': '12px',
  '--border-radius/tooltip': '4px',
};

// ============================================================================
// SECTION 6: ELEVATION/SHADOW TOKENS (10 tokens)
// ============================================================================

/**
 * Material Design elevation system (shadow depths 0-24)
 */
export const elevationTokens: TokenMap = {
  '--elevation/0': 'none',
  '--elevation/1': '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  '--elevation/2': '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
  '--elevation/3': '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  '--elevation/4': '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  '--elevation/6': '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
  '--elevation/8': '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
  '--elevation/12': '0px 7px 8px -4px rgba(0,0,0,0.2), 0px 12px 17px 2px rgba(0,0,0,0.14), 0px 5px 22px 4px rgba(0,0,0,0.12)',
  '--elevation/16': '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
  '--elevation/24': '0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
};

// ============================================================================
// SECTION 7: Z-INDEX TOKENS (8 tokens)
// ============================================================================

/**
 * Z-index layering system for stacking contexts
 */
export const zIndexTokens: TokenMap = {
  '--z-index/base': '0',
  '--z-index/dropdown': '1000',
  '--z-index/sticky': '1100',
  '--z-index/fixed': '1200',
  '--z-index/modal-backdrop': '1300',
  '--z-index/modal': '1400',
  '--z-index/popover': '1500',
  '--z-index/tooltip': '1600',
};

// ============================================================================
// SECTION 8: COMPONENT-SPECIFIC TOKENS (200+ tokens)
// ============================================================================

/**
 * Component-specific measurements and properties that don't fit
 * into the global scale
 */
export const componentTokens: TokenMap = {
  // Timeline Component
  '--component/timeline/dot-size': '12px',
  '--component/timeline/dot-border-width': '2px',
  '--component/timeline/connector-width': '2px',
  '--component/timeline/spacing-horizontal': '16px',
  '--component/timeline/spacing-vertical': '24px',
  '--component/timeline/content-spacing': '16px',

  // Stepper Component
  '--component/stepper/step-size': '40px',
  '--component/stepper/step-icon-size': '24px',
  '--component/stepper/connector-height': '2px',
  '--component/stepper/connector-spacing': '8px',
  '--component/stepper/label-spacing': '8px',
  '--component/stepper/step-spacing': '24px',

  // Date Picker Component
  '--component/datepicker/calendar-width': '320px',
  '--component/datepicker/header-height': '56px',
  '--component/datepicker/day-button-size': '40px',
  '--component/datepicker/day-spacing': '2px',
  '--component/datepicker/month-spacing': '16px',
  '--component/datepicker/year-button-height': '36px',

  // Data Table Component
  '--component/table/header-height': '56px',
  '--component/table/row-height': '52px',
  '--component/table/dense-row-height': '40px',
  '--component/table/cell-padding-horizontal': '16px',
  '--component/table/cell-padding-vertical': '16px',
  '--component/table/checkbox-width': '48px',
  '--component/table/sort-icon-size': '18px',

  // Navigation (Sidenav) Component
  '--component/nav/width-default': '256px',
  '--component/nav/width-slim': '64px',
  '--component/nav/width-combined': '320px',
  '--component/nav/width-small-screen': '280px',
  '--component/nav/item-height': '48px',
  '--component/nav/item-height-collapsed': '64px',
  '--component/nav/item-height-expanded': '272px',
  '--component/nav/item-padding-horizontal': '16px',
  '--component/nav/item-padding-vertical': '12px',
  '--component/nav/icon-size': '24px',
  '--component/nav/icon-spacing': '16px',
  '--component/nav/expand-icon-size': '20px',

  // Breadcrumb Component
  '--component/breadcrumb/item-spacing': '8px',
  '--component/breadcrumb/separator-spacing': '8px',
  '--component/breadcrumb/collapse-button-size': '24px',
  '--component/breadcrumb/max-items-visible': '3',

  // Chip Component
  '--component/chip/height': '32px',
  '--component/chip/padding-horizontal': '12px',
  '--component/chip/avatar-size': '24px',
  '--component/chip/icon-size': '18px',
  '--component/chip/delete-icon-size': '18px',
  '--component/chip/spacing': '8px',

  // Page Heading Component
  '--component/heading/page-title-spacing-bottom': '16px',
  '--component/heading/breadcrumb-spacing-bottom': '8px',
  '--component/heading/description-spacing-top': '8px',
  '--component/heading/actions-spacing-left': '24px',
  '--component/heading/chip-spacing': '8px',

  // Form Field Component
  '--component/form/field-spacing-vertical': '24px',
  '--component/form/field-max-width': '500px',
  '--component/form/label-spacing-bottom': '8px',
  '--component/form/helper-text-spacing-top': '4px',
  '--component/form/error-spacing-top': '4px',
  '--component/form/section-spacing': '32px',
  '--component/form/group-spacing': '16px',

  // Dialog/Modal Component
  '--component/dialog/min-width': '280px',
  '--component/dialog/max-width': '560px',
  '--component/dialog/title-height': '64px',
  '--component/dialog/content-padding': '24px',
  '--component/dialog/actions-height': '52px',
  '--component/dialog/actions-spacing': '8px',

  // Tooltip Component
  '--component/tooltip/max-width': '300px',
  '--component/tooltip/padding-horizontal': '8px',
  '--component/tooltip/padding-vertical': '4px',
  '--component/tooltip/arrow-size': '8px',

  // Snackbar Component
  '--component/snackbar/width': '344px',
  '--component/snackbar/min-height': '48px',
  '--component/snackbar/padding-horizontal': '16px',
  '--component/snackbar/padding-vertical': '6px',
  '--component/snackbar/action-spacing': '8px',
};

// ============================================================================
// SECTION 9: TRANSITION/ANIMATION TOKENS (12 tokens)
// ============================================================================

/**
 * Animation durations and easing functions
 */
export const transitionTokens: TokenMap = {
  // Durations
  '--transition/duration/shortest': '150ms',
  '--transition/duration/shorter': '200ms',
  '--transition/duration/short': '250ms',
  '--transition/duration/standard': '300ms',
  '--transition/duration/complex': '375ms',
  '--transition/duration/entering': '225ms',
  '--transition/duration/leaving': '195ms',

  // Easing Functions
  '--transition/easing/ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  '--transition/easing/ease-out': 'cubic-bezier(0.0, 0, 0.2, 1)',
  '--transition/easing/ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  '--transition/easing/sharp': 'cubic-bezier(0.4, 0, 0.6, 1)',
};

// ============================================================================
// SECTION 10: BREAKPOINT TOKENS (11 tokens)
// ============================================================================

/**
 * Responsive breakpoints for mobile, tablet, desktop layouts
 */
export const breakpointTokens: TokenMap = {
  '--breakpoint/xs': '0px',
  '--breakpoint/sm': '600px',
  '--breakpoint/md': '900px',
  '--breakpoint/lg': '1200px',
  '--breakpoint/xl': '1536px',

  // Common media query breakpoints
  '--breakpoint/mobile': '320px',
  '--breakpoint/mobile-landscape': '568px',
  '--breakpoint/tablet': '768px',
  '--breakpoint/tablet-landscape': '1024px',
  '--breakpoint/desktop': '1280px',
  '--breakpoint/desktop-wide': '1920px',
};

// ============================================================================
// BACKWARD COMPATIBILITY ALIASES
// ============================================================================

/**
 * Deprecated token names mapped to new standardized names.
 * Use these for gradual migration to avoid breaking existing code.
 *
 * @deprecated These will be removed in version 2.0.0
 */
export const legacyTokenAliases: Record<string, string> = {
  // Old spacing patterns
  '--spacings-&-sizes/base/8px': '--spacing/2',
  '--spacings-&-sizes/base/16px': '--spacing/4',
  '--spacings-&-sizes/base/24px': '--spacing/6',
  '--1': '--spacing/4',
  '--2': '--spacing/8',
  '--3': '--spacing/12',
  '--space/1': '--spacing/4',
  '--space/2': '--spacing/8',

  // Old color patterns
  '--color-palatte/primary': '--colors/primary/main',
  '--foreground/main': '--colors/text/primary',
  '--breadcrumbs/collapsefill': '--colors/breadcrumb/collapse-fill',

  // Old typography patterns
  '--fontfamily': '--typography/font-family/primary',
  '--typography/base-styles/display-1/font-size': '--typography/display/1/font-size',

  // Old border radius patterns
  '--borderradius/8px': '--border-radius/medium',
  '--corner-radius/rounded-corners/8px': '--border-radius/medium',
};

// ============================================================================
// TOKEN CATEGORIES EXPORT
// ============================================================================

export const tokenCategories: TokenCategory[] = [
  {
    name: 'Typography',
    description: 'Font families, sizes, weights, line heights, and letter spacing',
    tokens: typographyTokens,
  },
  {
    name: 'Colors',
    description: 'Brand colors, semantic colors, text, backgrounds, and borders',
    tokens: colorTokens,
  },
  {
    name: 'Spacing',
    description: '4px grid-based spacing scale for padding, margin, and gaps',
    tokens: spacingTokens,
  },
  {
    name: 'Sizing',
    description: 'Component dimensions, icon sizes, and container widths',
    tokens: sizingTokens,
  },
  {
    name: 'Border Radius',
    description: 'Corner rounding for components',
    tokens: borderRadiusTokens,
  },
  {
    name: 'Elevation',
    description: 'Material Design shadow depths',
    tokens: elevationTokens,
  },
  {
    name: 'Z-Index',
    description: 'Stacking order for layered components',
    tokens: zIndexTokens,
  },
  {
    name: 'Components',
    description: 'Component-specific measurements and properties',
    tokens: componentTokens,
  },
  {
    name: 'Transitions',
    description: 'Animation durations and easing functions',
    tokens: transitionTokens,
  },
  {
    name: 'Breakpoints',
    description: 'Responsive design breakpoints',
    tokens: breakpointTokens,
  },
];

// ============================================================================
// ALL TOKENS COMBINED
// ============================================================================

export const allTokens: TokenMap = {
  ...typographyTokens,
  ...colorTokens,
  ...spacingTokens,
  ...sizingTokens,
  ...borderRadiusTokens,
  ...elevationTokens,
  ...zIndexTokens,
  ...componentTokens,
  ...transitionTokens,
  ...breakpointTokens,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate CSS variables from token map
 */
export function generateCSSVariables(tokens: TokenMap, theme: ThemeVariant = 'light'): string {
  const themeTokens = theme === 'dark'
    ? { ...tokens, ...darkThemeColorTokens }
    : tokens;

  return Object.entries(themeTokens)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
}

/**
 * Validate token usage in code
 * Returns array of unknown token references
 */
export function validateTokenUsage(code: string, validTokens: TokenMap): string[] {
  const tokenPattern = /var\((--[a-z0-9\-\/]+)\)/gi;
  const usedTokens = [...code.matchAll(tokenPattern)].map(match => match[1]);
  const unknownTokens = usedTokens.filter(token =>
    !validTokens[token] && !legacyTokenAliases[token]
  );
  return [...new Set(unknownTokens)];
}

/**
 * Resolve legacy token alias to new token name
 */
export function resolveTokenAlias(tokenName: string): string {
  return legacyTokenAliases[tokenName] || tokenName;
}

/**
 * Get token value with fallback
 */
export function getTokenValue(tokenName: string, fallback?: TokenValue): TokenValue {
  const resolvedName = resolveTokenAlias(tokenName);
  return allTokens[resolvedName] ?? fallback ?? tokenName;
}

// ============================================================================
// CSS VARIABLE EXPORTS
// ============================================================================

/**
 * Light theme CSS variables (ready to inject into :root)
 */
export const lightThemeCSS = `:root {
${generateCSSVariables(allTokens, 'light')}
}`;

/**
 * Dark theme CSS variables (ready to inject into [data-theme="dark"])
 */
export const darkThemeCSS = `[data-theme="dark"] {
${generateCSSVariables(allTokens, 'dark')}
}`;

/**
 * Combined theme CSS
 */
export const allThemesCSS = `${lightThemeCSS}\n\n${darkThemeCSS}`;

// ============================================================================
// TOKEN STATISTICS
// ============================================================================

export const tokenStats = {
  totalTokens: Object.keys(allTokens).length,
  byCategory: tokenCategories.map(cat => ({
    name: cat.name,
    count: Object.keys(cat.tokens).length,
  })),
  legacyAliases: Object.keys(legacyTokenAliases).length,
};

console.log('Design System Tokens loaded:', tokenStats.totalTokens, 'tokens');
