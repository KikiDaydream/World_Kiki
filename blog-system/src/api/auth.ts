import http from './request'
import type { LoginParams, LoginResult, UserInfo } from '@/types/user'

export function login(data: LoginParams): Promise<LoginResult> {
  return http.post('/auth/login', data)
}

export function getUserInfo(): Promise<UserInfo> {
  return http.get('/auth/me')
}
