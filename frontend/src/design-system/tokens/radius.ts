/**
 * Border radius tokens extracted from design-system.html
 * Rounded corner values from the original design
 */

export const radius = {
  none: '0',
  sm: '0.25rem', // 4px - buttons, small elements
  md: '0.5rem', // 8px - cards, panels
  lg: '0.75rem', // 12px - large cards
  xl: '1rem', // 16px - featured cards
  '2xl': '1.5rem', // 24px - pricing cards, modals
  '3xl': '2rem', // 32px - hero panels
  round: '6.25rem', // 100px - fully rounded (switches)
  full: '9999px', // fully circular
} as const;

export type RadiusToken = typeof radius;
