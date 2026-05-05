<template>
  <div class="em-templates" :class="{ 'no-sidebar': !sidebarOpen, 'wide-sidebar': sidebarExpanded }">
    <div class="main-container">
      <!-- HERO -->
      <section class="hero-section" :class="{ 'no-sidebar': !sidebarOpen, 'wide-sidebar': sidebarExpanded }">
        <div class="hero-bg-glow" aria-hidden="true"></div>
        <div class="hero-inner">
          <div class="hero-panel">
            <div class="hero-panel-head">
              <div class="hero-panel-titles">
                <p class="hero-eyebrow">이메일 템플릿</p>
                <h1 class="hero-title">Email Template Builder</h1>
              </div>
              <span class="hero-status-chip" title="현재 편집 중인 템플릿">{{ selectedTemplateLabel }}</span>
            </div>
            <p class="hero-subtitle">
              실시간으로 이메일 템플릿을 편집·미리보기한 뒤 HTML로 내려받을 수 있습니다
            </p>
            <div class="template-tabs" role="tablist" aria-label="템플릿 종류">
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
            </div>
          </div>
        </div>
      </section>

      <!-- CONTENT -->
      <div class="content-container">
        <div class="content-grid">
          <!-- SIDEBAR -->
          <aside class="sidebar-card" :class="{ collapsed: !sidebarOpen, expanded: sidebarExpanded }">
            <header class="card-header">
              <button class="width-toggle-btn" @click="toggleSidebarWidth" :aria-label="sidebarExpanded ? '너비 좁히기' : '너비 넓히기'" title="너비 조절">
                <svg v-if="!sidebarExpanded" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8H15M15 8L11 4M15 8L11 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M15 8H1M1 8L5 4M1 8L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <h3 class="card-title">템플릿 설정</h3>
              <button class="close-btn" @click="toggleSidebar" aria-label="사이드바 닫기">✕</button>
            </header>

            <div class="card-body">
              <section class="sidebar-section">
                <button class="template-select-btn" @click="openModal">
                  <span class="btn-icon">📋</span>
                  <span class="btn-text">템플릿 선택</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <h4 class="section-title">기본 설정</h4>
                <TemplateForm
                  :template="selectedTemplate"
                  v-model="formData"
                  :templateConfig="getTemplateConfig(selectedTemplate)"
                  :selectedHotspotId="selectedHotspotId"
                  :visibleTopPositions="visibleTopPositions"
                  :visibleScrollPosition="visibleScrollPosition"
                  :sidebarExpanded="sidebarExpanded"
                  @select-hotspot="handleSelectHotspot"
                  @select-image="handleSelectImage"
                  @select-row="handleSelectRow"
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
                @click="toggleSidebar"
              >
                설정 열기
              </button>

            <div class="preview-body-wrap">
              <div class="preview-canvas">
                <PreviewFrame
                  ref="previewFrame"
                  :template="selectedTemplate"
                  :formData="formData"
                  :deviceType="currentDevice"
                  :selectedHotspotId="selectedHotspotId"
                  :activeRowId="activeRowId"
                  :activeImageIndex="activeImageIndex"
                  :selectedImageInfo="selectedImageInfo"
                  :selectedRowInfo="selectedRowInfo"
                  @select-hotspot="handleSelectHotspot"
                  @update-hotspot="handleUpdateHotspot"
                  @delete-hotspot="handleDeleteHotspot"
                  @scroll-update="handlePreviewScroll"
                  @clear-highlight="handleClearHighlight"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Template Select Modal -->
    <TemplateSelectModal
      :isOpen="isModalOpen"
      :selectedTemplate="selectedTemplate"
      :templates="templates"
      @select="handleModalSelect"
      @close="closeModal"
    />
  </div>
</template>

<script>
import TemplateForm from '../components/TemplateForm.vue'
import PreviewFrame from '../components/PreviewFrame.vue'
import TemplateSelectModal from '../modals/TemplateSelectModal.vue'
import { downloadHtml } from '../utils/downloadHtml'
import { imageDownloadHtml } from '../utils/ImageDownloadHtml'
import { templateDefaults } from '../config/templateDefaults'

export default {
  name: 'EmTemplates',
  components: { TemplateForm, PreviewFrame, TemplateSelectModal },
  data() {
    return {
      selectedTemplate: 'em-type-1',
      formData: this.extractValues(templateDefaults['em-type-1']),
      selectedHotspotId: null,
      activeRowId: null,
      activeImageIndex: null,
      selectedImageInfo: { groupId: null, imageId: null },
      selectedRowInfo: { rowId: null, rowIndex: null },
      sidebarOpen: true,
      sidebarExpanded: false,
      isModalOpen: false,
      visibleTopPositions: { 1: 10, 2: 10 },
      visibleScrollPosition: { scrollTop: 0, viewportHeight: 400 },
      currentDevice: 'web',
      templates: [
        { value: 'em-type-1', name: 'Type 1', description: '기본 텍스트 템플릿' },
        { value: 'em-type-2', name: 'Image Link', description: '이미지 중심 템플릿' },
        { value: 'em-type-imagemap', name: 'Use Map', description: '이미지맵 템플릿' },
        { value: 'em-type-imagemap2', name: 'Use Map2', description: '이미지맵 템플릿2' },
        { value: 'em-type-coupon', name: '쿠폰혜택', description: '쿠폰혜택 템플릿' },
        { value: 'em-type-letter', name: '베네레터', description: '베네레터 템플릿' },
        { value: 'em-type-4', name: '이패밀리샵', description: '이패밀리샵 템플릿' },
        { value: 'em-type-5', name: '비밀특가', description: '핫스팟 인터랙티브 템플릿' }
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
    sidebarOpen() {
      this.updateBodyClass()
    },
    sidebarExpanded() {
      this.updateBodyClass()
    }
  },
  mounted() {
    document.body.classList.add('page-em-templates')
    window.addEventListener('scroll', this.handleWindowScroll, { passive: true })
    this.$nextTick(() => {
      setTimeout(() => {
        this.updateVisiblePositions()
      }, 100)
    })
    this.updateBodyClass()
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
      const zipTemplates = ['em-type-imagemap', 'em-type-2', 'em-type-coupon']
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
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    toggleSidebarWidth() {
      this.sidebarExpanded = !this.sidebarExpanded
    },
    selectTemplate(templateValue) {
      this.selectedTemplate = templateValue
    },
    handlePreviewScroll() {
      this.updateVisiblePositions()
    },
    openModal() {
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
    },
    handleModalSelect(templateValue) {
      this.selectedTemplate = templateValue
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
:root {
  --sidebar-wid: 320px;
}
.em-templates {
  padding-left: 320px;
  transition: padding-left var(--template-layout-duration, 0.35s) var(--template-layout-ease, cubic-bezier(0.4, 0, 0.2, 1));
}
.em-templates.wide-sidebar {
  padding-left: 640px;
}
.em-templates.no-sidebar,
.em-templates.no-sidebar.wide-sidebar {
  padding-left: 0 !important;
}
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  transition: max-width var(--template-layout-duration, 0.35s) var(--template-layout-ease, cubic-bezier(0.4, 0, 0.2, 1));
}
.no-sidebar .main-container,
.no-sidebar.wide-sidebar .main-container {
  max-width: 100% !important;
}

/* LAYOUT */
.content-container {
  max-width: 1400px;
  margin: 32px auto;
}
.content-grid {
  display: flex;
  gap: 24px;
}

/* SIDEBAR */
.sidebar-card {
  width: 320px;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0px;
  bottom: 0;
  left: 0;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 16%), 0 1px 2px 0 rgb(0 0 0 / 2%);
  z-index: 20;
  transition:
    width var(--template-layout-duration, 0.35s) var(--template-layout-ease, cubic-bezier(0.4, 0, 0.2, 1)),
    opacity var(--template-layout-duration, 0.35s) var(--template-layout-ease, cubic-bezier(0.4, 0, 0.2, 1));
  flex-shrink: 0;
}

.sidebar-card.expanded {
  width: 640px;
}

.sidebar-card.collapsed {
  width: 0;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
}



.width-toggle-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 0;
  color: var(--color-text-secondary, #6e6e73);
  cursor: pointer;
  transition: color 0.15s;
  flex-shrink: 0;
}

.width-toggle-btn:hover {
  background: transparent;
  border-color: transparent;
  color: var(--color-primary, #0071e3);
}

.card-title {
  font-weight: 700;
  margin-right: auto;
}
.close-btn {
  border: none;
  background: none;
  cursor: pointer;
}
.section-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 12px;
}
.card-body {
  padding: 16px;
  overflow-y: auto;
}
.sidebar-footer-fixed {
  padding: 16px;
  border-top: 1px solid #eee;
}
.download-btn {
  width: 100%;
  padding: 12px;
  background: var(--color-primary, #0071e3);
  color: #fff;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.15s;
}

.download-btn:hover {
  background: var(--color-primary-hover, #0077ed);
}



.show-sidebar-btn {
  position: fixed;
  top: 72px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 3px;
  border: 1px solid var(--color-primary, #0071e3);
  background: #fff;
  color: var(--color-primary, #0071e3);
  cursor: pointer;
}

.card-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 24px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.card-body::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.sidebar-footer-fixed {
  margin-top: auto;
  background: #fff;
}

/* Template Select Button */
.template-select-btn {
  width: 100%;
  padding: 10px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: 1px solid var(--color-primary, #0071e3);
  border-radius: 3px;
  color: var(--color-primary, #0071e3);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  box-shadow: none;
}

.template-select-btn:hover {
  background: var(--color-primary-light, rgba(0, 113, 227, 0.08));
  transform: none;
  box-shadow: none;
}

.template-select-btn:active {
  transform: none;
}

.template-select-btn .btn-icon {
  font-size: 18px;
}

.template-select-btn .btn-text {
  flex: 1;
  text-align: left;
}

.template-select-btn svg {
  opacity: 0.8;
  transition: transform 0.2s;
}

.template-select-btn:hover svg {
  transform: translateY(2px);
}
</style>