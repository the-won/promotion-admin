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
.modal-overlay {
  --modal-accent: #5c61d4;
  --modal-accent-deep: #373c8f;
  --modal-border: rgb(255 255 255 / 10%);
  --modal-muted: rgb(226 232 240 / 62%);

  position: fixed;
  inset: 0;
  background: rgb(14 17 28 / 76%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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
  border-radius: 16px;
  overflow: hidden;
  background:
    radial-gradient(ellipse 120% 80% at 100% 0%, rgb(92 97 212 / 14%) 0%, transparent 52%),
    linear-gradient(155deg, #0e111c 0%, #15182c 46%, #121c2e 100%);
  border: 1px solid var(--modal-border);
  box-shadow:
    0 0 0 1px rgb(0 0 0 / 35%) inset,
    0 24px 56px rgb(0 0 0 / 45%);
  animation: modal-slide-in 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modal-slide-in {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  flex-shrink: 0;
  padding: 20px 20px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid rgb(255 255 255 / 8%);
}

.modal-header-text {
  min-width: 0;
}

.modal-eyebrow {
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(226 232 240 / 48%);
}

.modal-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #f8fafc;
}

.modal-close-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid rgb(255 255 255 / 12%);
  background: rgb(255 255 255 / 6%);
  color: rgb(226 232 240 / 78%);
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.modal-close-btn:hover {
  background: rgb(255 255 255 / 10%);
  border-color: rgb(92 97 212 / 35%);
  color: #f8fafc;
}

.modal-body {
  padding: 16px 16px 20px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgb(255 255 255 / 4%);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgb(92 97 212 / 35%);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgb(92 97 212 / 50%);
}

.template-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.template-item-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgb(255 255 255 / 10%);
  background: rgb(255 255 255 / 4%);
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.template-item:hover .template-item-content {
  background: rgb(255 255 255 / 8%);
  border-color: rgb(255 255 255 / 14%);
}

.template-item.active .template-item-content {
  background: rgb(92 97 212 / 14%);
  border-color: rgb(92 97 212 / 45%);
  box-shadow: 0 0 0 1px rgb(92 97 212 / 18%);
}

.template-info {
  flex: 1;
  min-width: 0;
}

.template-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #f1f5f9;
  letter-spacing: -0.02em;
  line-height: 1.35;
}

.template-desc {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.45;
  color: var(--modal-muted);
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
  box-shadow: 0 2px 10px rgb(55 60 143 / 35%);
}

.modal-footer {
  flex-shrink: 0;
  padding: 14px 16px 18px;
  border-top: 1px solid rgb(255 255 255 / 8%);
}

.btn-confirm {
  width: 100%;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  color: #fff;
  background: linear-gradient(135deg, var(--modal-accent) 0%, var(--modal-accent-deep) 100%);
  box-shadow: 0 4px 14px rgb(55 60 143 / 35%);
  transition:
    filter 0.2s ease,
    transform 0.15s ease;
}

.btn-confirm:hover {
  filter: brightness(1.06);
}

.btn-confirm:active {
  transform: translateY(1px);
}

.modal-fade-enter-active {
  transition: opacity 0.25s ease;
}

.modal-fade-leave-active {
  transition: opacity 0.18s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container {
  animation: modal-slide-in 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-leave-active .modal-container {
  animation: modal-slide-out 0.22s ease-in forwards;
}

@keyframes modal-slide-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-12px) scale(0.98);
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-container,
  .template-item,
  .modal-fade-enter-active .modal-container {
    animation: none;
  }

  .template-item {
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 12px;
    align-items: flex-end;
  }

  .modal-container {
    max-width: 100%;
    max-height: 92vh;
    border-radius: 16px 16px 0 0;
  }

  .modal-header {
    padding: 18px 16px 14px;
  }

  .modal-body {
    padding: 12px 12px 16px;
  }

  .modal-footer {
    padding: 12px 12px 16px;
  }
}
</style>
