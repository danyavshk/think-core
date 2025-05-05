<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/60 backdrop-blur-sm"
  >
    <div
      class="relative w-full max-w-xs sm:max-w-sm bg-white/95 dark:bg-neutral-900/95 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-material-lg p-6 flex flex-col transition-colors duration-300"
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
        Регистрация
      </h2>
      <form @submit.prevent="register" class="flex flex-col gap-4">
        <label class="flex flex-col gap-1">
          <span class="text-xs text-onSurface/70 dark:text-onSurface-dark/70">Имя</span>
          <input
            v-model="firstName"
            type="text"
            required
            placeholder="Имя"
            class="rounded-md px-4 py-2 bg-surface dark:bg-surface-dark text-onSurface dark:text-onSurface-dark placeholder-onSurface/40 dark:placeholder-onSurface-dark/40 border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs text-onSurface/70 dark:text-onSurface-dark/70">Фамилия</span>
          <input
            v-model="lastName"
            type="text"
            required
            placeholder="Фамилия"
            class="rounded-md px-4 py-2 bg-surface dark:bg-surface-dark text-onSurface dark:text-onSurface-dark placeholder-onSurface/40 dark:placeholder-onSurface-dark/40 border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs text-onSurface/70 dark:text-onSurface-dark/70">Email</span>
          <input
            v-model="email"
            type="email"
            required
            placeholder="Email"
            class="rounded-md px-4 py-2 bg-surface dark:bg-surface-dark text-onSurface dark:text-onSurface-dark placeholder-onSurface/40 dark:placeholder-onSurface-dark/40 border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs text-onSurface/70 dark:text-onSurface-dark/70">Пароль</span>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Пароль"
            class="rounded-md px-4 py-2 bg-surface dark:bg-surface-dark text-onSurface dark:text-onSurface-dark placeholder-onSurface/40 dark:placeholder-onSurface-dark/40 border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs text-onSurface/70 dark:text-onSurface-dark/70"
            >Повторите пароль</span
          >
          <input
            v-model="confirm"
            type="password"
            required
            placeholder="Повторите пароль"
            class="rounded-md px-4 py-2 bg-surface dark:bg-surface-dark text-onSurface dark:text-onSurface-dark placeholder-onSurface/40 dark:placeholder-onSurface-dark/40 border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <button
          type="submit"
          :disabled="loading"
          class="mt-2 px-4 py-2 rounded-md bg-primary text-white font-bold shadow hover:bg-primary/90 transition-colors duration-150 flex items-center justify-center disabled:opacity-60"
        >
          <span v-if="loading" class="animate-spin mr-2">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
              />
            </svg>
          </span>
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
        <div v-if="errorMsg" class="text-error text-xs text-center mt-2">{{ errorMsg }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../supabase'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const errorMsg = ref('')
const loading = ref(false)

const register = async () => {
  errorMsg.value = ''
  if (password.value !== confirm.value) {
    errorMsg.value = 'Пароли не совпадают'
    return
  }
  loading.value = true
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })
    if (error) {
      errorMsg.value = error.message
      loading.value = false
      return
    }
    const user = data.user
    if (user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          first_name: firstName.value,
          last_name: lastName.value,
          email: email.value,
        },
      ])
      if (profileError) {
        errorMsg.value = profileError.message
        loading.value = false
        return
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (signInError) {
        errorMsg.value = 'Ошибка автоматического входа'
        loading.value = false
        return
      }
    }
    loading.value = false
    window.location.reload()
  } catch (error) {
    errorMsg.value = 'Произошла ошибка при регистрации'
    loading.value = false
  }
}
</script>

<script lang="ts">
export default {}
</script>
