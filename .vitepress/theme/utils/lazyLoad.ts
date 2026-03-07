// 图片懒加载指令 - 带占位符和模糊效果
export const vLazy = {
  mounted(el: HTMLImageElement) {
    // 保存原始src
    const src = el.getAttribute('src')
    if (!src) return

    // 获取图片尺寸用于占位符
    const width = el.getAttribute('width') || el.naturalWidth || 300
    const height = el.getAttribute('height') || el.naturalHeight || 200

    // 创建 SVG 占位符（防止布局跳动）
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ccc" font-size="14">
        加载中...
      </text>
    </svg>`
    const placeholder = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`

    // 设置占位符
    el.src = placeholder
    el.setAttribute('data-src', src)
    el.classList.add('lazy-image')

    // 使用Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const dataSrc = img.getAttribute('data-src')
          if (dataSrc) {
            // 创建新图片预加载
            const preloadImg = new Image()
            preloadImg.src = dataSrc
            preloadImg.onload = () => {
              img.src = dataSrc
              img.classList.add('lazy-loaded')
              // 添加淡入效果
              img.style.opacity = '0'
              requestAnimationFrame(() => {
                img.style.transition = 'opacity 0.3s ease'
                img.style.opacity = '1'
              })
            }
            preloadImg.onerror = () => {
              // 加载失败显示错误占位符
              img.classList.add('lazy-error')
              img.alt = '图片加载失败'
            }
          }
          observer.unobserve(img)
        }
      })
    }, {
      rootMargin: '100px 0px', // 提前100px开始加载
      threshold: 0
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

