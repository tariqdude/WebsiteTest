import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import solidJs from '@astrojs/solid-js';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Centralized configuration for better maintainability
const SITE_CONFIG = {
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest',
  output: 'static' as const,
} as const;

const INTEGRATIONS = [
  // Framework integrations with specific configurations
  react({
    include: '**/react/**',
  }),
  vue({
    include: '**/vue/**',
  }),
  svelte({
    include: '**/svelte/**',
  }),
  solidJs({
    include: '**/solid/**',
  }),
  preact({
    include: '**/preact/**',
  }),
  // Styling and content
  tailwind({
    applyBaseStyles: false, // We handle base styles in global.css
  }),
  mdx(),
  sitemap(),
] as const;

const VITE_CONFIG = {
  optimizeDeps: {
    include: [
      'three',
      'd3',
      'chart.js',
      'gsap',
      'monaco-editor',
      'react-hook-form',
      '@hookform/resolvers/zod',
      'zod',
      'framer-motion',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          react: ['react', 'react-dom'],
          vue: ['vue'],
          three: ['three'],
          d3: ['d3'],
          charts: ['chart.js'],
          animations: ['gsap', 'framer-motion'],
          forms: ['react-hook-form', '@hookform/resolvers/zod', 'zod'],
        },
      },
    },
  },
  resolve: {
    alias: {
      // Path aliases for cleaner imports
      '@': '/src',
      '@/components': '/src/components',
      '@/lib': '/src/lib',
      '@/utils': '/src/utils',
      '@/layouts': '/src/layouts',
      '@/pages': '/src/pages',
      '@/styles': '/src/styles',
    },
  },
} as const;

// https://astro.build/config
export default defineConfig({
  ...SITE_CONFIG,
  integrations: INTEGRATIONS,
  vite: VITE_CONFIG,
  
  // TypeScript configuration
  typescript: {
    config: './tsconfig.json',
  },
  
  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
  
  // Image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
