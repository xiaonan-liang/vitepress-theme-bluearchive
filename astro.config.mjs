import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import { resolve } from 'path'

export default defineConfig({
  site: 'https://xiaonan-liang.github.io',
  integrations: [vue()],
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 4096,
      cssMinify: true,
      sourcemap: false,
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
    optimizeDeps: {
      include: ['vue', 'md5', 'minisearch', 'animejs']
    }
  }
})
