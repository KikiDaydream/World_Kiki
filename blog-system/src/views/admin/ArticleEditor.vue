<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchArticleById, createArticle, updateArticle } from '@/api/article'
import { fetchCategories } from '@/api/category'
import { useTitle } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { MdEditor } from 'md-editor-v3'
import type { ToolbarNames } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
useTitle(`${isEdit.value ? '编辑' : '发布'}文章 - 博客系统`)

const title = ref('')
const content = ref('')
const categoryId = ref<number | null>(null)
const status = ref<'draft' | 'published'>('published')
const loading = ref(false)
const submitting = ref(false)
const categories = ref<any[]>([])

const toolbars: ToolbarNames[] = [
  'bold', 'underline', 'italic', '-',
  'title', 'strikeThrough', '-',
  'quote', 'unorderedList', 'orderedList', '-',
  'codeRow', 'code', 'link', 'image', 'table',
  '-', 'preview', 'fullscreen',
]

onMounted(async () => {
  categories.value = await fetchCategories()

  if (isEdit.value) {
    await loadArticle()
  }
})

async function loadArticle() {
  loading.value = true
  try {
    const article = await fetchArticleById(Number(route.params.id))
    title.value = article.title
    content.value = article.content
    categoryId.value = article.categoryId
    status.value = article.status
  } finally {
    loading.value = false
  }
}

async function save(publishStatus: 'draft' | 'published') {
  if (!title.value.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }
  if (!content.value.trim()) {
    ElMessage.warning('请输入文章内容')
    return
  }

  status.value = publishStatus
  submitting.value = true

  try {
    if (isEdit.value) {
      await updateArticle(Number(route.params.id), {
        title: title.value,
        content: content.value,
        categoryId: categoryId.value,
        status: publishStatus,
      })
      ElMessage.success('更新成功')
    } else {
      await createArticle({
        title: title.value,
        content: content.value,
        categoryId: categoryId.value,
        status: publishStatus,
      })
      ElMessage.success('发布成功')
    }
    router.push({ name: 'ArticleList' })
  } catch (err: any) {
    ElMessage.error(err?.response?.data?.message || '操作失败')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="article-editor">
    <Loading v-if="loading" text="加载文章..." />

    <div v-else class="editor-form">
      <div class="form-header">
        <el-input
          v-model="title"
          placeholder="请输入文章标题"
          size="large"
          class="title-input"
        />
        <div class="form-meta">
          <el-select
            v-model="categoryId"
            placeholder="选择分类"
            clearable
          >
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </div>
      </div>

      <div class="editor-wrapper">
        <MdEditor
          v-model="content"
          :toolbars="toolbars"
          :preview="true"
          language="zh-CN"
          style="min-height: 520px"
        />
      </div>

      <div class="form-actions">
        <el-button @click="router.back()">取消</el-button>
        <el-button @click="save('draft')" :disabled="submitting">
          保存草稿
        </el-button>
        <el-button type="primary" @click="save('published')" :loading="submitting">
          {{ isEdit ? '更新' : '发布' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-editor {
  padding: var(--spacing-md) 0;
}

.form-header {
  margin-bottom: var(--spacing-md);
}

.title-input {
  margin-bottom: var(--spacing-sm);
}

.form-meta {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.editor-wrapper {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}
</style>
