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
const SpinePlayer = defineAsyncComponent(() => import('./components/Spine-Player/index.vue'))

import { useData } from 'vitepress'
const { page } = useData()

import { useStore } from './store'
const { state } = useStore()
</script>

<style lang="less">
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

:root[theme='light'] {
  --theme-background-image: url('./assets/background.svg');
}

:root[theme='dark'] {
  --theme-background-image: url('./assets/background_dark.svg');
}
</style>
