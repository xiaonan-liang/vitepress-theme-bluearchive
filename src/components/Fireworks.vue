<template>
  <div class="fireworks" ref="fireworksRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useStore } from '../store'

const { state } = useStore()
const fireworksRef = ref<HTMLElement | null>(null)
let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let particles: Particle[] = []
let fireworks: Firework[] = []

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  maxLife: number
}

interface Firework {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  color: string
  exploded: boolean
}

const random = (min: number, max: number) => Math.random() * (max - min) + min

const createFirework = () => {
  if (!canvas) return
  
  const firework: Firework = {
    x: canvas.width / 2,
    y: canvas.height,
    targetX: random(0, canvas.width),
    targetY: random(0, canvas.height * 0.5),
    vx: 0,
    vy: 0,
    color: `hsl(${random(0, 360)}, 100%, 50%)`,
    exploded: false
  }
  
  // 计算速度向量
  const dx = firework.targetX - firework.x
  const dy = firework.targetY - firework.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  firework.vx = (dx / distance) * 5
  firework.vy = (dy / distance) * 5
  
  fireworks.push(firework)
}

const createParticles = (x: number, y: number, color: string) => {
  for (let i = 0; i < 50; i++) {
    const particle: Particle = {
      x,
      y,
      vx: random(-3, 3),
      vy: random(-3, 3),
      size: random(1, 3),
      color,
      life: 0,
      maxLife: random(50, 100)
    }
    particles.push(particle)
  }
}

const update = () => {
  if (!canvas || !ctx) return
  
  // 清空画布
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 更新烟花
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const firework = fireworks[i]
    
    if (!firework.exploded) {
      // 移动烟花
      firework.x += firework.vx
      firework.y += firework.vy
      
      // 绘制烟花
      ctx.beginPath()
      ctx.arc(firework.x, firework.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = firework.color
      ctx.fill()
      
      // 检查是否到达目标
      const dx = firework.targetX - firework.x
      const dy = firework.targetY - firework.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 10) {
        firework.exploded = true
        createParticles(firework.x, firework.y, firework.color)
      }
    } else {
      // 移除已爆炸的烟花
      fireworks.splice(i, 1)
    }
  }
  
  // 更新粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i]
    
    // 移动粒子
    particle.x += particle.vx
    particle.y += particle.vy
    
    // 应用重力
    particle.vy += 0.1
    
    // 减少生命值
    particle.life++
    
    // 绘制粒子
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = particle.color
    ctx.globalAlpha = 1 - (particle.life / particle.maxLife)
    ctx.fill()
    ctx.globalAlpha = 1
    
    // 移除死亡粒子
    if (particle.life >= particle.maxLife) {
      particles.splice(i, 1)
    }
  }
  
  // 随机创建新烟花
  if (Math.random() < 0.05) {
    createFirework()
  }
  
  animationId = requestAnimationFrame(update)
}

const resizeCanvas = () => {
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

onMounted(() => {
  if (!fireworksRef.value) return
  
  // 创建画布
  canvas = document.createElement('canvas')
  if (!canvas) return
  
  ctx = canvas.getContext('2d')
  if (!ctx) return
  
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  fireworksRef.value.appendChild(canvas)
  
  // 开始动画
  update()
  
  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped lang="less">
.fireworks {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9998;
}
</style>
