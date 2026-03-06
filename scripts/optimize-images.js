/**
 * 图片优化脚本
 * 压缩和转换图片为 WebP 格式
 */

import { execSync } from 'child_process'
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'
import { join, extname } from 'path'

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']
const QUALITY = 80

/**
 * 检查是否安装了 sharp
 */
function checkSharp() {
  try {
    require('sharp')
    return true
  } catch (e) {
    return false
  }
}

/**
 * 使用 sharp 优化图片
 */
async function optimizeWithSharp(inputPath, outputPath) {
  try {
    const sharp = require('sharp')
    const image = sharp(inputPath)
    const metadata = await image.metadata()

    // 转换为 WebP
    await image
      .webp({ quality: QUALITY })
      .toFile(outputPath)

    console.log(`✓ ${inputPath} -> ${outputPath}`)
    return true
  } catch (e) {
    console.error(`✗ ${inputPath}: ${e.message}`)
    return false
  }
}

/**
 * 使用 cwebp 优化图片（备用方案）
 */
function optimizeWithCwebp(inputPath, outputPath) {
  try {
    execSync(`cwebp -q ${QUALITY} "${inputPath}" -o "${outputPath}"`, { stdio: 'inherit' })
    console.log(`✓ ${inputPath} -> ${outputPath}`)
    return true
  } catch (e) {
    console.error(`✗ ${inputPath}: ${e.message}`)
    return false
  }
}

/**
 * 递归处理目录
 */
async function processDirectory(dir) {
  const files = readdirSync(dir)
  let processed = 0
  let failed = 0

  for (const file of files) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      const result = await processDirectory(filePath)
      processed += result.processed
      failed += result.failed
    } else if (IMAGE_EXTENSIONS.includes(extname(file).toLowerCase())) {
      const outputPath = filePath.replace(/\.[^.]+$/, '.webp')
      
      // 跳过已经是 WebP 的文件
      if (extname(file).toLowerCase() === '.webp') {
        continue
      }

      // 跳过已存在的 WebP 文件
      try {
        statSync(outputPath)
        console.log(`- ${outputPath} 已存在，跳过`)
        continue
      } catch (e) {
        // 文件不存在，继续处理
      }

      let success = false

      // 尝试使用 sharp
      if (checkSharp()) {
        success = await optimizeWithSharp(filePath, outputPath)
      }

      // 备用方案：使用 cwebp
      if (!success) {
        success = optimizeWithCwebp(filePath, outputPath)
      }

      if (success) {
        processed++
      } else {
        failed++
      }
    }
  }

  return { processed, failed }
}

/**
 * 主函数
 */
async function main() {
  console.log('🖼️  图片优化工具')
  console.log('=' .repeat(50))

  // 检查依赖
  if (!checkSharp()) {
    console.log('⚠️  未安装 sharp，尝试使用 cwebp')
    console.log('   安装 sharp: npm install sharp --save-dev')
    console.log('   或安装 cwebp: https://developers.google.com/speed/webp/docs/cwebp')
  }

  // 处理 public 目录
  const publicDir = 'public'
  console.log(`\n处理目录: ${publicDir}`)
  console.log('-'.repeat(50))

  const result = await processDirectory(publicDir)

  console.log('\n' + '='.repeat(50))
  console.log(`✓ 成功: ${result.processed} 个文件`)
  console.log(`✗ 失败: ${result.failed} 个文件`)
  console.log('=' .repeat(50))
}

main().catch(console.error)
