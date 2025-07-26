import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import solidJs from '@astrojs/solid-js';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest',
  output: 'static',
  integrations: [
    react({
      include: ['**/components/frameworks/react/**/*'],
    }),
    vue(),
    svelte({
      include: ['**/components/frameworks/svelte/**/*.svelte'],
    }),
    solidJs({
      include: ['**/components/frameworks/solid/**/*'],
    }),
    preact({
      include: ['**/components/frameworks/preact/**/*'],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap(),
  ],
  vite: {
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
        '@': '/src',
        '@/components': '/src/components',
        '@/lib': '/src/lib',
        '@/utils': '/src/utils',
        '@/layouts': '/src/layouts',
        '@/pages': '/src/pages',
        '@/styles': '/src/styles',
      },
    },
  },
  typescript: {
    config: './tsconfig.json',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
