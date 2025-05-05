<script setup lang="ts">
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-surface dark:bg-surface-dark transition-colors duration-300"
  >
    <SiteHeader />
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <section
        class="w-full max-w-2xl bg-white/90 dark:bg-neutral-900/90 border border-gray-200 dark:border-neutral-800 shadow-material-lg rounded-2xl px-6 py-10 flex flex-col items-center gap-6 relative overflow-hidden transition-colors duration-300"
      >
        <h1
          class="text-3xl sm:text-4xl font-extrabold text-center text-onSurface dark:text-onSurface-dark mb-2"
        >
          О курсе и искусственном интеллекте
        </h1>
        <p class="text-lg text-onSurface/80 dark:text-onSurface-dark/80 text-center max-w-xl">
          Искусственный интеллект (ИИ) — это не просто технология будущего, а уже часть нашей
          повседневной жизни. От умных помощников и рекомендательных систем до медицины, образования
          и творчества — ИИ меняет мир прямо сейчас.
        </p>
        <div class="w-full flex flex-col sm:flex-row gap-4 mt-4">
          <div
            class="flex-1 bg-primary/10 dark:bg-primary/20 rounded-xl p-4 flex flex-col items-center"
          >
            <span class="text-2xl font-bold text-primary dark:text-primary-light mb-2">95%</span>
            <span class="text-onSurface/70 dark:text-onSurface-dark/70 text-center text-sm"
              >Компаний считают ИИ ключом к конкурентоспособности в ближайшие 5 лет</span
            >
          </div>
          <div
            class="flex-1 bg-primary/10 dark:bg-primary/20 rounded-xl p-4 flex flex-col items-center"
          >
            <span class="text-2xl font-bold text-primary dark:text-primary-light mb-2">> 50%</span>
            <span class="text-onSurface/70 dark:text-onSurface-dark/70 text-center text-sm"
              >Профессий будут трансформированы благодаря ИИ уже к 2030 году</span
            >
          </div>
        </div>
        <p class="text-base text-onSurface/70 dark:text-onSurface-dark/70 text-center mt-6">
          Наш курс — это ваш проводник в мир искусственного интеллекта. Вы узнаете, как работают
          современные нейросети, как ИИ помогает людям, и как вы сами можете создавать умные
          решения. Независимо от уровня подготовки, вы сможете освоить базовые и продвинутые
          концепции, а также применить знания на практике.
        </p>
        <div class="mt-8 flex flex-col items-center gap-2">
          <span class="text-lg font-semibold text-onSurface dark:text-onSurface-dark"
            >Почему стоит изучать ИИ?</span
          >
          <ul
            class="list-disc pl-6 text-onSurface/80 dark:text-onSurface-dark/80 text-left text-base"
          >
            <li>ИИ — драйвер инноваций и развития во всех сферах</li>
            <li>Навыки работы с ИИ востребованы на рынке труда</li>
            <li>Понимание ИИ помогает принимать решения в цифровом мире</li>
            <li>Это интересно, современно и открывает новые горизонты!</li>
          </ul>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
