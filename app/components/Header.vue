<template>
  <header class="header">
    <NuxtLink to="/" class="brand">
      <CmsImage
        v-if="site?.logo"
        :image="site.logo"
        :alt="site.title"
        sizes="phone:240px"
        priority
        class="logo"
      />
      <p v-else class="type-logo">{{ site?.title }}</p>
    </NuxtLink>
    <nav v-if="nav?.items.length" aria-label="Main">
      <NuxtLink
        v-for="(item, i) in nav.items"
        :key="`header-link-${i}`"
        :to="item.link?.type == 'external' ? item.link.url : item.link.page"
        :target="item.newWindow ? '_blank' : '_self'"
      >
        {{ item.text }}
      </NuxtLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
// CMS fields: cms/components/Header.ts
const { data: site } = await useSiteSettings();
const { data: nav } = await useAsyncData("header-nav", () =>
  queryCollection("headerNav").first(),
);
</script>

<style lang="scss" scoped src="../assets/scss/components/Header.scss"></style>
