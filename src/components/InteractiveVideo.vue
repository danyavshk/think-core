<template>
  <div class="relative w-full max-w-2xl mx-auto flex flex-col">
    <div class="w-full aspect-video rounded-xl overflow-hidden bg-black video-container-mobile">
      <YouTube
        ref="ytRef"
        :src="videoUrl"
        :player-vars="{ controls: 1, modestbranding: 1, rel: 0, playsinline: 1 }"
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
      <div
        v-if="showMobilePlayButton"
        class="absolute inset-0 flex items-center justify-center z-40 bg-black/60"
      >
        <button
          @click="startMobileVideo"
          class="px-6 py-3 rounded-full bg-primary text-white font-bold text-lg shadow-lg"
        >
          ▶ Начать видео
        </button>
      </div>
      <div
        v-if="showRotateHint"
        class="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/70"
      >
        <div class="flex flex-col items-center gap-4 p-6">
          <svg
            width="60"
            height="60"
            fill="none"
            stroke="white"
            stroke-width="2"
            viewBox="0 0 48 48"
          >
            <rect x="8" y="16" width="32" height="16" rx="4" fill="#222" stroke="#fff" />
            <path d="M24 8v4M24 36v4M8 24h-4M44 24h4" stroke="#fff" />
            <path d="M16 44c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#fff" />
          </svg>
          <div class="text-white text-center text-base font-bold">
            Для удобства просмотра и интерактива<br />поверните телефон горизонтально
          </div>
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
          <div class="flex flex-col gap-2 sm:gap-3 w-full mb-4">
            <button
              v-for="(opt, idx) in currentQuestion.options"
              :key="idx"
              :disabled="answered"
              @click="answer(idx)"
              class="w-full px-3 py-2 sm:px-6 sm:py-3 rounded-md border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/90 text-onSurface dark:text-onSurface-dark font-semibold transition hover:bg-primary hover:text-white disabled:opacity-60 text-sm sm:text-base"
            >
              {{ opt }}
            </button>
          </div>
          <div
            v-if="answered"
            class="text-base sm:text-lg mt-2"
            :class="isCorrect ? 'text-success' : 'text-error'"
          >
            {{ isCorrect ? 'Верно! +10 очков' : 'Неверно! 0 очков' }}
          </div>
          <button
            v-if="answered"
            @click="continueVideo"
            class="mt-4 px-4 py-2 sm:px-6 sm:py-3 rounded-md bg-primary text-white font-bold hover:bg-primary/90 text-sm sm:text-base shadow"
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
          class="bg-white/95 dark:bg-neutral-900/95 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 sm:p-6 w-[95vw] max-w-md text-center flex flex-col items-center shadow-material-lg animate-bounceIn"
        >
          <div class="text-onSurface dark:text-onSurface-dark text-xl sm:text-2xl font-black mb-4">
            Поздравляем!
          </div>
          <div class="text-onSurface/80 dark:text-onSurface-dark/80 text-base sm:text-lg mb-2">
            Ваш результат:
          </div>
          <div class="text-success text-2xl sm:text-3xl font-extrabold mb-6">
            {{ score }} баллов
          </div>
          <button
            @click="restart"
            class="px-4 py-2 sm:px-6 sm:py-3 rounded-md bg-primary text-white font-bold hover:bg-primary/90 text-sm sm:text-base shadow"
          >
            Пройти ещё раз
          </button>
        </div>
      </div>
    </transition>
    <div
      class="absolute top-2 right-2 sm:top-3 sm:right-4 bg-primary/90 text-white px-2 py-1 sm:px-4 rounded-full text-xs sm:text-sm font-bold z-20 flex items-center gap-1 sm:gap-2 shadow"
    >
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        class="w-3 h-3 sm:w-4 sm:h-4"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
      {{ score }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted, onUnmounted } from 'vue'
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

const emit = defineEmits(['completed', 'landscapeMode'])
const isMobile = window.innerWidth <= 600
const showMobilePlayButton = ref(isMobile)

// Подсказка о повороте экрана
const showRotateHint = ref(false)
function checkOrientation() {
  if (isMobile) {
    showRotateHint.value = window.innerWidth < window.innerHeight
    emit('landscapeMode', !showRotateHint.value)
  } else {
    showRotateHint.value = false
    emit('landscapeMode', false)
  }
}
onMounted(() => {
  checkOrientation()
  window.addEventListener('resize', checkOrientation)
  window.addEventListener('orientationchange', checkOrientation)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkOrientation)
  window.removeEventListener('orientationchange', checkOrientation)
})

function startMobileVideo() {
  showMobilePlayButton.value = false
  if (player && typeof (player as { playVideo?: () => void }).playVideo === 'function') {
    ;(player as { playVideo: () => void }).playVideo()
  }
}

function onPlayerReady(e: unknown) {
  player = (e as { target: unknown }).target
  if (!isMobile) startInterval()
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
.video-container-mobile {
  max-width: 100vw;
}
@media (max-width: 600px) {
  .video-container-mobile {
    max-width: 100vw !important;
    border-radius: 12px;
    margin-left: -16px;
    margin-right: -16px;
  }
}
</style>

<script lang="ts">
export default {}
</script>
