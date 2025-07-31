// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest', // Replace with your repository name
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});