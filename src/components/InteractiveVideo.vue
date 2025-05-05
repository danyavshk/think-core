<template>
  <div class="relative w-full max-w-2xl mx-auto flex flex-col">
    <div class="w-full aspect-video rounded-xl overflow-hidden bg-black">
      <YouTube
        ref="ytRef"
        :src="videoUrl"
        :player-vars="{ controls: 1, modestbranding: 1, rel: 0 }"
        class="w-full h-full"
        @ready="onPlayerReady"
        @stateChange="onPlayerStateChange"
      />
      <div
        v-if="isFullscreen"
        class="absolute inset-0 flex items-center justify-center bg-black/80 z-30"
      >
        <div class="text-white text-center text-base sm:text-lg font-bold p-4">
          Интерактивные вопросы недоступны в полноэкранном режиме.<br />Выйдите из fullscreen для
          продолжения.
        </div>
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="showQuestion"
        class="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur rounded-xl z-20 px-1 py-1 sm:px-2 sm:py-2"
      >
        <div
          class="bg-white/95 dark:bg-neutral-900/95 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 sm:p-6 w-[95vw] max-w-md text-center flex flex-col items-center shadow-material-lg"
        >
          <div
            class="text-onSurface dark:text-onSurface-dark text-base sm:text-lg font-bold mb-4 leading-snug"
          >
            {{ currentQuestion.question }}
          </div>
          <div class="flex flex-col gap-3 w-full mb-4">
            <button
              v-for="(opt, idx) in currentQuestion.options"
              :key="idx"
              :disabled="answered"
              @click="answer(idx)"
              class="w-full px-4 py-3 sm:px-6 sm:py-3 rounded-md border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/90 text-onSurface dark:text-onSurface-dark font-semibold transition hover:bg-primary hover:text-white disabled:opacity-60 text-base sm:text-lg"
            >
              {{ opt }}
            </button>
          </div>
          <div
            v-if="answered"
            class="text-lg mt-2"
            :class="isCorrect ? 'text-success' : 'text-error'"
          >
            {{ isCorrect ? 'Верно! +10 очков' : 'Неверно! 0 очков' }}
          </div>
          <button
            v-if="answered"
            @click="continueVideo"
            class="mt-4 px-6 py-3 rounded-md bg-primary text-white font-bold hover:bg-primary/90 text-base sm:text-lg shadow"
          >
            Продолжить
          </button>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="showResult"
        class="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur rounded-xl z-30 px-2 py-2"
      >
        <div
          class="bg-white/95 dark:bg-neutral-900/95 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 w-[95vw] max-w-md text-center flex flex-col items-center shadow-material-lg animate-bounceIn"
        >
          <div class="text-onSurface dark:text-onSurface-dark text-2xl font-black mb-4">
            Поздравляем!
          </div>
          <div class="text-onSurface/80 dark:text-onSurface-dark/80 text-lg mb-2">
            Ваш результат:
          </div>
          <div class="text-success text-3xl font-extrabold mb-6">{{ score }} баллов</div>
          <button
            @click="restart"
            class="px-6 py-3 rounded-md bg-primary text-white font-bold hover:bg-primary/90 text-base shadow"
          >
            Пройти ещё раз
          </button>
        </div>
      </div>
    </transition>
    <div
      class="absolute top-2 right-2 sm:top-3 sm:right-4 bg-primary/90 text-white px-3 py-1 sm:px-4 rounded-full text-xs sm:text-sm font-bold z-20 flex items-center gap-2 shadow"
    >
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
      {{ score }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import YouTube from 'vue3-youtube'

defineProps<{ videoUrl: string }>()
const ytRef = ref<unknown>(null)
let player: unknown = null
const isFullscreen = ref(false)
const showResult = ref(false)

const questions = [
  {
    time: 15,
    question: 'Что такое искусственный интеллект?',
    options: ['Компьютерная программа', 'Область науки', 'Вид спорта'],
    correct: 1,
  },
  {
    time: 45,
    question: 'Что НЕ относится к ИИ?',
    options: ['Распознавание речи', 'Обработка текста', 'Прыжки в длину'],
    correct: 2,
  },
  {
    time: 80,
    question: 'Где ИИ применяется уже сегодня?',
    options: ['Рекомендации в сервисах', 'Голосовые помощники', 'Все перечисленное'],
    correct: 2,
  },
]

const currentQuestionIdx = ref(-1)
const showQuestion = ref(false)
const answered = ref(false)
const isCorrect = ref(false)
const score = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

const currentQuestion = computed(() =>
  currentQuestionIdx.value >= 0
    ? questions[currentQuestionIdx.value]
    : { question: '', options: [], correct: -1 },
)

const emit = defineEmits(['completed'])
function onPlayerReady(e: unknown) {
  player = (e as { target: unknown }).target
  startInterval()
}

function onPlayerStateChange(e: unknown) {
  if ((e as { data?: number }).data === 1) startInterval()
  else stopInterval()
}

function startInterval() {
  stopInterval()
  interval = setInterval(checkTime, 500)
}
function stopInterval() {
  if (interval) clearInterval(interval)
}

function checkTime() {
  if (!player || showQuestion.value || showResult.value) return
  isFullscreen.value = document.fullscreenElement !== null
  const time = (player as unknown as { getCurrentTime: () => number }).getCurrentTime()
  const idx = questions.findIndex(
    (q, i) => Math.abs(time - q.time) < 1 && !answered.value && currentQuestionIdx.value !== i,
  )
  if (idx !== -1) {
    ;(player as unknown as { pauseVideo: () => void }).pauseVideo()
    currentQuestionIdx.value = idx
    showQuestion.value = true
    answered.value = false
    isCorrect.value = false
  }
  if (time > 100 && !showResult.value) {
    showResult.value = true
    stopInterval()
    emit('completed', score.value)
  }
}

function answer(idx: number) {
  answered.value = true
  isCorrect.value = idx === currentQuestion.value.correct
  if (isCorrect.value) score.value += 10
}

function continueVideo() {
  showQuestion.value = false
  answered.value = false
  isCorrect.value = false
  if (player) (player as unknown as { playVideo: () => void }).playVideo()
}

function restart() {
  score.value = 0
  showResult.value = false
  currentQuestionIdx.value = -1
  if (player) (player as unknown as { seekTo: (t: number) => void }).seekTo(0)
}

onBeforeUnmount(() => stopInterval())
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes bounceIn {
  0% {
    transform: scale(0.7);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}
.animate-bounceIn {
  animation: bounceIn 0.7s;
}
</style>

<script lang="ts">
export default {}
</script>
