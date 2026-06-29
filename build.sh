#!/bin/bash
set -e

# 安装依赖（允许更新 lockfile）
pnpm install --no-frozen-lockfile

# 构建
vitepress build