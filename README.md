# Acme Corp Landing Page

This repository contains a simple static website demonstrating a basic Progressive Web App (PWA) setup for a fictional business. The site is built with plain HTML, CSS and JavaScript.

## Serving the site locally

Because service workers require a server context, open the project in a local HTTP server instead of just double-clicking the files. From the project directory run one of the following commands and then visit `http://localhost:8000` in your browser.

### Using Python
```sh
python3 -m http.server 8000
```

### Using Node.js (http-server)
```sh
npx http-server -p 8000
```

## PWA features

- **Web App Manifest** (`manifest.json`) defines the name, icons, start URL and theme color so the site can be installed on a home screen.
- **Service Worker** (`sw.js`) is registered in `scripts.js` to enable basic offline support.
- **Theme color** meta tag customizes the browser UI when the site is installed or opened on mobile.

These features illustrate how to turn a regular static page into a lightweight PWA.
