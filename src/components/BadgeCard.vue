<template>
  <div
    class="relative flex flex-col items-center bg-white/90 dark:bg-neutral-900/90 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-material p-5 overflow-hidden transition-all duration-200 hover:scale-[1.03] hover:shadow-material-lg"
  >
    <div class="text-4xl mb-2 select-none">{{ badge.icon }}</div>
    <div class="font-bold text-base text-onSurface dark:text-onSurface-dark mb-1 text-center">
      {{ badge.name }}
    </div>
    <div class="text-xs text-onSurface/70 dark:text-onSurface-dark/70 mb-2 text-center">
      {{ badge.description }}
    </div>
    <div class="flex items-center gap-2 mb-2">
      <span class="text-primary dark:text-primary-light font-bold">{{ badge.price }} баллов</span>
      <span
        v-if="badge.type"
        class="text-xs px-2 py-0.5 rounded bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light"
        >{{ badge.type }}</span
      >
    </div>
    <button
      v-if="!owned && canBuy && !demo"
      @click="$emit('buy')"
      class="mt-2 px-5 py-2 rounded-md bg-primary text-white font-bold text-sm shadow hover:bg-primary/90 transition-colors duration-150 flex items-center gap-2 z-10"
    >
      Купить
    </button>
    <span
      v-else-if="demo"
      class="mt-2 px-5 py-2 rounded-md bg-gray-200 dark:bg-neutral-800 text-onSurface/40 dark:text-onSurface-dark/40 font-bold text-sm cursor-default"
      >Демо</span
    >
    <span
      v-else-if="owned && !active"
      class="mt-2 px-5 py-2 rounded-md bg-gray-300 dark:bg-neutral-700 text-onSurface/70 dark:text-onSurface-dark/70 font-bold text-sm cursor-default"
      >Куплено</span
    >
    <span
      v-else-if="active"
      class="mt-2 px-5 py-2 rounded-md bg-green-500 text-white font-bold text-sm cursor-default"
      >Активно</span
    >
    <span
      v-else
      class="mt-2 px-5 py-2 rounded-md bg-gray-200 dark:bg-neutral-800 text-onSurface/40 dark:text-onSurface-dark/40 font-bold text-sm cursor-default"
      >Недоступно</span
    >
  </div>
</template>

<script setup lang="ts">
import type { Badge } from '../types/badge'

defineProps<{
  badge: Badge
  owned?: boolean
  active?: boolean
  canBuy?: boolean
  demo?: boolean
}>()
</script>

<script lang="ts">
export default {}
</script>
