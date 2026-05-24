let _worker = null

// ─────────────────────────────────────────────
// 수치 조정 가이드
// ─────────────────────────────────────────────

// 【큰 텍스트 기준】 이미지 높이 대비 단어 높이 비율
//   0.03 → 이미지 높이의 3% 이상 (소제목 수준까지 포함)
//   0.05 → 이미지 높이의 5% 이상 (메인 카피 위주)
//   0.08 → 이미지 높이의 8% 이상 (최대 헤드라인만)
//
//   예) 이미지가 600px 높이일 때
//     0.03 → 18px 이상 글자 포함
//     0.05 → 30px 이상 글자 포함
//     0.08 → 48px 이상 글자 포함
const LARGE_TEXT_RATIO = 0.03

// 【이미지 업스케일 배율】 OCR 전 이미지를 키워서 정확도 향상
//   1 → 원본 크기 (빠르지만 정확도 낮음)
//   2 → 2배 확대 (속도와 정확도 균형)
//   3 → 3배 확대 (더 정확하지만 느리고 메모리 많이 사용)
//   4 → 4배 확대 (작은 글자 추출에 유리, 매우 느림)
const UPSCALE = 3

// 【단어 신뢰도 임계값】 Tesseract가 각 단어마다 매기는 confidence (0~100)
//   50 → 관대 (오인식 통과 가능성 높음, 누락 줄임)
//   65 → 균형
//   75 → 엄격 (확실한 단어만, 일부 정상 단어 누락 가능)
const CONFIDENCE_THRESHOLD = 75

// 【대비 강화 배율】 흐릿한 텍스트의 가독성 향상 (1.0 = 변경 없음)
//   1.0 → 원본 그대로
//   1.3 → 약한 대비 강화 (기본값)
//   1.6 → 강한 대비 강화 (단색 배경에 유리, 그라데이션에는 불리)
//   2.0 → 극단적 대비 (포스터·헤드라인 전용)
const CONTRAST_BOOST = 1.3

// 【전처리 사용 여부】 그레이스케일 + 대비 강화 적용
//   true  → 깔끔한 단색 배경 이미지에 유리 (기본값)
//   false → 사진 배경, 복잡한 그라데이션 이미지에 유리
const ENABLE_PREPROCESSING = true

// 【Tesseract 페이지 세그먼테이션 모드 (PSM)】
//   '3'  → 자동 (기본, 다양한 레이아웃)
//   '6'  → 단일 블록 텍스트 (마케팅 헤드라인에 유리, 권장)
//   '11' → 분산된 텍스트 (이미지맵, 여러 박스에 흩어진 텍스트)
//   '12' → 분산 텍스트 + 방향 감지
const PSM_MODE = '6'

async function getWorker() {
  if (!_worker) {
    const { createWorker } = await import('tesseract.js')
    // OEM 1 = LSTM 신경망만 사용 (한글 인식 정확도 ↑)
    _worker = await createWorker('kor+eng', 1)
    await _worker.setParameters({
      tessedit_pageseg_mode: PSM_MODE,
      preserve_interword_spaces: '1', // 단어 사이 공백 보존
      user_defined_dpi: '300',        // 업스케일 이미지를 300 DPI로 간주
    })
  }
  return _worker
}

// Otsu 이진화: 배경과 텍스트를 자동으로 흑백으로 분리
// S-curve 대비 강화보다 배경 노이즈 제거에 훨씬 효과적
// Tesseract는 흰 배경에 검은 텍스트일 때 인식률이 가장 높음
function preprocessImageData(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const total = width * height

  // 1단계: 그레이스케일 값 추출 (ITU-R BT.601 가중치)
  const gray = new Uint8Array(total)
  for (let i = 0; i < total; i++) {
    const p = i * 4
    gray[i] = Math.round(0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2])
  }

  // 2단계: Otsu 임계값 계산 (클래스 간 분산 최대화)
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
    if (variance > maxVar) {
      maxVar = variance
      threshold = i
    }
  }

  // 3단계: 배경 색상 자동 감지
  // 픽셀의 과반수가 임계값보다 어두우면 → 어두운 배경(흰 텍스트) → 반전 필요
  const darkCount = gray.filter(g => g < threshold).length
  const isLightTextOnDark = darkCount > total / 2

  // 4단계: 이진화 적용 (텍스트→검정, 배경→흰색)
  for (let i = 0; i < total; i++) {
    const p = i * 4
    // 어두운 배경이면 반전해서 판단 (Tesseract는 흰 배경 선호)
    const isForeground = isLightTextOnDark
      ? gray[i] < threshold   // 반전: 밝은 픽셀 = 텍스트
      : gray[i] >= threshold  // 정상: 어두운 픽셀 = 텍스트

    const value = isForeground ? 255 : 0
    data[p] = data[p + 1] = data[p + 2] = value
  }

  ctx.putImageData(imageData, 0, 0)
}

function upscaleImageToCanvas(img) {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth * UPSCALE
  canvas.height = img.naturalHeight * UPSCALE
  const ctx = canvas.getContext('2d')
  // 업스케일 시 부드러운 보간 (한글 자형 유지에 유리)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.scale(UPSCALE, UPSCALE)
  ctx.drawImage(img, 0, 0)

  if (ENABLE_PREPROCESSING) {
    preprocessImageData(ctx, canvas.width, canvas.height)
  }

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

// 자간이 넓은 폰트로 인해 낱글자로 쪼개진 한글을 다시 붙임
// 예) "범 위 하 다" → "범위하다", "건 강 가 전" → "건강가전"
// 단어 사이 공백("연말 선물")은 유지 — 연속된 한글 낱글자만 병합
function mergeSpacedKorean(line) {
  const tokens = line.split(' ').filter(t => t.length > 0)
  const result = []
  let i = 0
  while (i < tokens.length) {
    if (/^[가-힣]$/.test(tokens[i])) {
      let merged = tokens[i]
      let j = i + 1
      while (j < tokens.length && /^[가-힣]$/.test(tokens[j])) {
        merged += tokens[j]
        j++
      }
      result.push(merged)
      i = j
    } else {
      result.push(tokens[i])
      i++
    }
  }
  return result.join(' ')
}

// 토큰에서 기호를 제거하고 한글·영문·숫자·% 만 남김
// 예) "~79%" → "79%", "프로-스펙스" → "프로스펙스", "안녕!" → "안녕"
// 추가로 살릴 기호가 있으면 정규식 부정 클래스에 추가
// (예) 하이픈도 허용 → /[^a-zA-Z0-9가-힣%\-]/g
function stripSymbols(t) {
  return t.replace(/[^a-zA-Z0-9가-힣%]/g, '')
}

// 텍스트 후처리: 이중 공백/줄바꿈 정리
function cleanupKoreanText(text) {
  return text
    .replace(/ {2,}/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

function extractLargeText(data, imageHeight) {
  const minWordHeight = imageHeight * LARGE_TEXT_RATIO

  const lines = data.lines.map(line => {
    const words = line.words
      .filter(w => {
        // ⓐ bbox 높이 기준: 이미지 대비 큰 글자만
        if ((w.bbox.y1 - w.bbox.y0) < minWordHeight) return false
        // ⓑ Tesseract confidence 기준: 신뢰도 낮은 단어 제외
        if (w.confidence < CONFIDENCE_THRESHOLD) return false
        return true
      })
      // 각 단어에서 기호 제거 (한글·영문·숫자만 남김)
      .map(w => stripSymbols(w.text.trim()))
      .filter(t => {
        // ① 기호 제거 후 빈 토큰 제외 ("~", "...", "@" 같은 순수 기호 단어 제거)
        if (t.length < 1) return false

        // ② 대문자만으로 된 2글자 이상 영문 토큰 제거
        //    한글 장식체를 "ECS", "CEOS", "HAAS" 등으로 오인식하는 경우 걸러냄
        //    예외를 두려면: && !['OK', 'TV', 'PC'].includes(t) 형태로 화이트리스트 추가
        if (/^[A-Z]{2,}$/.test(t)) return false

        // ③ 순수 영문 1~2글자 토큰 제거 ("Al", "Cs", "te" 등 노이즈)
        //    숫자 포함("4K", "2D")이나 한글 포함이면 통과
        //    더 길게 잡으려면 {1,2} → {1,3} 으로 변경
        if (/^[a-zA-Z]{1,2}$/.test(t)) return false

        // ④ 한글+긴 영문 혼합 토큰 제거 ("decrypts는", "Holiday뷰티" 등 오인식)
        //    한글이 포함되어 있지만 4글자 이상 연속 영문이 섞인 경우 제거
        //    영문 임계값 조정: {4,} → {3,} 더 엄격 / {5,} 더 관대
        if (/[가-힣]/.test(t) && /[a-zA-Z]{4,}/.test(t)) return false

        // ⑤ 한글이 포함된 너무 짧은 혼합 토큰 제거 (예: "에4d", "은0")
        //    한글이 1글자 + 알파벳/숫자 노이즈가 붙은 패턴
        if (/^[가-힣][a-zA-Z0-9]{1,2}$/.test(t)) return false

        return true
      })

    return mergeSpacedKorean(words.join(' '))
  }).filter(line => line.trim().length > 0)

  // 줄바꿈(\n)으로 구분해 반환 → alt 텍스트에서 공백으로 치환하려면
  // 아래를 lines.join(' ') 으로 변경
  return cleanupKoreanText(lines.join('\n'))
}

// 핫스팟 영역 전용 텍스트 추출
// 전체 이미지와 달리 영역 안의 모든 텍스트를 추출 (크기 필터 없음)
function extractRegionText(data) {
  const lines = data.lines.map(line => {
    const words = line.words
      .filter(w => w.confidence >= CONFIDENCE_THRESHOLD)
      .map(w => stripSymbols(w.text.trim()))
      .filter(t => {
        if (t.length < 1) return false
        if (/^[A-Z]{2,}$/.test(t)) return false
        if (/^[a-zA-Z]{1,2}$/.test(t)) return false
        if (/[가-힣]/.test(t) && /[a-zA-Z]{4,}/.test(t)) return false
        if (/^[가-힣][a-zA-Z0-9]{1,2}$/.test(t)) return false
        return true
      })
    return mergeSpacedKorean(words.join(' '))
  }).filter(line => line.trim().length > 0)

  // 핫스팟 alt는 한 줄로 표현하는 게 자연스러움
  return cleanupKoreanText(lines.join(' '))
}

// 이미지를 로드해 img 엘리먼트로 반환 (CORS 포함)
async function loadImageElement(imageUrl) {
  return new Promise(resolve => {
    const img = new Image()
    if (!imageUrl.startsWith('data:')) img.crossOrigin = 'anonymous'
    img.onload = () => resolve({ ok: true, img })
    img.onerror = () => resolve({ ok: false, errorType: 'network' })
    img.src = imageUrl
  })
}

// 이미지의 특정 영역을 잘라 OCR — 핫스팟 대체텍스트 자동 추출용
// region: { x, y, width, height } — 원본 이미지 기준 절대 픽셀
export async function runOcrOnRegion(imageUrl, region) {
  const CORS_MSG = '이미지 서버가 CORS를 허용하지 않습니다. 파일 업로드 후 OCR을 사용하세요.'

  if (!region || region.width <= 0 || region.height <= 0) {
    return { success: false, errorType: 'invalid', errorMessage: '핫스팟 영역이 유효하지 않습니다.' }
  }

  const loaded = await loadImageElement(imageUrl)
  if (!loaded.ok) {
    return { success: false, errorType: 'network', errorMessage: '이미지를 불러올 수 없습니다. URL을 확인하세요.' }
  }

  // 영역 크롭 + 업스케일
  const canvas = document.createElement('canvas')
  canvas.width = region.width * UPSCALE
  canvas.height = region.height * UPSCALE
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  try {
    // drawImage(img, 소스x, 소스y, 소스w, 소스h, 대상x, 대상y, 대상w, 대상h)
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
    const text = extractRegionText(data)
    return { success: true, text }
  } catch {
    return { success: false, errorType: 'ocr', errorMessage: 'OCR 처리 중 오류가 발생했습니다.' }
  }
}

export async function runOcr(imageUrl) {
  let source, imageHeight

  if (imageUrl.startsWith('data:')) {
    const result = await dataUrlToSource(imageUrl)
    source = result.dataUrl
    imageHeight = result.height
  } else {
    const probe = await probeAndGetSource(imageUrl)
    if (!probe.ok) {
      const messages = {
        cors: '이미지 서버가 CORS를 허용하지 않습니다. 파일 업로드 후 OCR을 사용하세요.',
        network: '이미지를 불러올 수 없습니다. URL을 확인하세요.'
      }
      return { success: false, errorType: probe.errorType, errorMessage: messages[probe.errorType] }
    }
    source = probe.dataUrl
    imageHeight = probe.height
  }

  try {
    const worker = await getWorker()
    const { data } = await worker.recognize(source)
    const text = extractLargeText(data, imageHeight)
    return { success: true, text }
  } catch {
    return { success: false, errorType: 'ocr', errorMessage: 'OCR 처리 중 오류가 발생했습니다.' }
  }
}
