// Design System Constants and Utilities
export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  typography: {
    fontFamily: {
      heading: string;
      body: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      xxl: string;
    };
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const designTokens: DesignTokens = {
  colors: {
    primary: 'rgb(30 64 175)',
    secondary: 'rgb(249 115 22)',
    accent: 'rgb(5 150 105)',
    neutral: 'rgb(55 65 81)',
    background: 'rgb(248 250 252)',
    surface: 'rgb(255 255 255)',
    text: {
      primary: 'rgb(17 24 39)',
      secondary: 'rgb(55 65 81)',
      muted: 'rgb(107 114 128)'
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem'
  },
  typography: {
    fontFamily: {
      heading: 'Poppins, Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, Consolas, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem'
    }
  },
  shadows: {
    sm: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    xl: '0 8px 32px rgba(0, 0, 0, 0.12)'
  },
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem'
  }
};

// Component Variants System
export const componentVariants = {
  button: {
    primary: 'bg-brand-primary-600 hover:bg-brand-primary-700 text-white shadow-brand',
    secondary: 'bg-brand-secondary-500 hover:bg-brand-secondary-600 text-white shadow-construction',
    outline: 'border-2 border-brand-primary-600 text-brand-primary-600 hover:bg-brand-primary-600 hover:text-white',
    ghost: 'text-brand-primary-600 hover:bg-brand-primary-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-brand-accent-600 hover:bg-brand-accent-700 text-white'
  },
  card: {
    default: 'bg-white rounded-xl shadow-medium border border-gray-100',
    elevated: 'bg-white rounded-2xl shadow-strong border border-gray-100',
    glass: 'bg-white/80 backdrop-blur-md rounded-2xl shadow-floating border border-white/20',
    gradient: 'bg-gradient-to-br from-brand-primary-50 to-brand-secondary-50 rounded-2xl shadow-soft'
  },
  text: {
    heading: 'font-heading font-bold text-brand-neutral-900',
    subheading: 'font-heading font-semibold text-brand-neutral-800',
    body: 'font-sans text-brand-neutral-700',
    muted: 'font-sans text-brand-neutral-500',
    accent: 'font-sans text-brand-primary-600 font-medium'
  }
};

// Animation Presets for Consistency
export const animationPresets = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideInRight: 'animate-slide-in-right',
  float: 'animate-float',
  pulse: 'animate-pulse-soft',
  glow: 'animate-glow',
  magnetic: 'animate-magnetic',
  textReveal: 'animate-text-reveal',
  counterUp: 'animate-counter-up',
  shimmer: 'animate-shimmer',
  morphBg: 'animate-morphing-bg'
};

// Responsive Breakpoints
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
  '4xl': '2560px'
};

// Utility Functions for Dynamic Classes
export const getButtonClasses = (variant: keyof typeof componentVariants.button, size: 'sm' | 'md' | 'lg' = 'md') => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };
  
  return `${baseClasses} ${sizeClasses[size]} ${componentVariants.button[variant]}`;
};

export const getCardClasses = (variant: keyof typeof componentVariants.card = 'default') => {
  const baseClasses = 'transition-all duration-300 hover:shadow-lg';
  return `${baseClasses} ${componentVariants.card[variant]}`;
};

export const getTextClasses = (variant: keyof typeof componentVariants.text, size?: string) => {
  const baseClasses = componentVariants.text[variant];
  if (size) {
    return `${baseClasses} ${size}`;
  }
  return baseClasses;
};
