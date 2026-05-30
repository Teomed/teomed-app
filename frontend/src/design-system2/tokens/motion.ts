/**
 * Motion and transition tokens extracted from design-system.html
 * Animation timing and easing values from the original design
 */

export const motion = {
  // Transition durations
  duration: {
    fast: '0.2s', // link hover
    normal: '0.3s', // standard transitions (buttons, tabs, accordion)
    slow: '0.4s', // toggle/switch transitions
  },

  // Easing functions
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },

  // Common transition combinations
  transition: {
    all: 'all 0.3s ease',
    color: 'color 0.2s',
    transform: 'transform 0.3s ease',
    opacity: 'opacity 0.3s ease',
    switch: '0.4s', // for toggle switches
  },

  // Transform values
  transform: {
    hoverLift: 'translateY(-4px)',
    activePress: 'scale(0.98)',
  },
} as const;

export type MotionToken = typeof motion;
