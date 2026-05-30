import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'outline'
    | 'textLink'
    | 'text-link'
    | 'danger'
    | 'destructive';
  size?: 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg';
  asChild?: boolean;
  href?: string;
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * Button component - preserves exact original styling from design-system.html
 * Uses original class names: fdn-button, fdn-button--button-style-*, fdn-button--button-small
 */
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'small',
    loading = false,
    className = '',
    href,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClass = 'fdn-button';

    const normalizedVariant =
      variant === 'danger' ? 'destructive' : variant === 'textLink' ? 'textLink' : variant;
    const variantClass = `fdn-button--button-style-${normalizedVariant}`;

    const normalizedSize = size === 'sm' || size === 'md' || size === 'lg' ? size : size === 'small' ? 'sm' : size === 'medium' ? 'md' : 'lg';
    const sizeClass = `fdn-button--size-${normalizedSize}`;
    const legacySizeClass = normalizedSize === 'sm' ? 'fdn-button--button-small' : '';

    const isDisabled = Boolean(disabled || loading);
    const classes = `${baseClass} ${variantClass} ${sizeClass} ${legacySizeClass} ${className}`.trim();

    if (href) {
      const anchorProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      const { onClick, tabIndex, ...restAnchorProps } = anchorProps;

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...restAnchorProps}
          tabIndex={isDisabled ? -1 : tabIndex}
          onClick={(event) => {
            if (isDisabled) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }

            onClick?.(event);
          }}
        >
          {children}
          {loading && (
            <span className="fdn-button__dots" aria-hidden="true">
              <span className="fdn-button__dot" />
              <span className="fdn-button__dot" />
              <span className="fdn-button__dot" />
            </span>
          )}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={isDisabled}
        {...props}
      >
        {children}
        {loading && (
          <span className="fdn-button__dots" aria-hidden="true">
            <span className="fdn-button__dot" />
            <span className="fdn-button__dot" />
            <span className="fdn-button__dot" />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
