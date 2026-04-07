<template>
  <div class="em-templates" :class="{ 'no-sidebar': !sidebarOpen, 'wide-sidebar': sidebarExpanded }">
    <div class="main-container">
      <!-- HERO -->
      <section class="hero-section" :class="{ 'no-sidebar': !sidebarOpen, 'wide-sidebar': sidebarExpanded }">
        <div class="hero-inner">
          <div class="hero-title-row">
            <h1 class="hero-title">Promotion Template Builder</h1>
            <span class="hero-badge">{{ selectedTemplate }}</span>
          </div>
          <p class="hero-subtitle">
            실시간으로 프로모션 템플릿을 편집하고 미리보기 하세요
          </p>

          <!-- Template Tabs -->
          <div class="template-tabs">
            <button
              v-for="template in templates"
              :key="template.value"
              class="template-tab"
              :class="{ active: selectedTemplate === template.value }"
              @click="selectTemplate(template.value)"
            >
              <span class="tab-icon">{{ template.icon }}</span>
              <span class="tab-text">{{ template.name }}</span>
            </button>
          </div>
        </div>
      </section>
      <svg class="hero-waves Bsection2" :class="{ 'no-sidebar': !sidebarOpen, 'wide-sidebar': sidebarExpanded }" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28 " preserveAspectRatio="none">
        <defs>
          <path id="wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
        </defs>
        <g class="wave1">
          <use xlink:href="#wave-path" x="50" y="3" fill="rgba(32,32,32, .1)"></use>
        </g>
        <g class="wave2">
          <use xlink:href="#wave-path" x="50" y="0" fill="rgba(32,32,32, .2)"></use>
        </g>
        <g class="wave3">
          <use xlink:href="#wave-path" x="50" y="9" fill="#202020"></use>
        </g>
      </svg>

      <!-- CONTENT -->
      <div class="content-container">
        <div class="content-grid">
          <!-- SIDEBAR -->
          <aside class="sidebar-card" :class="{ collapsed: !sidebarOpen, expanded: sidebarExpanded }">
            <header class="card-header">
              <button class="width-toggle-btn" @click="toggleSidebarWidth" title="너비 조절">
                <svg v-if="!sidebarExpanded" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8H15M15 8L11 4M15 8L11 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M15 8H1M1 8L5 4M1 8L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <h3 class="card-title">템플릿 설정</h3>
              <button class="close-btn" @click="toggleSidebar">✕</button>
            </header>

            <div class="card-body">
              <button class="template-select-btn" @click="openModal">
                <span class="btn-icon">📋</span>
                <span class="btn-text">템플릿 선택</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
        { value: 'em-type-1', name: 'Type 1', icon: '📄', description: '기본 텍스트 템플릿' },
        { value: 'em-type-3', name: 'Image Map', icon: '📦', description: '이벤트 이미지맵 템플릿' }
      ]
    }
  },
  computed: {
    currentBannerSettings() {
      return this.bannerSettings[this.currentDevice]
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
      console.log('🎯 핫스팟 정보 선택됨 (EventTemplates):', info)
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
/* 기존 스타일 전체 유지 */
:root {
  --sidebar-wid: 320px;
}
.em-templates {
  padding-left: 320px;
  transition: padding-left 0.35s ease;
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
  transition: max-width 0.35s ease;
}
.no-sidebar .main-container,
.no-sidebar.wide-sidebar .main-container {
  max-width: none !important;
}

.hero-section {
  filter: saturate(180%);
  width: calc(100vw - 320px);
  margin-left: calc(((calc(100vw - 320px) - 100%) / 2) * -1) !important;
  transition: width 0.35s ease, margin-left 0.35s ease;
  height: 550px !important;
  position: relative;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% -175px;
  background-image: url("https://blog.kakaocdn.net/dna/chZ3BL/btrIzFMbJ4r/AAAAAAAAAAAAAAAAAAAAABENuT3xPS7CJMvqaXXBeDrNUpAzW1mo5v_bn74HoZYO/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=nzR1osduT8%2FrzQVkwuLlHHE2AgE%3D");
  --thumbnail-blur: 0px;
}
.page-event-templates .hero-section {
  background-image: url("https://blog.kakaocdn.net/dna/UaYQ5/btrRsI8MzIU/AAAAAAAAAAAAAAAAAAAAABfaHWg00nnltrWiN0Zdzd1MZnD_1xIPY6TAjkkkQ6dk/img.webp?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1772290799&allow_ip=&allow_referer=&signature=oHmqgXYoi3ZUah3ugSfW3spmzhU%3D");
}
.hero-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgb(14 17 31 / 50%);
  backdrop-filter: blur(0);
}
.hero-waves {
  display: block;
  width: calc(100vw - 320px);
  height: 60px;
  transition: width 0.35s ease;
  z-index: 5;
  position: absolute;
  right: 0;
  top: 490px;
}

.wave1 use {
  fill: rgba(255, 255, 255, 0.1);
  animation: move-forever1 10s linear infinite;
  animation-delay: -2s;
}

.wave2 use {
  fill: rgba(255, 255, 255, 0.2);
  animation: move-forever2 8s linear infinite;
  animation-delay: -2s;
}

.wave3 use {
  fill: rgba(255, 255, 255, 1);
  animation: move-forever3 6s linear infinite;
  animation-delay: -2s;
}

@keyframes move-forever1 {
  0% { transform: translate(85px, 0%); }
  100% { transform: translate(-90px, 0%); }
}

@keyframes move-forever2 {
  0% { transform: translate(-90px, 0%); }
  100% { transform: translate(85px, 0%); }
}

@keyframes move-forever3 {
  0% { transform: translate(-90px, 0%); }
  100% { transform: translate(85px, 0%); }
}

.hero-inner {
  padding-top: 200px;
  text-align: center;
  z-index: 3;
}
.hero-title-row {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  z-index: 5;
}
.hero-title {
  font-family: "MaplestoryLight";
  font-size: 42px;
  font-weight: 800;
  color: #fff;
}
.hero-badge {
  background: #6366f1;
  color: #fff;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}
.hero-subtitle {
  position: relative;
  margin: 12px 0 32px;
  color: #fff;
  z-index: 5;
}

.template-tabs {
  position: relative;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  z-index: 5;
}
.template-tab {
  padding: 10px 20px;
  border-radius: 12px;
  background: #fff;
  border: 2px solid transparent;
  cursor: pointer;
  font-weight: 600;
}
.template-tab.active {
  border-color: #6366f1;
  color: #6366f1;
}

.content-container {
  max-width: 1400px;
  margin: 32px auto;
}
.content-grid {
  display: flex;
  gap: 24px;
}

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
  transition: width 0.35s ease, opacity 0.35s ease, transform 0.35s ease;
  flex-shrink: 0;
}

.sidebar-card.expanded {
  width: 640px;
}

.sidebar-card.collapsed {
  width: 0;
  opacity: 0;
  transform: translateX(-12px);
  pointer-events: none;
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.width-toggle-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.width-toggle-btn:hover {
  background: #e5e7eb;
  border-color: #6366f1;
  color: #6366f1;
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
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  padding-bottom: 24px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.card-body::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.sidebar-footer-fixed {
  padding: 16px;
  border-top: 1px solid #eee;
  margin-top: auto;
  background: #fff;
}
.download-btn {
  width: 100%;
  padding: 12px;
  background: #6366f1;
  color: #fff;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.preview-card-wrap {
  flex: 1;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  transition: flex 0.35s ease;
}
.preview-card-wrap.expanded {
  flex: 1 1 100%;
}
.preview-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
}
.preview-body-wrap {
  flex: 1;
  display: flex;
  justify-content: center;
}
.preview-canvas {
  background: #fff;
  margin: 0 auto;
}

.show-sidebar-btn {
  position: fixed;
  top: 50px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #6366f1;
  background: #fff;
  color: #6366f1;
  cursor: pointer;
}

.template-select-btn {
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
}

.template-select-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.template-select-btn:active {
  transform: translateY(0);
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

.hero-section.wide-sidebar {
  width: calc(100vw - 640px);
  margin-left: calc(((calc(100vw - 640px) - 100%) / 2) * -1) !important;
}
.hero-section.no-sidebar,
.hero-section.no-sidebar.wide-sidebar {
  width: 100vw !important;
  margin-left: 0 !important;
}

.hero-waves.wide-sidebar {
  width: calc(100vw - 640px);
}
.hero-waves.no-sidebar,
.hero-waves.no-sidebar.wide-sidebar {
  width: 100vw !important;
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