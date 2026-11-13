<script setup lang="ts">
/**
 * Renders a CMS image field (CmsImage from #cms). Dimensions are read at build
 * time (modules/cms/transform.ts), so the browser reserves the right space and
 * nothing shifts as the image loads.
 *
 *   <CmsImage :image="post.image" :alt="post.imageAlt" />
 *   <CmsImage v-bind="block.image" />   the shared field (cms/components/partials/CmsImage.ts)
 *
 * - Resized and converted by @nuxt/image: Netlify's Image CDN when deployed on
 *   Netlify, IPX locally. `sizes` controls which widths are offered.
 * - `priority` for the main above-the-fold image (e.g. a hero): loads eagerly at
 *   high priority. Everything else lazy-loads.
 * - SVGs are used as-is: they don't need resizing.
 * - `fit` ('cover' or 'contain') makes the image fill its container, cropped
 *   or letterboxed (object-fit). Give the container a size, e.g. aspect-ratio.
 */
import type { CmsImage } from '#cms'

const props = withDefaults(
  defineProps<{
    image?: CmsImage
    /** Describe the image. Empty (the default) marks it as purely decorative. */
    alt?: string
    /**
     * Rendered width from each breakpoint up, e.g. "phone:100vw tablet:400px". Always
     * prefix sizes with a breakpoint: an unprefixed size makes @nuxt/image add
     * 1px-wide variants. The layout is at most ~704px wide (44rem).
     */
    sizes?: string
    priority?: boolean
    /**
     * Fill the container (width and height 100%) with object-fit: 'cover' crops
     * to fill it, 'contain' fits the whole image inside it. Without `fit`, the
     * image keeps its own proportions.
     */
    fit?: 'cover' | 'contain'
  }>(),
  { alt: '', sizes: 'phone:100vw tablet:720px', priority: false },
)

const isSvg = computed(() => /\.svg(\?|$)/i.test(props.image?.src ?? ''))
const loading = computed(() => (props.priority ? 'eager' : 'lazy'))
const fetchpriority = computed(() => (props.priority ? 'high' : undefined))
const classes = computed(() => ['cms-image', props.fit && `cms-image--${props.fit}`])
</script>

<template>
  <template v-if="image?.src">
    <img
      v-if="isSvg"
      :class="classes"
      :src="image.src"
      :alt="alt"
      :width="image.width"
      :height="image.height"
      :loading="loading"
      :fetchpriority="fetchpriority"
      decoding="async"
    />
    <NuxtImg
      v-else
      :class="classes"
      :src="image.src"
      :alt="alt"
      :width="image.width"
      :height="image.height"
      :sizes="sizes"
      format="webp"
      :loading="loading"
      :fetchpriority="fetchpriority"
      decoding="async"
    />
  </template>
</template>

<style lang="scss" scoped src="../../assets/scss/components/partials/CmsImage.scss"></style>
