import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import solidJs from '@astrojs/solid-js';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { VitePWA } from 'vite-plugin-pwa';

// =============================================================================
// ENHANCED ASTRO 5.x CONFIGURATION
// =============================================================================

const isDev = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Site configuration
export const SITE_CONFIG = {
  site: process.env.SITE_URL || 'https://tariqdude.github.io',
  base: process.env.BASE_PATH || '/WebsiteTest',
  output: 'static',
  trailingSlash: 'ignore',
};

// Performance-optimized dependencies for Vite
const DEPS = {
  // Critical framework cores (highest priority)
  critical: ['react', 'react-dom', 'vue', 'svelte', 'solid-js', 'preact'],

  // Feature libraries (loaded on demand)
  features: [
    'chart.js',
    'd3',
    'three', // Visualization
    'gsap',
    'framer-motion', // Animation
    'react-hook-form',
    '@hookform/resolvers/zod',
    'zod', // Forms
    'lucide-react',
    'react-hot-toast', // UI
  ],

  // Development-only dependencies
  dev: isDev ? ['monaco-editor'] : [],
};

export default defineConfig({
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest',
  output: 'static',

  // =============================================================================
  // FRAMEWORK INTEGRATIONS
  // =============================================================================
  integrations: [
    // React - Primary framework for complex components
    react({
      include: ['**/react/**', '**/showcases/**', '**/ui/**'],
    }),

    // Vue, Svelte, Solid.js, Preact - Framework-specific folders
    vue({
      include: ['**/vue/**/*.vue'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/*.ts', '**/*.js'],
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'),
        },
      },
    }),
    svelte({ include: ['**/svelte/**'] }),
    solidJs({ include: ['**/solid/**'] }),
    preact({ include: ['**/preact/**'] }),

    // Content and styling
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: { theme: 'github-dark-dimmed', wrap: true },
    }),
    tailwind({
      applyBaseStyles: false,
      config: { path: './tailwind.config.mjs' },
    }),

    // SEO
    sitemap(),
  ],

  // =============================================================================
  // VITE CONFIGURATION
  // =============================================================================
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Astro Showcase',
          short_name: 'AstroShowcase',
          description: 'A showcase of Astro with multiple frameworks.',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],

    server: { port: 4321, host: true, open: false, hmr: { overlay: true } },

    // Dependency pre-bundling optimization
    optimizeDeps: {
      include: [...DEPS.critical, ...DEPS.features, ...DEPS.dev],
      exclude: isProduction ? ['monaco-editor'] : [],
    },

    // Build optimizations
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Framework chunks
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('vue')) return 'vue-vendor';
            if (id.includes('svelte')) return 'svelte-vendor';
            if (id.includes('solid')) return 'solid-vendor';
            if (id.includes('preact')) return 'preact-vendor';

            // Feature chunks - more granular splitting
            if (id.includes('monaco-editor')) {
              // Split Monaco Editor into smaller chunks
              if (id.includes('monaco-editor/esm/vs/editor/editor.api'))
                return 'monaco-core';
              if (id.includes('monaco-editor/esm/vs/language'))
                return 'monaco-languages';
              if (id.includes('monaco-editor/esm/vs/basic-languages'))
                return 'monaco-basic-lang';
              return 'monaco-editor';
            }
            if (id.includes('chart.js')) return 'chartjs';
            if (id.includes('d3')) return 'd3-charts';
            if (id.includes('three')) return 'threejs';
            if (id.includes('gsap')) return 'gsap-animations';
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('lucide-react')) return 'icons';

            // Vendor chunks
            if (id.includes('node_modules')) return 'vendor';
          },
        },
      },
      chunkSizeWarningLimit: 4000, // Increased for Monaco Editor main chunk
      minify: isProduction ? 'esbuild' : false,
      sourcemap: isDev,
    },

    css: { devSourcemap: isDev, minify: isProduction },
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __DEV__: JSON.stringify(isDev),
      __PROD__: JSON.stringify(isProduction),
    },
  },

  // =============================================================================
  // IMAGE & SECURITY CONFIGURATION
  // =============================================================================
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
    ],
  },
  security: { checkOrigin: true },
  devToolbar: { enabled: isDev },
});
