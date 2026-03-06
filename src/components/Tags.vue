<template>
  <ul class="tags">
    <li :class="['item', { active: active === tag }]" v-for="(_, tag) in tagData" :key="tag">
      <a href="javascript:void(0)" @click="setTag(tag as string)"
        ><i class="iconfont icon-tag"></i> {{ tag }}</a
      >
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, onMounted } from 'vue'
import { useStore } from '../store'

interface Post {
  href: string
  title: string
  create: string
  wordCount: number
  tags: string[]
  excerpt: string
  cover?: string
  pinned?: boolean
}

const active = ref<string | null>(null)
const tagData: Record<string, Post[]> = {}
const { state } = useStore()

const setTag = (tag: string) => {
  active.value = tag
  state.selectedPosts = tagData[tag] || []
  state.currTag = tag

  const url = new URL(window.location.href)

  // 设置URL的tag参数
  if (tag && tag.trim() !== '') {
    url.searchParams.set('tag', tag)
  } else {
    url.searchParams.delete('tag')
  }

  // 清除page参数
  const pageParam = url.searchParams.get('page')
  if (!pageParam || pageParam === '1') {
    url.searchParams.delete('page')
  }

  window.history.pushState({}, '', url.toString())
}

// 从URL获取tag
function getTagFromUrl(): string {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const tagParam = urlParams.get('tag')
    if (tagParam && tagData[tagParam]) {
      return tagParam
    }
  }
  return state.currTag || ''
}

// 挂载组件时获取URL的tag
onMounted(async () => {
  // 获取文章数据
  try {
    const response = await fetch('/api/posts.json')
    const posts: Post[] = await response.json()
    
    // 构建标签数据
    for (const post of posts) {
      if (!post.tags) continue
      for (const tag of post.tags) {
        if (!tagData[tag]) tagData[tag] = []
        tagData[tag].push(post)
      }
    }
    
    const tagFromUrl = getTagFromUrl()

    if (tagFromUrl) {
      setTag(tagFromUrl)
    } else if (state.currTag) {
      setTag(state.currTag)
    }

    window.addEventListener('popstate', () => {
      const tagFromUrl = getTagFromUrl()
      if (tagFromUrl !== active.value) {
        setTag(tagFromUrl)
      }
    })
  } catch (error) {
    console.error('Failed to load tags:', error)
  }
})

watch(
  () => state.currTag,
  (newTag) => {
    if (newTag !== active.value) {
      setTag(newTag)
    }
  },
)

onUnmounted(() => {
  setTag('')
})
</script>

<style scoped lang="less">
.active a {
  background-color: var(--btn-hover) !important;
}

.tags {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding: 16px;
  background-color: var(--infobox-background-initial);
  border-radius: 32px;
  border: solid 2px var(--foreground-color);
  backdrop-filter: var(--blur-val);
  width: 768px;
  z-index: 100;

  li {
    margin: 8px;

    a {
      color: var(--font-color-grey);
      padding: 3px 5px;
      color: var(--font-color-gold);
      background-color: var(--btn-background);
      border-radius: 5px;
      transition: background-color 0.5s;

      &:hover {
        background-color: var(--btn-hover);
      }
    }
  }
}

@media (max-width: 768px) {
  .tags {
    width: auto;
    li {
      margin: 4px;
      a {
        font-size: 12px;
        .icon-tag {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
