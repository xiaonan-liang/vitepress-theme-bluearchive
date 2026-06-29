import purgecss from '@fullhuman/postcss-purgecss'
import cssnano from 'cssnano'

export default {
  plugins: [
    // CSSNano - 最强 CSS 压缩
    cssnano({
      preset: ['advanced', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        minifyFontValues: true,
        minifySelectors: true,
        minifyParams: true,
        convertValues: true,
        discardDuplicates: true,
        discardEmpty: true,
        mergeRules: true,
        colormin: true,
        reduceInitial: true,
        reduceTransforms: true,
        svgo: true,
        autoprefixer: {
          add: true,
          remove: true,
          flexbox: true,
          grid: true
        },
        reduceIdents: false,
        zindex: false,
        calc: true,
        orderedValues: true,
        mergeLonghand: true,
        uniqueSelectors: true,
        declarations: true,
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
