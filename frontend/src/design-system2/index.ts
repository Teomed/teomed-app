/**
 * Design System - Main Export File
 * Exports all tokens, components, and layouts
 */

// Tokens
export * from './tokens/colors';
export * from './tokens/typography';
export * from './tokens/spacing';
export * from './tokens/radius';
export * from './tokens/shadows';
export * from './tokens/motion';
export * from './tokens/layout';

// Components
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { TopLabel } from './components/TopLabel';
export type { TopLabelProps } from './components/TopLabel';

export { Tabs } from './components/Tabs';
export type { TabsProps, Tab } from './components/Tabs';

export { Accordion } from './components/Accordion';
export type { AccordionProps, AccordionItem } from './components/Accordion';

export { Switch } from './components/Switch';
export type { SwitchProps } from './components/Switch';

export { Card } from './components/Card';
export type { CardProps } from './components/Card';

export { Container } from './components/Container';
export type { ContainerProps } from './components/Container';

// Layouts
export { Hero } from './layouts/Hero';
export type { HeroProps } from './layouts/Hero';

export { Section } from './layouts/Section';
export type { SectionProps } from './layouts/Section';

export { ColorGrid } from './layouts/ColorGrid';
export type { ColorGridProps, ColorSwatchProps } from './layouts/ColorGrid';

export { ComponentShowcase } from './layouts/ComponentShowcase';
export type { ComponentShowcaseProps } from './layouts/ComponentShowcase';

// Documentation
export { DesignSystemPage } from './docs/DesignSystemPage';
