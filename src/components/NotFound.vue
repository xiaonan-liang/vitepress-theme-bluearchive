<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面未找到</p>
    <a href="/">返回首页</a>
  </div>
</template>

<style scoped lang="less">
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;

  h1 {
    font-size: 8rem;
    margin: 0 0 1rem;
    color: var(--font-color-grey);
  }

  p {
    font-size: 1.5rem;
    color: var(--font-color-grey);
    margin: 0 0 2rem;
  }

  a {
    color: var(--color-blue);
    text-decoration: none;
    font-size: 1.2rem;
  }
}
</style>
