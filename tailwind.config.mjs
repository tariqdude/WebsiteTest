/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3366FF',
        secondary: '#66CC99',
        accent: '#FFCC00',
        text: '#333333',
        headings: '#1A1A1A',
        background: '#F8F8F8',
        surface: '#FFFFFF',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}