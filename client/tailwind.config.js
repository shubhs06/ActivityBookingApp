/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pine: '#1C2B27',
        paper: '#F6F3EC',
        terracotta: '#E8633A',
        sage: '#3D5A4E',
        stone: '#9A9182',
        confirmed: '#2F7A5E',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
