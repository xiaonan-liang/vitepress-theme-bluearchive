<template>
  <div
    class="tools-welcome-box"
    ref="welcomeBoxRef"
    @mousemove="parallax"
    @mouseleave="reset"
    :style="{ transform: `rotateY(${calcY}deg) rotateX(${calcX}deg)` }"
  >
    <span class="welcome-text">{{ welcomeText }}</span>
    <transition name="fade" appear>
      <div
        class="info-box"
        :style="{
          background: `linear-gradient(${angle}deg, var(--infobox-background-initial), var(--infobox-background-final))`,
        }"
      >
        <div class="tools-icon">
          <i class="iconfont icon-pinned"></i>
        </div>
        <span class="name">{{ name }}</span>
        <span class="motto">
          {{ mottoText }}
          <span class="pointer"></span>
        </span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, onMounted } from 'vue'

const themeConfig = useData().theme.value
const name = '工具箱'
const welcomeText = '实用工具'
const motto = ['让工作更高效', '让生活更便捷']
const mottoText = ref(motto[0])

const multiple = 30
const welcomeBoxRef = ref<HTMLElement | null>(null)
const calcY = ref(0)
const calcX = ref(0)
const angle = ref(0)

let mottoIndex = 0

const parallax = (e: MouseEvent) => {
  if (!welcomeBoxRef.value) return
  const rect = welcomeBoxRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  calcX.value = ((y / rect.height) - 0.5) * multiple
  calcY.value = -((x / rect.width) - 0.5) * multiple
  angle.value = (x / rect.width) * 360
}

const reset = () => {
  calcX.value = 0
  calcY.value = 0
}

onMounted(() => {
  setInterval(() => {
    mottoIndex = (mottoIndex + 1) % motto.length
    mottoText.value = motto[mottoIndex]
  }, 4000)
})
</script>

<style scoped lang="less">
.tools-welcome-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 0.1s;
  margin-top: 8vh;
}

.welcome-text {
  font-size: 48px;
  font-weight: bold;
  color: var(--font-color-grey);
  text-shadow: 0 0 10px rgba(var(--blue-shadow-color), 0.5);
  margin-bottom: 32px;
  letter-spacing: 4px;
}

.info-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 60px;
  border-radius: 32px;
  backdrop-filter: var(--blur-val);
  box-shadow: 0 0 20px rgba(var(--blue-shadow-color), 0.3);
  transition: transform 0.3s;
}

.tools-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--btn-background);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 40px;
  color: var(--font-color-gold);
}

.name {
  font-size: 32px;
  font-weight: bold;
  color: var(--font-color-grey);
  margin-bottom: 16px;
}

.motto {
  font-size: 18px;
  color: var(--font-color-grey);
  opacity: 0.8;
  position: relative;
  padding-right: 20px;
}

.pointer {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background-color: var(--font-color-gold);
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .welcome-text {
    font-size: 32px;
    letter-spacing: 2px;
  }

  .info-box {
    padding: 24px 32px;
  }

  .tools-icon {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }

  .name {
    font-size: 24px;
  }

  .motto {
    font-size: 14px;
  }
}
</style>
