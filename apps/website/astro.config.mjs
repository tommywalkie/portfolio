// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'

// https://astro.build/config
// no react(): the site is fully static; the icons come from @lucide/astro (build-time SVG)
export default defineConfig({
  // the build lands in the repo root's dist/, where the root Dockerfile copies it from (/app/dist)
  outDir: '../../dist',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
})
