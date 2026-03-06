<template>
  <button class="toggle-switch" @click="toggle">
    {{ state.theme === 'light' ? '🌙' : '☀' }}
  </button>
</template>

<script setup lang="ts">
import { useStore } from '../../store'

const { state, toggleTheme } = useStore()

const toggle = () => {
  toggleTheme()
}
</script>

<style scoped lang="less">
.toggle-switch {
  background: var(--toggle-background);
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
}
</style>
