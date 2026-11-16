<template>
  <!-- Each block's Anchor ID (cms/fields/anchorId.ts) becomes the id of its root
       element, so /page#pricing scrolls to it. -->
  <component
    :is="item.component"
    v-for="(item, index) in items"
    :id="item.block.anchorId || undefined"
    :key="index"
    :block="item.block"
  />
</template>

<script setup lang="ts">
/**
 * Renders a list of CMS blocks. A block of type "pull-quote" renders
 * <BlockPullQuote> from app/components/blocks/PullQuote.vue.
 */
import type { Block } from '#cms' // every block in cms/components/blocks/

const props = defineProps<{ blocks: Block[] }>()

const toPascal = (type: string) =>
  type.replace(/(^|-)([a-z0-9])/g, (_match, _dash, char: string) => char.toUpperCase())

const items = props.blocks.flatMap((block) => {
  const component = resolveComponent(`Block${toPascal(block.type)}`)
  if (typeof component === 'string') {
    if (import.meta.dev) {
      console.warn(
        `[BlockRenderer] No component for block type "${block.type}". Expected app/components/blocks/${toPascal(block.type)}.vue`,
      )
    }
    return []
  }
  return [{ block, component }]
})
</script>
