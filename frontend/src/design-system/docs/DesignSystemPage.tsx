import React from 'react';
import '../styles/design-system.css';
import { Button } from '../components/Button';
import { TopLabel } from '../components/TopLabel';
import { Tabs } from '../components/Tabs';
import { Accordion } from '../components/Accordion';
import { Switch } from '../components/Switch';
import { Card } from '../components/Card';
import { Hero } from '../layouts/Hero';
import { Section } from '../layouts/Section';
import { ColorGrid } from '../layouts/ColorGrid';
import { ComponentShowcase } from '../layouts/ComponentShowcase';
import { colors } from '../tokens/colors';

/**
 * DesignSystemPage - Living documentation of the design system
 * Faithfully reproduces the design-system.html structure in React
 */
export const DesignSystemPage: React.FC = () => {
  const [pricingToggle, setPricingToggle] = React.useState(true);

  // Color data for swatches
  const primaryColors = [
    { name: 'Primary Blue', value: '#0b5cff', color: colors.primary.blue },
    { name: 'Dark Navy', value: '#00053d', color: colors.dark.navy },
    { name: 'Light Blue', value: '#b4d0f8', color: colors.primary.lightBlue },
    { name: 'Pale Blue', value: '#d1def2', color: colors.primary.paleBlue },
  ];

  const neutralColors = [
    { name: 'White', value: '#ffffff', color: colors.neutral.white },
    { name: 'Off White', value: '#f7f7f8', color: colors.neutral.offWhite },
    { name: 'Light Gray', value: '#e9e9e9', color: colors.neutral.lightGray },
    { name: 'Medium Gray', value: '#696969', color: colors.neutral.mediumGray },
    { name: 'Dark Gray', value: '#2f2f30', color: colors.neutral.darkGray },
  ];

  // Accordion data
  const accordionItems = [
    {
      id: '1',
      question: 'What is an AI note taker?',
      answer:
        'An AI note taker is a software tool that uses artificial intelligence technology, voice and speech recognition, and machine learning to automatically transcribe, analyze, and summarize meetings content in real time.',
    },
    {
      id: '2',
      question: 'How does My Notes work?',
      answer:
        'My Notes integrates seamlessly with your meetings to capture, transcribe, and organize all your important information automatically.',
    },
    {
      id: '3',
      question: 'Is My Notes secure?',
      answer:
        'Yes, My Notes uses enterprise-grade encryption and follows strict data privacy standards to keep your information secure.',
    },
  ];

  // Tabs data
  const tabsData = [
    {
      id: '1',
      title: 'Before meetings',
      content: (
        <div style={{ padding: '2rem', background: '#f7f7f8', borderRadius: '0.5rem' }}>
          <h4>Before meetings</h4>
          <p>Prepare for your meetings with AI-powered note templates and agenda builders.</p>
        </div>
      ),
    },
    {
      id: '2',
      title: 'During meetings',
      content: (
        <div style={{ padding: '2rem', background: '#f7f7f8', borderRadius: '0.5rem' }}>
          <h4>During meetings</h4>
          <p>Capture every detail automatically with real-time transcription and smart summaries.</p>
        </div>
      ),
    },
    {
      id: '3',
      title: 'After meetings',
      content: (
        <div style={{ padding: '2rem', background: '#f7f7f8', borderRadius: '0.5rem' }}>
          <h4>After meetings</h4>
          <p>Review, share, and action your notes with integrated task management.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="fonts-loaded product-use-case-page">
      {/* Navigation */}
      <nav className="ds-nav">
        <div className="ds-nav__container">
          <h1 className="ds-nav__title">Design System</h1>
          <ul className="ds-nav__links">
            <li>
              <a href="#hero" className="ds-nav__link">
                Hero
              </a>
            </li>
            <li>
              <a href="#typography" className="ds-nav__link">
                Typography
              </a>
            </li>
            <li>
              <a href="#colors" className="ds-nav__link">
                Colors
              </a>
            </li>
            <li>
              <a href="#components" className="ds-nav__link">
                Components
              </a>
            </li>
            <li>
              <a href="#layout" className="ds-nav__link">
                Layout
              </a>
            </li>
            <li>
              <a href="#motion" className="ds-nav__link">
                Motion
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero
        id="hero"
        variant="dark"
        title="A living pattern library for the Zoom My Notes experience"
        description="This design system preserves the exact look, feel, and behavior of the original design. Every component, color, typography choice, and animation is documented here for faithful reuse."
        topLabel={{
          icon: '/assets/aa4fd4ef175086f4_blue-light.svg',
          text: 'Design System',
        }}
        image="/assets/3680222ecac80f71_my-notes-poster.webp"
        imageAlt="Design System Preview"
        cta={
          <>
            <Button variant="primary" size="small" href="#typography">
              Explore Typography
            </Button>
            <Button variant="textLink" size="small" href="#components">
              View Components
            </Button>
          </>
        }
      />

      {/* Typography Section */}
      <Section id="typography" variant="light" title="Typography">
        <p>All typography styles extracted from the original design. No approximations.</p>

        <div className="ds-typo-row">
          <div className="ds-typo-row__label">Heading 1</div>
          <h1 className="hero__title">Your meeting's over. Did you catch all of that?</h1>
          <div className="ds-typo-row__spec">54px / 1.2</div>
        </div>

        <div className="ds-typo-row">
          <div className="ds-typo-row__label">Heading 2</div>
          <h2 className="module-columns-title">Power through meetings and to-do's with an AI note taker</h2>
          <div className="ds-typo-row__spec">40px / 1.2</div>
        </div>

        <div className="ds-typo-row">
          <div className="ds-typo-row__label">Heading 3</div>
          <h3 className="fdn-copy-block__title">Your notes, wherever you meet</h3>
          <div className="ds-typo-row__spec">26px / 1.3</div>
        </div>

        <div className="ds-typo-row">
          <div className="ds-typo-row__label">Heading 4</div>
          <h4 className="fdn-basic-cta__header">Get started with My Notes</h4>
          <div className="ds-typo-row__spec">32px / 1.3</div>
        </div>

        <div className="ds-typo-row">
          <div className="ds-typo-row__label">Body Large</div>
          <p className="hero__description">
            Never lose ideas, action items, or momentum again, with My Notes - available for most meeting platforms.
          </p>
          <div className="ds-typo-row__spec">18px / 1.6</div>
        </div>

        <div className="ds-typo-row">
          <div className="ds-typo-row__label">Body Regular</div>
          <p>
            An AI note taker is a software tool that uses artificial intelligence technology, voice and speech
            recognition, and machine learning to automatically transcribe, analyze, and summarize meetings content in
            real time.
          </p>
          <div className="ds-typo-row__spec">16px / 1.6</div>
        </div>

        <div className="ds-typo-row">
          <div className="ds-typo-row__label">Small Text</div>
          <p className="zdcm-module-footer-nav-downloadText">Download on Apple Store</p>
          <div className="ds-typo-row__spec">12px / 1.4</div>
        </div>

        <div className="ds-typo-row">
          <div className="ds-typo-row__label">Top Label</div>
          <div className="zdcm-top-label--text">AI note taking</div>
          <div className="ds-typo-row__spec">14px / 1.4</div>
        </div>
      </Section>

      {/* Colors Section */}
      <Section id="colors" title="Colors & Surfaces">
        <h3 className="ds-section__subtitle">Primary Colors</h3>
        <ColorGrid colors={primaryColors} />

        <h3 className="ds-section__subtitle">Neutral Colors</h3>
        <ColorGrid colors={neutralColors} />
      </Section>

      {/* Components Section */}
      <Section id="components" variant="light" title="UI Components">
        <h3 className="ds-section__subtitle">Buttons</h3>
        <p>All button variants with exact original classes and styles.</p>

        <ComponentShowcase>
          <div>
            <p className="ds-state-label">Primary</p>
            <Button variant="primary" size="small" href="#">
              Buy now
            </Button>
          </div>

          <div>
            <p className="ds-state-label">Text Link</p>
            <Button variant="textLink" size="small" href="#">
              Learn more
            </Button>
          </div>

          <div>
            <p className="ds-state-label">Secondary</p>
            <Button variant="secondary" size="small" href="#">
              Sign up free
            </Button>
          </div>
        </ComponentShowcase>

        <h3 className="ds-section__subtitle">Tabs</h3>
        <p>Tab component with exact original markup and behavior.</p>

        <Tabs tabs={tabsData} />

        <h3 className="ds-section__subtitle">Accordion</h3>
        <p>Accordion component with exact original markup.</p>

        <Accordion items={accordionItems} />

        <h3 className="ds-section__subtitle">Pricing Toggle</h3>
        <p>Pricing duration toggle with exact original styling.</p>

        <div className="fdn-zdcm-pricing-cards-action-bar" style={{ margin: '2rem 0' }}>
          <div className="fdn-zdcm-plan-duration">
            <Switch
              checked={pricingToggle}
              onChange={setPricingToggle}
              labelAnnual="Annually"
              labelMonth="Monthly"
            />
          </div>
        </div>

        <h3 className="ds-section__subtitle">Top Label</h3>
        <p>Icon + text label component used throughout the design.</p>

        <div style={{ margin: '2rem 0' }}>
          <TopLabel icon="/assets/aa4fd4ef175086f4_blue-light.svg" text="AI note taking for every team" />
        </div>

        <h3 className="ds-section__subtitle">Card</h3>
        <p>Card component with hover effects.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <Card>
            <h4 style={{ marginTop: 0 }}>Feature Card</h4>
            <p>This is a card component with the original styling and hover effects from the design system.</p>
          </Card>
          <Card>
            <h4 style={{ marginTop: 0 }}>Another Card</h4>
            <p>Cards automatically lift on hover with a smooth transition.</p>
          </Card>
        </div>
      </Section>

      {/* Layout Section */}
      <Section id="layout" title="Layout & Spacing">
        <h3 className="ds-section__subtitle">Container Widths</h3>
        <ul>
          <li>
            <span className="ds-code">max-width: 1200px</span> — Standard content container
          </li>
          <li>
            <span className="ds-code">max-width: 1189px</span> — Hero floating metrics container (desktop)
          </li>
          <li>
            <span className="ds-code">padding: 0 2rem</span> — Standard horizontal padding
          </li>
        </ul>

        <h3 className="ds-section__subtitle">Border Radius</h3>
        <div className="ds-color-grid">
          <div className="ds-layout-example">
            <div style={{ width: '100px', height: '100px', background: '#0b5cff', borderRadius: '0.25rem' }}></div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Small: 0.25rem (4px)</p>
          </div>

          <div className="ds-layout-example">
            <div style={{ width: '100px', height: '100px', background: '#0b5cff', borderRadius: '0.375rem' }}></div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Medium: 0.375rem (6px)</p>
          </div>

          <div className="ds-layout-example">
            <div style={{ width: '100px', height: '100px', background: '#0b5cff', borderRadius: '0.75rem' }}></div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Large: 0.75rem (12px)</p>
          </div>
        </div>

        <h3 className="ds-section__subtitle">Section Padding</h3>
        <ul>
          <li>
            <span className="ds-code">padding: 60px 0</span> — Standard section padding (mobile)
          </li>
          <li>
            <span className="ds-code">padding: 100px 0</span> — Standard section padding (desktop)
          </li>
          <li>
            <span className="ds-code">padding: 110px 0</span> — Large section padding (desktop)
          </li>
        </ul>
      </Section>

      {/* Motion Section */}
      <Section id="motion" variant="light" title="Motion & Interaction">
        <h3 className="ds-section__subtitle">Transitions</h3>
        <ul>
          <li>
            <span className="ds-code">transition: all 0.3s ease</span> — Standard transition
          </li>
          <li>
            <span className="ds-code">transition: 0.4s</span> — Toggle/switch transitions
          </li>
          <li>
            <span className="ds-code">transition: color 0.2s</span> — Link hover transitions
          </li>
        </ul>

        <h3 className="ds-section__subtitle">Hover Effects</h3>
        <p>Interactive demo of hover behaviors:</p>

        <div className="ds-motion-demo">
          <div className="ds-motion-demo__item">Hover me</div>
          <div className="ds-motion-demo__item">And me</div>
          <div className="ds-motion-demo__item">Me too</div>
        </div>

        <h3 className="ds-section__subtitle">Button States</h3>
        <ComponentShowcase>
          <Button variant="primary" size="small" href="#">
            Default
          </Button>
          <Button variant="primary" size="small" href="#" style={{ opacity: 0.8 }}>
            Hover (simulated)
          </Button>
          <Button variant="primary" size="small" href="#" style={{ transform: 'scale(0.98)' }}>
            Active (simulated)
          </Button>
        </ComponentShowcase>
      </Section>

      {/* Usage Notes */}
      <Section id="usage" variant="dark" title="Usage Notes">
        <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '800px' }}>
          This design system is a faithful extraction of the Zoom My Notes landing page design. All components, colors,
          typography, spacing, and animations are preserved exactly as they appear in the original. To use these
          patterns in another project, import the components from the design system package.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '800px', marginTop: '1rem' }}>
          <strong>Example usage:</strong>
          <br />
          <span className="ds-code">import {'{ Button, Hero, Section }'} from '@/design-system';</span>
        </p>
      </Section>
    </div>
  );
};
