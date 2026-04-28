<template>
  <div class="item-templates" :class="{ 'no-sidebar': !sidebarOpen, 'wide-sidebar': sidebarExpanded }">
    <div class="main-container">
      <!-- HERO -->
      <section class="hero-section" :class="{ 'no-sidebar': !sidebarOpen, 'wide-sidebar': sidebarExpanded }">
        <div class="hero-bg-glow" aria-hidden="true"></div>
        <div class="hero-inner">
          <div class="hero-panel">
            <div class="hero-panel-head">
              <div class="hero-panel-titles">
                <p class="hero-eyebrow">문서 템플릿</p>
                <h1 class="hero-title">Item Template Builder</h1>
              </div>
              <span class="hero-status-chip" title="현재 편집 중인 템플릿">{{ selectedTemplateLabel }}</span>
            </div>
            <p class="hero-subtitle">
              약관 및 문서 템플릿을 편집·미리보기한 뒤 HTML로 내려받을 수 있습니다
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
          <aside
            class="sidebar-card"
            :class="[sidebarTemplateLayoutClass, { collapsed: !sidebarOpen, expanded: sidebarExpanded }]"
          >
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
                  :sidebarExpanded="sidebarExpanded"
                  :privacy-preview-focus="privacyPreviewFocus"
                  @active-section-index="activePreviewIndex = $event"
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
          <main class="preview-card-wrap" :class="{ expanded: !sidebarOpen }">
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
                  :template="selectedTemplate"
                  :formData="formData"
                  deviceType="web"
                  :activeIndex="activePreviewIndex"
                  @privacy-preview-focus="privacyPreviewFocus = $event"
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
  name: 'ItemTemplates',
  components: { TemplateForm, PreviewFrame, TemplateSelectModal },
  data() {
    return {
      selectedTemplate: 'privacy-policy',
      formData: this.extractValues(templateDefaults['privacy-policy']),
      sidebarOpen: true,
      sidebarExpanded: false,
      isModalOpen: false,
      activePreviewIndex: null,
      privacyPreviewFocus: null,
      templates: [
        { value: 'privacy-policy', name: '개인정보처리방침', icon: '', description: '테이블 기반 약관' }
      ]
    }
  },
  mounted() {
    document.body.classList.add('page-item-templates')
    this.updateBodyClass()
  },
  beforeDestroy() {
    document.body.classList.remove('page-item-templates', 'sidebar-closed', 'sidebar-expanded')
  },
  watch: {
    selectedTemplate(newTemplate) {
      this.formData = this.extractValues(templateDefaults[newTemplate])
    },
    sidebarOpen() { this.updateBodyClass() },
    sidebarExpanded() { this.updateBodyClass() }
  },
  methods: {
    extractValues(config) {
      if (!config) return {}
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
    selectTemplate(value) {
      this.selectedTemplate = value
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
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    toggleSidebarWidth() {
      this.sidebarExpanded = !this.sidebarExpanded
    },
    updateBodyClass() {
      document.body.classList.remove('sidebar-closed', 'sidebar-expanded')
      if (!this.sidebarOpen) {
        document.body.classList.add('sidebar-closed')
      } else if (this.sidebarExpanded) {
        document.body.classList.add('sidebar-expanded')
      }
    }
  },
  computed: {
    selectedTemplateLabel() {
      const t = this.templates.find((x) => x.value === this.selectedTemplate)
      return t ? t.name : this.selectedTemplate
    },
    /** 폼 영역 스타일 분기: 개인정보처리방침(privacy-policy) 템플릿일 때 / 그 외 */
    sidebarTemplateLayoutClass() {
      return this.selectedTemplate === 'privacy-policy'
        ? 'sidebar-card--template-privacy-policy'
        : 'sidebar-card--template-default'
    }
  }
}
</script>

<style scoped>
:root {
  --sidebar-wid: 320px;
}
.item-templates {
  padding-left: 320px;
  transition: padding-left var(--template-layout-duration, 0.35s) var(--template-layout-ease, cubic-bezier(0.4, 0, 0.2, 1));
}
.item-templates.wide-sidebar {
  padding-left: 640px;
}
.item-templates.no-sidebar,
.item-templates.no-sidebar.wide-sidebar {
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
  border-color: var(--hero-accent);
  color: var(--hero-accent-deep);
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
  flex: 1;
  overflow-y: auto;
  padding: 20px;
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
  padding: 16px;
  border-top: 1px solid #eee;
  background: #fff;
}
.download-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, var(--hero-accent) 0%, var(--hero-accent-deep) 100%);
  color: #fff;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

/* PREVIEW */
.preview-card-wrap {
  flex: 1;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  transition: flex var(--template-layout-duration, 0.35s) var(--template-layout-ease, cubic-bezier(0.4, 0, 0.2, 1));
}
.preview-card-wrap.expanded {
  flex: 1 1 100%;
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
  border: 1px solid var(--hero-accent);
  background: #fff;
  color: var(--hero-accent-deep);
  cursor: pointer;
}

.template-select-btn {
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--hero-accent) 0%, var(--hero-accent-deep) 100%);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgb(55 60 143 / 28%);
}
.template-select-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgb(55 60 143 / 34%);
}
.template-select-btn .btn-icon { font-size: 18px; }
.template-select-btn .btn-text { flex: 1; text-align: left; }
</style>
