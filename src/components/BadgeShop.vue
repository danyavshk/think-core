<template>
  <div>
    <div v-if="loading" class="text-center text-onSurface/70 dark:text-onSurface-dark/70 py-8">
      Загрузка бейджей...
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <BadgeCard
        v-for="badge in badges"
        :key="badge.id"
        :badge="badge"
        :owned="userBadgesMap[badge.id]?.is_active === true"
        :active="userBadgesMap[badge.id]?.is_active"
        :can-buy="isRealBadge(badge) && userScore >= badge.price && !userBadgesMap[badge.id]"
        :demo="!isRealBadge(badge)"
        @buy="isRealBadge(badge) ? buyBadge(badge) : null"
      />
    </div>
    <div v-if="errorMsg" class="text-error text-center mt-4">{{ errorMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../supabase'
import { useGamificationStore } from '../stores/gamification'
import BadgeCard from './BadgeCard.vue'
import type { Badge } from '../types/badge'

const badges = ref<Badge[]>([])
const userBadges = ref<{ badge_id: string; is_active: boolean }[]>([])
const loading = ref(true)
const errorMsg = ref('')
const gamification = useGamificationStore()
const userScore = computed(() => gamification.totalScore)

const mockBadges: Badge[] = [
  {
    id: 'mock-1',
    name: 'Пионер',
    description: 'Первый шаг в мир ИИ! Открывается за регистрацию.',
    icon: '🚀',
    price: 0,
    type: 'achievement',
    is_active: false,
    // effect: 'glow',
  },
  {
    id: 'mock-2',
    name: 'Гуру данных',
    description: 'Получен за прохождение 3 модулей или покупку.',
    icon: '📊',
    price: 150,
    type: 'progress',
    is_active: false,
    // effect: 'pulse',
  },
  {
    id: 'mock-3',
    name: 'Ночной режим',
    description: 'Для настоящих сов! Купи за баллы.',
    icon: '🌙',
    price: 100,
    type: 'fun',
    is_active: false,
    // effect: 'dark-glow',
  },
]

const userBadgesMap = computed<Record<string, { is_active: boolean }>>(() => {
  const map: Record<string, { is_active: boolean }> = {}
  for (const b of userBadges.value) map[b.badge_id] = { is_active: b.is_active }
  return map
})

const isRealBadge = (badge: Badge) => /^[0-9a-fA-F-]{36}$/.test(String(badge.id))

onMounted(async () => {
  loading.value = true
  try {
    const { data: badgeList, error: badgeErr } = await supabase.from('badges').select('*')
    if (badgeErr) throw badgeErr
    badges.value = badgeList && badgeList.length > 0 ? (badgeList as Badge[]) : mockBadges
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return
    const { data: userBadgeList } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', authData.user.id)
    userBadges.value = (userBadgeList as { badge_id: string; is_active: boolean }[]) || []
  } catch (e: unknown) {
    badges.value = mockBadges
    errorMsg.value = e instanceof Error ? e.message : String(e) || 'Ошибка загрузки бейджей.'
  } finally {
    loading.value = false
  }
})

async function buyBadge(badge: Badge) {
  errorMsg.value = ''
  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) throw new Error('Необходима авторизация!')
    if (userScore.value < (badge.price ?? 0)) throw new Error('Недостаточно баллов!')
    const { error } = await supabase
      .from('user_badges')
      .insert([{ user_id: authData.user.id, badge_id: badge.id, is_active: false }])
    if (error) throw error
    userBadges.value.push({ badge_id: String(badge.id), is_active: false })
    gamification.loadProgress()
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : String(e) || 'Ошибка покупки бейджа.'
  }
}
</script>

<script lang="ts">
export default {}
</script>
