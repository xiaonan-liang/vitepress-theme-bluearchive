<template>
  <div class="color-tool-container">
    <!-- 颜色代码区域 -->
    <div class="color-section">
      <h3>颜色代码:</h3>
      <div class="color-buttons">
        <button @click="result += '#R'" class="color-btn">#R (红)</button>
        <button @click="result += '#G'" class="color-btn">#G (绿)</button>
        <button @click="result += '#B'" class="color-btn">#B (蓝)</button>
        <button @click="result += '#Y'" class="color-btn">#Y (黄)</button>
        <button @click="result += '#K'" class="color-btn">#K (黑)</button>
        <button @click="result += '#W'" class="color-btn">#W (白)</button>
      </div>
    </div>

    <!-- 功能代码区域 -->
    <div class="function-section">
      <h3>功能代码:</h3>
      <div class="function-buttons">
        <button @click="result += '#b2'" class="function-btn">#b2 (快闪字)</button>
        <button @click="result += '[i]'" class="function-btn">[i] (斜体)</button>
        <button @click="result += '[u]'" class="function-btn">[u] (下划线)</button>
        <button @click="result += '[b]'" class="function-btn">[b] (粗体)</button>
        <button @click="result += '[color]'" class="function-btn">[color] (颜色)</button>
        <button @click="result += '\\n'" class="function-btn">\n (换行)</button>
      </div>
    </div>

    <!-- 结果区域 -->
    <div class="result-section">
      <h3>生成结果:</h3>
      <textarea 
        v-model="result"
        placeholder="生成的代码将显示在这里"
        rows="4"
      ></textarea>
      <div class="result-actions">
        <button @click="copyResult" class="action-btn">复制结果</button>
        <button @click="clearResult" class="action-btn">清空</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const result = ref('')

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
</script>

<style scoped lang="less">
.color-tool-container {
  max-width: 800px;
  margin: 0 auto;
}

.color-section {
  margin-bottom: 24px;

  h3 {
    margin-bottom: 12px;
    color: var(--font-color-grey);
  }

  .color-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 10px;

    .color-btn {
      padding: 10px;
      background-color: var(--btn-background);
      color: white;
      border: none;
      border-radius: 6px;
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

.function-section {
  margin-bottom: 24px;

  h3 {
    margin-bottom: 12px;
    color: var(--font-color-grey);
  }

  .function-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;

    .function-btn {
      padding: 10px;
      background-color: var(--btn-background);
      color: white;
      border: none;
      border-radius: 6px;
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
  .color-buttons,
  .function-buttons {
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