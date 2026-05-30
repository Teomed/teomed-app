/**
 * Spacing tokens extracted from design-system.html
 * Padding, margin, and gap values from the original design
 */

export const spacing = {
  // Base spacing scale (rem)
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  13: '3.25rem', // 52px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
  40: '10rem', // 160px
  48: '12rem', // 192px
  64: '16rem', // 256px

  // Section padding (from design-system.html)
  section: {
    mobile: '60px',
    desktop: '100px',
    large: '110px',
  },

  // Container padding
  container: {
    horizontal: '2rem', // 32px
  },

  // Hero padding
  hero: {
    top: '3.75rem', // 60px
    bottom: '3.75rem', // 60px
  },

  // Component-specific spacing
  button: {
    padding: '0.625rem 1.25rem', // 10px 20px
  },

  accordion: {
    itemPadding: '1.25rem 0', // 20px 0
  },

  card: {
    padding: '2rem', // 32px
  },
} as const;

export type SpacingToken = typeof spacing;
