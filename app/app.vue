<script setup lang="ts">
// CMS fields: cms/app.yml
// Styles: assets/scss/app.scss (loaded globally from nuxt.config.ts)
const [{ data: site }, { data: seo }] = await Promise.all([
  useSiteSettings(),
  useAsyncData('seo', () => queryCollection('seo').first()),
])

const route = useRoute()
const { siteUrl } = useRuntimeConfig().public
const canonical = computed(() => `${siteUrl}${route.path === '/' ? '' : route.path}`)

// Social platforms need absolute image URLs.
const absolute = (path?: string) => (path && path.startsWith('/') ? `${siteUrl}${path}` : path || undefined)

const faviconTypes: Record<string, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
  ico: 'image/x-icon',
}
const favicon = site.value?.favicon?.src

useHead({
  link: [{ rel: 'canonical', href: canonical }],
  // Adds `js` to <html> before first paint, so CSS can hide elements that are
  // about to animate in (e.g. html.js .quote__text) without a flicker.
  // Without JavaScript, nothing is hidden.
  script: [{ innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' }],
})

if (favicon) {
  const ext = favicon.split('.').pop()?.toLowerCase() ?? ''
  useHead({ link: [{ rel: 'icon', href: favicon, type: faviconTypes[ext] }] })
} else {
  // No favicon set yet: an empty icon stops browsers requesting /favicon.ico (a 404).
  useHead({ link: [{ rel: 'icon', href: 'data:,' }] })
}

// Site-wide defaults. Pages override title, description and ogImage with their own.
useSeoMeta({
  titleTemplate: (title) =>
    title ? `${title} ${seo.value?.titleSeparator ?? '·'} ${site.value?.title}` : site.value?.title ?? '',
  description: seo.value?.description,
  ogTitle: site.value?.title,
  ogDescription: seo.value?.description,
  ogSiteName: site.value?.title,
  ogUrl: canonical,
  ogType: 'website',
  ogImage: absolute(seo.value?.image?.src),
  twitterCard: seo.value?.image?.src ? 'summary_large_image' : 'summary',
  twitterSite: seo.value?.twitterHandle || undefined,
  robots: seo.value?.noindex ? 'noindex, nofollow' : undefined,
})

// Smooth scrolling for the whole page: https://github.com/darkroomengineering/lenis
// Defined once, outside the template: Lenis restarts whenever this object changes.
// It follows the visitor's "reduce motion" setting by default (respectReducedMotion).
// Add data-lenis-prevent to any element with its own scrolling, like a modal.
const lenisOptions = {
  lerp: 0.1, // smoothing: lower is smoother and slower, 1 is off
  anchors: true, // smooth-scroll to #anchor links
  stopInertiaOnNavigate: true, // don't carry momentum onto the next page
}

// Dev-only column overlay, toggled with the | key (see partials/DevGrid.vue).
const isDev = import.meta.dev
</script>

<template>
  <VueLenis root :options="lenisOptions" />
  <AlertBanner />
  <div class="layout">
    <SiteHeader />
    <main>
      <NuxtPage :transition="pageTransition" /><!-- app/utils/pageTransition.ts -->
    </main>
    <SiteFooter />
  </div>
  <DevGrid v-if="isDev" />
</template>
