<script setup lang="ts">
import { onMounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useRouter } from 'vue-router'
import avatarSrc from '@/assets/images/头像.jpg'

const store = useProfileStore()
const router = useRouter()

onMounted(() => {
  if (!store.profile) store.loadProfile()
})
</script>

<template>
  <div v-if="store.profile" class="profile-card">
    <div class="card-header">
      <img
        :src="store.profile.avatar || avatarSrc"
        :alt="store.profile.nickname"
        class="avatar"
      />
      <h3 class="nickname">{{ store.profile.nickname || '博主' }}</h3>
      <p class="title">{{ store.profile.title || '' }}</p>
    </div>

    <p v-if="store.profile.bio" class="bio">{{ store.profile.bio }}</p>

    <div v-if="store.profile.location" class="info-row">
      <el-icon><Location /></el-icon>
      <span>{{ store.profile.location }}</span>
    </div>

    <!-- 技能标签 -->
    <div v-if="store.profile.skills?.length" class="skills-section">
      <h4 class="section-title">技能</h4>
      <div class="skills-tags">
        <el-tag
          v-for="skill in store.profile.skills"
          :key="skill"
          size="small"
          class="skill-tag"
        >
          {{ skill }}
        </el-tag>
      </div>
    </div>

    <!-- 统计信息 -->
    <div v-if="store.profile.stats" class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ store.profile.stats.totalArticles }}</span>
        <span class="stat-label">文章</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ store.profile.stats.totalViews }}</span>
        <span class="stat-label">阅读</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ store.profile.categoryStats?.length || 0 }}</span>
        <span class="stat-label">分类</span>
      </div>
    </div>

    <!-- 社交链接 -->
    <div v-if="store.profile.github || store.profile.twitter || store.profile.website" class="social-links">
      <el-link v-if="store.profile.github" :href="`https://github.com/${store.profile.github}`" target="_blank" class="social-link">
        <el-icon><Github /></el-icon> GitHub
      </el-link>
      <el-link v-if="store.profile.website" :href="store.profile.website" target="_blank" class="social-link">
        <el-icon><Link /></el-icon> 网站
      </el-link>
    </div>

    <el-button text class="about-btn" @click="router.push('/about')">
      了解更多 →
    </el-button>
  </div>
</template>

<style scoped>
.profile-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.card-header {
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary-light);
  margin-bottom: var(--spacing-sm);
  background: var(--color-bg-secondary);
}

.nickname {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.title {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.bio {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.info-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.section-title {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--spacing-xs);
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-tag {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border: none;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  padding: var(--spacing-sm) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
}

.social-link {
  font-size: var(--font-size-sm);
}

.about-btn {
  width: 100%;
  font-size: var(--font-size-sm);
}
</style>
