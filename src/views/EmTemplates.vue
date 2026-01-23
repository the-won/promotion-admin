<template>
  <div>
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
</template>

<script>
import TemplateForm from '../components/TemplateForm.vue'
import PreviewFrame from '../components/PreviewFrame.vue'
import { downloadHtml } from '../utils/downloadHtml.js'
import { templateDefaults } from '../config/templateDefaults.js'

export default {
  name: 'EmTemplates',
  components: { TemplateForm, PreviewFrame },
  data() {
    return {
      selectedTemplate: 'em-type-1',
      formData: this.extractValues(templateDefaults['em-type-1']),
      selectedHotspotId: null,
      sidebarOpen: true,
      visibleTopPositions: { 1: 10, 2: 10 },
      visibleScrollPosition: { scrollTop: 0, viewportHeight: 400 },
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
      this.$nextTick(() => {
        this.updateVisiblePositions()
      })
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleWindowScroll, { passive: true })
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
      if (this.formData.hotspots) {
        const index = this.formData.hotspots.findIndex(h => h.id === id)
        if (index !== -1) {
          this.formData.hotspots.splice(index, 1)
          this.selectedHotspotId = null
          return
        }
      }
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
    selectTemplate(templateValue) {
      this.selectedTemplate = templateValue
    },
    handlePreviewScroll() {
      this.updateVisiblePositions()
    }
  }
}
</script>

<style scoped>
/* Hero Section */
.hero-section {
  padding: 48px 32px 60px;
  text-align: center;
  background: linear-gradient(to bottom, #c7b8ea 0%, #f5e6d3 100%);
  margin: -32px -32px 32px -32px;
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

.template-tabs {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.template-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.content-grid {
  display: flex;
  gap: 24px;
  align-items: start;
}

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
  padding-bottom: 80px;
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
}

@media (max-width: 768px) {
  .template-tabs {
    gap: 8px;
  }
  
  .template-tab {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>