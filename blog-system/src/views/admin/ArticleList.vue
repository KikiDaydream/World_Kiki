<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAdminArticles, deleteArticle } from '@/api/article'
import { fetchCategories } from '@/api/category'
import { formatDate } from '@/utils/format'
import { ARTICLE_STATUS_MAP, ARTICLE_STATUS_OPTIONS } from '@/utils/constant'
import { useTitle } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Article } from '@/types/article'

useTitle('文章管理 - 博客系统')

const router = useRouter()
const articles = ref<Article[]>([])
const loading = ref(false)
const categories = ref<any[]>([])

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const filters = reactive({
  status: '',
})

onMounted(async () => {
  categories.value = await fetchCategories()
  loadArticles()
})

async function loadArticles() {
  loading.value = true
  try {
    const res = await fetchAdminArticles({
      page: pagination.page,
      pageSize: pagination.pageSize,
      status: filters.status || undefined,
    })
    articles.value = res.data
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

function onPageChange(page: number) {
  pagination.page = page
  loadArticles()
}

function onFilterChange() {
  pagination.page = 1
  loadArticles()
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '确认删除', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteArticle(id)
    ElMessage.success('删除成功')
    loadArticles()
  } catch {
    // cancelled
  }
}

function editArticle(id: number) {
  router.push({ name: 'ArticleEdit', params: { id } })
}
</script>

<template>
  <div class="article-manage">
    <div class="toolbar">
      <div class="toolbar-left">
        <el-select v-model="filters.status" placeholder="状态筛选" @change="onFilterChange">
          <el-option
            v-for="opt in ARTICLE_STATUS_OPTIONS"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>
      <div class="toolbar-right">
        <el-button type="primary" @click="router.push({ name: 'ArticleCreate' })">
          发布文章
        </el-button>
      </div>
    </div>

    <el-table
      :data="articles"
      v-loading="loading"
      stripe
      style="width: 100%"
    >
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="categoryName" label="分类" width="100">
        <template #default="{ row }">
          {{ row.categoryName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'warning'" size="small">
            {{ ARTICLE_STATUS_MAP[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="viewCount" label="阅读量" width="80" align="center" />
      <el-table-column label="更新时间" width="160">
        <template #default="{ row }">
          {{ formatDate(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="editArticle(row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrapper">
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.article-manage {
  padding: var(--spacing-md) 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-md);
}
</style>
