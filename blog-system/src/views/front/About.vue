<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useTitle } from '@vueuse/core'
import avatarSrc from '@/assets/images/头像.jpg'

useTitle('关于 - 我的博客')

const store = useProfileStore()

onMounted(() => {
  store.loadProfile()
})

const categoryStats = computed(() => store.profile?.categoryStats || [])
</script>

<template>
  <div class="about-page">
    <Loading v-if="store.loading" text="加载中..." />

    <template v-else-if="store.profile">
      <!-- 头部信息 -->
      <div class="about-header">
        <div class="avatar-wrapper">
          <img
            :src="store.profile.avatar || avatarSrc"
            :alt="store.profile.nickname"
            class="avatar"
          />
        </div>
        <h1 class="name">{{ store.profile.nickname || '博主' }}</h1>
        <p class="title-tag">{{ store.profile.title || '' }}</p>
        <p v-if="store.profile.location" class="location">
          <el-icon><Location /></el-icon> {{ store.profile.location }}
        </p>
      </div>

      <!-- 个人简介 -->
      <section v-if="store.profile.bio" class="section">
        <h2 class="section-title">📖 关于我</h2>
        <p class="bio-text">{{ store.profile.bio }}</p>
      </section>

      <!-- 技能标签 -->
      <section v-if="store.profile.skills?.length" class="section">
        <h2 class="section-title">🛠 技能</h2>
        <div class="skills-grid">
          <span v-for="skill in store.profile.skills" :key="skill" class="skill-badge">
            {{ skill }}
          </span>
        </div>
      </section>

      <!-- 文章统计 -->
      <section class="section">
        <h2 class="section-title">📊 数据概览</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-number">{{ store.profile.stats.totalArticles }}</span>
            <span class="stat-desc">累计文章</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ store.profile.stats.totalViews }}</span>
            <span class="stat-desc">总阅读量</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ categoryStats.length }}</span>
            <span class="stat-desc">分类数量</span>
          </div>
        </div>
      </section>

      <!-- 分类分布 -->
      <section v-if="categoryStats.length" class="section">
        <h2 class="section-title">📂 分类分布</h2>
        <div class="category-list">
          <div
            v-for="cat in categoryStats"
            :key="cat.id"
            class="category-item"
          >
            <span class="cat-name">{{ cat.name }}</span>
            <div class="cat-bar-bg">
              <div
                class="cat-bar-fill"
                :style="{ width: `${Math.min(100, (cat.count / Math.max(...categoryStats.map(c => c.count))) * 100)}%` }"
              ></div>
            </div>
            <span class="cat-count">{{ cat.count }} 篇</span>
          </div>
        </div>
      </section>

      <!-- 社交链接 -->
      <section v-if="store.profile.github || store.profile.twitter || store.profile.website" class="section">
        <h2 class="section-title">🔗 社交链接</h2>
        <div class="social-row">
          <el-link
            v-if="store.profile.github"
            :href="`https://github.com/${store.profile.github}`"
            target="_blank"
            type="primary"
          >
            <el-icon><Github /></el-icon> GitHub
          </el-link>
          <el-link
            v-if="store.profile.website"
            :href="store.profile.website"
            target="_blank"
            type="primary"
          >
            <el-icon><Link /></el-icon> 个人网站
          </el-link>
          <el-link
            v-if="store.profile.twitter"
            :href="`https://twitter.com/${store.profile.twitter}`"
            target="_blank"
            type="primary"
          >
            <el-icon><ChatLineSquare /></el-icon> Twitter
          </el-link>
        </div>
      </section>
    </template>

    <div v-else class="not-found">
      <Empty message="暂无个人信息" />
    </div>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 700px;
  margin: 0 auto;
}

.about-header {
  text-align: center;
  padding: var(--spacing-2xl) 0 var(--spacing-xl);
}

.avatar-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-md);
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--color-primary-light);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name {
  font-size: var(--font-size-2xl);
  font-weight: 700;
}

.title-tag {
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-base);
}

.location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.bio-text {
  color: var(--color-text-secondary);
  line-height: 1.8;
  font-size: var(--font-size-base);
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.skill-badge {
  display: inline-block;
  padding: 6px 16px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 20px;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.stat-card {
  text-align: center;
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius);
}

.stat-number {
  display: block;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
}

.stat-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.category-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.cat-name {
  width: 60px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  flex-shrink: 0;
}

.cat-bar-bg {
  flex: 1;
  height: 8px;
  background: var(--color-bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.cat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-hover));
  border-radius: 4px;
  transition: width 0.5s ease;
}

.cat-count {
  width: 50px;
  text-align: right;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.social-row {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.not-found {
  padding: var(--spacing-2xl);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
