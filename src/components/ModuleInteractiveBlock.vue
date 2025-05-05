<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import InteractiveVideo from './InteractiveVideo.vue'

interface InteractiveQuestion {
  time: number
  question: string
  options: string[]
  correct: number
}

defineProps<{
  videoUrl: string
  questions?: InteractiveQuestion[]
  completed: boolean
}>()
const emit = defineEmits<{ (e: 'completed', score: number): void }>()
</script>
<script lang="ts">
export default {}
</script>
<template>
  <InteractiveVideo
    v-if="!completed"
    :video-url="videoUrl"
    :questions="questions"
    @completed="(score) => emit('completed', score)"
  />
</template>
