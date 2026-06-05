<template>
  <div class="settings-page">

    <!-- Toast -->
    <transition name="toast-fade">
      <span v-if="savedIndicator" class="save-toast" aria-live="polite">
        <span class="toast-dot"></span>저장됨
      </span>
    </transition>

    <div class="settings-inner">

      <!-- Page header -->
      <header class="pg-head">
        <div class="pg-icon-wrap" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </div>
        <div>
          <h1 class="pg-title">Settings</h1>
          <p class="pg-sub">기본 시작 화면과 템플릿을 설정합니다.</p>
        </div>
      </header>

      <!-- Tab nav -->
      <nav class="tab-nav" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ 'is-active': activeTab === tab.id }"
          role="tab"
          :aria-selected="activeTab === tab.id"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>

      <!-- Section subheader -->
      <div class="section-sub">
        <h2 class="section-title">{{ currentSectionTitle }}</h2>
        <p class="section-desc">기본으로 열릴 템플릿을 선택하세요.</p>
      </div>

      <!-- Template list -->
      <transition name="list-fade" mode="out-in">
        <div :key="activeTab" class="item-list">
          <template v-for="group in filteredGroups">
            <div v-if="activeTab === 'all'" :key="'g-' + group.id" class="group-label">
              {{ group.label }}
            </div>
            <div v-for="t in group.templates" :key="t.value" class="item-wrap">
              <button
                class="item-row"
                :class="{ 'is-active': selectedTemplate === t.value }"
                @click="setDefault(group.id, t.value)"
              >
                <div class="toggle" :class="{ 'is-on': selectedTemplate === t.value }" aria-hidden="true">
                  <span class="knob"></span>
                </div>
                <div class="item-icon" :style="{ background: t.color }">
                  <span>{{ t.abbr }}</span>
                </div>
                <div class="item-info">
                  <span class="item-name">{{ t.name }}</span>
                  <span class="item-desc">{{ t.desc }}</span>
                </div>
              </button>
            </div>
          </template>
        </div>
      </transition>

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
      activeTab: 'all',
      selectedPage: saved?.page || 'em-templates',
      selectedTemplate: saved?.template || 'em-type-2',
      savedIndicator: false,
      tabs: [
        { id: 'all', label: '전체' },
        { id: 'em-templates', label: 'EM Templates' },
        { id: 'event-templates', label: 'Event Templates' },
        { id: 'item-templates', label: 'Item Templates' }
      ],
      pageGroups: [
        {
          id: 'em-templates',
          label: 'EM Templates',
          templates: [
            { value: 'em-type-2', name: '전체 링크 이미지',  abbr: 'IL', color: '#5c61d4', desc: '이미지 클릭 시 링크로 연결되는 기본 이메일 템플릿' },
            { value: 'em-type-imagemap', name: '영역 링크 이미지', abbr: 'UM', color: '#3b5bdb', desc: '이미지맵으로 다중 클릭 영역을 지정하는 이메일' },
            { value: 'em-type-coupon', name: '쿠폰혜택',  abbr: '쿠', color: '#e67700', desc: '쿠폰 및 혜택 안내를 위한 이메일 템플릿' },
            { value: 'em-type-letter', name: '베네레터', abbr: '베', color: '#0ca678', desc: '뉴스레터 형식의 베네피아 레터 이메일' },
            { value: 'em-type-4',  name: '이패밀리샵', abbr: '이', color: '#1c7ed6', desc: '이패밀리샵 상품 소개 이메일 템플릿' },
            { value: 'em-type-5', name: '비밀특가', abbr: '비', color: '#c92a2a', desc: '시크릿세일 특가 상품 안내 이메일' },
            { value: 'em-type-familysale', name: '패밀리세일',   abbr: '패', color: '#a61e4d', desc: '패밀리세일 상품 그룹 이메일 템플릿' }
          ]
        },
        {
          id: 'event-templates',
          label: 'Event Templates',
          templates: [
            { value: 'em-type-1', name: '전체 링크 이미지',    abbr: 'T1', color: '#2f9e44', desc: '이미지 클릭 시 링크로 연결되는 이벤트 페이지' },
            { value: 'em-type-3', name: '영역 링크 이미지', abbr: 'IM', color: '#0b7285', desc: '이미지맵 다중 클릭 영역을 지정하는 이벤트 페이지' }
          ]
        },
        {
          id: 'item-templates',
          label: 'Item Templates',
          templates: [
            { value: 'privacy-policy', name: '개인정보처리방침', abbr: '개', color: '#868e96', desc: '개인정보처리방침 문서 페이지 템플릿' }
          ]
        }
      ]
    }
  },
  computed: {
    filteredGroups() {
      if (this.activeTab === 'all') return this.pageGroups
      return this.pageGroups.filter(g => g.id === this.activeTab)
    },
    currentSectionTitle() {
      if (this.activeTab === 'all') return '전체 템플릿'
      return this.tabs.find(t => t.id === this.activeTab)?.label || ''
    }
  },
  methods: {
    setDefault(pageId, templateValue) {
      if (this.selectedTemplate === templateValue) return
      this.selectedPage = pageId
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
  background: #fff;
  padding: 0 0 80px;
  position: relative;
}

.settings-inner {
  max-width: 760px;
  margin: 0 auto;
  padding: 120px 48px 0;
}

/* Toast */

.save-toast {
  position: fixed;
  top: 20px;
  right: 24px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 8px;
  background: #18181b;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  letter-spacing: -0.01em;
}

.toast-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34c759;
  flex-shrink: 0;
}

/* Page header */

.pg-head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
  animation: slide-down 0.28s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.pg-icon-wrap {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #f0f0ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5c61d4;
  margin-top: 2px;
}

.pg-title {
  margin: 0 0 5px;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #111827;
  line-height: 1.1;
}

.pg-sub {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

/* Tab nav */

.tab-nav {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  gap: 0;
  animation: slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.04s both;
}

.tab-btn {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  white-space: nowrap;
}

.tab-btn:hover {
  color: #374151;
  background: #f9fafb;
}

.tab-btn.is-active {
  color: #111827;
  font-weight: 600;
  border-bottom-color: #5c61d4;
  background: transparent;
}

/* Section subheader */

.section-sub {
  padding: 24px 0 20px;
  border-bottom: 1px solid #e5e7eb;
  animation: slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.07s both;
}

.section-title {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.025em;
}

.section-desc {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

/* Group label */

.group-label {
  padding: 20px 0 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9ca3af;
}

/* Item list */

.item-list {
  animation: slide-down 0.26s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.item-wrap {
  border-bottom: 1px solid #e5e7eb;
}

/* Item row */

.item-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  border-radius: 8px;
  transition: background 0.15s;
}

.item-row:hover {
  background: #f9fafb;
  padding: 14px 10px;
  margin: 0 -10px;
  width: calc(100% + 20px);
}

.item-row.is-active .item-name {
  color: #5c61d4;
  font-weight: 700;
}

/* Toggle */

.toggle {
  flex-shrink: 0;
  position: relative;
  width: 44px;
  height: 26px;
  border-radius: 100px;
  background: #d1d5db;
  transition: background 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.toggle.is-on {
  background: #5c61d4;
}

.knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle.is-on .knob {
  transform: translateX(18px);
}

/* Item icon */

.item-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

/* Item info */

.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.01em;
  transition: color 0.18s;
}

.item-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Animations */

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.list-fade-enter-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-fade-leave-active {
  transition: opacity 0.14s ease, transform 0.14s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-fade-enter,
.list-fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

.toast-fade-enter-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.toast-fade-enter,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.9);
}

@media (max-width: 640px) {
  .settings-inner { padding: 28px 20px 0; }
  .pg-title { font-size: 24px; }
  .tab-btn { padding: 10px 12px; font-size: 13px; }
  .item-row:hover { padding: 14px 0; margin: 0; width: 100%; background: transparent; }
}
</style>

<style>
.dark-mode .settings-page {
  background: #111113;
}

.dark-mode .settings-page .pg-icon-wrap {
  background: rgba(92, 97, 212, 0.15);
  color: #9899e8;
}

.dark-mode .settings-page .pg-title {
  color: #f9fafb;
}

.dark-mode .settings-page .pg-sub {
  color: rgba(235, 235, 245, 0.5);
}

.dark-mode .settings-page .tab-nav {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .settings-page .tab-btn {
  color: rgba(235, 235, 245, 0.45);
}

.dark-mode .settings-page .tab-btn:hover {
  color: rgba(235, 235, 245, 0.8);
  background: rgba(255, 255, 255, 0.04);
}

.dark-mode .settings-page .tab-btn.is-active {
  color: #f9fafb;
  border-bottom-color: #7c82e0;
}

.dark-mode .settings-page .section-sub {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .settings-page .section-title {
  color: #f9fafb;
}

.dark-mode .settings-page .section-desc {
  color: rgba(235, 235, 245, 0.5);
}

.dark-mode .settings-page .group-label {
  color: rgba(235, 235, 245, 0.3);
}

.dark-mode .settings-page .item-wrap {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.dark-mode .settings-page .item-row:hover {
  background: rgba(255, 255, 255, 0.04);
}

.dark-mode .settings-page .item-name {
  color: #f3f4f6;
}

.dark-mode .settings-page .item-row.is-active .item-name {
  color: #9899e8;
}

.dark-mode .settings-page .item-desc {
  color: rgba(235, 235, 245, 0.45);
}

.dark-mode .settings-page .toggle {
  background: rgba(255, 255, 255, 0.18);
}

.dark-mode .settings-page .toggle.is-on {
  background: #5c61d4;
}

.dark-mode .settings-page .save-toast {
  background: #27272a;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
</style>
