<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container" @click.stop role="dialog" aria-modal="true" aria-labelledby="modal-template-title">
        <div class="modal-header">
          <div class="modal-header-text">
            <p class="modal-eyebrow">Template</p>
            <h3 id="modal-template-title" class="modal-title">템플릿 선택</h3>
          </div>
          <button type="button" class="modal-close-btn" aria-label="닫기" @click="close">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="template-grid">
            <button
              v-for="(template, index) in templates"
              :key="template.value"
              type="button"
              class="template-item"
              :class="{ active: tempSelected === template.value }"
              :style="{ animationDelay: `${index * 0.06}s` }"
              @click="selectTemplate(template.value)"
            >
              <div class="template-item-content">
                <div class="template-info">
                  <span class="template-name">{{ template.name }}</span>
                  <p v-if="template.description" class="template-desc">{{ template.description }}</p>
                </div>
                <div v-if="tempSelected === template.value" class="template-check" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-confirm" @click="confirm">확인</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'TemplateSelectModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    selectedTemplate: {
      type: String,
      default: ''
    },
    templates: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tempSelected: this.selectedTemplate
    }
  },
  watch: {
    selectedTemplate(newVal) {
      this.tempSelected = newVal
    },
    isOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
        this.tempSelected = this.selectedTemplate
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  beforeDestroy() {
    document.body.style.overflow = ''
  },
  methods: {
    selectTemplate(value) {
      this.tempSelected = value
      this.$emit('select', value)
    },
    confirm() {
      this.close()
    },
    close() {
      this.$emit('close')
    },
    handleOverlayClick() {
      this.close()
    }
  }
}
</script>

<style scoped>
/* ── LIGHT MODE (default) ── */
.modal-overlay {
  --modal-accent: var(--blueprint-indigo, #5c61d4);
  --modal-accent-deep: var(--blueprint-indigo-deep, #373c8f);

  position: fixed;
  inset: 0;
  background: oklch(22% 0.04 265 / 50%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  width: 100%;
  max-width: 520px;
  max-height: min(80vh, 640px);
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  overflow: hidden;
  background: oklch(99.5% 0.004 265);
  border: 1px solid oklch(87% 0.022 265);
  box-shadow:
    0 0 0 1px oklch(95% 0.016 265) inset,
    0 2px 4px oklch(15% 0.05 265 / 5%),
    0 16px 48px oklch(15% 0.06 265 / 14%),
    0 40px 80px oklch(15% 0.05 265 / 8%);
  animation: modal-slide-in 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modal-slide-in {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-header {
  flex-shrink: 0;
  padding: 22px 20px 18px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  background: linear-gradient(135deg, oklch(93% 0.048 267) 0%, oklch(98.5% 0.010 265) 65%);
  border-bottom: 1px solid oklch(87% 0.030 267);
}

.modal-header-text { min-width: 0; }

.modal-eyebrow {
  margin: 0 0 5px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: oklch(42% 0.20 267);
}

.modal-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: oklch(15% 0.025 265);
}

.modal-close-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid oklch(82% 0.028 267);
  background: oklch(100% 0 0 / 70%);
  color: oklch(42% 0.08 265);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.modal-close-btn:hover {
  background: oklch(100% 0 0);
  border-color: oklch(62% 0.16 267);
  color: oklch(35% 0.18 267);
}

.modal-body {
  padding: 16px 16px 20px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  background: oklch(97.5% 0.010 265);
}

.modal-body::-webkit-scrollbar { width: 6px; }
.modal-body::-webkit-scrollbar-track { background: oklch(92% 0.018 265); border-radius: 4px; }
.modal-body::-webkit-scrollbar-thumb { background: oklch(72% 0.09 267); border-radius: 4px; }
.modal-body::-webkit-scrollbar-thumb:hover { background: oklch(58% 0.15 267); }

.template-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.template-item {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  border-radius: 12px;
  opacity: 0;
  animation: item-rise 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes item-rise {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.template-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1.5px solid oklch(90% 0.018 265);
  background: oklch(99.5% 0.003 265);
  transition: background 0.18s, border-color 0.18s, box-shadow 0.18s;
}

.template-item:hover .template-item-content {
  background: oklch(96% 0.030 267);
  border-color: oklch(76% 0.082 267);
  box-shadow: 0 2px 10px oklch(52% 0.18 267 / 10%);
}

.template-item.active .template-item-content {
  background: oklch(91% 0.065 267);
  border-color: oklch(51% 0.21 267);
  box-shadow:
    0 0 0 3px oklch(51% 0.21 267 / 14%),
    0 4px 20px oklch(44% 0.22 267 / 16%);
}

.template-info { flex: 1; min-width: 0; }

.template-name {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: oklch(18% 0.025 265);
  letter-spacing: -0.025em;
  line-height: 1.3;
}

.template-item.active .template-name {
  color: oklch(26% 0.20 267);
}

.template-desc {
  margin: 5px 0 0;
  font-size: 13px;
  line-height: 1.45;
  color: oklch(52% 0.025 265);
}

.template-check {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--modal-accent) 0%, var(--modal-accent-deep) 100%);
  color: #fff;
  box-shadow: 0 2px 12px oklch(44% 0.22 267 / 40%);
}

.modal-footer {
  flex-shrink: 0;
  padding: 14px 16px 18px;
  background: oklch(97.5% 0.010 265);
  border-top: 1px solid oklch(89% 0.022 265);
}

.btn-confirm {
  width: 100%;
  padding: 13px 18px;
  border-radius: 11px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
  cursor: pointer;
  border: none;
  color: #fff;
  background: linear-gradient(135deg, var(--modal-accent) 0%, var(--modal-accent-deep) 100%);
  box-shadow:
    0 1px 0 oklch(90% 0.05 267 / 30%) inset,
    0 4px 16px oklch(40% 0.22 267 / 32%);
  transition: filter 0.2s, transform 0.15s, box-shadow 0.2s;
}

.btn-confirm:hover {
  filter: brightness(1.08);
  box-shadow:
    0 1px 0 oklch(90% 0.05 267 / 30%) inset,
    0 6px 24px oklch(40% 0.22 267 / 42%);
}

.btn-confirm:active {
  transform: translateY(1px);
  filter: brightness(0.96);
}

.modal-fade-enter-active { transition: opacity 0.25s ease; }
.modal-fade-leave-active { transition: opacity 0.18s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }

.modal-fade-enter-active .modal-container {
  animation: modal-slide-in 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-leave-active .modal-container {
  animation: modal-slide-out 0.22s ease-in forwards;
}

@keyframes modal-slide-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(-12px) scale(0.98); }
}

@media (prefers-reduced-motion: reduce) {
  .modal-container,
  .template-item,
  .modal-fade-enter-active .modal-container { animation: none; }
  .template-item { opacity: 1; }
}

@media (max-width: 640px) {
  .modal-overlay { padding: 12px; align-items: flex-end; }
  .modal-container { max-width: 100%; max-height: 92vh; border-radius: 16px 16px 0 0; }
  .modal-header { padding: 18px 16px 14px; }
  .modal-body { padding: 12px 12px 16px; }
  .modal-footer { padding: 12px 12px 16px; }
}
</style>

<style>
/* ── DARK MODE OVERRIDES (non-scoped)
   .dark-mode .modal-overlay .xxx = specificity (0,3,0)
   beats scoped .xxx[data-v-xxx] = (0,2,0) ── */
.dark-mode .modal-overlay {
  background: rgb(14 17 28 / 76%);
}

.dark-mode .modal-overlay .modal-container {
  background:
    radial-gradient(ellipse 120% 80% at 100% 0%, rgb(92 97 212 / 14%) 0%, transparent 52%),
    linear-gradient(155deg, #0e111c 0%, #15182c 46%, #121c2e 100%);
  border-color: rgb(255 255 255 / 10%);
  box-shadow:
    0 0 0 1px rgb(0 0 0 / 35%) inset,
    0 24px 56px rgb(0 0 0 / 45%);
}

.dark-mode .modal-overlay .modal-header {
  background: transparent;
  border-bottom-color: rgb(255 255 255 / 8%);
}

.dark-mode .modal-overlay .modal-eyebrow {
  color: rgb(226 232 240 / 72%);
}

.dark-mode .modal-overlay .modal-title {
  color: #f8fafc;
}

.dark-mode .modal-overlay .modal-close-btn {
  border-color: rgb(255 255 255 / 12%);
  background: rgb(255 255 255 / 6%);
  color: rgb(226 232 240 / 78%);
}

.dark-mode .modal-overlay .modal-close-btn:hover {
  background: rgb(255 255 255 / 10%);
  border-color: rgb(92 97 212 / 35%);
  color: #f8fafc;
}

.dark-mode .modal-overlay .modal-body {
  background: transparent;
}

.dark-mode .modal-overlay .modal-body::-webkit-scrollbar-track {
  background: rgb(255 255 255 / 4%);
}

.dark-mode .modal-overlay .modal-body::-webkit-scrollbar-thumb {
  background: rgb(92 97 212 / 35%);
}

.dark-mode .modal-overlay .modal-body::-webkit-scrollbar-thumb:hover {
  background: rgb(92 97 212 / 50%);
}

.dark-mode .modal-overlay .template-item-content {
  border-color: rgb(255 255 255 / 10%);
  border-width: 1px;
  background: rgb(255 255 255 / 4%);
}

.dark-mode .modal-overlay .template-item:hover .template-item-content {
  background: rgb(255 255 255 / 8%);
  border-color: rgb(255 255 255 / 14%);
  box-shadow: none;
}

.dark-mode .modal-overlay .template-item.active .template-item-content {
  background: rgb(92 97 212 / 14%);
  border-color: rgb(92 97 212 / 45%);
  box-shadow: 0 0 0 1px rgb(92 97 212 / 18%);
}

.dark-mode .modal-overlay .template-name {
  color: #f1f5f9;
}

.dark-mode .modal-overlay .template-item.active .template-name {
  color: #f1f5f9;
}

.dark-mode .modal-overlay .template-desc {
  color: rgb(226 232 240 / 62%);
}

.dark-mode .modal-overlay .modal-footer {
  background: transparent;
  border-top-color: rgb(255 255 255 / 8%);
}
</style>
