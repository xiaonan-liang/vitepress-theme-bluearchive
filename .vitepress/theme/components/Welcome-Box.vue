<template>
  <div
    class="welcome-box"
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
        <img @dragstart.prevent src="../assets/banner/avatar.webp" alt="" class="avatar" />
        <span class="name">{{ name }}</span>
        <span class="motto">
          {{ mottoText }}
          <span class="pointer"></span>
        </span>
        <ul>
          <li v-for="item in social" :key="item.url">
            <a :href="item.url" target="_blank" rel="noopener noreferrer">
              <i :class="`iconfont icon-${item.icon} social`"></i>
            </a>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()
const { welcomeText, name, social } = theme.value

// 欢迎框视差效果
const welcomeBoxRef = ref<HTMLElement | null>(null)
let calcX = ref(0)
let calcY = ref(0)
const angle = ref(135)

const parallax = (e: MouseEvent) => {
  if (!welcomeBoxRef.value) return
  const rect = welcomeBoxRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  calcX.value = (y - centerY) / 20
  calcY.value = (centerX - x) / 20
  angle.value = 135 + (x - centerX) / 10
}

const reset = () => {
  calcX.value = 0
  calcY.value = 0
  angle.value = 135
}

// 打字机效果
let index = 0
const mottoText = ref('')
let randomMotto = ''

// 从API获取随机一言
const fetchRandomQuote = async () => {
  try {
    // 设置请求超时（5秒）
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    // 使用codelife API获取一言
    const response = await fetch('https://api.codelife.cc/yiyan/random?lang=cn', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      
      if (data.code === 200 && data.data && data.data.hitokoto) {
        // hitokoto在原本位置，from在下一行
        randomMotto = data.data.hitokoto
        if (data.data.from) {
          randomMotto += '\n' + data.data.from
        }
      } else {
        randomMotto = '和你的日常，就是奇迹'
      }
    } else {
      randomMotto = '和你的日常，就是奇迹'
    }
  } catch (error) {
    randomMotto = '和你的日常，就是奇迹'
  } finally {
    addNextCharacter()
  }
}

const addNextCharacter = () => {
  if (index < randomMotto.length) {
    mottoText.value += randomMotto[index]
    index++
    setTimeout(addNextCharacter, Math.random() * 150 + 50)
  }
}

onMounted(() => {
  fetchRandomQuote()
})
</script>

<style scoped lang="less">
.welcome-box {
  margin-top: 4.2vw;
  margin-left: 10vw;
  width: 21vw;
  height: 21vw;
  background: linear-gradient(135deg, var(--welcomebox-background-initial), var(--welcomebox-background-final));
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease-out;
  transform-style: preserve-3d;
  perspective: 1000px;

  .welcome-text {
    font-size: 2vw;
    font-weight: bold;
    color: var(--font-color-white);
    margin-bottom: 1vw;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .info-box {
    width: 18vw;
    height: 18vw;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);

    .avatar {
      width: 6vw;
      height: 6vw;
      border-radius: 50%;
      margin-bottom: 0.8vw;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .name {
      font-size: 1.2vw;
      font-weight: bold;
      color: var(--font-color-white);
      margin-bottom: 0.5vw;
    }

    .motto {
      font-size: 0.9vw;
      color: var(--font-color-white);
      text-align: center;
      padding: 0 1vw;
      line-height: 1.4;
      min-height: 2.5vw;
      white-space: pre-line;

      .pointer {
        display: inline-block;
        width: 2px;
        height: 1em;
        background-color: var(--font-color-white);
        margin-left: 2px;
        animation: blink 1s infinite;
      }
    }

    ul {
      display: flex;
      gap: 1vw;
      margin-top: 0.8vw;

      li {
        a {
          color: var(--font-color-white);
          font-size: 1.2vw;
          transition: transform 0.3s;

          &:hover {
            transform: scale(1.2);
          }
        }
      }
    }
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .welcome-box {
    margin-top: 10vw;
    margin-left: 0;
    width: 80vw;
    height: 80vw;

    .welcome-text {
      font-size: 6vw;
    }

    .info-box {
      width: 70vw;
      height: 70vw;

      .avatar {
        width: 20vw;
        height: 20vw;
      }

      .name {
        font-size: 4vw;
      }

      .motto {
        font-size: 3vw;
        padding: 0 4vw;
      }

      ul {
        gap: 4vw;
        margin-top: 2vw;

        li a {
          font-size: 5vw;
        }
      }
    }
  }
}

// 淡入动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
