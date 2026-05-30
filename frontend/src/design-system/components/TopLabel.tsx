import React from 'react';

export interface TopLabelProps {
  icon?: string;
  text: string;
  className?: string;
}

/**
 * TopLabel component - icon + text label pattern from design-system.html
 * Uses original class names: zdcm-top-label, zdcm-top-label--icon, zdcm-top-label--text
 */
export const TopLabel: React.FC<TopLabelProps> = ({ icon, text, className = '' }) => {
  return (
    <div className={`zdcm-top-label ${className}`.trim()}>
      {icon && (
        <div className="zdcm-top-label--icon">
          <img
            src={icon}
            alt={text}
            loading="lazy"
            srcSet={`${icon} 2x`}
          />
        </div>
      )}
      <div className="zdcm-top-label--text">{text}</div>
    </div>
  );
};
