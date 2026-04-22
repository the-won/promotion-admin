<template>
  <div class="privacy-section-editor">
    <div 
      v-for="(section, sIdx) in localSections" 
      :key="section.id" 
      class="section-card"
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
        <div class="form-group">
          <label>본문 텍스트</label>
          <textarea
            v-model="section.bodyText"
            placeholder="본문 내용 (줄바꿈 가능)"
            rows="3"
            class="form-textarea"
          ></textarea>
        </div>

        <!-- 목록 그룹 -->
        <div class="subsection">
          <div class="subsection-header">
            <label>목록 그룹 ({{ section.listGroups.length }}개)</label>
            <button @click="addListGroup(sIdx)" class="btn btn-success btn-xs">+ 목록 그룹</button>
          </div>

          <div v-for="(group, gIdx) in section.listGroups" :key="group.id || `group-${gIdx}`" class="list-group-card">
            <div class="subsection-header">
              <strong>그룹 {{ gIdx + 1 }} ({{ group.type }})</strong>
              <div class="list-actions">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs"
                  :class="{ 'btn-active': group.type === 'term-list2' }"
                  @click="setListType(sIdx, gIdx, 'term-list2')"
                >
                  term-list2
                </button>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs"
                  :class="{ 'btn-active': group.type === 'term-list' }"
                  @click="setListType(sIdx, gIdx, 'term-list')"
                >
                  term-list
                </button>
                <button @click="addListItem(sIdx, gIdx)" class="btn btn-success btn-xs">+ 항목</button>
                <button @click="removeListGroup(sIdx, gIdx)" class="btn btn-danger btn-xs">그룹 삭제</button>
              </div>
            </div>

            <div class="form-group">
              <label>그룹 앞 본문</label>
              <textarea
                v-model="group.preBodyText"
                rows="2"
                class="form-textarea"
                placeholder="이 그룹 리스트 앞에 들어갈 본문"
              ></textarea>
            </div>

            <div v-for="(item, iIdx) in group.items" :key="'li-'+gIdx+'-'+iIdx" class="list-item-row">
              <textarea
                :value="getListItemText(group.items[iIdx])"
                @input="updateListItemText(sIdx, gIdx, iIdx, $event.target.value)"
                rows="2"
                class="form-textarea flex-1"
                placeholder="목록 항목 내용"
              ></textarea>
              <button @click="removeListItem(sIdx, gIdx, iIdx)" class="btn btn-danger btn-xs btn-icon">✕</button>
            </div>

            <div
              v-for="(item, iIdx) in group.items"
              :key="'nested-'+gIdx+'-'+iIdx"
              class="nested-list-wrap"
            >
              <div class="nested-list-header">
                <span>하위 term-list ({{ getNestedChildren(item).length }}개)</span>
                <button @click="addNestedListItem(sIdx, gIdx, iIdx)" class="btn btn-ghost btn-xs">+ 하위 항목</button>
              </div>
              <div
                v-for="(child, cIdx) in getNestedChildren(item)"
                :key="'nested-item-'+gIdx+'-'+iIdx+'-'+cIdx"
                class="nested-list-row"
              >
                <textarea
                  :value="child"
                  @input="updateNestedListItem(sIdx, gIdx, iIdx, cIdx, $event.target.value)"
                  rows="2"
                  class="form-textarea flex-1"
                  placeholder="하위 항목 내용 (term-list)"
                ></textarea>
                <button @click="removeNestedListItem(sIdx, gIdx, iIdx, cIdx)" class="btn btn-danger btn-xs btn-icon">✕</button>
              </div>
            </div>

            <div class="form-group">
              <label>그룹 뒤 본문</label>
              <textarea
                v-model="group.postBodyText"
                rows="2"
                class="form-textarea"
                placeholder="이 그룹 리스트 뒤에 들어갈 본문"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 테이블 목록 -->
        <div class="subsection">
          <div class="subsection-header">
            <label>테이블 ({{ section.tables.length }}개)</label>
            <button @click="addTable(sIdx)" class="btn btn-success btn-xs">+ 테이블</button>
          </div>

          <div
            v-for="(table, tIdx) in section.tables"
            :key="table.id"
            class="table-card"
          >
            <div class="table-card-header" @click="toggleTableCollapse(sIdx, tIdx)">
              <span class="table-badge">T{{ tIdx + 1 }}</span>
              <input
                type="text"
                v-model="table.caption"
                placeholder="테이블 제목 (예: [필수] 개인정보 수집/이용)"
                class="caption-input"
                @click.stop
              />
              <span class="table-row-count">{{ table.rows.length }}행</span>
              <button @click.stop="removeTable(sIdx, tIdx)" class="btn btn-danger btn-xs">삭제</button>
              <span class="collapse-icon">{{ table._collapsed ? '▸' : '▾' }}</span>
            </div>
            <div v-show="!table._collapsed" class="table-card-body">

            <!-- 프리셋 선택 -->
            <div class="preset-row">
              <select v-model="table.preset" @change="applyPreset(sIdx, tIdx)" class="form-select">
                <option value="collect-3">수집/이용 3열</option>
                <option value="provide-4">제3자 제공 4열</option>
                <option value="consign-4">처리 위탁 4열</option>
                <option value="manager-3">담당자 정보 3열</option>
                <option value="behavior-kv">행태정보 (항목·내용)</option>
                <option value="custom">직접 설정</option>
              </select>
            </div>

            <!-- 커스텀 컬럼 -->
            <div v-if="table.preset === 'custom'" class="custom-columns-row">
              <input 
                type="text"
                :value="table.columns.join(', ')"
                @blur="updateColumns(sIdx, tIdx, $event.target.value)"
                placeholder="컬럼명을 쉼표로 구분"
                class="form-input"
              />
            </div>

            <!-- 컬럼 태그 -->
            <div class="column-tags">
              <span v-for="(col, ci) in table.columns" :key="ci" class="col-tag">{{ col }}</span>
            </div>

            <!-- 행 관리 -->
            <div class="table-rows">
              <div class="table-rows-header">
                <span>{{ table.rows.length }}개 행</span>
                <button @click="addRow(sIdx, tIdx)" class="btn btn-success btn-xs">+ 행</button>
              </div>

              <div 
                v-for="(row, rIdx) in table.rows" 
                :key="row.id" 
                class="row-card"
              >
                <div class="row-card-top">
                  <span class="row-num">{{ rIdx + 1 }}</span>
                  <div class="row-card-actions">
                    <button v-if="rIdx > 0" @click="moveRow(sIdx, tIdx, rIdx, -1)" class="btn btn-ghost btn-xs">↑</button>
                    <button v-if="rIdx < table.rows.length - 1" @click="moveRow(sIdx, tIdx, rIdx, 1)" class="btn btn-ghost btn-xs">↓</button>
                    <button @click="removeRow(sIdx, tIdx, rIdx)" class="btn btn-danger btn-xs">✕</button>
                  </div>
                </div>
                <div class="row-fields" :class="'cols-' + Math.min(table.columns.length, 4)">
                  <div v-for="(col, ci) in table.columns" :key="ci" class="row-field">
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

            <!-- 테이블 하단 메모 -->
            <div class="table-note-row">
              <input
                type="text"
                v-model="table.note"
                placeholder="하단 메모 (선택)"
                class="form-input form-input-sm"
              />
            </div>
            </div><!-- /v-show collapse -->
          </div>
        </div>
      </div>
    </div>

    <!-- 섹션 추가 -->
    <button @click="addSection" class="btn-add-section">+ 새 섹션 추가</button>
  </div>
</template>

<script>
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

function normalizeSection(section) {
  const listItems = Array.isArray(section && section.listItems) ? section.listItems : []
  const listGroups = Array.isArray(section && section.listGroups) && section.listGroups.length > 0
    ? section.listGroups.map((group) => ({
      id: group.id || uid('lgrp'),
      type: group.type || 'term-list2',
      items: Array.isArray(group.items) ? group.items : [],
      preBodyText: group.preBodyText || '',
      postBodyText: group.postBodyText || ''
    }))
    : [{
      id: uid('lgrp'),
      type: (section && section.listType) || 'term-list2',
      items: listItems,
      preBodyText: '',
      postBodyText: section && section.extraBodyText ? section.extraBodyText : ''
    }]
  return {
    ...section,
    bodyText: section && section.bodyText ? section.bodyText : '',
    listItems,
    listGroups,
    listType: (section && section.listType) || 'term-list2',
    extraBodyText: section && section.extraBodyText ? section.extraBodyText : '',
    subBlocks: Array.isArray(section && section.subBlocks) ? section.subBlocks : [],
    tables: Array.isArray(section && section.tables) ? section.tables : []
  }
}

export default {
  name: 'PrivacySectionEditor',
  props: {
    value: { type: Array, default: () => [] },
    sidebarExpanded: { type: Boolean, default: false }
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
    addSection() {
      this.localSections.push({
        id: uid('sec'),
        heading: '새 섹션',
        bodyText: '',
        tables: [],
        listItems: [],
        listGroups: [{
          id: uid('lgrp'),
          type: 'term-list2',
          items: []
        }],
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
      this.localSections[sIdx].listGroups.push({
        id: uid('lgrp'),
        type: 'term-list2',
        items: [],
        preBodyText: '',
        postBodyText: ''
      })
    },
    removeListGroup(sIdx, gIdx) {
      this.localSections[sIdx].listGroups.splice(gIdx, 1)
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
      this.localSections[sIdx].tables.push({
        id: uid('tbl'),
        caption: '',
        preset: 'collect-3',
        columns: [...PRESETS['collect-3']],
        rows: [{ id: uid('row'), cells: PRESETS['collect-3'].map(() => '') }],
        note: '',
        _collapsed: false
      })
    },
    removeTable(sIdx, tIdx) {
      this.localSections[sIdx].tables.splice(tIdx, 1)
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
  background: var(--color-bg-secondary, #0f1720);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.25);
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
  background: var(--color-bg-tertiary, #121a24);
  cursor: pointer;
  gap: 8px;
  user-select: none;
  border-bottom: 1px solid var(--color-border, #2c3440);
}

.section-card.is-selected .section-header {
  background: rgba(99, 102, 241, 0.12);
}

.section-header:hover {
  background: #1a2430;
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
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
  background: #6366f1;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-card.is-selected .section-badge {
  background: #4f46e5;
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
  color: var(--color-text, #e6edf3);
}

.heading-input:focus {
  outline: none;
  border-color: var(--color-primary, #6366f1);
  background: rgba(255, 255, 255, 0.06);
}

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
  margin: 6px 0 10px 0;
  padding: 8px;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
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
  background: #eef2ff;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}

.table-card-header:hover {
  background: #e0e7ff;
}

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
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  color: #1f2937;
}

.caption-input:focus {
  outline: none;
  border-color: #6366f1;
  background: #fff;
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
.btn-ghost:hover { background: #e5e7eb; }
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
</style>