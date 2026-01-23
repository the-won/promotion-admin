<template>
  <div class="app-wrapper">
    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo">
          <div class="logo-icon">📧</div>
          <span class="logo-text">EmailBuilder</span>
        </div>
      </div>

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
       
        <button class="icon-btn notification-btn">
          <span class="notification-badge">2</span>
        </button>
        <div class="user-avatar">
          <img src="https://i.pravatar.cc/40?img=12" alt="User" />
        </div>
      </div>
    </header>

    <!-- Router View -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Reset & Base */
html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

img {
  vertical-align: top;
  border: none;
}

/* App Wrapper */
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #c7b8ea 0%, rgba(199, 184, 234, 0.95) 10%);
  background: #f5e6d3;
}

/* Header */
.app-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(to bottom, #c7b8ea 0%, rgba(199, 184, 234, 0.95) 100%);
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

/* Responsive */
@media (max-width: 768px) {
  .header-center {
    display: none;
  }
}
</style>