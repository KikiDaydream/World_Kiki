<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchArticles } from '@/api/article'
import type { Article } from '@/types/article'
import ArticleCard from '@/components/ArticleCard.vue'
import Empty from '@/components/Empty.vue'
import Loading from '@/components/Loading.vue'
import Pagination from '@/components/Pagination.vue'
import { useTitle } from '@vueuse/core'

const route = useRoute()
const articles = ref<Article[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const keyword = ref('')

useTitle('搜索 - 我的博客')

// 请求计数器 — 防止竞态
let requestId = 0

onMounted(() => {
  doSearch()
})

watch(() => route.query.keyword, () => {
  page.value = 1
  doSearch()
})

async function doSearch() {
  keyword.value = (route.query.keyword as string) || ''
  if (!keyword.value.trim()) return

  const id = ++requestId
  loading.value = true
  try {
    const res = await fetchArticles({ keyword: keyword.value, page: page.value })
    // 只应用最新请求的结果
    if (id !== requestId) return
    articles.value = res.data
    total.value = res.total
  } finally {
    if (id === requestId) loading.value = false
  }
}

function onPageChange(p: number) {
  page.value = p
  doSearch()
}
</script>

<template>
  <div class="search-page">
    <h1 class="search-title">
      搜索结果：<span class="keyword">"{{ route.query.keyword }}"</span>
    </h1>
    <p class="search-info">共找到 {{ total }} 篇文章</p>

    <Loading v-if="loading" text="搜索中..." />

    <div v-else-if="!articles.length" class="result-list">
      <Empty message="未找到相关文章，请尝试其他关键词" />
    </div>

    <div v-else class="result-list">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />
      <Pagination
        :page="page"
        :page-size="10"
        :total="total"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.search-page {
  min-height: 60vh;
}

.search-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
}

.keyword {
  color: var(--color-primary);
}

.search-info {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-lg);
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
</style>
