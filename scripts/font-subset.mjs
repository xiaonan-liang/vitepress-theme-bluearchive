import Fontmin from 'fontmin'
import { glob } from 'glob'
import fs from 'fs'
import path from 'path'

const fontDir = './public/font'
const postsDir = './posts'
const outputDir = './public/font-subset'

// 收集所有需要子集化的字符
async function collectChars() {
  const chars = new Set<string>()
  
  // 添加基本ASCII字符
  for (let i = 32; i < 127; i++) {
    chars.add(String.fromCharCode(i))
  }
  
  // 添加中文字符范围
  const chineseRanges = [
    [0x4E00, 0x9FFF], // CJK统一汉字
    [0x3400, 0x4DBF], // CJK扩展A
    [0x20000, 0x2A6DF], // CJK扩展B
  ]
  
  // 从文章中提取字符
  const files = await glob(`${postsDir}/**/*.md`)
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    for (const char of content) {
      chars.add(char)
    }
  }
  
  // 从配置文件提取
  const configFiles = [
    './.vitepress/config.mts',
    './.vitepress/theme/**/*.{vue,ts,js}',
  ]
  
  for (const pattern of configFiles) {
    const files = await glob(pattern)
    for (const file of files) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8')
        for (const char of content) {
          chars.add(char)
        }
      }
    }
  }
  
  return Array.from(chars).join('')
}

// 子集化字体
async function subsetFonts() {
  console.log('开始收集字符...')
  const chars = await collectChars()
  console.log(`收集到 ${chars.length} 个字符`)
  
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  // 子集化 Blueaka 字体
  const blueakaFonts = [
    `${fontDir}/Blueaka/*.ttf`,
    `${fontDir}/Blueaka/*.otf`,
  ]
  
  for (const pattern of blueakaFonts) {
    const files = await glob(pattern)
    for (const file of files) {
      console.log(`子集化: ${file}`)
      
      const fontmin = new Fontmin()
        .src(file)
        .use(Fontmin.glyph({
          text: chars,
          hinting: false,
        }))
        .use(Fontmin.ttf2woff2())
        .dest(`${outputDir}/Blueaka`)
      
      await new Promise((resolve, reject) => {
        fontmin.run((err, files) => {
          if (err) reject(err)
          else resolve(files)
        })
      })
    }
  }
  
  // 子集化 Blueaka_Bold 字体
  const blueakaBoldFonts = [
    `${fontDir}/Blueaka_Bold/*.ttf`,
    `${fontDir}/Blueaka_Bold/*.otf`,
  ]
  
  for (const pattern of blueakaBoldFonts) {
    const files = await glob(pattern)
    for (const file of files) {
      console.log(`子集化: ${file}`)
      
      const fontmin = new Fontmin()
        .src(file)
        .use(Fontmin.glyph({
          text: chars,
          hinting: false,
        }))
        .use(Fontmin.ttf2woff2())
        .dest(`${outputDir}/Blueaka_Bold`)
      
      await new Promise((resolve, reject) => {
        fontmin.run((err, files) => {
          if (err) reject(err)
          else resolve(files)
        })
      })
    }
  }
  
  console.log('字体子集化完成!')
}

subsetFonts().catch(console.error)