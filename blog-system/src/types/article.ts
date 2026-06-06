export interface Article {
  id: number
  title: string
  content: string
  summary?: string
  cover?: string
  categoryId: number | null
  categoryName?: string
  status: 'draft' | 'published'
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface ArticleListParams {
  page?: number
  pageSize?: number
  category?: string
  keyword?: string
  status?: string
}

export interface ArticleListResult {
  data: Article[]
  total: number
  page: number
  pageSize: number
}

export interface ArticleCreateParams {
  title: string
  content: string
  summary?: string
  cover?: string
  categoryId: number | null
  status: 'draft' | 'published'
}
