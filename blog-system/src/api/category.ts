import http from './request'
import type { Category } from '@/types/category'

export function fetchCategories(): Promise<Category[]> {
  return http.get('/categories')
}

export function createCategory(data: { name: string; slug: string; description?: string; sortOrder?: number }): Promise<Category> {
  return http.post('/categories', data)
}

export function updateCategory(id: number, data: Partial<{ name: string; slug: string; description: string; sortOrder: number }>): Promise<Category> {
  return http.put(`/categories/${id}`, data)
}

export function deleteCategory(id: number): Promise<void> {
  return http.delete(`/categories/${id}`)
}
