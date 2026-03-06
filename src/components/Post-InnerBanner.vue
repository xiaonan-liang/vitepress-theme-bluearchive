<template>
  <div class="post-inner-banner">
    <div class="container">
      <h1 class="post-title">{{ title || '文章详情' }}</h1>
      <div class="breadcrumb">
        <a href="/">首页</a>
        <span class="separator">/</span>
        <span class="current">文章详情</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped lang="less">
.post-inner-banner {
  background: linear-gradient(135deg, var(--banner-background), var(--color-blue));
  padding: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/assets/banner/background.webp') center/cover no-repeat;
    opacity: 0.1;
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .post-title {
    color: var(--font-color-white);
    margin: 0 0 1rem;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: var(--font-color-white);
    opacity: 0.8;
    font-size: 0.875rem;

    a {
      color: var(--font-color-white);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .separator {
      margin: 0 0.5rem;
    }

    .current {
      opacity: 0.6;
    }
  }
}

@media (max-width: 768px) {
  .post-inner-banner {
    padding: 2rem 0;

    .post-title {
      font-size: 1.5rem;
    }

    .container {
      padding: 0 1rem;
    }
  }
}
</style>
