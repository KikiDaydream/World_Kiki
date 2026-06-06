import http from './request'
import type { ProfileData, UserInfo } from '@/types/user'

export function getProfile(): Promise<ProfileData> {
  return http.get('/profile')
}

export function updateProfile(data: Partial<UserInfo>): Promise<UserInfo> {
  return http.put('/profile', data)
}
