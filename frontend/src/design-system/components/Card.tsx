import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'outlined' | 'recommended' | 'dark' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
}

/**
 * Card component - preserves exact original styling from design-system.html
 * Uses original class name: fdn-card
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  variant = 'default',
  padding = 'md',
}) => {

  const variantMap: Record<NonNullable<CardProps['variant']>, string> = {
    default: '',
    outlined: 'fdn-card--outlined',
    recommended: 'fdn-card--recommended',
    dark: 'fdn-card--dark',
    glass: 'fdn-card--glass',
  };

  const paddingMap: Record<NonNullable<CardProps['padding']>, string> = {
    sm: 'fdn-card--padding-sm',
    md: 'fdn-card--padding-md',
    lg: 'fdn-card--padding-lg',
  };

  const hasVariantClass = className.includes('fdn-card--outlined') || className.includes('fdn-card--recommended') || className.includes('fdn-card--dark') || className.includes('fdn-card--glass');
  const hasPaddingClass = className.includes('fdn-card--padding-');

  const classes = `fdn-card ${hover ? '' : 'fdn-card--no-hover'} ${hasVariantClass ? '' : variantMap[variant]} ${hasPaddingClass ? '' : paddingMap[padding]} ${className}`.trim();

  return <div className={classes}>{children}</div>;
};
