# Acme Corp Landing Page

This repository contains a simple static website demonstrating a basic Progressive Web App (PWA) setup for a fictional business. The site is built with plain HTML, CSS and JavaScript. A sample `styles.scss` file is included if you wish to use a SCSS workflow.

## Site Highlights

- Responsive hero section with smooth animations
- Dedicated pages for features, services, team, testimonials and contact
- Newsletter signup form powered by JavaScript
- Dark mode toggle with preference stored locally

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

### Building CSS from SCSS
If you prefer using SCSS, run the following command and then optionally autoprefix the result:

```sh
sass styles.scss styles.css --no-source-map
npx autoprefixer styles.css -o styles.css
```

## PWA features


- **Theme color** meta tag customizes the browser UI when the site is installed or opened on mobile.

These features illustrate how to turn a regular static page into a lightweight PWA.
