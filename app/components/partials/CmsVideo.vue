<template>
  <figure v-if="embed" class="video">
    <div class="video__frame" :style="{ aspectRatio: video.aspectRatio ?? '16/9' }">
      <iframe
        v-if="playing"
        :src="embed.src"
        :title="title"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowfullscreen
      />
      <button v-else type="button" class="video__play" :aria-label="`Play video: ${title}`" @click="playing = true">
        <CmsImage v-if="video.poster" :image="video.poster" alt="" sizes="phone:100vw tablet:720px" class="video__poster" />
        <img v-else-if="embed.thumbnail" :src="embed.thumbnail" alt="" loading="lazy" decoding="async" class="video__poster" />
        <span class="video__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
        </span>
      </button>
    </div>
    <figcaption v-if="video.caption">{{ video.caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
/**
 * Renders the shared video field (cms/components/partials/CmsVideo.ts,
 * CmsVideoField from #cms). Use it in any block that has that field in its
 * fields (import video from '../partials/CmsVideo'):
 *
 *   <CmsVideo v-if="block.video?.url?.startsWith('https://')" :video="block.video" />
 *
 * (It renders nothing for a link that isn't https://, so check first if
 * something else should show in its place.)
 *
 * Shows a poster with a play button, and only loads the player (often
 * 500 KB–1 MB of scripts) once someone presses play. YouTube and Vimeo page
 * links are converted to embeds; any other https URL is treated as an embed
 * URL from a video host (Mux, Cloudflare Stream, Bunny Stream…).
 */
import type { CmsVideoField } from '#cms' // generated from cms/components/partials/CmsVideo.ts

const props = defineProps<{ video: CmsVideoField }>()

const embed = computed(() => {
  const url = props.video.url?.trim() ?? ''
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/)
  if (youtube) {
    return {
      src: `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1&rel=0`,
      thumbnail: `https://i.ytimg.com/vi/${youtube[1]}/hqdefault.jpg`,
    }
  }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return { src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` }
  if (url.startsWith('https://')) return { src: url }
  return undefined
})

const title = computed(() => props.video.title || 'Video')
const playing = ref(false)
</script>

<style lang="scss" scoped src="../../assets/scss/components/partials/CmsVideo.scss"></style>
