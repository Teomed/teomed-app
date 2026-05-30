/**
 * Motion and transition tokens extracted from design-system.html
 * Animation timing and easing values from the original design
 */

export const motion = {
  // Transition durations
  duration: {
    fast: '150ms',
    base: '200ms',
    smooth: '300ms',
    slow: '500ms',
    slower: '700ms',
    normal: '300ms',
  },

  // Easing functions
  easing: {
    'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    'ease-in-soft': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out-soft': 'cubic-bezier(0, 0, 0.2, 1)',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Common transition combinations
  transition: {
    all: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    color: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    switch: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Transform values
  transform: {
    hoverLift: 'translateY(-4px)',
    activePress: 'scale(0.98)',
  },
} as const;

export type MotionToken = typeof motion;
