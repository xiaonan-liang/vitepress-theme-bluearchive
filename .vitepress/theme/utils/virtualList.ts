// 虚拟列表指令 - 只渲染可视区域的内容
// 适用于大量数据列表，减少 DOM 节点数量

interface VirtualListOptions {
  itemHeight: number
  bufferSize?: number
}

interface VirtualListState {
  container: HTMLElement
  items: HTMLElement[]
  startIndex: number
  endIndex: number
  options: VirtualListOptions
  observer: IntersectionObserver | null
  scrollHandler: (() => void) | null
}

const stateMap = new WeakMap<HTMLElement, VirtualListState>()

export const vVirtualList = {
  mounted(el: HTMLElement, binding: { value: VirtualListOptions }) {
    const options: VirtualListOptions = {
      bufferSize: 5,
      ...binding.value
    }

    // 获取所有子元素
    const items = Array.from(el.children) as HTMLElement[]
    if (items.length === 0) return

    // 设置容器样式
    el.style.position = 'relative'
    el.style.overflow = 'auto'
    el.style.maxHeight = '80vh'

    // 创建占位元素
    const totalHeight = items.length * options.itemHeight
    const placeholder = document.createElement('div')
    placeholder.style.height = `${totalHeight}px`
    placeholder.style.position = 'relative'
    
    // 包装原始内容
    const wrapper = document.createElement('div')
    wrapper.style.position = 'absolute'
    wrapper.style.top = '0'
    wrapper.style.left = '0'
    wrapper.style.right = '0'
    
    // 将子元素移到 wrapper
    items.forEach((item, index) => {
      item.style.position = 'absolute'
      item.style.top = `${index * options.itemHeight}px`
      item.style.height = `${options.itemHeight}px`
      item.style.width = '100%'
      item.style.left = '0'
      wrapper.appendChild(item)
    })

    placeholder.appendChild(wrapper)
    el.innerHTML = ''
    el.appendChild(placeholder)

    // 使用 Intersection Observer 检测可视区域
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const item = entry.target as HTMLElement
        if (entry.isIntersecting) {
          item.style.visibility = 'visible'
          item.style.opacity = '1'
        } else {
          item.style.visibility = 'hidden'
          item.style.opacity = '0'
        }
      })
    }, {
      root: el,
      rootMargin: `${options.bufferSize! * options.itemHeight}px 0px`,
      threshold: 0
    })

    // 观察所有子元素
    items.forEach(item => observer.observe(item))

    // 保存状态
    const state: VirtualListState = {
      container: el,
      items,
      startIndex: 0,
      endIndex: items.length - 1,
      options,
      observer,
      scrollHandler: null
    }
    stateMap.set(el, state)
  },

  updated(el: HTMLElement, binding: { value: VirtualListOptions }) {
    // 数据更新时重新初始化
    const state = stateMap.get(el)
    if (state) {
      // 清理旧的 observer
      if (state.observer) {
        state.items.forEach(item => state.observer!.unobserve(item))
        state.observer.disconnect()
      }
    }
    // 重新挂载
    vVirtualList.mounted(el, binding)
  },

  unmounted(el: HTMLElement) {
    const state = stateMap.get(el)
    if (state) {
      if (state.observer) {
        state.items.forEach(item => state.observer!.unobserve(item))
        state.observer.disconnect()
      }
      stateMap.delete(el)
    }
  }
}

// 简化的虚拟滚动 Hook
export function useVirtualList<T>(
  items: T[],
  options: VirtualListOptions
) {
  const containerRef = ref<HTMLElement | null>(null)
  const visibleItems = ref<T[]>([])
  const startIndex = ref(0)
  const endIndex = ref(0)
  const scrollTop = ref(0)

  const totalHeight = computed(() => items.length * options.itemHeight)
  
  const visibleHeight = computed(() => {
    if (!containerRef.value) return 0
    return containerRef.value.clientHeight
  })

  const visibleCount = computed(() => {
    return Math.ceil(visibleHeight.value / options.itemHeight) + (options.bufferSize || 5) * 2
  })

  const updateVisibleItems = () => {
    if (!containerRef.value) return
    
    const scroll = containerRef.value.scrollTop
    scrollTop.value = scroll
    
    const start = Math.floor(scroll / options.itemHeight)
    const end = Math.min(start + visibleCount.value, items.length)
    
    startIndex.value = Math.max(0, start - (options.bufferSize || 5))
    endIndex.value = end
    
    visibleItems.value = items.slice(startIndex.value, endIndex.value)
  }

  onMounted(() => {
    if (!containerRef.value) return
    
    updateVisibleItems()
    containerRef.value.addEventListener('scroll', updateVisibleItems, { passive: true })
    window.addEventListener('resize', updateVisibleItems)
  })

  onUnmounted(() => {
    if (!containerRef.value) return
    
    containerRef.value.removeEventListener('scroll', updateVisibleItems)
    window.removeEventListener('resize', updateVisibleItems)
  })

  return {
    containerRef,
    visibleItems,
    startIndex,
    endIndex,
    scrollTop,
    totalHeight,
    itemHeight: options.itemHeight
  }
}

import { ref, computed, onMounted, onUnmounted } from 'vue'
