# ApexBuild Construction Website

This project is a design prototype for a construction company website. It demonstrates a modern, responsive layout with interactive elements.

## Features

- **Responsive layout** that adapts to desktops and mobile devices
- **Dark mode** toggle with the preference saved in `localStorage`
- Animated sections that reveal on scroll
- Headline in the hero section typed out from rotating phrases
- Stats counters and an image carousel powered by the View Transitions API
- Cookie consent banner and back-to-top button

## Getting Started

Simply open `index.html` in a modern web browser. For production, run `npm run build` to generate `style.min.css` and `script.min.js` and ensure the HTML files reference these minified assets. For live reloading during development you can use a local development server such as `npx serve` or `python3 -m http.server`.

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

### Using Variants

You can also switch between predefined color schemes by appending a
`variant` query parameter to the URL, e.g. `index.html?variant=green` or
`?variant=red`. The chosen variant is stored in `localStorage` so it
persists on subsequent visits. Available variants correspond to the
`data-variant` rules in `style.css` and include:

- `green` – emerald accents
- `red` – crimson accents
- `purple` – violet accents

## Adjusting Scripts

`script.js` contains all the interactive behavior. Key sections include:

- Initializing the case-study carousel
- Setting up the typed hero text strings via the `data-texts` attribute on `#typedHero`
- Handling the dark mode toggle and sticky header

Edit these portions to customize animations or disable features as needed.

## Development Tips

- Ensure you have an internet connection so the CDN links for fonts and third-party libraries load correctly.
- When editing JavaScript, check the browser console for any errors.
- Use semantic HTML and keep accessibility in mind when extending the markup.

## Building for Production

Run the following command to produce minified assets:

```bash
npm run build
```

This will create `style.min.css` and `script.min.js` which are referenced by the HTML files when deploying the site.

## Contact Form Configuration

The contact form uses [Formspree](https://formspree.io/) to process submissions.
To enable it:

1. Create an account on Formspree and set up a new form.
2. Copy the endpoint URL provided by Formspree (e.g. `https://formspree.io/f/your-form-id`).
3. Replace the placeholder URL in `index.html` within the `action` attribute of the contact form.
4. The script automatically sends form data to this URL using AJAX, so no server setup is required.

## License

This project is licensed under the [MIT License](LICENSE).

## Running Tests

This project uses [html-validate](https://html-validate.org/) for basic linting of the main HTML page. After cloning the repository, install dependencies and run the test script:

```bash
npm install
npm test
```

The provided configuration disables rules so the test will simply validate that `index.html` parses correctly.
