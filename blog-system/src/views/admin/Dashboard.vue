<script setup lang="ts">
import { ref, computed, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAdminArticles } from '@/api/article'
import { fetchCategories } from '@/api/category'
import { useProfileStore } from '@/stores/profile'
import { useTitle } from '@vueuse/core'
import avatarSrc from '@/assets/images/头像.jpg'

useTitle('后台首页 - 博客系统')

const router = useRouter()
const profileStore = useProfileStore()

const stats = ref({
  articleCount: 0,
  categoryCount: 0,
  totalViews: 0,
  draftCount: 0,
})

const recentArticles = ref<any[]>([])
const loading = ref(true)

async function loadStats() {
  loading.value = true
  try {
    const [articleRes, categories] = await Promise.all([
      fetchAdminArticles({ page: 1, pageSize: 100 }),
      fetchCategories(),
    ])

    stats.value.articleCount = articleRes.total
    stats.value.draftCount = articleRes.data.filter(a => a.status === 'draft').length
    stats.value.totalViews = articleRes.data.reduce((sum, a) => sum + a.viewCount, 0)
    stats.value.categoryCount = categories.length
    recentArticles.value = articleRes.data.slice(0, 5)
  } catch {
    // silent
  } finally {
    loading.value = false
  }

  if (!profileStore.profile) await profileStore.loadProfile()
}

onMounted(loadStats)

// 从其他页面切回仪表盘时自动刷新
onActivated(loadStats)

const statCards = computed(() => [
  { label: '文章总数', value: stats.value.articleCount, icon: '📄', color: '#3b82f6' },
  { label: '分类数量', value: stats.value.categoryCount, icon: '📂', color: '#22c55e' },
  { label: '总阅读量', value: stats.value.totalViews, icon: '👁', color: '#f59e0b' },
  { label: '草稿数量', value: stats.value.draftCount, icon: '✏️', color: '#ef4444' },
])
</script>

<template>
  <div class="dashboard">
    <div class="dash-header">
      <h2 class="page-title">概览</h2>
      <div class="dash-actions">
        <el-button :loading="loading" @click="loadStats">刷新</el-button>
        <el-button type="primary" @click="router.push({ name: 'ArticleCreate' })">
          写文章
        </el-button>
      </div>
    </div>

    <!-- 个人信息快捷卡片 -->
    <div class="profile-shortcut" v-if="profileStore.profile">
      <img
        :src="profileStore.profile.avatar || avatarSrc"
        class="profile-avatar"
      />
      <div class="profile-info">
        <strong>{{ profileStore.profile.nickname }}</strong>
        <span>{{ profileStore.profile.title }}</span>
      </div>
      <el-button text type="primary" @click="router.push({ name: 'ProfileSettings' })">
        编辑资料 →
      </el-button>
    </div>

    <!-- 统计 -->
    <div class="stats-grid">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="stat-card"
        :style="{ borderTopColor: card.color }"
      >
        <div class="stat-icon">{{ card.icon }}</div>
        <div class="stat-info">
          <span class="stat-value">{{ card.value }}</span>
          <span class="stat-label">{{ card.label }}</span>
        </div>
      </div>
    </div>

    <!-- 最近文章 + 快速链接 -->
    <div class="dash-sections">
      <div class="recent-section">
        <h3>最近文章</h3>
        <div class="recent-list">
          <div
            v-for="article in recentArticles"
            :key="article.id"
            class="recent-item"
            @click="router.push({ name: 'ArticleEdit', params: { id: article.id } })"
          >
            <span class="recent-title">{{ article.title }}</span>
            <span class="recent-views">{{ article.viewCount }} 次阅读</span>
          </div>
          <Empty v-if="!recentArticles.length" message="暂无文章" />
        </div>
      </div>

      <div class="quick-section">
        <h3>快捷操作</h3>
        <div class="quick-list">
          <el-button class="quick-btn" @click="router.push({ name: 'ArticleCreate' })">
            📝 发布文章
          </el-button>
          <el-button class="quick-btn" @click="router.push({ name: 'CategoryManage' })">
            📂 管理分类
          </el-button>
          <el-button class="quick-btn" @click="router.push({ name: 'ProfileSettings' })">
            👤 编辑资料
          </el-button>
          <el-button class="quick-btn" @click="router.push('/')">
            🏠 查看前台
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: var(--spacing-md) 0;
}

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}
.dash-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.page-title {
  font-size: var(--font-size-xl);
}

.profile-shortcut {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
}

.profile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-sm);
}

.profile-info span {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-top: 3px solid;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-icon { font-size: 2rem; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.dash-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.recent-section,
.quick-section {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
}

.recent-section h3,
.quick-section h3 {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-md);
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}

.recent-item:last-child { border-bottom: none; }

.recent-title {
  font-size: var(--font-size-sm);
}

.recent-views {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.quick-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.quick-btn {
  justify-content: flex-start;
  text-align: left;
}

@media (max-width: 768px) {
  .dash-sections {
    grid-template-columns: 1fr;
  }
}
</style>
