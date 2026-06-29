import { defineConfigWithTheme } from 'vitepress'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteCompression from 'vite-plugin-compression'
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
    ],
    videoBanner: true,
    name: "其实你们都是柔情猫娘吧QAQ",
    welcomeText: 'Hello World',
    social: [
      { icon: 'github', url: 'https://github.com/xiaonan-liang' },
      { icon: 'bilibili', url: 'https://space.bilibili.com/1896313821' },
    ],
    spineVoiceLang: 'jp',
    footerName: 'Sensei',
    poweredList: [
      { name: 'VitePress', url: 'https://github.com/vuejs/vitepress' },
      { name: 'GitHub Pages', url: 'https://docs.github.com/zh/pages' },
    ],
    // Giscus配置
    giscusRepo: 'xiaonan-liang/Blog-comment-storage',
    giscusRepoId: 'R_kgDOR6Qx3w',
    giscusCategory: 'Show and tell',
    giscusCategoryId: 'DIC_kwDOR6Qx384C6Gp4',
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
    plugins: [
      createHtmlPlugin({
        minify: {
          collapseWhitespace: true,
          preserveLineBreaks: false,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeEmptyAttributes: true,
          removeEmptyElements: false,
          removeAttributeQuotes: true,
          removeOptionalTags: true,
          removeTagWhitespace: true,
          collapseBooleanAttributes: true,
          useShortDoctype: true,
          minifyCss: true,
          minifyJs: true,
        },
      }),
      // Gzip 压缩
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
        deleteOriginFile: false,
      }),
      // Brotli 压缩
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        deleteOriginFile: false,
      }),
      // Zstd 压缩
      viteCompression({
        algorithm: 'zstd',
        ext: '.zst',
        threshold: 1024,
        deleteOriginFile: false,
        compressionOptions: {
          level: 19,
        },
      }),
    ],
    build: {
      assetsInlineLimit: 8192, // 增加内联资源大小，减少请求数
      sourcemap: false,
      cssMinify: true,
      reportCompressedSize: true,
      target: 'esnext',
      chunkSizeWarningLimit: 1000,
      // Terser 压缩配置 - 最强压缩
      terserOptions: {
          compress: {
            defaults: true,
            arrows: true,
            arguments: false,
            booleans: true,
            collapse_vars: true,
            comparisons: true,
            computed_props: true,
            conditionals: true,
            dead_code: true,
            directives: true,
            drop_console: true,
            drop_debugger: true,
            ecma: 2015,
            evaluate: true,
            expression: false,
            global_defs: {},
            hoist_funs: false,
            hoist_props: true,
            hoist_vars: false,
            if_return: true,
            inline: 2,
            join_vars: true,
            keep_classnames: false,
            keep_fargs: false,
            keep_fnames: false,
            keep_infinity: false,
            loops: true,
            negate_iife: true,
            passes: 3,
            properties: true,
            pure_funcs: ['console.log', 'console.info', 'console.warn', 'console.error', 'console.debug', 'console.trace'],
            pure_getters: false,
            reduce_funcs: true,
            reduce_vars: true,
            sequences: true,
            side_effects: true,
            switches: true,
            templates: true,
            top_retain: [],
            toplevel: false,
            typeofs: true,
            unsafe: false,
            unsafe_arrows: false,
            unsafe_comps: false,
            unsafe_Function: false,
            unsafe_math: false,
            unsafe_symbols: false,
            unsafe_methods: false,
            unsafe_proto: false,
            unsafe_regexp: false,
            unsafe_undefined: false,
            unused: true,
            varify: false
          },
          mangle: {
            eval: true,
            keep_classnames: false,
            keep_fnames: false,
            keep_private_props: false,
            module: true,
            nth_identifier: false,
            properties: false,
            reserved: [],
            safari10: true,
            toplevel: true
          },
          format: {
            ascii_only: true,
            beautify: false,
            comments: false,
            ecma: 2015,
            indent_level: 0,
            inline_script: true,
            keep_numbers: false,
            keep_quoted_props: false,
            max_line_len: false,
            preamble: '',
            preserve_annotations: false,
            quote_style: 1,
            semicolons: true,
            shebang: true,
            shorthand: true,
            source_map: null,
            webkit: false,
            wrap_iife: true
          },
          ecma: 2015,
          keep_classnames: false,
          keep_fnames: false,
          module: true,
          nameCache: null,
          safari10: true,
          toplevel: true
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
