<template>
  <div class="crypto-tool">
    <div class="crypto-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="crypto-content">
      <div v-if="currentTabInfo?.reversible" class="mode-toggle">
        <button
          :class="['mode-btn', { active: isEncode }]"
          @click="isEncode = true"
        >
          编码
        </button>
        <button
          :class="['mode-btn', { active: !isEncode }]"
          @click="isEncode = false"
        >
          解码
        </button>
      </div>

      <div class="input-section">
        <label>输入内容</label>
        <textarea
          v-model="inputText"
          placeholder="请输入要处理的内容..."
          rows="6"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button class="action-btn primary" @click="processText">
          {{ currentTabInfo?.reversible ? (isEncode ? '编码' : '解码') : '加密' }}
        </button>
        <button class="action-btn" @click="clearText">清空</button>
        <button class="action-btn" @click="copyResult">复制结果</button>
      </div>

      <div class="output-section">
        <label>输出结果</label>
        <textarea
          v-model="outputText"
          placeholder="处理结果将显示在这里..."
          rows="6"
          readonly
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentTab = ref('base64')
const inputText = ref('')
const outputText = ref('')
const isEncode = ref(true)

const tabs = [
  { id: 'base64', name: 'Base64', reversible: true },
  { id: 'md5', name: 'MD5', reversible: false },
  { id: 'sha1', name: 'SHA-1', reversible: false },
  { id: 'sha256', name: 'SHA-256', reversible: false },
  { id: 'sha512', name: 'SHA-512', reversible: false }
]

const currentTabInfo = computed(() => {
  const tab = tabs.find(tab => tab.id === currentTab.value)
  return tab
})

const processText = async () => {
  if (!inputText.value) {
    outputText.value = ''
    return
  }

  try {
    switch (currentTab.value) {
      case 'base64':
        if (isEncode.value) {
          outputText.value = btoa(unescape(encodeURIComponent(inputText.value)))
        } else {
          outputText.value = decodeURIComponent(escape(atob(inputText.value)))
        }
        break
      case 'md5':
        outputText.value = await hashText(inputText.value, 'MD5')
        break
      case 'sha1':
        outputText.value = await hashText(inputText.value, 'SHA-1')
        break
      case 'sha256':
        outputText.value = await hashText(inputText.value, 'SHA-256')
        break
      case 'sha512':
        outputText.value = await hashText(inputText.value, 'SHA-512')
        break
    }
  } catch (error) {
    outputText.value = '处理失败：' + (error as Error).message
  }
}

const hashText = async (text: string, algorithm: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const clearText = () => {
  inputText.value = ''
  outputText.value = ''
}

const copyResult = async () => {
  if (!outputText.value) return
  
  try {
    await navigator.clipboard.writeText(outputText.value)
    alert('已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}
</script>

<style scoped lang="less">
.crypto-tool {
  width: 100%;
}

.crypto-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: var(--btn-background);
  color: var(--font-color-grey);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;

  &:hover {
    background-color: var(--btn-hover);
  }

  &.active {
    background-color: var(--btn-hover);
    color: var(--font-color-gold);
    font-weight: bold;
  }
}

.crypto-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    color: var(--font-color-grey);
    font-weight: bold;
    font-size: 14px;
  }

  textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--btn-background);
    border-radius: 12px;
    background-color: var(--general-background-color);
    color: var(--font-color-grey);
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    resize: vertical;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: var(--btn-hover);
    }

    &::placeholder {
      color: var(--font-color-grey);
      opacity: 0.5;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background-color: var(--btn-background);
  color: var(--font-color-grey);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background-color: var(--btn-hover);
    transform: translateY(-2px);
  }

  &.primary {
    background-color: var(--btn-hover);
    color: var(--font-color-gold);
  }
}

.mode-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;

  .mode-btn {
    flex: 1;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background-color: var(--btn-background);
    color: var(--font-color-grey);
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    font-weight: bold;

    &:hover {
      background-color: var(--btn-hover);
    }

    &.active {
      background-color: var(--btn-hover);
      color: var(--font-color-gold);
    }
  }
}

@media (max-width: 768px) {
  .crypto-tabs {
    gap: 4px;
  }

  .tab-btn {
    padding: 8px 12px;
    font-size: 12px;
  }

  .action-buttons {
    flex-direction: column;

    .action-btn {
      width: 100%;
    }
  }
}
</style>
