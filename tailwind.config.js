module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.md',
    './assets/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6D9EEB',
          DEFAULT: '#3C78D8',
          dark: '#1F4E79'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'ui-serif', 'Georgia']
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp')
  ]
};
