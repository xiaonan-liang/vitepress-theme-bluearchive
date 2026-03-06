import { reactive, computed } from 'vue'
import { PostData } from '../utils/posts.data'

interface StoreState {
  selectedPosts: PostData[]
  currTag: string
  currPost: PostData
  currPage: number
  searchDialog: boolean
  splashLoading: boolean
  fireworksEnabled: boolean
  SpinePlayerEnabled: boolean
  showDropdownMenu: boolean
  darkMode: 'light' | 'dark' | 'system'
  isMobile: boolean
  scrollY: number
}

const state: StoreState = reactive({
  selectedPosts: [],
  currTag: '',
  currPost: {
    id: 0,
    title: '',
    content: '',
    href: '',
    create: 0,
    update: 0,
    tags: [],
    wordCount: 0,
    cover: '',
    excerpt: '',
    pinned: false
  },
  currPage: 1,
  searchDialog: false,
  splashLoading: true,
  fireworksEnabled: true,
  SpinePlayerEnabled: true,
  showDropdownMenu: false,
  darkMode: 'system',
  isMobile: false,
  scrollY: 0,
})

// 计算属性
const isDarkMode = computed(() => {
  if (state.darkMode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return state.darkMode === 'dark'
})

const totalPages = computed(() => {
  return Math.ceil(state.selectedPosts.length / 10)
})

// Actions
const actions = {
  // 设置当前标签
  setCurrTag(tag: string) {
    state.currTag = tag
    state.currPage = 1
  },

  // 设置当前文章
  setCurrPost(post: PostData) {
    state.currPost = post
  },

  // 切换搜索对话框
  toggleSearchDialog() {
    state.searchDialog = !state.searchDialog
  },

  // 设置加载状态
  setSplashLoading(loading: boolean) {
    state.splashLoading = loading
  },

  // 切换烟花效果
  toggleFireworks() {
    state.fireworksEnabled = !state.fireworksEnabled
  },

  // 切换 Spine 播放器
  toggleSpinePlayer() {
    state.SpinePlayerEnabled = !state.SpinePlayerEnabled
  },

  // 设置主题
  setDarkMode(mode: 'light' | 'dark' | 'system') {
    state.darkMode = mode
    // 保存到 localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('darkMode', mode)
    }
    // 应用主题
    applyTheme()
  },

  // 初始化主题
  initDarkMode() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('darkMode') as 'light' | 'dark' | 'system' | null
      if (saved) {
        state.darkMode = saved
      }
    }
    applyTheme()
  },

  // 检测移动端
  detectMobile() {
    state.isMobile = window.innerWidth < 768
  },

  // 更新滚动位置
  updateScrollY() {
    state.scrollY = window.scrollY
  },

  // 分页
  nextPage() {
    if (state.currPage < totalPages.value) {
      state.currPage++
    }
  },

  prevPage() {
    if (state.currPage > 1) {
      state.currPage--
    }
  },

  goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      state.currPage = page
    }
  }
}

// 应用主题
function applyTheme() {
  const isDark = isDarkMode.value
  document.documentElement.setAttribute('theme', isDark ? 'dark' : 'light')
}

// 初始化
if (typeof window !== 'undefined') {
  actions.initDarkMode()
  actions.detectMobile()
  
  window.addEventListener('resize', actions.detectMobile)
  window.addEventListener('scroll', actions.updateScrollY)
  
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (state.darkMode === 'system') {
      applyTheme()
    }
  })
}

export function useStore() {
  return { 
    state, 
    ...actions,
    isDarkMode,
    totalPages
  }
}
