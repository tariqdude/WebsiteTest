# Allied Mechanical Website

This repository contains a Hugo-based website for the Allied Mechanical construction business. Tailwind CSS is processed via Hugo Pipes and esbuild bundles JavaScript assets.

## Development

1. Install **Hugo Extended** and **Node.js**.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run build:css && npm run build:js && hugo server -D
   ```

## Deployment

The site is deployed with GitHub Actions to the `gh-pages` branch.
