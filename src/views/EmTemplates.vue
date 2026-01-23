<template>
  <div class="em-templates">
    <!-- HERO -->
    <section class="hero-section">
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

    <!-- CONTENT -->
    <div class="content-container">
      <div class="content-grid">
        <!-- SIDEBAR -->
        <aside class="sidebar-card" :class="{ collapsed: !sidebarOpen }">
          <header class="card-header">
            <h3 class="card-title">템플릿 설정</h3>
            <button class="close-btn" @click="toggleSidebar">✕</button>
          </header>

          <div class="card-body">
            <section class="sidebar-section">
              <h4 class="section-title">기본 설정</h4>
              <TemplateForm
                :template="selectedTemplate"
                v-model="formData"
                :templateConfig="getTemplateConfig(selectedTemplate)"
                :selectedHotspotId="selectedHotspotId"
                :visibleTopPositions="visibleTopPositions"
                :visibleScrollPosition="visibleScrollPosition"
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
</template>

<script>
import TemplateForm from '../components/TemplateForm.vue'
import PreviewFrame from '../components/PreviewFrame.vue'
import { downloadHtml } from '../utils/downloadHtml'
import { templateDefaults } from '../config/templateDefaults'

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
/* HERO */
.hero-section {
  background: linear-gradient(180deg, #c7b8ea, #f5e6d3);
  padding: 56px 32px;
}
.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}
.hero-title-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
.hero-title {
  font-size: 42px;
  font-weight: 800;
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
  margin: 12px 0 32px;
  color: #4b5563;
}

/* TABS */
.template-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
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
  width: 360px;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 100px;
}
.card-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
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
  background: #f9fafb;
  /* padding: 32px; */
  flex: 1;
  display: flex;
  justify-content: center;
}
.preview-canvas {
  background: #fff;
  /* padding: 24px; */
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

/* ===== SIDEBAR TOGGLE ===== */
.sidebar-card {
  transition: width 0.35s ease, opacity 0.25s ease, transform 0.35s ease;
  flex-shrink: 0;
}

.sidebar-card.collapsed {
  width: 0;
  opacity: 0;
  transform: translateX(-12px);
  pointer-events: none;
  overflow: hidden;
}

/* ===== PREVIEW EXPAND ===== */
.preview-card {
  transition: flex 0.35s ease;
}

.preview-card.expanded {
  flex: 1 1 100%;
}

/* ===== SHOW SIDEBAR BUTTON ===== */
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

/* ===== SIDEBAR INTERNAL SCROLL ===== */
.sidebar-card {
  max-height: calc(100vh - 140px); /* hero + 여백 고려 */
  overflow: hidden;
}

.card-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 24px;
    scrollbar-width: none;        /* Firefox */
  -ms-overflow-style: none;     /* IE / Edge */
}
.card-body::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* footer 항상 하단 고정 */
.sidebar-footer-fixed {
  margin-top: auto;
  background: #fff;
}


</style>
