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
    splitEntryChunks: true,
    // Compress HTML output
    format: 'preserve'
  },
  compressHTML: true,
  // Performance optimizations
  experimental: {
    optimizeHoistedScript: true
  },
  vite: {
    build: {
      minify: 'terser',
      cssMinify: true,
      rollupOptions: {
        output: {
          // Optimize chunk splitting
          manualChunks: {
            vendor: ['astro'],
            utils: ['src/scripts/websiteController.js', 'src/scripts/errorHandler.js', 'src/scripts/analytics.js']
          },
          // Optimize asset names for better caching
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/css/i.test(ext)) {
              return `assets/css/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js'
        }
      },
      // Terser options for better compression
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
          passes: 2
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false
        }
      }
    },
    // CSS optimization
    css: {
      devSourcemap: true
    }
  }
});