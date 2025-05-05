import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useGamificationStore = defineStore('gamification', () => {
  const userId = ref<string | null>(null)
  const totalScore = ref(0)
  const moduleProgress = ref<Record<string, { score: number; completed_at: string }>>({})
  const loading = ref(false)

  async function loadProgress() {
    loading.value = true
    const { data: authData } = await supabase.auth.getUser()
    userId.value = authData.user?.id || null
    if (!userId.value) {
      loading.value = false
      return
    }
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId.value)
    if (!error && data) {
      moduleProgress.value = {}
      totalScore.value = 0
      for (const row of data) {
        moduleProgress.value[row.module_slug] = {
          score: row.score,
          completed_at: row.completed_at || new Date().toISOString(),
        }
        totalScore.value += row.score
      }
    }
    loading.value = false
  }

  async function completeModule(moduleSlug: string, score: number) {
    if (!userId.value) return
    if (moduleProgress.value[moduleSlug]) return
    const completed_at = new Date().toISOString()
    const { error } = await supabase.from('user_progress').insert([
      {
        user_id: userId.value,
        module_slug: moduleSlug,
        score,
        completed_at,
      },
    ])
    if (!error) {
      moduleProgress.value[moduleSlug] = {
        score,
        completed_at,
      }
      totalScore.value += score
    }
  }

  function getModuleProgress(moduleSlug: string): number {
    return moduleProgress.value[moduleSlug] ? 100 : 0
  }

  return {
    userId,
    totalScore,
    moduleProgress,
    loading,
    loadProgress,
    completeModule,
    getModuleProgress,
  }
})
