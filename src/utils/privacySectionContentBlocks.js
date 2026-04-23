import { getPrivacySectionListGroups } from './privacySectionLists.js'

/**
 * 섹션 본문 아래에 목록 그룹·테이블·중간 본문을 임의 순서로 배치하기 위한 블록 목록.
 * 각 원소:
 * - { type: 'listGroup', id: string }
 * - { type: 'table', id: string }
 * - { type: 'body', id: string, text: string }  // 목록/테이블 사이에 올 수 있는 본문 단락
 */
export function buildSectionContentBlocks(section, listGroups, tables) {
  const groups = Array.isArray(listGroups) ? listGroups : []
  const tabs = Array.isArray(tables) ? tables : []
  const raw = Array.isArray(section && section.contentBlocks) ? section.contentBlocks : []
  const result = []
  const seen = new Set()

  const tryPush = (b) => {
    if (!b || !b.type || !b.id) return
    const key = `${b.type}:${b.id}`
    if (seen.has(key)) return
    if (b.type === 'listGroup' && groups.some((g) => g.id === b.id)) {
      result.push({ type: 'listGroup', id: b.id })
      seen.add(key)
    } else if (b.type === 'table' && tabs.some((t) => t.id === b.id)) {
      result.push({ type: 'table', id: b.id })
      seen.add(key)
    }
  }

  raw.forEach((b) => {
    if (!b || !b.type) return
    if (b.type === 'body' && b.id) {
      const text = typeof b.text === 'string' ? b.text : ''
      result.push({ type: 'body', id: b.id, text })
      return
    }
    tryPush(b)
  })
  groups.forEach((g) => tryPush({ type: 'listGroup', id: g.id }))
  tabs.forEach((t) => tryPush({ type: 'table', id: t.id }))
  return result
}

/**
 * 미리보기 / HTML 생성용: 순서가 반영된 { type, group? | table? } 스트림
 */
export function getPrivacySectionRenderStream(section) {
  const tables = Array.isArray(section && section.tables) ? section.tables : []

  if (!section || !Array.isArray(section.listGroups) || section.listGroups.length === 0) {
    const groups = getPrivacySectionListGroups(section)
    const out = []
    groups.forEach((g) => out.push({ type: 'listGroup', group: g }))
    tables.forEach((t) => out.push({ type: 'table', table: t }))
    return out
  }

  const groups = section.listGroups
  const blocks = buildSectionContentBlocks(section, groups, tables)
  return blocks
    .map((b) => {
      if (b.type === 'listGroup') {
        const group = groups.find((g) => g.id === b.id)
        return group ? { type: 'listGroup', group } : null
      }
      if (b.type === 'body') {
        const text = typeof b.text === 'string' ? b.text : ''
        return { type: 'body', id: b.id, text }
      }
      const table = tables.find((t) => t.id === b.id)
      return table ? { type: 'table', table } : null
    })
    .filter(Boolean)
}
