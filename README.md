# Allied Construction Website

This project showcases a responsive multi-page website for a fictional construction company. The site is built with vanilla HTML, CSS and JavaScript and includes the following features:

- Accessible markup with skip navigation links and ARIA labels
- Dark mode with persistent theme preference
- Progressive Web App support with a service worker and manifest
- Contact form validation and submission via Formspree

All images in the demo use remote placeholders so the repository contains only code.

## Running Locally

Open `index.html` in a browser to view the site. For a simple HTTP server you can run:

```bash
npx serve .
```

## Building / Deployment

Run `npm run build` to generate minified assets (`styles.min.css` and `scripts.min.js`). Reference these files in `index.html` when deploying to production.

The project uses a minimal `package.json` so `npm test` returns success:

```bash
npm test
```
