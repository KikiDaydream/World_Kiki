import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 滚动进入视口时触发动画
 * 返回一个 ref，绑定到需要动画的元素上
 */
export function useScrollAnimation() {
  const elRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!elRef.value) return

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.unobserve(entry.target)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(elRef.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { elRef, isVisible }
}
