/**
 * Layout tokens extracted from design-system.html
 * Container widths, breakpoints, and grid values from the original design
 */

export const layout = {
  // Container max widths
  container: {
    standard: '1200px',
    hero: '1189px', // hero floating metrics container (desktop)
  },

  // Breakpoints (from original CSS media queries)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1025px',
    xl: '1240px',
  },

  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 1000,
    modal: 2000,
    tooltip: 3000,
  },

  // Grid gaps
  gap: {
    sm: '1rem', // 16px
    md: '1.5rem', // 24px
    lg: '2rem', // 32px
  },
} as const;

export type LayoutToken = typeof layout;
