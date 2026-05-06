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
              </button>

              <!-- 배너 설정 -->
              <section class="banner-settings">
                <label class="checkbox-item">
                  <input 
                    type="checkbox" 
                    v-model="bannerSettings[currentDevice].showTopBanner"
                  >
                  <span>상단 배너 사용</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox" 
                    v-model="bannerSettings[currentDevice].showBottomBanner"
                  >
                  <span>하단 배너 사용</span>
                </label>

                <label class="checkbox-item">
                  <input 
                    type="checkbox" 
                    v-model="bannerSettings[currentDevice].showNotice"
                  >
                  <span>공지사항 사용</span>
                </label>

                <div class="notice-editor" v-show="bannerSettings[currentDevice].showNotice">
                  <div class="notice-title-row">
                    <span class="notice-label">제목</span>
                    <input
                      type="text"
                      class="notice-title-input"
                      v-model="bannerSettings[currentDevice].noticeTitle"
                      placeholder="꼭 확인하세요"
                    />
                  </div>
                  <div class="notice-items">
                    <div
                      v-for="(item, index) in bannerSettings[currentDevice].noticeItems"
                      :key="index"
                      class="notice-item-row"
                    >
                      <span class="notice-bullet">*</span>
                      <input
                        type="text"
                        class="notice-item-input"
                        :value="item"
                        @input="updateNoticeItem(index, $event.target.value)"
                        placeholder="공지사항 내용"
                      />
                      <button
                        class="notice-item-del"
                        @click="removeNoticeItem(index)"
                        title="삭제"
                      >✕</button>
                    </div>
                  </div>
                  <button class="notice-add-btn" @click="addNoticeItem">+ 항목 추가</button>
                </div>
              </section>

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
                  :show-top-banner="bannerSettings[currentDevice].showTopBanner"
                  :show-bottom-banner="bannerSettings[currentDevice].showBottomBanner"
                  :show-notice="bannerSettings[currentDevice].showNotice"
                  :notice-data="{
                    title: bannerSettings[currentDevice].noticeTitle,
                    items: bannerSettings[currentDevice].noticeItems
                  }"
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
    return {
      selectedTemplate: 'em-type-1',
      formData: this.extractValues(templateDefaults['em-type-1']),
      selectedHotspotId: null,
      selectedHotspotInfo: { hotspotId: null, groupIndex: null },
      activeRowId: null,
      activeImageIndex: null,
      sidebarOpen: true,
      sidebarExpanded: false,
      isModalOpen: false,
      visibleTopPositions: { 1: 10, 2: 10 },
      visibleScrollPosition: { scrollTop: 0, viewportHeight: 400 },
      currentDevice: 'web',
      bannerSettings: {
        web: {
          showTopBanner: false,
          showBottomBanner: false,
          showNotice: false,
          noticeTitle: '꼭 확인하세요',
          noticeItems: [
            '이용권 할인은 베네피아에서 e쿠폰 구매 시에만 적용됩니다.',
            '구매하신 e쿠폰은 \'마이페이지 > 나의 e쿠폰함\'에서 확인하실 수 있습니다.',
            '본 이벤트는 제휴사의 사정에 의해 예고 없이 중단 또는 변경될 수 있습니다.'
          ]
        },
        mobile: {
          showTopBanner: false,
          showBottomBanner: false,
          showNotice: false,
          noticeTitle: '꼭 확인하세요',
          noticeItems: [
            '이용권 할인은 베네피아에서 e쿠폰 구매 시에만 적용됩니다.',
            '구매하신 e쿠폰은 \'마이페이지 > 나의 e쿠폰함\'에서 확인하실 수 있습니다.',
            '본 이벤트는 제휴사의 사정에 의해 예고 없이 중단 또는 변경될 수 있습니다.'
          ]
        }
      },
      templates: [
        { value: 'em-type-1', name: 'Type 1', icon: '', description: '기본 텍스트 템플릿' },
        { value: 'em-type-3', name: 'Image Map', icon: '', description: '이벤트 이미지맵 템플릿' }
      ]
    }
  },
  computed: {
    currentBannerSettings() {
      return this.bannerSettings[this.currentDevice]
    },
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
    }
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
    addNoticeItem() {
      this.bannerSettings[this.currentDevice].noticeItems.push('')
    },
    removeNoticeItem(index) {
      this.bannerSettings[this.currentDevice].noticeItems.splice(index, 1)
    },
    updateNoticeItem(index, value) {
      this.$set(this.bannerSettings[this.currentDevice].noticeItems, index, value)
    },

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
      console.log('🔍 다운로드 시작')
      console.log('📱 currentDevice:', this.currentDevice)
      console.log('📋 selectedTemplate:', this.selectedTemplate)
      const settings = this.bannerSettings[this.currentDevice]
      const bannerOptions = {
        showTopBanner: settings.showTopBanner,
        showBottomBanner: settings.showBottomBanner,
        showNotice: settings.showNotice,
        noticeTitle: settings.noticeTitle,
        noticeItems: settings.noticeItems
      }
      console.log('🎌 bannerOptions:', bannerOptions)
      // downloadHtml(this.selectedTemplate, this.formData, this.currentDevice, bannerOptions)
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

.banner-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  margin-bottom: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.checkbox-item:hover {
  background: #f3f4f6;
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #6366f1;
}

.checkbox-item span {
  user-select: none;
}

.sidebar-section .section-title:not(:first-child) {
  margin-top: 20px;
}

/* 공지사항 편집기 */
.notice-editor {
  margin-top: 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notice-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notice-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
  width: 28px;
}

.notice-title-input {
  flex: 1;
  padding: 6px 8px;
  font-size: 13px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  color: #111827;
}

.notice-title-input:focus {
  border-color: #6366f1;
}

.notice-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.notice-item-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.notice-bullet {
  font-size: 13px;
  color: #9ca3af;
  flex-shrink: 0;
}

.notice-item-input {
  flex: 1;
  padding: 5px 8px;
  font-size: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  color: #374151;
  min-width: 0;
}

.notice-item-input:focus {
  border-color: #6366f1;
}

.notice-item-del {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 10px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s;
}

.notice-item-del:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #ef4444;
}

.notice-add-btn {
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #6366f1;
  background: #eef2ff;
  border: 1px dashed #a5b4fc;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}

.notice-add-btn:hover {
  background: #e0e7ff;
  border-color: #6366f1;
}
</style>