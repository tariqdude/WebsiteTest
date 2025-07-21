/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Enhanced modular brand system
        brand: {
          primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#1e40af',  // Main brand primary
            700: '#1d4ed8',
            800: '#1e3a8a',
            900: '#1e40af',
            950: '#172554',
            DEFAULT: '#1e40af'
          },
          secondary: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',  // Main construction orange
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
            950: '#431407',
            DEFAULT: '#f97316'
          },
          accent: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#059669',  // Main success green
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            950: '#022c22',
            DEFAULT: '#059669'
          },
          neutral: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',  // Main dark
            900: '#111827',
            950: '#030712',
            DEFAULT: '#374151'
          },
          dark: '#1f2937',
          light: '#f8fafc'
        },
        construction: {
          orange: '#f97316',
          blue: '#1e40af',
          yellow: '#eab308',
          gray: '#374151',
          red: '#dc2626',
          steel: '#64748b',
          concrete: '#a3a3a3',
          wood: '#92400e',
          copper: '#b45309'
        },
        // Status colors for consistent UI
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
        'display': ['Poppins', 'Inter', 'system-ui', 'sans-serif']
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
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }]
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '88': '22rem',
        '96': '24rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '176': '44rem',
        '192': '48rem'
      },
      animation: {
        // Existing animations
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'bounce-gentle': 'bounce 3s infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        
        // New advanced animations for modularity
        'magnetic': 'magnetic 0.3s ease-out',
        'text-reveal': 'textReveal 1.2s ease-out',
        'counter-up': 'counterUp 2s ease-out',
        'morphing-bg': 'morphBg 15s infinite',
        'floating-complex': 'floatComplex 8s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scale-up': 'scaleUp 0.3s ease-out',
        'scale-down': 'scaleDown 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'zoom-in': 'zoomIn 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        // Existing keyframes
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        
        // New advanced keyframes for modular design
        magnetic: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(var(--x, 0), var(--y, 0)) scale(1.05)' },
          '100%': { transform: 'translate(0, 0) scale(1)' }
        },
        textReveal: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(50px) rotateX(-90deg)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) rotateX(0deg)' 
          }
        },
        counterUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px) scale(0.8)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0) scale(1)' 
          }
        },
        morphBg: {
          '0%, 100%': {
            borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%'
          },
          '50%': {
            borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%'
          }
        },
        floatComplex: {
          '0%, 100%': { 
            transform: 'translateY(0px) translateX(0px) rotate(0deg)' 
          },
          '33%': { 
            transform: 'translateY(-20px) translateX(10px) rotate(2deg)' 
          },
          '66%': { 
            transform: 'translateY(-10px) translateX(-10px) rotate(-2deg)' 
          }
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200px 0'
          },
          '100%': {
            backgroundPosition: 'calc(200px + 100%) 0'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            transform: 'translateX(0%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateX(100%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        'gradient-y': {
          '0%, 100%': {
            transform: 'translateY(0%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(100%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            transform: 'translate(0%, 0%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '25%': {
            transform: 'translate(100%, 0%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          },
          '50%': {
            transform: 'translate(100%, 100%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '75%': {
            transform: 'translate(0%, 100%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' }
        },
        scaleDown: {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' }
        }
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px'
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.2)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'colored': '0 4px 14px 0 rgba(31, 41, 55, 0.15)',
        'brand': '0 4px 14px 0 rgba(30, 64, 175, 0.15)',
        'construction': '0 4px 14px 0 rgba(249, 115, 22, 0.15)',
        'floating': '0 8px 32px rgba(0, 0, 0, 0.12)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem'
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px'
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      }
    },
  },
  plugins: []
}
