<template>
  <div class="player-container">
    <iframe
      frameborder="no"
      border="0"
      marginwidth="0"
      marginheight="0"
      width="330"
      height="86"
      src="https://music.163.com/outchain/player?type=2&id=2721832331&auto=1&height=66"
      class="player-iframe"
      allow="autoplay; encrypted-media"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup lang="ts">
// 简单的播放器组件
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