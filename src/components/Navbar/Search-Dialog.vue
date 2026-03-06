<template>
  <div class="search-dialog" v-if="open">
    <input v-model="query" placeholder="搜索..." />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const query = ref('')
</script>

<style scoped lang="less">
.search-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  input {
    padding: 1rem;
    font-size: 1.2rem;
    border-radius: 8px;
    border: none;
    width: 80%;
    max-width: 600px;
  }
}
</style>
