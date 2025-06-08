# Construction Pro Site

This project scaffolds a high-performance, modular construction business website. It uses Eleventy for templating and SCSS for styling. All images and media are represented with placeholders so the repository stays lightweight.

## Getting Started

1. Install dependencies (optional for SCSS compilation):
   ```bash
   npm install
   ```
2. Build CSS:
   ```bash
   npx sass src/scss/main.scss src/assets/css/main.css --no-source-map --style=compressed
   ```
3. Serve with Eleventy (optional):
   ```bash
   npx @11ty/eleventy --serve
   ```

## Deployment

The `src` directory can be deployed directly to GitHub Pages or any static host.
