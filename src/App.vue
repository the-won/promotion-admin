<template>
  <div class="app-wrapper">
    <!-- Header -->
    <header class="app-header">
      <!-- <div class="header-left">
        <div class="logo">
          <div class="logo-icon">📧</div>
          <span class="logo-text">EmailBuilder</span>
        </div>
      </div> -->

      <nav class="header-center">
        <router-link to="/home" class="nav-link">
          Home
        </router-link>
        <router-link to="/em-templates" class="nav-link">
          EM Templates
        </router-link>
        <router-link to="/event-templates" class="nav-link">
          Event Templates
        </router-link>
        <router-link to="/item-templates" class="nav-link">
          Item Templates
        </router-link>
        <router-link to="/settings" class="nav-link">
          Settings
        </router-link>
      </nav>

      <div class="header-right">
        <button class="icon-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3V17M3 10H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <button
          class="theme-toggle"
          @click="toggleDarkMode"
          :title="darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'"
          :aria-label="darkMode ? '라이트 모드' : '다크 모드'"
        >
          <span class="toggle-track" :class="{ active: darkMode }">
            <span class="toggle-thumb">
              <svg v-if="darkMode" width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            </span>
          </span>
        </button>
      </div>
    </header>

    <!-- Router View -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return { darkMode: false }
  },
  mounted() {
    this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    this.applyDarkMode()
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      this.applyDarkMode()
    },
    applyDarkMode() {
      document.body.classList.toggle('dark-mode', this.darkMode)
    }
  }
}
</script>

<style>


/* App Wrapper */
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* background: linear-gradient(to bottom, #c7b8ea 0%, rgba(199, 184, 234, 0.95) 10%);
  background: #f5e6d3; */
}

/* Header */
.app-header {
  height: 64px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 24px;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 100;
  transition: left var(--template-layout-duration, 0.35s) var(--template-layout-ease, cubic-bezier(0.4, 0, 0.2, 1)), width var(--template-layout-duration, 0.35s) var(--template-layout-ease, cubic-bezier(0.4, 0, 0.2, 1));
  /* background: #1f2937; */
}

/* Sidebar 상태에 따른 Header 조정 - Item Templates 페이지 */
body.page-item-templates:not(.sidebar-closed) .app-header {
  left: var(--sidebar-w);
  width: calc(100% - var(--sidebar-w));

}

body.page-item-templates.sidebar-expanded .app-header {
  left: var(--sidebar-w-expanded);
  width: calc(100% - var(--sidebar-w-expanded));
  
}

body.page-item-templates.sidebar-closed .app-header {
  left: 0;
  width: 100%;
}

/* Sidebar 상태에 따른 Header 조정 - EM Templates 페이지에서만 */
body.page-em-templates:not(.sidebar-closed) .app-header {
  left: var(--sidebar-w);
  width: calc(100% - var(--sidebar-w));
}

body.page-em-templates.sidebar-expanded .app-header {
  left: var(--sidebar-w-expanded);
  width: calc(100% - var(--sidebar-w-expanded));
}

body.page-em-templates.sidebar-closed .app-header {
  left: 0;
  width: 100%;
}

/* Sidebar 상태에 따른 Header 조정 - Event Templates 페이지에서만 */
body.page-event-templates:not(.sidebar-closed) .app-header {
  left: var(--sidebar-w);
  width: calc(100% - var(--sidebar-w));
}

body.page-event-templates.sidebar-expanded .app-header {
  left: var(--sidebar-w-expanded);
  width: calc(100% - var(--sidebar-w-expanded));
}

body.page-event-templates.sidebar-closed .app-header {
  left: 0;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 18px;
  color: #1f2937;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.header-center {
  grid-column: 2;
  justify-self: center;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(243, 244, 246, 0.7);
  padding: 4px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #1f2937;
  background: rgba(99, 102, 241, 0.08);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.95);
  color: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-right {
  grid-column: 3;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(249, 250, 251, 0.7);
  border: none;
  border-radius: 10px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  backdrop-filter: blur(10px);
}

.icon-btn:hover {
  background: rgba(243, 244, 246, 0.9);
  color: #1f2937;
}

.notification-btn {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 18px;
  height: 18px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(229, 231, 235, 0.6);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ---- 다크모드 토글 스위치 ---- */
.theme-toggle {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.toggle-track {
  width: 44px;
  height: 24px;
  background: #d2d2d7;
  border-radius: 12px;
  position: relative;
  transition: background 0.25s;
  display: flex;
  align-items: center;
}
.toggle-track.active {
  background: #0a84ff;
}
.toggle-thumb {
  position: absolute;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6e6e73;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
.toggle-track.active .toggle-thumb {
  transform: translateX(20px);
  color: #0a84ff;
}

/* ---- 헤더 다크모드 ---- */
body.dark-mode {
  /* background: #000; */
}
body.dark-mode .app-header {
  /* background: rgba(28, 28, 30, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); */
}
body.dark-mode .header-center {
  background: rgba(44, 44, 46, 0.8);
}
body.dark-mode .nav-link {
  color: rgba(255, 255, 255, 0.55);
}
body.dark-mode .nav-link:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.08);
}
body.dark-mode .nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  box-shadow: none;
}
body.dark-mode .icon-btn {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
}
body.dark-mode .icon-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}
body.dark-mode .toggle-track:not(.active) {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .header-center {
    display: none;
  }
}
</style>