/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#0066FF',
        'primary-hover': '#0052CC',
        success: '#1C7A2C',
        warning: '#B25D05',
        'success-bg': '#E3F2E6',
        'warning-bg': '#FFF4E5',
        border: '#E5E5E5',
        text: {
          primary: '#000000',
          secondary: '#666666',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.1)',
        hover: '0 4px 6px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
