<template>
  <div class="dropdown-menu">
    <slot />
  </div>
</template>

<style scoped lang="less">
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--dropdown-background);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 150px;
}
</style>
