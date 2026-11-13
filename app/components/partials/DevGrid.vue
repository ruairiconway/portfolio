<script setup lang="ts">
// Column overlay for checking layout against the grid. Dev mode only
// (rendered from app.vue behind import.meta.dev). Toggle with the | key.
// Grid settings (columns, gutters): assets/scss/abstracts/_variables.scss
// MAX_COLUMNS only needs to be >= the largest column count set there; extra
// columns are hidden by the stylesheet.
const MAX_COLUMNS = 24
const STORAGE_KEY = 'dev-grid-visible'

const visible = ref(false)

function onKeydown(e: KeyboardEvent) {
  if (e.key !== '|' || e.metaKey || e.ctrlKey || e.altKey) return
  const target = e.target as HTMLElement | null
  if (target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return
  visible.value = !visible.value
  try {
    localStorage.setItem(STORAGE_KEY, visible.value ? '1' : '0')
  } catch {}
}

onMounted(() => {
  try {
    visible.value = localStorage.getItem(STORAGE_KEY) === '1'
  } catch {}
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div v-show="visible" class="dev-grid" aria-hidden="true">
    <div class="dev-grid__inner">
      <span v-for="n in MAX_COLUMNS" :key="n" class="dev-grid__col" />
    </div>
  </div>
</template>

<style lang="scss" scoped src="../../assets/scss/components/partials/DevGrid.scss"></style>
