/**
 * 依赖分析脚本
 * 检查项目中使用的依赖
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

// 依赖列表
const dependencies = {
  '@fontsource/jetbrains-mono': false,
  'animejs': false,
  'gray-matter': false,
  'markdown-it-custom-attrs': false,
  'md5': false,
  'minisearch': false,
  'normalize.css': false
}

// 支持的文件扩展名
const extensions = ['.js', '.ts', '.vue', '.astro', '.json', '.md']

/**
 * 检查文件中是否使用了某个依赖
 */
function checkFileForDependency(filePath, dependency) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    
    // 检查 import 语句
    const importPatterns = [
      new RegExp(`from ['"]${dependency}['"]`, 'g'),
      new RegExp(`from ['"]${dependency}/`, 'g'),
      new RegExp(`require\\(['"]${dependency}['"]\\)`, 'g'),
      new RegExp(`require\\(['"]${dependency}/`, 'g')
    ]
    
    return importPatterns.some(pattern => pattern.test(content))
  } catch (e) {
    return false
  }
}

/**
 * 递归扫描目录
 */
function scanDirectory(dir) {
  const files = readdirSync(dir)
  
  for (const file of files) {
    const filePath = join(dir, file)
    
    try {
      const stat = statSync(filePath)
      
      if (stat.isDirectory()) {
        // 跳过 node_modules 和 .git
        if (!file.startsWith('.') && file !== 'node_modules' && file !== '.git') {
          scanDirectory(filePath)
        }
      } else if (extensions.includes(extname(file))) {
        // 检查文件中使用的依赖
        for (const [dep, used] of Object.entries(dependencies)) {
          if (!used && checkFileForDependency(filePath, dep)) {
            dependencies[dep] = true
          }
        }
      }
    } catch (e) {
      // 忽略错误
    }
  }
}

/**
 * 主函数
 */
function main() {
  console.log('📦 依赖分析工具')
  console.log('=' .repeat(60))
  
  // 扫描项目
  scanDirectory('.')
  
  console.log('\n依赖使用情况:')
  console.log('-'.repeat(60))
  
  const used = []
  const unused = []
  
  for (const [dep, isUsed] of Object.entries(dependencies)) {
    if (isUsed) {
      used.push(dep)
      console.log(`✓ ${dep}`)
    } else {
      unused.push(dep)
      console.log(`✗ ${dep} (未使用)`)
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log(`总计: ${Object.keys(dependencies).length} 个依赖`)
  console.log(`使用中: ${used.length} 个`)
  console.log(`未使用: ${unused.length} 个`)
  
  if (unused.length > 0) {
    console.log('\n建议移除的依赖:')
    console.log('-'.repeat(60))
    unused.forEach(dep => {
      console.log(`  npm uninstall ${dep}`)
    })
  }
  
  console.log('=' .repeat(60))
}

main().catch(console.error)
