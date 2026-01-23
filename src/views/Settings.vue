<template>
  <div class="coming-soon">
    <div class="coming-soon-icon">⚙️</div>
    <h2>Settings</h2>
    <p>작업 진행중입니다</p>
    <div class="progress-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings'
}
</script>

<style scoped>
.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.coming-soon-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: bounce 2s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.coming-soon h2 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 12px;
  font-weight: 700;
}

.coming-soon p {
  font-size: 18px;
  color: #7f8c8d;
  margin-bottom: 32px;
}

.progress-dots {
  display: flex;
  gap: 8px;
}

.progress-dots span {
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
  animation: pulse 1.5s ease infinite;
}

.progress-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.progress-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>