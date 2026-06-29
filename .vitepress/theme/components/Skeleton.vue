<template>
  <div class="skeleton-container">
    <article class="skeleton-post" v-for="i in count" :key="i">
      <div class="skeleton-cover"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-meta"></div>
        <div class="skeleton-tags">
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
        </div>
        <div class="skeleton-excerpt">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  count?: number
}>()
</script>

<style scoped lang="less">
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-post {
  background: var(--skeleton-bg, #f0f0f0);
  border-radius: 16px;
  padding: 20px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-cover {
  width: 100%;
  height: 200px;
  background: var(--skeleton-item-bg, #e0e0e0);
  border-radius: 12px;
  margin-bottom: 16px;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-title {
  width: 60%;
  height: 28px;
  background: var(--skeleton-item-bg, #e0e0e0);
  border-radius: 4px;
}

.skeleton-meta {
  width: 40%;
  height: 16px;
  background: var(--skeleton-item-bg, #e0e0e0);
  border-radius: 4px;
}

.skeleton-tags {
  display: flex;
  gap: 8px;
}

.skeleton-tag {
  width: 60px;
  height: 24px;
  background: var(--skeleton-item-bg, #e0e0e0);
  border-radius: 12px;
}

.skeleton-excerpt {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.skeleton-line {
  width: 100%;
  height: 14px;
  background: var(--skeleton-item-bg, #e0e0e0);
  border-radius: 4px;
  
  &.short {
    width: 70%;
  }
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

html[theme='dark'] & {
  --skeleton-bg: rgba(255, 255, 255, 0.05);
  --skeleton-item-bg: rgba(255, 255, 255, 0.1);
}
</style>