# Hugo Tailwind Site

## Deployment

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build CSS and site:
   ```bash
   npm run build:css && hugo --gc --minify
   ```
3. Push to `main`. GitHub Actions will deploy to `gh-pages`.

All image paths under `assets/` are placeholders. Add your own images as needed.
