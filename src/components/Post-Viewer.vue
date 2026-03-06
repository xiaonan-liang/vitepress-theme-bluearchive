<template>
  <div class="post-viewer" v-if="post">
    <header class="post-header">
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-meta">
        <span class="post-date">{{ formatDate(post.date) }}</span>
        <span class="post-word-count">约{{ post.wordCount }}字</span>
      </div>
      <div class="post-tags">
        <a 
          v-for="tag in post.tags" 
          :key="tag" 
          :href="`/tags/?tag=${tag}`" 
          class="post-tag"
        >
          <i class="iconfont icon-tag"></i> {{ tag }}
        </a>
      </div>
    </header>
    
    <div class="post-content" v-html="post.content"></div>
  </div>
  <div class="post-viewer loading" v-else>
    <div class="loading-spinner"></div>
    <p>加载中...</p>
  </div>
  <div class="post-viewer error" v-if="error">
    <h2>加载失败</h2>
    <p>{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Post {
  title: string
  date: string
  wordCount: number
  tags: string[]
  content: string
}

const post = ref<Post | null>(null)
const error = ref<string | null>(null)

// 获取当前文章的slug
const getCurrentSlug = (): string => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    const parts = path.split('/')
    return parts[parts.length - 1] || ''
  }
  return ''
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

// 加载文章内容
const loadPost = async () => {
  const slug = getCurrentSlug()
  if (!slug) {
    error.value = '无效的文章链接'
    return
  }

  try {
    const response = await fetch('/api/posts.json')
    const posts = await response.json()
    const foundPost = posts.find((p: any) => p.slug === slug)
    
    if (foundPost) {
      post.value = {
        title: foundPost.title,
        date: foundPost.date,
        wordCount: foundPost.wordCount || 0,
        tags: foundPost.tags || [],
        content: foundPost.content || ''
      }
    } else {
      error.value = '文章不存在'
    }
  } catch (err) {
    error.value = '加载文章失败'
    console.error('Failed to load post:', err)
  }
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped lang="less">
.post-viewer {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  .post-header {
    margin-bottom: 2rem;

    .post-title {
      color: var(--font-color-grey);
      font-size: 1.75rem;
      margin-bottom: 1rem;
      line-height: 1.4;
    }

    .post-meta {
      display: flex;
      gap: 1rem;
      color: var(--font-color-grey);
      opacity: 0.7;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .post-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;

      .post-tag {
        color: var(--color-blue);
        text-decoration: none;
        font-size: 0.875rem;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.5rem;
        background: var(--card-background);
        border-radius: 4px;
        border: 1px solid var(--border-color);

        &:hover {
          background: var(--color-blue);
          color: white;
        }
      }
    }
  }

  .post-content {
    color: var(--font-color-grey);
    line-height: 1.8;

    h2, h3, h4, h5, h6 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: var(--font-color-gold);
    }

    p {
      margin-bottom: 1rem;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1rem 0;
    }

    code {
      background: var(--card-background);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.875rem;
    }

    pre {
      background: var(--card-background);
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1rem 0;

      code {
        background: none;
        padding: 0;
      }
    }

    blockquote {
      border-left: 4px solid var(--color-blue);
      padding-left: 1rem;
      margin: 1rem 0;
      color: var(--font-color-grey);
      opacity: 0.8;
    }
  }

  &.loading, &.error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    color: var(--font-color-grey);

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color);
      border-top: 4px solid var(--color-blue);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
}

@media (max-width: 768px) {
  .post-viewer {
    padding: 1rem;

    .post-header {
      .post-title {
        font-size: 1.5rem;
      }
    }
  }
}
</style>
