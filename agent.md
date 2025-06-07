    Act as an elite, award-winning full-stack web designer and frontend engineer tasked with creating a cutting-edge, lightning-fast, visually stunning static business landing page.
    Requirements: No backend — fully deployable on GitHub Pages, optimized for performance, accessibility, SEO, and user engagement. Your deliverable must be fully production-ready with pixel-perfect polish, minimal load times, and an immaculate UI/UX experience.

🛠️ Core Requirements
🎨 Design System

    Grid: Strict 8pt or 4pt baseline grid for impeccable rhythm.

    Typography: Fluid typography using clamp() — accessible sizes, clear hierarchy.

    Colors: Tailored brand color palette with primary, secondary, and neutral shades. Support dark mode with CSS variables and prefers-color-scheme media query.

    Icons: Custom inline SVG icon system — optimized for retina screens.

    Spacing: Ample breathing room — 24px+ margins and padding.

    Interactivity: Subtle micro-animations (hover effects, smooth transitions) with a fallback for prefers-reduced-motion.

🏆 Page Structure

    Hero Section

        Full viewport height (100vh).

        Dynamic background: gradient animation, video (muted, looped), or layered parallax image with srcset (WebP/AVIF fallbacks).

        Large H1 headline with a bold, succinct value proposition.

        Call-to-action button (CTA) with hover scaling + glowing pulse animation.

    About/Feature Overview

        Responsive 3- or 4-column grid.

        Cards with SVG icons, headings, 2–3 lines of text.

        Animate elements on scroll via Intersection Observer API (no heavy frameworks).

    Social Proof

        Logo grid — SVG logos for crispness.

        Optional: Animated client testimonials with pure CSS snap-scroll or touch-scroll support (no third-party sliders).

    Product/Service Highlights

        Feature callouts in a split layout (image + text).

        Lightweight, kinetic animations for engagement without overloading DOM.

    Pricing/Plans

        Responsive cards for pricing tiers — clearly highlight “Best Value” plan.

        Monthly/Yearly toggle with animated switch.

        Display price comparison with value points.

    FAQ Section

        Accordion-style collapsible Q&A.

        Keyboard-accessible, ARIA-compliant.

        Animate height expansion smoothly.

    Lead Capture

        Contact form (Formspree or static endpoint-ready).

        Minimalist design with floating labels.

        Include newsletter signup with reCAPTCHA v3 placeholder.

    Map + Footer

        Responsive embedded map (OpenStreetMap iframe preferred).

        Final CTA with a signup button or contact action.

        Footer: social icons (SVG), legal links, minimal dark background.

    Progressive Web App (PWA) Setup

        manifest.json with theme colors, name, icons.

        service-worker.js (Workbox) to pre-cache static assets.

        Offline fallback page.

⚡ Performance & SEO

    Target Lighthouse 95+ score on all categories.

    Lazy-load all non-critical assets (images, videos, scripts).

    Minify and purge unused CSS with Tailwind JIT compilation.

    Set up full meta-tags:

        meta description

        OpenGraph (og:title, og:description, og:image)

        Twitter Cards

        Favicon & manifest for icons

    JSON-LD structured data (application/ld+json).

    Canonical links for SEO best practices.

📁 File Structure

/ (repo root)
├─ index.html                # Main page
├─ /assets
│   ├─ /css
│   │   └─ main.css           # TailwindCSS compiled and purged
│   ├─ /js
│   │   └─ main.js            # Vanilla JS with modules and IIFE
│   ├─ /img                   # Optimized AVIF/WebP assets
│   ├─ /icons                 # Inline SVG icons
├─ manifest.json              # PWA config
├─ sw.js                       # Service Worker (offline support)
├─ README.md                   # Setup + Deployment Guide
├─ .github
│   └─ workflows
│       └─ deploy.yml          # GH Actions for CI/CD

    index.html should use semantic tags: <header>, <main>, <section>, <aside>, <footer>.

    Structure SCSS/Tailwind classes logically: Utility-first, BEM naming where custom classes are required.

🧩 GitHub Pages Deploy

    No build step required — fully static site.

    Include a README.md with:

        Instructions to fork, clone, and deploy.

        Optional: Provide a GitHub Actions CI workflow (deploy.yml) for auto-publishing to gh-pages branch.

🚀 Stretch Goals

    🎥 Lightweight Lottie animations (local JSON, no CDN bloat) for key features.

    🌀 Add subtle parallax on scroll with Motion One or native CSS scroll-timeline.

    🕶️ Dark Mode Toggle with smooth transitions.

    🛡️ CSP meta tag for enhanced security.

📈 Deliverables

    Fully coded landing page — 100% GitHub Pages ready.

    PWA manifest and Service Worker for offline support.

    SEO Meta Optimization — JSON-LD, OpenGraph, Twitter Card setup.

    Performance badge from Lighthouse.

    Accessibility compliance — pass Axe or WAVE audit.

    Full documentation in README.md with preview screenshots and performance report.

    Deploy Instructions — simple enough for non-technical users.
