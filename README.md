# Allied Mechanical Website

This repository contains a minimal scaffold implementing the Ω⁺⁺ specification for Allied Mechanical.

## Getting Started

1. Clone the repository.
2. Run `npx serve` (or `python -m http.server 8000`) and open `http://localhost:8000`.
3. Files are located in `assets/` for CSS and JS.

## Updating Placeholders

Search for `placeholder` or `data:image/svg+xml` strings in the code to replace with real content.

## PWA Versioning

Increment `CACHE_VERSION` in `sw.js` and update version query strings in HTML when assets change.

## Adding Locales

Create `locales/[lang].js` and update `index.html` hreflang and JSON-LD.

## Cookie Consent

Placeholder code for a cookie banner is included. Update logic in `assets/js/analytics/` if needed.
