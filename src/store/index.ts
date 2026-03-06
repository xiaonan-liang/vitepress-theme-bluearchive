import { reactive, watch } from 'vue'

interface Post {
  href: string
  title: string
}

interface State {
  splashLoading: boolean
  fireworksEnabled: boolean
  theme: 'light' | 'dark'
  showDropdownMenu: boolean
  searchDialog: boolean
  currPage: number
  currTag: string
  currPost: Post | null
  selectedPosts: Post[]
}

const initialState: State = {
  splashLoading: true,
  fireworksEnabled: false,
  theme: 'dark',
  showDropdownMenu: false,
  searchDialog: false,
  currPage: 1,
  currTag: '',
  currPost: null,
  selectedPosts: []
}

const state = reactive(initialState)

if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
  if (savedTheme) {
    state.theme = savedTheme
    document.documentElement.setAttribute('theme', savedTheme)
  }

  watch(() => state.theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('theme', newTheme)
  })
}

export function useStore() {
  return {
    state,
    setSplashLoading: (value: boolean) => {
      state.splashLoading = value
    },
    setFireworksEnabled: (value: boolean) => {
      state.fireworksEnabled = value
    },
    setTheme: (value: 'light' | 'dark') => {
      state.theme = value
    },
    toggleTheme: () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    }
  }
}

export function getState() {
  return state
}
