<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useArticleList } from '@/composables/useArticleList'
import { useProfileStore } from '@/stores/profile'
import { useCategoryStore } from '@/stores/category'
import { useRoute, useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import ArticleCard from '@/components/ArticleCard.vue'
import CategoryTag from '@/components/CategoryTag.vue'
import ProfileCard from '@/components/ProfileCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import Loading from '@/components/Loading.vue'
import Empty from '@/components/Empty.vue'
import Pagination from '@/components/Pagination.vue'

useTitle('我的博客')

const { articles, loading, error, pagination, loadPage, retry } = useArticleList()
const profileStore = useProfileStore()
const categoryStore = useCategoryStore()
const route = useRoute()
const router = useRouter()

const heroRef = ref<HTMLElement | null>(null)
const articlesRef = ref<HTMLElement | null>(null)
const articlesVisible = ref(false)
const animReady = ref(false)

onMounted(() => {
  // 内容区域淡入
  const contentObs = new IntersectionObserver(
    ([entry]) => { articlesVisible.value = entry.isIntersecting },
    { threshold: 0.05 }
  )
  if (articlesRef.value) contentObs.observe(articlesRef.value)

  // Hero 淡出
  if (heroRef.value) {
    const heroObs = new IntersectionObserver(
      ([e]) => {
        const el = e.target as HTMLElement
        el.style.opacity = e.isIntersecting ? '1' : '0.6'
      },
      { threshold: 0 }
    )
    heroObs.observe(heroRef.value)
  }
})

// 当文章数据变化时，延迟一帧触发动画
watch(() => articles.value.length, () => {
  animReady.value = false
  nextTick(() => { animReady.value = true })
})

function selectCategory(slug?: string) {
  router.push({ query: slug ? { category: slug } : {} })
}

function scrollToArticles() {
  document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="home-page">
    <!-- ====== Hero 全屏区域 ====== -->
    <section ref="heroRef" class="hero-section">
      <!-- 浮动星星 -->
      <div class="star" style="left:10%;animation-delay:0s;width:4px;height:4px"></div>
      <div class="star" style="left:25%;animation-delay:2s;width:6px;height:6px"></div>
      <div class="star" style="left:40%;animation-delay:4s;width:3px;height:3px"></div>
      <div class="star" style="left:55%;animation-delay:1s;width:5px;height:5px"></div>
      <div class="star" style="left:70%;animation-delay:3s;width:4px;height:4px"></div>
      <div class="star" style="left:85%;animation-delay:5s;width:3px;height:3px"></div>
      <div class="star" style="left:15%;animation-delay:6s;width:5px;height:5px"></div>
      <div class="star" style="left:50%;animation-delay:7s;width:3px;height:3px"></div>
      <div class="star" style="left:75%;animation-delay:8s;width:6px;height:6px"></div>
      <div class="star" style="left:35%;animation-delay:9s;width:4px;height:4px"></div>
      <div class="star" style="left:90%;animation-delay:2.5s;width:5px;height:5px"></div>
      <div class="star" style="left:60%;animation-delay:4.5s;width:3px;height:3px"></div>
      <div class="star" style="left:5%;animation-delay:7.5s;width:4px;height:4px"></div>
      <div class="star" style="left:45%;animation-delay:1.5s;width:6px;height:6px"></div>
      <div class="star" style="left:80%;animation-delay:5.5s;width:3px;height:3px"></div>
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">小世界里干杯</h1>
          <p class="hero-desc">探索 · 记录 · 分享</p>
          <div class="hero-search">
            <SearchBar />
          </div>
        </div>
        <div class="scroll-hint" @click="scrollToArticles">
          <span class="scroll-text">向下滚动查看全部文章</span>
          <div class="scroll-arrow">
            <span class="arrow-down"></span>
            <span class="arrow-down"></span>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== 文章区域 ====== -->
    <div class="content-section">
      <div ref="articlesRef" id="articles-section" class="articles-wrapper">
        <!-- 分类栏 -->
        <div class="categories-bar" :class="{ 'visible': articlesVisible }">
          <CategoryTag
            :name="`全部（${categoryStore.list.reduce((sum, c) => sum + (c as any).articleCount || 0, 0)}）`"
            :active="!route.query.category"
            @click="selectCategory()"
          />
          <CategoryTag
            v-for="cat in categoryStore.list"
            :key="cat.id"
            :name="`${cat.name}（${(cat as any).articleCount || 0}）`"
            :active="route.query.category === cat.slug"
            @click="selectCategory(cat.slug)"
          />
        </div>

        <div class="home-layout">
          <!-- 右侧边栏 -->
          <aside class="sidebar-area">
            <ProfileCard />
            <CalendarWidget />
            <WeatherWidget />
          </aside>

          <!-- 左侧文章列表 -->
          <div class="main-content-area">
            <Loading v-if="loading && !articles.length" text="正在加载文章..." />

            <div v-else-if="error" class="error-box">
              <el-result icon="error" title="加载失败" :sub-title="error">
                <template #extra>
                  <el-button type="primary" @click="retry">重新加载</el-button>
                </template>
              </el-result>
            </div>

            <div v-else-if="!articles.length" class="article-list">
              <Empty :message="route.query.category ? '该分类暂无文章' : '暂无文章'" />
            </div>

            <div v-else class="article-list">
              <div
                v-for="(article, index) in articles"
                :key="article.id"
                class="article-card-wrapper"
                :class="{ 'card-visible': animReady }"
                :style="{ animationDelay: animReady ? `${index * 0.08}s` : '0s' }"
              >
                <ArticleCard :article="article" />
              </div>
              <Pagination
                :page="pagination.page"
                :page-size="pagination.pageSize"
                :total="pagination.total"
                @change="loadPage"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ====== Hero 区域 ====== */
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: opacity 0.6s ease;
  background: transparent;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #fff;
  padding: 0 var(--content-padding);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.hero-text {
  animation: heroUp 1s ease-out;
}

@keyframes heroUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 4px;
  margin-bottom: var(--spacing-md);
  color: #fff;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  font-family: '仿宋_GB2312', 'FangSong', '华文仿宋', 'STFangsong', serif;
}

.hero-desc {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: var(--spacing-xl);
  color: #fff;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  font-family: '仿宋_GB2312', 'FangSong', '华文仿宋', 'STFangsong', serif;
}

.hero-search {
  max-width: 500px;
  margin: 0 auto;
}

/* 滚动提示 */
.scroll-hint {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
  animation: hintPulse 2s ease-in-out infinite;
}

.scroll-hint:hover { opacity: 1; }

/* ====== 浮动星星 ====== */
.star {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  z-index: 1;
  animation: floatUp 10s ease-in infinite;
  opacity: 0;
  box-shadow: 0 0 6px rgba(255,255,255,0.6);
}

@keyframes floatUp {
  0% {
    opacity: 0;
    transform: translateY(100vh) scale(0.5);
  }
  20% {
    opacity: 0.9;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    opacity: 0;
    transform: translateY(-10vh) scale(1.2);
  }
}

@keyframes hintPulse {
  0%, 100% { opacity: 0.5; transform: translateX(-50%) translateY(0); }
  50% { opacity: 0.9; transform: translateX(-50%) translateY(5px); }
}

.scroll-text {
  font-size: var(--font-size-xs);
  color: rgba(255,255,255,0.7);
  letter-spacing: 2px;
}

.arrow-down {
  display: block;
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(255,255,255,0.7);
  border-bottom: 2px solid rgba(255,255,255,0.7);
  transform: rotate(45deg);
  margin-top: -6px;
  animation: arrowMove 1.5s ease-in-out infinite;
}

.arrow-down:nth-child(2) { animation-delay: 0.3s; }

@keyframes arrowMove {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* ====== 文章内容区域 ====== */
.content-section {
  background: var(--color-bg);
  border-radius: 24px 24px 0 0;
  padding: var(--spacing-xl) 0;
  position: relative;
  z-index: 3;
  min-height: 60vh;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
}

.articles-wrapper {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--content-padding);
}

.categories-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.categories-bar.visible {
  opacity: 1;
  transform: translateY(0);
}

.home-layout {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
}

.main-content-area {
  flex: 1;
  min-width: 0;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* ====== 文章卡片动画 ====== */
.article-card-wrapper {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

/* 仅在动画就绪时播放入场效果 */
.article-card-wrapper.card-visible {
  animation: cardSlideUp 0.5s ease both;
}

@keyframes cardSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 右侧边栏 */
.sidebar-area {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: calc(60px + var(--spacing-lg));
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-height: calc(100vh - 60px - var(--spacing-lg) * 2);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}
.sidebar-area::-webkit-scrollbar {
  width: 4px;
}
.sidebar-area::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}

.sidebar-section {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
}

.sidebar-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
}

.sidebar-categories {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-cat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-sm);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  transition: all 0.2s;
}

.sidebar-cat-item:hover,
.sidebar-cat-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.cat-count {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  background: var(--color-bg-secondary);
  border-radius: 10px;
}

.sidebar-cat-item.active .cat-count {
  background: var(--color-primary);
  color: #fff;
}

.error-box {
  padding: var(--spacing-2xl);
}

@media (max-width: 768px) {
  .hero-title { font-size: 2rem; }
  .hero-desc { font-size: 1rem; }
  .sidebar-area { display: none; }
  .home-layout { flex-direction: column; }
  .content-section { border-radius: 16px 16px 0 0; }
}
</style>
