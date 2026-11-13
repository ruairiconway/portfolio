<script setup lang="ts">
// CMS fields: cms/pages/blog/[slug].ts
const route = useRoute()

const { data: post } = await useAsyncData(`post-${route.path}`, () =>
  queryCollection('posts').path(route.path).first(),
)

if (!post.value || post.value.draft) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

usePageSeo({
  title: post.value.title,
  description: post.value.description,
  image: post.value.image?.src,
  type: 'article',
  overrides: post.value.seo,
})
</script>

<template>
  <article v-if="post">
    <NuxtLink to="/blog">← All posts</NuxtLink>
    <h1>{{ post.title }}</h1>
    <time class="meta" :datetime="post.date">{{ post.date }}</time>
    <CmsImage :image="post.image" :alt="post.imageAlt ?? ''" sizes="phone:100vw tablet:720px" priority />
    <ContentRenderer :value="post" />
  </article>
</template>
