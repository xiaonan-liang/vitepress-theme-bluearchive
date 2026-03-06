<template>
  <div class="spine-player" ref="spinePlayerRef">
    <canvas ref="canvasRef" width="200" height="200"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const spinePlayerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let skeleton: any = null
let animationState: any = null
let skeletonRenderer: any = null
let animationId: number | null = null

// 模拟Spine动画播放
const initSpine = () => {
  // 这里应该引入spine库并初始化
  // 由于没有实际的spine文件，这里实现一个简单的动画效果
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  let x = 100
  let y = 100
  let direction = 1
  
  const animate = () => {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 绘制一个简单的角色
    ctx.fillStyle = '#FF6B6B'
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, Math.PI * 2)
    ctx.fill()
    
    // 移动角色
    x += direction * 2
    if (x > canvas.width - 20 || x < 20) {
      direction *= -1
    }
    
    animationId = requestAnimationFrame(animate)
  }
  
  animate()
}

onMounted(() => {
  initSpine()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped lang="less">
.spine-player {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 200px;
  height: 200px;
  z-index: 1000;
  pointer-events: none;

  canvas {
    width: 100%;
    height: 100%;
  }
}

@media (max-width: 768px) {
  .spine-player {
    width: 150px;
    height: 150px;
    bottom: 10px;
    right: 10px;
  }
}
</style>
