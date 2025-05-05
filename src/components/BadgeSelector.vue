<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/60 backdrop-blur-sm"
  >
    <div
      class="relative w-full max-w-md bg-white/95 dark:bg-neutral-900/95 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-material-lg p-6 flex flex-col transition-colors duration-300"
    >
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full text-onSurface dark:text-onSurface-dark hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors duration-150"
        title="Закрыть"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <h2 class="text-xl font-bold text-onSurface dark:text-onSurface-dark text-center mb-6">
        Выбор бейджа
      </h2>
      <div v-if="loading" class="text-center text-onSurface/70 dark:text-onSurface-dark/70 py-8">
        Загрузка...
      </div>
      <div v-else class="grid grid-cols-2 gap-4">
        <button
          v-for="badge in userBadges"
          :key="badge.id"
          @click="setActiveBadge(badge)"
          :class="[
            'flex flex-col items-center p-4 rounded-xl border transition',
            badge.is_active
              ? 'border-primary bg-primary/10 dark:bg-primary/20'
              : 'border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 hover:border-primary',
          ]"
        >
          <span class="text-3xl mb-1">{{ badge.icon }}</span>
          <span class="font-bold text-sm text-onSurface dark:text-onSurface-dark mb-1">{{
            badge.name
          }}</span>
          <span v-if="badge.is_active" class="text-xs text-green-600 font-semibold mt-1"
            >Активно</span
          >
        </button>
      </div>
      <div v-if="errorMsg" class="text-error text-center mt-4">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue'
import { supabase } from '../supabase'
import type { Badge } from '../types/badge'

const emit = defineEmits(['close', 'badge-changed'])

const userBadges = ref<Badge[]>([])
const badges = ref<Badge[]>([])
const selectedBadge = ref<Badge | null>(null)
const showModal = ref(false)
const loading = ref(true)
const errorMsg = ref('')

async function setActiveBadge(badge: Badge) {
  errorMsg.value = ''
  try {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) throw new Error('Необходима авторизация!')

    const { error } = await supabase
      .from('user_badges')
      .update({ is_active: false })
      .eq('user_id', userData.user.id)
      .eq('is_active', true)

    if (error) throw error

    const { error: updateError } = await supabase
      .from('user_badges')
      .update({ is_active: true })
      .eq('user_id', userData.user.id)
      .eq('badge_id', badge.id)

    if (updateError) throw updateError

    selectedBadge.value = null
    showModal.value = false
    await fetchUserBadges()
    emit('badge-changed')
  } catch (error: unknown) {
    errorMsg.value = error instanceof Error ? error.message : String(error)
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await fetchUserBadges()
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
})

async function fetchUserBadges() {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('Необходима авторизация!')

  const { data, error } = await supabase
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', userData.user.id)

  if (error) {
    console.error('Error fetching user badges:', error)
    errorMsg.value = error.message || JSON.stringify(error)
    return
  }

  userBadges.value = (data as any[]).map((b) => ({
    ...b.badges,
    is_active: b.is_active,
  }))
}

async function fetchBadges() {
  const { data, error } = await supabase.from('badges').select('*')

  if (error) {
    console.error('Error fetching badges:', error)
    return
  }

  badges.value = data as Badge[]
}

onMounted(async () => {
  await fetchBadges()
})
</script>

<script lang="ts">
export default {}
</script>
