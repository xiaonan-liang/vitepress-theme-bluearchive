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
        <div v-if="currentTabInfo?.reversible" class="mode-toggle-inline">
          <button
            :class="['mode-btn-small', { active: isEncode }]"
            @click="isEncode = true"
          >
            编码
          </button>
          <button
            :class="['mode-btn-small', { active: !isEncode }]"
            @click="isEncode = false"
          >
            解码
          </button>
        </div>
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

      <div v-if="currentTab === 's7'" class="s7-info">
        <p><strong>S7 加密说明：</strong></p>
        <ul>
          <li>S7 是一种自定义的 Base64 变体编码</li>
          <li>S7T 值是通过 MD5(s7 + 编码结果) 计算的 5 位哈希值</li>
          <li>解码时会自动计算原始的 S7T 值</li>
        </ul>
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
  { id: 's7', name: 'S7', reversible: true },
  { id: 'md5', name: 'MD5', reversible: false },
  { id: 'sha1', name: 'SHA-1', reversible: false },
  { id: 'sha256', name: 'SHA-256', reversible: false },
  { id: 'sha512', name: 'SHA-512', reversible: false }
]

const currentTabInfo = computed(() => {
  const tab = tabs.find(tab => tab.id === currentTab.value)
  return tab
})

const S7_TABLE = "Vg21WQ5KdRt0yNpcr9m4O3PoHaZvsLeCY8FjSwiTkUbuEBIJlAG7fqXM6xDnzh-;"

const s7encode = (inputStr: string): string => {
  if (!inputStr) return ""
  
  const s64List: string[] = []
  let index = 0
  
  while (inputStr.length >= index + 1) {
    let buf = 0
    let bytesNum = 0
    
    for (let i = 0; i < 3; i++) {
      buf = buf * 256
      if (inputStr.length >= index + 1) {
        buf += inputStr.charCodeAt(index)
        bytesNum++
        index++
      }
    }
    
    for (let i = 0; i < bytesNum + 1; i++) {
      const b64char = Math.floor(buf / 262144) % 64
      s64List.push(S7_TABLE[b64char])
      buf = buf * 64
    }
    
    for (let i = 0; i < 3 - bytesNum; i++) {
      s64List.push('_')
    }
  }
  
  return s64List.join('')
}

const s7decode = (encodedStr: string): string => {
  const cleanedStr = encodedStr.replace(/_+$/, '')
  const data: number[] = []
  let index = 0
  
  while (index < cleanedStr.length) {
    const chunk = cleanedStr.substring(index, index + 4)
    const indices = chunk.split('').map(c => S7_TABLE.indexOf(c))
    
    if (chunk.length === 4) {
      const num = (indices[0] << 18) | (indices[1] << 12) | (indices[2] << 6) | indices[3]
      data.push((num >> 16) & 0xFF)
      data.push((num >> 8) & 0xFF)
      data.push(num & 0xFF)
    } else if (chunk.length === 3) {
      const num = (indices[0] << 12) | (indices[1] << 6) | indices[2]
      data.push((num >> 10) & 0xFF)
      data.push((num >> 2) & 0xFF)
    } else if (chunk.length === 2) {
      const num = (indices[0] << 6) | indices[1]
      data.push((num >> 4) & 0xFF)
    }
    
    index += chunk.length
  }
  
  return String.fromCharCode(...data)
}

const generateS7t = (s7String: string): string => {
  const combined = 's7' + s7String
  const md5Hash = hashText(combined, 'MD5')
  return md5Hash.substring(6, 11)
}

const getOriginalS7t = (decodedStr: string): string => {
  const reEncoded = s7encode(decodedStr)
  return generateS7t(reEncoded)
}

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
      case 's7':
        if (isEncode.value) {
          const encoded = s7encode(inputText.value)
          const s7tValue = generateS7t(encoded)
          outputText.value = `${encoded}\nS7T: ${s7tValue}`
        } else {
          const decoded = s7decode(inputText.value)
          const originalS7t = getOriginalS7t(decoded)
          outputText.value = `${decoded}\n原始S7T: ${originalS7t}`
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
  align-items: center;
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

.mode-toggle-inline {
  display: flex;
  gap: 4px;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--btn-background);

  .mode-btn-small {
    padding: 10px 16px;
    border: none;
    background-color: transparent;
    color: var(--font-color-grey);
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    font-weight: bold;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
      background-color: var(--btn-hover);
      color: var(--font-color-gold);
    }
  }
}

.s7-info {
  padding: 16px;
  background-color: var(--btn-background);
  border-radius: 8px;
  border-left: 4px solid var(--font-color-gold);

  p {
    margin: 0 0 12px 0;
    color: var(--font-color-grey);
    font-size: 14px;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    color: var(--font-color-grey);
    font-size: 13px;
    opacity: 0.8;

    li {
      margin-bottom: 4px;
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
