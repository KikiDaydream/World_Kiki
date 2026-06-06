<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useResponsive } from '@/composables/useResponsive'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isMobile } = useResponsive()
const sidebarCollapsed = ref(false)

const menuItems = [
  { name: 'Dashboard', label: '概览', icon: 'DataAnalysis' },
  { name: 'ArticleList', label: '文章管理', icon: 'Document' },
  { name: 'ArticleCreate', label: '发布文章', icon: 'Edit' },
  { name: 'CategoryManage', label: '分类管理', icon: 'Collection' },
  { name: 'ProfileSettings', label: '个人信息', icon: 'User' },
]

function navigateTo(name: string) {
  router.push({ name })
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed, mobile: isMobile }">
      <div class="sidebar-header">
        <span class="sidebar-logo" @click="router.push('/')">📝</span>
        <span v-show="!sidebarCollapsed || isMobile" class="sidebar-title">博客后台</span>
      </div>

      <nav class="sidebar-nav">
        <div
          v-for="item in menuItems"
          :key="item.name"
          class="nav-item"
          :class="{ active: route.name === item.name }"
          @click="navigateTo(item.name)"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span v-show="!sidebarCollapsed || isMobile" class="nav-label">{{ item.label }}</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="nav-item" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          <span v-show="!sidebarCollapsed || isMobile" class="nav-label">退出登录</span>
        </div>
      </div>
    </aside>

    <!-- Main Area -->
    <div class="main-area">
      <header class="admin-header">
        <div class="header-left">
          <el-button text @click="sidebarCollapsed = !sidebarCollapsed">
            <el-icon><Fold /></el-icon>
          </el-button>
          <span class="page-title">{{ route.meta.title as string }}</span>
        </div>
        <div class="header-right">
          <el-button size="small" @click="router.push('/')">返回前台</el-button>
          <span class="user-info">{{ authStore.user?.nickname || authStore.user?.username }}</span>
        </div>
      </header>

      <main class="admin-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.sidebar {
  width: var(--sidebar-width);
  background: var(--color-bg);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  height: var(--header-height);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-md);
  cursor: pointer;
}

.sidebar-logo {
  font-size: 1.5rem;
}

.sidebar-title {
  font-weight: 700;
  font-size: var(--font-size-base);
  white-space: nowrap;
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-sm);
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s;
  margin-bottom: 2px;
  white-space: nowrap;
}

.nav-item:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.nav-item.active {
  background: var(--color-primary);
  color: #fff;
}

.nav-label {
  font-size: var(--font-size-sm);
}

.sidebar-footer {
  padding: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
}

.main-area {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s;
  min-height: 100vh;
}

.admin-header {
  height: var(--header-height);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: 40;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.page-title {
  font-weight: 600;
  font-size: var(--font-size-base);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.admin-content {
  padding: var(--spacing-lg);
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: var(--sidebar-width) !important;
  }
  .sidebar.mobile {
    transform: translateX(0);
  }
  .main-area {
    margin-left: 0;
  }
}
</style>
