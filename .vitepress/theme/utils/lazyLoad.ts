// 图片懒加载指令
export const vLazy = {
  mounted(el: HTMLImageElement) {
    // 保存原始src
    const src = el.getAttribute('src')
    if (!src) return

    // 设置占位图或空白
    el.setAttribute('data-src', src)
    el.removeAttribute('src')
    el.classList.add('lazy-image')

    // 使用Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const dataSrc = img.getAttribute('data-src')
          if (dataSrc) {
            img.src = dataSrc
            img.onload = () => {
              img.classList.add('lazy-loaded')
            }
          }
          observer.unobserve(img)
        }
      })
    }, {
      rootMargin: '50px 0px', // 提前50px开始加载
      threshold: 0.01
    })

    observer.observe(el)

    // 保存observer以便清理
    ;(el as any)._lazyObserver = observer
  },

  unmounted(el: HTMLImageElement) {
    // 清理observer
    const observer = (el as any)._lazyObserver
    if (observer) {
      observer.disconnect()
    }
  }
}

