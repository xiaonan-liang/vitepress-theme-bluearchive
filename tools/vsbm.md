---
title: GPU 性能测试
layout: page
---

# GPU 性能测试

<div id="gpu-test-container">
  <canvas id="gpu-canvas"></canvas>
  <div id="gpu-info">
    <h2>GPU 信息</h2>
    <div id="gpu-details"></div>
  </div>
  <div id="test-result">
    <h2>测试结果</h2>
    <div id="fps-counter">FPS: <span id="fps">0</span></div>
    <div id="performance-rating"></div>
  </div>
</div>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const canvas = document.getElementById('gpu-canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  const gpuDetails = document.getElementById('gpu-details')
  const fpsElement = document.getElementById('fps')
  const ratingElement = document.getElementById('performance-rating')

  if (!gl) {
    gpuDetails.innerHTML = '<p style="color: red;">您的浏览器不支持 WebGL</p>'
    return
  }

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  const renderer = debugInfo ? debugInfo.UNMASKED_RENDERER_WEBGL : gl.getParameter(gl.RENDERER)
  const vendor = debugInfo ? debugInfo.UNMASKED_VENDOR_WEBGL : gl.getParameter(gl.VENDOR)

  gpuDetails.innerHTML = `
    <p><strong>渲染器:</strong> ${renderer}</p>
    <p><strong>供应商:</strong> ${vendor}</p>
    <p><strong>WebGL 版本:</strong> ${gl.getParameter(gl.VERSION)}</p>
    <p><strong>着色器语言版本:</strong> ${gl.getParameter(gl.SHADING_LANGUAGE_VERSION)}</p>
  `

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  let lastTime = performance.now()
  let frameCount = 0
  let fps = 0

  function createMushroom() {
    const vertices = []
    const colors = []
    const segments = 50

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const radius = 100 + Math.random() * 50
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      vertices.push(x, y)
      colors.push(Math.random(), Math.random(), Math.random(), 1.0)
    }

    return { vertices, colors }
  }

  function drawMushroom() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const mushroom = createMushroom()

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, `
      attribute vec2 a_position;
      attribute vec4 a_color;
      varying vec4 v_color;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_color = a_color;
      }
    `)
    gl.compileShader(vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, `
      precision mediump float;
      varying vec4 v_color;
      void main() {
        gl_FragColor = v_color;
      }
    `)
    gl.compileShader(fragmentShader)

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mushroom.vertices), gl.STATIC_DRAW)

    const colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mushroom.colors), gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    const colorLocation = gl.getAttribLocation(program, 'a_color')
    gl.enableVertexAttribArray(colorLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLE_FAN, 0, mushroom.vertices.length / 2)
  }

  function animate() {
    const currentTime = performance.now()
    frameCount++

    if (currentTime - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
      fpsElement.textContent = fps
      frameCount = 0
      lastTime = currentTime

      let rating = ''
      if (fps >= 60) {
        rating = '<span style="color: #4CAF50;">性能极佳！您的显卡非常强大</span>'
      } else if (fps >= 30) {
        rating = '<span style="color: #2196F3;">性能良好</span>'
      } else if (fps >= 15) {
        rating = '<span style="color: #FF9800;">性能一般</span>'
      } else {
        rating = '<span style="color: #F44336;">性能较差</span>'
      }
      ratingElement.innerHTML = rating
    }

    drawMushroom()
    requestAnimationFrame(animate)
  }

  animate()

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
})
</script>

<style scoped>
  #gpu-test-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  #gpu-canvas {
    width: 100%;
    height: 500px;
    background: #000;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  #gpu-info, #test-result {
    background: var(--infobox-background-initial);
    border: 2px solid var(--foreground-color);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
  }

  #gpu-info h2, #test-result h2 {
    margin-top: 0;
    color: var(--font-color-grey);
  }

  #gpu-details p {
    margin: 10px 0;
    color: var(--font-color-grey);
  }

  #fps-counter {
    font-size: 24px;
    font-weight: bold;
    margin: 10px 0;
    color: var(--font-color-grey);
  }

  #performance-rating {
    font-size: 18px;
    margin: 10px 0;
    color: var(--font-color-grey);
  }

  @media (max-width: 768px) {
    #gpu-canvas {
      height: 300px;
    }

    #gpu-info, #test-result {
      padding: 15px;
    }
  }
</style>
