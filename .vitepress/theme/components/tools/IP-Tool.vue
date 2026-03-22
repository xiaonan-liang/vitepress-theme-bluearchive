<template>
  <div class="ip-tool-container">
    <!-- 输入区域 -->
    <div class="input-section">
      <div class="section-header">
        <div class="icon-wrapper">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10 15.3 15.3 0 0 1 4 10z"/>
          </svg>
        </div>
        <h3>IP地址查询</h3>
      </div>
      <div class="input-group">
        <div class="input-wrapper">
          <input 
            v-model="ipAddress"
            type="text"
            placeholder="请输入IP地址 (如: 1.1.1.1)"
            @keyup.enter="queryAll"
            class="ip-input"
          />
          <div class="input-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
        </div>
        <button @click="queryAll" class="query-btn">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span>查询</span>
        </button>
      </div>
    </div>

    <!-- IP基本信息 -->
    <div class="ip-info-section" v-if="ipInfo">
      <div class="section-header">
        <div class="icon-wrapper">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <h3>IP基本信息</h3>
      </div>
      <div class="ip-info-card">
        <div class="ip-header">
          <div class="ip-address">{{ ipAddress }}</div>
          <div class="ip-tags">
            <span v-for="tag in ipTags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <div class="ip-details">
          <div class="detail-item">
            <span class="label">数字地址</span>
            <span class="value">{{ ipInfo.decimal }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.country">
            <span class="label">国家/地区</span>
            <span class="value">{{ ipInfo.country }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.asn">
            <span class="label">ASN</span>
            <span class="value">{{ ipInfo.asn }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.organization">
            <span class="label">企业</span>
            <span class="value">{{ ipInfo.organization }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.datacenter">
            <span class="label">数据中心</span>
            <span class="value">{{ ipInfo.datacenter }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 地理位置 -->
    <div class="location-section" v-if="locationData.length > 0">
      <div class="section-header">
        <div class="icon-wrapper">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <h3>地理位置 (多源对比)</h3>
      </div>
      <div class="location-list">
        <div v-for="(item, index) in locationData" :key="index" class="location-item">
          <span class="source">{{ item.source }}</span>
          <span class="location">{{ item.location }}</span>
        </div>
      </div>
    </div>

    <!-- 原始响应 -->
    <div class="raw-response-section" v-if="results.length > 0">
      <div class="section-header">
        <div class="icon-wrapper">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 15 9 15 6 12 2 12 5 9 2 9 5 6 12 6 15 9 15 18 12 22 12 19 9 22 6 19 6 15 9 15 12 12 12 15 15 18 12 22"/>
          </svg>
        </div>
        <h3>原始响应</h3>
      </div>
      <div class="results-grid">
        <div class="result-card" v-for="(result, index) in results" :key="index" :class="result.status">
          <div class="result-header">
            <div class="result-info">
              <div class="result-icon">
                <svg v-if="result.status === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <span class="result-title">{{ result.title }}</span>
            </div>
            <div class="result-badge" :class="result.status">
              {{ result.status === 'success' ? '成功' : '失败' }}
            </div>
          </div>
          <div class="result-content">
            <pre>{{ formatResult(result.data) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-section" v-if="loading">
      <div class="spinner-container">
        <div class="spinner"></div>
        <div class="spinner-ring"></div>
      </div>
      <p>正在查询，请稍候...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const ipAddress = ref('')
const results = ref([])
const loading = ref(false)
const ipInfo = ref(null)
const locationData = ref([])

// 计算IP标签
const ipTags = computed(() => {
  if (!ipInfo.value) return []
  const tags = []
  if (ipInfo.value.datacenter === '是') tags.push('数据中心')
  return tags
})

const queryAll = async () => {
  if (!ipAddress.value.trim()) {
    alert('请输入IP地址')
    return
  }

  loading.value = true
  results.value = []
  ipInfo.value = null
  locationData.value = []

  try {
    const queries = [
      queryHostname(),
      queryRDAP(),
      queryBaidu(),
      queryIP77()
    ]

    const resultsData = await Promise.allSettled(queries)
    
    results.value = resultsData.map((item, index) => ({
      title: ['主机名查询', 'RDAP查询', '百度IP查询', 'IP77查询'][index],
      status: item.status === 'fulfilled' ? 'success' : 'error',
      data: item.status === 'fulfilled' ? item.value : item.reason
    }))

    // 解析和整合数据
    parseIPInfo(resultsData)
  } catch (error) {
    console.error('查询失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchWithProxy = async (url: string, options?: RequestInit) => {
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl, options)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    throw error
  }
}

const queryHostname = async () => {
  try {
    return await fetchWithProxy(`https://browserleaks.com/api/hostname/${ipAddress.value}`)
  } catch (error) {
    throw new Error(`主机名查询失败: ${error.message}`)
  }
}

const queryRDAP = async () => {
  try {
    const response = await fetch(`https://rdap.apnic.net/ip/${ipAddress.value}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(`RDAP查询失败: ${error.message}`)
  }
}

const queryBaidu = async () => {
  try {
    return await fetchWithProxy(`https://opendata.baidu.com/api.php?query=${ipAddress.value}&co=&resource_id=6006&oe=utf8`)
  } catch (error) {
    throw new Error(`百度查询失败: ${error.message}`)
  }
}

const queryIP77 = async () => {
  try {
    const response = await fetch('https://api.ip77.net/ip2/v4/', {
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

// 解析IP信息
const parseIPInfo = (resultsData) => {
  const info = {
    decimal: ipToDecimal(ipAddress.value)
  }

  // 解析RDAP数据
  const rdapResult = resultsData[1].status === 'fulfilled' ? resultsData[1].value : null
  if (rdapResult) {
    if (rdapResult.country) info.country = rdapResult.country
    if (rdapResult.entities?.[0]?.vcardArray?.[1]?.[1]?.[3]) {
      info.organization = rdapResult.entities[0].vcardArray[1][1][3]
    }
  }

  // 解析百度数据
  const baiduResult = resultsData[2].status === 'fulfilled' ? resultsData[2].value : null
  if (baiduResult?.data?.[0]) {
    if (baiduResult.data[0].location) info.country = baiduResult.data[0].location
  }

  // 解析IP77数据
  const ip77Result = resultsData[3].status === 'fulfilled' ? resultsData[3].value : null
  if (ip77Result?.data) {
    if (ip77Result.data.country) info.country = ip77Result.data.country
    if (ip77Result.data.isp) info.organization = ip77Result.data.isp
    if (ip77Result.data.usage) info.datacenter = ip77Result.data.usage === '数据中心' ? '是' : '否'
  }

  ipInfo.value = info

  // 构建地理位置数据
  locationData.value = []
  if (rdapResult?.country) {
    locationData.value.push({ source: 'RDAP', location: rdapResult.country })
  }
  if (baiduResult?.data?.[0]?.location) {
    locationData.value.push({ source: '百度', location: baiduResult.data[0].location })
  }
  if (ip77Result?.data?.country) {
    locationData.value.push({ source: 'IP77', location: ip77Result.data.country })
  }
}

// IP转十进制
const ipToDecimal = (ip) => {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0).toString()
}

const formatResult = (data) => {
  if (typeof data === 'string') {
    return data
  }
  return JSON.stringify(data, null, 2)
}
</script>

<style scoped lang="less">
.ip-tool-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--btn-background), var(--btn-hover));
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .icon {
      width: 24px;
      height: 24px;
      color: white;
    }
  }

  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: var(--font-color-grey);
  }
}

.input-section {
  margin-bottom: 40px;
}

.input-group {
  display: flex;
  gap: 16px;
  align-items: stretch;
}

.input-wrapper {
  flex: 1;
  position: relative;

  .ip-input {
    width: 100%;
    padding: 16px 20px 16px 56px;
    border: 2px solid var(--btn-background);
    border-radius: 12px;
    font-size: 15px;
    font-family: 'JetBrains Mono', monospace;
    background-color: var(--foreground-color);
    color: var(--font-color-grey);
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--color-blue);
      box-shadow: 0 0 0 4px rgba(var(--blue-shadow-color), 0.1);
    }

    &::placeholder {
      color: rgba(128, 128, 128, 0.6);
    }
  }

  .input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    color: var(--btn-background);
    pointer-events: none;
  }
}

.query-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: linear-gradient(135deg, var(--btn-background), var(--btn-hover));
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .btn-icon {
    width: 20px;
    height: 20px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
}

.ip-info-section,
.location-section,
.raw-response-section {
  margin-bottom: 40px;
}

.ip-info-card {
  background-color: var(--foreground-color);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--btn-background);
}

.ip-header {
  margin-bottom: 20px;

  .ip-address {
    font-size: 24px;
    font-weight: 700;
    color: var(--font-color-grey);
    margin-bottom: 12px;
    font-family: 'JetBrains Mono', monospace;
  }

  .ip-tags {
    display: flex;
    gap: 8px;

    .tag {
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background-color: var(--btn-background);
      color: white;
    }
  }
}

.ip-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 8px;

    .label {
      font-size: 14px;
      color: rgba(128, 128, 128, 0.8);
      font-weight: 500;
    }

    .value {
      font-size: 14px;
      color: var(--font-color-grey);
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
    }
  }
}

.location-list {
  background-color: var(--foreground-color);
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid var(--btn-background);

  .location-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(128, 128, 128, 0.1);

    &:last-child {
      border-bottom: none;
    }

    .source {
      font-size: 14px;
      font-weight: 600;
      color: var(--btn-background);
    }

    .location {
      font-size: 14px;
      color: var(--font-color-grey);
      font-weight: 500;
    }
  }
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 20px;
}

.result-card {
  background-color: var(--foreground-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &.success {
    border-color: #52c41a;
  }

  &.error {
    border-color: #ff4d4f;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.1);
}

.result-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.result-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  .success & {
    background-color: rgba(82, 196, 26, 0.1);
    color: #52c41a;
  }

  .error & {
    background-color: rgba(255, 77, 79, 0.1);
    color: #ff4d4f;
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.result-title {
  font-weight: 600;
  font-size: 15px;
  color: var(--font-color-grey);
}

.result-badge {
  padding: 6px 16px;
  border-radius: 20px;
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

.result-content {
  padding: 20px;
  max-height: 350px;
  overflow-y: auto;

  pre {
    margin: 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    line-height: 1.6;
    color: var(--font-color-grey);
    white-space: pre-wrap;
    word-break: break-all;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(128, 128, 128, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--btn-background);
    border-radius: 4px;

    &:hover {
      background: var(--btn-hover);
    }
  }
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  .spinner-container {
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
  }

  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border: 4px solid transparent;
    border-top-color: var(--color-blue);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .spinner-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }

  p {
    margin: 0;
    color: var(--font-color-grey);
    font-size: 15px;
    font-weight: 500;
  }
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@media (max-width: 768px) {
  .ip-tool-container {
    padding: 16px;
  }

  .section-header {
    .icon-wrapper {
      width: 40px;
      height: 40px;

      .icon {
        width: 20px;
        height: 20px;
      }
    }

    h3 {
      font-size: 20px;
    }
  }

  .input-group {
    flex-direction: column;

    .query-btn {
      width: 100%;
      justify-content: center;
    }
  }

  .ip-details {
    grid-template-columns: 1fr;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .result-content {
    max-height: 300px;

    pre {
      font-size: 11px;
    }
  }
}
</style>
