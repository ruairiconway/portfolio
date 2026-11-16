<template>
  <!-- One root element: it gets the block's Anchor ID as its id (BlockRenderer). -->
  <section class="showcase">
    <h2>{{ block.heading }}</h2>
  </section>
</template>

<script setup lang="ts">
// CMS fields: cms/components/blocks/Showcase.ts
import type { ShowcaseBlock } from '#cms' // generated from the CMS fields

defineProps<{ block: ShowcaseBlock }>()
</script>

<style lang="scss" scoped src="../../assets/scss/components/blocks/Showcase.scss"></style>
