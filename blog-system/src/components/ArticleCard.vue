<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Article } from '@/types/article'
import { getSummary, formatDate } from '@/utils/format'

const props = defineProps<{ article: Article }>()
const router = useRouter()

const summary = computed(() => props.article.summary || getSummary(props.article.content || '', 120))

function goDetail() {
  router.push(`/article/${props.article.id}`)
}
</script>

<template>
  <article class="article-card" @click="goDetail">
    <div class="card-body">
      <div class="card-meta">
        <span v-if="article.categoryName" class="category-tag">{{ article.categoryName }}</span>
        <span class="date">{{ formatDate(article.createdAt) }}</span>
        <span class="views">👁 {{ article.viewCount }}</span>
      </div>
      <h2 class="card-title">{{ article.title }}</h2>
      <p class="card-summary">{{ summary }}</p>
      <div class="card-footer">
        <span class="read-more">阅读全文 →</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.article-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.category-tag {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.card-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
}

.card-summary {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.read-more {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: 500;
}

@media (max-width: 768px) {
  .article-card {
    padding: var(--spacing-md);
  }
  .card-title {
    font-size: var(--font-size-lg);
  }
}
</style>
