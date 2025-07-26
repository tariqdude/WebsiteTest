import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import solidJs from '@astrojs/solid-js';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest',
  output: 'static',
  integrations: [
    react(),
    vue(),
    svelte(),
    solidJs(),
    preact(),
    tailwind(),
    mdx(),
    sitemap()
  ]
});
