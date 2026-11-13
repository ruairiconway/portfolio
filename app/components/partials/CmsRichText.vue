<script setup lang="ts">
/**
 * Renders a rich text field (cms/components/partials/CmsRichText.ts,
 * CmsRichTextField from #cms), or any other `markdown` / `richtext` field:
 *
 *   <CmsRichText :body="block.body" />
 *
 * The Markdown was parsed at build time (modules/cms/transform.ts), so this
 * only renders the tree: no Markdown parser is sent to the browser. Renders
 * nothing when the field is empty.
 *
 * Embeds (partials inserted into the text, like images and videos) are
 * rendered with their partials: <CmsImage>, <CmsVideo>… See modules/cms/embeds.ts.
 *
 * Styles for the formatted text (headings, lists, links, quotes, tables) are
 * in assets/scss/components/partials/CmsRichText.scss.
 */
import type { MDCRoot } from '@nuxtjs/mdc'
import { embedComponents } from '#build/cms/embeds'

const props = withDefaults(
  defineProps<{
    body?: MDCRoot | null
    /** The wrapping element. */
    tag?: string
  }>(),
  { tag: 'div' },
)

const hasContent = computed(() => (props.body?.children?.length ?? 0) > 0)
</script>

<template>
  <!-- MDCRenderer's own root element is the wrapper, so the text's elements are
       its direct children (the spacing styles rely on that). -->
  <MDCRenderer v-if="hasContent && body" :body="body" :tag="tag" :components="embedComponents" class="cms-rich-text" />
</template>

<style lang="scss" scoped src="../../assets/scss/components/partials/CmsRichText.scss"></style>
