# DESIGN-SYSTEM.md

Este documento é a **referência oficial interna** do Design System do projeto **teomed-app**.

Objetivo:

- Definir os **tokens** (cores, tipografia, espaçamento, radius, shadows, motion)
- Definir os **patterns** (Hero/CTA/Card/Button)
- Definir **utilities** e **animações**
- Documentar o **mapeamento no Tailwind** via preset

Escopo e regras:

- Mudanças de Design System devem ficar restritas a:
  - `frontend/src/design-system/**`
  - `frontend/src/design-system/tailwind-preset.ts`
  - `frontend/src/design-system/styles/design-system.css`
  - (e arquivos de docs dentro do design-system)
- **Não** alterar páginas da aplicação (login/dashboard/settings) ao trabalhar somente o Design System.

---

## 1) Fonte de verdade (arquivos)

- **Tokens**

  - `frontend/src/design-system/tokens/colors.ts`
  - `frontend/src/design-system/tokens/typography.ts`
  - `frontend/src/design-system/tokens/spacing.ts`
  - `frontend/src/design-system/tokens/radius.ts`
  - `frontend/src/design-system/tokens/shadows.ts`
  - `frontend/src/design-system/tokens/motion.ts`
  - `frontend/src/design-system/tokens/layout.ts`
- **CSS (patterns/utilities)**

  - `frontend/src/design-system/styles/design-system.css`
- **Tailwind preset**

  - `frontend/src/design-system/tailwind-preset.ts`
- **Componentes/Layouts React**

  - `frontend/src/design-system/components/*`
  - `frontend/src/design-system/layouts/*`

---

## 2) Tokens

### 2.1 Cores (`tokens/colors.ts`)

O arquivo expõe **grupos novos** (para o design system atual) e também mantém **aliases legados** para compatibilidade.

#### Grupos principais

- `colors.brand` (escala 50–900)
- `colors.navy` (escala 50–900)
- `colors.surface`
- `colors.semantic`
- `colors.ui`

#### Aliases mantidos (compatibilidade)

- `colors.primary`
- `colors.dark`
- `colors.neutral`
- `colors.text`
- `colors.background`

Observação:

- Quando possível, novos estilos devem preferir `brand/*`, `navy/*`, `surface/*`.

---

### 2.2 Tipografia (`tokens/typography.ts`)

- Fonte base: `Inter, Helvetica, Arial, sans-serif`
- Pesos:
  - `regular: 400`
  - `medium: 500`
  - `bold: 700`
  - `semibold` é mantido como alias de `700`

Tamanhos (principais):

- Escala: `2xs, xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl`
- Aliases: `h1, h2, h3, h4, bodyLarge, bodyRegular, bodySmall, small, tiny`

Line-height:

- `tight`, `snug`, `normal`, `relaxed`

---

### 2.3 Espaçamento (`tokens/spacing.ts`)

- Base em `rem` + grid coerente com a escala.
- Inclui valores fracionários (`0.5`, `1.5`) e maiores (`24`, `32`, `40`, `48`, `64`).

Além da escala, existem espaçamentos nomeados (nested) usados por componentes:

- `spacing.section.{mobile,desktop,large}`
- `spacing.container.horizontal`
- `spacing.hero.{top,bottom}`
- `spacing.card.padding`
- `spacing.button.padding`

---

### 2.4 Radius (`tokens/radius.ts`)

Raios principais:

- `sm: 4px`
- `md: 8px`
- `lg: 12px`
- `xl: 16px`
- `2xl: 24px` (card/modal)
- `3xl: 32px` (hero/panels)
- `full: 9999px` (pill)

---

### 2.5 Shadows (`tokens/shadows.ts`)

Shadows nomeados (preferenciais):

- `panel`
- `card`
- `nav`
- `button`
- `glow`
- `glow-lg`

Aliases legados mantidos:

- `sm`, `md`, `lg`, `xl`

---

### 2.6 Motion (`tokens/motion.ts`)

Durations:

- `fast: 150ms`
- `base: 200ms`
- `smooth: 300ms`
- `slow: 500ms`
- `slower: 700ms`
- `normal: 300ms` (alias)

Easings:

- `ease-smooth`
- `ease-spring`
- `ease-in-soft`
- `ease-out-soft`
- e aliases `ease`, `easeIn`, `easeOut`, `easeInOut`

Transforms utilitários:

- `hoverLift: translateY(-4px)`
- `activePress: scale(0.98)`

---

## 3) Tailwind (preset)

### 3.1 Onde

- `frontend/src/design-system/tailwind-preset.ts`

### 3.2 O que o preset expõe

- `theme.extend.colors`

  - `brand`, `navy`, `surface`, `semantic`, `ui`
  - + `primary`, `dark`, `neutral`, `text`, `background`
- `theme.extend.fontFamily`

  - `sans` vem de `typography.fontFamily.base`
- `theme.extend.fontSize`

  - inclui escala (`2xs`..`7xl`) + aliases (`h1`..`h4`, `body-lg`, `body-sm`)
- `theme.extend.borderRadius`

  - inclui `2xl` (24px) e `3xl` (32px)
- `theme.extend.boxShadow`

  - inclui `panel/card/nav/button/glow/glow-lg`
- `theme.extend.backgroundImage`

  - `hero-page`
  - `hero-corners`
  - `cta-gradient`
  - `surface`
- `theme.extend.keyframes` + `theme.extend.animation`

  - `fade-in`, `fade-in-up`, `slide-in-right`, `scale-in`, `pulse-glow`, `float`, `shimmer`
  - classes: `animate-fade-in`, `animate-float`, `animate-shimmer`, etc.

---

## 4) Patterns e Utilities (CSS)

### 4.1 Arquivo

- `frontend/src/design-system/styles/design-system.css`

### 4.2 Patterns principais

#### Hero

- Classe base: `.hero`
- Variante escura: `.hero--dark`
  - usa background em múltiplas camadas (radial gradients)

#### Buttons

- Base: `.fdn-button` (padrão pill)
- Variantes:
  - `.fdn-button--button-style-primary`
  - `.fdn-button--button-style-secondary`
  - `.fdn-button--button-style-textLink` (e alias `text-link`)
  - `.fdn-button--button-style-ghost`
  - `.fdn-button--button-style-outline`
  - `.fdn-button--button-style-danger` / `destructive`
- Sizes:
  - `.fdn-button--size-sm`, `.fdn-button--size-md`, `.fdn-button--size-lg`
- Loading dots:
  - `.fdn-button__dots`, `.fdn-button__dot` + keyframe `dot-bounce`

#### Card

- Base: `.fdn-card` (24px radius)
- Variantes:
  - `.fdn-card--outlined`
  - `.fdn-card--recommended`
  - `.fdn-card--dark`
  - `.fdn-card--glass`
- Hover control:
  - `.fdn-card--no-hover`
- Padding:
  - `.fdn-card--padding-sm | md | lg`

#### CTA

- Utility de background:
  - `.bg-cta-gradient`

---

### 4.3 Utilities implementadas

- `hover-lift`
- `focus-ring`
- `ring-glow`
- `text-shimmer`
- `border-animated`
- `transition-fast`, `transition-smooth`, `transition-spring`
- `scrollbar-hide`

---

### 4.4 Animações (CSS fallback)

Além das animações no Tailwind preset, há fallback CSS:

- `.animate-fade-in`
- `.animate-float`
- `.animate-shimmer`

Keyframes:

- `fade-in`
- `float`
- `shimmer`
- `spin`
- `dot-bounce`

---

## 5) Component APIs (React)

### 5.1 Button (`components/Button.tsx`)

Props principais:

- `variant`:
  - `primary | secondary | ghost | outline | textLink | text-link | danger | destructive`
- `size`:
  - `small | medium | large | sm | md | lg`
- `href?: string` (renderiza `<a>`)
- `loading?: boolean`

Comportamento:

- `loading` desabilita interação (em `<button>` via `disabled`; em `<a>` via prevenção de click + `tabIndex=-1`).

### 5.2 Card (`components/Card.tsx`)

Props:

- `variant?: default | outlined | recommended | dark | glass`
- `padding?: sm | md | lg`
- `hover?: boolean`

### 5.3 Layouts

- `layouts/Hero.tsx`: mantém classnames originais (`hero`, `hero--dark`, etc.)
- `layouts/Section.tsx`: `ds-section`, `ds-section--light`, `ds-section--dark`

---

## 6) Notas de compatibilidade

- `scrollbar-width: none` gera warning em alguns browsers (progressive enhancement).
- `backdrop-filter` requer `-webkit-backdrop-filter` (já aplicado onde necessário).

---

## 7) Checklist rápido (quando for mexer no Design System)

- Tokens alterados continuam exportando **aliases legados**?
- O `tailwind-preset.ts` foi atualizado para refletir novos tokens/utilities?
- `design-system.css` contém o pattern/util que o componente usa?
- `npm run build` no diretório `frontend` passa sem erro?
