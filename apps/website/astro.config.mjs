// @ts-check
import { defineConfig, envField } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'

export default defineConfig({
  outDir: '../../dist',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      FORM_TARGET_URL: envField.string({
        context: 'server',
        access: 'public',
      })
    }
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
