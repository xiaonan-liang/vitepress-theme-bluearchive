import matter from 'gray-matter'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  const postsDir = path.join(process.cwd(), 'posts')
  const files = await fs.readdir(postsDir)
  
  const posts = []
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue
    
    const filePath = path.join(postsDir, file)
    const content = await fs.readFile(filePath, 'utf-8')
    const { data, content: bodyContent } = matter(content)
    
    // 计算字数
    const wordCount = bodyContent.replace(/\s/g, '').length
    
    posts.push({
      slug: file.replace('.md', ''),
      title: data.title || '未命名',
      description: data.description || '',
      date: data.date || '',
      tags: data.tags || [],
      pinned: data.pinned || false,
      cover: data.cover || '',
      wordCount: wordCount,
      content: bodyContent,
      excerpt: data.description || bodyContent.slice(0, 200).replace(/[#*`]/g, '') + '...'
    })
  }
  
  // 按日期排序，置顶文章在前
  posts.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  
  return new Response(JSON.stringify(posts), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
