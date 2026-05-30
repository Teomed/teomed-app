/**
 * Shadow tokens extracted from design-system.html
 * Box shadow values from the original design
 */

export const shadows = {
  none: 'none',
  panel: 'inset 0 2.7px 14.4px rgba(0,0,0,0.06), inset 0 1.1px 6px rgba(0,0,0,0.04)',
  card: '0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.08)',
  nav: '0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.08)',
  button: '0 2px 8px rgba(11,92,255,0.35)',
  glow: '0 0 32px rgba(11,92,255,0.25)',
  'glow-lg': '0 0 64px rgba(74,181,255,0.3)',
  sm: '0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.08)',
  md: '0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.08)',
  lg: '0 0 32px rgba(11,92,255,0.25)',
  xl: '0 0 64px rgba(74,181,255,0.3)',
} as const;

export type ShadowToken = typeof shadows;
