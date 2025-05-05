<script setup lang="ts">
import { RouterView } from 'vue-router'
import GridBackground from './components/GridBackground.vue'
</script>

<template>
  <div
    class="relative min-h-screen flex flex-col bg-surface dark:bg-surface-dark transition-colors duration-300"
  >
    <GridBackground />
    <div class="flex-1 flex flex-col">
      <RouterView />
    </div>
  </div>
</template>
