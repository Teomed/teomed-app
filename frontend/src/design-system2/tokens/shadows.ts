/**
 * Shadow tokens extracted from design-system.html
 * Box shadow values from the original design
 */

export const shadows = {
  none: 'none',
  sm: '0 2px 8px rgba(0, 0, 0, 0.1)', // color swatch, small cards
  md: '0 0 1.25rem rgba(0, 0, 0, 0.05)', // pricing cards default
  lg: '0 0 1.25rem rgba(0, 0, 0, 0.1)', // pricing cards hover
  xl: '0 8px 16px rgba(11, 92, 255, 0.3)', // motion demo hover (primary color shadow)
} as const;

export type ShadowToken = typeof shadows;
