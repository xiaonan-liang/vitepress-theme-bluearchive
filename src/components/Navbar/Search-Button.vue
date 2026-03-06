<template>
  <button class="search-button" @click="openSearch">
    搜索
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  openSearch: []
}>()

const openSearch = () => {
  emit('openSearch')
}
</script>

<style scoped lang="less">
.search-button {
  background: var(--color-blue);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
