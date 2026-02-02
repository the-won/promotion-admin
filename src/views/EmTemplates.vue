<template>
  <div class="em-templates" :class="{ 'no-sidebar': !sidebarOpen, 'wide-sidebar': sidebarExpanded }">
    <div class="main-container">
      <!-- HERO -->
      <section class="hero-section" :class="{ 'no-sidebar': !sidebarOpen, 'wide-sidebar': sidebarExpanded }">
        <div class="hero-inner">
          <div class="hero-title-row">
            <h1 class="hero-title">Email Template Builder</h1>
            <span class="hero-badge">{{ selectedTemplate }}</span>
          </div>
          <p class="hero-subtitle">
            실시간으로 이메일 템플릿을 편집하고 미리보기 하세요
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
          <main class="preview-card" :class="{ expanded: !sidebarOpen }">
            <header class="preview-header">
              <h3 class="preview-title">템플릿 미리보기<sub class="preview-subtitle">(실시간 렌더링</sub>
              </h3>
              
              <button
                v-if="!sidebarOpen"
                class="show-sidebar-btn"
                @click="toggleSidebar"
              >
                설정 열기
              </button>
            </header>

            <div class="preview-body">
              <div class="preview-canvas">
                <PreviewFrame
                  ref="previewFrame"
                  :template="selectedTemplate"
                  :formData="formData"
                  :selectedHotspotId="selectedHotspotId"
                  @select-hotspot="handleSelectHotspot"
                  @update-hotspot="handleUpdateHotspot"
                  @delete-hotspot="handleDeleteHotspot"
                  @scroll-update="handlePreviewScroll"
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
import { templateDefaults } from '../config/templateDefaults'

export default {
  name: 'EmTemplates',
  components: { TemplateForm, PreviewFrame, TemplateSelectModal },
  data() {
    return {
      selectedTemplate: 'em-type-1',
      formData: this.extractValues(templateDefaults['em-type-1']),
      selectedHotspotId: null,
      sidebarOpen: true,
      sidebarExpanded: false,
      isModalOpen: false,
      visibleTopPositions: { 1: 10, 2: 10 },
      visibleScrollPosition: { scrollTop: 0, viewportHeight: 400 },
      templates: [
        { value: 'em-type-1', name: 'Type 1', icon: '📄', description: '기본 텍스트 템플릿' },
        { value: 'em-type-2', name: 'Image Link', icon: '🖼️', description: '이미지 중심 템플릿' },
        { value: 'em-type-3', name: 'Image Map', icon: '📦', description: '이벤트 이미지맵 템플릿' },
        { value: 'em-type-4', name: 'Type 4', icon: '📰', description: '뉴스레터 템플릿' },
        { value: 'em-type-5', name: '비밀특가', icon: '🔥', description: '핫스팟 인터랙티브 템플릿' },
        { value: 'em-type-imagemap', name: 'Use Map', icon: '🗺️', description: '이미지맵 템플릿' }
      ]
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
    sidebarOpen(val) {
      this.updateBodyClass()
    },
    sidebarExpanded(val) {
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
    handleDownload() {
      downloadHtml(this.selectedTemplate, this.formData)
    },
    handleSelectHotspot(id) {
      this.selectedHotspotId = id
    },
    handleUpdateHotspot(updatedHotspot, hotspotsKey) {
      if (hotspotsKey && this.formData[hotspotsKey]) {
        const index = this.formData[hotspotsKey].findIndex(h => h.id === updatedHotspot.id)
        if (index !== -1) {
          this.formData[hotspotsKey].splice(index, 1, updatedHotspot)
        }
      } else if (this.formData.hotspots) {
        const index = this.formData.hotspots.findIndex(h => h.id === updatedHotspot.id)
        if (index !== -1) {
          this.formData.hotspots.splice(index, 1, updatedHotspot)
        }
      }
    },
    handleDeleteHotspot(id) {
      const keys = ['hotspots1', 'hotspots2', 'hotspots', 'imageMapAreas']
      for (const key of keys) {
        if (this.formData[key]) {
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
  --sidebar-wid: 300px;
}
.em-templates {
  padding-left: 300px;
  transition: padding-left 0.35s ease;
}
.em-templates.wide-sidebar {
  padding-left: 600px;
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


/* HERO */
.hero-section {
  filter: saturate(180%);
  width: calc(100vw - 300px);
  margin-left: calc(((calc(100vw - 300px) - 100%) / 2) * -1) !important;
  transition: width 0.35s ease, margin-left 0.35s ease;
  height: 550px !important;
  position: relative;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% -175px;
  background-image: url("https://blog.kakaocdn.net/dna/chZ3BL/btrIzFMbJ4r/AAAAAAAAAAAAAAAAAAAAABENuT3xPS7CJMvqaXXBeDrNUpAzW1mo5v_bn74HoZYO/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=nzR1osduT8%2FrzQVkwuLlHHE2AgE%3D");
  background-image: url("https://blog.kakaocdn.net/dna/deimrK/btr7PkDl3hZ/AAAAAAAAAAAAAAAAAAAAAPxYo3lgm_PEF6lk6qTSQp7wutn5DnJWfqjpYWjAKfez/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1772290799&allow_ip=&allow_referer=&signature=e1Y1Xh5RVmixUiQ8fgBHdVoGHYg%3D");
  background-image: url("https://blog.kakaocdn.net/dna/b5Wezm/btr8gVDgmhW/AAAAAAAAAAAAAAAAAAAAAJVwI6VP9s5H7t6ByZ_PPuZvybQz-abYRTGNM_HOV7fz/img.webp?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1772290799&allow_ip=&allow_referer=&signature=ACFLzGWfyRcRydaVZO%2BLPU6Us4Y%3D");
  /* background-image: url("https://blog.kakaocdn.net/dna/c74F1G/btrzKSgdFwa/AAAAAAAAAAAAAAAAAAAAADIhaE5YkgarnddnHcFS3XI2ctPHRUmGFUz8wLQ-60jR/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1772290799&allow_ip=&allow_referer=&signature=yFepALoo48N01A4f86qTtyMMx3o%3D"); */
  --thumbnail-blur: 0px;
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
  width: calc(100vw - 300px);
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

/* TABS */
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
  width: 300px;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0px;
  bottom: 0;
  left: 0;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 2%);
  z-index: 20;
}

.sidebar-card.expanded {
  width: 600px;
}

.sidebar-card {
  transition: width 0.35s ease, opacity 0.35s ease, transform 0.35s ease;
  flex-shrink: 0;
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
}
.sidebar-footer-fixed {
  padding: 16px;
  border-top: 1px solid #eee;
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

/* PREVIEW */
.preview-card {
  flex: 1;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
}
.preview-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
}
.preview-body {
  flex: 1;
  display: flex;
  justify-content: center;
}
.preview-canvas {
  background: #fff;
  margin: 0 auto;
}

.preview-card {
  transition: flex 0.35s ease;
}

.preview-card.expanded {
  flex: 1 1 100%;
}

.show-sidebar-btn {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #6366f1;
  background: #fff;
  color: #6366f1;
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

/* hero-section 반응형 width */
.hero-section.wide-sidebar {
  width: calc(100vw - 600px);
  margin-left: calc(((calc(100vw - 600px) - 100%) / 2) * -1) !important;
}
.hero-section.no-sidebar,
.hero-section.no-sidebar.wide-sidebar {
  width: 100vw !important;
  margin-left: 0 !important;
}

/* hero-waves 반응형 width */
.hero-waves.wide-sidebar {
  width: calc(100vw - 600px);
}
.hero-waves.no-sidebar,
.hero-waves.no-sidebar.wide-sidebar {
  width: 100vw !important;
}
</style>