import http from './request'
import type { Article, ArticleListParams, ArticleListResult, ArticleCreateParams } from '@/types/article'

export function fetchArticles(params?: ArticleListParams): Promise<ArticleListResult> {
  return http.get('/articles', { params })
}

export function fetchArticleById(id: number): Promise<Article> {
  return http.get(`/articles/${id}`)
}

export function fetchAdminArticles(params?: ArticleListParams): Promise<ArticleListResult> {
  return http.get('/articles/admin/all', { params })
}

export function createArticle(data: ArticleCreateParams): Promise<Article> {
  return http.post('/articles', data)
}

export function updateArticle(id: number, data: Partial<ArticleCreateParams>): Promise<Article> {
  return http.put(`/articles/${id}`, data)
}

export function deleteArticle(id: number): Promise<void> {
  return http.delete(`/articles/${id}`)
}
