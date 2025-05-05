<template>
  <div
    class="w-full max-w-2xl mx-auto bg-white/90 dark:bg-neutral-900/90 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-material p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden transition-colors duration-300"
  >
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="text-2xl font-bold text-onSurface dark:text-onSurface-dark">Статистика</div>
        <div
          class="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full text-primary dark:text-primary-light font-bold text-lg"
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
          <span>{{ totalScore }} баллов</span>
        </div>
      </div>
      <!-- SVG диаграмма прогресса -->
      <div class="flex flex-col sm:flex-row items-center gap-6 justify-center">
        <div class="flex flex-col items-center">
          <svg width="110" height="110" viewBox="0 0 110 110" class="mb-2">
            <circle cx="55" cy="55" r="48" fill="none" stroke="#e0e0e0" stroke-width="10" />
            <circle
              cx="55"
              cy="55"
              r="48"
              fill="none"
              :stroke="modules.length > 0 ? '#1976d2' : '#bdbdbd'"
              stroke-width="10"
              :stroke-dasharray="progressCircumference"
              :stroke-dashoffset="progressOffset"
              stroke-linecap="round"
              style="transition: stroke-dashoffset 0.7s cubic-bezier(0.4, 2, 0.6, 1)"
              transform="rotate(-90 55 55)"
            />
            <text
              x="55"
              y="60"
              text-anchor="middle"
              class="fill-primary dark:fill-primary-light text-xl font-extrabold"
              style="font-size: 1.5rem"
            >
              {{ progressPercent }}%
            </text>
          </svg>
          <div class="text-onSurface/70 dark:text-onSurface-dark/70 text-xs text-center">
            Прогресс: {{ modules.length }}/{{ totalModules }} модулей
          </div>
        </div>
        <div class="flex-1 w-full">
          <div class="text-onSurface/80 dark:text-onSurface-dark/80 text-base mb-2 font-semibold">
            Пройденные модули:
          </div>
          <div
            v-if="modules.length === 0"
            class="text-onSurface/50 dark:text-onSurface-dark/50 text-sm"
          >
            Пока нет завершённых модулей.
          </div>
          <ul v-else class="flex flex-col gap-3">
            <li
              v-for="mod in modules"
              :key="mod.slug"
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-primary/5 dark:bg-primary/10 border border-gray-100 dark:border-neutral-800 rounded-lg px-4 py-3 gap-2 sm:gap-4"
            >
              <div class="text-onSurface dark:text-onSurface-dark font-bold text-base flex-1">
                {{ mod.title }}
              </div>
              <div
                class="flex flex-row sm:flex-col items-end sm:items-end gap-2 sm:gap-1 min-w-[120px] sm:min-w-[100px] justify-end text-right"
              >
                <span class="text-success font-bold whitespace-nowrap"
                  >+{{ mod.score }} баллов</span
                >
                <span
                  class="text-onSurface/60 dark:text-onSurface-dark/60 text-xs whitespace-nowrap"
                  >{{ formatDate(mod.completed_at) }}</span
                >
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGamificationStore } from '../stores/gamification'

const gamification = useGamificationStore()
const totalScore = computed(() => gamification.totalScore)

// Для отображения названия модуля по slug (можно расширить)
const moduleTitles: Record<string, string> = {
  'intro-to-ai': 'Введение в ИИ',
  'machine-learning': 'Основы машинного обучения',
  'neural-networks': 'Нейронные сети и глубокое обучение',
  'data-processing': 'Обработка данных',
  'ai-applications': 'Применение ИИ',
  'ethics-future': 'Этика и будущее',
}

const totalModules = Object.keys(moduleTitles).length
const modules = computed(() =>
  Object.entries(gamification.moduleProgress).map(([slug, data]) => ({
    slug,
    title: moduleTitles[slug] || slug,
    score: data.score,
    completed_at: data.completed_at,
  })),
)

const progressPercent = computed(() =>
  totalModules > 0 ? Math.round((modules.value.length / totalModules) * 100) : 0,
)
const progressCircumference = 2 * Math.PI * 48
const progressOffset = computed(() => progressCircumference * (1 - progressPercent.value / 100))

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<script lang="ts">
export default {}
</script>

<style scoped>
.fade-stats-enter-active,
.fade-stats-leave-active {
  transition:
    opacity 0.4s,
    transform 0.4s;
}
.fade-stats-enter-from,
.fade-stats-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
</style>
