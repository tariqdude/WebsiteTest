import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import solidJs from '@astrojs/solid-js';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// =============================================================================
// ENHANCED ASTRO 5.x CONFIGURATION
// =============================================================================

const isDev = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Site configuration
const SITE_CONFIG = {
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest',
  output: 'static'
};

// Performance-optimized dependencies for Vite
const CRITICAL_DEPS = [
  // UI Framework cores (high priority)
  'react',
  'react-dom',
  'vue', 
  'svelte',
  'solid-js',
  'preact',
];

const FEATURE_DEPS = [
  // Visualization libraries
  'chart.js',
  'd3',
  'three',
  
  // Animation libraries
  'gsap',
  'framer-motion',
  
  // Form handling
  'react-hook-form',
  '@hookform/resolvers/zod',
  'zod',
  
  // UI components
  'lucide-react',
  'react-hot-toast',
  
  // Development tools (only in dev)
  ...(isDev ? ['monaco-editor'] : [])
];

export default defineConfig({
  ...SITE_CONFIG,
  
  // =============================================================================
  // FRAMEWORK INTEGRATIONS - Optimized for multi-framework showcase
  // =============================================================================
  integrations: [
    // React - Primary framework for complex components
    react({
      include: [
        '**/react/**',           // React-specific folder
        '**/showcases/**',       // Showcase components (mostly React)
        '**/AdvancedForm.tsx',   // TypeScript React components
        '**/DataVisualizationDashboard.jsx',
        '**/InteractiveCounter.jsx'
      ]
    }),
    
    // Vue - For reactive demonstrations
    vue({
      include: ['**/vue/**']
    }),
    
    // Svelte - For built-in animation showcases
    svelte({
      include: ['**/svelte/**']
    }),
    
    // Solid.js - For fine-grained reactivity demos
    solidJs({
      include: ['**/solid/**']
    }),
    
    // Preact - For lightweight React-like components
    preact({
      include: ['**/preact/**']
    }),
    
    // Content and styling integrations
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'github-dark-dimmed',
        wrap: true
      }
    }),
    
    tailwind({
      applyBaseStyles: false, // We have custom global styles
      config: {
        path: './tailwind.config.mjs'
      }
    }),
    
    // SEO optimization
    sitemap({
      canonicalURL: SITE_CONFIG.site,
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US'
        }
      }
    }),
  ],
  
  // =============================================================================
  // VITE CONFIGURATION - Performance optimized
  // =============================================================================
  vite: {
    // Development server configuration
    server: {
      port: 4321,
      host: true,
      open: false,
      hmr: {
        overlay: true
      }
    },

    // Dependency pre-bundling optimization
    optimizeDeps: {
      include: [...CRITICAL_DEPS, ...FEATURE_DEPS],
      exclude: [
        // Exclude large packages that should be loaded on demand
        ...(isProduction ? ['monaco-editor'] : [])
      ]
    },

    // Build optimizations
    build: {
      rollupOptions: {
        output: {
          // Intelligent code splitting
          manualChunks(id) {
            // Framework chunks
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            if (id.includes('vue')) return 'vue-vendor';
            if (id.includes('svelte')) return 'svelte-vendor';
            if (id.includes('solid')) return 'solid-vendor';
            if (id.includes('preact')) return 'preact-vendor';
            
            // Feature chunks
            if (id.includes('chart.js') || id.includes('d3')) return 'visualization';
            if (id.includes('three')) return 'threejs';
            if (id.includes('gsap') || id.includes('framer-motion')) return 'animation';
            if (id.includes('monaco-editor')) return 'editor';
            if (id.includes('lucide-react')) return 'icons';
            
            // Utility chunks
            if (id.includes('node_modules')) return 'vendor';
          }
        }
      },
      // Performance settings
      chunkSizeWarningLimit: 1000,
      minify: isProduction ? 'esbuild' : false,
      sourcemap: isDev
    },

    // CSS optimization
    css: {
      devSourcemap: isDev,
      minify: isProduction
    },

    // Environment variables
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __DEV__: JSON.stringify(isDev),
      __PROD__: JSON.stringify(isProduction)
    }
  },
  
  // =============================================================================
  // TYPESCRIPT CONFIGURATION - Enhanced type checking
  // =============================================================================
  typescript: {
    config: './tsconfig.json',
    strict: true
  },

  // =============================================================================
  // IMAGE OPTIMIZATION - Astro 5.x compatible
  // =============================================================================
  image: {
    domains: [
      'images.unsplash.com', 
      'via.placeholder.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com'
      },
      {
        protocol: 'https', 
        hostname: '**.unsplash.com'
      }
    ]
  },

  // =============================================================================
  // SECURITY & PERFORMANCE
  // =============================================================================
  security: {
    checkOrigin: true
  },

  // Development toolbar (only in development)
  devToolbar: {
    enabled: isDev
  },

  // =============================================================================
  // MARKDOWN & CONTENT CONFIGURATION
  // =============================================================================
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  }
});
