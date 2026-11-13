<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-posts', () =>
  queryCollection('posts')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date')
    .all(),
)

usePageSeo({ title: 'Blog' })
</script>

<template>
  <section>
    <h1>Blog</h1>
    <ul class="post-list">
      <li v-for="post in posts" :key="post.path">
        <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
        <time class="meta" :datetime="post.date">{{ post.date }}</time>
        <p v-if="post.description">{{ post.description }}</p>
      </li>
    </ul>
    <p v-if="!posts?.length">No posts yet.</p>
  </section>
</template>

<style lang="scss" scoped src="../../assets/scss/pages/blog/index.scss"></style>
