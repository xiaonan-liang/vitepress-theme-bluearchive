export default {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // 不移除 viewBox，保持响应式
          removeViewBox: false,
          // 不移除 title，保持可访问性
          removeTitle: false,
          // 不移除 desc，保持可访问性
          removeDesc: false,
        },
      },
    },
    // 移除注释
    'removeComments',
    // 移除空的属性
    'removeEmptyAttrs',
    // 移除空的容器
    'removeEmptyContainers',
    // 移除空的文本节点
    'removeEmptyText',
    // 移除未使用的命名空间
    'removeUnusedNS',
    // 移除 XML 指令
    'removeXMLProcInst',
    // 移除 doctype
    'removeDoctype',
    // 移除 XMLNS
    'removeXMLNS',
    // 移除编辑器数据
    'removeEditorsNSData',
    // 移除不可见的元素
    'removeHiddenElems',
    // 移除空的 defs
    'removeEmptyDefs',
    // 移除无用的 stroke 和 fill
    'removeUselessStrokeAndFill',
    // 移除多余的组
    'collapseGroups',
    // 将多个 path 合并为一个
    'mergePaths',
    // 优化 path 数据
    'convertPathData',
    // 优化 transform
    'convertTransform',
  ],
}
