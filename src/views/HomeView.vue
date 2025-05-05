<script setup lang="ts">
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import CourseModuleCard from '../components/CourseModuleCard.vue'
import { ref } from 'vue'
import { supabase } from '../supabase'
import LoginModal from '../components/LoginModal.vue'
import RegisterModal from '../components/RegisterModal.vue'
import { useRouter } from 'vue-router'
import { useGamificationStore } from '../stores/gamification'

const gamificationStore = useGamificationStore()

const modules = [
  {
    title: 'Введение в ИИ',
    description: 'Что такое искусственный интеллект, история и основные понятия.',
    slug: 'intro-to-ai',
    moduleNumber: 1,
    buttonText: 'Перейти',
  },
  {
    title: 'Машинное обучение',
    description: 'Основы машинного обучения, типы задач и алгоритмы.',
    slug: 'machine-learning',
    moduleNumber: 2,
    buttonText: 'Перейти',
  },
  {
    title: 'Нейронные сети',
    description: 'Принципы работы и архитектуры нейронных сетей.',
    slug: 'neural-networks',
    moduleNumber: 3,
    buttonText: 'Перейти',
  },
  {
    title: 'Обработка данных',
    description: 'Работа с данными, подготовка и анализ.',
    slug: 'data-processing',
    moduleNumber: 4,
    buttonText: 'Перейти',
  },
  {
    title: 'Применение ИИ',
    description: 'Реальные кейсы и сферы применения искусственного интеллекта.',
    slug: 'ai-applications',
    moduleNumber: 5,
    buttonText: 'Перейти',
  },
  {
    title: 'Этика и будущее',
    description: 'Этические вопросы и перспективы развития ИИ.',
    slug: 'ethics-future',
    moduleNumber: 6,
    buttonText: 'Перейти',
  },
]

const currentIndex = ref(0)
const showLogin = ref(false)
const showRegister = ref(false)
const router = useRouter()

const showPrev = () => {
  if (currentIndex.value > 0) currentIndex.value--
}
const showNext = () => {
  if (currentIndex.value < modules.length - 1) currentIndex.value++
}

async function handleGoModule(slug: string) {
  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) {
      showLogin.value = true
      return
    }
    await gamificationStore.loadProgress()
    router.push(`/modules/${slug}`)
  } catch (error) {
    console.error('Ошибка при переходе к модулю:', error)
  }
}

function handleAbout() {
  router.push('/about')
}

function handleLoginSuccess() {
  showLogin.value = false
  gamificationStore.loadProgress()
}

function handleRegisterSuccess() {
  showRegister.value = false
  gamificationStore.loadProgress()
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-surface dark:bg-surface-dark transition-colors duration-300"
  >
    <SiteHeader />
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-12 pt-20">
      <h2
        class="text-2xl md:text-3xl font-black text-onSurface dark:text-onSurface-dark mb-10 text-center uppercase tracking-widest font-sans"
      >
        Модули курса
      </h2>
      <div class="w-full max-w-6xl mx-auto">
        <div class="hidden sm:flex flex-wrap justify-center gap-8 items-stretch">
          <CourseModuleCard
            v-for="(mod, i) in modules"
            :key="i"
            :title="mod.title"
            :description="mod.description"
            :buttonText="mod.buttonText"
            :moduleNumber="mod.moduleNumber"
            :slug="mod.slug"
            @goModule="handleGoModule"
          />
        </div>
        <div class="flex sm:hidden flex-col items-center w-full mt-2">
          <div class="flex justify-center w-full">
            <CourseModuleCard v-bind="modules[currentIndex]" class="max-w-xs w-[90vw] mx-auto" />
          </div>
          <div class="flex items-center justify-center gap-3 mt-4">
            <button
              @click="showPrev"
              :disabled="currentIndex === 0"
              class="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-neutral-700 rounded-full bg-white/90 dark:bg-neutral-900/90 text-primary dark:text-primary-light transition hover:bg-primary/10 dark:hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-30"
              aria-label="Предыдущий модуль"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 20 20"
              >
                <path d="M13 16L7 10L13 4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button
              @click="showNext"
              :disabled="currentIndex === modules.length - 1"
              class="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-neutral-700 rounded-full bg-white/90 dark:bg-neutral-900/90 text-primary dark:text-primary-light transition hover:bg-primary/10 dark:hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-30"
              aria-label="Следующий модуль"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 20 20"
              >
                <path d="M7 4L13 10L7 16" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex justify-center mt-12">
          <button
            class="px-8 py-2 border border-primary text-primary dark:text-primary-light font-bold uppercase tracking-widest rounded transition-colors duration-200 hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-neutral-900 shadow-none text-base"
            @click="handleAbout"
          >
            Подробнее о курсе
          </button>
        </div>
      </div>
      <LoginModal v-if="showLogin" @close="showLogin = false" @success="handleLoginSuccess" />
      <RegisterModal
        v-if="showRegister"
        @close="showRegister = false"
        @success="handleRegisterSuccess"
      />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.drop-shadow-glow {
  filter: drop-shadow(0 0 12px #a21caf88) drop-shadow(0 0 4px #6366f1cc);
}

.flex.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>

<script lang="ts">
export default {}
</script>
