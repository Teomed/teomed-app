/**
 * Border radius tokens extracted from design-system.html
 * Rounded corner values from the original design
 */

export const radius = {
  none: '0',
  sm: '0.25rem', // 4px - buttons, small elements
  md: '0.375rem', // 6px - medium radius (mobile images)
  lg: '0.75rem', // 12px - large radius (desktop images)
  xl: '1.5rem', // 24px - extra large (desktop large-radius)
  round: '6.25rem', // 100px - fully rounded (switches)
  full: '9999px', // fully circular
} as const;

export type RadiusToken = typeof radius;
