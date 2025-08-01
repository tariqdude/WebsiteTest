# Project: WebsiteTest - Gemini Agent Blueprint

This document outlines the plan and execution strategy for rebuilding the `WebsiteTest` project. The goal is to create a professional, modular, and well-organized Astro website, showcasing Astro's capabilities, with a focus on clean design and efficient development.

## 1. Project Structure (Proposed)

The `src` directory will be reorganized to promote modularity and maintainability.

```
/src
├── components/         # Reusable UI components
│   ├── common/         # Generic, widely used components (e.g., Button, Icon)
│   ├── layout/         # Components specific to page layouts (e.g., Header, Footer, Navbar)
│   └── sections/       # Components for specific page sections (e.g., Hero, Features, ContactForm)
├── layouts/            # Astro layouts (e.g., BaseLayout.astro)
├── pages/              # Astro pages (e.g., index.astro, about.astro, contact.astro)
├── assets/             # Static assets (images, fonts, icons)
│   ├── images/
│   ├── fonts/
│   └── icons/
├── styles/             # Global styles, utility classes, Tailwind config extensions
│   ├── base.css        # Base styles, resets
│   ├── components.css  # Component-specific styles (if not in component files)
│   └── utilities.css   # Utility classes
└── config/             # Configuration files (e.g., navigation data, site metadata)
    └── site.ts         # Site-wide configuration
```

## 2. Design Principles

The website will adhere to the following design principles:

- **Modern & Clean:** A minimalist aesthetic with clear typography, ample whitespace, and a focus on readability.
- **Responsive:** Fully adaptable and optimized for various screen sizes (mobile, tablet, desktop) using a mobile-first approach.
- **Performance-focused:** Leveraging Astro's static site generation and partial hydration for fast loading times and optimal user experience.
- **Subtle Interactivity:** Incorporating subtle animations, hover effects, or interactive elements where appropriate, without compromising performance.
- **Showcase Astro:** Demonstrating key Astro features such as islands architecture, seamless component integration (React), and efficient asset handling.

## 3. Color Palette (To Be Defined)

- Primary: `#3366FF` (A vibrant blue for accents and calls to action)
- Secondary: `#66CC99` (A complementary green for secondary elements)
- Accent: `#FFCC00` (A warm yellow for highlights)
- Text: `#333333` (Dark grey for body text)
- Headings: `#1A1A1A` (Very dark grey for headings)
- Background: `#F8F8F8` (Light grey for main background)
- Surface: `#FFFFFF` (Pure white for cards and content areas)

## 4. Typography (To Be Defined)

- **Headings:** A clean, modern sans-serif font (e.g., Montserrat, Poppins).
- **Body Text:** A highly readable sans-serif font (e.g., Open Sans, Lato).
- **Font Sizes:** Scaled appropriately for responsiveness.

## 5. Gemini's Internal To-Do List

This section outlines the detailed steps for implementation.

### Design To-Dos (Pre-Code)

- [ ] **Define Specific Page Layouts:**
  - **Homepage (`index.astro`):** Hero section, Features/Services overview, Call to Action, Footer.
  - **About Page (`about.astro`):** Company story, Team section, Mission/Vision.
  - **Contact Page (`contact.astro`):** Contact form, Map (optional), Contact information.
- [ ] **Sketch Component Visuals:**
  - Navbar (logo, navigation links)
  - Button styles (primary, secondary, outline)
  - Card component (image, title, description, link)
  - Input fields for contact form
- [ ] **Plan Subtle Animations/Interactions:**
  - Hover effects for buttons and links.
  - Fade-in or slide-up animations for sections on scroll.

### Code To-Dos (Implementation)

- **Setup & Configuration:**
  - [ ] Clean up existing `src` directory content (pages, components, layouts).
  - [ ] Update `astro.config.mjs` for GitHub Pages deployment (if not already correct).
  - [ ] Ensure `tailwind.config.mjs` is properly configured with the new color palette and typography.
  - [ ] Create `tsconfig.json` for strict TypeScript checking.
- **Layouts:**
  - [ ] Create `src/layouts/BaseLayout.astro`:
    - Includes `<html>`, `<head>`, `<body>` structure.
    - Integrates SEO meta tags (title, description, favicon).
    - Includes `Header` and `Footer` components.
    - Uses Astro slots for page content.
- **Components (`src/components/`):**
  - **`layout/`:**
    - [ ] `Header.astro`: Contains `Navbar.astro`.
    - [ ] `Navbar.astro`: Responsive navigation with logo and links from `config/site.ts`.
    - [ ] `Footer.astro`: Copyright, social links, brief site navigation.
  - **`common/`:**
    - [ ] `Button.astro`: Reusable button component with different styles.
    - [ ] `Icon.astro`: Component for SVG icons (e.g., social media icons).
  - **`sections/`:**
    - [ ] `Hero.astro`: Large introductory section with title, subtitle, and call to action.
    - [ ] `Features.astro`: Section to highlight key features/services using `Card.astro`.
    - [ ] `ContactForm.astro`: A simple contact form (can be static or placeholder for future integration).
- **Pages (`src/pages/`):**
  - [ ] `index.astro`: Uses `BaseLayout` and integrates `Hero`, `Features`, and `CallToAction` sections.
  - [ ] `about.astro`: Uses `BaseLayout` and includes content about the project/company.
  - [ ] `contact.astro`: Uses `BaseLayout` and includes `ContactForm` and contact information.
- **Assets (`src/assets/`):**
  - [ ] Add placeholder images for `Hero` and `Features` sections.
  - [ ] Add a custom favicon.
- **Styles (`src/styles/`):**
  - [ ] Create `base.css` for global styles and Tailwind directives.
- **Configuration (`src/config/`):**
  - [ ] `site.ts`: Define site metadata (title, description), navigation links, and social media links.
- **Verification:**
  - [ ] Run `npm install` to ensure all dependencies are up to date.
  - [ ] Run `npm run build` to check for build errors.
  - [ ] Verify all assets are correctly linked in the built output.
  - [ ] Ensure `.nojekyll` is present in the `dist` directory after build.
  - [ ] Test responsiveness across different screen sizes (manual check).

## 6. GitHub Pages Deployment

- The `astro.config.mjs` will be configured with `site` and `base` properties for GitHub Pages.
- A `.nojekyll` file will be ensured in the `dist` directory to prevent Jekyll processing.
- Deployment will involve committing the `dist` folder and pushing to the `main` branch, with GitHub Pages configured to serve from the `dist` folder.
