<template>
  <div class="app-wrapper">
    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo">
          <div class="logo-icon">📧</div>
          <span class="logo-text">EmailBuilder</span>
        </div>
      </div>

      <nav class="header-center">
        <a href="#" class="nav-link active">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 6L8 2L14 6V13C14 13.2652 13.8946 13.5196 13.7071 13.7071C13.5196 13.8946 13.2652 14 13 14H3C2.73478 14 2.48043 13.8946 2.29289 13.7071C2.10536 13.5196 2 13.2652 2 13V6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 14V8H10V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Home
        </a>
        <a href="#" class="nav-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M11.3333 14V12.6667C11.3333 11.9594 11.0524 11.2811 10.5523 10.781C10.0522 10.281 9.37391 10 8.66667 10H3.33333C2.62609 10 1.94781 10.281 1.44772 10.781C0.947622 11.2811 0.666667 11.9594 0.666667 12.6667V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.00001 7.33333C7.47277 7.33333 8.66668 6.13943 8.66668 4.66667C8.66668 3.19391 7.47277 2 6.00001 2C4.52725 2 3.33334 3.19391 3.33334 4.66667C3.33334 6.13943 4.52725 7.33333 6.00001 7.33333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.3333 14V12.6667C15.3328 12.0758 15.1362 11.5019 14.7742 11.0349C14.4123 10.5679 13.9053 10.2344 13.3333 10.0867" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.6667 2.08667C11.2403 2.23354 11.7488 2.56714 12.1118 3.03488C12.4748 3.50262 12.672 4.07789 12.672 4.67C12.672 5.26212 12.4748 5.83739 12.1118 6.30513C11.7488 6.77287 11.2403 7.10647 10.6667 7.25334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Templates
        </a>
        <a href="#" class="nav-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 2H2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V3C15 2.44772 14.5523 2 14 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1 6H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Settings
        </a>
      </nav>

      <div class="header-right">
        <button class="icon-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3V17M3 10H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="icon-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 7.5C15 6.83696 14.7366 6.20107 14.2678 5.73223C13.7989 5.26339 13.163 5 12.5 5C11.837 5 11.2011 5.26339 10.7322 5.73223C10.2634 6.20107 10 6.83696 10 7.5V10H12.5C13.163 10 13.7989 9.73661 14.2678 9.26777C14.7366 8.79893 15 8.16304 15 7.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </button>
        <button class="icon-btn notification-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 6.66667C15 5.34058 14.4732 4.06881 13.5355 3.13113C12.5979 2.19345 11.3261 1.66667 10 1.66667C8.67392 1.66667 7.40215 2.19345 6.46447 3.13113C5.52678 4.06881 5 5.34058 5 6.66667C5 12.5 2.5 14.1667 2.5 14.1667H17.5C17.5 14.1667 15 12.5 15 6.66667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.4417 17.5C11.2952 17.7526 11.0849 17.9622 10.8319 18.1079C10.5789 18.2537 10.292 18.3304 10 18.3304C9.70802 18.3304 9.42116 18.2537 9.16815 18.1079C8.91513 17.9622 8.70481 17.7526 8.55835 17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="notification-badge">2</span>
        </button>
        <div class="user-avatar">
          <img src="https://i.pravatar.cc/40?img=12" alt="User" />
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <div class="hero-section">
      <h1 class="hero-title">Hey, Email Template 👋</h1>
      <p class="hero-subtitle">실시간으로 이메일 템플릿을 편집하고 미리보기 하세요</p>
      
      <!-- Template Selector Tabs -->
      <div class="template-tabs">
        <button 
          v-for="template in templates" 
          :key="template.value"
          class="template-tab"
          :class="{ 'active': selectedTemplate === template.value }"
          @click="selectTemplate(template.value)"
        >
          <span class="tab-icon">{{ template.icon }}</span>
          <span class="tab-text">{{ template.name }}</span>
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="content-wrapper">
      <div class="content-container">
        <div class="content-grid">
          <!-- Left Sidebar Card -->
          <aside class="sidebar-card" :class="{ 'collapsed': !sidebarOpen }">
            <div class="card-header">
              <h3 class="card-title">템플릿 설정</h3>
              <button class="close-btn" @click="toggleSidebar">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <div class="card-body">
              <!-- Template Form -->
              <div class="sidebar-section sidebar-form" v-if="selectedTemplate">
                <TemplateForm 
                  :template="selectedTemplate" 
                  v-model="formData"
                  :templateConfig="getTemplateConfig(selectedTemplate)"
                  :selectedHotspotId="selectedHotspotId"
                  :visibleTopPositions="visibleTopPositions"
                  :visibleScrollPosition="visibleScrollPosition"
                  @select-hotspot="handleSelectHotspot"
                />
              </div>
            </div>

            <!-- Download Button (Fixed at bottom) -->
            <div class="sidebar-footer-fixed">
              <button @click="handleDownload" class="download-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4.66669 6.66667L8.00002 10L11.3334 6.66667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 10V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                HTML 다운로드
              </button>
            </div>
          </aside>

          <!-- Right Preview Card -->
          <main class="preview-card" :class="{ 'expanded': !sidebarOpen }">
            <div class="preview-header">
              <h3 class="preview-title">미리보기</h3>
              <button v-if="!sidebarOpen" class="show-sidebar-btn" @click="toggleSidebar">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                편집 메뉴 열기
              </button>
            </div>
            <div class="preview-body">
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
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TemplateForm from './components/TemplateForm.vue'
import PreviewFrame from './components/PreviewFrame.vue'
import { downloadHtml } from './utils/downloadHtml.js'
import { templateDefaults } from './config/templateDefaults.js'

export default {
  components: { TemplateForm, PreviewFrame },
  data() {
    return {
      selectedTemplate: 'em-type-1',
      formData: this.extractValues(templateDefaults['em-type-1']),
      selectedHotspotId: null,
      sidebarOpen: true,
      visibleTopPositions: { 1: 10, 2: 10 }, // 각 이미지별 현재 보이는 영역의 top 위치
      visibleScrollPosition: { scrollTop: 0, viewportHeight: 400 }, // 스크롤 위치 정보
      templates: [
        { value: 'em-type-1', name: 'Type 1', icon: '📄' },
        { value: 'em-type-2', name: 'Type 2', icon: '🖼️' },
        { value: 'em-type-3', name: 'Type 3', icon: '📦' },
        { value: 'em-type-4', name: 'Type 4', icon: '📰' },
        { value: 'em-type-5', name: 'Type 5', icon: '🔥' },
        { value: 'em-type-imagemap', name: 'Image Map', icon: '🗺️' }
      ]
    }
  },
  watch: {
    selectedTemplate(newTemplate) {
      this.formData = this.extractValues(templateDefaults[newTemplate])
      this.selectedHotspotId = null
      // 템플릿 변경 시 스크롤 위치 초기화
      this.$nextTick(() => {
        this.updateVisiblePositions()
      })
    }
  },
  mounted() {
    // window 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', this.handleWindowScroll, { passive: true })
    
    // 초기 로딩 후 스크롤 위치 업데이트
    this.$nextTick(() => {
      setTimeout(() => {
        this.updateVisiblePositions()
      }, 100)
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleWindowScroll)
  },
  methods: {
    handleWindowScroll() {
      this.updateVisiblePositions()
    },
    updateVisiblePositions() {
      const previewFrame = this.$refs.previewFrame
      if (previewFrame) {
        // EmType3용 위치
        if (typeof previewFrame.getVisibleTopPosition === 'function') {
          this.visibleTopPositions = {
            1: previewFrame.getVisibleTopPosition(1),
            2: previewFrame.getVisibleTopPosition(2)
          }
        }
        // ImageMap용 위치
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
      // EmType3용 (hotspots1, hotspots2)
      if (this.formData.hotspots1) {
        const index1 = this.formData.hotspots1.findIndex(h => h.id === id)
        if (index1 !== -1) {
          this.formData.hotspots1.splice(index1, 1)
          this.selectedHotspotId = null
          return
        }
      }
      if (this.formData.hotspots2) {
        const index2 = this.formData.hotspots2.findIndex(h => h.id === id)
        if (index2 !== -1) {
          this.formData.hotspots2.splice(index2, 1)
          this.selectedHotspotId = null
          return
        }
      }
      // EmType4용 (hotspots)
      if (this.formData.hotspots) {
        const index = this.formData.hotspots.findIndex(h => h.id === id)
        if (index !== -1) {
          this.formData.hotspots.splice(index, 1)
          this.selectedHotspotId = null
          return
        }
      }
      // ImageMap용 (imageMapAreas)
      if (this.formData.imageMapAreas) {
        const index = this.formData.imageMapAreas.findIndex(a => a.id === id)
        if (index !== -1) {
          this.formData.imageMapAreas.splice(index, 1)
          this.selectedHotspotId = null
          return
        }
      }
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    selectTemplate(value) {
      this.selectedTemplate = value
    },
    handlePreviewScroll(scrollInfo) {
      // 스크롤 위치 정보 저장 (ImageMapEditor용)
      this.visibleScrollPosition = {
        scrollTop: scrollInfo.scrollTop,
        viewportHeight: scrollInfo.viewportHeight
      }
      
      // 각 이미지별 보이는 위치 업데이트
      this.updateVisiblePositions()
    }
  }
}
</script>

<style>
/* Reset & Base */
html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

img {
  vertical-align: top;
  border: none;
}

/* App Wrapper */
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5e6d3;
}

/* Header */
.app-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(to bottom, #c7b8ea 0%, rgba(199, 184, 234, 0.95) 100%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 18px;
  color: #1f2937;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(243, 244, 246, 0.7);
  padding: 4px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #1f2937;
  background: rgba(99, 102, 241, 0.08);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.95);
  color: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(249, 250, 251, 0.7);
  border: none;
  border-radius: 10px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  backdrop-filter: blur(10px);
}

.icon-btn:hover {
  background: rgba(243, 244, 246, 0.9);
  color: #1f2937;
}

.notification-btn {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 18px;
  height: 18px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(229, 231, 235, 0.6);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Hero Section */
.hero-section {
  padding: 48px 32px 60px;
  text-align: center;
  background: linear-gradient(to bottom, #c7b8ea 0%, #f5e6d3 100%);
}

.hero-title {
  margin: 0 0 12px 0;
  font-size: 48px;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: -1.5px;
}

.hero-subtitle {
  margin: 0 0 32px 0;
  font-size: 18px;
  color: #4b5563;
  font-weight: 400;
}

/* Template Tabs */
.template-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  max-width: 900px;
  margin: 0 auto;
}

.template-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid transparent;
  border-radius: 12px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.template-tab:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
}

.template-tab.active {
  background: #fff;
  border-color: #6366f1;
  color: #1f2937;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.tab-icon {
  font-size: 18px;
}

.tab-text {
  font-weight: 600;
}

/* Content Wrapper */
.content-wrapper {
  flex: 1;
  padding: 32px;
  margin-top: -30px;
  position: relative;
  z-index: 10;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
}

.content-grid {
  display: flex;
  gap: 24px;
  align-items: start;
}

/* Sidebar Card */
.sidebar-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  width: 360px;
  max-height: calc(100vh - 280px);
  overflow: hidden;
  position: sticky;
  top: 100px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-card.collapsed {
  width: 0;
  min-width: 0;
  opacity: 0;
  transform: translateX(-20px);
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to bottom, #fafbfc, #fff);
  flex-shrink: 0;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #ef4444;
}

.card-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px; /* 하단 고정 버튼 공간 확보 */
}

.sidebar-section {
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.sidebar-footer-fixed {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 24px;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

/* Download Button */
.download-btn {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.download-btn:active {
  transform: translateY(0);
}

/* Preview Card */
.preview-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  min-height: 600px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.preview-card.expanded {
  /* flex: 1이 이미 있어서 자동으로 확장됨 */
}

.preview-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(to bottom, #fafbfc, #fff);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.preview-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.show-sidebar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.show-sidebar-btn:hover {
  background: #f3f4f6;
  border-color: #6366f1;
  color: #6366f1;
}

.preview-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* Scrollbar */
.card-body::-webkit-scrollbar,
.preview-body::-webkit-scrollbar {
  width: 6px;
}

.card-body::-webkit-scrollbar-track,
.preview-body::-webkit-scrollbar-track {
  background: transparent;
}

.card-body::-webkit-scrollbar-thumb,
.preview-body::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.card-body::-webkit-scrollbar-thumb:hover,
.preview-body::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Responsive */
@media (max-width: 1200px) {
  .content-grid {
    flex-direction: column;
  }
  
  .sidebar-card {
    width: 100%;
    max-width: 100%;
    margin-bottom: 24px;
    position: relative;
    top: 0;
  }
  
  .sidebar-card.collapsed {
    display: none;
  }
  
  .preview-card.expanded {
    /* flex: 1 자동 적용 */
  }
}

@media (max-width: 768px) {
  .header-center {
    display: none;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 16px;
  }
  
  .template-tabs {
    gap: 8px;
  }
  
  .template-tab {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .content-wrapper {
    padding: 20px;
  }
}
</style>