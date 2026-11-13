// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },

  // lenis/nuxt registers <VueLenis> and useLenis() (smooth scrolling, see app.vue).
  // @nuxt/image resizes images (see <CmsImage>): Netlify's Image CDN on Netlify
  // (detected automatically), IPX locally.
  modules: ['@nuxt/content', 'lenis/nuxt', '@nuxt/image', '@nuxt/fonts'],

  image: {
    quality: 80,
  },

  // Fonts come only from files in app/assets/fonts/, never from an online
  // service. Use a family in SCSS (font-family: 'BrandSans') and @nuxt/fonts
  // writes its @font-face rules and a size-matched fallback from the filenames.
  fonts: {
    local: { dirs: ['app/assets/fonts'] },
    providers: {
      google: false,
      googleicons: false,
      bunny: false,
      fontshare: false,
      fontsource: false,
      adobe: false,
      npm: false,
    },
  },

  // lenis.css: required base styles for Lenis. main.scss: tokens + reset.
  // app.scss: styles for app/app.vue (the root component can't use
  // <style src> without losing SSR inlining).
  css: ['lenis/dist/lenis.css', '~/assets/scss/main.scss', '~/assets/scss/app.scss'],

  // Page blocks are registered globally so <BlockRenderer> can resolve them by
  // name: app/components/blocks/Quote.vue -> <BlockQuote>. Partials keep their
  // own names: app/components/partials/CmsImage.vue -> <CmsImage>.
  components: [
    { path: '~/components/blocks', prefix: 'Block', global: true },
    { path: '~/components/partials', pathPrefix: false },
    '~/components',
  ],

  // Override with NUXT_PUBLIC_* env vars, e.g. NUXT_PUBLIC_SITE_URL.
  runtimeConfig: {
    public: {
      // Netlify sets URL on every build, so no env var is needed there.
      siteUrl: process.env.URL ?? 'http://localhost:3000',
    },
  },

  // Make SCSS variables & mixins available in every <style lang="scss"> block.
  vite: {
    // Pre-bundle client dependencies that Vite would otherwise only discover on
    // the first page load in dev, which triggers a full page reload.
    optimizeDeps: {
      include: ['animejs'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/abstracts" as *;\n',
        },
      },
    },
  },

  content: {
    // Use Node's built-in SQLite (Node >= 22.5) so no native module needs compiling.
    experimental: { sqliteConnector: 'native' },
  },

  // Static site generation. Every page and post is added to the prerender list
  // by modules/prerender-content.ts, and the crawler follows internal links
  // from there. Add any other unlinked routes here.
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/blog'],
      // Never let the crawler write over the CMS admin page in public/admin.
      ignore: ['/admin'],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
