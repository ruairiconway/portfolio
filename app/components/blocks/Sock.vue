<script setup lang="ts">
// CMS fields: cms/components/blocks/Sock.ts
import type { SockBlock } from '#cms' // generated from the CMS fields

defineProps<{ block: SockBlock }>()
</script>

<template>
  <!-- One root element: it gets the block's Anchor ID as its id (BlockRenderer). -->
  <section class="sock">
    <h2>{{ block.heading }}</h2>
  </section>
</template>

<style lang="scss" scoped src="../../assets/scss/components/blocks/Sock.scss"></style>
