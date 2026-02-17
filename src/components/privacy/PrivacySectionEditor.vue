<template>
  <div class="privacy-section-editor">
    <div 
      v-for="(section, sIdx) in localSections" 
      :key="section.id" 
      class="section-card"
      :class="{ 'section-collapsed': section._collapsed }"
    >
      <!-- 섹션 헤더 -->
      <div class="section-header" @click="toggleCollapse(sIdx)">
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

        <!-- 목록 항목 -->
        <div class="subsection">
          <div class="subsection-header">
            <label>목록 항목 ({{ section.listItems.length }}개)</label>
            <button @click="addListItem(sIdx)" class="btn btn-success btn-xs">+ 항목</button>
          </div>
          <div v-for="(item, iIdx) in section.listItems" :key="'li-'+iIdx" class="list-item-row">
            <textarea
              v-model="section.listItems[iIdx]"
              rows="2"
              class="form-textarea flex-1"
              placeholder="목록 항목 내용"
            ></textarea>
            <button @click="removeListItem(sIdx, iIdx)" class="btn btn-danger btn-xs btn-icon">✕</button>
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
            <div class="table-card-header">
              <input 
                type="text" 
                v-model="table.caption" 
                placeholder="테이블 제목 (예: [필수] 개인정보 수집/이용)"
                class="caption-input"
              />
              <button @click="removeTable(sIdx, tIdx)" class="btn btn-danger btn-xs">테이블 삭제</button>
            </div>

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

export default {
  name: 'PrivacySectionEditor',
  props: {
    value: { type: Array, default: () => [] },
    sidebarExpanded: { type: Boolean, default: false }
  },
  data() {
    return {
      localSections: []
    }
  },
  created() {
    this.localSections = this.value && this.value.length > 0
      ? JSON.parse(JSON.stringify(this.value)).map(s => ({ ...s, _collapsed: false }))
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
            ...JSON.parse(JSON.stringify(s)),
            _collapsed: this.localSections[i] ? this.localSections[i]._collapsed : false
          }))
        }
      },
      deep: true
    },
    localSections: {
      handler(val) {
        const cleaned = val.map(s => {
          const { _collapsed, ...rest } = s
          return rest
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
      this.$set(this.localSections[idx], '_collapsed', !this.localSections[idx]._collapsed)
    },
    addSection() {
      this.localSections.push({
        id: uid('sec'),
        heading: '새 섹션',
        bodyText: '',
        tables: [],
        listItems: [],
        _collapsed: false
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
    addListItem(sIdx) {
      this.localSections[sIdx].listItems.push('')
    },
    removeListItem(sIdx, iIdx) {
      this.localSections[sIdx].listItems.splice(iIdx, 1)
    },

    // ── 테이블 ──
    addTable(sIdx) {
      this.localSections[sIdx].tables.push({
        id: uid('tbl'),
        caption: '',
        preset: 'collect-3',
        columns: [...PRESETS['collect-3']],
        rows: [{ id: uid('row'), cells: PRESETS['collect-3'].map(() => '') }],
        note: ''
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
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafbfc;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #f3f4f6;
  cursor: pointer;
  gap: 8px;
  user-select: none;
}

.section-header:hover {
  background: #ebedf0;
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

.heading-input {
  flex: 1;
  min-width: 0;
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  color: #1f2937;
}

.heading-input:focus {
  outline: none;
  border-color: #6366f1;
  background: #fff;
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

/* ── 테이블 카드 ── */
.table-card {
  margin-bottom: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}

.table-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.caption-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.caption-input:focus {
  outline: none;
  border-color: #6366f1;
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