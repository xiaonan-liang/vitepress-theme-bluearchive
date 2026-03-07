<template>
  <Splash></Splash>
  <template v-if="!page.isNotFound">
    <main style="min-height: 100vh">
      <Navbar></Navbar>
      <Banner>
        <transition name="fade" mode="out-in">
          <WelcomeBox v-if="!state.splashLoading && page.filePath === 'index.md'"></WelcomeBox>
          <Tags v-else-if="page.filePath === 'tags/index.md'"></Tags>
          <PostInnerBanner v-else></PostInnerBanner>
        </transition>
      </Banner>
      <transition name="fade" mode="out-in">
        <PostsList
          v-if="page.filePath === 'index.md' || page.filePath === 'tags/index.md'"
        ></PostsList>
        <ToolsList v-else-if="page.filePath === 'tools/index.md'"></ToolsList>
        <PostViewer v-else-if="page.filePath.startsWith('posts/')"></PostViewer>
      </transition>
    </main>
    <Footer></Footer>
    <Fireworks v-if="state.fireworksEnabled"></Fireworks>
    <ClientOnly>
      <Suspense>
        <SpinePlayer></SpinePlayer>
        <template #fallback>
          <div style="display: none;"></div>
        </template>
      </Suspense>
    </ClientOnly>
    <ToTop></ToTop>
    <audio id="background-music" loop>
      <source src="./assets/banner/bgm.mp3" type="audio/mpeg" />
    </audio>
  </template>
  <NotFound v-else></NotFound>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// 核心组件 - 首屏必需
import Splash from './components/Splash.vue'
import Navbar from './components/Navbar/index.vue'
import Banner from './components/Banner.vue'

// 页面特定组件 - 懒加载
const WelcomeBox = defineAsyncComponent(() => import('./components/Welcome-Box.vue'))
const PostsList = defineAsyncComponent(() => import('./components/Posts-List.vue'))
const Footer = defineAsyncComponent(() => import('./components/Footer.vue'))
const ToTop = defineAsyncComponent(() => import('./components/ToTop.vue'))

// 其他页面组件 - 懒加载
const Tags = defineAsyncComponent(() => import('./components/Tags.vue'))
const PostViewer = defineAsyncComponent(() => import('./components/Post-Viewer.vue'))
const PostInnerBanner = defineAsyncComponent(() => import('./components/Post-InnerBanner.vue'))
const NotFound = defineAsyncComponent(() => import('./components/NotFound.vue'))
const Fireworks = defineAsyncComponent(() => import('./components/Fireworks.vue'))
const ToolsList = defineAsyncComponent(() => import('./components/Tools-List.vue'))
const SpinePlayer = defineAsyncComponent(() => import('./components/Spine-Player/index.vue'))

import { useData } from 'vitepress'
const { page } = useData()

import { useStore } from './store'
const { state } = useStore()
</script>

<style lang="less" scoped>
/* 关键 CSS - 内联在首屏 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s !important;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
}

html {
  scroll-behavior: smooth !important;
}

.container {
  max-width: 1200px !important;
  margin: 0 auto !important;
}

body {
  background-image: var(--theme-background-image) !important;
  background-color: var(--general-background-color) !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-attachment: fixed !important;
  overflow-y: scroll !important;
  overflow-x: hidden !important;
  color: var(--font-color-grey) !important;
  font-family: 'Blueaka', sans-serif !important;
  transition: background-image 0.5s, background-color 0.5s !important;
}

/* 主题背景图片 */
:root[theme='light'] {
  --theme-background-image: url('./assets/background.svg') !important;
}

:root[theme='dark'] {
  --theme-background-image: url('./assets/background_dark.svg') !important;
}

/* 关键组件样式 */
.splash {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: #000 !important;
  z-index: 9999 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.navbar {
  position: sticky !important;
  top: 0 !important;
  z-index: 100 !important;
  background: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(10px) !important;
}

.banner {
  position: relative !important;
  height: 400px !important;
  overflow: hidden !important;
}

.welcome-box {
  padding: 2rem !important;
  background: rgba(0, 0, 0, 0.7) !important;
  border-radius: 10px !important;
  margin: 2rem auto !important;
  max-width: 800px !important;
}

.posts-list {
  padding: 2rem !important;
}

.tools-list {
  padding: 2rem !important;
}

.footer {
  padding: 2rem !important;
  background: rgba(0, 0, 0, 0.8) !important;
  text-align: center !important;
}
</style>

<!-- 非关键 CSS 异步加载 -->
<link rel="preload" href="/font/Blueaka/Blueaka.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link rel="preload" href="/font/Blueaka_Bold/Blueaka_Bold.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript>
  <link rel="stylesheet" href="/font/Blueaka/Blueaka.css">
  <link rel="stylesheet" href="/font/Blueaka_Bold/Blueaka_Bold.css">
</noscript>
