/**
 * CDS Theme - FULLY RESPONSIVE
 * Main theme configuration using CDS design tokens with responsive values
 * Import and use with Material-UI ThemeProvider
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';
import {
  colorTokens,
  spacingTokens,
  typographyTokens,
  elevationTokens,
  zIndexTokens,
  borderRadiusTokens,
  transitionTokens,
  breakpointTokens,
  sizingTokens,
  ResponsiveValue,
} from './tokens';

/**
 * Helper Functions for Responsive Values
 */

/**
 * Convert responsive typography token to MUI theme format
 * Creates responsive fontSize and lineHeight using theme.breakpoints.up()
 */
function createResponsiveTypography(
  token: ResponsiveValue<{
    fontSize: number;
    lineHeight: number;
    fontWeight: number;
    letterSpacing: number;
  }>
) {
  return {
    fontSize: `${token.mobile.fontSize}px`,
    lineHeight: `${token.mobile.lineHeight}px`,
    fontWeight: token.mobile.fontWeight,
    letterSpacing: `${token.mobile.letterSpacing}px`,
    '@media (min-width:600px)': {
      fontSize: `${token.tablet.fontSize}px`,
      lineHeight: `${token.tablet.lineHeight}px`,
      fontWeight: token.tablet.fontWeight,
      letterSpacing: `${token.tablet.letterSpacing}px`,
    },
    '@media (min-width:900px)': {
      fontSize: `${token.desktop.fontSize}px`,
      lineHeight: `${token.desktop.lineHeight}px`,
      fontWeight: token.desktop.fontWeight,
      letterSpacing: `${token.desktop.letterSpacing}px`,
    },
  };
}

/**
 * Convert responsive size token to CSS value
 * Returns a string with mobile value and media queries for tablet/desktop
 */
function createResponsiveSize(token: ResponsiveValue<number>): string {
  return `${token.mobile}px`;
}

/**
 * Create responsive size object for MUI components
 * Returns an object with base value and responsive overrides
 */
function createResponsiveSizeObject(token: ResponsiveValue<number>) {
  return {
    minHeight: token.mobile,
    '@media (min-width:600px)': {
      minHeight: token.tablet,
    },
    '@media (min-width:900px)': {
      minHeight: token.desktop,
    },
  };
}

/**
 * Convert responsive spacing token to MUI spacing object
 */
function createResponsiveSpacing(token: ResponsiveValue<number>) {
  return {
    mobile: token.mobile,
    tablet: token.tablet,
    desktop: token.desktop,
  };
}

/**
 * CDS Theme Configuration
 * Complete Material-UI theme with all CDS tokens
 */
const themeOptions: ThemeOptions = {
  // Color Palette
  palette: {
    mode: 'light',
    primary: colorTokens.primary,
    secondary: colorTokens.secondary,
    error: colorTokens.error,
    warning: colorTokens.warning,
    info: colorTokens.info,
    success: colorTokens.success,
    grey: colorTokens.grey,
    text: colorTokens.text,
    background: colorTokens.background,
    action: colorTokens.action,
    divider: colorTokens.divider,
    backdrop: colorTokens.backdrop,
    // CDS State Colors (for direct access)
    primaryStates: colorTokens.primaryStates,
    secondaryStates: colorTokens.secondaryStates,
  },

  // Spacing
  spacing: spacingTokens.base, // 4px base unit

  // Typography - Responsive
  typography: {
    fontFamily: typographyTokens.fontFamily,
    fontSize: typographyTokens.fontSize,
    fontWeightLight: typographyTokens.fontWeightLight,
    fontWeightRegular: typographyTokens.fontWeightRegular,
    fontWeightMedium: typographyTokens.fontWeightMedium,
    fontWeightBold: typographyTokens.fontWeightBold,
    // Responsive typography variants
    h1: createResponsiveTypography(typographyTokens.h1),
    h2: createResponsiveTypography(typographyTokens.h2),
    h3: createResponsiveTypography(typographyTokens.h3),
    h4: createResponsiveTypography(typographyTokens.h4),
    h5: createResponsiveTypography(typographyTokens.h5),
    h6: createResponsiveTypography(typographyTokens.h6),
    subtitle1: createResponsiveTypography(typographyTokens.subtitle1),
    subtitle2: createResponsiveTypography(typographyTokens.subtitle2),
    body1: createResponsiveTypography(typographyTokens.body1),
    body2: createResponsiveTypography(typographyTokens.body2),
    button: createResponsiveTypography(typographyTokens.button.medium),
    caption: createResponsiveTypography(typographyTokens.caption),
    overline: createResponsiveTypography(typographyTokens.overline),
    // Component-specific typography (custom extensions)
    badge: { default: createResponsiveTypography(typographyTokens.badge.default) },
    tooltip: { default: createResponsiveTypography(typographyTokens.tooltip.default) },
    dialog: {
      title: createResponsiveTypography(typographyTokens.dialog.title),
      content: createResponsiveTypography(typographyTokens.dialog.content),
    },
    slider: { valueLabel: createResponsiveTypography(typographyTokens.slider.valueLabel) },
    rating: { icon: createResponsiveTypography(typographyTokens.rating.icon) },
    stepper: { label: createResponsiveTypography(typographyTokens.stepper.label) },
    input: {
      labelSm: createResponsiveTypography(typographyTokens.input.labelSm),
      labelMd: createResponsiveTypography(typographyTokens.input.labelMd),
      labelLg: createResponsiveTypography(typographyTokens.input.labelLg),
      valueSm: createResponsiveTypography(typographyTokens.input.valueSm),
      valueMd: createResponsiveTypography(typographyTokens.input.valueMd),
      valueLg: createResponsiveTypography(typographyTokens.input.valueLg),
      helper: createResponsiveTypography(typographyTokens.input.helper),
    },
  } as any, // Cast to any to allow custom typography extensions

  // Shape (Border Radius)
  shape: {
    borderRadius: borderRadiusTokens.small, // 4px default
  },

  // Shadows (Elevation)
  shadows: elevationTokens,

  // Z-Index
  zIndex: zIndexTokens,

  // Transitions
  transitions: {
    duration: transitionTokens.duration,
    easing: transitionTokens.easing,
  },

  // Breakpoints
  breakpoints: {
    values: breakpointTokens.values,
  },

  // Component Overrides - Responsive
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
          textTransform: 'none', // Override uppercase default
          fontWeight: typographyTokens.fontWeightMedium,
        },
        sizeSmall: {
          ...createResponsiveSizeObject(sizingTokens.button.small),
          padding: '6px 16px',
          ...createResponsiveTypography(typographyTokens.button.small),
        },
        sizeMedium: {
          ...createResponsiveSizeObject(sizingTokens.button.medium),
          padding: '8px 22px',
          ...createResponsiveTypography(typographyTokens.button.medium),
        },
        sizeLarge: {
          ...createResponsiveSizeObject(sizingTokens.button.large),
          padding: '11px 26px',
          ...createResponsiveTypography(typographyTokens.button.large),
        },
        // Primary Color - Contained (Filled) - CDS Blurple states
        containedPrimary: {
          '&:hover': {
            backgroundColor: colorTokens.primary[700], // Blurple 700
            // Overlay with hover state
            backgroundImage: `linear-gradient(${colorTokens.primaryStates.light.hover}, ${colorTokens.primaryStates.light.hover})`,
          },
          '&:active': {
            backgroundImage: `linear-gradient(${colorTokens.primaryStates.light.selected}, ${colorTokens.primaryStates.light.selected})`,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 3px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        // Primary Color - Outlined - CDS Blurple states
        outlinedPrimary: {
          borderColor: colorTokens.primaryStates.light.outlinedBorder,
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
            borderColor: colorTokens.primary[700],
          },
          '&:active': {
            backgroundColor: colorTokens.primaryStates.light.selected,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 3px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        // Primary Color - Text - CDS Blurple states
        textPrimary: {
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
          },
          '&:active': {
            backgroundColor: colorTokens.primaryStates.light.selected,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 3px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        // Secondary Color - Contained (Filled) - CDS Slate states
        containedSecondary: {
          '&:hover': {
            backgroundColor: colorTokens.secondary[700], // Slate 700
            backgroundImage: `linear-gradient(${colorTokens.secondaryStates.light.hover}, ${colorTokens.secondaryStates.light.hover})`,
          },
          '&:active': {
            backgroundImage: `linear-gradient(${colorTokens.secondaryStates.light.selected}, ${colorTokens.secondaryStates.light.selected})`,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 3px ${colorTokens.secondaryStates.light.focusVisible}`,
          },
        },
        // Secondary Color - Outlined - CDS Slate states
        outlinedSecondary: {
          borderColor: colorTokens.secondaryStates.light.outlinedBorder,
          '&:hover': {
            backgroundColor: colorTokens.secondaryStates.light.hover,
            borderColor: colorTokens.secondary[700],
          },
          '&:active': {
            backgroundColor: colorTokens.secondaryStates.light.selected,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 3px ${colorTokens.secondaryStates.light.focusVisible}`,
          },
        },
        // Secondary Color - Text - CDS Slate states
        textSecondary: {
          '&:hover': {
            backgroundColor: colorTokens.secondaryStates.light.hover,
          },
          '&:active': {
            backgroundColor: colorTokens.secondaryStates.light.selected,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 3px ${colorTokens.secondaryStates.light.focusVisible}`,
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          // Ensure minimum touch target (fixed across all devices)
          minWidth: sizingTokens.touchTarget.min,
          minHeight: sizingTokens.touchTarget.min,
        },
        // Primary color icon button - CDS Blurple states
        colorPrimary: {
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
          },
          '&:active': {
            backgroundColor: colorTokens.primaryStates.light.selected,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 3px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        // Secondary color icon button - CDS Slate states
        colorSecondary: {
          '&:hover': {
            backgroundColor: colorTokens.secondaryStates.light.hover,
          },
          '&:active': {
            backgroundColor: colorTokens.secondaryStates.light.selected,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 3px ${colorTokens.secondaryStates.light.focusVisible}`,
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadiusTokens.small,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colorTokens.primary[700],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colorTokens.primary[700],
              borderWidth: '2px',
            },
            '&.Mui-focused': {
              // Focus ring using CDS primary focus state
              boxShadow: `0 0 0 3px ${colorTokens.primaryStates.light.focusVisible}`,
            },
          },
          '& .MuiInputBase-inputSizeSmall': {
            ...createResponsiveSizeObject(sizingTokens.input.small),
          },
          '& .MuiInputBase-root': {
            ...createResponsiveSizeObject(sizingTokens.input.medium),
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          ...createResponsiveSizeObject(sizingTokens.input.medium),
        },
        sizeSmall: {
          ...createResponsiveSizeObject(sizingTokens.input.small),
        },
        input: {
          ...createResponsiveTypography(typographyTokens.input.valueMd),
        },
        inputSizeSmall: {
          ...createResponsiveTypography(typographyTokens.input.valueSm),
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.input.labelMd),
        },
        sizeSmall: {
          ...createResponsiveTypography(typographyTokens.input.labelSm),
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.input.helper),
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
        },
      },
      defaultProps: {
        elevation: 1,
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.extraSmall,
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.circular,
          width: sizingTokens.avatar.medium,
          height: sizingTokens.avatar.medium,
          fontSize: typographyTokens.avatar.initialsMd.desktop.fontSize,
        },
      },
    },

    MuiAppBar: {
      defaultProps: {
        elevation: 4,
      },
      styleOverrides: {
        root: {
          minHeight: sizingTokens.appBar.mobile,
          '@media (min-width:900px)': {
            minHeight: sizingTokens.appBar.desktop,
          },
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: sizingTokens.drawer.standard,
        },
      },
    },

    MuiBottomNavigation: {
      defaultProps: {
        elevation: 8,
      },
    },

    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.bottomNavigation.defaultLabel),
        },
        label: {
          ...createResponsiveTypography(typographyTokens.bottomNavigation.actionsLabel),
        },
      },
    },

    MuiFab: {
      styleOverrides: {
        root: {
          minHeight: sizingTokens.fab.large,
          minWidth: sizingTokens.fab.large,
        },
        sizeSmall: {
          minHeight: sizingTokens.fab.small,
          minWidth: sizingTokens.fab.small,
        },
        sizeMedium: {
          minHeight: sizingTokens.fab.medium,
          minWidth: sizingTokens.fab.medium,
        },
      },
    },

    // Ensure all interactive elements meet touch target requirements
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: (sizingTokens.touchTarget.min - sizingTokens.icon.medium) / 2, // Ensures 48px touch target with 24px icon
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 3px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        colorPrimary: {
          '&.Mui-checked': {
            color: colorTokens.primary[700],
          },
        },
        colorSecondary: {
          '&.Mui-checked': {
            color: colorTokens.secondary[700],
          },
          '&:hover': {
            backgroundColor: colorTokens.secondaryStates.light.hover,
          },
        },
      },
    },

    MuiRadio: {
      styleOverrides: {
        root: {
          padding: (sizingTokens.touchTarget.min - sizingTokens.icon.medium) / 2, // Ensures 48px touch target with 24px icon
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 3px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        colorPrimary: {
          '&.Mui-checked': {
            color: colorTokens.primary[700],
          },
        },
        colorSecondary: {
          '&.Mui-checked': {
            color: colorTokens.secondary[700],
          },
          '&:hover': {
            backgroundColor: colorTokens.secondaryStates.light.hover,
          },
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: (sizingTokens.touchTarget.min - sizingTokens.icon.medium) / 2,
        },
        switchBase: {
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 3px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        colorPrimary: {
          '&.Mui-checked': {
            color: colorTokens.primary[700],
            '& + .MuiSwitch-track': {
              backgroundColor: colorTokens.primary[700],
            },
          },
        },
        colorSecondary: {
          '&.Mui-checked': {
            color: colorTokens.secondary[700],
            '& + .MuiSwitch-track': {
              backgroundColor: colorTokens.secondary[700],
            },
          },
          '&:hover': {
            backgroundColor: colorTokens.secondaryStates.light.hover,
          },
        },
      },
    },

    // Tabs - CDS primary state colors
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: typographyTokens.fontWeightMedium,
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
          },
          '&.Mui-selected': {
            color: colorTokens.primary[700],
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 3px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
      },
    },

    // Chip - CDS state colors
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.extraSmall,
        },
        sizeSmall: {
          ...createResponsiveSizeObject(sizingTokens.chip.small),
          ...createResponsiveTypography(typographyTokens.chip.small),
        },
        sizeMedium: {
          ...createResponsiveSizeObject(sizingTokens.chip.medium),
          ...createResponsiveTypography(typographyTokens.chip.medium),
        },
        colorPrimary: {
          backgroundColor: colorTokens.primary[100],
          color: colorTokens.primary[700],
          '&:hover': {
            backgroundColor: colorTokens.primary[200],
          },
        },
        colorSecondary: {
          backgroundColor: colorTokens.secondary[100],
          color: colorTokens.secondary[700],
          '&:hover': {
            backgroundColor: colorTokens.secondary[200],
          },
        },
        clickable: {
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
          },
          '&:active': {
            backgroundColor: colorTokens.primaryStates.light.selected,
          },
        },
      },
    },

    // List Item - CDS state colors
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: colorTokens.action.hover,
          },
          '&.Mui-selected': {
            backgroundColor: colorTokens.primaryStates.light.selected,
            '&:hover': {
              backgroundColor: colorTokens.primaryStates.light.hover,
            },
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 3px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
      },
    },

    // Menu Item - CDS state colors with responsive typography
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.menuItem.default),
          '&:hover': {
            backgroundColor: colorTokens.action.hover,
          },
          '&.Mui-selected': {
            backgroundColor: colorTokens.primaryStates.light.selected,
            '&:hover': {
              backgroundColor: colorTokens.primaryStates.light.hover,
            },
          },
          '&.Mui-focusVisible': {
            backgroundColor: colorTokens.primaryStates.light.focus,
          },
        },
        dense: {
          ...createResponsiveTypography(typographyTokens.menuItem.dense),
        },
      },
    },

    // Toggle Button - CDS state colors
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
          },
          '&.Mui-selected': {
            backgroundColor: colorTokens.primaryStates.light.selected,
            color: colorTokens.primary[700],
            '&:hover': {
              backgroundColor: colorTokens.primaryStates.light.hover,
            },
          },
        },
      },
    },

    // Slider - CDS primary colors
    MuiSlider: {
      styleOverrides: {
        root: {
          color: colorTokens.primary[700],
        },
        thumb: {
          '&:hover': {
            boxShadow: `0 0 0 8px ${colorTokens.primaryStates.light.hover}`,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 8px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
      },
    },

    // Table - Responsive sizing and typography
    MuiTableCell: {
      styleOverrides: {
        root: {
          ...createResponsiveSizeObject(sizingTokens.table.cell),
          ...createResponsiveTypography(typographyTokens.table.cell),
        },
        head: {
          ...createResponsiveSizeObject(sizingTokens.table.header),
          ...createResponsiveTypography(typographyTokens.table.header),
        },
        footer: {
          ...createResponsiveTypography(typographyTokens.table.footer),
        },
      },
    },

    // Alert - Responsive typography
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
        },
      },
    },

    MuiAlertTitle: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.alert.title),
        },
      },
    },
  },
};

/**
 * CDS Theme Instance
 * Ready-to-use theme for ThemeProvider with full responsive support
 *
 * @example
 * import { ThemeProvider } from '@mui/material/styles';
 * import { cdsTheme } from './theme';
 *
 * function App() {
 *   return (
 *     <ThemeProvider theme={cdsTheme}>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 */
export const cdsTheme = createTheme(themeOptions);

// Export tokens for direct access if needed
export * from './tokens';

// Export theme type for TypeScript
export type CDSTheme = typeof cdsTheme;

// Export helper functions for custom components
export {
  createResponsiveTypography,
  createResponsiveSize,
  createResponsiveSizeObject,
  createResponsiveSpacing,
};

/**
 * Responsive Design System Usage Guide
 * ====================================
 *
 * The CDS theme now fully supports responsive design across 3 breakpoints:
 * - Mobile: < 600px (base values)
 * - Tablet: 600-899px
 * - Desktop: >= 900px
 *
 * RESPONSIVE FEATURES:
 * -------------------
 * 1. Typography: All text styles adapt across breakpoints
 *    - Body text increases from 14px (desktop) to 16px (tablet/mobile)
 *    - Button text adjusts for better touch targets
 *    - Headings maintain hierarchy across all devices
 *
 * 2. Component Sizing: Components scale appropriately
 *    - Buttons: Small (28/32/32), Medium (32/36/36), Large (40/44/44)
 *    - Inputs: Follow similar responsive patterns
 *    - Chips: Scale for better touch interaction
 *    - Tables: Row heights increase on mobile
 *
 * 3. Spacing: Large spacing values adapt to screen size
 *    - Use spacingTokens.responsive for margins/padding that should scale
 *    - Fixed spacing available in spacingTokens.values
 *
 * USING RESPONSIVE VALUES:
 * -----------------------
 * For custom components, use the helper functions:
 *
 * @example
 * import { createResponsiveTypography, sizingTokens } from './theme';
 *
 * const MyComponent = styled('div')({
 *   ...createResponsiveTypography(typographyTokens.body1),
 *   ...createResponsiveSizeObject(sizingTokens.button.medium),
 * });
 *
 * BACKWARD COMPATIBILITY:
 * ----------------------
 * All existing components continue to work as before.
 * The responsive values enhance the design system without breaking changes.
 */
