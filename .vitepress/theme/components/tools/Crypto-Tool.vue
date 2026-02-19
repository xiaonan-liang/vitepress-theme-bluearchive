<template>
  <div class="crypto-tool">
    <div class="crypto-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="crypto-content">
      <div class="input-section">
        <label>输入内容</label>
        <textarea
          v-model="inputText"
          placeholder="请输入要处理的内容..."
          rows="6"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button class="action-btn primary" @click="processText">
          {{ currentTabInfo?.reversible ? (isEncode ? '编码' : '解码') : '加密' }}
        </button>
        <button class="action-btn" @click="clearText">清空</button>
        <div v-if="currentTabInfo?.reversible" class="mode-toggle-inline">
          <button
            :class="['mode-btn-small', { active: isEncode }]"
            @click="isEncode = true"
          >
            编码
          </button>
          <button
            :class="['mode-btn-small', { active: !isEncode }]"
            @click="isEncode = false"
          >
            解码
          </button>
        </div>
        <button class="action-btn" @click="copyResult">复制结果</button>
      </div>

      <div class="output-section">
        <label>输出结果</label>
        <textarea
          v-model="outputText"
          placeholder="处理结果将显示在这里..."
          rows="6"
          readonly
        ></textarea>
      </div>

      <div v-if="currentTab === 's7'" class="s7-info">
        <p><strong>S7 加密说明：</strong></p>
        <ul>
          <li>S7 是一种自定义的 Base64 变体编码</li>
          <li>S7T 值是通过 MD5(s7 + 编码结果) 计算的 5 位哈希值</li>
          <li>解码时会自动计算原始的 S7T 值</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentTab = ref('base64')
const inputText = ref('')
const outputText = ref('')
const isEncode = ref(true)

const tabs = [
  { id: 'base64', name: 'Base64', reversible: true },
  { id: 's7', name: 'S7', reversible: true },
  { id: 'md5', name: 'MD5', reversible: false },
  { id: 'sha1', name: 'SHA-1', reversible: false },
  { id: 'sha256', name: 'SHA-256', reversible: false },
  { id: 'sha512', name: 'SHA-512', reversible: false }
]

const currentTabInfo = computed(() => {
  const tab = tabs.find(tab => tab.id === currentTab.value)
  return tab
})

const S7_TABLE = "Vg21WQ5KdRt0yNpcr9m4O3PoHaZvsLeCY8FjSwiTkUbuEBIJlAG7fqXM6xDnzh-;"

const s7encode = (inputStr: string): string => {
  if (!inputStr) return ""
  
  const s64List: string[] = []
  let index = 0
  
  while (inputStr.length >= index + 1) {
    let buf = 0
    let bytesNum = 0
    
    for (let i = 0; i < 3; i++) {
      buf = buf * 256
      if (inputStr.length >= index + 1) {
        buf += inputStr.charCodeAt(index)
        bytesNum++
        index++
      }
    }
    
    for (let i = 0; i < bytesNum + 1; i++) {
      const b64char = Math.floor(buf / 262144) % 64
      s64List.push(S7_TABLE[b64char])
      buf = buf * 64
    }
    
    for (let i = 0; i < 3 - bytesNum; i++) {
      s64List.push('_')
    }
  }
  
  return s64List.join('')
}

const s7decode = (encodedStr: string): string => {
  const cleanedStr = encodedStr.replace(/_+$/, '')
  const data: number[] = []
  let index = 0
  
  while (index < cleanedStr.length) {
    const chunk = cleanedStr.substring(index, index + 4)
    const indices = chunk.split('').map(c => S7_TABLE.indexOf(c))
    
    if (chunk.length === 4) {
      const num = (indices[0] << 18) | (indices[1] << 12) | (indices[2] << 6) | indices[3]
      data.push((num >> 16) & 0xFF)
      data.push((num >> 8) & 0xFF)
      data.push(num & 0xFF)
    } else if (chunk.length === 3) {
      const num = (indices[0] << 12) | (indices[1] << 6) | indices[2]
      data.push((num >> 10) & 0xFF)
      data.push((num >> 2) & 0xFF)
    } else if (chunk.length === 2) {
      const num = (indices[0] << 6) | indices[1]
      data.push((num >> 4) & 0xFF)
    }
    
    index += chunk.length
  }
  
  return String.fromCharCode(...data)
}

const generateS7t = async (s7String: string): Promise<string> => {
  const combined = 's7' + s7String
  const md5Hash = await hashText(combined, 'MD5')
  return md5Hash.substring(6, 11)
}

const getOriginalS7t = async (decodedStr: string): Promise<string> => {
  const reEncoded = s7encode(decodedStr)
  return await generateS7t(reEncoded)
}

const processText = async () => {
  if (!inputText.value) {
    outputText.value = ''
    return
  }

  try {
    switch (currentTab.value) {
      case 'base64':
        if (isEncode.value) {
          outputText.value = btoa(unescape(encodeURIComponent(inputText.value)))
        } else {
          outputText.value = decodeURIComponent(escape(atob(inputText.value)))
        }
        break
      case 's7':
        if (isEncode.value) {
          const encoded = s7encode(inputText.value)
          const s7tValue = await generateS7t(encoded)
          outputText.value = `${encoded}\nS7T: ${s7tValue}`
        } else {
          const decoded = s7decode(inputText.value)
          const originalS7t = await getOriginalS7t(decoded)
          outputText.value = `${decoded}\n原始S7T: ${originalS7t}`
        }
        break
      case 'md5':
        outputText.value = await hashText(inputText.value, 'MD5')
        break
      case 'sha1':
        outputText.value = await hashText(inputText.value, 'SHA-1')
        break
      case 'sha256':
        outputText.value = await hashText(inputText.value, 'SHA-256')
        break
      case 'sha512':
        outputText.value = await hashText(inputText.value, 'SHA-512')
        break
    }
  } catch (error) {
    outputText.value = '处理失败：' + (error as Error).message
  }
}

const hashText = async (text: string, algorithm: string): Promise<string> => {
  if (algorithm === 'MD5') {
    return md5(text)
  }
  
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const md5 = (string: string): string => {
  function rotateLeft(value: number, shift: number): number {
    return (value << shift) | (value >>> (32 - shift))
  }

  function addUnsigned(x: number, y: number): number {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }

  function f(x: number, y: number, z: number): number {
    return (x & y) | (~x & z)
  }

  function g(x: number, y: number, z: number): number {
    return (x & z) | (y & ~z)
  }

  function h(x: number, y: number, z: number): number {
    return x ^ y ^ z
  }

  function i(x: number, y: number, z: number): number {
    return y ^ (x | ~z)
  }

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  function gg(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  function hh(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  function ii(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  function convertToWordArray(string: string): number[] {
    let lWordCount: number
    const lMessageLength = string.length
    const lNumberOfWordsTemp1 = lMessageLength + 8
    const lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64
    const lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16
    const lWordArray = Array(lNumberOfWords - 1).fill(0)
    let lBytePosition = 0
    let lByteCount = 0

    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4
      lBytePosition = (lByteCount % 4) * 8
      lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition)
      lByteCount++
    }

    lWordCount = (lByteCount - (lByteCount % 4)) / 4
    lBytePosition = (lByteCount % 4) * 8
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
    return lWordArray
  }

  function wordToHex(lValue: number): string {
    let wordToHexValue = ''
    let wordToHexValueTemp = ''
    let lByte: number
    let lCount: number

    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255
      wordToHexValueTemp = '0' + lByte.toString(16)
      wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2)
    }

    return wordToHexValue
  }

  let x: number[] = []
  let k: number
  let AA: number
  let BB: number
  let CC: number
  let DD: number
  let a: number
  let b: number
  let c: number
  let d: number
  const S11 = 7
  const S12 = 12
  const S13 = 17
  const S14 = 22
  const S21 = 5
  const S22 = 9
  const S23 = 14
  const S24 = 20
  const S31 = 4
  const S32 = 11
  const S33 = 16
  const S34 = 23
  const S41 = 6
  const S42 = 10
  const S43 = 15
  const S44 = 21

  x = convertToWordArray(string)
  a = 0x67452301
  b = 0xEFCDAB89
  c = 0x98BADCFE
  d = 0x10325476

  for (k = 0; k < x.length; k += 16) {
    AA = a
    BB = b
    CC = c
    DD = d

    a = ff(a, b, c, d, x[k + 0], S11, 0xD76AA478)
    d = ff(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
    c = ff(c, d, a, b, x[k + 2], S13, 0x242070DB)
    b = ff(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
    a = ff(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
    d = ff(d, a, b, c, x[k + 5], S12, 0x4787C62A)
    c = ff(c, d, a, b, x[k + 6], S13, 0xA8304613)
    b = ff(b, c, d, a, x[k + 7], S14, 0xFD469501)
    a = ff(a, b, c, d, x[k + 8], S11, 0x698098D8)
    d = ff(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
    c = ff(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
    b = ff(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
    a = ff(a, b, c, d, x[k + 12], S11, 0x6B901122)
    d = ff(d, a, b, c, x[k + 13], S12, 0xFD987193)
    c = ff(c, d, a, b, x[k + 14], S13, 0xA679438E)
    b = ff(b, c, d, a, x[k + 15], S14, 0x49B40821)

    a = gg(a, b, c, d, x[k + 1], S21, 0xF61E2562)
    d = gg(d, a, b, c, x[k + 6], S22, 0xC040B340)
    c = gg(c, d, a, b, x[k + 11], S23, 0x265E5A51)
    b = gg(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
    a = gg(a, b, c, d, x[k + 5], S21, 0xD62F105D)
    d = gg(d, a, b, c, x[k + 10], S22, 0x02441453)
    c = gg(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
    b = gg(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
    a = gg(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
    d = gg(d, a, b, c, x[k + 14], S22, 0xC33707D6)
    c = gg(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
    b = gg(b, c, d, a, x[k + 8], S24, 0x455A14ED)
    a = gg(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
    d = gg(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
    c = gg(c, d, a, b, x[k + 7], S23, 0x676F02D9)
    b = gg(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)

    a = hh(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
    d = hh(d, a, b, c, x[k + 8], S32, 0x8771F681)
    c = hh(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
    b = hh(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
    a = hh(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
    d = hh(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
    c = hh(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
    b = hh(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
    a = hh(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
    d = hh(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
    c = hh(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
    b = hh(b, c, d, a, x[k + 6], S34, 0x04881D05)
    a = hh(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
    d = hh(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
    c = hh(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
    b = hh(b, c, d, a, x[k + 2], S34, 0xC4AC5665)

    a = ii(a, b, c, d, x[k + 0], S41, 0xF4292244)
    d = ii(d, a, b, c, x[k + 7], S42, 0x432AFF97)
    c = ii(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
    b = ii(b, c, d, a, x[k + 5], S44, 0xFC93A039)
    a = ii(a, b, c, d, x[k + 12], S41, 0x655B59C3)
    d = ii(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
    c = ii(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
    b = ii(b, c, d, a, x[k + 1], S44, 0x85845DD1)
    a = ii(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
    d = ii(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
    c = ii(c, d, a, b, x[k + 6], S43, 0xA3014314)
    b = ii(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
    a = ii(a, b, c, d, x[k + 4], S41, 0xF7537E82)
    d = ii(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
    c = ii(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
    b = ii(b, c, d, a, x[k + 9], S44, 0xEB86D391)

    a = addUnsigned(a, AA)
    b = addUnsigned(b, BB)
    c = addUnsigned(c, CC)
    d = addUnsigned(d, DD)
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase()
}

const clearText = () => {
  inputText.value = ''
  outputText.value = ''
}

const copyResult = async () => {
  if (!outputText.value) return
  
  try {
    await navigator.clipboard.writeText(outputText.value)
    alert('已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}
</script>

<style scoped lang="less">
.crypto-tool {
  width: 100%;
}

.crypto-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: var(--btn-background);
  color: var(--font-color-grey);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;

  &:hover {
    background-color: var(--btn-hover);
  }

  &.active {
    background-color: var(--btn-hover);
    color: var(--font-color-gold);
    font-weight: bold;
  }
}

.crypto-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    color: var(--font-color-grey);
    font-weight: bold;
    font-size: 14px;
  }

  textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--btn-background);
    border-radius: 12px;
    background-color: var(--general-background-color);
    color: var(--font-color-grey);
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    resize: vertical;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: var(--btn-hover);
    }

    &::placeholder {
      color: var(--font-color-grey);
      opacity: 0.5;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.action-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background-color: var(--btn-background);
  color: var(--font-color-grey);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background-color: var(--btn-hover);
    transform: translateY(-2px);
  }

  &.primary {
    background-color: var(--btn-hover);
    color: var(--font-color-gold);
  }
}

.mode-toggle-inline {
  display: flex;
  gap: 4px;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--btn-background);

  .mode-btn-small {
    padding: 10px 16px;
    border: none;
    background-color: transparent;
    color: var(--font-color-grey);
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    font-weight: bold;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
      background-color: var(--btn-hover);
      color: var(--font-color-gold);
    }
  }
}

.s7-info {
  padding: 16px;
  background-color: var(--btn-background);
  border-radius: 8px;
  border-left: 4px solid var(--font-color-gold);

  p {
    margin: 0 0 12px 0;
    color: var(--font-color-grey);
    font-size: 14px;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    color: var(--font-color-grey);
    font-size: 13px;
    opacity: 0.8;

    li {
      margin-bottom: 4px;
    }
  }
}

@media (max-width: 768px) {
  .crypto-tabs {
    gap: 4px;
  }

  .tab-btn {
    padding: 8px 12px;
    font-size: 12px;
  }

  .action-buttons {
    flex-direction: column;

    .action-btn {
      width: 100%;
    }
  }
}
</style>
