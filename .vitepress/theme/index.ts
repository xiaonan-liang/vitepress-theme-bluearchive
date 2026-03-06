// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import type { Theme } from 'vitepress'
import './assets/icon/iconfont.css'
import './styles/index.less'
import './components/Spine-Player/spine-player.css'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // 可以在这里添加全局应用增强
  },
} satisfies Theme
