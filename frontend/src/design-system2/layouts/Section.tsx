import React from 'react';

export interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'light' | 'dark';
  className?: string;
  id?: string;
}

/**
 * Section layout component - preserves exact original structure from design-system.html
 * Uses original class names: ds-section, ds-section--light, ds-section--dark, ds-section__title
 */
export const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  className = '',
  id,
}) => {
  const variantClass = variant === 'light' ? 'ds-section--light' : variant === 'dark' ? 'ds-section--dark' : '';

  return (
    <section id={id} className={`ds-section ${variantClass} ${className}`.trim()}>
      {title && <h2 className="ds-section__title">{title}</h2>}
      {subtitle && <h3 className="ds-section__subtitle">{subtitle}</h3>}
      {children}
    </section>
  );
};
