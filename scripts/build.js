#!/usr/bin/env node

/**
 * 安全的构建脚本
 * 确保在 GitHub Actions 中正常工作
 */

const { execSync } = require('child_process')
const { existsSync } = require('fs')

console.log('🚀 开始构建...')
console.log('=' .repeat(60))

try {
    // 检查是否在 CI 环境中
    const isCI = process.env.CI === 'true'
    
    if (isCI) {
      console.log('📦 CI 环境检测到')
      console.log('   跳过压缩步骤（GitHub Pages 会自动处理）')
      console.log()
    }
    
    // 执行 VitePress 构建
    console.log('🔨 构建 VitePress...')
    execSync('pnpm run build:vitepress', { stdio: 'inherit' })
    console.log('✓ VitePress 构建完成')
    console.log()
    
    // 只在本地环境执行压缩
    if (!isCI) {
      console.log('🗜️  执行压缩...')
      try {
        execSync('pnpm run build:compress', { stdio: 'inherit' })
        console.log('✓ 压缩完成')
      } catch (e) {
        console.warn('⚠️  压缩失败，但构建已完成')
        console.warn('   这不会影响部署')
      }
    }
  
  console.log()
  console.log('=' .repeat(60))
  console.log('✓ 构建成功完成！')
  console.log('=' .repeat(60))
  
} catch (error) {
  console.error()
  console.error('✗ 构建失败')
  console.error('='.repeat(60))
  console.error(error.message)
  process.exit(1)
}
