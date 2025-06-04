# ApexBuild Construction Website

This repository contains a Hugo site styled with Tailwind CSS and TypeScript.

## Building Locally

1. Install Node dependencies:

   ```bash
   npm install
   ```

2. Build the CSS and JavaScript assets:

   ```bash
   npm run build
   ```

3. Generate the static site using Hugo:

   ```bash
   hugo --source apexbuild --destination public
   ```

The compiled site will be written to the `public/` directory.

## Netlify Deployment

Netlify runs the command defined in `netlify.toml`:

```toml
[build]
  command = "npm run build && hugo --source apexbuild --destination ../public"
  publish = "public"
```

This produces the final site in `public/` which Netlify serves.
