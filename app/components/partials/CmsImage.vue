<script setup lang="ts">
/**
 * Renders a CMS image field (CmsImage from #cms). Dimensions are read at build
 * time (modules/cms/transform.ts), so the browser reserves the right space and
 * nothing shifts as the image loads.
 *
 * - Resized and converted by @nuxt/image: Netlify's Image CDN when deployed on
 *   Netlify, IPX locally. `sizes` controls which widths are offered.
 * - `priority` for the main above-the-fold image (e.g. a hero): loads eagerly at
 *   high priority. Everything else lazy-loads.
 * - SVGs are used as-is: they don't need resizing.
 */
import type { CmsImage } from '#cms'

const props = withDefaults(
  defineProps<{
    image?: CmsImage
    /** Describe the image, or '' if it's purely decorative. */
    alt: string
    /**
     * Rendered width from each breakpoint up, e.g. "sm:100vw md:400px". Always
     * prefix sizes with a breakpoint: an unprefixed size makes @nuxt/image add
     * 1px-wide variants. The layout is at most ~704px wide (44rem).
     */
    sizes?: string
    priority?: boolean
  }>(),
  { sizes: 'sm:100vw md:720px', priority: false },
)

const isSvg = computed(() => /\.svg(\?|$)/i.test(props.image?.src ?? ''))
const loading = computed(() => (props.priority ? 'eager' : 'lazy'))
const fetchpriority = computed(() => (props.priority ? 'high' : undefined))
</script>

<template>
  <template v-if="image?.src">
    <img
      v-if="isSvg"
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
