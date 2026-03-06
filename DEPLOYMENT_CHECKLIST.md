# GitHub Actions 部署检查清单

## ✅ 已完成的配置

### 1. GitHub Actions 工作流
- ✅ 修改为使用 npm（而不是 pnpm）
- ✅ 配置正确的 Node.js 版本（20）
- ✅ 启用 npm 缓存
- ✅ 设置正确的权限
- ✅ 配置正确的构建输出路径

### 2. 构建脚本
- ✅ 创建了安全的构建脚本 `scripts/build.js`
- ✅ 在 CI 环境中自动跳过压缩
- ✅ 提供了单独的压缩命令

### 3. 项目配置
- ✅ 移除了未使用的依赖
- ✅ 添加了必要的构建工具
- ✅ 配置了代码分割和优化

### 4. 缓存策略
- ✅ 更新了 `_headers` 文件
- ✅ 配置了正确的缓存控制头

---

## 📋 部署前检查清单

### GitHub Pages 设置
- [ ] 仓库设置 → Pages → Source 设置为 "GitHub Actions"
- [ ] 仓库设置 → Pages → Branch 设置为 `main` / `.vitepress/dist`
- [ ] 仓库设置 → Actions → General → Workflow permissions 设置为 "Read and write permissions"

### 依赖检查
- [ ] 所有依赖都在 `package.json` 中
- [ ] 没有使用 `pnpm-lock.yaml`（应该使用 `package-lock.json`）
- [ ] 所有脚本都能正常执行

### 构建测试
- [ ] 本地运行 `npm install` 成功
- [ ] 本地运行 `npm run build` 成功
- [ ] 构建产物在 `.vitepress/dist` 目录

---

## 🚀 部署步骤

### 1. 提交代码
```bash
git add .
git commit -m "优化项目并修复部署配置"
git push origin main
```

### 2. 检查 GitHub Actions
1. 访问 https://github.com/xiaonan-liang/xiaonan-liang.github.io/actions
2. 查看 "Deploy VitePress site to Pages" 工作流
3. 确认所有步骤都成功

### 3. 验证部署
1. 访问 https://xiaonan-liang.github.io/
2. 检查页面是否正常加载
3. 检查控制台是否有错误

---

## ⚠️ 常见问题

### 问题 1: "pnpm: command not found"
**原因**: GitHub Actions 配置使用 pnpm，但项目使用 npm
**解决**: 已修复，现在使用 npm

### 问题 2: "Dependencies lock file is not found"
**原因**: 缺少 `package-lock.json`
**解决**: 
```bash
npm install
git add package-lock.json
git commit -m "添加 package-lock.json"
git push
```

### 问题 3: 构建失败
**原因**: 依赖问题或配置错误
**解决**: 
```bash
# 清理缓存
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 问题 4: 部署成功但页面 404
**原因**: GitHub Pages 设置不正确
**解决**: 检查 Pages 设置，确保 Source 为 "GitHub Actions"

---

## 🔍 调试技巧

### 查看构建日志
1. 访问 GitHub Actions 页面
2. 点击失败的工作流
3. 展开失败的步骤查看详细日志

### 本地测试 CI 环境
```bash
# 设置 CI 环境变量
export CI=true

# 运行构建
npm run build
```

### 查看构建产物
```bash
# 进入构建目录
cd .vitepress/dist

# 查看文件
ls -la

# 检查文件大小
du -sh *
```

---

## 📊 预期构建时间

- **安装依赖**: 30-60 秒
- **构建项目**: 60-120 秒
- **上传产物**: 30-60 秒
- **部署**: 30-60 秒

**总计**: 约 3-5 分钟

---

## ✨ 优化建议

### 1. 启用 GitHub Actions 缓存
已配置 npm 缓存，可以进一步优化：
```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 2. 并行化构建
如果构建时间过长，可以考虑并行化某些步骤。

### 3. 使用更快的构建器
考虑使用更快的构建器或优化构建配置。

---

## 🎯 成功标准

部署成功的标志：
- ✅ GitHub Actions 工作流显示绿色勾
- ✅ 所有步骤都成功完成
- ✅ 网站可以正常访问
- ✅ 没有控制台错误
- ✅ 所有功能正常工作

---

## 📞 获取帮助

如果遇到问题：
1. 查看 GitHub Actions 日志
2. 检查本文档的常见问题部分
3. 搜索 GitHub Actions 文档
4. 在 GitHub Issues 中提问

---

## 📝 更新日志

- 2026-03-06: 修复 pnpm 配置问题，改用 npm
- 2026-03-06: 添加安全的构建脚本
- 2026-03-06: 优化 GitHub Actions 配置
- 2026-03-06: 添加部署检查清单
