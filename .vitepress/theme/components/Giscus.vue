<template>
  <div class="giscus-container">
    <div id="giscus-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useData } from 'vitepress'
const themeConfig = useData().theme.value

onMounted(() => {
  // 加载Giscus脚本
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-repo', themeConfig.giscusRepo)
  script.setAttribute('data-repo-id', themeConfig.giscusRepoId)
  script.setAttribute('data-category', themeConfig.giscusCategory)
  script.setAttribute('data-category-id', themeConfig.giscusCategoryId)
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '1')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', 'preferred_color_scheme')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('data-loading', 'lazy')
  
  // 清除容器内容
  const container = document.getElementById('giscus-container')
  if (container) {
    container.innerHTML = ''
    container.appendChild(script)
  }
})
</script>

<style>
.giscus-container {
  margin-top: 2rem;
  max-width: 100%;
}

/* 自定义Giscus样式 */
.giscus {
  max-width: 100% !important;
}
</style>