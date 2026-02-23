import { defineDirective } from 'vue'

/**
 * 图片懒加载指令
 * 使用方式：<img v-lazy="src" alt="">
 */
export const vLazy = defineDirective({
  mounted(el, binding) {
    // 设置占位符
    el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg=='
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.3s ease'
    
    // 创建 IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 图片进入视口，加载真实图片
          el.src = binding.value
          el.onload = () => {
            el.style.opacity = '1'
          }
          // 停止观察
          observer.unobserve(el)
        }
      })
    }, {
      rootMargin: '200px 0px' // 提前200px开始加载
    })
    
    // 开始观察
    observer.observe(el)
    
    // 存储observer实例，以便在卸载时清理
    el._lazyObserver = observer
  },
  unmounted(el) {
    // 清理observer
    if (el._lazyObserver) {
      el._lazyObserver.disconnect()
    }
  }
})

/**
 * 图片懒加载插件
 */
export const lazyLoadPlugin = {
  install(app) {
    app.directive('lazy', vLazy)
  }
}