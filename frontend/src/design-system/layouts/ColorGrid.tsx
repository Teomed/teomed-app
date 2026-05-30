import React from 'react';

export interface ColorSwatchProps {
  name: string;
  value: string;
  color: string;
}

export interface ColorGridProps {
  colors: ColorSwatchProps[];
  className?: string;
}

/**
 * ColorGrid layout component - preserves exact original structure from design-system.html
 * Uses original class names: ds-color-grid, ds-color-swatch, ds-color-swatch__color, etc.
 */
export const ColorGrid: React.FC<ColorGridProps> = ({ colors, className = '' }) => {
  return (
    <div className={`ds-color-grid ${className}`.trim()}>
      {colors.map((colorItem) => (
        <div key={colorItem.value} className="ds-color-swatch">
          <div className="ds-color-swatch__color" style={{ background: colorItem.color }}></div>
          <div className="ds-color-swatch__info">
            <p className="ds-color-swatch__name">{colorItem.name}</p>
            <p className="ds-color-swatch__value">{colorItem.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
