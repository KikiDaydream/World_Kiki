import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCategories } from '@/api/category'
import type { Category } from '@/types/category'

export const useCategoryStore = defineStore('category', () => {
  const list = ref<Category[]>([])
  const loading = ref(false)

  async function loadCategories() {
    loading.value = true
    try {
      list.value = await fetchCategories()
    } finally {
      loading.value = false
    }
  }

  return { list, loading, loadCategories }
})
