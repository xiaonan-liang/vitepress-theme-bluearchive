# 字体子集化指南

## 方法 1: 使用 fonttools（推荐）

### 安装依赖
```bash
pip install fonttools brotli
```

### 生成字体子集
```bash
# Blueaka 字体
pyftsubset public/font/Blueaka/Blueaka.woff2 \
  --text-file=scripts/font-chars.txt \
  --output-file=public/font/Blueaka/Blueaka-subset.woff2 \
  --flavor=woff2

# Blueaka_Bold 字体
pyftsubset public/font/Blueaka_Bold/Blueaka_Bold.woff2 \
  --text-file=scripts/font-chars.txt \
  --output-file=public/font/Blueaka_Bold/Blueaka_Bold-subset.woff2 \
  --flavor=woff2
```

### 更新配置
修改 `.vitepress/config.mts` 中的字体预加载路径：
```javascript
['link', { rel: 'preload', href: '/font/Blueaka/Blueaka-subset.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
['link', { rel: 'preload', href: '/font/Blueaka_Bold/Blueaka_Bold-subset.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
```

## 方法 2: 使用在线工具

1. 访问 https://font.svelte.dev/
2. 上传字体文件
3. 粘贴 `scripts/font-chars.txt` 中的字符
4. 下载子集化后的字体

## 方法 3: 使用 Google Fonts

如果可以使用 Google Fonts，考虑使用类似的开源字体：
- Noto Sans SC
- Noto Serif SC
- Ma Shan Zheng

## 预期效果

- **字体大小**: 从 ~2MB 减少到 ~200KB (减少 90%)
- **加载时间**: 减少 80-90%
- **首次渲染**: 提升 50-70%

## 注意事项

1. 子集化后的字体只包含指定字符，新增内容需要重新生成
2. 建议定期更新字符集
3. 保留原始字体文件作为备份
