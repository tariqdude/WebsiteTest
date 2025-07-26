import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import solidJs from '@astrojs/solid-js';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Simple, Astro 5.x compatible configuration
export default defineConfig({
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest',
  output: 'static',
  
  integrations: [
    // Framework integrations with specific file patterns to avoid conflicts
    react({
      include: ['**/react/**', '**/showcases/**', '**/AdvancedForm.tsx', '**/DataVisualizationDashboard.jsx', '**/InteractiveCounter.jsx']
    }),
    vue({
      include: ['**/vue/**']
    }),
    svelte({
      include: ['**/svelte/**']
    }),
    solidJs({
      include: ['**/solid/**']
    }),
    preact({
      include: ['**/preact/**']
    }),
    
    // Content and styling
    mdx(),
    tailwind({
      applyBaseStyles: false,
    }),
    
    // SEO
    sitemap(),
  ],
  
  // Vite configuration
  vite: {
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'vue',
        'svelte',
        'solid-js',
        'preact',
        'chart.js',
        'd3',
        'three',
        'gsap',
        'framer-motion',
        'react-hook-form',
        '@hookform/resolvers/zod',
        'zod',
        'lucide-react',
        'react-hot-toast'
      ]
    }
  },
  
  // TypeScript
  typescript: {
    config: './tsconfig.json'
  },
  
  // Image optimization (Astro 5.x format)
  image: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com'
      }
    ]
  }
});
