import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '@/stores/article'

export function useArticleList() {
  const store = useArticleStore()
  const route = useRoute()

  function load() {
    const category = route.query.category as string | undefined
    const keyword = route.query.keyword as string | undefined
    store.loadArticles({ category, keyword, page: 1 })
  }

  onMounted(load)

  // 监听 fullPath 比 route.query 更可靠（对象引用对比可能失效）
  watch(() => route.fullPath, (newPath, oldPath) => {
    if (newPath !== oldPath) load()
  })

  return {
    // 使用 computed 确保每次读取都从 store 获取最新值
    articles: computed(() => store.list),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    pagination: store.pagination,
    loadPage: (page: number) => {
      const category = route.query.category as string | undefined
      const keyword = route.query.keyword as string | undefined
      store.loadArticles({ page, category, keyword })
    },
    retry: load,
  }
}
