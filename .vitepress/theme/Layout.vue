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

<style lang="less">
/* 关键 CSS - 内联在首屏 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

html {
  scroll-behavior: smooth;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

body {
  background-image: var(--theme-background-image);
  background-color: var(--general-background-color);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  overflow-y: scroll;
  overflow-x: hidden;
  color: var(--font-color-grey);
  font-family: 'Blueaka', sans-serif;
  transition: background-image 0.5s, background-color 0.5s;
}

/* 主题背景图片 */
:root[theme='light'] {
  --theme-background-image: url('./assets/background.svg');
}

:root[theme='dark'] {
  --theme-background-image: url('./assets/background_dark.svg');
}

/* 关键组件样式 */
.splash {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.banner {
  position: relative;
  height: 400px;
  overflow: hidden;
}



.posts-list {
  padding: 2rem;
}

.tools-list {
  padding: 2rem;
}

.footer {
  padding: 2rem;
  background: rgba(0, 0, 0, 0.8);
  text-align: center;
}
</style>
