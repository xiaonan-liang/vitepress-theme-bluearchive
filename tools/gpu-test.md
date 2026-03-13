---
title: GPU 性能测试
layout: page
---

# GPU 性能测试

<div id="gpu-test-container">
  <canvas id="gpu-canvas"></canvas>
</div>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const canvas = document.getElementById('gpu-canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

  if (!gl) {
    return
  }

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

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
  }

  @media (max-width: 768px) {
    #gpu-canvas {
      height: 300px;
    }
  }
</style>
