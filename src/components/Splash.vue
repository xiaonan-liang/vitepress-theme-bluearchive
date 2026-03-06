<template>
  <div class="splash">
    <div class="splash-content">
      <h1>其实你们都是柔情猫娘吧QAQ</h1>
    </div>
  </div>
</template>

<style scoped lang="less">
.splash {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--splash-background);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  .splash-content {
    h1 {
      color: var(--font-color-white);
      font-size: 2rem;
      animation: fade-in 1s ease-out;
    }
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
