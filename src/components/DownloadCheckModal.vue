<template>
  <transition name="dlcheck-fade">
    <div v-if="isOpen" class="dlcheck-overlay" @click.self="$emit('close')">
      <div class="dlcheck-modal" role="dialog" aria-modal="true" aria-labelledby="dlcheck-title">
        <div class="dlcheck-header">
          <div class="dlcheck-header-text">
            <p class="dlcheck-eyebrow">Download Check</p>
            <h3 id="dlcheck-title" class="dlcheck-title">다운로드 전 확인</h3>
          </div>
          <button class="dlcheck-close-btn" aria-label="닫기" @click="$emit('close')">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="dlcheck-body">
          <!-- 이상 없음 -->
          <div v-if="issues.length === 0" class="dlcheck-clear">
            <div class="dlcheck-clear-icon">✅</div>
            <p class="dlcheck-clear-msg">모든 항목이 정상입니다.<br>다운로드를 진행하세요.</p>
          </div>

          <!-- 이슈 목록 -->
          <template v-else>
            <div class="dlcheck-summary">
              <span v-if="errorCount > 0" class="dlcheck-count error">오류 {{ errorCount }}개</span>
              <span v-if="warningCount > 0" class="dlcheck-count warning">경고 {{ warningCount }}개</span>
            </div>
            <ul class="dlcheck-list">
              <li
                v-for="(issue, i) in issues"
                :key="i"
                class="dlcheck-item"
                :class="issue.level"
              >
                <span class="dlcheck-item-icon">{{ issue.level === 'error' ? '❌' : '⚠️' }}</span>
                <div class="dlcheck-item-info">
                  <strong class="dlcheck-item-label">{{ issue.label }}</strong>
                  <span class="dlcheck-item-msg">{{ issue.message }}</span>
                </div>
                <button
                  v-if="issue.tab || issue.fieldKey"
                  class="dlcheck-goto-btn"
                  @click="$emit('goto', issue)"
                >이동</button>
              </li>
            </ul>
          </template>
        </div>

        <div class="dlcheck-footer">
          <button class="dlcheck-btn-secondary" @click="$emit('close')">수정하기</button>
          <button class="dlcheck-btn-primary download-btn" @click="$emit('confirm')">
            {{ issues.length === 0 ? 'HTML 다운로드' : '그래도 다운로드' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DownloadCheckModal',
  props: {
    isOpen: { type: Boolean, default: false },
    issues: { type: Array, default: () => [] }
  },
  computed: {
    errorCount() { return this.issues.filter(i => i.level === 'error').length },
    warningCount() { return this.issues.filter(i => i.level === 'warning').length }
  },
  watch: {
    isOpen(val) {
      document.body.style.overflow = val ? 'hidden' : ''
    }
  },
  beforeDestroy() {
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
.dlcheck-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
}

.dlcheck-modal {
  background: #fff;
  border-radius: 16px;
  width: min(480px, calc(100vw - 32px));
  max-height: min(85vh, 640px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18), 0 4px 16px rgba(0, 0, 0, 0.08);
  animation: dlcheck-slide-in 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes dlcheck-slide-in {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.dlcheck-fade-enter-active,
.dlcheck-fade-leave-active {
  transition: opacity 0.2s;
}
.dlcheck-fade-enter,
.dlcheck-fade-leave-to {
  opacity: 0;
}
.dlcheck-fade-enter .dlcheck-modal,
.dlcheck-fade-leave-to .dlcheck-modal {
  transform: translateY(12px) scale(0.98);
}

/* Header */
.dlcheck-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f0f0f5;
}
.dlcheck-eyebrow {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--color-primary, #5c61d4);
  text-transform: uppercase;
  margin: 0 0 3px;
}
.dlcheck-title {
  font-size: 17px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
}
.dlcheck-close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: #6e6e73;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.dlcheck-close-btn:hover { background: #f5f5f7; }

/* Body */
.dlcheck-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  scrollbar-width: thin;
}

/* 이상 없음 */
.dlcheck-clear {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px 0;
  text-align: center;
}
.dlcheck-clear-icon { font-size: 40px; line-height: 1; }
.dlcheck-clear-msg { font-size: 14px; color: #3d3d3e; line-height: 1.6; margin: 0; }

/* Summary */
.dlcheck-summary {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.dlcheck-count {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
}
.dlcheck-count.error   { background: #fef2f2; color: #dc2626; }
.dlcheck-count.warning { background: #fffbeb; color: #d97706; }

/* 이슈 목록 */
.dlcheck-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.dlcheck-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1.5px solid transparent;
}
.dlcheck-item.error   { background: #fef2f2; border-color: #fca5a5; }
.dlcheck-item.warning { background: #fffbeb; border-color: #fde68a; }

.dlcheck-item-icon { font-size: 14px; flex-shrink: 0; line-height: 1; }
.dlcheck-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.dlcheck-item-label {
  font-size: 12px;
  font-weight: 600;
  color: #1d1d1f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dlcheck-item-msg {
  font-size: 11px;
  color: #6e6e73;
}

.dlcheck-goto-btn {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1.5px solid var(--color-primary, #5c61d4);
  background: transparent;
  color: var(--color-primary, #5c61d4);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}
.dlcheck-goto-btn:hover {
  background: var(--color-primary, #5c61d4);
  color: #fff;
}

/* Footer */
.dlcheck-footer {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f5;
}
.dlcheck-btn-secondary {
  flex: 1;
  padding: 10px;
  border: 1.5px solid var(--color-border, #e5e7eb);
  border-radius: 10px;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: #3d3d3e;
  cursor: pointer;
  transition: background 0.15s;
}
.dlcheck-btn-secondary:hover { background: #f5f5f7; }
.dlcheck-btn-primary {
  flex: 2;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background: var(--color-primary, #5c61d4);
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.15s;
}
.dlcheck-btn-primary:hover { opacity: 0.88; }
</style>
