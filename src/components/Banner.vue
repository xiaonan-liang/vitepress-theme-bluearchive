<template>
  <div class="banner">
    <slot />
  </div>
</template>

<style scoped lang="less">
.banner {
  width: 100%;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
</style>
