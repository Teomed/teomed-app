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
      transitionDuration: {
        fast: motion.duration.fast,
        normal: motion.duration.normal,
        slow: motion.duration.slow,
      },
      transitionTimingFunction: {
        ease: motion.easing.ease,
        'ease-in': motion.easing.easeIn,
        'ease-out': motion.easing.easeOut,
        'ease-in-out': motion.easing.easeInOut,
      },
    },
  },
};

export default designSystemPreset;
