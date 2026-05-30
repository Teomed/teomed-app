/**
 * Tailwind CSS Preset for Design System
 * Extends Tailwind with design tokens from the original design
 */

import { colors } from './tokens/colors';
import { typography } from './tokens/typography';
import { spacing } from './tokens/spacing';
import { radius } from './tokens/radius';
import { shadows } from './tokens/shadows';
import { layout } from './tokens/layout';

export const designSystemPreset = {
  theme: {
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
      },
      fontFamily: {
        sans: typography.fontFamily.base.split(', '),
        mono: [typography.fontFamily.mono],
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
        ...spacing,
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
        fast: '200ms',
        normal: '300ms',
        slow: '400ms',
      },
    },
  },
};

export default designSystemPreset;
