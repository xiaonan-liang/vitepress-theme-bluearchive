<template>
  <div class="info-query-container">
    <div class="input-section">
      <label for="op-uin">输入数字 (op_uin):</label>
      <input 
        type="text" 
        id="op-uin" 
        v-model="opUin" 
        placeholder="请输入数字"
        @input="validateInput"
      >
    </div>

    <div class="version-section">
      <span>当前版本: {{ version }}</span>
      <button @click="fetchVersion" :disabled="loading">
        {{ loading ? '获取中...' : '刷新版本' }}
      </button>
    </div>

    <div class="api-section">
      <h3>选择接口查询:</h3>
      <div class="api-buttons">
        <button 
          v-for="api in apis" 
          :key="api.id"
          @click="queryApi(api.id)"
          :disabled="!opUin || loading"
        >
          {{ api.name }}
        </button>
      </div>
    </div>

    <div v-if="result" class="result-section">
      <h3>查询结果:</h3>
      <pre>{{ formattedResult }}</pre>
    </div>

    <div v-if="error" class="error-section">
      <h3>错误信息:</h3>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const opUin = ref('')
const version = ref('')
const loading = ref(false)
const result = ref<any>(null)
const error = ref('')

const apis = [
  {
    id: 1,
    name: '用户地址信息',
    url: 'https://shequ.mini1.cn:8081/miniw/user_ext',
    params: {
      act: 'get_user_addr',
      time: '',
      auth: '0430d5cd7bced2150aa06986764988ec',
      s2t: '',
      uin: '1078359',
      ver: '',
      apiid: '110',
      lang: '0',
      country: 'CN',
      s7e: '1'
    }
  },
  {
    id: 2,
    name: '用户详细资料',
    url: 'https://shequ.mini1.cn:8081/miniw/profile/',
    params: {
      act: 'getProfileBatch3',
      time: '',
      auth: 'e1fbda1a1a805610567f270116a31e15',
      s2t: '',
      ignore_writeoff: '0',
      uin: '1984491809',
      ver: '',
      apiid: '110',
      lang: '0',
      country: 'CN',
      s7e: '1'
    }
  },
  {
    id: 3,
    name: '用户基础资料',
    url: 'https://shequ.mini1.cn:8081//miniw/profile/',
    params: {
      act: 'getProfileBatch2',
      time: '',
      auth: 'd1548593844d679a6042145046366647',
      s2t: '',
      uin: '1984491809',
      ver: '',
      apiid: '110',
      lang: '0',
      country: 'CN',
      s7e: '1'
    }
  }
]

const validateInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  // 只允许输入数字
  target.value = target.value.replace(/[^0-9]/g, '')
  opUin.value = target.value
}

const fetchVersion = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('https://mnlogin.mini1.cn/version.js')
    const text = await response.text()
    // 提取版本号
    const versionMatch = text.match(/version:"([^"]+)"/)
    if (versionMatch && versionMatch[1]) {
      version.value = versionMatch[1]
    } else {
      throw new Error('无法获取版本号')
    }
  } catch (err) {
    error.value = `获取版本号失败: ${(err as Error).message}`
  } finally {
    loading.value = false
  }
}

const queryApi = async (apiId: number) => {
  if (!opUin.value) {
    error.value = '请输入数字'
    return
  }

  loading.value = true
  error.value = ''
  result.value = null

  try {
    const now = Math.floor(Date.now() / 1000)
    const api = apis.find(a => a.id === apiId)
    if (!api) return

    // 准备参数
    const params = { ...api.params }
    params.time = now.toString()
    params.s2t = (now - 345).toString() // 模拟 s2t 参数
    params.ver = version.value

    // 根据接口类型设置 op_uin 参数
    if (api.id === 1) {
      params.op_uin = opUin.value
    } else {
      params.op_uin_list = opUin.value
    }

    // 构建查询字符串
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')

    const url = `${api.url}?${queryString}`
    console.log('查询 URL:', url)

    // 发起请求
    const response = await fetch(url)
    const data = await response.json()
    result.value = data
  } catch (err) {
    error.value = `查询失败: ${(err as Error).message}`
  } finally {
    loading.value = false
  }
}

const formattedResult = computed(() => {
  if (!result.value) return ''
  return JSON.stringify(result.value, null, 2)
})

// 组件挂载时获取版本号
onMounted(() => {
  fetchVersion()
})
</script>

<style scoped lang="less">
.info-query-container {
  max-width: 800px;
  margin: 0 auto;
}

.input-section {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: var(--font-color-grey);
  }

  input {
    width: 100%;
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

.version-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 12px 16px;
  background-color: var(--foreground-color);
  border-radius: 8px;
  border: 1px solid var(--btn-background);

  span {
    color: var(--font-color-grey);
  }

  button {
    padding: 8px 16px;
    background-color: var(--btn-background);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover:not(:disabled) {
      background-color: var(--btn-hover);
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.api-section {
  margin-bottom: 24px;

  h3 {
    margin-bottom: 12px;
    color: var(--font-color-grey);
  }

  .api-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;

    button {
      padding: 12px;
      background-color: var(--btn-background);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover:not(:disabled) {
        background-color: var(--btn-hover);
        transform: translateY(-2px);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}

.result-section,
.error-section {
  margin-top: 24px;
  padding: 20px;
  border-radius: 8px;
  background-color: var(--foreground-color);

  h3 {
    margin-top: 0;
    margin-bottom: 12px;
    color: var(--font-color-grey);
  }
}

.result-section {
  border: 2px solid var(--btn-background);

  pre {
    margin: 0;
    padding: 16px;
    background-color: var(--general-background-color);
    border-radius: 6px;
    overflow-x: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: var(--font-color-grey);
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.error-section {
  border: 2px solid #ff4d4f;

  p {
    margin: 0;
    color: #ff4d4f;
  }
}

@media (max-width: 768px) {
  .version-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .api-buttons {
    grid-template-columns: 1fr;
  }
}
</style>