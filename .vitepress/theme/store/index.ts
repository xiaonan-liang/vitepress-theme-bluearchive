import { reactive, watch } from 'vue'
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
}

const STORAGE_KEY = 'vitepress-theme-state'

const loadPersistedState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load persisted state:', e)
  }
  return null
}

const persistedState = loadPersistedState()

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
  currPage: persistedState?.currPage || 1,
  searchDialog: false,
  splashLoading: true,
  fireworksEnabled: persistedState?.fireworksEnabled ?? true,
  SpinePlayerEnabled: persistedState?.SpinePlayerEnabled ?? true,
  showDropdownMenu: false,
  darkMode: persistedState?.darkMode || 'system',
})

const persistState = () => {
  try {
    const toPersist = {
      currPage: state.currPage,
      fireworksEnabled: state.fireworksEnabled,
      SpinePlayerEnabled: state.SpinePlayerEnabled,
      darkMode: state.darkMode,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist))
  } catch (e) {
    console.error('Failed to persist state:', e)
  }
}

watch(
  () => ({
    currPage: state.currPage,
    fireworksEnabled: state.fireworksEnabled,
    SpinePlayerEnabled: state.SpinePlayerEnabled,
    darkMode: state.darkMode,
  }),
  () => {
    persistState()
  },
  { deep: true }
)

export function useStore() {
  return { state }
}
