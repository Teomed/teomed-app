/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./src/design-system/tailwind-preset.ts').default],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/design-system/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {},
  plugins: [],
}
