/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.html',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1.125rem)',
        'fluid-base': 'clamp(1rem, 0.875rem + 0.625vw, 1.375rem)',
        'fluid-lg': 'clamp(1.125rem, 0.95rem + 0.875vw, 1.625rem)',
        'fluid-xl': 'clamp(1.25rem, 1rem + 1.25vw, 2rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.125rem + 1.875vw, 2.625rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.375rem + 2.5vw, 3.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.625rem + 3.125vw, 4.375rem)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '176': '44rem',
        '192': '48rem',
        'fluid-sm': 'clamp(1rem, 0.75rem + 1.25vw, 1.75rem)',
        'fluid-md': 'clamp(2rem, 1.5rem + 2.5vw, 3.5rem)',
        'fluid-lg': 'clamp(3rem, 2rem + 5vw, 6rem)',
        'fluid-xl': 'clamp(4rem, 2.5rem + 7.5vw, 8rem)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'typewriter': 'typewriter 4s steps(40) infinite',
        'cursor-blink': 'cursor-blink 1s infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'wave': 'wave 2.5s ease-in-out infinite',
        'ripple': 'ripple 2s linear infinite',
        'zoom-in': 'zoomIn 0.6s ease-out',
        'flip': 'flip 1s ease-in-out',
        'swing': 'swing 1s ease-in-out',
        'elastic': 'elastic 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        typewriter: {
          '0%': { width: '0ch' },
          '50%': { width: '20ch' },
          '100%': { width: '0ch' },
        },
        'cursor-blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '30%': { transform: 'rotate(14deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '60%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale3d(0.3, 0.3, 0.3)' },
          '50%': { opacity: '1' },
        },
        flip: {
          '0%': { transform: 'perspective(400px) rotateY(0)' },
          '40%': { transform: 'perspective(400px) translateZ(150px) rotateY(170deg)' },
          '50%': { transform: 'perspective(400px) translateZ(150px) rotateY(190deg) scale(1)' },
          '80%': { transform: 'perspective(400px) rotateY(360deg) scale(0.95)' },
          '100%': { transform: 'perspective(400px) scale(1)' },
        },
        swing: {
          '20%': { transform: 'rotate(15deg)' },
          '40%': { transform: 'rotate(-10deg)' },
          '60%': { transform: 'rotate(5deg)' },
          '80%': { transform: 'rotate(-5deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        elastic: {
          '0%': { transform: 'scale3d(1, 1, 1)' },
          '30%': { transform: 'scale3d(1.25, 0.75, 1)' },
          '40%': { transform: 'scale3d(0.75, 1.25, 1)' },
          '50%': { transform: 'scale3d(1.15, 0.85, 1)' },
          '65%': { transform: 'scale3d(0.95, 1.05, 1)' },
          '75%': { transform: 'scale3d(1.05, 0.95, 1)' },
          '100%': { transform: 'scale3d(1, 1, 1)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'base': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'base': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'elegant': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-purple': '0 0 20px rgba(147, 51, 234, 0.15)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.15)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
        'brutalist': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
        'neo': '12px 12px 20px rgba(0, 0, 0, 0.25), -12px -12px 20px rgba(255, 255, 255, 0.3)',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1600px',
        '4xl': '1920px',
        'tall': { 'raw': '(min-height: 800px)' },
        'short': { 'raw': '(max-height: 600px)' },
      },
      transitionTimingFunction: {
        'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      blur: {
        'xs': '2px',
        '4xl': '72px',
        '5xl': '96px',
      },
      grayscale: {
        25: '0.25',
        75: '0.75',
      },
      scale: {
        25: '0.25',
        175: '1.75',
      },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography')({
      className: 'prose',
    }),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    // Custom plugin for glass morphism
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.1)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.text-stroke': {
          '-webkit-text-stroke': '1px currentColor',
        },
        '.text-stroke-2': {
          '-webkit-text-stroke': '2px currentColor',
        },
        '.clip-text': {
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
      };
      addUtilities(newUtilities);
    },
    // Custom plugin for advanced gradients
    function({ addUtilities }) {
      addUtilities({
        '.bg-gradient-radial': {
          'background-image': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        },
        '.bg-gradient-conic': {
          'background-image': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
        '.bg-mesh': {
          'background-image': `
            radial-gradient(at 47% 33%, hsl(162, 95%, 45%) 0px, transparent 59%),
            radial-gradient(at 82% 65%, hsl(218, 95%, 65%) 0px, transparent 55%)
          `,
        },
      });
    },
  ],
  // Enable all core plugins for maximum customization
  corePlugins: {
    preflight: true,
  },
}
