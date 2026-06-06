export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  sortOrder: number
  articleCount?: number
  createdAt: string
}
