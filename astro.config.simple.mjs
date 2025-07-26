import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import solidJs from '@astrojs/solid-js';
import preact from '@astrojs/preact';

// Simple configuration for testing
export default defineConfig({
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest',
  output: 'static',
  outDir: './dist',
  integrations: [
    react(),
    vue(),
    svelte(),
    solidJs(),
    preact({ compat: true }),
    tailwind()
  ]
});
