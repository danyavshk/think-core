<script setup lang="ts">
defineProps<{
  title: string
  renderedContent: string
  moduleNumber?: number
}>()
</script>
<template>
  <div>
    <div
      class="mb-2 text-xs uppercase tracking-widest text-primary/80 dark:text-primary-light font-bold"
    >
      Модуль<span v-if="moduleNumber"> {{ moduleNumber }}</span>
    </div>
    <h1 class="text-2xl font-black text-onSurface dark:text-onSurface-dark mb-4 text-center">
      {{ title }}
    </h1>
    <div
      class="prose max-w-none text-onSurface/90 dark:text-onSurface-dark/90 mb-6"
      v-html="renderedContent"
    ></div>
  </div>
</template>

<script lang="ts">
export default {}
</script>
