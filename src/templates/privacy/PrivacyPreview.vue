<template>
  <div class="term_page">
    <!-- 제목 -->
    <div class="term_page_tit_area">
      <h1 class="tit pointRe">{{ data.title || '개인정보 처리방침' }}</h1>
      <p v-if="data.subtitle" class="tit_date">{{ data.subtitle }}</p>
    </div>

    <!-- 목차 -->
    <div v-if="sections.length > 0" class="terms_list2">
      <div class="tit_list">
        <ul>
          <li v-for="(section, idx) in sections" :key="'toc-'+section.id">
            <span class="toc-num">{{ idx + 1 }}.</span>
            <a :href="'#' + sectionAnchorId(idx)">{{ section.heading }}</a>
          </li>
        </ul>
      </div>

      <!-- 안내문 -->
      <div v-if="data.introText" class="brownBox" v-html="nl2br(data.introText)"></div>
    </div>

    

    <!-- 섹션 렌더링 -->
    <div class="agree_box proConBox">
      <div class="privacy-terms">
        <div class="terms-contents">
          <div
            v-for="(section, sIdx) in sections"
            :key="section.id"
            :ref="'section-' + sIdx"
            :id="sectionAnchorId(sIdx)"
            class="box"
            :class="{ 'is-active-section': sIdx === activeIndex }"
          >
            <h2 class="tit">{{ sIdx + 1 }}. {{ section.heading }}</h2>

            <!-- 본문 -->
            <p v-if="section.bodyText" class="section-body" v-html="nl2br(section.bodyText)"></p>

            <template v-for="(piece, pi) in sectionMainStream(section)">
              <ul
                v-if="piece.type === 'listGroup' && normalizedListItems(piece.group.items).length > 0"
                :key="`section-${sIdx}-stream-${pi}-lg-${piece.group.id || pi}`"
                :class="piece.group.type || 'term-list2'"
              >
                <li v-for="(item, iIdx) in normalizedListItems(piece.group.items)" :key="iIdx">
                  <span v-html="nl2br(item.text)"></span>
                  <ul v-if="item.children && item.children.length > 0" class="term-list">
                    <li v-for="(child, cIdx) in item.children" :key="`${iIdx}-${cIdx}`" v-html="nl2br(child)"></li>
                  </ul>
                </li>
              </ul>
              <div
                v-else-if="piece.type === 'table'"
                :key="`section-${sIdx}-stream-${pi}-tbl-${piece.table.id}`"
                class="table-card"
              >
                <p v-if="piece.table.caption" class="table-caption" v-html="piece.table.caption"></p>

                <table v-if="piece.table.preset === 'behavior-kv'" class="kv-table">
                  <tbody>
                    <tr v-for="row in piece.table.rows" :key="row.id">
                      <th scope="col" v-html="nl2br(row.cells[0] || '')"></th>
                      <td v-html="nl2br(row.cells[1] || '')"></td>
                    </tr>
                  </tbody>
                </table>

                <table v-else class="">
                  <colgroup>
                    <col v-for="(c, ci) in piece.table.columns" :key="ci" :style="{ width: (100/piece.table.columns.length) + '%' }">
                  </colgroup>
                  <thead>
                    <tr>
                      <th v-for="(col, ci) in piece.table.columns" :key="ci" scope="col">{{ col }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in piece.table.rows" :key="row.id">
                      <td v-for="(cell, ci) in row.cells" :key="ci" v-html="nl2br(cell)"></td>
                    </tr>
                  </tbody>
                </table>

                <h3 v-if="piece.table.note" class="table-note-text">{{ piece.table.note }}</h3>
              </div>
              <p
                v-else-if="piece.type === 'body'"
                :key="`section-${sIdx}-stream-${pi}-body-${piece.id || pi}`"
                class="section-body"
                v-html="nl2br(piece.text || '')"
              ></p>
            </template>

            <p
              v-if="effectiveSectionPostBody(section)"
              class="section-body"
              v-html="nl2br(effectiveSectionPostBody(section))"
            ></p>

            <div
              v-for="(sub, subIdx) in (section.subBlocks || [])"
              :key="sub.id || `sub-${subIdx}`"
              class="sub-block"
            >
              <h3 v-if="sub.title" class="sub-block-title" v-html="nl2br(sub.title)"></h3>
              <p v-if="sub.bodyText" class="section-body" v-html="nl2br(sub.bodyText)"></p>
              <ul
                v-if="normalizedListItems(sub.listItems).length > 0"
                :class="sub.listType || 'term-list2'"
              >
                <li v-for="(item, iIdx) in normalizedListItems(sub.listItems)" :key="`sub-${subIdx}-${iIdx}`">
                  <span v-html="nl2br(item.text)"></span>
                  <ul v-if="item.children && item.children.length > 0" class="term-list">
                    <li
                      v-for="(child, cIdx) in item.children"
                      :key="`sub-${subIdx}-${iIdx}-${cIdx}`"
                      v-html="nl2br(child)"
                    ></li>
                  </ul>
                </li>
              </ul>
              <p v-if="sub.extraBodyText" class="section-body" v-html="nl2br(sub.extraBodyText)"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    

    <!-- 부칙 -->
    <div v-if="data.effectiveDate" class="preview-section">
      <h2 class="section-title">부칙</h2>
      <p>본 개인정보처리방침은 {{ data.effectiveDate }}부터 시행합니다.</p>
    </div>
  </div>
</template>

<script>
import {
  normalizePrivacyListItems,
  effectivePrivacySectionPostBody
} from '../../utils/privacySectionLists.js'
import { getPrivacySectionRenderStream } from '../../utils/privacySectionContentBlocks.js'

export default {
  name: 'PrivacyPreview',
  props: {
    data: {
      type: Object,
      required: true
    },
    activeIndex: {
      type: Number,
      default: null
    }
  },
  computed: {
    sections() {
      return this.data.sections || []
    }
  },
  watch: {
    activeIndex(idx) {
      if (idx === null || idx === undefined) return
      this.$nextTick(() => {
        const ref = this.$refs['section-' + idx]
        const el = Array.isArray(ref) ? ref[0] : ref
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
    }
  },
  mounted() {
    this.ensurePrivacyTermCss()
  },
  beforeDestroy() {
    this.removePrivacyTermCss()
  },
  methods: {
    nl2br(text) {
      if (!text) return ''
      return text.replace(/\n/g, '<br>')
    },
    sectionAnchorId(idx) {
      return `id${String(idx + 1).padStart(2, '0')}`
    },
    normalizedListItems(listItems) {
      return normalizePrivacyListItems(listItems)
    },
    sectionMainStream(section) {
      return getPrivacySectionRenderStream(section)
    },
    effectiveSectionPostBody(section) {
      return effectivePrivacySectionPostBody(section)
    },
    ensurePrivacyTermCss() {
      if (typeof document === 'undefined') return

      const links = [
        {
          id: 'privacy-base-css-2017',
          href: 'https://skmns.benepia.co.kr/resources/css/2017/base.2017.css?ver=18'
        },
        {
          id: 'privacy-term-css-2017',
          href: 'https://skmns.benepia.co.kr/resources/css/2017/privacy_term.css'
        }
      ]

      links.forEach(({ id, href }) => {
        const existing = document.getElementById(id)
        if (existing) return

        const link = document.createElement('link')
        link.id = id
        link.rel = 'stylesheet'
        link.href = href
        document.head.appendChild(link)
      })
    },
    removePrivacyTermCss() {
      if (typeof document === 'undefined') return
      ;['privacy-base-css-2017', 'privacy-term-css-2017'].forEach((id) => {
        const el = document.getElementById(id)
        if (el && el.parentNode) el.parentNode.removeChild(el)
      })
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
.preview-section,
.box {
  margin-bottom: 28px;
  border-radius: 4px;
  transition: outline 0.2s ease, box-shadow 0.2s ease;
}

.preview-section.is-active-section,
.box.is-active-section {
  outline: 2px solid #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
  animation: section-pulse 0.4s ease;
}

@keyframes section-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  70%  { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15); }
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

/* .section-body {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 16px;
} */

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
.table-card + .table-card {
  margin-top: 20px;
}

.sub-block + .sub-block {
  margin-top: 14px;
}

.sub-block-title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
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
  /* text-align: left;
  width: 30%;
  white-space: nowrap; */
}

/* .table-note-text {
  font-size: 13px;
  color: #dc2626;
  font-weight: 600;
  margin: 4px 0 0;
} */
</style>