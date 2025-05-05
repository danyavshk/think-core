<script setup lang="ts">
defineProps<{
  progressLoading: boolean
  completed: boolean
  score?: number
}>()
</script>
<template>
  <div>
    <div
      v-if="progressLoading"
      class="text-onSurface/70 dark:text-onSurface-dark/70 text-center mb-4"
    >
      Загрузка прогресса...
    </div>
    <div v-else-if="completed" class="text-success text-center font-bold mb-4">
      Модуль пройден! Баллы: {{ score }}
    </div>
  </div>
</template>

<script lang="ts">
export default {}
</script>
