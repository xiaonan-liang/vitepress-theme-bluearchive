<template>
  <div class="color-tool-container">
    <div class="input-section">
      <label for="color-input">选择颜色:</label>
      <div class="color-input-group">
        <input 
          type="color" 
          id="color-input" 
          v-model="selectedColor"
          @change="updateColorCode"
        >
        <input 
          type="text" 
          v-model="colorCode"
          placeholder="颜色代码"
          @input="updateColorFromCode"
        >
      </div>
    </div>

    <div class="preview-section">
      <div class="preview-label">预览效果:</div>
      <div class="preview-box" :style="{ backgroundColor: selectedColor }"></div>
      <div class="preview-text" :style="{ color: selectedColor }">{{ previewText }}</div>
    </div>

    <div class="function-buttons">
      <h3>快速插入:</h3>
      <div class="button-grid">
        <button @click="insertFunction('{#b2}')" class="function-btn">
          #b2 (颜色)
        </button>
        <button @click="insertFunction('[i]')" class="function-btn">
          [i] (斜体)
        </button>
        <button @click="insertFunction('\\n')" class="function-btn">
          \n (换行)
        </button>
        <button @click="insertFunction('{#b2}' + previewText + '{/}')" class="function-btn">
          颜色文本
        </button>
      </div>
    </div>

    <div class="result-section">
      <h3>生成结果:</h3>
      <textarea 
        v-model="result"
        placeholder="生成的颜色代码将显示在这里"
        rows="4"
      ></textarea>
      <div class="result-actions">
        <button @click="copyResult" class="action-btn">
          复制结果
        </button>
        <button @click="clearResult" class="action-btn">
          清空
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const selectedColor = ref('#ffffff')
const colorCode = ref('#ffffff')
const result = ref('')
const previewText = ref('预览文本')

// 从颜色选择器更新颜色代码
const updateColorCode = () => {
  colorCode.value = selectedColor.value
  updateColorInResult()
}

// 从输入框更新颜色
const updateColorFromCode = () => {
  if (/^#[0-9A-Fa-f]{6}$/.test(colorCode.value)) {
    selectedColor.value = colorCode.value
    updateColorInResult()
  }
}

// 更新结果中的颜色代码
const updateColorInResult = () => {
  // 如果结果中已经有颜色代码，更新它
  if (result.value.includes('{#b2}')) {
    result.value = result.value.replace(/\{#b2\}([^\{]*)\{\/\}/g, `{#b2}${previewText.value}{/}`)
  }
}

// 插入功能性字符
const insertFunction = (text: string) => {
  if (text === '{#b2}') {
    // 插入颜色代码
    result.value += `{#b2}${previewText.value}{/}`
  } else {
    // 插入其他功能性字符
    result.value += text
  }
}

// 复制结果
const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(result.value)
    alert('复制成功！')
  } catch (err) {
    console.error('复制失败:', err)
    alert('复制失败，请手动复制')
  }
}

// 清空结果
const clearResult = () => {
  result.value = ''
}

// 监听颜色变化，自动更新结果中的颜色代码
watch(selectedColor, () => {
  updateColorInResult()
})
</script>

<style scoped lang="less">
.color-tool-container {
  max-width: 800px;
  margin: 0 auto;
}

.input-section {
  margin-bottom: 24px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: var(--font-color-grey);
  }

  .color-input-group {
    display: flex;
    gap: 12px;

    input[type="color"] {
      flex: 0 0 60px;
      height: 40px;
      border: 2px solid var(--btn-background);
      border-radius: 8px;
      cursor: pointer;
      padding: 2px;

      &::-webkit-color-swatch-wrapper {
        padding: 0;
        border-radius: 6px;
      }

      &::-webkit-color-swatch {
        border: none;
        border-radius: 6px;
      }
    }

    input[type="text"] {
      flex: 1;
      padding: 10px;
      border: 2px solid var(--btn-background);
      border-radius: 8px;
      font-size: 16px;
      background-color: var(--foreground-color);
      color: var(--font-color-grey);

      &:focus {
        outline: none;
        border-color: var(--color-blue);
        box-shadow: 0 0 0 2px rgba(var(--blue-shadow-color), 0.3);
      }
    }
  }
}

.preview-section {
  margin-bottom: 24px;
  padding: 20px;
  background-color: var(--foreground-color);
  border-radius: 8px;
  border: 1px solid var(--btn-background);

  .preview-label {
    margin-bottom: 12px;
    font-weight: bold;
    color: var(--font-color-grey);
  }

  .preview-box {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    border: 2px solid var(--btn-background);
    margin-bottom: 12px;
  }

  .preview-text {
    font-size: 18px;
    font-weight: bold;
  }
}

.function-buttons {
  margin-bottom: 24px;

  h3 {
    margin-bottom: 12px;
    color: var(--font-color-grey);
  }

  .button-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;

    .function-btn {
      padding: 12px;
      background-color: var(--btn-background);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 14px;

      &:hover {
        background-color: var(--btn-hover);
        transform: translateY(-2px);
      }
    }
  }
}

.result-section {
  margin-bottom: 24px;

  h3 {
    margin-bottom: 12px;
    color: var(--font-color-grey);
  }

  textarea {
    width: 100%;
    padding: 16px;
    border: 2px solid var(--btn-background);
    border-radius: 8px;
    font-size: 14px;
    font-family: 'JetBrains Mono', monospace;
    background-color: var(--foreground-color);
    color: var(--font-color-grey);
    resize: vertical;

    &:focus {
      outline: none;
      border-color: var(--color-blue);
      box-shadow: 0 0 0 2px rgba(var(--blue-shadow-color), 0.3);
    }
  }

  .result-actions {
    display: flex;
    gap: 12px;
    margin-top: 12px;

    .action-btn {
      padding: 8px 16px;
      background-color: var(--btn-background);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: var(--btn-hover);
        transform: translateY(-2px);
      }
    }
  }
}

@media (max-width: 768px) {
  .color-input-group {
    flex-direction: column;

    input[type="color"] {
      flex: none;
      width: 100%;
    }
  }

  .button-grid {
    grid-template-columns: 1fr;
  }

  .result-actions {
    flex-direction: column;

    .action-btn {
      width: 100%;
      text-align: center;
    }
  }
}
</style>