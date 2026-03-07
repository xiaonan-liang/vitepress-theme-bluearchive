// Spine Web Worker - 在后台线程处理 Spine 渲染
// 注意：由于 Spine 依赖 DOM，实际渲染仍需在主线程
// 此 Worker 主要用于音频解码和资产预加载

interface WorkerMessage {
  type: 'loadAudio' | 'decodeAudio' | 'preloadAssets' | 'clearCache'
  payload: any
}

interface AudioCache {
  buffer: ArrayBuffer
  timestamp: number
}

// 音频缓存
const audioCache = new Map<string, AudioCache>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟

// 处理消息
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { type, payload } = e.data

  switch (type) {
    case 'loadAudio':
      await handleLoadAudio(payload.url, payload.id)
      break
    case 'decodeAudio':
      await handleDecodeAudio(payload.arrayBuffer, payload.id)
      break
    case 'preloadAssets':
      await handlePreloadAssets(payload.urls, payload.id)
      break
    case 'clearCache':
      handleClearCache()
      break
  }
}

// 加载音频文件
async function handleLoadAudio(url: string, id: string) {
  try {
    // 检查缓存
    const cached = audioCache.get(url)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      self.postMessage({
        type: 'audioLoaded',
        id,
        url,
        buffer: cached.buffer,
        fromCache: true
      })
      return
    }

    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()

    // 存入缓存
    audioCache.set(url, {
      buffer: arrayBuffer,
      timestamp: Date.now()
    })

    // 清理过期缓存
    cleanupCache()

    self.postMessage({
      type: 'audioLoaded',
      id,
      url,
      buffer: arrayBuffer,
      fromCache: false
    })
  } catch (error) {
    self.postMessage({
      type: 'audioError',
      id,
      url,
      error: error.message
    })
  }
}

// 解码音频数据
async function handleDecodeAudio(arrayBuffer: ArrayBuffer, id: string) {
  try {
    // 注意：AudioContext 不能在 Worker 中使用
    // 这里只做数据预处理
    self.postMessage({
      type: 'audioDecoded',
      id,
      arrayBuffer
    })
  } catch (error) {
    self.postMessage({
      type: 'audioError',
      id,
      error: error.message
    })
  }
}

// 预加载多个资产
async function handlePreloadAssets(urls: string[], id: string) {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      if (url.endsWith('.ogg') || url.endsWith('.mp3')) {
        // 音频文件
        await handleLoadAudio(url, `${id}_${url}`)
        return { url, type: 'audio' }
      } else {
        // 其他资源（骨架、图集）
        const response = await fetch(url)
        const buffer = await response.arrayBuffer()
        return { url, type: 'data', size: buffer.byteLength }
      }
    })
  )

  const successful = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  self.postMessage({
    type: 'assetsPreloaded',
    id,
    successful,
    failed,
    total: urls.length
  })
}

// 清理缓存
function handleClearCache() {
  audioCache.clear()
  self.postMessage({
    type: 'cacheCleared'
  })
}

// 清理过期缓存
function cleanupCache() {
  const now = Date.now()
  for (const [url, entry] of audioCache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      audioCache.delete(url)
    }
  }
}

// 定期清理
setInterval(cleanupCache, 60000) // 每分钟清理一次
