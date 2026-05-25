// ═══════════════════════════════════════════════════════════════
// OCR 엔진 스위치
// ───────────────────────────────────────────────────────────────
//  true  → Clova OCR (유료 API, 월 5,000건 무료)
//  false → Tesseract.js (완전 무료, 브라우저 로컬 실행)
// ═══════════════════════════════════════════════════════════════
const USE_CLOVA = true




// ───────────────────────────────────────────────────────────────
// 공통 상수
// ───────────────────────────────────────────────────────────────

// 【큰 텍스트 기준】 이미지 높이 대비 단어 높이 비율
//   0.03 → 이미지 높이의 3% 이상 (소제목 수준까지 포함)
//   0.05 → 이미지 높이의 5% 이상 (메인 카피 위주)
const LARGE_TEXT_RATIO = 0.03




// ═══════════════════════════════════════════════════════════════
// [Clova OCR 섹션] USE_CLOVA = true 일 때 사용
// ═══════════════════════════════════════════════════════════════

// 개발: Vite 프록시, 프로덕션: Nginx 프록시 — 둘 다 /ocr-proxy 경로 사용
const OCR_URL    = '/ocr-proxy'
const OCR_SECRET = import.meta.env.VITE_CLOVA_OCR_SECRET

// 핫스팟 영역 크롭 후 Clova 전송 전 업스케일 배율
const REGION_UPSCALE = 2

async function callClovaOcr(imagePayload) {
  const body = {
    version: 'V2',
    requestId: crypto.randomUUID(),
    timestamp: 0,
    images: [{ name: 'image', ...imagePayload }],
  }
  const res = await fetch(OCR_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-OCR-SECRET': OCR_SECRET,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Clova OCR ${res.status}`)
  return res.json()
}

function getClovaFieldHeight(field) {
  const ys = field.boundingPoly.vertices.map(v => v.y)
  return Math.max(...ys) - Math.min(...ys)
}

// Clova 응답의 fields 배열을 줄 단위 텍스트 배열로 변환
// lineBreak: true 인 field 뒤에서 줄이 바뀜
function clovaFieldsToLines(fields) {
  const lines = []
  let current = []
  for (const f of fields) {
    current.push(f.inferText)
    if (f.lineBreak) {
      lines.push(current.join(' '))
      current = []
    }
  }
  if (current.length > 0) lines.push(current.join(' '))
  return lines
}

function extractLargeTextFromClova(data, imageHeight) {
  const image = data.images?.[0]
  if (!image || image.inferResult !== 'SUCCESS') return ''

  const minH = imageHeight * LARGE_TEXT_RATIO
  const filtered = (image.fields || []).filter(f => getClovaFieldHeight(f) >= minH)
  return clovaFieldsToLines(filtered).filter(l => l.trim()).join('\n').trim()
}

function extractRegionTextFromClova(data) {
  const image = data.images?.[0]
  if (!image || image.inferResult !== 'SUCCESS') return ''
  return clovaFieldsToLines(image.fields || []).filter(l => l.trim()).join(' ').trim()
}

// 이미지 src로부터 naturalWidth/Height만 취득 (캔버스 접근 없음 → CORS 불필요)
function getImageSize(src) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload  = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// 이미지의 특정 영역을 잘라 base64 문자열로 반환 (CORS 필요)
function cropRegionToBase64(img, region) {
  const canvas = document.createElement('canvas')
  canvas.width  = region.width  * REGION_UPSCALE
  canvas.height = region.height * REGION_UPSCALE
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, region.x, region.y, region.width, region.height, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/png').replace(/^data:image\/\w+;base64,/, '')
}

async function runOcrClova(imageUrl) {
  try {
    if (imageUrl.startsWith('data:')) {
      const size   = await getImageSize(imageUrl)
      if (!size) return { success: false, errorType: 'network', errorMessage: '이미지를 불러올 수 없습니다.' }
      const format = imageUrl.match(/^data:image\/(\w+)/)?.[1] || 'png'
      const base64 = imageUrl.replace(/^data:image\/\w+;base64,/, '')
      const data   = await callClovaOcr({ format, data: base64 })
      return { success: true, text: extractLargeTextFromClova(data, size.height) }
    } else {
      const size = await getImageSize(imageUrl)
      if (!size) return { success: false, errorType: 'network', errorMessage: '이미지를 불러올 수 없습니다. URL을 확인하세요.' }
      const data = await callClovaOcr({ format: 'jpg', url: imageUrl })
      return { success: true, text: extractLargeTextFromClova(data, size.height) }
    }
  } catch (e) {
    console.error('[Clova OCR 오류]', e)
    return { success: false, errorType: 'ocr', errorMessage: 'OCR 처리 중 오류가 발생했습니다.' }
  }
}

async function runOcrOnRegionClova(imageUrl, region) {
  if (!region || region.width <= 0 || region.height <= 0) {
    return { success: false, errorType: 'invalid', errorMessage: '핫스팟 영역이 유효하지 않습니다.' }
  }
  return new Promise(resolve => {
    const img = new Image()
    if (!imageUrl.startsWith('data:')) img.crossOrigin = 'anonymous'
    img.onload = async () => {
      try {
        const base64 = cropRegionToBase64(img, region)
        const data   = await callClovaOcr({ format: 'png', data: base64 })
        resolve({ success: true, text: extractRegionTextFromClova(data) })
      } catch {
        resolve({ success: false, errorType: 'cors', errorMessage: '이미지 서버가 CORS를 허용하지 않습니다. 파일 업로드 후 OCR을 사용하세요.' })
      }
    }
    img.onerror = () => resolve({ success: false, errorType: 'network', errorMessage: '이미지를 불러올 수 없습니다. URL을 확인하세요.' })
    img.src = imageUrl
  })
}




// ═══════════════════════════════════════════════════════════════
// [Tesseract.js 섹션] USE_CLOVA = false 일 때 사용
// ═══════════════════════════════════════════════════════════════

let _worker = null

// 【이미지 업스케일 배율】 OCR 전 이미지를 키워서 정확도 향상
//   2 → 속도와 정확도 균형 / 3 → 더 정확하지만 느림
const UPSCALE = 3

// 【단어 신뢰도 임계값】 0~100
//   50 관대 / 65 균형 / 75 엄격
const CONFIDENCE_THRESHOLD = 75

// 【전처리 사용 여부】 Otsu 이진화 + 그레이스케일
//   true  → 단색 배경 이미지에 유리
//   false → 사진·그라데이션 배경에 유리
const ENABLE_PREPROCESSING = true

// 【Tesseract PSM 모드】
//   '3' 자동 / '6' 단일 블록(마케팅 헤드라인 권장) / '11' 분산 텍스트
const PSM_MODE = '6'

async function getWorker() {
  if (!_worker) {
    const { createWorker } = await import('tesseract.js')
    _worker = await createWorker('kor+eng', 1)
    await _worker.setParameters({
      tessedit_pageseg_mode: PSM_MODE,
      preserve_interword_spaces: '1',
      user_defined_dpi: '300',
    })
  }
  return _worker
}

function preprocessImageData(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const total = width * height

  const gray = new Uint8Array(total)
  for (let i = 0; i < total; i++) {
    const p = i * 4
    gray[i] = Math.round(0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2])
  }

  const hist = new Array(256).fill(0)
  gray.forEach(g => hist[g]++)

  let sum = 0
  for (let i = 0; i < 256; i++) sum += i * hist[i]

  let sumB = 0, wB = 0, maxVar = 0, threshold = 128
  for (let i = 0; i < 256; i++) {
    wB += hist[i]
    if (wB === 0) continue
    const wF = total - wB
    if (wF === 0) break
    sumB += i * hist[i]
    const mB = sumB / wB
    const mF = (sum - sumB) / wF
    const variance = wB * wF * (mB - mF) ** 2
    if (variance > maxVar) { maxVar = variance; threshold = i }
  }

  const darkCount = gray.filter(g => g < threshold).length
  const isLightTextOnDark = darkCount > total / 2

  for (let i = 0; i < total; i++) {
    const p = i * 4
    const isForeground = isLightTextOnDark ? gray[i] < threshold : gray[i] >= threshold
    const value = isForeground ? 255 : 0
    data[p] = data[p + 1] = data[p + 2] = value
  }
  ctx.putImageData(imageData, 0, 0)
}

function upscaleImageToCanvas(img) {
  const canvas = document.createElement('canvas')
  canvas.width  = img.naturalWidth  * UPSCALE
  canvas.height = img.naturalHeight * UPSCALE
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.scale(UPSCALE, UPSCALE)
  ctx.drawImage(img, 0, 0)
  if (ENABLE_PREPROCESSING) preprocessImageData(ctx, canvas.width, canvas.height)
  return canvas
}

async function probeAndGetSource(imageUrl) {
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = upscaleImageToCanvas(img)
        resolve({ ok: true, dataUrl: canvas.toDataURL('image/png'), height: canvas.height })
      } catch {
        resolve({ ok: false, errorType: 'cors' })
      }
    }
    img.onerror = () => resolve({ ok: false, errorType: 'network' })
    img.src = imageUrl
  })
}

async function dataUrlToSource(dataUrl) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const canvas = upscaleImageToCanvas(img)
      resolve({ dataUrl: canvas.toDataURL('image/png'), height: canvas.height })
    }
    img.src = dataUrl
  })
}

function mergeSpacedKorean(line) {
  const tokens = line.split(' ').filter(t => t.length > 0)
  const result = []
  let i = 0
  while (i < tokens.length) {
    if (/^[가-힣]$/.test(tokens[i])) {
      let merged = tokens[i]
      let j = i + 1
      while (j < tokens.length && /^[가-힣]$/.test(tokens[j])) { merged += tokens[j]; j++ }
      result.push(merged)
      i = j
    } else {
      result.push(tokens[i])
      i++
    }
  }
  return result.join(' ')
}

function stripSymbols(t) {
  return t.replace(/[^a-zA-Z0-9가-힣%]/g, '')
}

function cleanupKoreanText(text) {
  return text.replace(/ {2,}/g, ' ').replace(/\n{2,}/g, '\n').trim()
}

function filterTesseractTokens(words, minWordHeight) {
  return words
    .filter(w => {
      if (minWordHeight !== undefined && (w.bbox.y1 - w.bbox.y0) < minWordHeight) return false
      if (w.confidence < CONFIDENCE_THRESHOLD) return false
      return true
    })
    .map(w => stripSymbols(w.text.trim()))
    .filter(t => {
      if (t.length < 1) return false
      if (/^[A-Z]{2,}$/.test(t)) return false
      if (/^[a-zA-Z]{1,2}$/.test(t)) return false
      if (/[가-힣]/.test(t) && /[a-zA-Z]{4,}/.test(t)) return false
      if (/^[가-힣][a-zA-Z0-9]{1,2}$/.test(t)) return false
      return true
    })
}

function extractLargeText(data, imageHeight) {
  const minWordHeight = imageHeight * LARGE_TEXT_RATIO
  const lines = data.lines.map(line => {
    const words = filterTesseractTokens(line.words, minWordHeight)
    return mergeSpacedKorean(words.join(' '))
  }).filter(line => line.trim().length > 0)
  return cleanupKoreanText(lines.join('\n'))
}

function extractRegionText(data) {
  const lines = data.lines.map(line => {
    const words = filterTesseractTokens(line.words)
    return mergeSpacedKorean(words.join(' '))
  }).filter(line => line.trim().length > 0)
  return cleanupKoreanText(lines.join(' '))
}

async function loadImageElement(imageUrl) {
  return new Promise(resolve => {
    const img = new Image()
    if (!imageUrl.startsWith('data:')) img.crossOrigin = 'anonymous'
    img.onload  = () => resolve({ ok: true, img })
    img.onerror = () => resolve({ ok: false, errorType: 'network' })
    img.src = imageUrl
  })
}

async function runOcrTesseract(imageUrl) {
  let source, imageHeight

  if (imageUrl.startsWith('data:')) {
    const result = await dataUrlToSource(imageUrl)
    source = result.dataUrl
    imageHeight = result.height
  } else {
    const probe = await probeAndGetSource(imageUrl)
    if (!probe.ok) {
      const messages = {
        cors:    '이미지 서버가 CORS를 허용하지 않습니다. 파일 업로드 후 OCR을 사용하세요.',
        network: '이미지를 불러올 수 없습니다. URL을 확인하세요.',
      }
      return { success: false, errorType: probe.errorType, errorMessage: messages[probe.errorType] }
    }
    source = probe.dataUrl
    imageHeight = probe.height
  }

  try {
    const worker = await getWorker()
    const { data } = await worker.recognize(source)
    return { success: true, text: extractLargeText(data, imageHeight) }
  } catch {
    return { success: false, errorType: 'ocr', errorMessage: 'OCR 처리 중 오류가 발생했습니다.' }
  }
}

async function runOcrOnRegionTesseract(imageUrl, region) {
  if (!region || region.width <= 0 || region.height <= 0) {
    return { success: false, errorType: 'invalid', errorMessage: '핫스팟 영역이 유효하지 않습니다.' }
  }

  const CORS_MSG = '이미지 서버가 CORS를 허용하지 않습니다. 파일 업로드 후 OCR을 사용하세요.'
  const loaded = await loadImageElement(imageUrl)
  if (!loaded.ok) {
    return { success: false, errorType: 'network', errorMessage: '이미지를 불러올 수 없습니다. URL을 확인하세요.' }
  }

  const canvas = document.createElement('canvas')
  canvas.width  = region.width  * UPSCALE
  canvas.height = region.height * UPSCALE
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  try {
    ctx.drawImage(loaded.img, region.x, region.y, region.width, region.height, 0, 0, canvas.width, canvas.height)
  } catch {
    return { success: false, errorType: 'cors', errorMessage: CORS_MSG }
  }

  if (ENABLE_PREPROCESSING) {
    try {
      preprocessImageData(ctx, canvas.width, canvas.height)
    } catch {
      return { success: false, errorType: 'cors', errorMessage: CORS_MSG }
    }
  }

  try {
    const worker = await getWorker()
    const { data } = await worker.recognize(canvas.toDataURL('image/png'))
    return { success: true, text: extractRegionText(data) }
  } catch {
    return { success: false, errorType: 'ocr', errorMessage: 'OCR 처리 중 오류가 발생했습니다.' }
  }
}




// ═══════════════════════════════════════════════════════════════
// 공용 export — 엔진 스위치(USE_CLOVA)에 따라 자동 분기
// ═══════════════════════════════════════════════════════════════

export function runOcr(imageUrl) {
  return USE_CLOVA ? runOcrClova(imageUrl) : runOcrTesseract(imageUrl)
}

export function runOcrOnRegion(imageUrl, region) {
  return USE_CLOVA ? runOcrOnRegionClova(imageUrl, region) : runOcrOnRegionTesseract(imageUrl, region)
}
