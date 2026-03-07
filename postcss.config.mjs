import purgecss from '@fullhuman/postcss-purgecss'
import cssnano from 'cssnano'

export default {
  plugins: [
    // CSSNano - 压缩 CSS
    cssnano({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        minifyFontValues: true,
        minifySelectors: true,
        reduceIdents: false,
        zindex: false,
      }],
    }),
    // PurgeCSS - 仅在生产环境移除未使用的 CSS
    process.env.NODE_ENV === 'production' && purgecss({
      content: [
        './.vitepress/theme/**/*.vue',
        './.vitepress/theme/**/*.ts',
        './.vitepress/theme/**/*.js',
        './**/*.md',
      ],
      safelist: [
        /data-v-.*/,
        /theme.*/,
        /dark/,
        /light/,
        'fade-enter-active',
        'fade-leave-active',
        'fade-enter-from',
        'fade-leave-to',
        'postViewer',
        'loadingComplete',
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
  ].filter(Boolean),
}
