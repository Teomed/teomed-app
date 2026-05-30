/**
 * Color tokens extracted from design-system.html
 * Preserves exact color values from the original design
 */

export const colors = {
  // Primary Colors
  primary: {
    blue: '#0b5cff',
    blueHover: '#003fd9',
    lightBlue: '#b4d0f8',
    paleBlue: '#d1def2',
  },

  // Dark Colors
  dark: {
    navy: '#00053d',
    gray: '#2f2f30',
  },

  // Neutral Colors
  neutral: {
    white: '#ffffff',
    offWhite: '#f7f7f8',
    lightGray: '#e9e9e9',
    mediumGray: '#696969',
    darkGray: '#2f2f30',
    border: '#e0e0e6',
  },

  // Text Colors
  text: {
    primary: '#131619',
    secondary: '#696969',
    muted: '#999',
    label: '#666',
    white: '#ffffff',
  },

  // Background Colors
  background: {
    white: '#ffffff',
    offWhite: '#f7f7f8',
    dark: '#00053d',
  },
} as const;

export type ColorToken = typeof colors;
