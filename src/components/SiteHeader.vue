<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'
import LoginButton from './LoginButton.vue'
import RegisterButton from './RegisterButton.vue'
import LoginModal from './LoginModal.vue'
import RegisterModal from './RegisterModal.vue'

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  avatar_url: string | null
}

const showLogin = ref(false)
const showRegister = ref(false)
const profile = ref<Profile | null>(null)
const router = useRouter()
const isDark = ref(document.documentElement.classList.contains('dark'))

onMounted(async () => {
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (user) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!error) profile.value = data as Profile
  }
})

const logout = async () => {
  await supabase.auth.signOut()
  window.location.reload()
}

function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <header
    class="w-full py-2 sm:py-4 px-2 sm:px-6 bg-white/80 dark:bg-neutral-900/90 backdrop-blur shadow-material sticky top-0 z-50 border-b border-gray-200 dark:border-neutral-800 sm:border sm:rounded-xl"
  >
    <div class="flex items-center w-full">
      <div
        class="flex items-center gap-2 select-none flex-none"
        @click="() => router.push('/')"
        style="cursor: pointer"
      >
        <span class="inline-block">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0"
              y="0"
              width="36"
              height="36"
              rx="10"
              :fill="isDark ? '#222' : '#fff'"
              fill-opacity="0.95"
            />
            <g>
              <rect
                x="7"
                y="22"
                width="22"
                height="4"
                rx="2"
                :fill="isDark ? '#90caf9' : '#1976d2'"
              />
              <rect
                x="10"
                y="18"
                width="16"
                height="4"
                rx="2"
                :fill="isDark ? '#bdbdbd' : '#90caf9'"
              />
              <rect
                x="13"
                y="12"
                width="10"
                height="6"
                rx="2"
                :fill="isDark ? '#1976d2' : '#1976d2'"
              />
            </g>
          </svg>
        </span>
        <span
          class="text-lg sm:text-2xl font-extrabold text-onSurface dark:text-onSurface-dark leading-none tracking-tight"
          >ThinkForge</span
        >
      </div>
      <div class="hidden sm:flex flex-1 justify-center items-center h-full">
        <router-link
          v-if="profile"
          to="/badges"
          class="px-3 py-1.5 rounded-md bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-semibold text-sm hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors duration-150 flex items-center gap-2"
          title="Магазин бейджей"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            viewBox="0 0 24 24"
          >
            <rect
              x="3"
              y="6"
              width="18"
              height="13"
              rx="2"
              stroke="currentColor"
              stroke-width="2.2"
            />
            <path d="M16 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
          </svg>
          <span class="hidden sm:inline">Магазин</span>
        </router-link>
      </div>
      <div class="flex items-center gap-2 sm:gap-4 flex-none ml-auto sm:ml-0">
        <button
          @click="toggleTheme"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200 focus:outline-none"
          title="Переключить тему"
        >
          <svg
            v-if="!isDark"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-primary dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="5" />
            <path
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-primary dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
        </button>
        <template v-if="profile">
          <button
            @click="() => router.push('/profile')"
            class="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-lg font-bold text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/30 transition select-none overflow-hidden border border-primary/30 dark:border-primary/40"
            title="Профиль"
          >
            <template v-if="profile.avatar_url">
              <img :src="profile.avatar_url" alt="avatar" class="w-full h-full object-cover" />
            </template>
            <template v-else>
              {{ profile.first_name?.[0] || '' }}{{ profile.last_name?.[0] || '' }}
            </template>
          </button>
          <button
            @click="logout"
            class="ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-error/10 border border-error/30 text-error hover:bg-error/20 transition"
            title="Выйти"
          >
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              viewBox="0 0 22 22"
            >
              <path d="M15 7L19 11L15 15" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M19 11H8" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M12 19C7.58172 19 4 15.4183 4 11C4 6.58172 7.58172 3 12 3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </template>
        <template v-else>
          <div class="hidden sm:flex gap-2">
            <LoginButton @click="showLogin = true" />
            <RegisterButton @click="showRegister = true" />
          </div>
        </template>
      </div>
    </div>
    <div class="flex sm:hidden w-full justify-center mt-2" v-if="!profile">
      <div class="flex gap-3">
        <LoginButton @click="showLogin = true" />
        <RegisterButton @click="showRegister = true" />
      </div>
    </div>
    <div class="flex sm:hidden w-full justify-center mt-2">
      <router-link
        v-if="profile"
        to="/badges"
        class="px-3 py-1.5 rounded-md bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-semibold text-sm hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors duration-150 flex items-center gap-2"
        title="Магазин бейджей"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          viewBox="0 0 24 24"
        >
          <rect
            x="3"
            y="6"
            width="18"
            height="13"
            rx="2"
            stroke="currentColor"
            stroke-width="2.2"
          />
          <path d="M16 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        </svg>
        <span>Магазин</span>
      </router-link>
    </div>
    <div
      class="fixed bottom-0 left-0 w-full flex justify-center gap-2 pb-4 bg-transparent pointer-events-none z-50 sm:hidden"
    >
      <div class="flex gap-2 pointer-events-auto" v-if="!profile">
        <LoginButton @click="showLogin = true" />
        <RegisterButton @click="showRegister = true" />
      </div>
    </div>
    <LoginModal v-if="showLogin" @close="showLogin = false" />
    <RegisterModal v-if="showRegister" @close="showRegister = false" />
  </header>
</template>

<script lang="ts">
export default {}
</script>
