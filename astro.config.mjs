import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest/',
  output: 'static',
  integrations: [tailwind()],
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
    splitEntryChunks: true
  },
  vite: {
    build: {
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro']
          }
        }
      }
    }
  }
});