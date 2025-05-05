<template>
  <button
    class="bg-white/90 dark:bg-neutral-900/90 text-onSurface dark:text-onSurface-dark font-semibold text-base rounded-md px-4 py-1.5 transition-colors duration-150 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:border sm:rounded-md"
    @click="$emit('click')"
  >
    Регистрация
  </button>
</template>

<script setup lang="ts"></script>

<script lang="ts">
export default {}
</script>
