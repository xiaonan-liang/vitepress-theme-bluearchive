import { defineConfigWithTheme } from 'vitepress'
// @ts-ignore
import mdItCustomAttrs from 'markdown-it-custom-attrs'
import viteImagemin from 'vite-plugin-imagemin'

export interface ThemeConfig {
  //navBar
  menuList: { name: string; url: string }[]

  //banner
  videoBanner: boolean
  name: string
  welcomeText: string
  social: { icon: string; url: string }[]

  //spine
  spineVoiceLang: 'zh' | 'jp'

  //footer
  footerName: string
  poweredList: { name: string; url: string }[]

  //gitalk
  clientID: string
  clientSecret: string
  repo: string
  owner: string
  admin: string[]
}

export default defineConfigWithTheme<ThemeConfig>({
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    // DNS预解析和预连接
    ['link', { rel: 'dns-prefetch', href: 'https://v1.hitokoto.cn' }],
    ['link', { rel: 'preconnect', href: 'https://v1.hitokoto.cn', crossorigin: '' }],
    ['link', { rel: 'dns-prefetch', href: 'https://unpkg.com' }],
    ['link', { rel: 'preconnect', href: 'https://unpkg.com', crossorigin: '' }],
    ['link', { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' }],
    ['link', { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' }],
    // 预加载关键资源
     ['link', { rel: 'preload', href: '/font/Blueaka/Blueaka-04963599723c63b7.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
     ['link', { rel: 'preload', href: '/font/Blueaka_Bold/Blueaka_Bold-0719faaf51e6146e.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
    // gitalk
    ['link', { rel: 'stylesheet', href: 'https://unpkg.com/gitalk/dist/gitalk.css' }],
    ['script', { src: 'https://unpkg.com/gitalk/dist/gitalk.min.js', defer: '' }],
    // bluearchive font
    [
      'link',
      {
        rel: 'stylesheet',
        href: '/font/Blueaka/Blueaka.css',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: '/font/Blueaka_Bold/Blueaka_Bold.css',
      },
    ],
    // 图片灯箱
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css',
      },
    ],
    [
      'script',
      {
        src: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js',
      },
    ],
  ],
  ignoreDeadLinks: true,
  // 生成站点地图
  // sitemap: {
  //   hostname: 'https://vitepress-theme-bluearchive.vercel.app',
  // },
  title: "其实你们都是柔情猫娘吧QAQ",
  description: "其实你们都是柔情猫娘吧QAQ",
  themeConfig: {
    // navBar
    menuList: [
      { name: '首页', url: '' },
      { name: '标签', url: 'tags/' },
      { name: '工具', url: 'tools/' },
    ],

    //banner区配置
    videoBanner: true,
    name: "其实你们都是柔情猫娘吧QAQ",
    welcomeText: 'Hello World',
    social: [
      { icon: 'github', url: 'https://github.com/xiaonan-liang' },
      { icon: 'bilibili', url: 'https://space.bilibili.com/1896313821' },
     // { icon: 'qq', url: 'https://im.qq.com/index/' },
     //{ icon: 'wechat', url: 'https://weixin.qq.com/' },
    ],

    //spine语音配置，可选zh/jp
    spineVoiceLang: 'zh',

    //footer配置
    footerName: 'Sensei',
    poweredList: [
      { name: 'VitePress', url: 'https://github.com/vuejs/vitepress' },
      { name: 'GitHub Pages', url: 'https://docs.github.com/zh/pages' },
    ],

    //gitalk配置
    clientID: 'Ov23lia9U9wFN3WMyoKK',
    clientSecret: 'b2418ab598c188c43a247c99e728dd2735d58c3b',
    repo: 'vitepress-theme-bluearchive',
    owner: 'Alittfre',
    admin: ['Alittfre'],
  },
  markdown: {
    theme: 'solarized-dark',
    lineNumbers: true,
    math: true,
    config: (md) => {
      // use more markdown-it plugins!
      md.use(mdItCustomAttrs, 'image', {
        'data-fancybox': 'gallery',
      })
    },
  },
  // 构建优化配置
  build: {
    minify: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 第三方库分割
          if (id.includes('node_modules')) {
            // Vue 核心库
            if (id.includes('vue')) {
              return 'vendor-vue'
            }
            // 动画库
            if (id.includes('animejs')) {
              return 'vendor-animation'
            }
            // 搜索库
            if (id.includes('minisearch')) {
              return 'vendor-search'
            }
            // 加密库
            if (id.includes('md5')) {
              return 'vendor-crypto'
            }
            // Markdown 相关
            if (id.includes('markdown-it') || id.includes('marked')) {
              return 'vendor-markdown'
            }
            // 其他第三方库
            return 'vendor'
          }
          
          // 主题组件分割
          if (id.includes('.vitepress/theme/components')) {
            if (id.includes('tools/')) {
              return 'chunk-tools'
            }
            if (id.includes('Navbar/')) {
              return 'chunk-navbar'
            }
            if (id.includes('Spine-Player')) {
              return 'chunk-spine'
            }
            return 'chunk-components'
          }
          
          // 工具函数分割
          if (id.includes('.vitepress/theme/utils')) {
            return 'chunk-utils'
          }
          
          // Store 分割
          if (id.includes('.vitepress/theme/store')) {
            return 'chunk-store'
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  // Vite 配置
  vite: {
    plugins: [
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 80,
        },
        pngquant: {
          quality: [0.8, 0.9],
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
    ],
    build: {
      assetsInlineLimit: 4096,
      sourcemap: false,
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug']
        },
        format: {
          comments: false
        }
      },
      rollupOptions: {
        output: {
          compact: true
        }
      }
    },
    optimizeDeps: {
      include: ['vue', 'md5', 'minisearch', 'animejs'],
      exclude: ['vitepress']
    },
    css: {
      devSourcemap: false
    }
  }
})
