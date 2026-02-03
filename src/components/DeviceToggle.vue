<template>
  <div class="device-toggle">
    <button 
      type="button"
      class="toggle-btn"
      :class="{ active: value === 'web' }"
      @click="$emit('input', 'web')"
    >
      🖥️ 웹
    </button>
    <button 
      type="button"
      class="toggle-btn"
      :class="{ active: value === 'mobile' }"
      @click="$emit('input', 'mobile')"
    >
      📱 모바일
    </button>
  </div>
</template>

<script>
export default {
  name: 'DeviceToggle',
  props: {
    value: {
      type: String,
      default: 'web',
      validator: (v) => ['web', 'mobile'].includes(v)
    }
  }
}
</script>

<style scoped>
.device-toggle {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  margin-bottom: 16px;
  background: var(--color-bg-secondary, #f5f6fa);
  border-radius: var(--form-radius, 8px);
}

.toggle-btn {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary, #64748b);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.toggle-btn:hover {
  color: var(--color-text, #2d3748);
  background: rgba(255, 255, 255, 0.5);
}

.toggle-btn.active {
  color: var(--color-primary, #5568f8);
  background: var(--color-bg, #fff);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
</style>