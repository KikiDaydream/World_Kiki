import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login } from '@/api/auth'
import { useStorage } from '@vueuse/core'
import type { UserInfo } from '@/types/user'

export const useAuthStore = defineStore('auth', () => {
  const token = useStorage('blog-token', '')
  const user = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  async function loginAction(username: string, password: string) {
    const res = await login({ username, password })
    token.value = res.token
    user.value = res.user
    return res
  }

  function setUser(u: UserInfo) {
    user.value = u
  }

  function logout() {
    token.value = ''
    user.value = null
  }

  return { token, user, isLoggedIn, loginAction, setUser, logout }
})
