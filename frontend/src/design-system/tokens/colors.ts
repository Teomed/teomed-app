/**
 * Color tokens extracted from design-system.html
 * Preserves exact color values from the original design
 */

export const colors = {
  brand: {
    50: '#e6f0ff',
    100: '#b4d0f8',
    200: '#7db2f5',
    300: '#4ab5ff',
    400: '#1a8fff',
    500: '#006be5',
    600: '#0b5cff',
    700: '#0045cc',
    800: '#00053d',
    900: '#000228',
  },
  navy: {
    50: '#f0f2f8',
    100: '#d1def2',
    200: '#9fb8e0',
    300: '#6e91ca',
    400: '#3d6ab4',
    500: '#2a4d8a',
    600: '#1c3566',
    700: '#0f1f43',
    800: '#00053d',
    900: '#00021a',
  },
  surface: {
    white: '#ffffff',
    light: '#f5f7ff',
    muted: '#e6f0ff',
    overlay: 'hsla(0,0%,100%,0.5)',
  },
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#006be5',
  },
  ui: {
    tabTriangle: '#5c6685',
    navItems: '#00053d',
    navBackground: 'hsla(0,0%,100%,0.5)',
    footerBg: '#12122a',
  },
  primary: {
    blue: '#0b5cff',
    blueHover: '#0045cc',
    lightBlue: '#b4d0f8',
    paleBlue: '#d1def2',
  },
  dark: {
    navy: '#00053d',
    gray: '#2f2f30',
  },
  neutral: {
    white: '#ffffff',
    offWhite: '#f5f7ff',
    lightGray: '#f0f2f8',
    mediumGray: '#6e91ca',
    darkGray: '#0f1f43',
    border: '#d1def2',
  },
  text: {
    primary: '#00053d',
    secondary: '#2a4d8a',
    muted: '#6e91ca',
    label: '#5c6685',
    white: '#ffffff',
  },
  background: {
    white: '#ffffff',
    light: '#f5f7ff',
    muted: '#e6f0ff',
    overlay: 'hsla(0,0%,100%,0.5)',
    dark: '#000228',
  },
} as const;

export type ColorToken = typeof colors;
