<template>
  <div class="privacy-section-editor">
    <div 
      v-for="(section, sIdx) in localSections" 
      :key="section.id" 
      class="section-card"
      :data-editor-section-index="sIdx"
      :class="{ 'section-collapsed': section._collapsed, 'is-selected': sIdx === selectedSectionIndex }"
    >
      <!-- 섹션 헤더 -->
      <div class="section-header" @click="toggleCollapse(sIdx); focusSection(sIdx)">
        <div class="section-header-left">
          <span class="section-badge">{{ sIdx + 1 }}</span>
          <input 
            type="text" 
            v-model="section.heading" 
            placeholder="섹션 제목"
            class="heading-input"
            @click.stop
          />
        </div>
        <div class="section-header-right">
          <button v-if="sIdx > 0" @click.stop="moveSection(sIdx, -1)" class="btn btn-ghost btn-xs" title="위로">↑</button>
          <button v-if="sIdx < localSections.length - 1" @click.stop="moveSection(sIdx, 1)" class="btn btn-ghost btn-xs" title="아래로">↓</button>
          <button @click.stop="removeSection(sIdx)" class="btn btn-danger btn-xs">삭제</button>
          <span class="collapse-icon">{{ section._collapsed ? '▸' : '▾' }}</span>
        </div>
      </div>

      <!-- 섹션 본문 (펼침 상태) -->
      <div v-show="!section._collapsed" class="section-body">
        
        <!-- 본문 텍스트 -->
        <div class="form-group" data-editor-part="bodyText">
          <label>본문 텍스트</label>
          <textarea
            v-model="section.bodyText"
            placeholder="본문 내용 (줄바꿈 가능)"
            rows="3"
            class="form-textarea"
          ></textarea>
        </div>

        <!-- 목록 그룹 · 테이블 (contentBlocks 순서) -->
        <div class="subsection">
          <div class="subsection-header subsection-header-with-hint">
            <div>
              <label>본문 아래 구성</label>
              <p class="subsection-hint">
                목록 그룹, 테이블, 본문 블록을 섞어 배치할 수 있습니다. 「본문 블록」은 목록과 목록 사이 등 원하는 위치에 둘 수 있습니다. 각 블록의 「위로/아래로」로 표시 순서를 바꿉니다.
              </p>
            </div>
            <div class="subsection-actions-inline">
              <button type="button" @click="addListGroup(sIdx)" class="btn btn-success btn-xs">+ 목록 그룹</button>
              <button type="button" @click="addTable(sIdx)" class="btn btn-success btn-xs">+ 테이블</button>
              <button type="button" @click="addBodyBlock(sIdx)" class="btn btn-success btn-xs">+ 본문 블록</button>
            </div>
          </div>

          <div
            v-for="(block, bIdx) in (section.contentBlocks || [])"
            :key="'cb-' + block.type + '-' + (block.id || bIdx)"
            class="content-block-wrap"
            :data-editor-cb-type="block.type"
            :data-editor-cb-id="block.id || ''"
          >
            <div class="content-block-chrome" @click.stop>
              <span class="content-block-kind">{{
                block.type === 'listGroup' ? '목록 그룹' : block.type === 'table' ? '테이블' : '본문 블록'
              }}</span>
              <span class="content-block-order">표시 순서 {{ bIdx + 1 }}</span>
              <button
                type="button"
                class="btn btn-ghost btn-xs"
                :disabled="bIdx === 0"
                @click="moveContentBlock(sIdx, bIdx, -1)"
              >위로</button>
              <button
                type="button"
                class="btn btn-ghost btn-xs"
                :disabled="bIdx >= (section.contentBlocks || []).length - 1"
                @click="moveContentBlock(sIdx, bIdx, 1)"
              >아래로</button>
              <button
                v-if="block.type === 'body'"
                type="button"
                class="btn btn-danger btn-xs"
                @click="removeBodyBlock(sIdx, bIdx)"
              >삭제</button>
            </div>

            <!-- 목록 그룹 카드 -->
            <div
              v-if="block.type === 'listGroup' && listGroupIndex(sIdx, block.id) >= 0"
              class="list-group-card"
            >
              <div class="subsection-header">
                <strong>그룹 {{ listGroupIndex(sIdx, block.id) + 1 }} ({{ section.listGroups[listGroupIndex(sIdx, block.id)].type }})</strong>
                <div class="list-actions">
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs"
                    :class="{ 'btn-active': section.listGroups[listGroupIndex(sIdx, block.id)].type === 'term-list2' }"
                    @click="setListType(sIdx, listGroupIndex(sIdx, block.id), 'term-list2')"
                  >term-list2</button>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs"
                    :class="{ 'btn-active': section.listGroups[listGroupIndex(sIdx, block.id)].type === 'term-list' }"
                    @click="setListType(sIdx, listGroupIndex(sIdx, block.id), 'term-list')"
                  >term-list</button>
                  <button type="button" @click="addListItem(sIdx, listGroupIndex(sIdx, block.id))" class="btn btn-success btn-xs">+ 항목</button>
                  <button type="button" @click="removeListGroup(sIdx, listGroupIndex(sIdx, block.id))" class="btn btn-danger btn-xs">그룹 삭제</button>
                </div>
              </div>

              <div
                v-for="(item, iIdx) in section.listGroups[listGroupIndex(sIdx, block.id)].items"
                :key="'item-block-' + block.id + '-' + iIdx"
                class="list-item-block"
              >
                <div class="list-item-label-row">
                  <span class="list-item-num">항목 {{ iIdx + 1 }}</span>
                </div>
                <div class="list-item-row">
                  <textarea
                    :value="getListItemText(section.listGroups[listGroupIndex(sIdx, block.id)].items[iIdx])"
                    @input="updateListItemText(sIdx, listGroupIndex(sIdx, block.id), iIdx, $event.target.value)"
                    rows="2"
                    class="form-textarea flex-1"
                    placeholder="목록 항목 내용"
                  ></textarea>
                  <button type="button" @click="removeListItem(sIdx, listGroupIndex(sIdx, block.id), iIdx)" class="btn btn-danger btn-xs btn-icon">✕</button>
                </div>
                <div class="nested-list-wrap">
                  <div class="nested-list-header">
                    <span>항목 {{ iIdx + 1 }} 하위 목록 ({{ getNestedChildren(item).length }}개)</span>
                    <button type="button" @click="addNestedListItem(sIdx, listGroupIndex(sIdx, block.id), iIdx)" class="btn btn-ghost btn-xs">+ 하위 항목</button>
                  </div>
                  <div
                    v-for="(child, cIdx) in getNestedChildren(item)"
                    :key="'nested-item-' + block.id + '-' + iIdx + '-' + cIdx"
                    class="nested-list-row"
                  >
                    <textarea
                      :value="child"
                      @input="updateNestedListItem(sIdx, listGroupIndex(sIdx, block.id), iIdx, cIdx, $event.target.value)"
                      rows="2"
                      class="form-textarea flex-1"
                      placeholder="하위 항목 내용 (term-list)"
                    ></textarea>
                    <button type="button" @click="removeNestedListItem(sIdx, listGroupIndex(sIdx, block.id), iIdx, cIdx)" class="btn btn-danger btn-xs btn-icon">✕</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 테이블 카드 -->
            <div
              v-else-if="block.type === 'table' && tableIndex(sIdx, block.id) >= 0"
              class="table-card"
            >
              <div class="table-card-header" @click="toggleTableCollapse(sIdx, tableIndex(sIdx, block.id))">
                <span class="table-badge">T{{ tableIndex(sIdx, block.id) + 1 }}</span>
                <input
                  type="text"
                  v-model="section.tables[tableIndex(sIdx, block.id)].caption"
                  placeholder="테이블 제목 (예: [필수] 개인정보 수집/이용)"
                  class="caption-input"
                  @click.stop
                />
                <span class="table-row-count">{{ section.tables[tableIndex(sIdx, block.id)].rows.length }}행</span>
                <div class="table-header-actions" @click.stop>
                  <button type="button" @click="removeTable(sIdx, tableIndex(sIdx, block.id))" class="btn btn-danger btn-xs">삭제</button>
                </div>
                <span class="collapse-icon">{{ section.tables[tableIndex(sIdx, block.id)]._collapsed ? '▸' : '▾' }}</span>
              </div>
              <div v-show="!section.tables[tableIndex(sIdx, block.id)]._collapsed" class="table-card-body">

                <div class="preset-row">
                  <select v-model="section.tables[tableIndex(sIdx, block.id)].preset" @change="applyPreset(sIdx, tableIndex(sIdx, block.id))" class="form-select">
                    <option value="collect-3">수집/이용 3열</option>
                    <option value="provide-4">제3자 제공 4열</option>
                    <option value="consign-4">처리 위탁 4열</option>
                    <option value="manager-3">담당자 정보 3열</option>
                    <option value="behavior-kv">행태정보 (항목·내용)</option>
                    <option value="custom">직접 설정</option>
                  </select>
                </div>

                <div v-if="section.tables[tableIndex(sIdx, block.id)].preset === 'custom'" class="custom-columns-row">
                  <input
                    type="text"
                    :value="section.tables[tableIndex(sIdx, block.id)].columns.join(', ')"
                    @blur="updateColumns(sIdx, tableIndex(sIdx, block.id), $event.target.value)"
                    placeholder="컬럼명을 쉼표로 구분"
                    class="form-input"
                  />
                </div>

                <div class="column-tags">
                  <span v-for="(col, ci) in section.tables[tableIndex(sIdx, block.id)].columns" :key="ci" class="col-tag">{{ col }}</span>
                </div>

                <div class="table-rows">
                  <div class="table-rows-header">
                    <span>{{ section.tables[tableIndex(sIdx, block.id)].rows.length }}개 행</span>
                    <button type="button" @click="addRow(sIdx, tableIndex(sIdx, block.id))" class="btn btn-success btn-xs">+ 행</button>
                  </div>

                  <div
                    v-for="(row, rIdx) in section.tables[tableIndex(sIdx, block.id)].rows"
                    :key="row.id"
                    class="row-card"
                    :data-editor-row-index="rIdx"
                  >
                    <div class="row-card-top">
                      <span class="row-num">{{ rIdx + 1 }}</span>
                      <div class="row-card-actions" title="표 안의 행 순서만 변경">
                        <button
                          v-if="rIdx > 0"
                          type="button"
                          title="행 위로"
                          @click="moveRow(sIdx, tableIndex(sIdx, block.id), rIdx, -1)"
                          class="btn btn-ghost btn-xs"
                        >↑</button>
                        <button
                          v-if="rIdx < section.tables[tableIndex(sIdx, block.id)].rows.length - 1"
                          type="button"
                          title="행 아래로"
                          @click="moveRow(sIdx, tableIndex(sIdx, block.id), rIdx, 1)"
                          class="btn btn-ghost btn-xs"
                        >↓</button>
                        <button type="button" @click="removeRow(sIdx, tableIndex(sIdx, block.id), rIdx)" class="btn btn-danger btn-xs">✕</button>
                      </div>
                    </div>
                    <div class="row-fields" :class="'cols-' + Math.min(section.tables[tableIndex(sIdx, block.id)].columns.length, 4)">
                      <div
                        v-for="(col, ci) in section.tables[tableIndex(sIdx, block.id)].columns"
                        :key="ci"
                        class="row-field"
                        :data-editor-col-index="ci"
                      >
                        <label>{{ col }}</label>
                        <textarea
                          v-model="row.cells[ci]"
                          rows="2"
                          class="form-textarea"
                          :placeholder="col"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="table-note-row" data-editor-part="tableNote">
                  <input
                    type="text"
                    v-model="section.tables[tableIndex(sIdx, block.id)].note"
                    placeholder="하단 메모 (선택)"
                    class="form-input form-input-sm"
                  />
                </div>
              </div>
            </div>

            <div v-else-if="block.type === 'body'" class="body-content-block">
              <textarea
                v-model="block.text"
                rows="3"
                class="form-textarea"
                placeholder="이 위치에 표시할 본문 (줄바꿈 가능)"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="form-group post-after-tables" data-editor-part="postBody">
          <label>맨 아래 추가 본문 (구성 전체 이후)</label>
          <textarea
            v-model="section.postBodyText"
            rows="2"
            class="form-textarea"
            placeholder="목록·테이블·본문 블록 전부 다음에 이어질 문단"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- 섹션 추가 -->
    <button @click="addSection" class="btn-add-section">+ 새 섹션 추가</button>
  </div>
</template>

<script>
import { buildSectionContentBlocks } from '../../utils/privacySectionContentBlocks.js'

const PRESETS = {
  'collect-3': ['수집항목', '이용목적', '보유기간'],
  'provide-4': ['제공받는자', '제공항목', '제공목적', '보유기간'],
  'consign-4': ['위탁받는 자', '위탁업무 내용', '재수탁업체', '재위탁 업무내용'],
  'manager-3': ['개인정보보호 최고책임자', '개인정보보호 관리담당자', '개인정보보호 사업담당자'],
  'behavior-kv': ['항목', '내용'],
  'custom': ['컬럼1', '컬럼2', '컬럼3']
}

let _uid = 0
function uid(prefix) {
  return prefix + '_' + Date.now() + '_' + (++_uid)
}

/** 목록 그룹 이후 본문: 섹션.postBodyText 우선, 없으면 그룹·extraBodyText(레거시)에서 합침 */
function migrateSectionPostBodyText(section, rawGroups) {
  const explicit = section && section.postBodyText
  if (explicit) return explicit
  const parts = []
  if (Array.isArray(rawGroups)) {
    rawGroups.forEach((g) => {
      if (g && g.postBodyText) parts.push(g.postBodyText)
    })
  }
  if (section && section.extraBodyText) parts.push(section.extraBodyText)
  return parts.join('\n\n')
}

function normalizeSection(section) {
  const listItems = Array.isArray(section && section.listItems) ? section.listItems : []
  const rawGroups = Array.isArray(section && section.listGroups) ? section.listGroups : []
  const postBodyText = migrateSectionPostBodyText(section, rawGroups)
  const listGroups = rawGroups.length > 0
    ? rawGroups.map((group) => ({
      id: group.id || uid('lgrp'),
      type: group.type || 'term-list2',
      items: Array.isArray(group.items) ? group.items : []
    }))
    : [{
      id: uid('lgrp'),
      type: (section && section.listType) || 'term-list2',
      items: listItems
    }]
  const tablesRaw = Array.isArray(section && section.tables) ? section.tables : []
  const tables = tablesRaw.map((t) => ({
    ...t,
    id: t.id || uid('tbl')
  }))
  const contentBlocks = buildSectionContentBlocks(section, listGroups, tables)
  return {
    ...section,
    bodyText: section && section.bodyText ? section.bodyText : '',
    postBodyText,
    listItems,
    listGroups,
    listType: (section && section.listType) || 'term-list2',
    extraBodyText: '',
    subBlocks: Array.isArray(section && section.subBlocks) ? section.subBlocks : [],
    tables,
    contentBlocks
  }
}

export default {
  name: 'PrivacySectionEditor',
  props: {
    value: { type: Array, default: () => [] },
    sidebarExpanded: { type: Boolean, default: false },
    privacyPreviewFocus: { type: Object, default: null }
  },
  data() {
    return {
      localSections: [],
      selectedSectionIndex: null
    }
  },
  created() {
    this.localSections = this.value && this.value.length > 0
      ? JSON.parse(JSON.stringify(this.value)).map(s => ({ ...normalizeSection(s), _collapsed: true }))
      : []
  },
  watch: {
    value: {
      handler(newVal) {
        const cleaned = (this.localSections || []).map(s => {
          const { _collapsed, ...rest } = s
          return rest
        })
        if (JSON.stringify(newVal) !== JSON.stringify(cleaned)) {
          this.localSections = (newVal || []).map((s, i) => ({
            ...normalizeSection(JSON.parse(JSON.stringify(s))),
            _collapsed: this.localSections[i] ? this.localSections[i]._collapsed : true
          }))
        }
      },
      deep: true
    },
    localSections: {
      handler(val) {
        const cleaned = val.map(s => {
          const { _collapsed, ...rest } = s
          return {
            ...rest,
            tables: (rest.tables || []).map(t => {
              const { _collapsed: _tc, ...tRest } = t
              return tRest
            })
          }
        })
        if (JSON.stringify(cleaned) !== JSON.stringify(this.value)) {
          this.$emit('input', JSON.parse(JSON.stringify(cleaned)))
        }
      },
      deep: true
    },
    privacyPreviewFocus: {
      handler(v) {
        if (!v || v.formField) return
        this.applyPrivacyPreviewFocus(v)
      },
      deep: true
    }
  },
  methods: {
    // ── 섹션 ──
    toggleCollapse(idx) {
      const willExpand = this.localSections[idx]._collapsed
      this.$set(this.localSections[idx], '_collapsed', !this.localSections[idx]._collapsed)
      if (willExpand) {
        this.$emit('active-section', idx)
      }
    },
    focusSection(idx) {
      this.selectedSectionIndex = idx
      this.$emit('active-section', idx)
    },
    flashEditorTarget(el) {
      if (!el) return
      el.classList.add('privacy-editor-flash')
      setTimeout(() => el.classList.remove('privacy-editor-flash'), 1600)
    },
    applyPrivacyPreviewFocus(v) {
      if (typeof v.sectionIndex !== 'number') return
      const sIdx = v.sectionIndex
      if (sIdx < 0 || sIdx >= this.localSections.length) return
      this.$set(this.localSections[sIdx], '_collapsed', false)
      this.selectedSectionIndex = sIdx
      this.$emit('active-section', sIdx)
      this.$nextTick(() => {
        const root = this.$el
        if (!root) return
        const card = root.querySelector(`[data-editor-section-index="${sIdx}"]`)
        if (!card) return
        let target = null
        const part = v.part
        const bid = v.blockId
        if (part === 'heading') {
          target = card.querySelector('.section-header .heading-input')
        } else if (part === 'bodyText') {
          target = card.querySelector('[data-editor-part="bodyText"] textarea')
        } else if (part === 'postBody') {
          target = card.querySelector('[data-editor-part="postBody"] textarea')
        } else if (part === 'listGroup' && bid) {
          target = card.querySelector(`[data-editor-cb-type="listGroup"][data-editor-cb-id="${bid}"]`)
        } else if (part === 'tableNote' && bid) {
          const tableWrap = card.querySelector(`[data-editor-cb-type="table"][data-editor-cb-id="${bid}"]`)
          target = tableWrap && tableWrap.querySelector('[data-editor-part="tableNote"] input')
        } else if (part === 'table' && bid) {
          const tableWrap = card.querySelector(`[data-editor-cb-type="table"][data-editor-cb-id="${bid}"]`)
          if (tableWrap && typeof v.columnIndex === 'number') {
            const rowIdx = typeof v.rowIndex === 'number' && v.rowIndex >= 0 ? v.rowIndex : 0
            let colTa = tableWrap.querySelector(
              `.row-card[data-editor-row-index="${rowIdx}"] .row-field[data-editor-col-index="${v.columnIndex}"] textarea`
            )
            if (!colTa) {
              colTa = tableWrap.querySelector(
                `.row-card .row-field[data-editor-col-index="${v.columnIndex}"] textarea`
              )
            }
            target = colTa || tableWrap
          } else {
            target = tableWrap
          }
        } else if (part === 'streamBody' && bid) {
          target = card.querySelector(`[data-editor-cb-type="body"][data-editor-cb-id="${bid}"]`)
        } else if (part === 'subBlock') {
          target = card
        }
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' })
          let focusEl = null
          if (target.matches && target.matches('input, textarea')) focusEl = target
          else focusEl = target.querySelector('textarea, input, .caption-input')
          if (focusEl && focusEl.focus) focusEl.focus()
          let flashEl = null
          if (part === 'subBlock') flashEl = card
          else if (part === 'heading') flashEl = card.querySelector('.section-header')
          else if (part === 'table' && focusEl && focusEl.closest) {
            flashEl = focusEl.closest('.row-card') || focusEl.closest('.row-field')
          } else if (part === 'tableNote' && focusEl && focusEl.closest) {
            flashEl = focusEl.closest('[data-editor-part="tableNote"]') || focusEl
          } else {
            flashEl = (target.closest && target.closest('.content-block-wrap')) ||
              (target.closest && target.closest('[data-editor-part]')) ||
              target
          }
          this.flashEditorTarget(flashEl || target)
        }
      })
    },
    addSection() {
      const gid = uid('lgrp')
      this.localSections.push({
        id: uid('sec'),
        heading: '새 섹션',
        bodyText: '',
        postBodyText: '',
        tables: [],
        listItems: [],
        listGroups: [{
          id: gid,
          type: 'term-list2',
          items: []
        }],
        contentBlocks: [{ type: 'listGroup', id: gid }],
        listType: 'term-list2',
        extraBodyText: '',
        subBlocks: [],
        _collapsed: true
      })
    },
    removeSection(idx) {
      this.localSections.splice(idx, 1)
    },
    moveSection(idx, dir) {
      const target = idx + dir
      if (target < 0 || target >= this.localSections.length) return
      const temp = this.localSections[idx]
      this.$set(this.localSections, idx, this.localSections[target])
      this.$set(this.localSections, target, temp)
    },

    // ── 목록 ──
    addListGroup(sIdx) {
      const sec = this.localSections[sIdx]
      const id = uid('lgrp')
      sec.listGroups.push({
        id,
        type: 'term-list2',
        items: []
      })
      if (!Array.isArray(sec.contentBlocks)) this.$set(sec, 'contentBlocks', [])
      sec.contentBlocks.push({ type: 'listGroup', id })
    },
    removeListGroup(sIdx, gIdx) {
      const sec = this.localSections[sIdx]
      const removed = sec.listGroups[gIdx]
      sec.listGroups.splice(gIdx, 1)
      if (removed && removed.id) {
        sec.contentBlocks = (sec.contentBlocks || []).filter(
          (b) => !(b.type === 'listGroup' && b.id === removed.id)
        )
      }
    },
    listGroupIndex(sIdx, groupId) {
      return this.localSections[sIdx].listGroups.findIndex((g) => g.id === groupId)
    },
    tableIndex(sIdx, tableId) {
      return this.localSections[sIdx].tables.findIndex((t) => t.id === tableId)
    },
    moveContentBlock(sIdx, bIdx, dir) {
      const blocks = this.localSections[sIdx].contentBlocks
      if (!Array.isArray(blocks) || blocks.length < 2) return
      const target = bIdx + dir
      if (target < 0 || target >= blocks.length) return
      const temp = blocks[bIdx]
      this.$set(blocks, bIdx, blocks[target])
      this.$set(blocks, target, temp)
    },
    addListItem(sIdx, gIdx) {
      this.localSections[sIdx].listGroups[gIdx].items.push('')
    },
    removeListItem(sIdx, gIdx, iIdx) {
      this.localSections[sIdx].listGroups[gIdx].items.splice(iIdx, 1)
    },
    setListType(sIdx, gIdx, listType) {
      this.$set(this.localSections[sIdx].listGroups[gIdx], 'type', listType)
    },
    getListItemText(item) {
      return typeof item === 'string' ? item : (item && item.text) || ''
    },
    getNestedChildren(item) {
      if (!item || typeof item === 'string') return []
      return Array.isArray(item.children) ? item.children : []
    },
    updateListItemText(sIdx, gIdx, iIdx, text) {
      const current = this.localSections[sIdx].listGroups[gIdx].items[iIdx]
      if (typeof current === 'string') {
        this.$set(this.localSections[sIdx].listGroups[gIdx].items, iIdx, text)
        return
      }
      this.$set(this.localSections[sIdx].listGroups[gIdx].items, iIdx, {
        ...(current || {}),
        text
      })
    },
    addNestedListItem(sIdx, gIdx, iIdx) {
      const current = this.localSections[sIdx].listGroups[gIdx].items[iIdx]
      const normalized = typeof current === 'string'
        ? { text: current, children: [] }
        : { ...(current || {}), children: Array.isArray(current && current.children) ? current.children : [] }
      normalized.children.push('')
      this.$set(this.localSections[sIdx].listGroups[gIdx].items, iIdx, normalized)
    },
    updateNestedListItem(sIdx, gIdx, iIdx, cIdx, text) {
      const current = this.localSections[sIdx].listGroups[gIdx].items[iIdx]
      const normalized = typeof current === 'string'
        ? { text: current, children: [] }
        : { ...(current || {}), children: Array.isArray(current && current.children) ? [...current.children] : [] }
      normalized.children[cIdx] = text
      this.$set(this.localSections[sIdx].listGroups[gIdx].items, iIdx, normalized)
    },
    removeNestedListItem(sIdx, gIdx, iIdx, cIdx) {
      const current = this.localSections[sIdx].listGroups[gIdx].items[iIdx]
      if (typeof current === 'string') return
      const children = Array.isArray(current.children) ? [...current.children] : []
      children.splice(cIdx, 1)
      this.$set(this.localSections[sIdx].listGroups[gIdx].items, iIdx, {
        ...current,
        children
      })
    },
    // ── 테이블 ──
    toggleTableCollapse(sIdx, tIdx) {
      const table = this.localSections[sIdx].tables[tIdx]
      this.$set(table, '_collapsed', !table._collapsed)
    },
    addTable(sIdx) {
      const sec = this.localSections[sIdx]
      const id = uid('tbl')
      sec.tables.push({
        id,
        caption: '',
        preset: 'collect-3',
        columns: [...PRESETS['collect-3']],
        rows: [{ id: uid('row'), cells: PRESETS['collect-3'].map(() => '') }],
        note: '',
        _collapsed: false
      })
      if (!Array.isArray(sec.contentBlocks)) this.$set(sec, 'contentBlocks', [])
      sec.contentBlocks.push({ type: 'table', id })
    },
    removeTable(sIdx, tIdx) {
      const sec = this.localSections[sIdx]
      const removed = sec.tables[tIdx]
      sec.tables.splice(tIdx, 1)
      if (removed && removed.id) {
        sec.contentBlocks = (sec.contentBlocks || []).filter(
          (b) => !(b.type === 'table' && b.id === removed.id)
        )
      }
    },
    addBodyBlock(sIdx) {
      const sec = this.localSections[sIdx]
      if (!Array.isArray(sec.contentBlocks)) this.$set(sec, 'contentBlocks', [])
      sec.contentBlocks.push({ type: 'body', id: uid('cbody'), text: '' })
    },
    removeBodyBlock(sIdx, bIdx) {
      const sec = this.localSections[sIdx]
      const blocks = sec.contentBlocks
      if (!Array.isArray(blocks) || bIdx < 0 || bIdx >= blocks.length) return
      if (blocks[bIdx].type !== 'body') return
      blocks.splice(bIdx, 1)
    },
    applyPreset(sIdx, tIdx) {
      const table = this.localSections[sIdx].tables[tIdx]
      const cols = PRESETS[table.preset] || PRESETS['custom']
      const newCount = cols.length
      table.columns = [...cols]
      table.rows.forEach(row => {
        while (row.cells.length < newCount) row.cells.push('')
        if (row.cells.length > newCount) row.cells = row.cells.slice(0, newCount)
      })
    },
    updateColumns(sIdx, tIdx, val) {
      const cols = val.split(',').map(s => s.trim()).filter(Boolean)
      if (!cols.length) return
      const table = this.localSections[sIdx].tables[tIdx]
      table.columns = cols
      table.rows.forEach(row => {
        while (row.cells.length < cols.length) row.cells.push('')
        if (row.cells.length > cols.length) row.cells = row.cells.slice(0, cols.length)
      })
    },

    // ── 행 ──
    addRow(sIdx, tIdx) {
      const table = this.localSections[sIdx].tables[tIdx]
      table.rows.push({ id: uid('row'), cells: table.columns.map(() => '') })
    },
    removeRow(sIdx, tIdx, rIdx) {
      this.localSections[sIdx].tables[tIdx].rows.splice(rIdx, 1)
    },
    moveRow(sIdx, tIdx, rIdx, dir) {
      const rows = this.localSections[sIdx].tables[tIdx].rows
      const target = rIdx + dir
      if (target < 0 || target >= rows.length) return
      const temp = rows[rIdx]
      this.$set(rows, rIdx, rows[target])
      this.$set(rows, target, temp)
    }
  }
}
</script>

<style scoped>
.privacy-section-editor {
  width: 100%;
}

/* ── 섹션 카드 ── */
.section-card {
  margin-bottom: 14px;
  border: 1px solid var(--color-border, #2c3440);
  border-radius: 12px;
  background: #0f1720;
  overflow: hidden;
  /* box-shadow: 0 1px 3px rgba(0,0,0,0.25); */
}

.section-card.is-selected {
  border-left: 3px solid #6366f1;
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.35), 0 4px 14px rgba(0, 0, 0, 0.32);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: #121a24;
  cursor: pointer;
  gap: 8px;
  user-select: none;
  margin-bottom: 0;
  /* border-bottom: 1px solid var(--color-border, #2c3440); */
}

.section-card.is-selected .section-header {
  background: rgba(99, 102, 241, 0.12);
}

/* .section-header:hover {
  background: #1a2430;
} */

.section-header-left {
  display: flex;
  align-items: center;
  /* gap: 8px; */
  flex: 1;
  min-width: 0;
}

.section-header-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.section-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  /* background: #6366f1; */
  /* background: #0f1720; */
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-card.is-selected .section-badge {
  /* background: #4f46e5; */
  /* background: #0f1720; */
}

.heading-input {
  flex: 1;
  min-width: 0;
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  color: #e6edf3;
}
.heading-input:hover,
.heading-input:focus {
  border-color: rgba(255, 255, 255, 0.2);;
  color: inherit;
}

/* .heading-input:focus {
  outline: none;
  border-color: var(--color-primary, #6366f1);
  background: rgba(255, 255, 255, 0.06);
} */

.collapse-icon {
  font-size: 14px;
  color: #9ca3af;
  margin-left: 4px;
}

/* ── 섹션 본문 ── */
.section-body {
  padding: 14px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group > label,
.subsection > .subsection-header > label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.form-textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  min-height: 44px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99,102,241,0.1);
}

.form-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99,102,241,0.1);
}

.form-input-sm {
  padding: 6px 10px;
  font-size: 12px;
}

.form-select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  background: #fff;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: #6366f1;
}

/* ── 서브 섹션 ── */
.subsection {
  margin-bottom: 14px;
}

.subsection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.subsection-header-with-hint {
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
}

.subsection-hint {
  margin: 3px 0 0;
  font-size: 11px;
  color: #6b7280;
  line-height: 1.35;
  max-width: 440px;
}

.list-group-card > .list-item-block:not(:last-child) {
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.list-group-card > .list-item-block:last-child {
  margin-bottom: 4px;
}

.list-item-label-row {
  margin-bottom: 4px;
}

.list-item-num {
  font-size: 11px;
  font-weight: 700;
  color: #4b5563;
  letter-spacing: 0.02em;
}

.list-item-row {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
  align-items: flex-start;
}

.list-item-row .flex-1 {
  flex: 1;
}

.list-actions {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-wrap: wrap;
}

.list-group-card {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #dbe1ea;
  border-radius: 8px;
}

.nested-list-wrap {
  margin: 0 0 0 8px;
  padding: 8px;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
  /* background: #fafafa; */
}

.nested-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
}

.nested-list-row {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.btn-active {
  background: #4f46e5;
  color: #fff;
  border: 1px solid #312e81;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

/* ── 테이블 카드 ── */
.table-card {
  margin-bottom: 10px;
  border: 1px solid #c7d2fe;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

.table-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  /* background: #eef2ff; */
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}

.table-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.subsection-actions-inline {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.content-block-wrap {
  margin-bottom: 12px;
  padding: 8px 10px;
  border: 1px solid #6b7280;
  border-radius: 10px;
  /* background: #f8fafc; */
}

.content-block-chrome {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.content-block-kind {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
}

.content-block-order {
  font-size: 11px;
  color: #94a3b8;
  margin-right: auto;
}

.post-after-tables {
  margin-top: 4px;
}

/* .table-card-header:hover {
  background: #e0e7ff;
} */

.table-badge {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: #6366f1;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.table-row-count {
  font-size: 11px;
  color: #6366f1;
  font-weight: 600;
  background: #e0e7ff;
  padding: 2px 7px;
  border-radius: 10px;
  white-space: nowrap;
}

.caption-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: transparent;
  color: #fff;
}
.caption-input:hover,
.caption-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.2);
  color: inherit;
}

.table-card-body {
  padding: 12px;
}

.preset-row {
  margin-bottom: 8px;
}

.custom-columns-row {
  margin-bottom: 8px;
}

.column-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
}

.col-tag {
  padding: 3px 8px;
  background: #eef2ff;
  color: #4338ca;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

/* ── 행 카드 ── */
.table-rows-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
}

.row-card {
  margin-bottom: 8px;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fafbfc;
}

.row-card:hover {
  border-color: #d1d5db;
}

.row-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.row-num {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
}

.row-card-actions {
  display: flex;
  gap: 3px;
}

.row-fields {
  display: grid;
  gap: 8px;
}

.row-fields.cols-1 { grid-template-columns: 1fr; }
.row-fields.cols-2 { grid-template-columns: 1fr 1fr; }
.row-fields.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
.row-fields.cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }

.row-field > label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 2px;
}

.table-note-row {
  margin-top: 8px;
}

/* ── 버튼 ── */
.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-success { background: #10b981; color: #fff; }
.btn-success:hover { background: #059669; }
.btn-danger { background: #ef4444; color: #fff; }
.btn-danger:hover { background: #dc2626; }
.btn-ghost { background: #f3f4f6; color: #374151; }
.btn-ghost:hover:not(:disabled) { background: #e5e7eb; }
.btn-ghost:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.btn-xs { padding: 3px 8px; font-size: 11px; }
.btn-icon { width: 28px; padding: 3px 0; text-align: center; }

.btn-add-section {
  display: block;
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  border: 2px dashed #d1d5db;
  background: transparent;
  color: #6366f1;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-section:hover {
  background: rgba(99,102,241,0.05);
  border-color: #6366f1;
}

.privacy-editor-flash {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
  animation: privacyEditorFlash 1.5s ease;
}
@keyframes privacyEditorFlash {
  from { outline-color: #6366f1; }
  to { outline-color: transparent; }
}
</style>