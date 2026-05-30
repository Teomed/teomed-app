import React from 'react';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  labelAnnual?: string;
  labelMonth?: string;
  name?: string;
  className?: string;
}

/**
 * Switch/Toggle component - preserves exact original styling from design-system.html
 * Uses original class names: zdcm-switch, zdcm-checkbox, zdcm-slider, zdcm-round
 */
export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onChange,
  labelAnnual = 'Annually',
  labelMonth = 'Monthly',
  name = 'toggle-switch',
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <label
      className={`zdcm-switch ${className}`.trim()}
      data-label-annual={labelAnnual}
      data-label-month={labelMonth}
    >
      <input
        type="checkbox"
        className="zdcm-checkbox"
        name={name}
        checked={checked}
        onChange={handleChange}
      />
      <span className="zdcm-slider zdcm-round"></span>
    </label>
  );
};
