/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './offline.html',
    './assets/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        accent: '#f59e0b'
      }
    }
  },
  plugins: [],
}
