/**
 * 构建后优化脚本
 * 生成 Brotli 和 Gzip 压缩文件
 */

import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, extname, relative } from 'path'
import { createBrotliCompress, createGzip } from 'zlib'
import { pipeline } from 'stream/promises'
import { createReadStream, createWriteStream } from 'fs'

const DIST_DIR = '.vitepress/dist'
const EXCLUDE_PATTERNS = [
  '.br',
  '.gz',
  '.map',
  '.webmanifest',
  'favicon.ico'
]

/**
 * 检查是否应该跳过文件
 */
function shouldSkipFile(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => filePath.includes(pattern))
}

/**
 * 压缩文件为 Brotli 格式
 */
async function compressBrotli(inputPath, outputPath) {
  try {
    const input = createReadStream(inputPath)
    const output = createWriteStream(outputPath)
    const brotli = createBrotliCompress({
      params: {
        [require('zlib').constants.BROTLI_PARAM_QUALITY]: 11,
        [require('zlib').constants.BROTLI_PARAM_MODE]: 0,
        [require('zlib').constants.BROTLI_PARAM_SIZE_HINT]: statSync(inputPath).size
      }
    })

    await pipeline(input, brotli, output)
    return true
  } catch (e) {
    console.error(`✗ Brotli 压缩失败 ${inputPath}: ${e.message}`)
    return false
  }
}

/**
 * 压缩文件为 Gzip 格式
 */
async function compressGzip(inputPath, outputPath) {
  try {
    const input = createReadStream(inputPath)
    const output = createWriteStream(outputPath)
    const gzip = createGzip({
      level: 9,
      memLevel: 9
    })

    await pipeline(input, gzip, output)
    return true
  } catch (e) {
    console.error(`✗ Gzip 压缩失败 ${inputPath}: ${e.message}`)
    return false
  }
}

/**
 * 递归处理目录
 */
async function processDirectory(dir, baseDir) {
  const files = readdirSync(dir)
  let processed = 0
  let brotliCount = 0
  let gzipCount = 0
  let totalSize = 0
  let brotliSize = 0
  let gzipSize = 0

  for (const file of files) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      const result = await processDirectory(filePath, baseDir)
      processed += result.processed
      brotliCount += result.brotliCount
      gzipCount += result.gzipCount
      totalSize += result.totalSize
      brotliSize += result.brotliSize
      gzipSize += result.gzipSize
    } else if (!shouldSkipFile(filePath)) {
      const ext = extname(file).toLowerCase()
      const textExtensions = ['.js', '.css', '.html', '.json', '.xml', '.svg', '.txt']
      
      // 只压缩文本文件
      if (textExtensions.includes(ext)) {
        const originalSize = stat.size
        totalSize += originalSize

        // Brotli 压缩
        const brotliPath = filePath + '.br'
        const brotliSuccess = await compressBrotli(filePath, brotliPath)
        if (brotliSuccess) {
          brotliCount++
          brotliSize += statSync(brotliPath).size
        }

        // Gzip 压缩
        const gzipPath = filePath + '.gz'
        const gzipSuccess = await compressGzip(filePath, gzipPath)
        if (gzipSuccess) {
          gzipCount++
          gzipSize += statSync(gzipPath).size
        }

        processed++

        const relPath = relative(baseDir, filePath)
        console.log(`✓ ${relPath} (${formatBytes(originalSize)})`)
      }
    }
  }

  return { processed, brotliCount, gzipCount, totalSize, brotliSize, gzipSize }
}

/**
 * 格式化字节大小
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 主函数
 */
async function main() {
  console.log('🗜️  构建后优化工具')
  console.log('=' .repeat(60))

  // 检查构建目录
  try {
    statSync(DIST_DIR)
  } catch (e) {
    console.error(`✗ 构建目录不存在: ${DIST_DIR}`)
    console.log('   请先运行: npm run build')
    process.exit(1)
  }

  console.log(`\n处理目录: ${DIST_DIR}`)
  console.log('-'.repeat(60))

  const result = await processDirectory(DIST_DIR, DIST_DIR)

  console.log('\n' + '='.repeat(60))
  console.log('📊 压缩统计')
  console.log('-'.repeat(60))
  console.log(`处理文件: ${result.processed} 个`)
  console.log(`Brotli: ${result.brotliCount} 个 (${formatBytes(result.brotliSize)})`)
  console.log(`Gzip: ${result.gzipCount} 个 (${formatBytes(result.gzipSize)})`)
  console.log(`原始大小: ${formatBytes(result.totalSize)}`)
  console.log(`Brotli 压缩率: ${((1 - result.brotliSize / result.totalSize) * 100).toFixed(1)}%`)
  console.log(`Gzip 压缩率: ${((1 - result.gzipSize / result.totalSize) * 100).toFixed(1)}%`)
  console.log('=' .repeat(60))
}

main().catch(console.error)
