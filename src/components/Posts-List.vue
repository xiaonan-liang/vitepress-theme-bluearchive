<template>
  <div class="container posts-content">
    <TransitionGroup class="posts-list" name="list" tag="div">
      <article class="post" v-for="post in postsList" :key="post.href">
        <span v-if="post.pinned" class="pinned"></span>
        <header class="post-header">
          <div v-if="post.cover" class="cover-container">
            <img
              :src="post.cover"
              class="cover-image"
              :alt="post.title + '-cover'"
              loading="lazy"
            />
          </div>
          <div class="header-content">
            <div class="title">
              <div class="title-dot" v-if="!post.cover"></div>
              <h1 class="name">
                <a :href="post.href">{{ post.title }}</a>
              </h1>
            </div>
            <div class="meta-info-bar">
              <span class="iconfont icon-time time"></span>
              <div class="time-info">
                <time datetime="">{{ formatDate(post.create) }}</time>
              </div>
              <div class="wordcount seperator">约{{ post.wordCount }}字</div>
            </div>
            <ul class="tags">
              <li v-for="tag in post.tags" :key="tag">
                <a :href="`/tags/`" @click="state.currTag = tag"
                  ><i class="iconfont icon-tag"></i> {{ tag }}</a
                >
              </li>
            </ul>
            <div class="excerpt">
              <p>{{ post.excerpt }}</p>
            </div>
          </div>
        </header>
      </article>
    </TransitionGroup>
    <div v-if="totalPage != 1" class="pagination">
      <button
        :disabled="currPage === 1"
        :class="{ hide: currPage === 1 }"
        id="up"
        @click="goToPage(currPage - 1)"
      >
        <i class="iconfont icon-arrow"></i>
      </button>

      <div class="page-numbers">
        <button class="page-number" :class="{ active: currPage === 1 }" @click="goToPage(1)">
          1
        </button>

        <span v-if="showLeftEllipsis" class="ellipsis">...</span>

        <button
          v-for="page in visiblePageNumbers"
          :key="page"
          class="page-number"
          :class="{ active: currPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <span v-if="showRightEllipsis" class="ellipsis">...</span>

        <button
          v-if="totalPage > 1"
          class="page-number"
          :class="{ active: currPage === totalPage }"
          @click="goToPage(totalPage)"
        >
          {{ totalPage }}
        </button>
      </div>

      <button
        :disabled="currPage >= totalPage"
        :class="{ hide: currPage >= totalPage }"
        id="next"
        @click="goToPage(currPage + 1)"
      >
        <i class="iconfont icon-arrow"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from '../store'

const { state } = useStore()

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

const posts = ref<Post[]>([])
const pageSize = 10

// 同步store中的currPage
const currPage = computed({
  get: () => state.currPage,
  set: (value) => {
    state.currPage = value
  }
})

// 根据是否有标签筛选决定使用哪个数据源
const currentPosts = computed(() => {
  return state.selectedPosts.length > 0 ? state.selectedPosts : posts.value
})

const postsList = computed(() => {
  const start = (currPage.value - 1) * pageSize
  const end = start + pageSize
  return currentPosts.value.slice(start, end)
})

const totalPage = computed(() => Math.ceil(currentPosts.value.length / pageSize))

const visiblePageNumbers = computed(() => {
  const pages: number[] = []
  const start = Math.max(2, currPage.value - 1)
  const end = Math.min(totalPage.value - 1, currPage.value + 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const showLeftEllipsis = computed(() => currPage.value > 3)
const showRightEllipsis = computed(() => currPage.value < totalPage.value - 2)

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPage.value) {
    currPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

onMounted(async () => {
  try {
    const response = await fetch('/api/posts.json')
    const data = await response.json()
    posts.value = data.map((post: any) => ({
      href: `/posts/${post.slug}`,
      title: post.title,
      create: post.date,
      wordCount: post.wordCount || 0,
      tags: post.tags || [],
      excerpt: post.description || '',
      cover: post.cover,
      pinned: post.pinned
    }))
  } catch (error) {
    console.error('Failed to load posts:', error)
  }
})

// 监听标签变化，重置页码
watch(() => state.currTag, () => {
  currPage.value = 1
})

// 监听selectedPosts变化，重置页码
watch(() => state.selectedPosts.length, () => {
  currPage.value = 1
})
</script>

<style scoped lang="less">
.posts-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post {
  background: var(--card-background);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .pinned {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 8px;
    height: 8px;
    background: var(--color-blue);
    border-radius: 50%;
  }
}

.post-header {
  display: flex;
  gap: 1.5rem;

  .cover-container {
    flex-shrink: 0;
    width: 200px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;

    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .header-content {
    flex: 1;

    .title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;

      .title-dot {
        width: 8px;
        height: 8px;
        background: var(--color-blue);
        border-radius: 50%;
      }

      .name {
        margin: 0;
        font-size: 1.25rem;

        a {
          color: var(--font-color-grey);
          text-decoration: none;

          &:hover {
            color: var(--color-blue);
          }
        }
      }
    }

    .meta-info-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--font-color-grey);
      opacity: 0.7;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;

      .seperator::before {
        content: '|';
        margin: 0 0.5rem;
      }
    }

    .tags {
      display: flex;
      gap: 0.5rem;
      list-style: none;
      padding: 0;
      margin: 0 0 0.75rem;

      li {
        a {
          color: var(--color-blue);
          text-decoration: none;
          font-size: 0.875rem;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .excerpt {
      p {
        margin: 0;
        color: var(--font-color-grey);
        opacity: 0.8;
        line-height: 1.6;
      }
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;

  button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    background: var(--card-background);
    color: var(--font-color-grey);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover:not(:disabled) {
      background: var(--color-blue);
      color: white;
      border-color: var(--color-blue);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.active {
      background: var(--color-blue);
      color: white;
      border-color: var(--color-blue);
    }

    &.hide {
      visibility: hidden;
    }
  }

  .page-numbers {
    display: flex;
    gap: 0.25rem;

    .ellipsis {
      padding: 0.5rem;
      color: var(--font-color-grey);
    }
  }
}

@media (max-width: 768px) {
  .post-header {
    flex-direction: column;

    .cover-container {
      width: 100%;
      height: 180px;
    }
  }
}
</style>
