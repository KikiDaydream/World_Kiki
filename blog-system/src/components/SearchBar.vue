<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDebounce } from '@vueuse/core'

const router = useRouter()
const keyword = ref('')
const debouncedKeyword = useDebounce(keyword, 500)

// Auto-search on debounce
watch(debouncedKeyword, (val) => {
  if (val.trim()) {
    router.push({ name: 'Search', query: { keyword: val.trim() } })
  }
})

function onSearch() {
  if (keyword.value.trim()) {
    router.push({ name: 'Search', query: { keyword: keyword.value.trim() } })
  }
}
</script>

<template>
  <div class="search-bar">
    <el-input
      v-model="keyword"
      placeholder="搜索文章..."
      size="large"
      clearable
      @keyup.enter="onSearch"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style>
