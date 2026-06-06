<script setup lang="ts">
defineProps<{ message?: string }>()
</script>

<template>
  <div class="empty-wrapper">
    <el-empty :description="message || '暂无内容'" />
  </div>
</template>

<style scoped>
.empty-wrapper {
  padding: var(--spacing-2xl);
}
</style>
