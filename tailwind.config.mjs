/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    fontFamily: {
      heading: ['Oswald', 'sans-serif'],
      body: ['Roboto', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#1a1a1a', // Dark Charcoal/Black
        accent: '#007bff',  // Bright Electric Blue
        secondary: '#f0f0f0', // Light Gray
      },
    },
  },
  plugins: [],
}