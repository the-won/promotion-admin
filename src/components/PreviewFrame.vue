<template>
  <div class="preview-wrapper">
    <div class="preview-card">
      <div class="preview-header">
        <div class="preview-badge">Preview</div>
        <div class="preview-actions">
          <button class="preview-action-btn" title="새로고침">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84841 2 11.4867 2.87568 12.5 4.23333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M10 4H14V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
.preview-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.preview-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(to bottom, #fafbfc, #f5f7fa);
  border-bottom: 1px solid #e5e7eb;
}

.preview-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 12px;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.preview-action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-action-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.preview-body {
  padding: 20px;
  background: #fff;
  min-height: 400px;
}

/* 내부 컴포넌트에 대한 스타일 재정의 방지 */
.preview-body >>> * {
  max-width: 100%;
}
</style>