/**
 * 개인정보 섹션 목록(listGroups / listItems) 공통 로직.
 * PrivacyPreview.vue · privacyHtml.js 에서 동일 동작을 보장한다.
 *
 * 빈 목록: HTML 생성은 빈 문자열, 미리보기는 항목 0개일 때 ul 을 렌더하지 않음.
 */

export function normalizePrivacyListItems(listItems) {
  if (!Array.isArray(listItems)) return []
  return listItems.map((item) => {
    if (typeof item === 'string') {
      return { text: item, children: [] }
    }
    return {
      text: item && item.text ? item.text : '',
      children: Array.isArray(item && item.children) ? item.children : []
    }
  })
}

export function getPrivacySectionListGroups(section) {
  const groups = section && Array.isArray(section.listGroups) ? section.listGroups : []
  if (groups.length > 0) return groups
  return [{
    type: (section && section.listType) || 'term-list2',
    items: Array.isArray(section && section.listItems) ? section.listItems : []
  }]
}

/** 섹션 최상위 postBodyText 우선, 없으면 그룹·extraBodyText(레거시)에서 합침 */
export function effectivePrivacySectionPostBody(section) {
  if (section && section.postBodyText) return section.postBodyText
  const parts = []
  const groups = section && Array.isArray(section.listGroups) ? section.listGroups : []
  groups.forEach((g) => {
    if (g && g.postBodyText) parts.push(g.postBodyText)
  })
  if (section && section.extraBodyText) parts.push(section.extraBodyText)
  return parts.join('\n\n')
}

export function privacyListStyleByType(listType) {
  if (listType === 'term-list') {
    return 'list-style:none;margin:0 0 16px;padding-left:15px;text-indent:-15px;'
  }
  return 'list-style:none;margin:0 0 16px;padding-left:20px;text-indent:-20px;'
}

/**
 * @param {Array} listItems
 * @param {string} listType 'term-list' | 'term-list2'
 * @param {(s: string) => string} nl2br
 * @returns {string}
 */
export function renderPrivacyListHtml(listItems, listType, nl2br) {
  const normalized = normalizePrivacyListItems(listItems)
  if (!normalized.length) return ''

  const items = normalized.map((item) => {
    const children = (item.children || []).map((child) =>
      `<li style="list-style:none;line-height:1.5em;margin:3px 0 3px 18px;padding-left:15px;text-indent:-15px;">${nl2br(child)}</li>`
    ).join('\n')
    const nestedHtml = children ? `<ul style="list-style:none;margin:4px 0 0;padding:0;">${children}</ul>` : ''
    return `<li style="list-style:none;line-height:1.5em;margin:3px 0 3px 18px;">${nl2br(item.text)}${nestedHtml}</li>`
  }).join('\n')

  return `<ul style="${privacyListStyleByType(listType)}">${items}</ul>`
}
