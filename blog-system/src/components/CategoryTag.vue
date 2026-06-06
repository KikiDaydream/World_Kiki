<script setup lang="ts">
defineProps<{ name: string; active?: boolean }>()
const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <span class="category-tag" :class="{ active }" @click="emit('click')">
    {{ name }}
  </span>
</template>

<style scoped>
.category-tag {
  display: inline-block;
  padding: 4px 12px;
  font-size: var(--font-size-xs);
  border-radius: 20px;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  transition: all 0.2s;
  cursor: pointer;
  user-select: none;
}

.category-tag:hover,
.category-tag.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
</style>
