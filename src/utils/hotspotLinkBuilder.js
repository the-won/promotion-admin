/**
 * hotspotLinkBuilder.js
 * 핫스팟 linkType별 웹/모바일 액션 생성 순수 함수
 * HotspotGroupEditor(미리보기) + eventMapHtml(다운로드) 양쪽에서 사용
 */

// ─────────────────────────────────────────────
// 웹 linkType 목록
// ─────────────────────────────────────────────
export const WEB_LINK_TYPES = [
  { value: 'plan',         label: '기획전' },
  { value: 'product',      label: '상품' },
  { value: 'event',        label: '이벤트' },
  { value: 'partner',      label: '파트너사(제휴사)' },
  { value: 'external',     label: '외부URL' },
  { value: 'brand_ecoupon',label: '브랜드 e쿠폰' },
  { value: 'search',       label: '검색어' },
  { value: 'custom',       label: '기타' },
]

// ─────────────────────────────────────────────
// 모바일 linkType 목록
// ─────────────────────────────────────────────
export const MOBILE_LINK_TYPES = [
  { value: 'plan',         label: '기획전' },
  { value: 'product',      label: '상품' },
  { value: 'event',        label: '이벤트' },
  { value: 'partner',      label: '파트너사(제휴사)' },
  { value: 'external',     label: '외부URL' },
  { value: 'brand_ecoupon',label: '브랜드 e쿠폰' },
  { value: 'brand_store',  label: '브랜드 매장결제(바로가게)' },
  { value: 'coupon',       label: '쿠폰 발급' },
  { value: 'search',       label: '검색어' },
  { value: 'custom',       label: '기타' },
]

// ─────────────────────────────────────────────
// 쿠폰 서브타입 목록 (모바일 전용)
// ─────────────────────────────────────────────
export const COUPON_TYPES = [
  { value: 'single',       label: '일반쿠폰 (단일)' },
  { value: 'multi',        label: '일반쿠폰 (다중)' },
  { value: 'brgg_single',  label: '바로가게쿠폰 (단일)' },
  { value: 'brgg_multi',   label: '바로가게쿠폰 (다중)' },
]

// ─────────────────────────────────────────────
// 빈 linkData 초기값
// ─────────────────────────────────────────────
export function createEmptyLinkData() {
  return {
    code: '',             // 기획전 / 상품 / 브랜드 공통 코드
    webEventCode: '',     // 이벤트 웹 코드
    mobileEventCode: '',  // 이벤트 모바일 코드
    webPartnerCode: '',   // 파트너사 웹 코드
    mobilePartnerCode: '',// 파트너사 모바일 코드
    returnUrl: '',        // 파트너사 returnUrl (선택)
    url: '',              // 외부URL / 기타
    brandSubType: 'ecoupon', // 브랜드: 'ecoupon' | 'store'
    couponType: 'single', // 쿠폰 타입
    couponCodes: '',      // 쿠폰번호 (다중은 콤마 구분)
    keyword: '',          // 검색어
  }
}

// ─────────────────────────────────────────────
// 웹 액션 생성
// returns: { tag: 'a'|'button', action: 'href="..."'|'onclick="..."', extra: 'target="_blank"'|'' }
// ─────────────────────────────────────────────
export function buildWebAction(linkConfig) {
  const { linkType, useLink, linkData } = linkConfig
  if (!linkData) return { tag: 'button', action: '', extra: '' }

  switch (linkType) {
    case 'plan': {
      const code = linkData.code || ''
      const action = code ? `onclick="goDisp('${code}');"` : ''
      return { tag: useLink ? 'a' : 'button', action, extra: '' }
    }

    case 'product': {
      const code = linkData.code || ''
      const action = code ? `onclick="goProdDetail('${code}');"` : ''
      return { tag: useLink ? 'a' : 'button', action, extra: '' }
    }

    case 'event': {
      const code = linkData.webEventCode || ''
      const url = `/frnt/eventzone/eventZoneView.do?evtTypCd=1&evtNo=${code}`
      return useLink
        ? { tag: 'a', action: code ? `href="${url}"` : '', extra: '' }
        : { tag: 'button', action: code ? `onclick="window.open('${url}');"` : '', extra: '' }
    }

    case 'partner': {
      const code = linkData.webPartnerCode || ''
      const ret = linkData.returnUrl || ''
      const url = ret
        ? `/frnt/partnersite/partnerSite.do?coopCoCd=${code}&returnUrl=${ret}`
        : `/frnt/partnersite/partnerSite.do?coopCoCd=${code}`
      return useLink
        ? { tag: 'a', action: code ? `href="${url}"` : '', extra: 'target="_blank"' }
        : { tag: 'button', action: code ? `onclick="window.open('${url}');"` : '', extra: '' }
    }

    case 'external': {
      const url = linkData.url || ''
      const action = url ? `onclick="window.open('${url}');"` : ''
      return { tag: useLink ? 'a' : 'button', action, extra: '' }
    }

    case 'brand_ecoupon': {
      const code = linkData.code || ''
      const action = code ? `onclick="goECouponProdDetail('${code}');"` : ''
      return { tag: useLink ? 'a' : 'button', action, extra: '' }
    }

    case 'search': {
      const kw = linkData.keyword || ''
      const encoded = kw ? `encodeURIComponent('${kw}')` : ''
      return {
        tag: 'button',
        action: kw
          ? `onclick="window.open('/search/searchList.do?srchLocChck=header&srchTxt=' + ${encoded},'_blank');"`
          : '',
        extra: ''
      }
    }

    case 'custom': {
      const url = linkData.url || ''
      const action = url ? `onclick="window.open('${url}');"` : ''
      return { tag: useLink ? 'a' : 'button', action, extra: '' }
    }

    // brand_store / coupon → 웹 미지원
    default:
      return { tag: 'button', action: '', extra: '' }
  }
}

// ─────────────────────────────────────────────
// 모바일 액션 생성
// returns: { tag: 'button', action: 'onclick="..."' }
// ─────────────────────────────────────────────
export function buildMobileAction(linkConfig) {
  const { linkType, linkData } = linkConfig
  if (!linkData) return { tag: 'button', action: '' }

  switch (linkType) {
    case 'plan': {
      const code = linkData.code || ''
      return {
        tag: 'button',
        action: code
          ? `onclick="handleInternalUrl('/main/planDetail.bene?dpPlanNo=${code}');"`
          : ''
      }
    }

    case 'product': {
      const code = linkData.code || ''
      return {
        tag: 'button',
        action: code
          ? `onclick="handleInternalUrl('/disp/detailView.bene?prdId=${code}');"`
          : ''
      }
    }

    case 'event': {
      const code = linkData.mobileEventCode || ''
      return {
        tag: 'button',
        action: code
          ? `onclick="handleInternalUrl('/disp/eventDetailView.bene?dispAreaSeq=${code}');"`
          : ''
      }
    }

    case 'partner': {
      const code = linkData.mobilePartnerCode || ''
      const ret = linkData.returnUrl || ''
      return {
        tag: 'button',
        action: code
          ? `onclick="goPartnerPage('${code}','${ret}');"`
          : ''
      }
    }

    case 'external': {
      const url = linkData.url || ''
      return {
        tag: 'button',
        action: url ? `onclick="goExternalUrl('${url}');"` : ''
      }
    }

    case 'brand_ecoupon': {
      const code = linkData.code || ''
      return {
        tag: 'button',
        action: code
          ? `onclick="handleInternalUrl('/disp/eCouponStoreMain.bene?brdId=${code}');"`
          : ''
      }
    }

    case 'brand_store': {
      const code = linkData.code || ''
      return {
        tag: 'button',
        action: code ? `onclick="AppBrandDetail('${code}');"` : ''
      }
    }

    case 'coupon': {
      const type = linkData.couponType || 'single'
      const raw = linkData.couponCodes || ''
      const codes = raw.split(',').map(s => s.trim()).filter(Boolean)
      let fn = ''
      if (type === 'single' && codes.length >= 1) {
        fn = `goNewEvtCpnDown('${codes[0]}');`
      } else if (type === 'multi' && codes.length >= 1) {
        fn = `goNewMultiEvtCpnDown(${codes.map(c => `'${c}'`).join(', ')});`
      } else if (type === 'brgg_single' && codes.length >= 1) {
        fn = `goNewEvtBrggCpnDown('${codes[0]}');`
      } else if (type === 'brgg_multi' && codes.length >= 1) {
        fn = `goNewMultiEvtBrggCpnDown(${codes.map(c => `'${c}'`).join(', ')});`
      }
      return {
        tag: 'button',
        action: fn ? `onclick="${fn}"` : ''
      }
    }

    case 'search': {
      const kw = linkData.keyword || ''
      return {
        tag: 'button',
        action: kw
          ? `onclick="callAppProcess('benepia://search_link?url='+encodeURIComponent('/searchResult.bene?srchTxt='+encodeURIComponent('${kw}')));"`
          : ''
      }
    }

    case 'custom': {
      const url = linkData.url || ''
      return {
        tag: 'button',
        action: url ? `onclick="handleInternalUrl('${url}');"` : ''
      }
    }

    default:
      return { tag: 'button', action: '' }
  }
}

// ─────────────────────────────────────────────
// 미리보기 텍스트 생성 (HotspotGroupEditor용)
// ─────────────────────────────────────────────
export function buildPreviewText(hotspot) {
  const webCfg = hotspot.web || {}
  const mobileCfg = hotspot.mobile || {}

  const webResult = buildWebAction(webCfg)
  const mobileResult = buildMobileAction(mobileCfg)

  return {
    web: webResult.action
      ? `<${webResult.tag} ${webResult.action}${webResult.extra ? ' ' + webResult.extra : ''}>`
      : '(없음)',
    mobile: mobileResult.action
      ? `<${mobileResult.tag} ${mobileResult.action}>`
      : '(없음)'
  }
}