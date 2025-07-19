import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://tariqdude.github.io', // Replace 'boss' with your actual GitHub username
  base: '/WebsiteTest/', // Match your actual repository name (case-sensitive)
  output: 'static',
  integrations: [tailwind()],
  build: {
    assets: 'assets'
  }
});