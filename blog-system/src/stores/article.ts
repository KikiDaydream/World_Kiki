import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { fetchArticles, fetchArticleById } from '@/api/article'
import type { Article } from '@/types/article'

export const useArticleStore = defineStore('article', () => {
  const list = ref<Article[]>([])
  const current = ref<Article | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
  })

  // 列表和详情使用独立的请求计数器，防止互相干扰
  let listRequestId = 0
  let detailRequestId = 0

  async function loadArticles(params?: { page?: number; category?: string; keyword?: string }) {
    const id = ++listRequestId
    error.value = null
    loading.value = true

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetchArticles({
          page: params?.page ?? pagination.page,
          pageSize: pagination.pageSize,
          category: params?.category || undefined,
          keyword: params?.keyword || undefined,
        })
        if (id !== listRequestId) return
        list.value = res.data
        pagination.total = res.total
        if (params?.page !== undefined) pagination.page = params.page
        error.value = null
        loading.value = false
        return
      } catch (e: any) {
        if (id !== listRequestId) return
        if (attempt === 0) {
          console.warn('[article] 加载失败，重试中...', e?.message)
          await new Promise(r => setTimeout(r, 500))
          continue
        }
        error.value = e?.response?.data?.message || e?.message || '加载文章失败，请刷新重试'
        console.error('[article] 加载失败:', e)
      } finally {
        // 最后一次尝试结束时确保关闭 loading（仅当仍是当前请求时）
        if (attempt === 1 && id === listRequestId) {
          loading.value = false
        }
      }
    }
  }

  async function loadArticleById(id: number) {
    const idReq = ++detailRequestId
    current.value = null
    error.value = null
    loading.value = true

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        current.value = await fetchArticleById(id)
        if (idReq !== detailRequestId) return
        error.value = null
        loading.value = false
        return
      } catch (e: any) {
        if (idReq !== detailRequestId) return
        if (attempt === 0) {
          console.warn('[article store] 文章详情加载失败，重试中...', e?.message)
          await new Promise(r => setTimeout(r, 500))
          continue
        }
        error.value = e?.response?.data?.message || e?.message || '加载文章详情失败，请刷新重试'
        console.error('[article store] load detail failed:', e)
      } finally {
        if (attempt === 1 && idReq === detailRequestId) {
          loading.value = false
        }
      }
    }
  }

  function clearCurrent() {
    current.value = null
  }

  return { list, current, loading, error, pagination, loadArticles, loadArticleById, clearCurrent }
})
