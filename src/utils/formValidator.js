const EVENT_TEMPLATES = ['em-type-3', 'event-imagelink']

export function validateFormData(templateKey, formData, templateConfig, deviceType = 'web') {
  const issues = []
  const isEventTpl = EVENT_TEMPLATES.includes(templateKey)
  const isMobile = deviceType === 'mobile'

  // ① 상위 URL 필드 (공통)
  for (const [key, config] of Object.entries(templateConfig || {})) {
    if (config.type === 'url') {
      const val = formData[key]
      if (!val || !String(val).trim()) {
        issues.push({ level: 'warning', label: config.label, message: 'URL이 비어 있습니다', tab: config.tab || '기본', fieldKey: key })
      } else if (!/^https?:\/\/./.test(String(val))) {
        issues.push({ level: 'error', label: config.label, message: 'http:// 또는 https://로 시작해야 합니다', tab: config.tab || '기본', fieldKey: key })
      }
    }
  }

  // ② 페이지 타이틀 / GA (EventTemplate 전용)
  if (isEventTpl) {
    const pt = formData.pageTitle
    if (!pt || !String(pt).trim()) {
      issues.push({ level: 'error', label: '페이지 타이틀 / GA', message: '페이지 타이틀과 GA 코드를 입력하세요 (필수)', tab: '기본', fieldKey: 'pageTitle' })
    }
  }

  // ③ imageLinkGroups — 링크 데이터 + 이미지 URL + 대체텍스트
  if (Array.isArray(formData.imageLinkGroups)) {
    formData.imageLinkGroups.forEach((group, gi) => {
      const n = gi + 1

      if (isEventTpl) {
        const side = isMobile ? group.mobile : group.web
        const sideLabel = isMobile ? '모바일' : '웹'
        if (side && side.linkType && !hasLinkDataForType(side.linkType, side.linkData)) {
          issues.push({ level: 'warning', label: `링크 그룹 ${n} — ${sideLabel} 링크`, message: '링크 데이터가 설정되지 않았습니다', tab: '이미지링크', fieldKey: null, subIndex: gi })
        }

        // 이미지 URL + 대체텍스트 체크
        if (Array.isArray(group.images)) {
          group.images.forEach((img, ii) => {
            if (!img.url || !String(img.url).trim()) {
              issues.push({ level: 'warning', label: `링크 그룹 ${n} — 이미지 ${ii + 1} URL`, message: '이미지 URL이 비어 있습니다', tab: '이미지링크', fieldKey: null, subIndex: gi })
            }
            if (!img.alt || !String(img.alt).trim()) {
              issues.push({ level: 'warning', label: `링크 그룹 ${n} — 이미지 ${ii + 1} 대체텍스트`, message: '대체텍스트(alt)가 비어 있습니다', tab: '이미지링크', fieldKey: null, subIndex: gi })
            }
          })
        }
      } else {
        // EmTemplate (em-type-2, em-type-coupon 등): 단일 linkData
        if (!group.web && !group.mobile && !hasLinkDataForType(group.linkType, group.linkData)) {
          issues.push({ level: 'warning', label: `이미지 링크 그룹 ${n}`, message: '링크가 설정되지 않았습니다', tab: '이미지', fieldKey: null, subIndex: gi })
        }
        // 이미지 URL 체크
        if (Array.isArray(group.images)) {
          group.images.forEach((img, ii) => {
            if (!String(img.url || '').trim()) {
              issues.push({ level: 'warning', label: `이미지 링크 그룹 ${n} — 이미지 ${ii + 1} URL`, message: '이미지 URL이 비어 있습니다', tab: '이미지', fieldKey: null, subIndex: gi })
            }
          })
        }
      }
    })
  }

  // ④ hotspotGroups (EventTemplate 전용, em-type-3) — 현재 디바이스만 체크
  if (isEventTpl && Array.isArray(formData.hotspotGroups)) {
    formData.hotspotGroups.forEach((group, gi) => {
      const n = gi + 1

      // 그룹 이미지 대체텍스트 — 현재 디바이스
      if (isMobile) {
        // 모바일: getImageAlt 폴백과 동일하게 mobileImageAlt || webImageAlt 기준
        if (!String(group.mobileImageAlt || group.webImageAlt || '').trim()) {
          issues.push({ level: 'warning', label: `핫스팟 그룹 ${n} — 모바일 이미지 대체텍스트`, message: '대체텍스트 없음', tab: '이미지맵', fieldKey: null, subIndex: gi })
        }
      } else {
        if (!String(group.webImageAlt || '').trim()) {
          issues.push({ level: 'warning', label: `핫스팟 그룹 ${n} — 웹 이미지 대체텍스트`, message: '대체텍스트 없음', tab: '이미지맵', fieldKey: null, subIndex: gi })
        }
      }

      // 개별 핫스팟: 대체텍스트 + 현재 디바이스 링크
      if (Array.isArray(group.hotspots)) {
        group.hotspots.forEach((hs, hi) => {
          // 핫스팟 자체 대체텍스트 (디바이스 무관)
          if (!String(hs.alt || '').trim()) {
            issues.push({ level: 'warning', label: `핫스팟 ${n}-${hi + 1} 대체텍스트`, message: '대체텍스트(alt)가 비어 있습니다', tab: '이미지맵', fieldKey: null, subIndex: gi })
          }

          // 현재 디바이스 링크 데이터
          const side = isMobile ? hs.mobile : hs.web
          if (side && side.linkType && !hasLinkDataForType(side.linkType, side.linkData)) {
            const sideLabel = isMobile ? '모바일' : '웹'
            issues.push({ level: 'warning', label: `핫스팟 ${n}-${hi + 1} (${sideLabel} 링크)`, message: '링크 데이터가 설정되지 않았습니다', tab: '이미지맵', fieldKey: null, subIndex: gi })
          }
        })
      }
    })
  }

  // ⑤ imageMapRows — 이미지 URL 체크 (em-type-imagemap, em-type-letter, em-type-coupon 등)
  if (Array.isArray(formData.imageMapRows)) {
    formData.imageMapRows.forEach((row, ri) => {
      if (!String(row.imageUrl || '').trim()) {
        issues.push({ level: 'warning', label: `이미지맵 행 ${ri + 1} — 이미지 URL`, message: '이미지 URL이 비어 있습니다', tab: '이미지맵', fieldKey: null, subIndex: ri })
      }
    })
  }

  // ⑥ imageMapAreas — 링크 데이터 체크 (em-type-imagemap, em-type-letter 등)
  if (Array.isArray(formData.imageMapAreas)) {
    formData.imageMapAreas.forEach((area, ai) => {
      if (area.linkType && !hasLinkDataForType(area.linkType, area.linkData)) {
        // rowId로 행 인덱스 찾아서 subIndex로 사용 (탭 내 서브 이동)
        const rowIdx = Array.isArray(formData.imageMapRows)
          ? formData.imageMapRows.findIndex(r => r.id === area.rowId)
          : null
        issues.push({
          level: 'warning',
          label: `이미지맵 영역 ${ai + 1} 링크`,
          message: '링크 데이터가 설정되지 않았습니다',
          tab: '이미지맵',
          fieldKey: null,
          subIndex: rowIdx >= 0 ? rowIdx : null
        })
      }
    })
  }

  return issues
}

function hasLinkDataForType(linkType, linkData) {
  if (!linkData) return false
  const t = v => String(v || '').trim()
  switch (linkType) {
    // plan, product: em-type-3은 `code`, event-imagelink는 `planCode`/`productCode`
    case 'plan':         return !!(t(linkData.code) || t(linkData.planCode))
    case 'product':      return !!(t(linkData.code) || t(linkData.productCode))
    case 'event':        return !!(t(linkData.webEventCode) || t(linkData.mobileEventCode))
    case 'partner':      return !!(t(linkData.webPartnerCode) || t(linkData.mobilePartnerCode))
    case 'external':     return !!(t(linkData.url) || t(linkData.returnUrl))
    case 'brand_ecoupon':return !!t(linkData.code)
    case 'brand_store':  return !!t(linkData.code)
    case 'coupon':       return !!t(linkData.couponCodes)
    // search: em-type-3은 `keyword`, event-imagelink는 `searchKeyword`
    case 'search':       return !!(t(linkData.keyword) || t(linkData.searchKeyword))
    // custom: em-type-3은 `url`, event-imagelink는 `customUrl`
    case 'custom':       return !!(t(linkData.url) || t(linkData.customUrl))
    default:             return true
  }
}
