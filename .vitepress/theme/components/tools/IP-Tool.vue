<template>
  <div class="ip-tool-container">
    <!-- 输入区域 -->
    <div class="input-section">
      <h3>IP地址查询</h3>
      <div class="input-group">
        <input 
          v-model="ipAddress"
          type="text"
          placeholder="请输入IP地址 (如: 1.1.1.1)"
          @keyup.enter="queryAll"
        />
        <button @click="queryAll" class="query-btn">查询</button>
      </div>
    </div>

    <!-- 查询结果 -->
    <div class="results-section" v-if="results.length > 0">
      <h3>查询结果</h3>
      <div class="result-card" v-for="(result, index) in results" :key="index">
        <div class="result-header">
          <span class="result-title">{{ result.title }}</span>
          <span class="result-status" :class="result.status">{{ result.status }}</span>
        </div>
        <div class="result-content">
          <pre>{{ formatResult(result.data) }}</pre>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-section" v-if="loading">
      <div class="spinner"></div>
      <p>查询中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// IP地址输入
const ipAddress = ref('')

// 查询结果
const results = ref([])

// 加载状态
const loading = ref(false)

// 查询所有接口
const queryAll = async () => {
  if (!ipAddress.value.trim()) {
    alert('请输入IP地址')
    return
  }

  loading.value = true
  results.value = []

  try {
    // 并发查询所有接口
    const queries = [
      queryHostname(),
      queryRDAP(),
      queryBaidu(),
      queryIP77()
    ]

    const resultsData = await Promise.allSettled(queries)
    
    // 处理结果
    results.value = resultsData.map((item, index) => ({
      title: ['主机名查询', 'RDAP查询', '百度IP查询', 'IP77查询'][index],
      status: item.status === 'fulfilled' ? 'success' : 'error',
      data: item.status === 'fulfilled' ? item.value : item.reason
    }))
  } catch (error) {
    console.error('查询失败:', error)
  } finally {
    loading.value = false
  }
}

// 主机名查询（使用代理）
const queryHostname = async () => {
  try {
    const response = await fetch(`/api/hostname/${ipAddress.value}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(`主机名查询失败: ${error.message}`)
  }
}

// RDAP查询（使用代理）
const queryRDAP = async () => {
  try {
    const response = await fetch(`/api/rdap/${ipAddress.value}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(`RDAP查询失败: ${error.message}`)
  }
}

// 百度IP查询（使用代理）
const queryBaidu = async () => {
  try {
    const response = await fetch(`/api/baidu?query=[${ipAddress.value}]&co=&resource_id=6006&oe=utf8`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(`百度查询失败: ${error.message}`)
  }
}

// IP77查询（使用代理）
const queryIP77 = async () => {
  try {
    const response = await fetch('/api/ip77', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `ip=${ipAddress.value}`
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(`IP77查询失败: ${error.message}`)
  }
}

// 格式化结果
const formatResult = (data) => {
  if (typeof data === 'string') {
    return data
  }
  return JSON.stringify(data, null, 2)
}
</script>

<style scoped lang="less">
.ip-tool-container {
  max-width: 800px;
  margin: 0 auto;
}

.input-section {
  margin-bottom: 24px;

  h3 {
    margin-bottom: 12px;
    color: var(--font-color-grey);
  }

  .input-group {
    display: flex;
    gap: 12px;

    input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid var(--btn-background);
      border-radius: 8px;
      font-size: 14px;
      font-family: 'JetBrains Mono', monospace;
      background-color: var(--foreground-color);
      color: var(--font-color-grey);

      &:focus {
        outline: none;
        border-color: var(--color-blue);
        box-shadow: 0 0 0 2px rgba(var(--blue-shadow-color), 0.3);
      }
    }

    .query-btn {
      padding: 12px 24px;
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

      &:active {
        transform: translateY(0);
      }
    }
  }
}

.results-section {
  margin-bottom: 24px;

  h3 {
    margin-bottom: 12px;
    color: var(--font-color-grey);
  }

  .result-card {
    background-color: var(--foreground-color);
    border: 2px solid var(--btn-background);
    border-radius: 8px;
    margin-bottom: 16px;
    overflow: hidden;

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 2px solid var(--btn-background);

      .result-title {
        font-weight: 600;
        color: var(--font-color-grey);
      }

      .result-status {
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;

        &.success {
          background-color: #52c41a;
          color: white;
        }

        &.error {
          background-color: #ff4d4f;
          color: white;
        }
      }
    }

    .result-content {
      padding: 16px;

      pre {
        margin: 0;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        line-height: 1.5;
        color: var(--font-color-grey);
        white-space: pre-wrap;
        word-break: break-all;
        max-height: 400px;
        overflow-y: auto;
      }
    }
  }
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--btn-background);
    border-top-color: var(--color-blue);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 12px;
  }

  p {
    margin: 0;
    color: var(--font-color-grey);
    font-size: 14px;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;

    .query-btn {
      width: 100%;
    }
  }

  .result-content {
    pre {
      font-size: 10px;
    }
  }
}
</style>
