import purgecss from '@fullhuman/postcss-purgecss'
import cssnano from 'cssnano'

export default {
  plugins: [
    // PurgeCSS - 移除未使用的 CSS
    purgecss({
      content: [
        './.vitepress/theme/**/*.vue',
        './.vitepress/theme/**/*.ts',
        './.vitepress/theme/**/*.js',
        './**/*.md',
      ],
      safelist: [
        // 动态类名
        /data-v-.*/,
        /theme.*/,
        /dark/,
        /light/,
        // 过渡动画类
        'fade-enter-active',
        'fade-leave-active',
        'fade-enter-from',
        'fade-leave-to',
        // 其他动态类
        'postViewer',
        'loadingComplete',
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
    // CSSNano - 压缩 CSS
    cssnano({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        minifyFontValues: true,
        minifySelectors: true,
        reduceIdents: false, // 避免混淆关键帧名称
        zindex: false, // 避免重新计算 z-index
      }],
    }),
  ],
}
