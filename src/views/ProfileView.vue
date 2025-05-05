<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { supabase } from '../supabase'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import UserProgressStats from '../components/UserProgressStats.vue'
import UserProfileCard from '../components/UserProfileCard.vue'
import { useGamificationStore } from '../stores/gamification'
import BadgeSelector from '../components/BadgeSelector.vue'

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  avatar_url: string | null
}

const profile = ref<Profile | null>(null)
const editing = ref(false)
const editFirstName = ref('')
const editLastName = ref('')
const editAvatar = ref('')
const saveError = ref('')
const gamification = useGamificationStore()
const showStats = ref(true)
const showBadgeSelector = ref(false)

// Для динамической высоты
const profileSectionRef = ref<HTMLElement | null>(null)
const profileHeight = ref(0)

const updateProfileHeight = () => {
  if (profileSectionRef.value) {
    profileHeight.value = profileSectionRef.value.offsetHeight
  }
}

onMounted(async () => {
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (user) {
    await gamification.loadProgress()
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!error) profile.value = data as Profile
  }
  nextTick(updateProfileHeight)
})

watch([showStats, editing], () => nextTick(updateProfileHeight))

const startEdit = () => {
  editing.value = true
  editFirstName.value = profile.value?.first_name || ''
  editLastName.value = profile.value?.last_name || ''
  editAvatar.value = profile.value?.avatar_url || ''
  saveError.value = ''
}

const toggleStats = () => {
  showStats.value = !showStats.value
  nextTick(updateProfileHeight)
}

const saveProfile = async () => {
  if (!profile.value) return

  const { id } = profile.value

  const { data, error } = await supabase
    .from('profiles')
    .update({
      first_name: editFirstName.value,
      last_name: editLastName.value,
      avatar_url: editAvatar.value,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating profile:', error)
    saveError.value = 'Произошла ошибка при обновлении профиля. Пожалуйста, попробуйте позже.'
  } else {
    await refreshProfile()
    editing.value = false
  }
  nextTick(updateProfileHeight)
}

const cancelEdit = () => {
  editing.value = false
  editFirstName.value = profile.value?.first_name || ''
  editLastName.value = profile.value?.last_name || ''
  editAvatar.value = profile.value?.avatar_url || ''
  saveError.value = ''
  nextTick(updateProfileHeight)
}

const refreshProfile = async () => {
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (user) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!error) profile.value = data as Profile
  }
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-surface dark:bg-surface-dark transition-colors duration-300"
  >
    <SiteHeader />
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div
        :class="[
          'w-full max-w-4xl flex gap-8',
          showStats
            ? 'flex-col sm:flex-row items-stretch justify-center'
            : 'flex-col items-center justify-center',
        ]"
      >
        <section
          ref="profileSectionRef"
          class="w-full max-w-md bg-white/90 dark:bg-neutral-900/90 border border-gray-200 dark:border-neutral-800 shadow-material-lg rounded-2xl px-6 py-8 flex flex-col items-center relative overflow-hidden transition-colors duration-300"
        >
          <template v-if="!editing">
            <UserProfileCard
              :profile="profile"
              @edit="startEdit"
              @toggle-stats="toggleStats"
              @select-badge="showBadgeSelector = true"
            />
            <BadgeSelector
              v-if="showBadgeSelector"
              @close="showBadgeSelector = false"
              @badge-changed="refreshProfile"
            />
          </template>
          <form
            v-else
            @submit.prevent="saveProfile"
            class="flex flex-col gap-3 w-full max-w-xs mb-4 mt-4"
          >
            <label class="flex flex-col gap-1">
              <span class="text-xs text-onSurface/70 dark:text-onSurface-dark/70">Имя</span>
              <input
                v-model="editFirstName"
                type="text"
                placeholder="Имя"
                class="rounded-md px-4 py-2 bg-surface dark:bg-surface-dark text-onSurface dark:text-onSurface-dark placeholder-onSurface/40 dark:placeholder-onSurface-dark/40 border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label class="flex flex-col gap-1">
              <span class="text-xs text-onSurface/70 dark:text-onSurface-dark/70">Фамилия</span>
              <input
                v-model="editLastName"
                type="text"
                placeholder="Фамилия"
                class="rounded-md px-4 py-2 bg-surface dark:bg-surface-dark text-onSurface dark:text-onSurface-dark placeholder-onSurface/40 dark:placeholder-onSurface-dark/40 border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label class="flex flex-col gap-1">
              <span class="text-xs text-onSurface/70 dark:text-onSurface-dark/70"
                >URL аватара (опционально)</span
              >
              <input
                v-model="editAvatar"
                type="url"
                placeholder="URL аватара (опционально)"
                class="rounded-md px-4 py-2 bg-surface dark:bg-surface-dark text-onSurface dark:text-onSurface-dark placeholder-onSurface/40 dark:placeholder-onSurface-dark/40 border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <div class="flex gap-2 mt-2">
              <button
                type="submit"
                class="flex-1 bg-white/90 dark:bg-neutral-900/90 border border-gray-300 dark:border-neutral-700 text-onSurface dark:text-onSurface-dark font-semibold text-base rounded-md px-4 py-1.5 transition-colors duration-150 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Сохранить
              </button>
              <button
                type="button"
                @click="cancelEdit"
                class="flex-1 bg-white/90 dark:bg-neutral-900/90 border border-gray-300 dark:border-neutral-700 text-onSurface dark:text-onSurface-dark font-semibold text-base rounded-md px-4 py-1.5 transition-colors duration-150 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Отмена
              </button>
            </div>
            <div v-if="saveError" class="text-red-400 text-xs text-center mt-2">
              {{ saveError }}
            </div>
          </form>
        </section>
        <div
          v-if="showStats"
          class="flex-1 w-full mt-8 sm:mt-0 flex flex-col sm:max-w-xl sm:max-h-[9999px]"
        >
          <UserProgressStats />
        </div>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
