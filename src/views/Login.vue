<template>
  <div class="login-root">

    <!-- Progress bar (submit feedback) -->
    <div class="submit-progress" :class="{ active: isLoading }" aria-hidden="true"></div>

    <!-- Left: Brand panel -->
    <aside class="brand-panel">
      <div class="brand-inner">
        <div class="brand-mark">
          <svg class="brand-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="rgba(255,255,255,0.15)"/>
            <rect x="8" y="9" width="13" height="10" rx="2" fill="rgba(255,255,255,0.9)"/>
            <rect x="23" y="9" width="5" height="5" rx="1.5" fill="rgba(255,255,255,0.5)"/>
            <rect x="8" y="21" width="20" height="2" rx="1" fill="rgba(255,255,255,0.35)"/>
            <rect x="8" y="25" width="13" height="2" rx="1" fill="rgba(255,255,255,0.22)"/>
          </svg>
          <span class="brand-name">Promotion Admin</span>
        </div>

        <p class="brand-tagline">
          폼 입력만으로<br>프로모션 이메일을<br>즉시 완성하는 어드민
        </p>

        <!-- Abstract template wireframe decoration -->
        <div class="brand-deco" aria-hidden="true">
          <svg width="200" height="240" viewBox="0 0 200 240" fill="none" class="deco-svg">
            <!-- Email template wireframe preview -->
            <rect x="0" y="0" width="200" height="240" rx="6" fill="rgba(255,255,255,0.06)"/>
            <!-- Header bar -->
            <rect x="12" y="14" width="176" height="32" rx="3" fill="rgba(255,255,255,0.14)"/>
            <rect x="20" y="21" width="40" height="8" rx="2" fill="rgba(255,255,255,0.35)"/>
            <rect x="132" y="21" width="48" height="8" rx="2" fill="rgba(255,255,255,0.2)"/>
            <!-- Hero image block -->
            <rect x="12" y="58" width="176" height="68" rx="3" fill="rgba(255,255,255,0.10)"/>
            <rect x="76" y="82" width="48" height="6" rx="1.5" fill="rgba(255,255,255,0.22)"/>
            <rect x="84" y="92" width="32" height="4" rx="1" fill="rgba(255,255,255,0.14)"/>
            <!-- Content rows -->
            <rect x="12" y="138" width="85" height="40" rx="3" fill="rgba(255,255,255,0.09)"/>
            <rect x="16" y="148" width="60" height="6" rx="1.5" fill="rgba(255,255,255,0.22)"/>
            <rect x="16" y="158" width="72" height="4" rx="1" fill="rgba(255,255,255,0.14)"/>
            <rect x="103" y="138" width="85" height="40" rx="3" fill="rgba(255,255,255,0.09)"/>
            <rect x="107" y="148" width="60" height="6" rx="1.5" fill="rgba(255,255,255,0.22)"/>
            <rect x="107" y="158" width="52" height="4" rx="1" fill="rgba(255,255,255,0.14)"/>
            <!-- Footer -->
            <rect x="12" y="190" width="176" height="36" rx="3" fill="rgba(255,255,255,0.07)"/>
            <rect x="72" y="202" width="56" height="4" rx="1" fill="rgba(255,255,255,0.18)"/>
            <rect x="80" y="210" width="40" height="4" rx="1" fill="rgba(255,255,255,0.12)"/>
          </svg>
        </div>
      </div>
    </aside>

    <!-- Right: Form panel -->
    <main class="form-panel">
      <div class="form-wrap">
        <header class="form-head">
          <h1 class="form-title">로그인</h1>
          <p class="form-sub">계정으로 접속하세요</p>
        </header>

        <form class="form-body" @submit.prevent="handleLogin" novalidate>
          <div class="fields">
            <div class="field" :class="{ focused: focusedField === 'id', filled: formId }">
              <label class="field-label" for="login-id">아이디</label>
              <input
                id="login-id"
                v-model="formId"
                type="text"
                class="field-input"
                autocomplete="username"
                spellcheck="false"
                @focus="focusedField = 'id'"
                @blur="focusedField = null"
              />
              <div class="field-track">
                <div class="field-fill"></div>
              </div>
            </div>

            <div class="field" :class="{ focused: focusedField === 'pw', filled: formPw }">
              <label class="field-label" for="login-pw">비밀번호</label>
              <div class="field-row">
                <input
                  id="login-pw"
                  v-model="formPw"
                  :type="showPw ? 'text' : 'password'"
                  class="field-input"
                  autocomplete="current-password"
                  @focus="focusedField = 'pw'"
                  @blur="focusedField = null"
                />
                <button
                  type="button"
                  class="pw-toggle"
                  :aria-label="showPw ? '비밀번호 숨기기' : '비밀번호 보기'"
                  tabindex="-1"
                  @click="showPw = !showPw"
                >
                  <svg v-if="!showPw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <div class="field-track">
                <div class="field-fill"></div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="btn-login"
            :disabled="isLoading"
          >
            <span v-if="!isLoading" class="btn-text">로그인</span>
            <span v-else class="btn-loader" aria-label="로그인 중"></span>
          </button>
        </form>

        <footer class="form-foot">
          <span>내부 임직원 전용 시스템입니다</span>
        </footer>
      </div>
    </main>

  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      formId: '',
      formPw: '',
      showPw: false,
      focusedField: null,
      isLoading: false
    }
  },
  methods: {
    handleLogin() {
      this.isLoading = true
      setTimeout(() => {
        this.$router.push('/em-templates')
      }, 520)
    }
  }
}
</script>

<style scoped>
/* ── Easing tokens ── */
:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
}

/* ── Root ── */
.login-root {
  min-height: 100vh;
  display: flex;
  background: oklch(0.99 0.003 255);
}

/* ── Progress bar ── */
.submit-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: #6366f1;
  z-index: 1000;
  transition: width 520ms var(--ease-out-expo);
}
.submit-progress.active {
  width: 88%;
}

/* ── Brand panel ── */
.brand-panel {
  width: 44%;
  min-height: 100vh;
  background: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  animation: brandSlideIn 600ms var(--ease-out-expo) both;
}

/* Subtle dot grid overlay */
.brand-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}

.brand-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 12px;
  animation: fadeSlideUp 500ms 80ms var(--ease-out-expo) both;
}

.brand-name {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.025em;
}

.brand-tagline {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: -0.02em;
  margin: 0;
  animation: fadeSlideUp 500ms 160ms var(--ease-out-expo) both;
}

.brand-deco {
  animation: fadeSlideUp 600ms 240ms var(--ease-out-expo) both;
}

.deco-svg {
  display: block;
  filter: drop-shadow(0 8px 32px rgba(0,0,0,0.18));
}

/* ── Form panel ── */
.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  box-sizing: border-box;
  animation: formSlideIn 600ms 60ms var(--ease-out-expo) both;
}

.form-wrap {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

/* ── Form head ── */
.form-head {
  animation: fadeSlideUp 500ms 180ms var(--ease-out-expo) both;
}

.form-title {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: oklch(0.18 0.005 255);
  letter-spacing: -0.03em;
  margin: 0 0 6px;
  line-height: 1.2;
}

.form-sub {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 13px;
  color: #86868b;
  margin: 0;
}

/* ── Form body ── */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 28px;
  animation: fadeSlideUp 500ms 240ms var(--ease-out-expo) both;
}

/* ── Fields ── */
.fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  position: relative;
  padding-top: 18px;
}

.field-label {
  position: absolute;
  top: 20px;
  left: 0;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #86868b;
  pointer-events: none;
  transition:
    top 180ms var(--ease-out-quart),
    font-size 180ms var(--ease-out-quart),
    color 180ms var(--ease-out-quart),
    font-weight 180ms var(--ease-out-quart);
}

.field.focused .field-label,
.field.filled .field-label {
  top: 0;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #aeaeb2;
}

.field.focused .field-label {
  color: #6366f1;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-input {
  flex: 1;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 14px;
  color: oklch(0.18 0.005 255);
  padding: 4px 0;
  box-sizing: border-box;
  caret-color: #6366f1;
}

/* ── Animated underline ── */
.field-track {
  position: relative;
  height: 1px;
  background: #d2d2d7;
  margin-top: 2px;
  overflow: visible;
}

.field-fill {
  position: absolute;
  left: 50%;
  right: 50%;
  bottom: 0;
  height: 2px;
  background: #6366f1;
  transition:
    left 220ms var(--ease-out-quart),
    right 220ms var(--ease-out-quart);
}

.field.focused .field-fill {
  left: 0;
  right: 0;
}

/* ── Password toggle ── */
.pw-toggle {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 4px;
  color: #aeaeb2;
  cursor: pointer;
  line-height: 0;
  transition: color 150ms;
}

.pw-toggle:hover {
  color: #6e6e73;
}

/* ── Login button ── */
.btn-login {
  width: 100%;
  height: 44px;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 3px;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 150ms,
    transform 150ms var(--ease-out-quart),
    box-shadow 150ms var(--ease-out-quart);
  letter-spacing: -0.01em;
}

.btn-login:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}

.btn-login:disabled {
  cursor: default;
  opacity: 0.72;
}

.btn-loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* ── Form footer ── */
.form-foot {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 11px;
  color: #aeaeb2;
  text-align: center;
  animation: fadeSlideUp 500ms 320ms var(--ease-out-expo) both;
}

/* ── Entrance animations ── */
@keyframes brandSlideIn {
  from {
    transform: translateX(-32px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes formSlideIn {
  from {
    transform: translateX(24px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeSlideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .brand-panel,
  .form-panel,
  .brand-mark,
  .brand-tagline,
  .brand-deco,
  .form-head,
  .form-body,
  .form-foot {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .field-fill {
    transition: none;
  }
  .btn-login {
    transition: background 150ms;
  }
  .submit-progress {
    transition: none;
  }
}

/* ── Responsive ── */
@media (max-width: 700px) {
  .login-root {
    flex-direction: column;
  }

  .brand-panel {
    width: 100%;
    min-height: auto;
    padding: 32px 24px 28px;
    animation-name: fadeSlideUp;
  }

  .brand-tagline {
    font-size: 17px;
  }

  .brand-deco {
    display: none;
  }

  .form-panel {
    padding: 36px 24px 48px;
    animation-name: fadeSlideUp;
  }

  .form-wrap {
    max-width: 100%;
  }
}
</style>
