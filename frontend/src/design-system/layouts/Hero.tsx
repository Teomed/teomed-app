import React from 'react';

export interface HeroProps {
  title: string;
  description?: string;
  topLabel?: {
    icon?: string;
    text: string;
  };
  cta?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  variant?: 'light' | 'dark';
  className?: string;
  children?: React.ReactNode;
}

/**
 * Hero layout component - preserves exact original structure from design-system.html
 * Uses original class names: hero, hero--dark, hero__container, hero__content, hero__title, etc.
 */
export const Hero: React.FC<HeroProps> = ({
  title,
  description,
  topLabel,
  cta,
  image,
  imageAlt = '',
  variant = 'dark',
  className = '',
  children,
}) => {
  const variantClass = variant === 'dark' ? 'hero--dark' : '';
  const imageClass = image ? 'hero--with-image' : '';

  return (
    <section
      className={`hero ${variantClass} ${imageClass} hero--no-line hero--no-color-block hero--simple-image hero-floating-metrics-container hero--hub-gradient-eclipse hero--stick-right ${className}`.trim()}
    >
      <div className="hero__container">
        <div className="hero__content">
          {topLabel && (
            <div className="zdcm-top-title-wrapper">
              <div className="zdcm-top-label">
                {topLabel.icon && (
                  <div className="zdcm-top-label--icon">
                    <img
                      alt={topLabel.text}
                      loading="lazy"
                      src={topLabel.icon}
                      srcSet={`${topLabel.icon} 2x`}
                      title={topLabel.text}
                    />
                  </div>
                )}
                <div className="zdcm-top-label--text">{topLabel.text}</div>
              </div>
            </div>
          )}

          <h1 className="hero__title">{title}</h1>

          {description && (
            <div className="hero__description">
              <p>{description}</p>
            </div>
          )}

          {cta && <div className="hero__cta">{cta}</div>}

          {children}
        </div>

        {image && (
          <div className="hero__image hero-floating-metrics-video">
            <div className="fdn-autoVideo fdn-autoVideo--container medium-radius">
              <img
                alt={imageAlt}
                className="medium-radius"
                loading="lazy"
                src={image}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
