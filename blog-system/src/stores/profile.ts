import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProfile, updateProfile } from '@/api/profile'
import type { ProfileData, UserInfo } from '@/types/user'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<ProfileData | null>(null)
  const loading = ref(false)

  async function loadProfile() {
    loading.value = true
    try {
      profile.value = await getProfile()
    } finally {
      loading.value = false
    }
  }

  async function saveProfile(data: Partial<UserInfo>) {
    const result = await updateProfile(data)
    if (profile.value) {
      Object.assign(profile.value, result)
    }
    return result
  }

  return { profile, loading, loadProfile, saveProfile }
})
