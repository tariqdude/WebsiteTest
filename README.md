# Company Website

This is a modern, responsive, and deployable company website built with Astro, React, and Tailwind CSS. It's designed to be a robust foundation for any business looking for an elite online presence in 2025 and beyond.

## Features

-   **Elite Template (2025+ Ready):** A clean, modern design aesthetic with a focus on user experience and performance.
-   **Mobile-Ready & Responsive:** Built with Tailwind CSS to ensure a seamless experience across all devices, from desktops to mobile phones.
-   **Organized Project Structure:** Clear and logical file organization for easy development and maintenance.
-   **Full-Fledged Features:** All core features are either fully implemented or clearly described, with no placeholder code.
-   **GitHub Pages Deployment:** Pre-configured for easy deployment to GitHub Pages.

## Project Structure

```
.github/
├── workflows/
│   └── deploy.yml (for GitHub Pages deployment)
public/
├── favicon.svg
src/
├── components/ (for reusable React/Astro components)
├── layouts/
│   └── BaseLayout.astro (main layout with header, navigation, and footer)
├── pages/
│   ├── index.astro (Home page)
│   ├── about.astro (About Us page)
│   ├── services.astro (Our Services page)
│   └── contact.astro (Contact Us page)
└── styles/
    └── global.css (Tailwind CSS imports)
astro.config.mjs (Astro configuration, including GitHub Pages settings)
package.json (Project dependencies and scripts)
tailwind.config.mjs (Tailwind CSS configuration)
tsconfig.json (TypeScript configuration)
```

## Getting Started

### Prerequisites

Make sure you have Node.js (v18 or higher) and npm installed on your system.

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/<YOUR_GITHUB_USERNAME>/websitetest.git
    cd websitetest
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

### Running Locally

To start the development server:

```bash
npm run dev
```

This will typically start the server at `http://localhost:4321`.

### Building for Production

To build the project for production:

```bash
npm run build
```

The optimized static assets will be generated in the `dist/` directory.

## Deployment to GitHub Pages

This project is configured for deployment to GitHub Pages. Follow these steps:

1.  **Create a GitHub Repository:** Create a new public repository on GitHub named `websitetest` (or whatever you set as `base` in `astro.config.mjs`).

2.  **Update `astro.config.mjs`:**

    Open `astro.config.mjs` and update the `site` and `base` properties:

    ```javascript
    export default defineConfig({
      site: 'https://<YOUR_GITHUB_USERNAME>.github.io', // Replace with your GitHub Pages URL
      base: '/websitetest', // Replace with your repository name
      // ... other configurations
    });
    ```

    **Important:** Replace `<YOUR_GITHUB_USERNAME>` with your actual GitHub username.

3.  **Push to GitHub:**

    ```bash
    git add .
    git commit -m "Initial commit: Set up Astro project"
    git branch -M main
    git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/websitetest.git
    git push -u origin main
    ```

4.  **GitHub Actions Workflow:**

    This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys your Astro site to GitHub Pages whenever you push to the `main` branch.

    The workflow will:
    -   Install dependencies.
    -   Build the Astro project.
    -   Deploy the `dist` directory to the `gh-pages` branch.

    Ensure that GitHub Pages is configured to deploy from the `gh-pages` branch in your repository settings.

## Customization

-   **Content:** Modify the `.astro` files in `src/pages/` and `src/components/` to update content.
-   **Styling:** Customize the `tailwind.config.mjs` file and `src/styles/global.css` for global styles. Use Tailwind CSS utility classes directly in your `.astro` components for component-specific styling.
-   **Components:** Create new `.astro` or `.jsx` (React) components in `src/components/` for reusable UI elements.
-   **Navigation:** Update the navigation links in `src/layouts/BaseLayout.astro`.

## Contributing

Feel free to fork this repository and contribute! Pull requests are welcome.

## License

This project is open source and available under the [MIT License](LICENSE).