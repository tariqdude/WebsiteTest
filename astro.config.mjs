import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages configuration
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest',
  output: 'static',
  adapter: undefined, // Explicitly disable any adapter for static builds
  
  integrations: [tailwind()],
  
  build: {
    format: 'directory'
  },
  
  server: {
    port: 4321
  }
});