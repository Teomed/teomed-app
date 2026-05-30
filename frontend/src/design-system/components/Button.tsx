import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'textLink' | 'danger';
  size?: 'small' | 'medium' | 'large';
  asChild?: boolean;
  href?: string;
  children: React.ReactNode;
}

/**
 * Button component - preserves exact original styling from design-system.html
 * Uses original class names: fdn-button, fdn-button--button-style-*, fdn-button--button-small
 */
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'primary', size = 'small', className = '', href, children, ...props }, ref) => {
    const baseClass = 'fdn-button';
    const variantClass = `fdn-button--button-style-${variant}`;
    const sizeClass = size === 'small' ? 'fdn-button--button-small' : '';
    const classes = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
