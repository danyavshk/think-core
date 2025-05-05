<template>
  <div
    class="min-h-screen flex flex-col bg-surface dark:bg-surface-dark transition-colors duration-300"
  >
    <SiteHeader />
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-12 pt-20">
      <div class="w-full max-w-4xl mx-auto">
        <h2
          class="text-2xl md:text-3xl font-black text-onSurface dark:text-onSurface-dark mb-10 text-center uppercase tracking-widest font-sans"
        >
          Магазин бейджей
        </h2>
        <BadgeShop />
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import BadgeShop from '../components/BadgeShop.vue'
</script>
