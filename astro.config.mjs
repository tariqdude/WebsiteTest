import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://tariqdude.github.io/websitetest',
  base: '/websitetest/',
  output: 'static',
  integrations: [tailwind()],
});