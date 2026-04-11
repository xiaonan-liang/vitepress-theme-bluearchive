<template>
  <div class="player-container">
    <iframe
      frameborder="no"
      border="0"
      marginwidth="0"
      marginheight="0"
      width="330"
      height="86"
      :src="playerSrc"
      class="player-iframe"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 播放器源地址
const playerSrc = ref('//music.163.com/outchain/player?type=2&id=2721832331&auto=1&height=66')

// 全局播放状态管理
let playerState = {
  currentTime: 0,
  isPlaying: true
}

// 监听页面可见性变化，保持播放状态
onMounted(() => {
  // 从localStorage恢复播放状态
  const savedState = localStorage.getItem('playerState')
  if (savedState) {
    playerState = JSON.parse(savedState)
  }
  
  // 监听页面可见性变化
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  // 保存播放状态到localStorage
  localStorage.setItem('playerState', JSON.stringify(playerState))
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

// 处理页面可见性变化
const handleVisibilityChange = () => {
  // 页面可见时，保持播放状态
  if (!document.hidden) {
    // 可以在这里添加逻辑来同步播放状态
  }
}
</script>

<style scoped>
.player-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.player-container:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.player-iframe {
  display: block;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .player-container {
    bottom: 10px;
    right: 10px;
    width: 280px;
  }
  
  .player-iframe {
    width: 280px;
    height: 86px;
  }
}
</style>