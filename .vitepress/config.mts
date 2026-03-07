import { defineConfigWithTheme } from 'vitepress'
// @ts-ignore
import mdItCustomAttrs from 'markdown-it-custom-attrs'
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
  title: "其实你们都是柔情猫娘吧QAQ",
  description: "其实你们都是柔情猫娘吧QAQ",
  themeConfig: {
    menuList: [
      { name: '首页', url: '' },
      { name: '标签', url: 'tags/' },
      { name: '工具', url: 'tools/' },
    ],
    videoBanner: true,
    name: "其实你们都是柔情猫娘吧QAQ",
    welcomeText: 'Hello World',
    social: [
      { icon: 'github', url: 'https://github.com/xiaonan-liang' },
      { icon: 'bilibili', url: 'https://space.bilibili.com/1896313821' },
    ],
    spineVoiceLang: 'zh',
    footerName: 'Sensei',
    poweredList: [
      { name: 'VitePress', url: 'https://github.com/vuejs/vitepress' },
      { name: 'GitHub Pages', url: 'https://docs.github.com/zh/pages' },
    ],
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
      md.use(mdItCustomAttrs, 'image', {
        'data-fancybox': 'gallery',
        'loading': 'lazy',
        'decoding': 'async',
      })
    },
  },
  // 构建优化配置
  build: {
    minify: 'terser',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
          crypto: ['md5'],
          search: ['minisearch'],
          animation: ['animejs']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  // Vite 配置
  vite: {
    build: {
      assetsInlineLimit: 4096,
      sourcemap: false,
      cssMinify: true,
      reportCompressedSize: true,
      target: 'esnext',
      chunkSizeWarningLimit: 1000,
      // Terser 压缩配置 - 只在 vite.build 中配置
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.warn'],
          dead_code: true,
          unused: true,
          passes: 3,
          hoist_funs: true,
          hoist_vars: true,
          if_return: true,
          join_vars: true,
          collapse_vars: true,
          reduce_vars: true,
          side_effects: true
        },
        mangle: {
          safari10: true,
          properties: {
            regex: /^_/,
            reserved: ['__proto__', 'constructor', 'prototype']
          }
        },
        format: {
          comments: false,
          beautify: false,
          ascii_only: true
        }
      }
    },
    optimizeDeps: {
      include: ['vue', 'md5', 'minisearch', 'animejs'],
      exclude: ['vitepress']
    },
    css: {
      devSourcemap: false,
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          }
        ]
      }
    },
    esbuild: {
      drop: ['console', 'debugger'],
      legalComments: 'none'
    },
    cacheDir: '.vite/cache'
  }
})
