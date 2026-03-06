// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import type { Theme } from 'vitepress'
import 'normalize.css'
import '@fontsource/jetbrains-mono'
import './assets/icon/iconfont.css'
import './styles/index.less'
import './components/Spine-Player/spine-player.css'
import { vLazy } from './utils/lazyLoad'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // 注册懒加载指令
    app.directive('lazy', vLazy)
  },
} satisfies Theme
