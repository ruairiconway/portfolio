<script setup lang="ts">
// CMS fields: cms/components/Header.ts
const { data: site } = await useSiteSettings()
const { data: nav } = await useAsyncData('header-nav', () =>
  queryCollection('headerNav').first(),
)
</script>

<template>
  <header class="header">
    <NuxtLink to="/" class="brand">
      <CmsImage v-if="site?.logo" :image="site.logo" :alt="site.title" sizes="phone:240px" priority class="brand__logo" />
      <template v-else>{{ site?.title }}</template>
    </NuxtLink>
    <nav v-if="nav?.items.length" aria-label="Main">
      <NuxtLink v-for="item in nav.items" :key="item.url" :to="item.url">
        {{ item.label }}
      </NuxtLink>
    </nav>
  </header>
</template>

<style lang="scss" scoped src="../assets/scss/components/Header.scss"></style>
