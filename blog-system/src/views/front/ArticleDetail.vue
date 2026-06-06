<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { formatDate } from '@/utils/format'
import { useTitle } from '@vueuse/core'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const route = useRoute()
const router = useRouter()
const store = useArticleStore()

let mounted = true

onMounted(() => {
  loadArticle()
})

onBeforeUnmount(() => {
  mounted = false
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) loadArticle()
})

async function loadArticle() {
  const id = Number(route.params.id)
  if (isNaN(id)) {
    router.push('/')
    return
  }
  await store.loadArticleById(id)
  if (!mounted) return
  if (store.current) {
    useTitle(`${store.current.title} - 我的博客`)
  }
}

function retry() {
  loadArticle()
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="article-detail">
    <button class="back-btn" @click="goBack">← 返回</button>

    <Loading v-if="store.loading" text="加载中..." />

    <div v-else-if="store.error" class="error-wrapper">
      <Empty :message="store.error" />
      <el-button type="primary" @click="retry" class="retry-btn">重新加载</el-button>
    </div>

    <div v-else-if="!store.current" class="not-found">
      <Empty message="文章不存在" />
    </div>

    <article v-else class="detail-content">
      <header class="detail-header">
        <div class="detail-meta">
          <span v-if="store.current.categoryName" class="category-tag">
            {{ store.current.categoryName }}
          </span>
          <span class="meta-item">{{ formatDate(store.current.createdAt) }}</span>
          <span class="meta-item">👁 {{ store.current.viewCount }} 次阅读</span>
        </div>
        <h1 class="detail-title">{{ store.current.title }}</h1>
      </header>

      <div class="markdown-body">
        <MdPreview
          v-if="store.current.content"
          :modelValue="store.current.content"
          language="zh-CN"
        />
      </div>
    </article>
  </div>
</template>

<style scoped>
.article-detail {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--content-padding);
  min-height: 70vh;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 8px 18px;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  border-radius: 20px;
  transition: all 0.25s;
  margin-bottom: var(--spacing-lg);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  backdrop-filter: blur(4px);
}

.back-btn:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  transform: translateX(-3px);
}

/* 文章内容卡片 — 半透明毛玻璃效果 */
.detail-content {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 48px 56px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 8px 32px rgba(99, 102, 241, 0.06),
    0 20px 60px rgba(0, 0, 0, 0.04);
}

.detail-header {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.category-tag {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 3px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: var(--font-size-xs);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.detail-title {
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: #1e3a5f;
}

.markdown-body {
  line-height: 1.9;
  color: var(--color-text);
  font-size: 16px;
}

/* Markdown 内部样式优化 */
.markdown-body :deep(h1) {
  font-size: 1.8rem;
  margin: 1.8em 0 0.6em;
  font-weight: 700;
}
.markdown-body :deep(h2) {
  font-size: 1.4rem;
  margin: 1.5em 0 0.4em;
  font-weight: 600;
  padding-bottom: 0.3em;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}
.markdown-body :deep(h3) {
  font-size: 1.15rem;
  margin: 1.2em 0 0.3em;
  font-weight: 600;
}
.markdown-body :deep(p) {
  margin: 0.9em 0;
}
.markdown-body :deep(ul), .markdown-body :deep(ol) {
  margin: 0.6em 0;
  padding-left: 1.5em;
}
.markdown-body :deep(li) {
  margin: 0.35em 0;
}
.markdown-body :deep(code) {
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.88em;
  font-family: "Fira Code", "Consolas", monospace;
}
.markdown-body :deep(pre) {
  background: #1e293b;
  color: #e2e8f0;
  padding: var(--spacing-lg);
  border-radius: 12px;
  overflow-x: auto;
  margin: 1.2em 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
  font-size: 0.9em;
}
.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--color-primary);
  padding: 0.6em 1.2em;
  margin: 1em 0;
  color: var(--color-text-secondary);
  background: var(--color-primary-light);
  border-radius: 0 10px 10px 0;
  font-style: italic;
}
.markdown-body :deep(strong) {
  font-weight: 700;
}
.markdown-body :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.not-found {
  padding: var(--spacing-2xl);
}

.error-wrapper {
  padding: var(--spacing-2xl);
  text-align: center;
}

.retry-btn {
  margin-top: var(--spacing-lg);
}

@media (max-width: 768px) {
  .article-detail {
    padding: var(--spacing-md);
  }
  .detail-content {
    padding: 24px 20px;
    border-radius: 12px;
  }
  .detail-title {
    font-size: 1.4rem;
  }
  .markdown-body {
    font-size: 15px;
  }
}
</style>
