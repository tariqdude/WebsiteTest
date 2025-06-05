# WebsiteTest Build Setup

This project now uses **webpack** and **PostCSS** to build assets.

## Getting Started

Install dependencies once:

```bash
npm install
```

## Build Commands

- `npm run build` – Runs the JavaScript bundler and PostCSS pipeline. Output files are written to the `dist/` directory:
  - `dist/bundle.js` – Minified JavaScript
  - `dist/style.css` – Autoprefixed and minified CSS

You can also run the individual tasks:

- `npm run build:js`
- `npm run build:css`

Source files live in `src/`.
