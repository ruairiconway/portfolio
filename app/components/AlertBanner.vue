<script setup lang="ts">
// CMS fields: cms/components/AlertBanner.yml
const { data: banner } = await useAsyncData('alert-banner', () =>
  queryCollection('alertBanner').first(),
)
</script>

<template>
  <div
    v-if="banner?.enabled && banner.message"
    class="alert-banner"
    :class="`alert-banner--${banner.tone}`"
    role="region"
    aria-label="Announcement"
  >
    <p>
      {{ banner.message }}
      <NuxtLink v-if="banner.link?.url" :to="banner.link.url">
        {{ banner.link.label || 'Learn more' }}
      </NuxtLink>
    </p>
  </div>
</template>

<style lang="scss" scoped src="../assets/scss/components/AlertBanner.scss"></style>
