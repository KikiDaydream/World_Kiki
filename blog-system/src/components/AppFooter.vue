<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <p>© {{ new Date().getFullYear() }} 我的博客 · Built with Vue 3</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  padding: var(--spacing-lg) 0;
  margin-top: auto;
}

.footer-inner {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--content-padding);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
</style>
