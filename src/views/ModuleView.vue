<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../supabase'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { marked } from 'marked'
import type { Ref } from 'vue'
import { useGamificationStore } from '../stores/gamification'
import { storeToRefs } from 'pinia'
import ModuleContent from '../components/ModuleContent.vue'
import ModuleProgressStatus from '../components/ModuleProgressStatus.vue'
import ModuleInteractiveBlock from '../components/ModuleInteractiveBlock.vue'

const route = useRoute()
const router = useRouter()

interface CourseModule {
  id: string
  slug: string
  title: string
  content: string
}
const moduleData = ref<CourseModule | null>(null)
const loading = ref(true)
const errorMsg = ref('')
const renderedContent: Ref<string> = ref('')
const gamification = useGamificationStore()
const { moduleProgress, loading: progressLoading } = storeToRefs(gamification)
const showHeaderFooter = ref(true)

const moduleNumbers: Record<string, number> = {
  'intro-to-ai': 1,
  'machine-learning': 2,
  'neural-networks': 3,
  'data-processing': 4,
  'ai-applications': 5,
  'ethics-future': 6,
}

onMounted(async () => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.error('Auth error:', authError)
      errorMsg.value = 'Ошибка авторизации. Пожалуйста, войдите снова.'
      router.replace('/')
      return
    }
    if (!authData.user) {
      router.replace('/')
      return
    }

    const slug = route.params.slug as string
    if (!slug) {
      errorMsg.value = 'Неверный URL модуля.'
      return
    }

    const { data, error } = await supabase
      .from('course_modules')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Module fetch error:', error)
      errorMsg.value = 'Ошибка загрузки модуля. Пожалуйста, попробуйте позже.'
    } else if (!data) {
      errorMsg.value = 'Модуль не найден.'
    } else {
      moduleData.value = data
      try {
        const html = marked(data.content || '')
        if (html instanceof Promise) {
          renderedContent.value = await html
        } else {
          renderedContent.value = html
        }
      } catch (markdownError) {
        console.error('Markdown parsing error:', markdownError)
        renderedContent.value = data.content || ''
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    errorMsg.value = 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.'
  } finally {
    loading.value = false
    try {
      await gamification.loadProgress()
    } catch (progressError) {
      console.error('Error loading progress:', progressError)
    }
  }
})

function handleCompleted(score: number) {
  if (moduleData.value?.slug) {
    console.log('Completing module:', moduleData.value.slug, 'with score:', score)
    gamification.completeModule(moduleData.value.slug, score).catch((error) => {
      console.error('Error completing module:', error)
      errorMsg.value = 'Ошибка при сохранении прогресса. Попробуйте позже.'
    })
  }
}

function handleLandscapeMode(isLandscape: boolean) {
  showHeaderFooter.value = !isLandscape
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-surface dark:bg-surface-dark transition-colors duration-300"
  >
    <SiteHeader v-if="showHeaderFooter" />
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-12 pt-20">
      <div
        class="w-full max-w-2xl bg-white/90 dark:bg-neutral-900/90 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-material-lg px-6 py-8 flex flex-col items-center transition-colors duration-300"
      >
        <template v-if="loading">
          <div class="text-onSurface/80 dark:text-onSurface-dark/80 text-lg">Загрузка...</div>
        </template>
        <template v-else-if="errorMsg">
          <div class="text-error text-center">{{ errorMsg }}</div>
        </template>
        <template v-else>
          <ModuleContent
            :title="moduleData?.title || ''"
            :rendered-content="renderedContent"
            :module-number="moduleNumbers[moduleData?.slug || '']"
          />
          <template v-if="moduleData?.slug === 'intro-to-ai'">
            <ModuleProgressStatus
              :progress-loading="progressLoading"
              :completed="!!moduleProgress[moduleData.slug]"
              :score="moduleProgress[moduleData.slug]?.score"
            />
            <ModuleInteractiveBlock
              v-if="!moduleProgress[moduleData.slug]"
              video-url="https://www.youtube.com/watch?v=2ePf9rue1Ao"
              :completed="!!moduleProgress[moduleData.slug]"
              @landscapeMode="handleLandscapeMode"
              @completed="handleCompleted"
            />
          </template>
          <template v-else-if="moduleData?.slug === 'machine-learning'">
            <ModuleProgressStatus
              :progress-loading="progressLoading"
              :completed="!!moduleProgress[moduleData.slug]"
              :score="moduleProgress[moduleData.slug]?.score"
            />
            <ModuleInteractiveBlock
              v-if="!moduleProgress[moduleData.slug]"
              video-url="https://www.youtube.com/watch?v=ukzFI9rgwfU"
              :questions="[
                {
                  time: 20,
                  question: 'Что такое машинное обучение?',
                  options: [
                    'Область ИИ, где компьютеры учатся на данных',
                    'Вид спорта',
                    'Ручное программирование алгоритмов',
                  ],
                  correct: 0,
                },
                {
                  time: 60,
                  question: 'Что такое обучающая выборка?',
                  options: [
                    'Данные для тестирования',
                    'Данные для обучения модели',
                    'Случайные числа',
                  ],
                  correct: 1,
                },
                {
                  time: 100,
                  question: 'Какой тип задачи ML — это прогноз цены квартиры?',
                  options: ['Классификация', 'Кластеризация', 'Регрессия'],
                  correct: 2,
                },
              ]"
              :completed="!!moduleProgress[moduleData.slug]"
              @completed="handleCompleted"
            />
          </template>
          <template v-else-if="moduleData?.slug === 'neural-networks'">
            <ModuleProgressStatus
              :progress-loading="progressLoading"
              :completed="!!moduleProgress[moduleData.slug]"
              :score="moduleProgress[moduleData.slug]?.score"
            />
            <ModuleInteractiveBlock
              v-if="!moduleProgress[moduleData.slug]"
              video-url="https://www.youtube.com/watch?v=aircAruvnKk"
              :questions="[
                {
                  time: 25,
                  question: 'Что вдохновило создание искусственных нейронных сетей?',
                  options: ['Работа человеческого мозга', 'Классическая физика', 'Интернет'],
                  correct: 0,
                },
                {
                  time: 60,
                  question: 'Как называются слои между входным и выходным в нейронной сети?',
                  options: ['Скрытые', 'Внешние', 'Центральные'],
                  correct: 0,
                },
                {
                  time: 110,
                  question: 'Для чего используются функции активации в нейронных сетях?',
                  options: [
                    'Для передачи сигнала между нейронами',
                    'Для хранения данных',
                    'Для сортировки информации',
                  ],
                  correct: 0,
                },
              ]"
              :completed="!!moduleProgress[moduleData.slug]"
              @completed="handleCompleted"
            />
          </template>
          <template v-else-if="moduleData?.slug === 'data-processing'">
            <ModuleProgressStatus
              :progress-loading="progressLoading"
              :completed="!!moduleProgress[moduleData.slug]"
              :score="moduleProgress[moduleData.slug]?.score"
            />
            <ModuleInteractiveBlock
              v-if="!moduleProgress[moduleData.slug]"
              video-url="https://www.youtube.com/watch?v=pqNCD_5r0IU"
              :questions="[
                {
                  time: 20,
                  question: 'Что такое обработка данных?',
                  options: [
                    'Подготовка данных для моделей',
                    'Создание новых моделей',
                    'Сбор данных',
                  ],
                  correct: 0,
                },
                {
                  time: 60,
                  question: 'Что включает этап очистки данных?',
                  options: ['Удаление ошибок и пропусков', 'Обучение модели', 'Визуализация'],
                  correct: 0,
                },
                {
                  time: 100,
                  question: 'Почему важна нормализация данных?',
                  options: [
                    'Для ускорения обучения и повышения качества',
                    'Для хранения данных',
                    'Для создания графиков',
                  ],
                  correct: 0,
                },
              ]"
              :completed="!!moduleProgress[moduleData.slug]"
              @completed="handleCompleted"
            />
          </template>
          <template v-else-if="moduleData?.slug === 'ai-applications'">
            <ModuleProgressStatus
              :progress-loading="progressLoading"
              :completed="!!moduleProgress[moduleData.slug]"
              :score="moduleProgress[moduleData.slug]?.score"
            />
            <ModuleInteractiveBlock
              v-if="!moduleProgress[moduleData.slug]"
              video-url="https://www.youtube.com/watch?v=2ePf9rue1Ao"
              :questions="[
                {
                  time: 30,
                  question: 'Где применяется ИИ?',
                  options: [
                    'Только в играх',
                    'В разных сферах: медицина, транспорт, развлечения',
                    'Только в интернете',
                  ],
                  correct: 1,
                },
                {
                  time: 70,
                  question: 'Что такое рекомендательная система?',
                  options: [
                    'Система для рекомендаций фильмов, товаров и т.д.',
                    'Система для хранения данных',
                    'Система для защиты информации',
                  ],
                  correct: 0,
                },
                {
                  time: 120,
                  question: 'Как ИИ помогает в медицине?',
                  options: ['Диагностика по снимкам', 'Создание музыки', 'Управление заводом'],
                  correct: 0,
                },
              ]"
              :completed="!!moduleProgress[moduleData.slug]"
              @completed="handleCompleted"
            />
          </template>
          <template v-else-if="moduleData?.slug === 'ethics-future'">
            <ModuleProgressStatus
              :progress-loading="progressLoading"
              :completed="!!moduleProgress[moduleData.slug]"
              :score="moduleProgress[moduleData.slug]?.score"
            />
            <ModuleInteractiveBlock
              v-if="!moduleProgress[moduleData.slug]"
              video-url="https://www.youtube.com/watch?v=0bMe_vCZo30"
              :questions="[
                {
                  time: 25,
                  question: 'Почему важна этика в ИИ?',
                  options: [
                    'Для объяснимости и безопасности',
                    'Для ускорения работы',
                    'Для экономии энергии',
                  ],
                  correct: 0,
                },
                {
                  time: 60,
                  question: 'Какой вопрос связан с приватностью?',
                  options: ['Защита персональных данных', 'Скорость работы', 'Качество видео'],
                  correct: 0,
                },
                {
                  time: 110,
                  question: 'Какое влияние ИИ может оказать на рынок труда?',
                  options: [
                    'Изменение профессий и появление новых',
                    'Увеличение количества фильмов',
                    'Снижение цен на продукты',
                  ],
                  correct: 0,
                },
              ]"
              :completed="!!moduleProgress[moduleData.slug]"
              @completed="handleCompleted"
            />
          </template>
        </template>
      </div>
    </main>
    <SiteFooter v-if="showHeaderFooter" />
  </div>
</template>

<script lang="ts">
export default {}
</script>
