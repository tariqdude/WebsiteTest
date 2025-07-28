# Astro Multi-Framework Showcase - AI Coding Instructions

## Architecture Overview

This is an **Astro 5.x islands architecture showcase** featuring 6 frameworks
(React, Vue, Svelte, Solid.js, Preact, TypeScript) with advanced performance
optimization. The codebase demonstrates modern web development patterns with
selective hydration and framework isolation.

### Key Architectural Patterns

- **Framework Isolation**: Each framework lives in
  `src/components/frameworks/{framework}/` with strict include patterns in
  `astro.config.mjs`
- **Islands Architecture**: Components use specific hydration directives
  (`client:load`, `client:visible`, `client:idle`)
- **Content Collections**: Type-safe content in `src/content/` with Zod schemas
  (blog, projects, team)
- **Smart Dependencies**: Performance-optimized chunking in `astro.config.mjs`
  DEPS object

## Critical Development Commands

```bash
# Essential workflows
npm run diagnostics          # Run project health checks (always run first)
npm run build:gh-pages      # GitHub Pages optimized build
npm run dev:verbose         # Development with detailed logging
npm run build:analyze       # Build with diagnostics pre-check

# Framework-specific testing
npm run check               # TypeScript + Astro validation
npm run lint               # Full project linting
```

## Multi-Framework Integration Rules

### Component Organization

- **React**: Complex state management, forms, data visualization
  (`src/components/frameworks/react/`)
- **Vue**: Reactive UI components (`src/components/frameworks/vue/`)
- **Svelte**: Animations and motion (`src/components/frameworks/svelte/`)
- **Solid.js**: Fine-grained reactivity (`src/components/frameworks/solid/`)
- **Preact**: Lightweight alternatives (`src/components/frameworks/preact/`)

### Framework-Specific Hydration

```astro
<!-- Performance-critical components -->
<InteractiveCounter client:load />
<!-- React: Immediate interactivity -->
<DataVisualizationDashboard client:visible />
<!-- React: Load when in viewport -->
<PreactMiniDashboard client:idle />
<!-- Preact: Load when browser idle -->
<ColorPalette client:visible />
<!-- Vue: Reactive UI -->
<SvelteSkillsDashboard client:visible />
<!-- Svelte: Smooth animations -->
```

## Content & Type Safety Patterns

### Content Collections (src/content/config.ts)

```typescript
// All content is type-safe with Zod validation
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    featured: z.boolean().default(false),
  }),
});
```

### Type System (src/lib/types/index.ts)

- **Organized by usage**: Base types → Content → UI → Forms → Performance
- **Framework Integration**: Separate types for each framework's props
- **Utility Types**: Advanced TypeScript patterns for multi-framework support

## Performance & Build Optimization

### Critical Build Settings (astro.config.mjs)

```javascript
// Performance-optimized dependency grouping
const DEPS = {
  critical: ['react', 'react-dom', 'vue', 'svelte'],  // Framework cores
  features: ['chart.js', 'd3', 'three', 'gsap'],      // Feature libraries
  dev: isDev ? ['monaco-editor'] : []                 // Development only
};

// Optimized chunk splitting for large dependencies
manualChunks(id) {
  // Monaco Editor split into multiple chunks
  if (id.includes('monaco-editor')) {
    if (id.includes('monaco-editor/esm/vs/editor/editor.api')) return 'monaco-core';
    if (id.includes('monaco-editor/esm/vs/language')) return 'monaco-languages';
    if (id.includes('monaco-editor/esm/vs/basic-languages')) return 'monaco-basic-lang';
    return 'monaco-editor';
  }
  // Separate Chart.js and D3 for better caching
  if (id.includes('chart.js')) return 'chartjs';
  if (id.includes('d3')) return 'd3-charts';
}
```

### React Import Optimization

- **Never import default React**: Use
  `import { useState, useEffect } from 'react'`
- **Avoid**: `import React, { useState } from 'react'` (causes build warnings)
- **Pattern**: Only import specific hooks/functions needed

### Dynamic Import Strategy

```javascript
// Monaco Editor - use dynamic imports for code splitting
const initMonaco = async () => {
  const monaco = await import('monaco-editor');
  // Initialize editor
};
```

### Vue Integration Fix

- **Critical**: Vue plugin excludes server files to prevent build failures
- **Pattern**: `vue({ include: ['**/vue/**'], exclude: ['**/server.js'] })`

## Debugging & Diagnostics

### Project Health Monitoring

- Run `npm run diagnostics` before any major changes
- File tracks: dependency analysis, framework conflicts, build performance
- Located: `run-diagnostics.mjs` (simplified from complex dependency analysis)

### Common Issues

1. **Vue Build Failures**: Server.js conflicts → Use exclude patterns in
   astro.config.mjs
2. **Framework Conflicts**: Multiple JSX renderers → Check include patterns
3. **TypeScript Errors**: Import paths → Use `src/lib/` not `src/utils/`

## GitHub Pages Deployment

### Deployment Commands

```bash
npm run build:gh-pages      # Optimized GitHub Pages build
npm run deploy:prep         # Pre-deployment preparation
```

### GitHub Actions (.github/workflows/deploy.yml)

- **Production Environment**: Explicit NODE_ENV=production
- **Cache Strategy**: npm cache clearing to prevent conflicts
- **Build Command**: Uses `build:gh-pages` script for reliability

## Framework-Specific Development Notes

### React Components

- **Location**: `src/components/frameworks/react/`
- **Patterns**: React Hook Form + Zod validation, Chart.js integration
- **Examples**: `AdvancedForm.tsx`, `DataVisualizationDashboard.jsx`

### Vue Components

- **Location**: `src/components/frameworks/vue/`
- **Patterns**: Reactive properties, Composition API
- **Build Gotcha**: Must exclude server files in astro.config.mjs

### Advanced Features

- **3D Graphics**: Three.js in `Advanced3DScene.jsx`
- **Code Editor**: Monaco Editor in `CodeEditorShowcase.jsx`
- **Animations**: GSAP in `GSAPAnimationShowcase.jsx`
- **Terminal**: Full terminal simulation in `InteractiveTerminal.jsx`

## File Structure Conventions

```
src/
├── components/
│   ├── frameworks/{react,vue,svelte,solid,preact}/  # Framework isolation
│   ├── showcases/                                   # Advanced feature demos
│   ├── ui/                                         # Shared UI components
│   └── layout/                                     # Layout components
├── content/                                        # Type-safe content collections
├── lib/                                           # Utilities and types
└── styles/                                        # Global styles and Tailwind
```

Always check `src/lib/types/index.ts` for comprehensive type definitions and
`astro.config.mjs` for framework configuration patterns.
