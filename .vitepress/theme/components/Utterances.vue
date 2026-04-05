<template>
  <div class="utterances-container">
    <div id="utterances-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useData } from 'vitepress'
const themeConfig = useData().theme.value

onMounted(() => {
  // 加载Utterances脚本
  const script = document.createElement('script')
  script.src = 'https://utteranc.es/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('repo', themeConfig.utterancesRepo)
  script.setAttribute('issue-term', 'pathname')
  script.setAttribute('label', 'comment')
  script.setAttribute('theme', 'github-dark')
  script.setAttribute('lang', 'zh-CN')
  
  // 清除容器内容
  const container = document.getElementById('utterances-container')
  if (container) {
    container.innerHTML = ''
    container.appendChild(script)
  }
})
</script>

<style>
.utterances-container {
  margin-top: 2rem;
  max-width: 100%;
}

/* 自定义Utterances样式 */
.utterances {
  max-width: 100% !important;
}
</style>