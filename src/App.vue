<template>
  <div class="app-container" :class="{ 'sidebar-collapsed': !sidebarOpen }">
    <!-- 토글 버튼 -->
    <button class="sidebar-toggle" @click="toggleSidebar" :class="{ 'collapsed': !sidebarOpen }">
      <svg v-if="sidebarOpen" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15 5L10 10L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 5L3 10L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5 5L10 10L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 5L17 10L12 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- 사이드바 -->
    <aside class="sidebar" :class="{ 'collapsed': !sidebarOpen }">
      <div class="sidebar-content">
        <!-- 로고 영역 -->
        <div class="sidebar-header">
          <div class="logo">
            <div class="logo-icon">📧</div>
            <h1 class="logo-text">Email Builder</h1>
          </div>
        </div>

        <!-- 메뉴 -->
        <nav class="sidebar-nav">
          <div class="nav-item active">
            <span class="nav-icon">📝</span>
            <span class="nav-text">Templates</span>
          </div>
        </nav>

        <!-- 템플릿 선택기 -->
        <div class="sidebar-section">
          <TemplateSelector v-model="selectedTemplate" />
        </div>

        <!-- 템플릿 폼 -->
        <div class="sidebar-section" v-if="selectedTemplate">
          <TemplateForm 
            :template="selectedTemplate" 
            v-model="formData"
            :templateConfig="getTemplateConfig(selectedTemplate)"
            :selectedHotspotId="selectedHotspotId"
            @select-hotspot="handleSelectHotspot"
          />
        </div>

        <!-- 다운로드 버튼 -->
        <div class="sidebar-footer">
          <button @click="handleDownload" class="download-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4.66669 6.66667L8.00002 10L11.3334 6.66667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 10V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            HTML 다운로드
          </button>
        </div>
      </div>
    </aside>

    <!-- 메인 콘텐츠 -->
    <main class="main-content">
      <div class="content-header">
        <div class="header-info">
          <h2 class="content-title">Email Template Preview</h2>
          <p class="content-subtitle">실시간으로 이메일 템플릿을 편집하고 미리보기 하세요</p>
        </div>
      </div>

      <div class="preview-container">
        <PreviewFrame 
          :template="selectedTemplate" 
          :formData="formData"
          :selectedHotspotId="selectedHotspotId"
          @select-hotspot="handleSelectHotspot"
          @update-hotspot="handleUpdateHotspot"
        />
      </div>
    </main>
  </div>
</template>

<script>
import TemplateSelector from './components/TemplateSelector.vue'
import TemplateForm from './components/TemplateForm.vue'
import PreviewFrame from './components/PreviewFrame.vue'
import { downloadHtml } from './utils/downloadHtml.js'
import { templateDefaults } from './config/templateDefaults.js'

export default {
  components: { TemplateSelector, TemplateForm, PreviewFrame },
  data() {
    return {
      selectedTemplate: 'em-type-1',
      formData: this.extractValues(templateDefaults['em-type-1']),
      selectedHotspotId: null,
      sidebarOpen: true
    }
  },
  watch: {
    selectedTemplate(newTemplate) {
      this.formData = this.extractValues(templateDefaults[newTemplate])
      this.selectedHotspotId = null
    }
  },
  methods: {
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
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
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

/* App Container */
.app-container {
  display: flex;
  height: 100vh;
  background: #f5f7fa;
  position: relative;
}

/* Sidebar Toggle Button */
.sidebar-toggle {
  position: fixed;
  left: 280px;
  top: 20px;
  z-index: 1001;
  width: 36px;
  height: 36px;
  background: #1a1d29;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.sidebar-toggle:hover {
  background: #2a2d3a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.sidebar-toggle.collapsed {
  left: 20px;
}

.app-container.sidebar-collapsed .sidebar-toggle {
  left: 20px;
}

/* Sidebar */
.sidebar {
  width: 350px;
  background: #1a1d29;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1000;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar.collapsed {
  transform: translateX(-100%);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* Sidebar Header */
.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.logo-text {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

/* Sidebar Navigation */
.sidebar-nav {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.nav-item.active {
  background: rgba(102, 126, 234, 0.15);
  color: #fff;
}

.nav-icon {
  font-size: 18px;
}

/* Sidebar Sections */
.sidebar-section {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
}

.sidebar-section:last-of-type {
  flex: 1;
  border-bottom: none;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

/* Download Button */
.download-btn {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.download-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.download-btn:active {
  transform: translateY(0);
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Content Header */
.content-header {
  padding: 24px 32px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.header-info {
  max-width: 1200px;
  margin: 0 auto;
}

.content-title {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a1d29;
  letter-spacing: -0.5px;
}

.content-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

/* Preview Container */
.preview-container {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background: #f5f7fa;
}

/* Scrollbar Styling */
.sidebar-section::-webkit-scrollbar,
.preview-container::-webkit-scrollbar {
  width: 6px;
}

.sidebar-section::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-section::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar-section::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.preview-container::-webkit-scrollbar-track {
  background: transparent;
}

.preview-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.preview-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    width: 280px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
  }
  
  .main-content {
    margin-left: 0;
  }
}
</style>