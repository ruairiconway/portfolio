import { defineCollection, defineContentConfig } from '@nuxt/content'
import { cmsSchema } from './modules/cms/schema'

// Each collection's schema is generated from its CMS fields in cms/, so fields
// are defined once (in the CMS) and query results are typed to match.
// Only where the content lives (`source`) and how it's routed are set here.
//
// `type: 'page'` collections omit fields Nuxt Content provides itself:
// `path` (the page URL, read from frontmatter) and `body` (the Markdown body).

export default defineContentConfig({
  collections: {
    // content/pages/*.md -> the `path` set in each file's frontmatter (URL path field in the CMS).
    // Without one, the URL falls back to the filename (index.md -> /, about.md -> /about).
    pages: defineCollection({
      type: 'page',
      source: { include: 'pages/**/*.md', prefix: '/' },
      schema: cmsSchema({ collection: 'pages' }, { omit: ['path'] }), // cms/pages/[...slug].ts
    }),

    // Navigation: one file per area, grouped as a collection in the CMS.
    alertBanner: defineCollection({
      type: 'data',
      source: 'navigation/alert-banner.json',
      schema: cmsSchema({ collection: 'navigation', file: 'alert-banner' }), // cms/components/AlertBanner.ts
    }),

    headerNav: defineCollection({
      type: 'data',
      source: 'navigation/header.json',
      schema: cmsSchema({ collection: 'navigation', file: 'header' }), // cms/components/SiteHeader.ts
    }),

    footerNav: defineCollection({
      type: 'data',
      source: 'navigation/footer.json',
      schema: cmsSchema({ collection: 'navigation', file: 'footer' }), // cms/components/SiteFooter.ts
    }),

    // Global settings. Each file is a singleton in the CMS (cms/app.ts).
    site: defineCollection({
      type: 'data',
      source: 'settings/site.json',
      schema: cmsSchema({ singleton: 'site' }),
    }),

    seo: defineCollection({
      type: 'data',
      source: 'settings/seo.json',
      schema: cmsSchema({ singleton: 'seo' }),
    }),
  },
})
