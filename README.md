# ApexBuild Construction Website

This project is a design prototype for a construction company website. It demonstrates a modern, responsive layout with interactive elements.

## Features

- **Responsive layout** that adapts to desktops and mobile devices
- **Dark mode** toggle with the preference saved in `localStorage`
- Animated sections that reveal on scroll
- Stats counters and image sliders powered by Swiper
- Cookie consent banner and back-to-top button
- Dedicated 404 page served for unknown routes

## Getting Started

Simply open `index.html` in a modern web browser. No build step is required. For live reloading you can use a local development server such as `npx serve` or `python3 -m http.server`.

## Changing the Color Scheme

Global colors are defined using CSS variables in `style.css` under the `:root` selector:

```css
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --bg-light: #fefefe;
    --bg-dark: #1e1e1e;
    --text-color: #333;
    --text-light-color: #e0e0e0;
}
```

Modify these variables to adjust the site's palette. Additional rules under `body.dark-mode` control the dark theme colors.

## Adjusting Scripts

`script.js` contains all the interactive behavior. Key sections include:

- Initializing the Swiper slider
- Setting up the typed hero text strings
- Handling the dark mode toggle and sticky header

Edit these portions to customize animations or disable features as needed.

## Development Tips

- Ensure you have an internet connection so the CDN links for fonts and third-party libraries load correctly.
- When editing JavaScript, check the browser console for any errors.
- Use semantic HTML and keep accessibility in mind when extending the markup.

## Contact Form Configuration

The contact form uses [Formspree](https://formspree.io/) to process submissions.
To enable it:

1. Create an account on Formspree and set up a new form.
2. Copy the endpoint URL provided by Formspree (e.g. `https://formspree.io/f/your-form-id`).
3. Replace the placeholder URL in `index.html` within the `action` attribute of the contact form.
4. The script automatically sends form data to this URL using AJAX, so no server setup is required.
