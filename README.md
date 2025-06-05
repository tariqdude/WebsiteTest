# Allied Mechanical Landing Page

This repository contains a simple GitHub Pages site for Allied Mechanical.

## Deployment
1. Clone this repository.
2. Push changes to the `main` branch — GitHub Pages serves the site automatically.

## Updating Assets and Services
- Add your images to `assets/img` using the filenames `hero-400.avif`, `hero-800.avif`, `hero-1600.avif`, `hero-1200x630.avif`, `logo-192.png`, and `logo-512.png`. The HTML already references these paths.
- Place `Inter.var.woff2` inside the `fonts` directory so the `@font-face` rule in `assets/css/main.css` can load it.
- Edit `services.html` to add or modify service offerings.


Analytics are collected locally using `assets/js/analytics.js` and sent via `navigator.sendBeacon` to `/analytics`. Disable this by removing the import in `index.html`.

When browsers support installation, a small banner appears. Tap "Install App" to add the PWA to your device.

### UI Controls
- The menu button collapses the navigation on small screens.
- "Toggle dark mode" switches between light and dark themes.
- "A+" increases text size for better readability and remembers your preference.
- A back-to-top button appears after scrolling down a page.

## Service Worker for Staging
To disable offline caching during staging, delete `sw.js` before pushing or unregister the service worker in the browser dev tools.
