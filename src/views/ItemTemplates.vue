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
              aria-label="설정 열기"
              @click="toggleSidebar"
            ></button>

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
    let _tpl = 'privacy-policy'
    try {
      const s = JSON.parse(localStorage.getItem('defaultLanding'))
      if (s && s.page === 'item-templates' && s.template) _tpl = s.template
    } catch {}
    return {
      selectedTemplate: _tpl,
      formData: this.extractValues(templateDefaults[_tpl]),
      sidebarOpen: true,
      sidebarExpanded: true,
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
      this.updateBodyClass()
    },
    toggleSidebarWidth() {
      this.sidebarExpanded = !this.sidebarExpanded
      this.updateBodyClass()
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


</style>
