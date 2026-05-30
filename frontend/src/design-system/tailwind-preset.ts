/**
 * Tailwind CSS Preset for Design System
 * Extends Tailwind with design tokens from the original design
 */

import { colors } from './tokens/colors';
import { typography } from './tokens/typography';
import { spacing } from './tokens/spacing';
import { radius } from './tokens/radius';
import { shadows } from './tokens/shadows';
import { motion } from './tokens/motion';
import { layout } from './tokens/layout';

const spacingScale = Object.fromEntries(
  Object.entries(spacing).filter(([, value]) => typeof value === 'string')
) as Record<string, string>;

const namedSpacing = {
  'section-mobile': spacing.section.mobile,
  'section-desktop': spacing.section.desktop,
  'section-large': spacing.section.large,
  'container-horizontal': spacing.container.horizontal,
  'hero-top': spacing.hero.top,
  'hero-bottom': spacing.hero.bottom,
  'card-padding': spacing.card.padding,
} as const;

export const designSystemPreset = {
  theme: {
    screens: {
      ...layout.breakpoints,
    },
    extend: {
      colors: {
        brand: {
          ...colors.brand,
        },
        navy: {
          ...colors.navy,
        },
        surface: {
          ...colors.surface,
        },
        semantic: {
          ...colors.semantic,
        },
        ui: {
          ...colors.ui,
        },
        primary: {
          DEFAULT: colors.primary.blue,
          hover: colors.primary.blueHover,
          light: colors.primary.lightBlue,
          pale: colors.primary.paleBlue,
        },
        dark: {
          DEFAULT: colors.dark.navy,
          gray: colors.dark.gray,
        },
        neutral: {
          white: colors.neutral.white,
          offWhite: colors.neutral.offWhite,
          lightGray: colors.neutral.lightGray,
          mediumGray: colors.neutral.mediumGray,
          darkGray: colors.neutral.darkGray,
          border: colors.neutral.border,
        },
        text: {
          ...colors.text,
        },
        background: {
          ...colors.background,
        },
      },
      fontFamily: {
        sans: typography.fontFamily.base.split(', '),
        mono: [typography.fontFamily.mono],
      },
      fontWeight: {
        ...typography.fontWeight,
      },
      fontSize: {
        '2xs': typography.fontSize['2xs'],
        xs: typography.fontSize.xs,
        sm: typography.fontSize.sm,
        base: typography.fontSize.base,
        lg: typography.fontSize.lg,
        xl: typography.fontSize.xl,
        '2xl': typography.fontSize['2xl'],
        '3xl': typography.fontSize['3xl'],
        '4xl': typography.fontSize['4xl'],
        '5xl': typography.fontSize['5xl'],
        '6xl': typography.fontSize['6xl'],
        '7xl': typography.fontSize['7xl'],
        h1: typography.fontSize.h1,
        h2: typography.fontSize.h2,
        h3: typography.fontSize.h3,
        h4: typography.fontSize.h4,
        'body-lg': typography.fontSize.bodyLarge,
        'body-sm': typography.fontSize.bodySmall,
      },
      lineHeight: {
        tight: typography.lineHeight.tight,
        snug: typography.lineHeight.snug,
        normal: typography.lineHeight.normal,
        relaxed: typography.lineHeight.relaxed,
      },
      spacing: {
        ...spacingScale,
        ...namedSpacing,
      },
      borderRadius: {
        ...radius,
      },
      boxShadow: {
        ...shadows,
      },
      maxWidth: {
        container: layout.container.standard,
        'container-hero': layout.container.hero,
      },
      zIndex: {
        ...layout.zIndex,
      },
      gap: {
        ...layout.gap,
      },
      backgroundImage: {
        'hero-page':
          'radial-gradient(ellipse 130% 80% at 50% 100%, #edf2fa 0%, #d4e2f8 12%, #a4c4f5 24%, #4a7fff 40%, #1540c8 58%, #000d4a 78%, #00031e 100%)',
        'hero-corners':
          'radial-gradient(ellipse 120% 60% at 50% 0%, #00031e 0%, #00053d 30%, transparent 70%)',
        'cta-gradient': 'linear-gradient(135deg, #00053d 0%, #0b5cff 70%, #1a6eff 100%)',
        surface: 'linear-gradient(180deg, #f5f7ff 0%, #ffffff 100%)',
      },
      transitionDuration: {
        fast: motion.duration.fast,
        base: motion.duration.base,
        smooth: motion.duration.smooth,
        slow: motion.duration.slow,
        slower: motion.duration.slower,
        normal: motion.duration.normal,
      },
      transitionTimingFunction: {
        smooth: motion.easing['ease-smooth'],
        spring: motion.easing['ease-spring'],
        'in-soft': motion.easing['ease-in-soft'],
        'out-soft': motion.easing['ease-out-soft'],
        ease: motion.easing.ease,
        'ease-in': motion.easing.easeIn,
        'ease-out': motion.easing.easeOut,
        'ease-in-out': motion.easing.easeInOut,
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: shadows.glow },
          '50%': { boxShadow: shadows['glow-lg'] },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': `fade-in 0.4s ${motion.easing['ease-out-soft']} both`,
        'fade-in-up': `fade-in-up 0.5s ${motion.easing['ease-out-soft']} both`,
        'slide-in-right': `slide-in-right 0.4s ${motion.easing['ease-out-soft']} both`,
        'scale-in': `scale-in 0.35s ${motion.easing['ease-spring']} both`,
        'pulse-glow': `pulse-glow 2.5s ${motion.easing['ease-smooth']} infinite`,
        float: `float 4s ${motion.easing['ease-smooth']} infinite`,
        shimmer: `shimmer 2s linear infinite`,
      },
    },
  },
};

export default designSystemPreset;
