<template>
  <div class="timestamp-tool">
    <div class="input-section">
      <label>时间戳输入</label>
      <textarea
        v-model="timestampInput"
        placeholder="请输入时间戳（秒或毫秒）"
        rows="3"
      ></textarea>
    </div>

    <div class="action-buttons">
      <button class="action-btn primary" @click="convertToDate">转换为日期</button>
      <button class="action-btn" @click="convertToTimestamp">转换为时间戳</button>
      <button class="action-btn" @click="clearText">清空</button>
      <button class="action-btn" @click="copyResult">复制结果</button>
      <button class="action-btn" @click="getCurrentTimestamp">当前时间戳</button>
    </div>

    <div class="output-section">
      <label>转换结果</label>
      <textarea
        v-model="outputText"
        placeholder="转换结果将显示在这里..."
        rows="3"
        readonly
      ></textarea>
    </div>

    <div class="options-section">
      <div class="option-group">
        <label>时间戳格式：</label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" v-model="timestampFormat" value="seconds" />
            秒
          </label>
          <label class="radio-label">
            <input type="radio" v-model="timestampFormat" value="milliseconds" />
            毫秒
          </label>
        </div>
      </div>

      <div class="option-group">
        <label>日期格式：</label>
        <select v-model="dateFormat">
          <option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</option>
          <option value="YYYY/MM/DD HH:mm:ss">YYYY/MM/DD HH:mm:ss</option>
          <option value="DD/MM/YYYY HH:mm:ss">DD/MM/YYYY HH:mm:ss</option>
          <option value="ISO">ISO 8601</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const timestampInput = ref('')
const outputText = ref('')
const timestampFormat = ref('seconds')
const dateFormat = ref('YYYY-MM-DD HH:mm:ss')

const convertToDate = () => {
  if (!timestampInput.value) {
    outputText.value = ''
    return
  }

  try {
    let timestamp = parseInt(timestampInput.value.trim())
    
    // 自动检测时间戳格式
    if (timestamp > 9999999999) {
      // 毫秒级时间戳
      timestamp = timestamp / 1000
    }

    const date = new Date(timestamp * 1000)
    
    switch (dateFormat.value) {
      case 'YYYY-MM-DD HH:mm:ss':
        outputText.value = formatDate(date)
        break
      case 'YYYY/MM/DD HH:mm:ss':
        outputText.value = formatDate(date, '/')
        break
      case 'DD/MM/YYYY HH:mm:ss':
        outputText.value = formatDateDDMMYYYY(date)
        break
      case 'ISO':
        outputText.value = date.toISOString()
        break
      default:
        outputText.value = formatDate(date)
    }
  } catch (error) {
    outputText.value = '转换失败：' + (error as Error).message
  }
}

const convertToTimestamp = () => {
  if (!timestampInput.value) {
    outputText.value = ''
    return
  }

  try {
    const input = timestampInput.value.trim()
    let date: Date

    // 尝试解析日期字符串
    if (isNaN(parseInt(input))) {
      date = new Date(input)
    } else {
      // 已经是时间戳，直接使用
      let timestamp = parseInt(input)
      if (timestamp > 9999999999) {
        // 毫秒级时间戳
        timestamp = timestamp / 1000
      }
      date = new Date(timestamp * 1000)
    }

    if (isNaN(date.getTime())) {
      throw new Error('无效的日期格式')
    }

    if (timestampFormat.value === 'seconds') {
      outputText.value = Math.floor(date.getTime() / 1000).toString()
    } else {
      outputText.value = date.getTime().toString()
    }
  } catch (error) {
    outputText.value = '转换失败：' + (error as Error).message
  }
}

const getCurrentTimestamp = () => {
  const now = Date.now()
  if (timestampFormat.value === 'seconds') {
    timestampInput.value = Math.floor(now / 1000).toString()
  } else {
    timestampInput.value = now.toString()
  }
  convertToDate()
}

const formatDate = (date: Date, separator: string = '-') => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}${separator}${month}${separator}${day} ${hours}:${minutes}:${seconds}`
}

const formatDateDDMMYYYY = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

const clearText = () => {
  timestampInput.value = ''
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
.timestamp-tool {
  width: 100%;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;

  label {
    color: var(--font-color-grey);
    font-weight: bold;
    font-size: 14px;
  }

  textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--btn-background);
    border-radius: 8px;
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
  margin-bottom: 24px;
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

.options-section {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid var(--btn-background);
}

.option-group {
  display: flex;
  align-items: center;
  gap: 12px;

  label {
    color: var(--font-color-grey);
    font-size: 14px;
  }

  select {
    padding: 8px 12px;
    border: 2px solid var(--btn-background);
    border-radius: 8px;
    background-color: var(--general-background-color);
    color: var(--font-color-grey);
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: var(--btn-hover);
    }
  }
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--font-color-grey);
  font-size: 14px;
  cursor: pointer;

  input[type="radio"] {
    accent-color: var(--font-color-gold);
  }
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;

    .action-btn {
      width: 100%;
    }
  }

  .options-section {
    flex-direction: column;
    gap: 16px;
  }

  .option-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>