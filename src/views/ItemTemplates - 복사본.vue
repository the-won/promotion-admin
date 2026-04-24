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
    }
  }
}
</script>

<style scoped>
:root {
  --sidebar-wid: 320px;
}
.item-templates {
  --hero-accent: #5c61d4;
  --hero-accent-deep: #373c8f;
  padding-left: 320px;
  transition: padding-left 0.35s ease;
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
  transition: max-width 0.35s ease;
}
.no-sidebar .main-container,
.no-sidebar.wide-sidebar .main-container {
  max-width: none !important;
}

/* HERO — 패딩 기반 낮은 히어로, 그라데이션 + 노이즈 + 글로, 웨이브 없음 */
.hero-section {
  width: calc(100vw - 320px);
  margin-left: calc(((calc(100vw - 320px) - 100%) / 2) * -1) !important;
  transition: width 0.35s ease, margin-left 0.35s ease;
  position: relative;
  overflow: hidden;
  padding: 28px 24px 32px;
  border-radius: 0;
  background:
    radial-gradient(ellipse 120% 80% at 100% 0%, rgb(92 97 212 / 18%) 0%, transparent 55%),
    radial-gradient(ellipse 90% 70% at 0% 100%, rgb(67 56 202 / 10%) 0%, transparent 50%),
    linear-gradient(155deg, #0e111c 0%, #15182c 44%, #121c2e 100%);
  box-shadow: 0 16px 36px rgb(15 23 42 / 22%);
}
.hero-section::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.36;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
  mix-blend-mode: overlay;
}
.hero-bg-glow {
  position: absolute;
  width: 420px;
  height: 420px;
  top: -180px;
  right: -80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(99 102 241 / 14%) 0%, rgb(79 70 229 / 8%) 42%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
@media (prefers-reduced-motion: no-preference) {
  .hero-bg-glow {
    animation: hero-glow-drift 18s ease-in-out infinite alternate;
  }
}
@keyframes hero-glow-drift {
  from {
    transform: translate(0, 0) scale(1);
    opacity: 0.85;
  }
  to {
    transform: translate(-24px, 12px) scale(1.06);
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero-bg-glow {
    animation: none;
  }
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  text-align: left;
}
.hero-panel {
  margin-top: 50px;
  padding: 22px 24px 20px;
  border-radius: 16px;
  background: rgb(255 255 255 / 8%);
  border: 1px solid rgb(255 255 255 / 12%);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 10%) inset,
    0 18px 44px rgb(0 0 0 / 14%);
}
.hero-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.hero-panel-titles {
  min-width: 0;
}
.hero-eyebrow {
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(226 232 240 / 55%);
}
.hero-title {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: clamp(1.35rem, 2.5vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: #f8fafc;
}
.hero-status-chip {
  flex-shrink: 0;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: #eef2ff;
  background: linear-gradient(135deg, rgb(92 97 212 / 44%) 0%, rgb(55 60 143 / 52%) 100%);
  border: 1px solid rgb(199 210 254 / 18%);
  box-shadow: 0 0 0 1px rgb(0 0 0 / 10%);
}
.hero-subtitle {
  margin: 14px 0 18px;
  max-width: 52ch;
  font-size: 14px;
  line-height: 1.55;
  color: rgb(226 232 240 / 78%);
}

/* TABS */
.template-tabs {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}
.template-tab {
  padding: 9px 16px;
  border-radius: 10px;
  background: rgb(255 255 255 / 93%);
  border: 1px solid rgb(255 255 255 / 28%);
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  color: #334155;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
}
.template-tab:hover {
  border-color: rgb(92 97 212 / 38%);
  color: var(--hero-accent-deep);
}
.template-tab.active {
  border-color: var(--hero-accent);
  color: var(--hero-accent-deep);
  box-shadow: 0 0 0 2px rgb(92 97 212 / 14%);
}
.template-tab:focus-visible {
  outline: 2px solid var(--hero-accent);
  outline-offset: 2px;
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
  transition: flex 0.35s ease;
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

/* hero-section 반응형 width */
.hero-section.wide-sidebar {
  width: calc(100vw - 640px);
  margin-left: calc(((calc(100vw - 640px) - 100%) / 2) * -1) !important;
}
.hero-section.no-sidebar,
.hero-section.no-sidebar.wide-sidebar {
  width: 100vw !important;
  margin-left: 0 !important;
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
