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
            <!-- <header class="card-header">
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
            </header> -->

            <div class="card-body">
              <section class="sidebar-section">
                <div class="items-grid cols-2">
                
                <!-- <button class="template-select-btn" @click="openModal">
                  <svg class="btn-icon" width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <rect x="5" y="2" width="10" height="3" rx="1.5" fill="currentColor" opacity="0.7"/>
                    <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.6" fill="none"/>
                    <line x1="6.5" y1="8.5" x2="13.5" y2="8.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                    <line x1="6.5" y1="11.5" x2="11" y2="11.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                  </svg>
                  <span class="btn-text">템플릿 선택</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button> -->
                </div>
              
                <div class="form-row-space">
                  <h4 class="section-title">기본 설정</h4>
                  <button class="width-toggle-btn" @click="toggleSidebarWidth" :aria-label="sidebarExpanded ? '너비 좁히기' : '너비 넓히기'" title="너비 조절">
                    <svg v-if="!sidebarExpanded" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8H15M15 8L11 4M15 8L11 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M15 8H1M1 8L5 4M1 8L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
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

</style>