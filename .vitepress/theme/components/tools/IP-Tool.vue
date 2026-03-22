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
          <div class="ip-address">{{ queriedIpAddress }}</div>
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
          <div class="detail-item" v-if="ipInfo.country_code">
            <span class="label">国家代码</span>
            <span class="value">{{ ipInfo.country_code }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.continent">
            <span class="label">大洲</span>
            <span class="value">{{ ipInfo.continent }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.district">
            <span class="label">区县</span>
            <span class="value">{{ ipInfo.district }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.street">
            <span class="label">街道</span>
            <span class="value">{{ ipInfo.street }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.organization">
            <span class="label">运营商</span>
            <span class="value">{{ ipInfo.organization }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.latitude && ipInfo.longitude">
            <span class="label">经纬度</span>
            <span class="value">{{ ipInfo.latitude }}, {{ ipInfo.longitude }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.area_code">
            <span class="label">地区代码</span>
            <span class="value">{{ ipInfo.area_code }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.zip_code">
            <span class="label">邮编</span>
            <span class="value">{{ ipInfo.zip_code }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.time_zone">
            <span class="label">时区</span>
            <span class="value">{{ ipInfo.time_zone }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.risk">
            <span class="label">风险等级</span>
            <span class="value">{{ ipInfo.risk.risk_level }}</span>
          </div>
          <div class="detail-item" v-if="ipInfo.risk">
            <span class="label">风险评分</span>
            <span class="value">{{ ipInfo.risk.risk_score }}/100</span>
          </div>
          <div class="detail-item" v-if="ipInfo.risk && ipInfo.risk.is_proxy">
            <span class="label">是否代理</span>
            <span class="value">{{ ipInfo.risk.is_proxy }}</span>
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

    <!-- 地图嵌入 -->
    <div class="map-section" v-if="ipInfo && ipInfo.latitude && ipInfo.longitude">
      <div class="section-header">
        <div class="icon-wrapper">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <h3>地图位置</h3>
      </div>
      <div class="map-container">
        <div id="map" class="map"></div>
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
const queriedIpAddress = ref('')
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
  queriedIpAddress.value = ipAddress.value

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
    // 初始化地图
    setTimeout(initMap, 100)
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
    if (ip77Result.data.location) info.location = ip77Result.data.location
    if (ip77Result.data.continent) info.continent = ip77Result.data.continent
    if (ip77Result.data.country_code) info.country_code = ip77Result.data.country_code
    if (ip77Result.data.province) info.province = ip77Result.data.province
    if (ip77Result.data.city) info.city = ip77Result.data.city
    if (ip77Result.data.district) info.district = ip77Result.data.district
    if (ip77Result.data.street) info.street = ip77Result.data.street
    if (ip77Result.data.latitude) info.latitude = ip77Result.data.latitude
    if (ip77Result.data.longitude) info.longitude = ip77Result.data.longitude
    if (ip77Result.data.area_code) info.area_code = ip77Result.data.area_code
    if (ip77Result.data.zip_code) info.zip_code = ip77Result.data.zip_code
    if (ip77Result.data.time_zone) info.time_zone = ip77Result.data.time_zone
    if (ip77Result.data.risk) info.risk = ip77Result.data.risk
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
  if (ip77Result?.data?.location) {
    locationData.value.push({ source: 'IP77', location: ip77Result.data.location })
  }
}

// IP转十进制
const ipToDecimal = (ip) => {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0).toString()
}

// 初始化地图
const initMap = () => {
  if (!ipInfo.value || !ipInfo.value.latitude || !ipInfo.value.longitude) return
  
  // 检查百度地图API是否加载
  if (typeof BMap === 'undefined') {
    // 动态加载百度地图API
    const script = document.createElement('script')
    script.type = 'text/javascript'
    // 注意：这里使用的是测试AK，实际使用时请替换为自己的AK
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=E4805d16520de693a3fe707cdc962045&callback=initMap`
    script.async = true
    document.head.appendChild(script)
    return
  }
  
  // 清除旧地图
  const mapContainer = document.getElementById('map')
  if (mapContainer) {
    mapContainer.innerHTML = ''
  }
  
  // 创建地图实例
  const map = new BMap.Map('map')
  // 设置中心点坐标
  const point = new BMap.Point(ipInfo.value.longitude, ipInfo.value.latitude)
  // 初始化地图，设置中心点坐标和地图级别
  map.centerAndZoom(point, 15)
  // 添加地图控件
  map.addControl(new BMap.NavigationControl())
  map.addControl(new BMap.ScaleControl())
  map.addControl(new BMap.OverviewMapControl())
  // 添加标记
  const marker = new BMap.Marker(point)
  map.addOverlay(marker)
  // 添加信息窗口
  const infoWindow = new BMap.InfoWindow(`<p style="margin:0;line-height:20px;">IP: ${queriedIpAddress.value}</p><p style="margin:0;line-height:20px;">位置: ${ipInfo.value.location || ipInfo.value.country}</p>`)
  marker.addEventListener('click', function() {
    this.openInfoWindow(infoWindow)
  })
  // 自动打开信息窗口
  marker.openInfoWindow(infoWindow)
}

// 将initMap暴露给全局作用域，供百度地图API回调使用
(window as any).initMap = initMap


</script>

<style scoped lang="less">
.ip-tool-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 12px;
  font-size: 13px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  .icon-wrapper {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--btn-background), var(--btn-hover));
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .icon {
      width: 16px;
      height: 16px;
      color: white;
    }
  }

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: var(--font-color-grey);
  }
}

.input-section {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  gap: 8px;
  align-items: stretch;
  flex-wrap: nowrap;
}

.input-wrapper {
  flex: 1;
  position: relative;
  min-width: 0;
  max-width: calc(100% - 100px);

  .ip-input {
    width: 100%;
    padding: 8px 12px 8px 36px;
    border: 2px solid var(--btn-background);
    border-radius: 8px;
    font-size: 13px;
    font-family: 'JetBrains Mono', monospace;
    background-color: var(--foreground-color);
    color: var(--font-color-grey);
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--color-blue);
      box-shadow: 0 0 0 3px rgba(var(--blue-shadow-color), 0.1);
    }

    &::placeholder {
      color: rgba(128, 128, 128, 0.6);
      font-size: 12px;
    }
  }

  .input-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: var(--btn-background);
    pointer-events: none;
  }
}

.query-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--btn-background), var(--btn-hover));
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  flex-shrink: 0;

  .btn-icon {
    width: 14px;
    height: 14px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
}

.ip-info-section,
.location-section,
.map-section {
  margin-bottom: 16px;
}

.ip-info-card {
  background-color: var(--foreground-color);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--btn-background);
}

.ip-header {
  margin-bottom: 12px;

  .ip-address {
    font-size: 14px;
    font-weight: 700;
    color: var(--font-color-grey);
    margin-bottom: 8px;
    font-family: 'JetBrains Mono', monospace;
  }

  .ip-tags {
    display: flex;
    gap: 4px;

    .tag {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
      background-color: var(--btn-background);
      color: white;
    }
  }
}

.ip-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 6px;

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 4px;

    .label {
      font-size: 11px;
      color: rgba(128, 128, 128, 0.8);
      font-weight: 500;
    }

    .value {
      font-size: 11px;
      color: var(--font-color-grey);
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
    }
  }
}

.location-list {
  background-color: var(--foreground-color);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--btn-background);

  .location-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid rgba(128, 128, 128, 0.1);

    &:last-child {
      border-bottom: none;
    }

    .source {
      font-size: 11px;
      font-weight: 600;
      color: var(--btn-background);
    }

    .location {
      font-size: 11px;
      color: var(--font-color-grey);
      font-weight: 500;
    }
  }
}

.map-container {
  background-color: var(--foreground-color);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--btn-background);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);

  .map {
    width: 100%;
    height: 300px;
  }
}



.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;

  .spinner-container {
    position: relative;
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
  }

  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    border: 2px solid transparent;
    border-top-color: var(--color-blue);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .spinner-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }

  p {
    margin: 0;
    color: var(--font-color-grey);
    font-size: 12px;
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
    padding: 8px;
  }

  .section-header {
    .icon-wrapper {
      width: 28px;
      height: 28px;

      .icon {
        width: 14px;
        height: 14px;
      }
    }

    h3 {
      font-size: 14px;
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
}
</style>
