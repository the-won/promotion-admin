<template>
  <div class="preview-deel">
    <div class="preview-card">
      <div class="preview-header">
        <div class="preview-info">
          <h3 class="preview-title">템플릿 미리보기</h3>
          <p class="preview-subtitle">실시간 렌더링</p>
        </div>
        <div class="preview-actions">
          <button class="action-btn" title="새로고침">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84841 2 11.4867 2.87568 12.5 4.23333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M10 4H14V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="action-btn" title="전체화면">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 2H14V6M6 14H2V10M14 2L9 7M2 14L7 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="preview-body">
        <component 
          :is="currentComponent"
          :data="formData"
          :selectedId="selectedHotspotId"
          @select-hotspot="handleSelectHotspot"
          @update-hotspot="handleUpdateHotspot"
        />
      </div>
    </div>
  </div>
</template>

<script>
import EmType1 from '../templates/EmType1.vue'
import EmType2 from '../templates/EmType2.vue'
import EmType3 from '../templates/EmType3.vue'
import EmType4 from '../templates/EmType4.vue'
import EmType5 from '../templates/EmType5.vue'
import EmTypeImageMap from '../templates/EmTypeImageMap.vue'

export default {
  components: {
    EmType1,
    EmType2,
    EmType3,
    EmType4,
    EmType5,
    EmTypeImageMap
  },
  props: ['template', 'formData', 'selectedHotspotId'],
  computed: {
    currentComponent() {
      const map = {
        'em-type-1': 'EmType1',
        'em-type-2': 'EmType2',
        'em-type-3': 'EmType3',
        'em-type-4': 'EmType4',
        'em-type-5': 'EmType5',
        'em-type-imagemap': 'EmTypeImageMap'
      }
      return map[this.template] || 'EmType1'
    }
  },
  methods: {
    handleSelectHotspot(id) {
      this.$emit('select-hotspot', id)
    },
    handleUpdateHotspot(hotspot, hotspotsKey) {
      this.$emit('update-hotspot', hotspot, hotspotsKey)
    }
  }
}
</script>

<style scoped>
.preview-deel {
  width: 100%;
}

.preview-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(to bottom, #fafbfc, #f9fafb);
  border-bottom: 1px solid #f3f4f6;
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.preview-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.preview-subtitle {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #1f2937;
}

.preview-body {
  padding: 24px;
  background: #fff;
  min-height: 500px;
}

/* 내부 컴포넌트 스타일 */
.preview-body >>> * {
  max-width: 100%;
}
</style>