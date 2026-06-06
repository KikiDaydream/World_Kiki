<script setup lang="ts">
defineProps<{ text?: string }>()
</script>

<template>
  <div class="loading-wrapper">
    <el-icon class="loading-icon" :size="32">
      <Loading />
    </el-icon>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<style scoped>
.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  color: var(--color-primary);
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
</style>
