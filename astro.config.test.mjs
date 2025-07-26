import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import solidJs from '@astrojs/solid-js';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Simplified config to test Vue integration
export default defineConfig({
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest',
  output: 'static',
  integrations: [
    react({
      include: ['**/components/frameworks/react/**/*'],
    }),
    vue({
      include: ['**/components/frameworks/vue/**/*.vue'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/*.js', '**/*.ts', '**/*.mjs'],
    }),
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
});
