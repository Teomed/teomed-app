import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * Card component - preserves exact original styling from design-system.html
 * Uses original class name: fdn-card
 */
export const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  const classes = `fdn-card ${className}`.trim();

  return <div className={classes}>{children}</div>;
};
