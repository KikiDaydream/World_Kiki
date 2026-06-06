import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()

    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - 博客系统`
    }

    // 鉴权检查
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }

    next()
  })
}
