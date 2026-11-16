<template>
  <NuxtLink
    v-if="text && href"
    :to="href"
    :target="newWindow ? '_blank' : undefined"
    :rel="newWindow ? 'noopener noreferrer' : undefined"
    class="cms-button"
  >
    {{ text }}<span v-if="newWindow" class="cms-button__new-tab">(opens in a new tab)</span>
  </NuxtLink>
</template>

<script setup lang="ts">
/**
 * Renders the button field (cms/components/partials/CmsButton.ts,
 * CmsButtonField from #cms). Its fields are this component's props:
 *
 *   <CmsButton v-bind="block.button" />
 *   <CmsButton text="Contact us" :link="{ type: 'page', page: '/contact' }" />
 *
 * Also used for buttons inserted into rich text (see modules/cms/embeds.ts).
 *
 * - A site page links with <NuxtLink>, plus #anchor if one is set. With an
 *   anchor and no page, it jumps to that section of the current page.
 * - An external URL (or mailto:/tel:) is a normal link.
 * - `newWindow` opens it in a new tab, and says so to screen readers.
 * Renders nothing without text or a link.
 */
import type { CmsButtonField } from '#cms'

const props = defineProps<{
  text?: string
  link?: CmsButtonField['link']
  newWindow?: boolean
}>()

const href = computed(() => {
  const link = props.link
  if (link?.type === 'external') return link.url || undefined
  if (link?.type === 'page') {
    const anchor = link.anchor?.replace(/^#/, '')
    const hash = anchor ? `#${anchor}` : ''
    return link.page ? `${link.page}${hash}` : hash || undefined
  }
  return undefined
})
</script>

<style lang="scss" scoped src="../../assets/scss/components/partials/CmsButton.scss"></style>
