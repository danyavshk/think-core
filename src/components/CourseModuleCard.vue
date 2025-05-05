<script setup lang="ts">
import { defineEmits } from 'vue'
import { useGamificationStore } from '../stores/gamification'

const emit = defineEmits(['goModule'])
const gamificationStore = useGamificationStore()

defineProps<{
  title: string
  description: string
  buttonText?: string
  moduleNumber?: number
  slug?: string
}>()

const getModuleProgress = (slug?: string) => {
  if (!slug) return 0
  return gamificationStore.getModuleProgress(slug)
}
</script>

<template>
  <div
    class="group relative flex flex-col items-center w-full min-w-[260px] max-w-xs h-auto bg-white/90 dark:bg-neutral-900/90 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-material p-5 sm:p-6 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-material-lg"
  >
    <div
      v-if="moduleNumber"
      class="mb-2 text-xs uppercase tracking-widest text-primary/80 dark:text-primary-light font-bold"
    >
      Модуль {{ moduleNumber }}
    </div>
    <h2
      class="text-lg font-bold text-onSurface dark:text-onSurface-dark mb-2 text-center leading-tight z-10"
    >
      {{ title }}
    </h2>
    <p
      class="text-sm text-onSurface/80 dark:text-onSurface-dark/80 text-center mb-2 leading-snug z-10 flex-1"
    >
      {{ description }}
    </p>
    <div class="w-full h-1 bg-gray-100 dark:bg-neutral-800 rounded-full mb-4 overflow-hidden">
      <div
        class="h-full bg-primary dark:bg-primary-light transition-all duration-500"
        :style="{ width: `${getModuleProgress(slug)}%` }"
      ></div>
    </div>
    <button
      v-if="buttonText"
      class="mt-2 px-5 py-2 rounded-md bg-primary text-white font-bold text-sm shadow hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 z-10 hover:shadow-lg hover:translate-y-[-2px]"
      @click="() => emit('goModule', slug)"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      {{ buttonText }}
    </button>
  </div>
</template>

<script lang="ts">
export default {}
</script>
