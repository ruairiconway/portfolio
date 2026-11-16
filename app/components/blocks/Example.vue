<template>
  <section class="example">
    <CmsRichText :body="block.body" />
  </section>
</template>

<script setup lang="ts">
// CMS fields: cms/components/blocks/Example.ts
// A placeholder block: Sveltia needs at least one block type. Delete it once
// you've added real blocks with `pnpm new block <Name>`.
import type { ExampleBlock } from '#cms' // generated from the CMS fields

defineProps<{ block: ExampleBlock }>()
</script>

<style lang="scss" scoped src="../../assets/scss/components/blocks/Example.scss"></style>
