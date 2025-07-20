// A minimal valid Tailwind CSS configuration
import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: ['src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Add your customizations here
    },
  },
  plugins: [],
});
