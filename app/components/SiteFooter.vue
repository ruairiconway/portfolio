<script setup lang="ts">
// CMS fields: cms/components/SiteFooter.yml
const { data: site } = await useSiteSettings()
const { data: nav } = await useAsyncData('footer-nav', () =>
  queryCollection('footerNav').first(),
)
</script>

<template>
  <footer class="site-footer">
    <nav v-if="nav?.items.length" aria-label="Footer">
      <NuxtLink v-for="item in nav.items" :key="item.url" :to="item.url">
        {{ item.label }}
      </NuxtLink>
    </nav>
    <p>© {{ new Date().getFullYear() }} {{ site?.title }}<template v-if="nav?.copyright">. {{ nav.copyright }}</template></p>
  </footer>
</template>

<style lang="scss" scoped src="../assets/scss/components/SiteFooter.scss"></style>
