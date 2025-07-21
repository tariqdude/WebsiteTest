import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages configuration
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest',
  output: 'static',
  
  integrations: [tailwind()],
  
  server: {
    port: 4321
  },
  
  // Build configuration for GitHub Pages
  build: {
    assets: '_astro'
  },
  
  // Ensure all JavaScript works on GitHub Pages
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: '_astro/[name].[hash].js',
          chunkFileNames: '_astro/[name].[hash].js',
          assetFileNames: '_astro/[name].[hash].[ext]'
        }
      }
    }
  }
});