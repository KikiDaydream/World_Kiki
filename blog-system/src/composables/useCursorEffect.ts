import { onMounted, onBeforeUnmount } from 'vue'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  decay: number
  color: string
}

export function useCursorEffect() {
  let canvas: HTMLCanvasElement | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let particles: Particle[] = []
  let rafId = 0
  let mouseX = -100
  let mouseY = -100
  let lastX = -100
  let lastY = -100

  const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe']

  function init() {
    canvas = document.createElement('canvas')
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999'
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)
    ctx = canvas.getContext('2d')

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)
    animate()
  }

  function onMouseMove(e: MouseEvent) {
    mouseX = e.clientX
    mouseY = e.clientY
    const dist = Math.hypot(mouseX - lastX, mouseY - lastY)
    if (dist > 5) {
      const count = Math.min(Math.floor(dist / 8) + 1, 3)
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.3 + Math.random() * 0.8
        spawnParticle(
          mouseX + (Math.random() - 0.5) * 4,
          mouseY + (Math.random() - 0.5) * 4,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed - 0.3,
          3 + Math.random() * 4,
          0.6 + Math.random() * 0.4,
          0.015 + Math.random() * 0.015,
        )
      }
      lastX = mouseX
      lastY = mouseY
    }
  }

  function spawnParticle(x: number, y: number, vx: number, vy: number, size: number, alpha: number, decay: number) {
    particles.push({
      x, y, vx, vy, size, alpha,
      decay: decay * (0.8 + Math.random() * 0.4),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })
  }

  function animate() {
    ctx?.clearRect(0, 0, canvas!.width, canvas!.height)

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.02
      p.alpha -= p.decay

      if (p.alpha <= 0) {
        particles.splice(i, 1)
        continue
      }

      ctx!.globalAlpha = p.alpha
      ctx!.fillStyle = p.color
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx!.fill()
    }

    if (particles.length > 0) {
      ctx!.globalAlpha = 1
    }

    rafId = requestAnimationFrame(animate)
  }

  function onResize() {
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
  }

  function destroy() {
    cancelAnimationFrame(rafId)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
    particles = []
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas)
    }
    canvas = null
    ctx = null
  }

  onMounted(init)
  onBeforeUnmount(destroy)
}
