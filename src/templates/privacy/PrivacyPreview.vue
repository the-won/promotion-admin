<template>
  <div class="privacy-preview">
    <!-- 제목 -->
    <div class="preview-title-area">
      <h1 class="preview-main-title">{{ data.title || '개인정보 처리방침' }}</h1>
      <p v-if="data.subtitle" class="preview-subtitle">{{ data.subtitle }}</p>
    </div>

    <!-- 목차 -->
    <div v-if="sections.length > 0" class="preview-toc">
      <ul>
        <li v-for="(section, idx) in sections" :key="'toc-'+section.id">
          <span class="toc-num">{{ idx + 1 }}.</span>
          <span>{{ section.heading }}</span>
        </li>
      </ul>
    </div>

    <!-- 안내문 -->
    <div v-if="data.introText" class="preview-intro" v-html="nl2br(data.introText)"></div>

    <!-- 섹션 렌더링 -->
    <div 
      v-for="(section, sIdx) in sections" 
      :key="section.id" 
      class="preview-section"
    >
      <h2 class="section-title">{{ sIdx + 1 }}. {{ section.heading }}</h2>

      <!-- 본문 -->
      <div v-if="section.bodyText" class="section-body" v-html="nl2br(section.bodyText)"></div>

      <!-- 테이블 -->
      <div v-for="table in section.tables" :key="table.id" class="preview-table-wrap">
        <p v-if="table.caption" class="table-caption" v-html="table.caption"></p>
        
        <!-- 행태정보 (key-value) 테이블 -->
        <table v-if="table.preset === 'behavior-kv'" class="preview-table kv-table">
          <tbody>
            <tr v-for="row in table.rows" :key="row.id">
              <th scope="col" v-html="nl2br(row.cells[0] || '')"></th>
              <td v-html="nl2br(row.cells[1] || '')"></td>
            </tr>
          </tbody>
        </table>

        <!-- 일반 테이블 -->
        <table v-else class="preview-table">
          <colgroup>
            <col v-for="(c, ci) in table.columns" :key="ci" :style="{ width: (100/table.columns.length) + '%' }">
          </colgroup>
          <thead>
            <tr>
              <th v-for="(col, ci) in table.columns" :key="ci" scope="col">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in table.rows" :key="row.id">
              <td v-for="(cell, ci) in row.cells" :key="ci" v-html="nl2br(cell)"></td>
            </tr>
          </tbody>
        </table>

        <p v-if="table.note" class="table-note-text">{{ table.note }}</p>
      </div>

      <!-- 목록 -->
      <ul v-if="section.listItems && section.listItems.length > 0" class="section-list">
        <li v-for="(item, iIdx) in section.listItems" :key="iIdx" v-html="nl2br(item)"></li>
      </ul>
    </div>

    <!-- 부칙 -->
    <div v-if="data.effectiveDate" class="preview-section">
      <h2 class="section-title">부칙</h2>
      <p>본 개인정보처리방침은 {{ data.effectiveDate }}부터 시행합니다.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPreview',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    sections() {
      return this.data.sections || []
    }
  },
  methods: {
    nl2br(text) {
      if (!text) return ''
      return text.replace(/\n/g, '<br>')
    }
  }
}
</script>

<style scoped>
.privacy-preview {
  width: 100%;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
  font-size: 14px;
  line-height: 1.7;
  color: #333;
}

.preview-title-area {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #333;
}

.preview-main-title {
  font-size: 22px;
  font-weight: 700;
  color: #111;
  margin: 0 0 8px;
}

.preview-subtitle {
  font-size: 14px;
  color: #dc2626;
  margin: 0;
}

/* 목차 */
.preview-toc {
  margin-bottom: 24px;
}

.preview-toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 20px;
}

.preview-toc li {
  font-size: 13px;
  color: #374151;
  padding: 3px 0;
}

.toc-num {
  font-weight: 700;
  color: #111;
  margin-right: 4px;
}

/* 안내문 */
.preview-intro {
  margin-bottom: 24px;
  padding: 16px;
  background: #f5f0e6;
  border: 1px solid #d4c9a8;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.8;
  color: #5d4e37;
}

/* 섹션 */
.preview-section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.section-body {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 16px;
}

.section-list {
  padding-left: 20px;
  margin: 0 0 16px;
}

.section-list li {
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.7;
}

/* 테이블 */
.preview-table-wrap {
  margin-bottom: 20px;
}

.table-caption {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 8px;
  color: #111;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-bottom: 8px;
}

.preview-table th {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 10px 12px;
  font-weight: 600;
  text-align: center;
  color: #111;
  vertical-align: middle;
}

.preview-table td {
  border: 1px solid #d1d5db;
  padding: 10px 12px;
  vertical-align: top;
  color: #374151;
}

/* key-value 테이블 (행태정보) */
.kv-table th {
  text-align: left;
  width: 30%;
  white-space: nowrap;
}

.table-note-text {
  font-size: 13px;
  color: #dc2626;
  font-weight: 600;
  margin: 4px 0 0;
}
</style>