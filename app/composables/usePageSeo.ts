import type { SeoField } from '#cms' // generated from cms/fields/seo.ts

interface PageSeo {
  title?: string
  description?: string
  /** Site-relative (/images/...) or absolute URL. */
  image?: string
  type?: 'website' | 'article'
  /** Editor overrides from the page's SEO section. They win over the values above. */
  overrides?: SeoField
}

/**
 * Per-page SEO. Anything left out falls back to the global defaults
 * from the SEO singleton (content/settings/seo.json), set in app.vue.
 */
export function usePageSeo({ title, description, image, type, overrides = {} }: PageSeo) {
  const { siteUrl } = useRuntimeConfig().public
  const { data: site } = useNuxtData<{ title: string }>('site')

  // Blank CMS fields can be saved as empty strings, so treat those as unset.
  const metaTitle = overrides.title || title
  const desc = overrides.description || description
  const img = overrides.image?.src || image
  const separator = overrides.titleSeparator

  useSeoMeta({
    title: metaTitle,
    ogTitle: metaTitle,
    description: desc,
    ogDescription: desc,
    ogType: type,
    ...(img && {
      ogImage: img.startsWith('/') ? `${siteUrl}${img}` : img,
      twitterCard: 'summary_large_image',
    }),
    ...(separator && {
      titleTemplate: (t?: string) => (t ? `${t} ${separator} ${site.value?.title}` : site.value?.title ?? ''),
    }),
    ...(overrides.twitterHandle && { twitterSite: overrides.twitterHandle }),
    // The global noindex setting (app.vue) still applies to every page.
    ...(overrides.noindex && { robots: 'noindex, nofollow' }),
  })
}
