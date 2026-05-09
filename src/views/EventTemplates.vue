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
                <p class="hero-eyebrow">프로모션 템플릿</p>
                <h1 class="hero-title">Promotion Template Builder</h1>
              </div>
              <span class="hero-status-chip" title="현재 편집 중인 템플릿">{{ selectedTemplateLabel }}</span>
            </div>
            <p class="hero-subtitle">
              실시간으로 프로모션 템플릿을 편집·미리보기한 뒤 HTML로 내려받을 수 있습니다
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
                <span class="tab-icon">{{ template.icon }}</span>
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
              <button class="template-select-btn" @click="openModal">
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
                  :selectedHotspotInfo="selectedHotspotInfo"
                  :visibleTopPositions="visibleTopPositions"
                  :visibleScrollPosition="visibleScrollPosition"
                  :sidebarExpanded="sidebarExpanded"
                  @select-hotspot="handleSelectHotspot"
                  @select-hotspot-info="handleSelectHotspotInfo"
                  @select-hotspot-image="handleSelectHotspotImage"
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
                  :selectedHotspotInfo="selectedHotspotInfo"
                  :activeRowId="activeRowId"
                  :activeImageIndex="activeImageIndex"
                  @select-hotspot="handleSelectHotspot"
                  @update-hotspot="handleUpdateHotspot"
                  @delete-hotspot="handleDeleteHotspot"
                  @scroll-update="handlePreviewScroll"
                  @clear-highlight="handleClearHotspotHighlight"
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
// import { downloadHtml } from '../utils/downloadHtml'
// 새로운: imageDownloadHtml.js (이미지 분리용)
import { imageDownloadHtml } from '../utils/imageDownloadHtml'
import { templateDefaults } from '../config/templateDefaults'

export default {
  name: 'EventTemplates',
  components: { TemplateForm, PreviewFrame, TemplateSelectModal },
  data() {
    let _tpl = 'em-type-1'
    try {
      const s = JSON.parse(localStorage.getItem('defaultLanding'))
      if (s && s.page === 'event-templates' && s.template) _tpl = s.template
    } catch {}
    return {
      selectedTemplate: _tpl,
      formData: this.extractValues(templateDefaults[_tpl]),
      selectedHotspotId: null,
      selectedHotspotInfo: { hotspotId: null, groupIndex: null },
      activeRowId: null,
      activeImageIndex: null,
      sidebarOpen: true,
      sidebarExpanded: true,
      isModalOpen: false,
      visibleTopPositions: { 1: 10, 2: 10 },
      visibleScrollPosition: { scrollTop: 0, viewportHeight: 400 },
      currentDevice: 'web',
      templates: [
        { value: 'em-type-1', name: 'Type 1', icon: '', description: '기본 텍스트 템플릿' },
        { value: 'em-type-3', name: 'Image Map', icon: '', description: '이벤트 이미지맵 템플릿' }
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
      this.activeRowId = null
      this.activeImageIndex = null
      this.$nextTick(() => {
        this.updateVisiblePositions()
      })
    },
    sidebarOpen(val) {
      this.updateBodyClass()
    },
    sidebarExpanded(val) {
      this.updateBodyClass()
    },
  },
  mounted() {
    document.body.classList.add('page-event-templates')
    
    // window 스크롤 이벤트 리스너
    window.addEventListener('scroll', this.handleWindowScroll, { passive: true })
    
    // PreviewFrame 내부 스크롤도 감지
    this.$nextTick(() => {
      const previewFrame = this.$refs.previewFrame
      if (previewFrame && previewFrame.$el) {
        const previewBody = previewFrame.$el.querySelector('.preview-body')
        if (previewBody) {
          previewBody.addEventListener('scroll', this.handlePreviewScroll, { passive: true })
        }
      }
      
      setTimeout(() => {
        this.updateVisiblePositions()
      }, 100)
    })
    
    this.updateBodyClass()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleWindowScroll)
    
    // PreviewFrame 스크롤 리스너 제거
    const previewFrame = this.$refs.previewFrame
    if (previewFrame && previewFrame.$el) {
      const previewBody = previewFrame.$el.querySelector('.preview-body')
      if (previewBody) {
        previewBody.removeEventListener('scroll', this.handlePreviewScroll)
      }
    }
    
    document.body.classList.remove('sidebar-closed', 'sidebar-expanded', 'page-event-templates')
  },
  methods: {
    handleWindowScroll() {
      console.log('🔄 Window 스크롤 이벤트')
      this.updateVisiblePositions()
    },
    
    handlePreviewScroll() {
      console.log('🔄 Preview 스크롤 이벤트')
      this.updateVisiblePositions()
    },
    
    updateVisiblePositions() {
      const previewFrame = this.$refs.previewFrame
      if (!previewFrame) {
        return
      }
      
      if (typeof previewFrame.getVisibleTopPosition === 'function') {
        // 동적 그룹 수에 맞게 위치 계산
        const groupCount = (this.formData.hotspotGroups && this.formData.hotspotGroups.length) || 2
        const positions = {}
        for (let i = 1; i <= groupCount; i++) {
          positions[i] = previewFrame.getVisibleTopPosition(i)
        }
        this.visibleTopPositions = positions
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
      const bannerOptions = {
        showTopBanner: this.formData.showTopBanner || false,
        showBottomBanner: this.formData.showBottomBanner || false,
        showNotice: this.formData.showNotice || false,
        noticeTitle: this.formData.noticeTitle || '꼭 확인하세요',
        noticeItems: this.formData.noticeItems || []
      }
      await imageDownloadHtml(this.selectedTemplate, this.formData, this.currentDevice, bannerOptions)
    },
    
    handleSelectHotspot(id) {
      this.selectedHotspotId = id
    },
    
    handleSelectHotspotInfo(info) {
      console.log('핫스팟 정보 선택됨 (EventTemplates):', info)
      this.selectedHotspotInfo = {
        hotspotId: info.hotspotId,
        groupIndex: info.groupIndex,
        timestamp: Date.now()
      }
      console.log('✅ selectedHotspotInfo 설정:', this.selectedHotspotInfo)
    },
    
    handleSelectHotspotImage(info) {
      console.log('🖼️ 이미지 영역 선택됨 (EventTemplates):', info)
      this.selectedHotspotInfo = {
        hotspotId: `image-container-${info.groupIndex}`,
        groupIndex: info.groupIndex,
        timestamp: Date.now()
      }
      console.log('✅ selectedHotspotInfo 설정:', this.selectedHotspotInfo)
    },
    
    handleClearHotspotHighlight() {
      console.log('🧹 핫스팟 하이라이트 제거')
      this.selectedHotspotInfo = { hotspotId: null, groupIndex: null }
    },
    
    handleActiveRowChange(rowId) {
      this.activeRowId = rowId
    },
    
    handleActiveImageChange(imageIndex) {
      this.activeImageIndex = imageIndex
    },
    
    handleUpdateHotspot(updatedHotspot, groupKey, imageIndex) {
      // hotspotGroups 배열 구조 (em-type-3)
      if (groupKey === 'hotspotGroups' && Array.isArray(this.formData.hotspotGroups) && imageIndex) {
        const group = this.formData.hotspotGroups[imageIndex - 1]
        if (group && group.hotspots) {
          const index = group.hotspots.findIndex(h => h.id === updatedHotspot.id)
          if (index !== -1) {
            this.$set(group.hotspots, index, updatedHotspot)
            return
          }
        }
      }

      // hotspotGroups 배열 - imageIndex 없이 전체 탐색
      if (Array.isArray(this.formData.hotspotGroups)) {
        for (const group of this.formData.hotspotGroups) {
          if (group && group.hotspots) {
            const index = group.hotspots.findIndex(h => h.id === updatedHotspot.id)
            if (index !== -1) {
              this.$set(group.hotspots, index, updatedHotspot)
              return
            }
          }
        }
      }
      
      // 기존 hotspotGroup1/2 구조 fallback
      if (groupKey && this.formData[groupKey] && this.formData[groupKey].hotspots) {
        const index = this.formData[groupKey].hotspots.findIndex(h => h.id === updatedHotspot.id)
        if (index !== -1) {
          this.$set(this.formData[groupKey].hotspots, index, updatedHotspot)
          return
        }
      }
      
      if (groupKey && Array.isArray(this.formData[groupKey])) {
        const index = this.formData[groupKey].findIndex(h => h.id === updatedHotspot.id)
        if (index !== -1) {
          this.$set(this.formData[groupKey], index, updatedHotspot)
          return
        }
      }
      
      if (this.formData.hotspots) {
        const index = this.formData.hotspots.findIndex(h => h.id === updatedHotspot.id)
        if (index !== -1) {
          this.$set(this.formData.hotspots, index, updatedHotspot)
        }
      }
    },
    
    handleDeleteHotspot(id) {
      // hotspotGroups 배열 구조 (em-type-3)
      if (Array.isArray(this.formData.hotspotGroups)) {
        for (const group of this.formData.hotspotGroups) {
          if (group && group.hotspots) {
            const index = group.hotspots.findIndex(h => h.id === id)
            if (index !== -1) {
              group.hotspots.splice(index, 1)
              this.selectedHotspotId = null
              return
            }
          }
        }
      }

      // 기존 hotspotGroup1/2 구조 fallback
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

.template-select-btn {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgb(0 0 0 / 4%);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.template-select-btn:hover {
  background: rgb(0 0 0 / 7%);
  border-color: var(--color-border-hover);
  color: var(--color-text);
}

.template-select-btn:active {
  background: rgb(0 0 0 / 10%);
}

.template-select-btn .btn-icon {
  flex-shrink: 0;
  color: var(--color-text-tertiary);
}

.template-select-btn .btn-text {
  flex: 1;
  text-align: left;
}

.template-select-btn > svg:last-child {
  flex-shrink: 0;
  opacity: 0.45;
  transition: transform 0.15s;
}

.template-select-btn:hover > svg:last-child {
  transform: translateY(2px);
  opacity: 0.65;
}

.sidebar-section .section-title:not(:first-child) {
  margin-top: 20px;
}
</style>