/**
 * Typography tokens extracted from design-system.html
 * Font sizes, line heights, and weights from the original design
 */

export const typography = {
  // Font Families
  fontFamily: {
    base: 'Inter, Helvetica, Arial, sans-serif',
    mono: 'monospace',
  },

  // Font Sizes (in px, converted to rem for Tailwind)
  fontSize: {
    '2xs': '0.625rem',
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    h1: '3.75rem',
    h2: '2.25rem',
    h3: '1.5rem',
    h4: '1.25rem',
    bodyLarge: '1.125rem',
    bodyRegular: '1rem',
    bodySmall: '0.875rem',
    small: '0.75rem',
    tiny: '0.625rem',
  },

  // Line Heights
  lineHeight: {
    tight: '1.2',
    snug: '1.2',
    normal: '1.5',
    relaxed: '1.5',
  },

  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '700',
    bold: '700',
  },
} as const;

export type TypographyToken = typeof typography;
