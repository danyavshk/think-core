<template>
  <div
    class="relative w-full max-w-2xl mx-auto bg-white/90 dark:bg-neutral-900/90 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-material-lg p-6 sm:p-10 flex flex-col items-center gap-4 overflow-hidden transition-colors duration-300"
  >
    <div class="absolute top-4 right-4 flex gap-2 z-20 hidden sm:flex">
      <button
        @click="$emit('edit')"
        class="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/30 transition"
        title="Редактировать профиль"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          viewBox="0 0 20 20"
        >
          <path
            d="M15.232 5.232l-10 10M17.657 2.343a2 2 0 0 1 0 2.828l-1.414 1.414-2.828-2.828 1.414-1.414a2 2 0 0 1 2.828 0z"
          />
        </svg>
      </button>
      <button
        @click="$emit('select-badge')"
        class="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/30 transition"
        title="Сменить бейдж"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          viewBox="0 0 20 20"
        >
          <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2.2" />
          <path
            d="M10 6v4l2.5 2.5"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <button
        @click="$emit('toggle-stats')"
        class="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/30 transition"
        title="Показать/скрыть статистику"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          viewBox="0 0 20 20"
        >
          <path d="M3 10s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
          <circle cx="10" cy="10" r="2" />
        </svg>
      </button>
    </div>
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
      <div class="absolute bottom-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl"></div>
    </div>
    <div class="relative z-10 flex flex-col items-center w-full">
      <div
        class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/10 border-2 border-primary/30 shadow flex items-center justify-center text-4xl font-bold text-primary dark:text-white mb-2 select-none overflow-hidden"
      >
        <template v-if="profile">
          <img
            v-if="profile.avatar_url"
            :src="profile.avatar_url"
            alt="avatar"
            class="w-full h-full object-cover"
          />
          <span v-else>{{ profile.first_name?.[0] || '' }}{{ profile.last_name?.[0] || '' }}</span>
        </template>
        <span v-else>?</span>
      </div>
      <div v-if="activeBadge" class="mt-1 mb-1 flex justify-center w-full">
        <span :title="activeBadge.name" class="text-3xl sm:text-4xl drop-shadow-glow select-none">{{
          activeBadge.icon
        }}</span>
      </div>
      <div
        class="text-2xl sm:text-3xl font-bold text-onSurface dark:text-onSurface-dark mb-1 text-center"
        v-if="profile"
      >
        {{ profile.first_name || 'Имя' }} {{ profile.last_name || 'Фамилия' }}
      </div>
      <div
        class="text-onSurface/80 dark:text-onSurface-dark/80 text-base mb-2 text-center w-full"
        v-if="profile"
      >
        {{ profile.email }}
      </div>
      <div class="flex sm:hidden flex-row gap-2 w-full justify-center mt-2 mb-1">
        <button
          @click="$emit('edit')"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/30 transition"
          title="Редактировать профиль"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            viewBox="0 0 20 20"
          >
            <path
              d="M15.232 5.232l-10 10M17.657 2.343a2 2 0 0 1 0 2.828l-1.414 1.414-2.828-2.828 1.414-1.414a2 2 0 0 1 2.828 0z"
            />
          </svg>
        </button>
        <button
          @click="$emit('select-badge')"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/30 transition"
          title="Сменить бейдж"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            viewBox="0 0 20 20"
          >
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2.2" />
            <path
              d="M10 6v4l2.5 2.5"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          @click="$emit('toggle-stats')"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/30 transition"
          title="Показать/скрыть статистику"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            viewBox="0 0 20 20"
          >
            <path d="M3 10s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
            <circle cx="10" cy="10" r="2" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

defineProps<{
  profile: {
    first_name: string | null
    last_name: string | null
    email: string | null
    avatar_url: string | null
  } | null
}>()

const activeBadge = ref<{ icon: string; name: string } | null>(null)

onMounted(async () => {
  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return
    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badge:badges(*)')
      .eq('user_id', authData.user.id)
      .eq('is_active', true)
      .single()
    if (!error && data && data.badge) {
      activeBadge.value = { icon: data.badge.icon, name: data.badge.name }
    }
  } catch {}
})
</script>

<script lang="ts">
export default {}
</script>
