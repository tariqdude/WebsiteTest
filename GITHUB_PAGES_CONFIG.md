# Astro GitHub Pages Configuration

## Overview
This repository is configured for automatic deployment to GitHub Pages using GitHub Actions.

## Configuration Files

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- Automatically builds and deploys the site on every push to main
- Uses the official Astro GitHub Action for optimal performance
- Supports Node.js 20 with npm caching

### Astro Configuration (`astro.config.mjs`)
```javascript
export default defineConfig({
  site: 'https://tariqdude.github.io',
  base: '/WebsiteTest',
  output: 'static',
  integrations: [react(), vue(), tailwind()]
});
```

### Key Settings
- **Site URL**: `https://tariqdude.github.io`
- **Base Path**: `/WebsiteTest`
- **Output**: Static site generation
- **Build Command**: `npm run build`

## Asset Path Configuration
All static assets (favicon, fonts, images) use the base path `/WebsiteTest/` to ensure proper loading on GitHub Pages.

## Performance Optimizations
- Preloaded critical fonts
- Optimized images and CSS
- View transitions for smooth navigation
- Islands architecture for minimal JavaScript

## Local Development
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

## Deployment
Deployment is automatic via GitHub Actions when pushing to the main branch.

## Troubleshooting
- Ensure all asset paths include the base path `/WebsiteTest/`
- Check that the repository name matches the base configuration
- Verify GitHub Pages is enabled in repository settings
