<template>
  <main class="layout">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage || 'Something went wrong.' }}</p>
    <NuxtLink to="/" @click.prevent="clearError({ redirect: '/' })">Go home</NuxtLink>
  </main>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>
