import React from 'react';

export interface ComponentShowcaseProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * ComponentShowcase layout - preserves exact original structure from design-system.html
 * Uses original class names: ds-component-showcase, ds-component-showcase--dark
 */
export const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({
  children,
  variant = 'light',
  className = '',
}) => {
  const variantClass = variant === 'dark' ? 'ds-component-showcase--dark' : '';

  return (
    <div className={`ds-component-showcase ${variantClass} ${className}`.trim()}>
      {children}
    </div>
  );
};
