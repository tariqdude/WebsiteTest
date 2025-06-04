# Example Business Website

This repo contains a static single-page site ready for GitHub Pages deployment.
The design uses glassmorphic cards, animated gradient text, diagonal section dividers and a Lottie-powered hero. Feature cards tilt slightly with mouse movement.

## Quick Start

```bash
npm install -g http-server # optional for local preview
http-server -c-1 .
```

Visit `http://localhost:8080` and open devtools Lighthouse to verify scores.

## PWA Install

The site registers a Service Worker and includes a `manifest.json` so users can install it to their homescreen.

## Publish to GitHub Pages

1. Push changes to `main`.
2. GitHub Action will run checks and deploy the contents of the repo to the `gh-pages` branch.

## Testing

Elements include `data-test` attributes so you can hook up Playwright.

```js
// playwright.config.js
module.exports = { use: { baseURL: 'http://localhost:8080' } };
```
