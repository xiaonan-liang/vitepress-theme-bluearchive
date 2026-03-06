# Astro 迁移项目

这是一个从 VitePress 迁移到 Astro 的项目。

## 项目结构

```
src/
├── components/          # Vue 组件
│   ├── Navbar/         # 导航栏子组件
│   ├── tools/          # 工具组件
│   └── ...             # 其他组件
├── content/
│   └── posts/          # Markdown 文章
├── layouts/
│   └── Layout.astro    # 主布局
├── pages/
│   ├── api/            # API 端点
│   ├── posts/          # 文章页面
│   ├── tags/           # 标签页面
│   ├── tools/          # 工具页面
│   ├── 404.astro       # 404 页面
│   └── index.astro     # 首页
├── store/
│   └── index.ts        # 状态管理
└── styles/             # 样式文件
```

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署

构建后的文件在 `dist/` 目录，可以部署到 GitHub Pages、Vercel 等平台。
