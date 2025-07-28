# Project Organization

## Core Files

### Deployment & Build
- `deployment-manager.mjs` - Unified deployment management system
- `astro.config.mjs` - Main Astro configuration  
- `package.json` - Dependencies and npm scripts
- `.github/workflows/deploy.yml` - GitHub Actions deployment

### Key Scripts (npm run ...)
- `deploy:health` - Quick health check
- `deploy:validate` - Full validation with build test
- `deploy:fix` - Auto-fix issues  
- `deploy:prep` - Prepare for deployment
- `build:gh-pages` - Build for GitHub Pages
- `diagnostics` - Verbose health diagnostics

## Multi-Framework Architecture

### Framework Components (`src/components/frameworks/`)
- `react/` - React components with TypeScript
- `vue/` - Vue 3 Composition API components  
- `svelte/` - Svelte components
- `solid/` - Solid.js components
- `preact/` - Preact lightweight components

### Advanced Features (`src/components/showcases/`)
- `Advanced3DScene.jsx` - Three.js 3D graphics
- `CodeEditorShowcase.jsx` - Monaco code editor
- `GSAPAnimationShowcase.jsx` - GSAP animations
- `InteractiveTerminal.jsx` - Terminal simulation

## Deployment Workflow

1. **Health Check**: `npm run deploy:health`
2. **Fix Issues**: `npm run deploy:fix` 
3. **Build Test**: `npm run deploy:validate`
4. **Deploy**: Push to main branch (auto-deploys via GitHub Actions)

## Performance Optimization

- Islands architecture with selective hydration
- Framework isolation with include patterns
- Smart dependency chunking
- Optimized build for GitHub Pages
