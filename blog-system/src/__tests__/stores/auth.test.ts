import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with empty token and no user', () => {
    const store = useAuthStore()
    expect(store.token).toBe('')
    expect(store.user).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })

  it('should set token and user on login', () => {
    const store = useAuthStore()
    expect(store.isLoggedIn).toBe(false)
    store.token = 'test-token-123'
    store.setUser({ id: 1, username: 'admin', nickname: '管理员' })
    expect(store.isLoggedIn).toBe(true)
    expect(store.token).toBe('test-token-123')
    expect(store.user?.username).toBe('admin')
  })

  it('should clear state on logout', () => {
    const store = useAuthStore()
    store.token = 'test-token'
    store.setUser({ id: 1, username: 'admin' })
    expect(store.isLoggedIn).toBe(true)
    store.logout()
    expect(store.token).toBe('')
    expect(store.user).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })
})
