import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import solidJs from '@astrojs/solid-js';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'url';
import path from 'path';

// =============================================================================
// UTILITY FUNCTIONS FOR DIAGNOSTICS
// =============================================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Enhanced logging utility for better diagnostics
 */
const createLogger = (prefix) => ({
  info: (msg) => console.log(`🔵 [${prefix}] ${msg}`),
  warn: (msg) => console.warn(`🟡 [${prefix}] ${msg}`),
  error: (msg) => console.error(`🔴 [${prefix}] ${msg}`),
  success: (msg) => console.log(`🟢 [${prefix}] ${msg}`),
  debug: (msg) => process.env.NODE_ENV === 'development' && console.log(`🔍 [${prefix}] ${msg}`)
});

const logger = createLogger('ASTRO-CONFIG');

/**
 * Path resolver with error handling
 */
const createPathResolver = (basePath) => {
  return (relativePath) => {
    try {
      const resolved = path.resolve(basePath, relativePath);
      logger.debug(`Resolved path: ${relativePath} → ${resolved}`);
      return resolved;
    } catch (error) {
      logger.error(`Failed to resolve path: ${relativePath} - ${error.message}`);
      throw error;
    }
  };
};

const resolvePath = createPathResolver(__dirname);

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

const SITE_CONFIG = {
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest',
  output: 'static',
  srcDir: './src',
  publicDir: './public',
  outDir: './dist',
  cacheDir: './.astro'
};

logger.info('Site configuration loaded');
logger.debug(`Site: ${SITE_CONFIG.site}, Base: ${SITE_CONFIG.base}`);

// =============================================================================
// FRAMEWORK INTEGRATION CONFIGURATION
// =============================================================================

/**
 * Framework-specific include patterns with validation
 */
const FRAMEWORK_PATTERNS = {
  react: {
    include: ['**/components/frameworks/react/**/*', '**/pages/**/*.tsx'],
    exclude: ['**/*.test.*', '**/*.spec.*']
  },
  vue: {
    include: [/src\/components\/frameworks\/vue\/.*\.vue$/],
    exclude: [/node_modules/, /\.js$/, /\.ts$/, /\.mjs$/, /\.test\./]
  },
  svelte: {
    include: ['**/components/frameworks/svelte/**/*.svelte'],
    exclude: ['**/*.test.*', '**/*.spec.*']
  },
  solid: {
    include: ['**/components/frameworks/solid/**/*'],
    exclude: ['**/*.test.*', '**/*.spec.*']
  },
  preact: {
    include: ['**/components/frameworks/preact/**/*'],
    exclude: ['**/*.test.*', '**/*.spec.*']
  }
};

/**
 * Create framework integrations with error handling
 */
const createIntegrations = () => {
  const integrations = [];
  
  try {
    // React with enhanced configuration
    integrations.push(react({
      include: FRAMEWORK_PATTERNS.react.include,
      exclude: FRAMEWORK_PATTERNS.react.exclude,
      babel: {
        plugins: [],
        presets: []
      }
    }));
    logger.success('React integration configured');

    // Vue with strict file filtering
    integrations.push(vue({
      include: FRAMEWORK_PATTERNS.vue.include,
      exclude: FRAMEWORK_PATTERNS.vue.exclude,
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    }));
    logger.success('Vue integration configured');

    // Svelte with optimizations
    integrations.push(svelte({
      include: FRAMEWORK_PATTERNS.svelte.include,
      exclude: FRAMEWORK_PATTERNS.svelte.exclude,
      compilerOptions: {
        dev: process.env.NODE_ENV === 'development'
      }
    }));
    logger.success('Svelte integration configured');

    // Solid.js with performance settings
    integrations.push(solidJs({
      include: FRAMEWORK_PATTERNS.solid.include,
      exclude: FRAMEWORK_PATTERNS.solid.exclude
    }));
    logger.success('Solid.js integration configured');

    // Preact with compatibility
    integrations.push(preact({
      include: FRAMEWORK_PATTERNS.preact.include,
      exclude: FRAMEWORK_PATTERNS.preact.exclude,
      compat: true
    }));
    logger.success('Preact integration configured');

    // Styling and content
    integrations.push(
      tailwind({
        applyBaseStyles: false,
        config: {
          path: './tailwind.config.mjs'
        }
      }),
      mdx({
        syntaxHighlight: 'shiki',
        shikiConfig: {
          theme: 'github-dark-dimmed'
        }
      }),
      sitemap({
        canonicalURL: SITE_CONFIG.site,
        i18n: {
          defaultLocale: 'en',
          locales: {
            en: 'en-US'
          }
        }
      })
    );
    logger.success('Core integrations configured');

  } catch (error) {
    logger.error(`Failed to configure integrations: ${error.message}`);
    throw error;
  }

  return integrations;
};

// =============================================================================
// ENHANCED VITE CONFIGURATION
// =============================================================================

/**
 * Dependency optimization with smart chunking
 */
const OPTIMIZED_DEPS = {
  // Core UI frameworks
  react: ['react', 'react-dom', 'react-hook-form'],
  vue: ['vue'],
  svelte: ['svelte'],
  solid: ['solid-js'],
  preact: ['preact'],
  
  // Visualization libraries
  charts: ['chart.js', 'd3'],
  three: ['three'],
  
  // Animation libraries
  animations: ['gsap', 'framer-motion'],
  
  // Form libraries
  forms: ['@hookform/resolvers/zod', 'zod'],
  
  // Development tools
  dev: ['monaco-editor'],
  
  // Icons and UI
  icons: ['lucide-react'],
  
  // Utility libraries
  utils: ['react-hot-toast']
};

/**
 * Create Vite configuration with comprehensive error handling
 */
const createViteConfig = () => {
  logger.info('Creating Vite configuration...');
  
  return {
    // Development server configuration
    server: {
      port: 4321,
      host: true,
      open: false,
      strictPort: false,
      hmr: {
        overlay: true,
        clientPort: undefined
      }
    },

    // Preview server configuration
    preview: {
      port: 4322,
      host: true,
      strictPort: false
    },

    // Dependency optimization
    optimizeDeps: {
      include: Object.values(OPTIMIZED_DEPS).flat(),
      exclude: ['@astrojs/react/client.js'],
      esbuildOptions: {
        target: 'es2020',
        supported: {
          bigint: true
        }
      }
    },

    // Build configuration
    build: {
      target: 'es2020',
      minify: 'esbuild',
      sourcemap: process.env.NODE_ENV === 'development',
      cssCodeSplit: true,
      
      rollupOptions: {
        output: {
          // Smart chunking strategy
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes('node_modules')) {
              // Framework-specific chunks
              if (id.includes('react') || id.includes('jsx-runtime')) return 'react-vendor';
              if (id.includes('vue')) return 'vue-vendor';
              if (id.includes('svelte')) return 'svelte-vendor';
              if (id.includes('solid')) return 'solid-vendor';
              if (id.includes('preact')) return 'preact-vendor';
              
              // Library-specific chunks
              if (id.includes('three')) return 'three-vendor';
              if (id.includes('d3') || id.includes('chart.js')) return 'viz-vendor';
              if (id.includes('gsap') || id.includes('framer')) return 'animation-vendor';
              if (id.includes('monaco')) return 'editor-vendor';
              
              // General vendor chunk for smaller libraries
              return 'vendor';
            }
            
            // Component chunks
            if (id.includes('src/components/frameworks/')) {
              if (id.includes('/react/')) return 'react-components';
              if (id.includes('/vue/')) return 'vue-components';
              if (id.includes('/svelte/')) return 'svelte-components';
              if (id.includes('/solid/')) return 'solid-components';
              if (id.includes('/preact/')) return 'preact-components';
            }
            
            if (id.includes('src/components/showcases/')) return 'showcase-components';
            if (id.includes('src/components/ui/')) return 'ui-components';
            
            // Utility chunks
            if (id.includes('src/lib/')) return 'lib-utils';
            if (id.includes('src/utils/')) return 'utils';
          },
          
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? 
              chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return `assets/js/[name]-[hash].js`;
          },
          
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetInfo.name)) {
              return `assets/images/[name]-[hash].${ext}`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash].${ext}`;
            }
            if (/\.css$/i.test(assetInfo.name)) {
              return `assets/css/[name]-[hash].${ext}`;
            }
            
            return `assets/[ext]/[name]-[hash].${ext}`;
          }
        },
        
        onwarn(warning, warn) {
          // Suppress specific warnings that are safe to ignore
          if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
          if (warning.code === 'CIRCULAR_DEPENDENCY') {
            logger.warn(`Circular dependency: ${warning.message}`);
            return;
          }
          
          // Log other warnings
          logger.warn(`Rollup warning: ${warning.message}`);
          warn(warning);
        }
      },
      
      // Enhanced error reporting
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000
    },

    // Path resolution with aliases
    resolve: {
      alias: {
        '@': resolvePath('src'),
        '@components': resolvePath('src/components'),
        '@lib': resolvePath('src/lib'),
        '@utils': resolvePath('src/utils'),
        '@layouts': resolvePath('src/layouts'),
        '@pages': resolvePath('src/pages'),
        '@styles': resolvePath('src/styles'),
        '@public': resolvePath('public'),
        '@assets': resolvePath('src/assets')
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.mjs', '.json']
    },

    // CSS configuration
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        // SCSS configuration disabled - no SCSS files in project
        // scss: {
        //   additionalData: `@import "@/styles/variables.scss";`
        // }
      }
    },

    // Environment variables
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
    },

    // Plugin configuration with error handling
    plugins: [
      {
        name: 'astro-diagnostics',
        configResolved(config) {
          logger.success('Vite configuration resolved successfully');
          logger.debug(`Build mode: ${config.command}`);
          logger.debug(`Environment: ${config.mode}`);
        },
        buildStart() {
          logger.info('Build started');
        },
        buildEnd(error) {
          if (error) {
            logger.error(`Build failed: ${error.message}`);
          } else {
            logger.success('Build completed successfully');
          }
        },
        handleHotUpdate(ctx) {
          logger.debug(`Hot update: ${ctx.file}`);
        }
      }
    ],

    // Logging configuration
    logLevel: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
    clearScreen: false,

    // Worker configuration
    worker: {
      format: 'es'
    }
  };
};

// =============================================================================
// MAIN CONFIGURATION EXPORT
// =============================================================================

logger.info('Initializing Astro configuration...');

export default defineConfig({
  ...SITE_CONFIG,
  
  integrations: createIntegrations(),
  
  vite: createViteConfig(),
  
  // TypeScript configuration
  typescript: {
    config: './tsconfig.json',
    strict: true
  },
  
  // Markdown configuration
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
      transformers: []
    },
    remarkPlugins: [],
    rehypePlugins: []
  },
  
  // Image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com'
      }
    ]
  },
  
  // Security configuration
  security: {
    checkOrigin: true
  },
  
  // Experimental features with careful enablement
  experimental: {
    contentCollectionCache: true
  },
  
  // Development configuration
  devToolbar: {
    enabled: process.env.NODE_ENV === 'development'
  }
});

logger.success('Astro configuration initialized successfully');
