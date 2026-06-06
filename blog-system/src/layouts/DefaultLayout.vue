<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="default-layout">
    <AppHeader />
    <main class="main-content">
      <div class="content-wrapper">
        <RouterView />
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: calc(var(--header-height) + var(--spacing-lg));
  padding-bottom: var(--spacing-xl);
}

.content-wrapper {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--content-padding);
}
</style>
