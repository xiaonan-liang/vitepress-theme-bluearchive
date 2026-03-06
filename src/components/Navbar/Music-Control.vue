<template>
  <div class="music-control">
    <button @click="toggle">{{ playing ? '暂停' : '播放' }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const playing = ref(false)

const toggle = () => {
  playing.value = !playing.value
}
</script>

<style scoped lang="less">
.music-control {
  button {
    background: var(--color-blue);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
