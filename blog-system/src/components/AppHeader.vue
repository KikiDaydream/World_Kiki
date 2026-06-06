<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCategoryStore } from '@/stores/category'
import { useAuthStore } from '@/stores/auth'
import { useResponsive } from '@/composables/useResponsive'
import logoSrc from '@/assets/images/网站logo.png'

const router = useRouter()
const route = useRoute()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()
const { isMobile } = useResponsive()

const showMenu = ref(false)
const keyword = ref('')

onMounted(() => {
  categoryStore.loadCategories()
})

function onSearch() {
  if (keyword.value.trim()) {
    router.push({ name: 'Search', query: { keyword: keyword.value.trim() } })
    keyword.value = ''
    showMenu.value = false
  }
}

function selectCategory(slug?: string) {
  router.push({ name: 'Home', query: slug ? { category: slug } : {} })
  showMenu.value = false
}

function goHome() {
  router.push('/')
  showMenu.value = false
}

function goAdmin() {
  if (authStore.isLoggedIn) {
    router.push('/admin')
  } else {
    router.push('/login')
  }
  showMenu.value = false
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="logo" @click="goHome">
        <span class="logo-icon">
          <img :src="logoSrc" alt="logo" class="logo-img" />
        </span>
      </div>

      <!-- Desktop Navigation -->
      <nav class="nav-desktop">
        <a class="nav-item" :class="{ active: route.name === 'Home' && !route.query.category }" @click="goHome">首页</a>
        <a
          v-for="cat in categoryStore.list"
          :key="cat.id"
          class="nav-item"
          :class="{ active: route.query.category === cat.slug }"
          @click="selectCategory(cat.slug)"
        >{{ cat.name }}</a>
        <a class="nav-item" :class="{ active: route.name === 'About' }" @click="router.push('/about')">关于</a>
      </nav>

      <div class="header-actions">
        <div class="search-box">
          <el-input
            v-model="keyword"
            placeholder="搜索文章..."
            size="small"
            clearable
            @keyup.enter="onSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <el-button size="small" @click="goAdmin">
          {{ authStore.isLoggedIn ? '后台' : '登录' }}
        </el-button>
        <button v-if="isMobile" class="menu-toggle" @click="showMenu = !showMenu">
          <span class="hamburger" :class="{ open: showMenu }"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide">
      <div v-if="showMenu && isMobile" class="mobile-menu">
        <a class="mobile-nav-item" @click="goHome">首页</a>
        <a
          v-for="cat in categoryStore.list"
          :key="cat.id"
          class="mobile-nav-item"
          @click="selectCategory(cat.slug)"
        >{{ cat.name }}</a>
        <div class="mobile-search">
          <el-input
            v-model="keyword"
            placeholder="搜索文章..."
            size="small"
            clearable
            @keyup.enter="onSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
  backdrop-filter: blur(8px);
}

.header-inner {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--content-padding);
  height: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  flex-shrink: 0;
}

.logo-icon {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 36px;
  width: auto;
  display: block;
}

.nav-desktop {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex: 1;
}

.nav-item {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: all 0.2s;
}

.nav-item:hover,
.nav-item.active {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-left: auto;
}

.search-box {
  width: 200px;
}

.menu-toggle {
  display: none;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
}

.hamburger,
.hamburger::before,
.hamburger::after {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: all 0.3s;
  position: relative;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  left: 0;
}

.hamburger::before { top: -6px; }
.hamburger::after { top: 6px; }

.hamburger.open { background: transparent; }
.hamburger.open::before { top: 0; transform: rotate(45deg); }
.hamburger.open::after { top: 0; transform: rotate(-45deg); }

.mobile-menu {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  z-index: 99;
}

.mobile-nav-item {
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text-secondary);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.mobile-nav-item:active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.mobile-search {
  margin-top: var(--spacing-sm);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@media (max-width: 768px) {
  .nav-desktop { display: none; }
  .search-box { display: none; }
  .menu-toggle { display: flex; }
}
</style>
