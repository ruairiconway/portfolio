<script setup lang="ts">
// CMS fields: cms/pages/[...slug].ts
import type { Block } from '#cms'

const route = useRoute()

const { data: page } = await useAsyncData(`page-${route.path}`, () =>
  queryCollection('pages').path(route.path).first(),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

usePageSeo({ title: page.value.title, overrides: page.value.seo })

// Nuxt Content can only type parsed Markdown loosely (children: unknown[]),
// so use the exact generated block types. modules/cms/transform.ts builds the data.
const blocks = computed(() => (page.value?.blocks ?? []) as Block[])
</script>

<template>
  <article v-if="page">
    <BlockRenderer :blocks="blocks" />
  </article>
</template>
