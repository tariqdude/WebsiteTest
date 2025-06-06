module.exports = {
  content: ["./layouts/**/*.html", "./content/**/*.md", "./archetypes/**/*.md"],
  theme: {
    extend: {
      colors: {
        primary: '#0d9488',
        secondary: '#164e63'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ]
}
