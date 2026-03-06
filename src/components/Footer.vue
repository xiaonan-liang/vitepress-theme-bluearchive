<template>
  <footer class="container">
    <div class="footer-info">
      <span>© {{ new Date().getFullYear() }} {{ footerName }} </span>
      <br />
      <span
        >Powered by
        <span class="powered-list" v-for="(obj, ind) in poweredList" :key="obj.url"
          ><a :href="obj.url" target="_blank" rel="noopener noreferrer">{{ obj.name }}</a
          >{{ ind < poweredList.length - 1 ? ' & ' : '' }}</span
        ></span
      >
    </div>
    <div class="footer-logo">
      <img @dragstart.prevent src="/assets/icon/footLogo.svg" alt="logo" />
    </div>
  </footer>
</template>

<script setup lang="ts">
const footerName = 'Sensei'
const poweredList = [
  { name: 'Astro', url: 'https://astro.build' },
  { name: 'Vue', url: 'https://vuejs.org' },
  { name: 'GitHub Pages', url: 'https://docs.github.com/zh/pages' }
]
</script>

<style scoped lang="less">
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  z-index: 100;
  margin-top: 50px;
  padding: 0 16px;
  box-sizing: border-box;
  border-radius: 32px 32px 0 0;
  border-top: solid 2px var(--foreground-color);
  border-left: solid 2px var(--foreground-color);
  border-right: solid 2px var(--foreground-color);
  background: linear-gradient(0.75turn, transparent, var(--foreground-color) 25%),
    var(--triangle-background);
  backdrop-filter: var(--blur-val);
  box-shadow: 0px 0px 8px rgb(var(--blue-shadow-color), 0.8);
}

.footer-info {
  color: var(--font-color-grey);
  font-size: 0.875rem;
  
  a {
    color: var(--color-blue);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.footer-logo {
  img {
    height: 40px;
  }
}

@media (max-width: 768px) {
  footer {
    flex-direction: column;
    height: auto;
    padding: 1rem;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
