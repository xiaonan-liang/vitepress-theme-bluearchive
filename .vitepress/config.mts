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

  //giscus
  giscusRepo: string
  giscusRepoId: string
  giscusCategory: string
  giscusCategoryId: string
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

    // 图片灯箱 - 延迟加载
    ['link', { rel: 'preload', href: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css', as: 'style', onload: "this.onload=null;this.rel='stylesheet'" }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js', defer: '', async: '' }],
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
    // Giscus配置 - 需要在 https://giscus.app/ 生成
    giscusRepo: '你的GitHub用户名/你的仓库名',
    giscusRepoId: '你的仓库ID',
    giscusCategory: 'Comments',
    giscusCategoryId: '你的分类ID',
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
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: (id) => {
          // 基于目录的自动代码分割
          if (id.includes('node_modules')) {
            if (id.includes('@fontsource')) {
              return 'fonts';
            } else if (id.includes('gray-matter') || id.includes('markdown-it')) {
              return 'markdown';
            } else if (id.includes('normalize.css')) {
              return 'normalize';
            } else if (id.includes('md5')) {
              return 'crypto';
            } else if (id.includes('minisearch')) {
              return 'search';
            } else if (id.includes('animejs')) {
              return 'animation';
            } else {
              return 'vendor';
            }
          }
        }
      }
    }
  },
  // Vite 配置
  vite: {
    build: {
      assetsInlineLimit: 8192, // 增加内联资源大小，减少请求数
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
            pure_funcs: ['console.log', 'console.info', 'console.warn', 'console.error'],
            dead_code: true,
            unused: true,
            passes: 2,
            hoist_funs: false,
            hoist_vars: false,
            if_return: true,
            join_vars: true,
            collapse_vars: true,
            reduce_vars: true,
            side_effects: true
          },
          mangle: {
            safari10: true,
            properties: false
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
      legalComments: 'none',
      minify: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
      target: 'esnext',
      treeShaking: true,
      pure: ['console.log', 'console.info', 'console.warn', 'console.error', 'debugger']
    },
    cacheDir: '.vite/cache'
  }
})
