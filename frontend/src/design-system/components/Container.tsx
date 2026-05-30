import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'standard' | 'hero';
}

/**
 * Container component - preserves exact original container styling from design-system.html
 * Uses original class name: ds-container
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  maxWidth = 'standard',
}) => {
  const maxWidthClass = maxWidth === 'hero' ? 'max-w-[1189px]' : 'max-w-[1200px]';
  const classes = `ds-container ${maxWidthClass} ${className}`.trim();

  return <div className={classes}>{children}</div>;
};
