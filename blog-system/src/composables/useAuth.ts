import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()

  async function handleLogin(username: string, password: string) {
    await store.loginAction(username, password)
    router.push('/admin')
  }

  function handleLogout() {
    store.logout()
    router.push('/')
  }

  return {
    isLoggedIn: store.isLoggedIn,
    user: store.user,
    login: handleLogin,
    logout: handleLogout,
  }
}
