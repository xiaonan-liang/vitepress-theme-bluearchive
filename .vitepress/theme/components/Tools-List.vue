<template>
  <div class="tools-container">
    <div class="tools-grid">
      <div
        v-for="tool in tools"
        :key="tool.id"
        class="tool-card"
        @click="openTool(tool)"
      >
        <div class="tool-icon">
          <i :class="['iconfont', tool.icon]"></i>
        </div>
        <div class="tool-info">
          <h3 class="tool-title">{{ tool.name }}</h3>
          <p class="tool-desc">{{ tool.description }}</p>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="currentTool" class="tool-modal" @click.self="closeTool">
        <div class="tool-content">
          <div class="tool-header">
            <h2>{{ currentTool.name }}</h2>
            <button class="close-btn" @click="closeTool">
              <i class="iconfont icon-stop"></i>
            </button>
          </div>
          <div class="tool-body">
            <component :is="currentTool.component" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

const currentTool = ref<any>(null)

interface Tool {
  id: string
  name: string
  description: string
  icon: string
  component: any
}

const tools: Tool[] = [
  {
    id: 'crypto',
    name: '加解密工具',
    description: '支持 Base64、MD5、SHA 等多种加密算法',
    icon: 'icon-pinned',
    component: defineAsyncComponent(() => import('./tools/Crypto-Tool.vue'))
  }
]

const openTool = (tool: Tool) => {
  currentTool.value = tool
}

const closeTool = () => {
  currentTool.value = null
}
</script>

<style scoped lang="less">
.tools-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.tool-card {
  background-color: var(--foreground-color);
  border-radius: 32px;
  border-left: solid 16px var(--pot-border-left);
  background-image: var(--deco1);
  background-size: contain;
  background-position: right;
  background-repeat: no-repeat;
  box-shadow: 0px 0px 8px rgb(var(--blue-shadow-color), 0.8);
  padding: 32px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 20px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 4px 16px rgb(var(--blue-shadow-color), 0.9);
  }
}

.tool-icon {
  flex: 0 0 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--btn-background);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: var(--font-color-gold);
}

.tool-info {
  flex: 1;
}

.tool-title {
  margin: 0 0 8px 0;
  color: var(--font-color-grey);
  font-size: 18px;
  font-weight: bold;
}

.tool-desc {
  margin: 0;
  color: var(--font-color-grey);
  font-size: 14px;
  opacity: 0.75;
}

.tool-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.tool-content {
  background-color: var(--foreground-color);
  border-radius: 32px;
  border-left: solid 16px var(--pot-border-left);
  background-image: var(--deco1);
  background-size: contain;
  background-position: right;
  background-repeat: no-repeat;
  box-shadow: 0px 0px 8px rgb(var(--blue-shadow-color), 0.8);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tool-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 2px solid var(--btn-background);

  h2 {
    margin: 0;
    color: var(--font-color-grey);
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
    color: var(--font-color-grey);
    transition: all 0.3s;

    &:hover {
      color: var(--font-color-gold);
      transform: rotate(90deg);
    }
  }
}

.tool-body {
  padding: 32px;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .tool-card {
    padding: 24px;
    border-left: solid 8px var(--pot-border-left);
  }

  .tool-content {
    max-height: 95vh;
  }

  .tool-header {
    padding: 16px 20px;
  }

  .tool-body {
    padding: 20px;
  }
}
</style>
