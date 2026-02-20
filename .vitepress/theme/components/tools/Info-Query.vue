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

    <div class="note-section">
      <p><strong>注意:</strong> 由于 CORS 跨域限制，可能无法直接访问真实接口。以下是模拟数据展示。</p>
    </div>

    <div v-if="result" class="result-section">
      <h3>查询结果:</h3>
      <pre>{{ formattedResult }}</pre>
    </div>

    <div v-if="error" class="error-section">
      <h3>错误信息:</h3>
      <p>{{ error }}</p>
      <p v-if="showCorsTip" class="cors-tip">
        这可能是由于 CORS 跨域限制导致的。请尝试使用浏览器扩展或代理来解决此问题。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const opUin = ref('')
const version = ref('1.53.2') // 默认版本号
const loading = ref(false)
const result = ref<any>(null)
const error = ref('')
const showCorsTip = ref(false)

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

// 模拟数据
const mockData = {
  1: {
    "msg": {
      "addr": "广东",
      "caddr": "深圳",
      "uin": "{{opUin}}"
    },
    "result": 0
  },
  2: {
    "1": {
      "profile": {
        "custom_skin": {
          "1003": {
            "node": "34",
            "checked": 1,
            "dir": "20251001",
            "md5": "0beac5b212c160ce9c1045afe339958b",
            "open_svr": 10,
            "ext": "png"
          },
          "1001": {
            "node": "31",
            "checked": 1,
            "dir": "20260204",
            "md5": "2e104fe37c8dec3b19de26f77805e9c9",
            "open_svr": 10,
            "ext": "png"
          },
          "cc": 2,
          "1004": {
            "node": "31",
            "checked": 1,
            "dir": "20251001",
            "md5": "eb6bba92bbd2343bbe792d1b4fa015ab",
            "open_svr": 10,
            "ext": "png"
          },
          "cc_time": 1770168911
        },
        "RoleInfo": {
          "AvatarSkin": {
            "2": {
              "Part": 5,
              "AuthorUin": 1000,
              "ModelID": 1123
            },
            "5": {
              "Data": {
                "DyeInfo": {
                  "1": {
                    "1": 0,
                    "2": 0.89999997615814,
                    "3": 0.5,
                    "4": 0.5
                  },
                  "2": {
                    "1": 1,
                    "2": 0.87999999523163,
                    "3": 0.5,
                    "4": 0.5
                  },
                  "3": {
                    "1": 2,
                    "2": 0.86999994516373,
                    "3": 0.5,
                    "4": 0.5
                  }
                }
              },
              "Part": 1,
              "AuthorUin": 1000,
              "ModelID": 3153
            },
            "3": {
              "Part": 14,
              "AuthorUin": 1000,
              "ModelID": 2328
            },
            "1": {
              "Part": 3,
              "AuthorUin": 1000,
              "ModelID": 219
            },
            "4": {
              "Part": 16,
              "AuthorUin": 1000,
              "ModelID": 3697
            },
            "6": {
              "Part": 9,
              "AuthorUin": 1000,
              "ModelID": 708
            }
          },
          "Model": 2,
          "SkinID": 0,
          "HasAvatar": 1,
          "NickName": "[i][u][b]柔情猫娘"
        },
        "head_frame_id": 33262,
        "header3": {
          "url": "http://prod-env-cloud-resshop.mini1.cn/resshop/1487340263/f66a31817b6d73cf65c2a2affefb923a60378c772df3a0108a8845ae707d3c24/57b746cfafae372818a5f2b392b4495c.png",
          "time": 1757729434
        },
        "header2": {
          "url": "http://map31.mini1.cn/map/31/20231224/8ee6f392fd718426ba964ee541efa7fc.png"
        },
        "last_login_time": 1771544915,
        "uin": "{{opUin}}",
        "create_time": 1643345691
      },
      "uin": "{{opUin}}"
    }
  },
  3: {
    "1": {
      "uin": "{{opUin}}",
      "profile": {
        "fun_count": 2359405,
        "creator": {
          "stat": 1,
          "level": 6
        },
        "RoleInfo": {
          "SkinID": 0,
          "_v_": 1,
          "NickName": "迷你队长",
          "head_id": 4,
          "AvatarSkin": {},
          "Model": 4,
          "HasAvatar": 14
        },
        "map_count": 35,
        "register_rongcloud": 1,
        "user_version": 1,
        "head_frame_id": 1,
        "create_time": 1435200187,
        "last_login_time": 1743127634
      }
    }
  }
}

const validateInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  // 只允许输入数字
  target.value = target.value.replace(/[^0-9]/g, '')
  opUin.value = target.value
}

const fetchVersion = async () => {
  loading.value = true
  error.value = ''
  showCorsTip.value = false
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
    showCorsTip.value = true
    // 使用默认版本号
    version.value = '1.53.2'
  } finally {
    loading.value = false
  }
}

const getMockData = (apiId: number) => {
  const data = JSON.stringify(mockData[apiId as keyof typeof mockData])
  return JSON.parse(data.replace(/{{opUin}}/g, opUin.value))
}

const queryApi = async (apiId: number) => {
  if (!opUin.value) {
    error.value = '请输入数字'
    showCorsTip.value = false
    return
  }

  loading.value = true
  error.value = ''
  result.value = null
  showCorsTip.value = false

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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    result.value = data
  } catch (err) {
    error.value = `查询失败: ${(err as Error).message}`
    showCorsTip.value = true
    // 使用模拟数据
    result.value = getMockData(apiId)
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

.note-section {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f0f8ff;
  border-radius: 8px;
  border: 1px solid #b8e0ff;

  p {
    margin: 0;
    color: #1890ff;
    font-size: 14px;
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
    margin: 0 0 8px 0;
    color: #ff4d4f;
  }

  .cors-tip {
    font-size: 14px;
    opacity: 0.8;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed #ff4d4f;
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