<template>
  <div class="settings-page">
    <div class="settings-header">
      <div class="header-glow" aria-hidden="true"></div>
      <p class="settings-eyebrow">환경설정</p>
      <h1 class="settings-title">Settings</h1>
      <p class="settings-subtitle">앱 동작 방식을 원하는 대로 조정하세요.</p>
    </div>

    <div class="settings-body">
      <section class="settings-section">
        <div class="section-head">
          <div class="section-title-row">
            <h2 class="section-title">기본 시작 화면</h2>
            <transition name="chip-fade">
              <span v-if="savedIndicator" class="saved-chip" aria-live="polite">저장됨</span>
            </transition>
          </div>
          <p class="section-desc">앱을 열 때 처음 표시할 페이지와 템플릿을 선택합니다.</p>
        </div>

        <div class="page-groups" role="radiogroup" aria-label="기본 시작 페이지">
          <div
            v-for="group in pageGroups"
            :key="group.id"
            class="page-group"
            :class="{ active: selectedPage === group.id }"
          >
            <button
              class="page-radio-btn"
              :aria-checked="selectedPage === group.id"
              role="radio"
              @click="selectPage(group.id)"
            >
              <div class="radio-indicator" :class="{ checked: selectedPage === group.id }" aria-hidden="true">
                <div class="radio-inner"></div>
              </div>
              <span class="page-name">{{ group.label }}</span>
              <span v-if="group.templates.length" class="page-meta">{{ group.templates.length }}개 템플릿</span>
            </button>

            <transition name="expand">
              <div v-if="selectedPage === group.id" class="template-panel">
                <div v-if="group.templates.length" class="template-chips">
                  <button
                    v-for="t in group.templates"
                    :key="t.value"
                    class="template-chip"
                    :class="{ active: selectedTemplate === t.value }"
                    @click="selectTemplate(t.value)"
                  >
                    {{ t.name }}
                  </button>
                </div>
                <p v-else class="no-templates">아직 등록된 템플릿이 없습니다.</p>
              </div>
            </transition>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    let saved = null
    try { saved = JSON.parse(localStorage.getItem('defaultLanding')) } catch {}
    return {
      selectedPage: saved?.page || 'em-templates',
      selectedTemplate: saved?.template || 'em-type-2',
      savedIndicator: false,
      pageGroups: [
        {
          id: 'em-templates',
          label: 'EM Templates',
          templates: [
            { value: 'em-type-2', name: 'Image Link' },
            { value: 'em-type-imagemap', name: 'Use Map' },
            { value: 'em-type-coupon', name: '쿠폰혜택' },
            { value: 'em-type-letter', name: '베네레터' },
            { value: 'em-type-4', name: '이패밀리샵' },
            { value: 'em-type-5', name: '비밀특가' },
            { value: 'em-type-familysale', name: '패밀리세일' }
          ]
        },
        {
          id: 'event-templates',
          label: 'Event Templates',
          templates: [
            { value: 'em-type-1', name: 'Type 1' },
            { value: 'em-type-3', name: 'Image Map' }
          ]
        },
        {
          id: 'item-templates',
          label: 'Item Templates',
          templates: [
            { value: 'privacy-policy', name: '개인정보처리방침' }
          ]
        }
      ]
    }
  },
  methods: {
    selectPage(pageId) {
      this.selectedPage = pageId
      const group = this.pageGroups.find(g => g.id === pageId)
      this.selectedTemplate = group?.templates[0]?.value || ''
      this.save()
    },
    selectTemplate(templateValue) {
      this.selectedTemplate = templateValue
      this.save()
    },
    save() {
      localStorage.setItem('defaultLanding', JSON.stringify({
        page: this.selectedPage,
        template: this.selectedTemplate
      }))
      this.savedIndicator = true
      clearTimeout(this._saveTimer)
      this._saveTimer = setTimeout(() => { this.savedIndicator = false }, 1800)
    }
  },
  beforeDestroy() {
    clearTimeout(this._saveTimer)
  }
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: oklch(96% 0.008 265);
  padding: 56px 32px 80px;
}

.settings-header {
  position: relative;
  max-width: 720px;
  margin: 40px auto 48px;
  overflow: hidden;
  padding: 0 4px;
}

.header-glow {
  position: absolute;
  right: -40px;
  top: -30px;
  width: 360px;
  height: 240px;
  background: radial-gradient(ellipse, oklch(72% 0.18 267 / 18%) 0%, transparent 68%);
  border-radius: 50%;
  pointer-events: none;
}

.settings-eyebrow {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: oklch(52% 0.20 267);
}

.settings-title {
  margin: 0 0 10px;
  font-size: 2.6rem;
  font-weight: 700;
  letter-spacing: -0.045em;
  color: oklch(14% 0.028 265);
  line-height: 1.1;
}

.settings-subtitle {
  margin: 0;
  font-size: 14px;
  color: oklch(50% 0.025 265);
  line-height: 1.5;
}

.settings-body {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-section {
  background: oklch(99.5% 0.004 265);
  border: 1px solid oklch(88% 0.020 265);
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 1px 2px oklch(20% 0.05 265 / 4%),
    0 8px 32px oklch(20% 0.05 265 / 6%);
}

.section-head {
  padding: 24px 24px 20px;
  background: linear-gradient(135deg, oklch(93% 0.048 267) 0%, oklch(98.5% 0.010 265) 65%);
  border-bottom: 1px solid oklch(88% 0.028 267);
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.section-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: oklch(18% 0.025 265);
}

.saved-chip {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 100px;
  background: oklch(88% 0.10 160);
  color: oklch(32% 0.12 160);
  letter-spacing: 0.01em;
}

.section-desc {
  margin: 0;
  font-size: 13px;
  color: oklch(50% 0.025 265);
  line-height: 1.5;
}

.page-groups {
  padding: 16px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-group {
  border-radius: 12px;
  border: 1.5px solid oklch(90% 0.018 265);
  background: oklch(99% 0.003 265);
  overflow: hidden;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

.page-group.active {
  border-color: oklch(52% 0.20 267);
  background: oklch(96% 0.025 267);
  box-shadow:
    0 0 0 3px oklch(52% 0.20 267 / 10%),
    0 4px 16px oklch(44% 0.22 267 / 10%);
}

.page-radio-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.page-radio-btn:hover {
  background: oklch(94% 0.015 267 / 50%);
}

.page-group.active .page-radio-btn:hover {
  background: oklch(91% 0.038 267 / 50%);
}

.radio-indicator {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid oklch(74% 0.030 265);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, background 0.2s;
}

.radio-indicator.checked {
  border-color: oklch(52% 0.20 267);
  background: oklch(52% 0.20 267);
}

.radio-inner {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: oklch(99% 0 0);
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.15s, transform 0.15s;
}

.radio-indicator.checked .radio-inner {
  opacity: 1;
  transform: scale(1);
}

.page-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: oklch(20% 0.025 265);
  letter-spacing: -0.01em;
}

.page-meta {
  font-size: 12px;
  color: oklch(58% 0.020 265);
  flex-shrink: 0;
  background: oklch(92% 0.012 265);
  padding: 2px 8px;
  border-radius: 100px;
  font-weight: 500;
}

.template-panel {
  padding: 12px 16px 16px;
  border-top: 1px solid oklch(86% 0.030 267);
}

.template-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-chip {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid oklch(86% 0.020 265);
  background: oklch(97% 0.006 265);
  color: oklch(36% 0.035 265);
  transition: background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s;
  letter-spacing: -0.01em;
}

.template-chip:hover {
  background: oklch(92% 0.028 267);
  border-color: oklch(72% 0.08 267);
  color: oklch(30% 0.08 267);
}

.template-chip.active {
  background: oklch(52% 0.20 267);
  border-color: oklch(52% 0.20 267);
  color: oklch(99% 0 0);
  box-shadow: 0 2px 12px oklch(44% 0.22 267 / 32%);
}

.no-templates {
  font-size: 13px;
  color: oklch(58% 0.020 265);
  font-style: italic;
  margin: 0;
}

.chip-fade-enter-active { transition: opacity 0.25s, transform 0.25s; }
.chip-fade-leave-active { transition: opacity 0.18s, transform 0.18s; }
.chip-fade-enter, .chip-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.92);
}

.expand-enter-active { transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.4, 0, 0.2, 1); }
.expand-leave-active { transition: opacity 0.16s ease, transform 0.16s cubic-bezier(0.4, 0, 0.2, 1); }
.expand-enter, .expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 640px) {
  .settings-page { padding: 36px 16px 60px; }
  .settings-title { font-size: 2rem; }
}
</style>

<style>
.dark-mode .settings-page {
  background: oklch(13% 0.024 265);
}

.dark-mode .settings-page .settings-eyebrow {
  color: oklch(72% 0.16 267);
}

.dark-mode .settings-page .settings-title {
  color: #f8fafc;
}

.dark-mode .settings-page .settings-subtitle {
  color: rgb(226 232 240 / 52%);
}

.dark-mode .settings-page .settings-section {
  background: oklch(18% 0.028 265);
  border-color: rgb(255 255 255 / 8%);
  box-shadow:
    0 0 0 1px rgb(0 0 0 / 20%) inset,
    0 8px 32px rgb(0 0 0 / 22%);
}

.dark-mode .settings-page .section-head {
  background: transparent;
  border-bottom-color: rgb(255 255 255 / 8%);
}

.dark-mode .settings-page .section-title {
  color: #f1f5f9;
}

.dark-mode .settings-page .section-desc {
  color: rgb(226 232 240 / 52%);
}

.dark-mode .settings-page .saved-chip {
  background: rgb(34 197 94 / 16%);
  color: rgb(134 239 172 / 88%);
}

.dark-mode .settings-page .page-group {
  border-color: rgb(255 255 255 / 9%);
  background: rgb(255 255 255 / 3%);
}

.dark-mode .settings-page .page-group.active {
  border-color: rgb(92 97 212 / 55%);
  background: rgb(92 97 212 / 10%);
  box-shadow:
    0 0 0 3px rgb(92 97 212 / 12%),
    0 4px 16px rgb(0 0 0 / 20%);
}

.dark-mode .settings-page .page-radio-btn:hover {
  background: rgb(255 255 255 / 5%);
}

.dark-mode .settings-page .page-group.active .page-radio-btn:hover {
  background: rgb(92 97 212 / 14%);
}

.dark-mode .settings-page .radio-indicator {
  border-color: rgb(255 255 255 / 24%);
}

.dark-mode .settings-page .radio-indicator.checked {
  border-color: rgb(92 97 212 / 90%);
  background: rgb(92 97 212 / 90%);
}

.dark-mode .settings-page .radio-inner {
  background: #fff;
}

.dark-mode .settings-page .page-name {
  color: #f1f5f9;
}

.dark-mode .settings-page .page-meta {
  background: rgb(255 255 255 / 8%);
  color: rgb(226 232 240 / 55%);
}

.dark-mode .settings-page .template-panel {
  border-top-color: rgb(255 255 255 / 8%);
}

.dark-mode .settings-page .template-chip {
  background: rgb(255 255 255 / 5%);
  border-color: rgb(255 255 255 / 11%);
  color: rgb(226 232 240 / 78%);
}

.dark-mode .settings-page .template-chip:hover {
  background: rgb(255 255 255 / 10%);
  border-color: rgb(255 255 255 / 18%);
  color: #f1f5f9;
}

.dark-mode .settings-page .template-chip.active {
  background: rgb(92 97 212 / 85%);
  border-color: rgb(92 97 212 / 85%);
  color: #fff;
  box-shadow: 0 2px 12px rgb(92 97 212 / 35%);
}

.dark-mode .settings-page .no-templates {
  color: rgb(226 232 240 / 40%);
}
</style>
