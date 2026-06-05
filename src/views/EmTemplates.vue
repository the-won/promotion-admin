<template>
  <div class="em-templates" :class="{ 'no-sidebar': !sidebarOpen, 'wide-sidebar': sidebarExpanded }">
    <div class="main-container">
      <!-- HERO -->
      <section class="hero-section" :class="{ 'no-sidebar': !sidebarOpen, 'wide-sidebar': sidebarExpanded }">
        <div class="hero-bg-glow" aria-hidden="true"></div>
        <div class="hero-bg-glow-left" aria-hidden="true"></div>
        <div class="hero-inner">
          <div class="hero-panel">
            <div class="hero-panel-head">
              <div class="hero-badge">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                  <path d="M6 0L7.35 4.65H12L8.32 7.53L9.67 12L6 9.12L2.33 12L3.68 7.53L0 4.65H4.65L6 0Z"/>
                </svg>
                이메일 템플릿
              </div>
              <span class="hero-status-chip" title="현재 편집 중인 템플릿">{{ selectedTemplateLabel }}</span>
            </div>
            <div class="hero-panel-titles">
              <h1 class="hero-title">Email Template Builder</h1>
              <div class="hero-title-accent" aria-hidden="true"></div>
            </div>
            <p class="hero-subtitle">
              실시간으로 이메일 템플릿을 편집·미리보기한 뒤 HTML로 내려받을 수 있습니다
            </p>
            <div class="hero-meta-row">
              <span class="hero-meta-item">
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="2" y="2" width="12" height="2" rx="1"/><rect x="2" y="6" width="12" height="8" rx="1"/></svg>
                {{ templates.length }}종 템플릿
              </span>
              <span class="hero-meta-dot"></span>
              <span class="hero-meta-item">웹</span>
              <span class="hero-meta-dot"></span>
              <span class="hero-meta-item">HTML 다운로드</span>
            </div>
            <!-- <div class="template-tabs" role="tablist" aria-label="템플릿 종류">
              <button
                v-for="template in templates"
                :key="template.value"
                type="button"
                role="tab"
                :aria-selected="selectedTemplate === template.value"
                class="template-tab"
                :class="{ active: selectedTemplate === template.value }"
                @click="selectTemplate(template.value)"
              >
                <span class="tab-text">{{ template.name }}</span>
              </button>
            </div> -->
          </div>
        </div>
      </section>

      <!-- CONTENT -->
      <div class="content-container">
        <div class="content-grid">
          <!-- SIDEBAR -->
          <aside class="sidebar-card" :class="{ collapsed: !sidebarOpen, expanded: sidebarExpanded }">
            <header class="card-header">
              <button v-if="!showTemplatePanel" class="width-toggle-btn" @click="toggleSidebarWidth" :aria-label="sidebarExpanded ? '너비 좁히기' : '너비 넓히기'" title="너비 조절">
                <svg v-if="!sidebarExpanded" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8H15M15 8L11 4M15 8L11 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M15 8H1M1 8L5 4M1 8L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button v-else class="sidebar-back-btn" @click="showTemplatePanel = false" aria-label="뒤로">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L4 8L10 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <h3 class="card-title">{{ showTemplatePanel ? '템플릿 선택' : '템플릿 설정' }}</h3>
              <button class="close-btn" @click="toggleSidebar" aria-label="사이드바 닫기">✕</button>
            </header>

            <div class="sidebar-pages" :class="{ 'is-template-panel': showTemplatePanel }">
              <!-- Page 1: 폼 -->
              <div class="sidebar-page">
                <div class="card-body">
                  <button class="template-select-btn" @click="showTemplatePanel = true">
                    <div class="tsb-icon">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.9"/>
                        <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.65"/>
                        <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.65"/>
                        <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.9"/>
                      </svg>
                    </div>
                    <div class="tsb-body">
                      <span class="tsb-label">템플릿</span>
                      <span class="tsb-value">{{ selectedTemplateLabel }}</span>
                    </div>
                    <svg class="tsb-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <section class="sidebar-section">
                    <h4 class="section-title">기본 설정</h4>
                    <TemplateForm
                      :template="selectedTemplate"
                      v-model="formData"
                      :templateConfig="getTemplateConfig(selectedTemplate)"
                      :selectedHotspotId="selectedHotspotId"
                      :visibleTopPositions="visibleTopPositions"
                      :visibleScrollPosition="visibleScrollPosition"
                      :sidebarExpanded="sidebarExpanded"
                      :sidebarFocusInfo="sidebarFocusInfo"
                      @select-hotspot="handleSelectHotspot"
                      @select-image="handleSelectImage"
                      @select-row="handleSelectRow"
                      @select-product="handleSelectProduct"
                      @active-row-change="handleActiveRowChange"
                      @active-image-change="handleActiveImageChange"
                      @device-change="currentDevice = $event"
                    />
                  </section>
                </div>
                <footer class="sidebar-footer-fixed">
                  <button class="download-btn" @click="handleDownload">
                    HTML 다운로드
                  </button>
                </footer>
              </div>

              <!-- Page 2: 템플릿 선택 -->
              <div class="sidebar-page">
                <div class="card-body">
                  <div class="template-panel-list">
                    <button
                      v-for="template in templates"
                      :key="template.value"
                      type="button"
                      class="template-panel-item"
                      :class="{ active: selectedTemplate === template.value }"
                      @click="selectTemplateFromPanel(template.value)"
                    >
                      <div>
                        <div class="template-panel-item-name">{{ template.name }}</div>
                        <div v-if="template.description" class="template-panel-item-desc">{{ template.description }}</div>
                      </div>
                      <svg v-if="selectedTemplate === template.value" class="template-panel-check" width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- PREVIEW -->
          <main class="preview-card-wrap" :class="{ expanded: !sidebarOpen, 'is-mobile': currentDevice === 'mobile' }">
            <!-- <header class="preview-header">
              <h3 class="preview-title">템플릿 미리보기<sub class="preview-subtitle">(실시간 렌더링)</sub>
              </h3>
              
              <button
                v-if="!sidebarOpen"
                class="show-sidebar-btn"
                @click="toggleSidebar"
              >
                설정 열기
              </button>
            </header> -->

            <button
                v-if="!sidebarOpen"
                class="show-sidebar-btn"
                aria-label="설정 열기"
                @click="toggleSidebar"
              ></button>

            <div class="preview-body-wrap">
              <div class="preview-canvas">
                <PreviewFrame
                  ref="previewFrame"
                  :template="selectedTemplate"
                  :formData="formData"
                  :deviceType="currentDevice"
                  :pageContext="'email'"
                  :selectedHotspotId="selectedHotspotId"
                  :activeRowId="activeRowId"
                  :activeImageIndex="activeImageIndex"
                  :selectedImageInfo="selectedImageInfo"
                  :selectedRowInfo="selectedRowInfo"
                  :selectedProductInfo="selectedProductInfo"
                  @select-hotspot="handleSelectHotspot"
                  @update-hotspot="handleUpdateHotspot"
                  @delete-hotspot="handleDeleteHotspot"
                  @copy-hotspot="handleCopyHotspot"
                  @scroll-update="handlePreviewScroll"
                  @clear-highlight="handleClearHighlight"
                  @preview-image-click="handlePreviewImageClick"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import TemplateForm from '../components/TemplateForm.vue'
import PreviewFrame from '../components/PreviewFrame.vue'
import { downloadHtml } from '../utils/downloadHtml'
import { imageDownloadHtml } from '../utils/ImageDownloadHtml'
import { templateDefaults } from '../config/templateDefaults'

export default {
  name: 'EmTemplates',
  components: { TemplateForm, PreviewFrame },
  data() {
    let _tpl = 'em-type-2'
    try {
      const s = JSON.parse(localStorage.getItem('defaultLanding'))
      if (s && s.page === 'em-templates' && s.template) _tpl = s.template
    } catch {}
    return {
      selectedTemplate: _tpl,
      formData: this.extractValues(templateDefaults[_tpl]),
      selectedHotspotId: null,
      activeRowId: null,
      activeImageIndex: null,
      selectedImageInfo: { groupId: null, imageId: null },
      selectedRowInfo: { rowId: null, rowIndex: null },
      selectedProductInfo: null,
      sidebarFocusInfo: null,
      sidebarOpen: true,
      sidebarExpanded: true,
      showTemplatePanel: false,
      visibleTopPositions: { 1: 10, 2: 10 },
      visibleScrollPosition: { scrollTop: 0, viewportHeight: 400 },
      currentDevice: 'web',
      templates: [
        // { value: 'em-type-1', name: 'Type 1', description: '기본 텍스트 템플릿' },
        { value: 'em-type-imagemap', name: '영역 링크 이미지', description: '특정 영역마다 링크 설정 템플릿' },
        { value: 'em-type-2', name: '전체 링크 이미지', description: '이미지 전체가 하나의 링크 템플릿' },
        // { value: 'em-type-imagemap2', name: 'Use Map2', description: '이미지맵 템플릿2' },
        { value: 'em-type-coupon', name: '쿠폰혜택', description: '쿠폰혜택 템플릿' },
        { value: 'em-type-letter', name: '베네레터', description: '베네레터 템플릿' },
        { value: 'em-type-4', name: '이패밀리샵', description: '이패밀리샵 템플릿' },
        { value: 'em-type-5', name: '비밀특가', description: '핫스팟 인터랙티브 템플릿' },
        { value: 'em-type-familysale', name: '패밀리세일', description: '패밀리세일 템플릿' }
      ]
    }
  },
  computed: {
    selectedTemplateLabel() {
      const t = this.templates.find((x) => x.value === this.selectedTemplate)
      return t ? t.name : this.selectedTemplate
    }
  },
  watch: {
    selectedTemplate(newTemplate) {
      this.formData = this.extractValues(templateDefaults[newTemplate])
      this.selectedHotspotId = null
      this.$nextTick(() => {
        this.updateVisiblePositions()
      })
    },
  },
  mounted() {
    document.body.classList.add('page-em-templates')
    window.addEventListener('scroll', this.handleWindowScroll, { passive: true })
    this.$nextTick(() => {
      document.body.classList.remove('no-sidebar-transition')
      setTimeout(() => {
        this.updateVisiblePositions()
      }, 100)
    })
    this.updateBodyClass()
  },
  beforeRouteLeave(_to, _from, next) {
    document.body.classList.add('no-sidebar-transition')
    next()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleWindowScroll)
    document.body.classList.remove('sidebar-closed', 'sidebar-expanded', 'page-em-templates')
  },
  methods: {
    handleWindowScroll() {
      this.updateVisiblePositions()
    },
    updateVisiblePositions() {
      const previewFrame = this.$refs.previewFrame
      if (previewFrame) {
        if (typeof previewFrame.getVisibleTopPosition === 'function') {
          this.visibleTopPositions = {
            1: previewFrame.getVisibleTopPosition(1),
            2: previewFrame.getVisibleTopPosition(2)
          }
        }
        if (typeof previewFrame.getVisiblePositionsForImageMap === 'function') {
          const imageMapPositions = previewFrame.getVisiblePositionsForImageMap()
          this.visibleScrollPosition = {
            ...this.visibleScrollPosition,
            scrollTop: window.scrollY || window.pageYOffset,
            viewportHeight: window.innerHeight,
            imageMapRowPositions: imageMapPositions
          }
        } else {
          this.visibleScrollPosition = {
            scrollTop: window.scrollY || window.pageYOffset,
            viewportHeight: window.innerHeight
          }
        }
      }
    },
    extractValues(config) {
      const result = {}
      for (const key in config) {
        result[key] = config[key].value
      }
      return result
    },
    getTemplateConfig(templateName) {
      return templateDefaults[templateName]
    },
    async handleDownload() {
      const zipTemplates = ['em-type-imagemap', 'em-type-2', 'em-type-coupon', 'em-type-letter']
      if (zipTemplates.includes(this.selectedTemplate)) {
        await imageDownloadHtml(this.selectedTemplate, this.formData, 'web', { htmlFilename: 'em.html' })
      } else {
        downloadHtml(this.selectedTemplate, this.formData)
      }
    },
    handleSelectHotspot(id) {
      this.selectedHotspotId = id
    },
    handleSelectImage(info) {
      console.log('🖼️ 이미지 선택됨 (EmTemplates):', info)
      // 타임스탬프를 추가하여 완전히 새로운 객체로 만듦
      this.selectedImageInfo = { 
        groupId: info.groupId, 
        imageId: info.imageId,
        imageIndex: info.imageIndex,
        timestamp: Date.now()  // 매번 다른 값으로 watch 트리거
      }
      console.log('✅ selectedImageInfo 설정:', this.selectedImageInfo)
    },
    handleSelectRow(info) {
      console.log('🖼️ 행 선택됨 (EmTemplates):', info)
      // 타임스탬프를 추가하여 완전히 새로운 객체로 만듦
      this.selectedRowInfo = { 
        rowId: info.rowId, 
        rowIndex: info.rowIndex,
        timestamp: Date.now()
      }
      console.log('✅ selectedRowInfo 설정:', this.selectedRowInfo)
    },
    handleSelectProduct(info) {
      this.selectedProductInfo = { refKey: info.refKey, timestamp: Date.now() }
    },
    handlePreviewImageClick({ refKey }) {
      this.sidebarFocusInfo = { refKey, timestamp: Date.now() }
    },
    handleActiveRowChange(rowId) {
      this.activeRowId = rowId
    },
    handleActiveImageChange(imageInfo) {
      // ImageLinkGroup의 이미지 정보
      if (imageInfo && imageInfo.groupId && imageInfo.imageId) {
        this.selectedImageInfo = { 
          groupId: imageInfo.groupId, 
          imageId: imageInfo.imageId,
          timestamp: Date.now()
        }
      } else {
        // EmType3 등의 이미지 인덱스
        this.activeImageIndex = imageInfo
      }
    },
    handleClearHighlight() {
      console.log('🧹 하이라이트 제거')
      this.selectedImageInfo = { groupId: null, imageId: null }
      this.selectedRowInfo = { rowId: null, rowIndex: null }
    },
    handleUpdateHotspot(updatedHotspot, groupKey) {
      // 새 구조: hotspotGroup1, hotspotGroup2 (내부에 hotspots 배열)
      if (groupKey && this.formData[groupKey] && this.formData[groupKey].hotspots) {
        const index = this.formData[groupKey].hotspots.findIndex(h => h.id === updatedHotspot.id)
        if (index !== -1) {
          this.$set(this.formData[groupKey].hotspots, index, updatedHotspot)
          return
        }
      }
      
      // 이전 구조 호환: hotspots1, hotspots2 (직접 배열)
      if (groupKey && Array.isArray(this.formData[groupKey])) {
        const index = this.formData[groupKey].findIndex(h => h.id === updatedHotspot.id)
        if (index !== -1) {
          this.$set(this.formData[groupKey], index, updatedHotspot)
          return
        }
      }
      
      // fallback: hotspots 배열
      if (this.formData.hotspots) {
        const index = this.formData.hotspots.findIndex(h => h.id === updatedHotspot.id)
        if (index !== -1) {
          this.$set(this.formData.hotspots, index, updatedHotspot)
        }
      }
    },
    handleDeleteHotspot(id) {
      // 새 구조: hotspotGroup1, hotspotGroup2 (내부에 hotspots 배열)
      const groupKeys = ['hotspotGroup1', 'hotspotGroup2']
      for (const key of groupKeys) {
        if (this.formData[key] && this.formData[key].hotspots) {
          const index = this.formData[key].hotspots.findIndex(h => h.id === id)
          if (index !== -1) {
            this.formData[key].hotspots.splice(index, 1)
            this.selectedHotspotId = null
            return
          }
        }
      }
      
      // 이전 구조 호환: 직접 배열
      const arrayKeys = ['hotspots1', 'hotspots2', 'hotspots', 'imageMapAreas']
      for (const key of arrayKeys) {
        if (Array.isArray(this.formData[key])) {
          const index = this.formData[key].findIndex(h => h.id === id)
          if (index !== -1) {
            this.formData[key].splice(index, 1)
            this.selectedHotspotId = null
            return
          }
        }
      }
    },
    handleCopyHotspot({ area }) {
      if (!area || !Array.isArray(this.formData.imageMapAreas)) return

      const newArea = JSON.parse(JSON.stringify(area))
      newArea.id = Date.now()
      newArea.coords = {
        x1: newArea.coords.x1 + 20,
        y1: newArea.coords.y1 + 20,
        x2: newArea.coords.x2 + 20,
        y2: newArea.coords.y2 + 20
      }

      this.formData.imageMapAreas.push(newArea)
      this.selectedHotspotId = newArea.id
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
      this.updateBodyClass()
    },
    toggleSidebarWidth() {
      this.sidebarExpanded = !this.sidebarExpanded
      this.updateBodyClass()
    },
    selectTemplate(templateValue) {
      this.selectedTemplate = templateValue
    },
    handlePreviewScroll() {
      this.updateVisiblePositions()
    },
    selectTemplateFromPanel(templateValue) {
      this.selectedTemplate = templateValue
      this.showTemplatePanel = false
    },
    updateBodyClass() {
      document.body.classList.remove('sidebar-closed', 'sidebar-expanded')
      if (!this.sidebarOpen) {
        document.body.classList.add('sidebar-closed')
      } else if (this.sidebarExpanded) {
        document.body.classList.add('sidebar-expanded')
      }
    }
  }
}
</script>

<style scoped>

</style>