/**
 * Typography tokens extracted from design-system.html
 * Font sizes, line heights, and weights from the original design
 */

export const typography = {
  // Font Families
  fontFamily: {
    base: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'monospace',
  },

  // Font Sizes (in px, converted to rem for Tailwind)
  fontSize: {
    h1: '54px', // 3.375rem - hero__title
    h2: '40px', // 2.5rem - module-columns-title
    h3: '26px', // 1.625rem - fdn-copy-block__title
    h4: '32px', // 2rem - fdn-basic-cta__header
    bodyLarge: '18px', // 1.125rem - hero__description
    bodyRegular: '16px', // 1rem - default body
    bodySmall: '14px', // 0.875rem - zdcm-top-label--text
    small: '12px', // 0.75rem - footer text
    tiny: '0.75rem', // spec labels
  },

  // Line Heights
  lineHeight: {
    tight: '1.2', // headings
    snug: '1.3', // h3, h4
    normal: '1.5', // tabs, buttons
    relaxed: '1.6', // body text
  },

  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export type TypographyToken = typeof typography;
