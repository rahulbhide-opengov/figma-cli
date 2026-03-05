/**
 * CDS Design System Token Specification — COMPLETE
 *
 * Source of truth: https://github.com/rahulbhide-opengov/CDS-Design-System
 * Extracted from: src/theme/tokens.ts (CDS v3.0.0)
 *
 * Every token here exactly mirrors the CDS Design System.
 * Naming Convention: --{category}/{subcategory}/{property}
 * Desktop values used as defaults (Figma canvases are typically desktop-first).
 *
 * @version 3.1.0
 * @date 2026-02-26
 */

export type TokenValue = string | number;
export type TokenMap = Record<string, TokenValue>;
export type ThemeVariant = 'light' | 'dark';

export interface TokenCategory {
  name: string;
  description: string;
  tokens: TokenMap;
}

// ============================================================================
// SECTION 1: TYPOGRAPHY TOKENS — DM Sans, CDS Brand
// ============================================================================

export const typographyTokens: TokenMap = {
  // Font Families
  '--typography/font-family/primary': '"DM Sans", "DM_Sans:Regular", "DM_Sans:Medium", sans-serif',
  '--typography/font-family/monospace': '"Roboto Mono", "Courier New", monospace',

  // Font Weights
  '--typography/font-weight/light': '300',
  '--typography/font-weight/regular': '400',
  '--typography/font-weight/medium': '500',
  '--typography/font-weight/semibold': '600',
  '--typography/font-weight/bold': '700',

  // Base Font Size
  '--typography/font-size/base': '14px',

  // ── Display Styles (Desktop) ──
  '--typography/display/1/font-size': '60px',
  '--typography/display/1/font-weight': '600',
  '--typography/display/1/line-height': '72px',
  '--typography/display/1/letter-spacing': '-0.4px',

  '--typography/display/2/font-size': '56px',
  '--typography/display/2/font-weight': '600',
  '--typography/display/2/line-height': '68px',
  '--typography/display/2/letter-spacing': '-0.4px',

  '--typography/display/3/font-size': '48px',
  '--typography/display/3/font-weight': '600',
  '--typography/display/3/line-height': '56px',
  '--typography/display/3/letter-spacing': '-0.4px',

  '--typography/display/4/font-size': '40px',
  '--typography/display/4/font-weight': '600',
  '--typography/display/4/line-height': '48px',
  '--typography/display/4/letter-spacing': '-0.4px',

  '--typography/display/5/font-size': '32px',
  '--typography/display/5/font-weight': '600',
  '--typography/display/5/line-height': '40px',
  '--typography/display/5/letter-spacing': '-0.4px',

  // ── Headings H1–H6 (Desktop, weight 600) ──
  '--typography/heading/h1/font-size': '48px',
  '--typography/heading/h1/font-weight': '600',
  '--typography/heading/h1/line-height': '56px',
  '--typography/heading/h1/letter-spacing': '-0.5px',

  '--typography/heading/h2/font-size': '32px',
  '--typography/heading/h2/font-weight': '600',
  '--typography/heading/h2/line-height': '40px',
  '--typography/heading/h2/letter-spacing': '-0.3px',

  '--typography/heading/h3/font-size': '24px',
  '--typography/heading/h3/font-weight': '600',
  '--typography/heading/h3/line-height': '32px',
  '--typography/heading/h3/letter-spacing': '-0.2px',

  '--typography/heading/h4/font-size': '20px',
  '--typography/heading/h4/font-weight': '600',
  '--typography/heading/h4/line-height': '28px',
  '--typography/heading/h4/letter-spacing': '-0.2px',

  '--typography/heading/h5/font-size': '16px',
  '--typography/heading/h5/font-weight': '600',
  '--typography/heading/h5/line-height': '24px',
  '--typography/heading/h5/letter-spacing': '0px',

  '--typography/heading/h6/font-size': '14px',
  '--typography/heading/h6/font-weight': '600',
  '--typography/heading/h6/line-height': '20px',
  '--typography/heading/h6/letter-spacing': '0px',

  // ── Body Text (Desktop) — body1 through body4 ──
  '--typography/body/large/font-size': '14px',
  '--typography/body/large/font-weight': '400',
  '--typography/body/large/line-height': '20px',
  '--typography/body/large/letter-spacing': '0.15px',

  '--typography/body/medium/font-size': '12px',
  '--typography/body/medium/font-weight': '400',
  '--typography/body/medium/line-height': '18px',
  '--typography/body/medium/letter-spacing': '0.17px',

  '--typography/body/small/font-size': '12px',
  '--typography/body/small/font-weight': '400',
  '--typography/body/small/line-height': '16px',
  '--typography/body/small/letter-spacing': '0.17px',

  '--typography/body/extra-small/font-size': '12px',
  '--typography/body/extra-small/font-weight': '400',
  '--typography/body/extra-small/line-height': '16px',
  '--typography/body/extra-small/letter-spacing': '0.17px',

  // ── Subtitles ──
  '--typography/subtitle/1/font-size': '16px',
  '--typography/subtitle/1/font-weight': '400',
  '--typography/subtitle/1/line-height': '24px',
  '--typography/subtitle/1/letter-spacing': '0.15px',

  '--typography/subtitle/2/font-size': '14px',
  '--typography/subtitle/2/font-weight': '500',
  '--typography/subtitle/2/line-height': '20px',
  '--typography/subtitle/2/letter-spacing': '0.1px',

  // ── Input Labels (Desktop) ──
  '--typography/input/label/small/font-size': '14px',
  '--typography/input/label/small/font-weight': '400',
  '--typography/input/label/small/line-height': '20px',
  '--typography/input/label/small/letter-spacing': '0.15px',

  '--typography/input/label/medium/font-size': '16px',
  '--typography/input/label/medium/font-weight': '400',
  '--typography/input/label/medium/line-height': '24px',
  '--typography/input/label/medium/letter-spacing': '0.15px',

  '--typography/input/label/large/font-size': '20px',
  '--typography/input/label/large/font-weight': '400',
  '--typography/input/label/large/line-height': '28px',
  '--typography/input/label/large/letter-spacing': '0.15px',

  // Input Values
  '--typography/input/value/small/font-size': '16px',
  '--typography/input/value/small/font-weight': '500',
  '--typography/input/value/small/line-height': '24px',
  '--typography/input/value/small/letter-spacing': '0.25px',

  '--typography/input/value/medium/font-size': '16px',
  '--typography/input/value/medium/font-weight': '500',
  '--typography/input/value/medium/line-height': '24px',
  '--typography/input/value/medium/letter-spacing': '0.25px',

  '--typography/input/value/large/font-size': '20px',
  '--typography/input/value/large/font-weight': '500',
  '--typography/input/value/large/line-height': '28px',
  '--typography/input/value/large/letter-spacing': '0.25px',

  // Helper & Description
  '--typography/input/helper/font-size': '14px',
  '--typography/input/helper/font-weight': '400',
  '--typography/input/helper/line-height': '20px',
  '--typography/input/helper/letter-spacing': '0.15px',

  '--typography/input/description/font-size': '16px',
  '--typography/input/description/font-weight': '400',
  '--typography/input/description/line-height': '24px',
  '--typography/input/description/letter-spacing': '0.15px',

  // Helper Text & Captions
  '--typography/helper-text/font-size': '14px',
  '--typography/helper-text/font-weight': '400',
  '--typography/helper-text/line-height': '20px',
  '--typography/helper-text/letter-spacing': '0.15px',

  '--typography/caption/font-size': '12px',
  '--typography/caption/font-weight': '500',
  '--typography/caption/line-height': '16px',
  '--typography/caption/letter-spacing': '0.4px',

  '--typography/overline/font-size': '12px',
  '--typography/overline/font-weight': '400',
  '--typography/overline/line-height': '32px',
  '--typography/overline/letter-spacing': '1px',
  '--typography/overline/text-transform': 'uppercase',

  // ── Button Typography (Desktop, weight 500) ──
  '--typography/button/large/font-size': '16px',
  '--typography/button/large/font-weight': '500',
  '--typography/button/large/line-height': '24px',
  '--typography/button/large/letter-spacing': '0px',

  '--typography/button/medium/font-size': '14px',
  '--typography/button/medium/font-weight': '500',
  '--typography/button/medium/line-height': '20px',
  '--typography/button/medium/letter-spacing': '0px',

  '--typography/button/small/font-size': '12px',
  '--typography/button/small/font-weight': '500',
  '--typography/button/small/line-height': '16px',
  '--typography/button/small/letter-spacing': '0px',

  // ── Chip Typography (Desktop) ──
  '--typography/chip/large/font-size': '16px',
  '--typography/chip/large/font-weight': '500',
  '--typography/chip/large/line-height': '20px',
  '--typography/chip/large/letter-spacing': '0.16px',

  '--typography/chip/medium/font-size': '14px',
  '--typography/chip/medium/font-weight': '500',
  '--typography/chip/medium/line-height': '18px',
  '--typography/chip/medium/letter-spacing': '0.16px',

  '--typography/chip/small/font-size': '12px',
  '--typography/chip/small/font-weight': '500',
  '--typography/chip/small/line-height': '16px',
  '--typography/chip/small/letter-spacing': '0.16px',

  // ── Avatar Typography ──
  '--typography/avatar/large/font-size': '20px',
  '--typography/avatar/large/font-weight': '400',
  '--typography/avatar/large/line-height': '28px',
  '--typography/avatar/large/letter-spacing': '0.16px',

  '--typography/avatar/medium/font-size': '14px',
  '--typography/avatar/medium/font-weight': '400',
  '--typography/avatar/medium/line-height': '20px',
  '--typography/avatar/medium/letter-spacing': '0.16px',

  '--typography/avatar/small/font-size': '14px',
  '--typography/avatar/small/font-weight': '400',
  '--typography/avatar/small/line-height': '20px',
  '--typography/avatar/small/letter-spacing': '0.16px',

  // ── Table Typography ──
  '--typography/table/header/font-size': '14px',
  '--typography/table/header/font-weight': '600',
  '--typography/table/header/line-height': '20px',
  '--typography/table/header/letter-spacing': '0.16px',

  '--typography/table/cell/font-size': '14px',
  '--typography/table/cell/font-weight': '400',
  '--typography/table/cell/line-height': '20px',
  '--typography/table/cell/letter-spacing': '0.16px',

  '--typography/table/footer/font-size': '14px',
  '--typography/table/footer/font-weight': '400',
  '--typography/table/footer/line-height': '20px',
  '--typography/table/footer/letter-spacing': '0.16px',

  // ── Alert Typography ──
  '--typography/alert/title/font-size': '18px',
  '--typography/alert/title/font-weight': '600',
  '--typography/alert/title/line-height': '24px',
  '--typography/alert/title/letter-spacing': '0.15px',

  '--typography/alert/description/font-size': '14px',
  '--typography/alert/description/font-weight': '400',
  '--typography/alert/description/line-height': '20px',
  '--typography/alert/description/letter-spacing': '0.15px',

  // ── Dialog Typography ──
  '--typography/dialog/title/font-size': '20px',
  '--typography/dialog/title/font-weight': '600',
  '--typography/dialog/title/line-height': '28px',
  '--typography/dialog/title/letter-spacing': '0.15px',

  '--typography/dialog/content/font-size': '14px',
  '--typography/dialog/content/font-weight': '400',
  '--typography/dialog/content/line-height': '20px',
  '--typography/dialog/content/letter-spacing': '0.15px',

  // ── Badge, Tooltip, Stepper, Slider Typography ──
  '--typography/badge/font-size': '12px',
  '--typography/badge/font-weight': '500',
  '--typography/badge/line-height': '16px',
  '--typography/badge/letter-spacing': '0.14px',

  '--typography/tooltip/font-size': '12px',
  '--typography/tooltip/font-weight': '500',
  '--typography/tooltip/line-height': '16px',
  '--typography/tooltip/letter-spacing': '0.14px',

  '--typography/stepper/label/font-size': '14px',
  '--typography/stepper/label/font-weight': '400',
  '--typography/stepper/label/line-height': '20px',
  '--typography/stepper/label/letter-spacing': '0.15px',

  '--typography/slider/value-label/font-size': '12px',
  '--typography/slider/value-label/font-weight': '500',
  '--typography/slider/value-label/line-height': '16px',
  '--typography/slider/value-label/letter-spacing': '0.14px',

  // ── Rating Typography ──
  '--typography/rating/icon/font-size': '24px',
  '--typography/rating/icon/font-weight': '400',
  '--typography/rating/icon/line-height': '24px',

  // ── Menu Item Typography (Desktop) ──
  '--typography/menu-item/default/font-size': '24px',
  '--typography/menu-item/default/font-weight': '400',
  '--typography/menu-item/default/line-height': '32px',
  '--typography/menu-item/default/letter-spacing': '0.15px',

  '--typography/menu-item/dense/font-size': '20px',
  '--typography/menu-item/dense/font-weight': '400',
  '--typography/menu-item/dense/line-height': '28px',
  '--typography/menu-item/dense/letter-spacing': '0.15px',

  // ── Bottom Navigation Typography ──
  '--typography/bottom-nav/actions/font-size': '12px',
  '--typography/bottom-nav/actions/font-weight': '500',
  '--typography/bottom-nav/actions/line-height': '16px',
  '--typography/bottom-nav/actions/letter-spacing': '0.15px',

  '--typography/bottom-nav/default/font-size': '14px',
  '--typography/bottom-nav/default/font-weight': '500',
  '--typography/bottom-nav/default/line-height': '20px',
  '--typography/bottom-nav/default/letter-spacing': '0.15px',
};

// ============================================================================
// SECTION 2: COLOR TOKENS — CDS Brand Colors (COMPLETE)
// ============================================================================

export const colorTokens: TokenMap = {
  // ── Primary Colors — Blurple Scale ──
  '--colors/primary/50': '#f5f3ff',
  '--colors/primary/100': '#eef1fc',
  '--colors/primary/200': '#d6d4ff',
  '--colors/primary/400': '#a098ff',
  '--colors/primary/700': '#4b3fff',
  '--colors/primary/900': '#19009b',
  '--colors/primary/main': '#4b3fff',
  '--colors/primary/light': '#eef1fc',
  '--colors/primary/dark': '#19009b',
  '--colors/primary/contrast-text': '#ffffff',

  // ── Secondary Colors — Slate Scale ──
  '--colors/secondary/50': '#f8f9fa',
  '--colors/secondary/100': '#e9ecef',
  '--colors/secondary/200': '#cbd2d9',
  '--colors/secondary/400': '#8e9ba8',
  '--colors/secondary/700': '#546574',
  '--colors/secondary/900': '#2d3748',
  '--colors/secondary/main': '#546574',
  '--colors/secondary/light': '#e9ecef',
  '--colors/secondary/dark': '#2d3748',
  '--colors/secondary/contrast-text': '#ffffff',

  // ── Grey Scale (complete) ──
  '--colors/grey/50': '#fafafa',
  '--colors/grey/100': '#f2f2f2',
  '--colors/grey/200': '#eeeeee',
  '--colors/grey/300': '#e0e0e0',
  '--colors/grey/400': '#d5d5d5',
  '--colors/grey/500': '#bdbdbd',
  '--colors/grey/600': '#adafb1',
  '--colors/grey/700': '#616161',
  '--colors/grey/800': '#424242',
  '--colors/grey/900': '#212121',
  '--colors/grey/A100': '#f5f5f5',
  '--colors/grey/A200': '#eeeeee',
  '--colors/grey/A400': '#bdbdbd',
  '--colors/grey/A700': '#616161',

  // ── Error Colors ──
  '--colors/error/main': '#d32f2f',
  '--colors/error/alternate': '#d33423',
  '--colors/error/light': '#ef5350',
  '--colors/error/dark': '#b71c1c',
  '--colors/error/dark-text': '#5f2120',
  '--colors/error/contrast-text': '#ffffff',

  // ── Success Colors ──
  '--colors/success/main': '#2e7d32',
  '--colors/success/light': '#4caf50',
  '--colors/success/dark': '#1b5e20',
  '--colors/success/dark-text': '#1e4620',
  '--colors/success/contrast-text': '#ffffff',

  // ── Warning Colors ──
  '--colors/warning/main': '#ed6c02',
  '--colors/warning/alternate': '#f5a300',
  '--colors/warning/light': '#faaf00',
  '--colors/warning/dark': '#e65100',
  '--colors/warning/dark-text': '#663c00',
  '--colors/warning/contrast-text': '#ffffff',

  // ── Info Colors ──
  '--colors/info/main': '#0288d1',
  '--colors/info/alternate': '#1976d2',
  '--colors/info/light': '#42a5f5',
  '--colors/info/medium': '#1565c0',
  '--colors/info/dark': '#01579b',
  '--colors/info/dark-text': '#014361',
  '--colors/info/contrast-text': '#ffffff',

  // ── Text Colors (Light Theme) ──
  '--colors/text/primary': 'rgba(0, 0, 0, 0.87)',
  '--colors/text/secondary': 'rgba(0, 0, 0, 0.6)',
  '--colors/text/tertiary': 'rgba(0, 0, 0, 0.54)',
  '--colors/text/disabled': 'rgba(0, 0, 0, 0.38)',
  '--colors/text/hint': 'rgba(0, 0, 0, 0.26)',

  // ── Background Colors (Light Theme) ──
  '--colors/background/default': '#fafafa',
  '--colors/background/paper': '#ffffff',
  '--colors/background/tertiary': '#f2f2f2',
  '--colors/background/paper-elevation-1': '#f5f5f5',
  '--colors/background/paper-elevation-2': '#eeeeee',
  '--colors/background/paper-elevation-4': '#e0e0e0',

  // ── Divider & Borders ──
  '--colors/divider': 'rgba(0, 0, 0, 0.12)',
  '--colors/border/default': 'rgba(0, 0, 0, 0.12)',
  '--colors/border/focus': '#4b3fff',
  '--colors/border/error': '#d32f2f',

  // ── Action Colors ──
  '--colors/action/active': 'rgba(0, 0, 0, 0.54)',
  '--colors/action/hover': 'rgba(0, 0, 0, 0.04)',
  '--colors/action/subtle': 'rgba(0, 0, 0, 0.02)',
  '--colors/action/selected': 'rgba(0, 0, 0, 0.08)',
  '--colors/action/disabled': 'rgba(0, 0, 0, 0.26)',
  '--colors/action/disabled-background': 'rgba(0, 0, 0, 0.12)',
  '--colors/action/focus': 'rgba(0, 0, 0, 0.12)',
  '--colors/action/track': 'rgba(0, 0, 0, 0.11)',

  // ── Primary State Colors (Light Theme — Blurple 700 based) ──
  '--colors/primary-states/hover': 'rgba(75, 63, 255, 0.04)',
  '--colors/primary-states/selected': 'rgba(75, 63, 255, 0.08)',
  '--colors/primary-states/focus': 'rgba(75, 63, 255, 0.12)',
  '--colors/primary-states/focus-visible': 'rgba(75, 63, 255, 0.30)',
  '--colors/primary-states/outlined-border': 'rgba(75, 63, 255, 0.50)',

  // ── Secondary State Colors (Light Theme — Slate 700 based) ──
  '--colors/secondary-states/hover': 'rgba(84, 101, 116, 0.04)',
  '--colors/secondary-states/selected': 'rgba(84, 101, 116, 0.08)',
  '--colors/secondary-states/focus': 'rgba(84, 101, 116, 0.12)',
  '--colors/secondary-states/focus-visible': 'rgba(84, 101, 116, 0.30)',
  '--colors/secondary-states/outlined-border': 'rgba(84, 101, 116, 0.50)',

  // ── Backdrop/Overlay Colors ──
  '--colors/backdrop/light': 'rgba(0, 0, 0, 0.3)',
  '--colors/backdrop/standard': 'rgba(0, 0, 0, 0.5)',
  '--colors/backdrop/dark': 'rgba(0, 0, 0, 0.7)',
  '--colors/backdrop/heavy': 'rgba(0, 0, 0, 0.8)',

  // ── White Overlays (for dark backgrounds) ──
  '--colors/white-overlay/hover': 'rgba(255, 255, 255, 0.12)',
  '--colors/white-overlay/selected': 'rgba(255, 255, 255, 0.15)',
  '--colors/white-overlay/active': 'rgba(255, 255, 255, 0.54)',

  // ── Primary Opacity Variants (complete) ──
  '--colors/primary-opacity/4': 'rgba(75, 63, 255, 0.04)',
  '--colors/primary-opacity/8': 'rgba(75, 63, 255, 0.08)',
  '--colors/primary-opacity/12': 'rgba(75, 63, 255, 0.12)',
  '--colors/primary-opacity/20': 'rgba(75, 63, 255, 0.2)',
  '--colors/primary-opacity/30': 'rgba(75, 63, 255, 0.3)',
  '--colors/primary-opacity/38': 'rgba(75, 63, 255, 0.38)',
  '--colors/primary-opacity/50': 'rgba(75, 63, 255, 0.5)',
  '--colors/primary-opacity/70': 'rgba(75, 63, 255, 0.7)',
  '--colors/primary-opacity/100': 'rgba(75, 63, 255, 1)',

  // ── Secondary Opacity Variants ──
  '--colors/secondary-opacity/4': 'rgba(84, 101, 116, 0.04)',
  '--colors/secondary-opacity/8': 'rgba(84, 101, 116, 0.08)',
  '--colors/secondary-opacity/12': 'rgba(84, 101, 116, 0.12)',
  '--colors/secondary-opacity/30': 'rgba(84, 101, 116, 0.3)',
  '--colors/secondary-opacity/50': 'rgba(84, 101, 116, 0.5)',
  '--colors/secondary-opacity/70': 'rgba(84, 101, 116, 0.7)',

  // ── Error Opacity Variants ──
  '--colors/error-opacity/4': 'rgba(211, 47, 47, 0.04)',
  '--colors/error-opacity/8': 'rgba(211, 47, 47, 0.08)',
  '--colors/error-opacity/50': 'rgba(211, 47, 47, 0.5)',
  '--colors/error-opacity/70': 'rgba(211, 47, 47, 0.7)',

  // ── Success Opacity Variants ──
  '--colors/success-opacity/4': 'rgba(46, 125, 50, 0.04)',
  '--colors/success-opacity/8': 'rgba(46, 125, 50, 0.08)',
  '--colors/success-opacity/50': 'rgba(46, 125, 50, 0.5)',
  '--colors/success-opacity/70': 'rgba(46, 125, 50, 0.7)',

  // ── Warning Opacity Variants ──
  '--colors/warning-opacity/4': 'rgba(237, 108, 2, 0.04)',
  '--colors/warning-opacity/8': 'rgba(237, 108, 2, 0.08)',
  '--colors/warning-opacity/50': 'rgba(237, 108, 2, 0.5)',
  '--colors/warning-opacity/70': 'rgba(237, 108, 2, 0.7)',

  // ── Info Opacity Variants ──
  '--colors/info-opacity/4': 'rgba(2, 136, 209, 0.04)',
  '--colors/info-opacity/8': 'rgba(2, 136, 209, 0.08)',
  '--colors/info-opacity/50': 'rgba(2, 136, 209, 0.5)',
  '--colors/info-opacity/70': 'rgba(2, 136, 209, 0.7)',

  // ── Component-Specific Colors ──
  '--colors/breadcrumb/text': 'rgba(0, 0, 0, 0.6)',
  '--colors/breadcrumb/separator': 'rgba(0, 0, 0, 0.38)',
  '--colors/breadcrumb/collapse-fill': '#e0e0e0',

  '--colors/chip/background': '#e0e0e0',
  '--colors/chip/text': 'rgba(0, 0, 0, 0.87)',
  '--colors/chip/border': 'transparent',

  '--colors/timeline/connector': 'rgba(0, 0, 0, 0.12)',
  '--colors/timeline/dot-primary': '#4b3fff',
  '--colors/timeline/dot-secondary': '#546574',
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

  // ── Alert Severity Backgrounds ──
  '--colors/alert/error-bg': '#fdeded',
  '--colors/alert/warning-bg': '#fff4e5',
  '--colors/alert/info-bg': '#e5f6fd',
  '--colors/alert/success-bg': '#edf7ed',

  // ── Read-Only State ──
  '--colors/readonly/background': 'rgba(75, 63, 255, 0.08)',

  // ── Disabled Input States ──
  '--colors/disabled/background': '#f2f2f2',
  '--colors/disabled/border': 'rgba(84, 101, 116, 0.5)',
  '--colors/disabled/text': 'rgba(0, 0, 0, 0.6)',
};

/**
 * Dark theme color overrides (complete with state colors)
 */
export const darkThemeColorTokens: TokenMap = {
  '--colors/text/primary': 'rgba(255, 255, 255, 0.87)',
  '--colors/text/secondary': 'rgba(255, 255, 255, 0.6)',
  '--colors/text/tertiary': 'rgba(255, 255, 255, 0.54)',
  '--colors/text/disabled': 'rgba(255, 255, 255, 0.38)',
  '--colors/text/hint': 'rgba(255, 255, 255, 0.38)',

  '--colors/background/default': '#121212',
  '--colors/background/paper': '#1e1e1e',
  '--colors/background/tertiary': '#2c2c2c',
  '--colors/background/paper-elevation-1': '#2c2c2c',
  '--colors/background/paper-elevation-2': '#333333',
  '--colors/background/paper-elevation-4': '#3d3d3d',

  '--colors/divider': 'rgba(255, 255, 255, 0.12)',
  '--colors/border/default': 'rgba(255, 255, 255, 0.12)',

  '--colors/action/active': 'rgba(255, 255, 255, 0.54)',
  '--colors/action/hover': 'rgba(255, 255, 255, 0.08)',
  '--colors/action/selected': 'rgba(255, 255, 255, 0.16)',
  '--colors/action/disabled': 'rgba(255, 255, 255, 0.3)',
  '--colors/action/disabled-background': 'rgba(255, 255, 255, 0.12)',
  '--colors/action/focus': 'rgba(255, 255, 255, 0.12)',

  // Primary State Colors (Dark Theme — #94A8FF based)
  '--colors/primary-states/hover': 'rgba(148, 168, 255, 0.08)',
  '--colors/primary-states/selected': 'rgba(148, 168, 255, 0.16)',
  '--colors/primary-states/focus': 'rgba(148, 168, 255, 0.12)',
  '--colors/primary-states/focus-visible': 'rgba(148, 168, 255, 0.30)',
  '--colors/primary-states/outlined-border': 'rgba(148, 168, 255, 0.50)',

  // Secondary State Colors (Dark Theme — #9CB1C3 based)
  '--colors/secondary-states/hover': 'rgba(156, 177, 195, 0.08)',
  '--colors/secondary-states/selected': 'rgba(156, 177, 195, 0.16)',
  '--colors/secondary-states/focus': 'rgba(156, 177, 195, 0.12)',
  '--colors/secondary-states/focus-visible': 'rgba(156, 177, 195, 0.30)',
  '--colors/secondary-states/outlined-border': 'rgba(156, 177, 195, 0.50)',
};

// ============================================================================
// SECTION 3: SPACING TOKENS — 4px base unit
// ============================================================================

export const spacingTokens: TokenMap = {
  '--spacing/0': '0px',
  '--spacing/0.5': '2px',
  '--spacing/1': '4px',
  '--spacing/1.5': '6px',
  '--spacing/2': '8px',
  '--spacing/3': '12px',
  '--spacing/4': '16px',
  '--spacing/4.5': '18px',
  '--spacing/5': '20px',
  '--spacing/6': '24px',
  '--spacing/7': '28px',
  '--spacing/7.5': '30px',
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
};

// ============================================================================
// SECTION 4: SIZING TOKENS — CDS responsive desktop values
// ============================================================================

export const sizingTokens: TokenMap = {
  // Touch Target (WCAG AA)
  '--sizing/touch-target/min': '48px',

  // Icon Sizes
  '--sizing/icon/inherit': '16px',
  '--sizing/icon/small': '20px',
  '--sizing/icon/medium': '24px',
  '--sizing/icon/large': '32px',

  // Button Heights (Desktop — CDS spec)
  '--sizing/button/small': '28px',
  '--sizing/button/medium': '32px',
  '--sizing/button/large': '40px',

  // Floating Action Button
  '--sizing/fab/small': '32px',
  '--sizing/fab/medium': '40px',
  '--sizing/fab/large': '50px',

  // Input Heights (Desktop — CDS spec)
  '--sizing/input/small': '28px',
  '--sizing/input/medium': '32px',
  '--sizing/input/large': '40px',

  // Table Sizes (Desktop)
  '--sizing/table/header': '50px',
  '--sizing/table/cell': '50px',
  '--sizing/table/dense-cell': '40px',

  // Chip Sizes (Desktop)
  '--sizing/chip/small': '28px',
  '--sizing/chip/medium': '32px',
  '--sizing/chip/large': '40px',

  // Chip In-Field Sizes (Desktop)
  '--sizing/chip-in-field/small': '24px',
  '--sizing/chip-in-field/medium': '28px',
  '--sizing/chip-in-field/large': '32px',

  // Avatar Sizes (complete: xs through xl)
  '--sizing/avatar/xs': '24px',
  '--sizing/avatar/small': '32px',
  '--sizing/avatar/medium': '40px',
  '--sizing/avatar/large': '56px',
  '--sizing/avatar/xl': '72px',

  // App Bar Height
  '--sizing/app-bar/mobile': '56px',
  '--sizing/app-bar/desktop': '64px',

  // Bottom Navigation
  '--sizing/bottom-nav/height': '56px',
  '--sizing/bottom-nav/min-action-width': '80px',
  '--sizing/bottom-nav/action-min-height': '48px',

  // Drawer Width
  '--sizing/drawer/standard': '240px',
  '--sizing/drawer/wide': '320px',

  // Container Max Widths
  '--sizing/container/xs': '444px',
  '--sizing/container/sm': '600px',
  '--sizing/container/md': '900px',
  '--sizing/container/lg': '1200px',
  '--sizing/container/xl': '1536px',

  // Dialog Sizes
  '--sizing/dialog/xs': '280px',
  '--sizing/dialog/sm': '400px',
  '--sizing/dialog/md': '600px',
  '--sizing/dialog/lg': '800px',
  '--sizing/dialog/xl': '1200px',

  // Pagination
  '--sizing/pagination/small': '26px',
  '--sizing/pagination/medium': '32px',
  '--sizing/pagination/large': '40px',

  // Rating Sizes
  '--sizing/rating/small': '20px',
  '--sizing/rating/medium': '24px',
  '--sizing/rating/large': '32px',

  // Slider
  '--sizing/slider/track-height': '4px',
  '--sizing/slider/thumb': '20px',

  // Badge
  '--sizing/badge/standard': '20px',
  '--sizing/badge/dot': '8px',

  // Tab
  '--sizing/tab/min-height': '48px',
  '--sizing/tab/min-width': '80px',

  // Menu Item
  '--sizing/menu-item/min-height': '48px',

  // List Item
  '--sizing/list-item/min-height': '48px',

  // Speed Dial
  '--sizing/speed-dial/action': '40px',
};

// ============================================================================
// SECTION 5: BORDER RADIUS TOKENS
// ============================================================================

export const borderRadiusTokens: TokenMap = {
  '--border-radius/none': '0px',
  '--border-radius/extra-small': '2px',
  '--border-radius/small': '4px',
  '--border-radius/medium': '8px',
  '--border-radius/large': '12px',
  '--border-radius/circular': '50%',
  '--border-radius/full': '9999px',

  '--border-radius/button': '4px',
  '--border-radius/input': '4px',
  '--border-radius/card': '4px',
  '--border-radius/chip': '2px',
  '--border-radius/dialog': '4px',
  '--border-radius/tooltip': '4px',
  '--border-radius/alert': '4px',
  '--border-radius/paper': '4px',
  '--border-radius/fab': '50%',
  '--border-radius/skeleton-text': '2px',
  '--border-radius/skeleton-rect': '4px',
  '--border-radius/avatar': '50%',
};

// ============================================================================
// SECTION 6: ELEVATION/SHADOW TOKENS — Full 25-level Material system (0–24)
// ============================================================================

export const elevationTokens: TokenMap = {
  '--elevation/0': 'none',
  '--elevation/1': '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  '--elevation/2': '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  '--elevation/3': '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  '--elevation/4': '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
  '--elevation/5': '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
  '--elevation/6': '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
  '--elevation/7': '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
  '--elevation/8': '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
  '--elevation/9': '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
  '--elevation/10': '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
  '--elevation/11': '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
  '--elevation/12': '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
  '--elevation/13': '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
  '--elevation/14': '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
  '--elevation/15': '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
  '--elevation/16': '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
  '--elevation/17': '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
  '--elevation/18': '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
  '--elevation/19': '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
  '--elevation/20': '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
  '--elevation/21': '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
  '--elevation/22': '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
  '--elevation/23': '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
  '--elevation/24': '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
};

// ============================================================================
// SECTION 7: Z-INDEX TOKENS
// ============================================================================

export const zIndexTokens: TokenMap = {
  '--z-index/mobile-stepper': '1000',
  '--z-index/fab': '1050',
  '--z-index/speed-dial': '1050',
  '--z-index/app-bar': '1100',
  '--z-index/drawer': '1200',
  '--z-index/modal': '1300',
  '--z-index/snackbar': '1400',
  '--z-index/tooltip': '1500',
};

// ============================================================================
// SECTION 8: COMPONENT-SPECIFIC TOKENS
// ============================================================================

export const componentTokens: TokenMap = {
  // Timeline
  '--component/timeline/dot-size': '12px',
  '--component/timeline/dot-border-width': '2px',
  '--component/timeline/connector-width': '2px',
  '--component/timeline/spacing-horizontal': '16px',
  '--component/timeline/spacing-vertical': '24px',

  // Stepper
  '--component/stepper/step-size': '40px',
  '--component/stepper/step-icon-size': '24px',
  '--component/stepper/connector-height': '2px',
  '--component/stepper/label-spacing': '8px',

  // Date Picker
  '--component/datepicker/calendar-width': '320px',
  '--component/datepicker/header-height': '56px',
  '--component/datepicker/day-button-size': '40px',

  // Data Table
  '--component/table/header-height': '50px',
  '--component/table/row-height': '50px',
  '--component/table/dense-row-height': '40px',
  '--component/table/cell-padding-horizontal': '16px',

  // Navigation (Sidenav)
  '--component/nav/width-default': '240px',
  '--component/nav/width-slim': '64px',
  '--component/nav/width-wide': '320px',
  '--component/nav/item-height': '48px',
  '--component/nav/item-padding-horizontal': '16px',
  '--component/nav/icon-size': '24px',
  '--component/nav/icon-spacing': '16px',

  // Breadcrumb
  '--component/breadcrumb/item-spacing': '8px',

  // Chip
  '--component/chip/height': '32px',
  '--component/chip/padding-horizontal': '12px',
  '--component/chip/icon-size': '18px',

  // Page Heading
  '--component/heading/page-title-spacing-bottom': '16px',
  '--component/heading/breadcrumb-spacing-bottom': '8px',

  // Form Field
  '--component/form/field-spacing-vertical': '24px',
  '--component/form/field-max-width': '500px',
  '--component/form/label-spacing-bottom': '8px',

  // Dialog/Modal
  '--component/dialog/min-width': '280px',
  '--component/dialog/max-width': '560px',
  '--component/dialog/title-height': '64px',
  '--component/dialog/content-padding': '24px',
  '--component/dialog/actions-height': '52px',
  '--component/dialog/actions-spacing': '8px',

  // Tooltip
  '--component/tooltip/max-width': '300px',
  '--component/tooltip/padding-horizontal': '8px',
  '--component/tooltip/padding-vertical': '4px',

  // Snackbar
  '--component/snackbar/width': '344px',
  '--component/snackbar/min-height': '48px',
  '--component/snackbar/padding-horizontal': '16px',

  // Alert
  '--component/alert/border-radius': '4px',
  '--component/alert/padding-horizontal': '16px',
  '--component/alert/padding-vertical': '12px',

  // Slider
  '--component/slider/track-height': '4px',
  '--component/slider/thumb-size': '20px',

  // App Bar
  '--component/app-bar/height-mobile': '56px',
  '--component/app-bar/height-desktop': '64px',
  '--component/app-bar/elevation': '4',

  // Bottom Navigation
  '--component/bottom-nav/height': '56px',
  '--component/bottom-nav/action-min-width': '80px',
  '--component/bottom-nav/action-min-height': '48px',

  // Menu
  '--component/menu/min-width': '112px',
  '--component/menu/max-width': '280px',
  '--component/menu/item-height': '48px',
  '--component/menu/item-padding-horizontal': '16px',

  // Speed Dial
  '--component/speed-dial/action-size': '40px',

  // File Upload
  '--component/file-upload/border-width': '2px',
  '--component/file-upload/border-style': 'dashed',
  '--component/file-upload/max-file-size': '10485760',
  '--component/file-upload/padding': '32px',

  // Transfer List
  '--component/transfer-list/width': '280px',
  '--component/transfer-list/height': '320px',

  // Logo
  '--component/logo/small-width': '80px',
  '--component/logo/small-height': '23px',
  '--component/logo/medium-width': '120px',
  '--component/logo/medium-height': '34px',
  '--component/logo/large-width': '200px',
  '--component/logo/large-height': '57px',
  '--component/wand/small': '32px',
  '--component/wand/medium': '48px',
  '--component/wand/large': '64px',

  // Pagination
  '--component/pagination/item-size': '32px',
  '--component/pagination/item-gap': '4px',

  // Rating
  '--component/rating/icon-gap': '4px',
};

// ============================================================================
// SECTION 9: TRANSITION/ANIMATION TOKENS
// ============================================================================

export const transitionTokens: TokenMap = {
  '--transition/duration/shortest': '150ms',
  '--transition/duration/shorter': '200ms',
  '--transition/duration/short': '250ms',
  '--transition/duration/standard': '300ms',
  '--transition/duration/complex': '375ms',
  '--transition/duration/entering': '225ms',
  '--transition/duration/leaving': '195ms',

  '--transition/easing/ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  '--transition/easing/ease-out': 'cubic-bezier(0.0, 0, 0.2, 1)',
  '--transition/easing/ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  '--transition/easing/sharp': 'cubic-bezier(0.4, 0, 0.6, 1)',
};

// ============================================================================
// SECTION 10: BREAKPOINT TOKENS
// ============================================================================

export const breakpointTokens: TokenMap = {
  '--breakpoint/xs': '0px',
  '--breakpoint/sm': '600px',
  '--breakpoint/md': '900px',
  '--breakpoint/lg': '1200px',
  '--breakpoint/xl': '1536px',

  '--breakpoint/figma-mobile': '390px',
  '--breakpoint/figma-tablet': '768px',
  '--breakpoint/figma-desktop': '1440px',
};

// ============================================================================
// BACKWARD COMPATIBILITY ALIASES
// ============================================================================

export const legacyTokenAliases: Record<string, string> = {
  '--spacings-&-sizes/base/8px': '--spacing/2',
  '--spacings-&-sizes/base/16px': '--spacing/4',
  '--spacings-&-sizes/base/24px': '--spacing/6',
  '--1': '--spacing/4',
  '--2': '--spacing/8',
  '--3': '--spacing/12',
  '--space/1': '--spacing/4',
  '--space/2': '--spacing/8',
  '--color-palatte/primary': '--colors/primary/main',
  '--foreground/main': '--colors/text/primary',
  '--breadcrumbs/collapsefill': '--colors/breadcrumb/collapse-fill',
  '--fontfamily': '--typography/font-family/primary',
  '--borderradius/8px': '--border-radius/medium',
  '--corner-radius/rounded-corners/8px': '--border-radius/medium',
};

// ============================================================================
// TOKEN CATEGORIES EXPORT
// ============================================================================

export const tokenCategories: TokenCategory[] = [
  { name: 'Typography', description: 'CDS DM Sans typography — display, heading, body, button, chip, avatar, table, alert, dialog, badge, tooltip, stepper, slider, rating, menu, bottom-nav', tokens: typographyTokens },
  { name: 'Colors', description: 'CDS Blurple/Slate brand + semantic + grey + state + opacity + component colors', tokens: colorTokens },
  { name: 'Spacing', description: '4px base unit spacing scale (0–96px)', tokens: spacingTokens },
  { name: 'Sizing', description: 'CDS responsive component dimensions — button, input, chip, avatar, table, fab, dialog, rating, slider, badge, tab, menu, etc.', tokens: sizingTokens },
  { name: 'Border Radius', description: 'CDS corner radius system + component-specific radii', tokens: borderRadiusTokens },
  { name: 'Elevation', description: 'Full 25-level Material elevation (0–24)', tokens: elevationTokens },
  { name: 'Z-Index', description: 'CDS stacking order for overlays', tokens: zIndexTokens },
  { name: 'Components', description: 'CDS component-specific measurements — timeline, stepper, datepicker, table, nav, breadcrumb, chip, form, dialog, tooltip, snackbar, alert, slider, app-bar, bottom-nav, menu, file-upload, transfer-list, logo, pagination, rating', tokens: componentTokens },
  { name: 'Transitions', description: 'CDS animation durations and easings', tokens: transitionTokens },
  { name: 'Breakpoints', description: 'CDS responsive breakpoints + Figma design sizes', tokens: breakpointTokens },
];

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
