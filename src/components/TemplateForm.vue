<template>
  <div class="template-form-deel">
    <h4 class="form-title">템플릿 설정</h4>
    <div class="form-fields" :class="{ expanded: sidebarExpanded }">
      <div 
        v-for="(config, key) in templateConfig" 
        :key="key" 
        class="field-group"
        :class="{ 'full-width': isFullWidthField(config.type) }"
      >
        <label class="field-label">
          {{ config.label }}
        </label>
        
        <!-- Text, URL, Email, Number 등 -->
        <input 
          v-if="['text', 'url', 'email', 'number'].includes(config.type)"
          :type="config.type"
          v-model="localData[key]"
          :placeholder="config.placeholder || ''"
          class="field-input"
        />
        
        <!-- Textarea -->
        <textarea
          v-else-if="config.type === 'textarea'"
          v-model="localData[key]"
          :rows="config.rows || 3"
          :placeholder="config.placeholder || ''"
          class="field-textarea"
        ></textarea>
        
        <!-- Color Picker -->
        <div v-else-if="config.type === 'color'" class="color-field">
          <input 
            type="color"
            v-model="localData[key]"
            class="color-picker"
          />
          <input 
            type="text"
            v-model="localData[key]"
            class="field-input"
            style="flex: 1;"
          />
        </div>
        
        <!-- Select -->
        <div class="select-wrapper">
          <select
            v-if="config.type === 'select'"
            v-model="localData[key]"
            class="field-select"
          >
            <option v-for="option in config.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        
        <!-- Radio -->
        <div v-if="config.type === 'radio'" class="radio-field">
          <label v-for="option in config.options" :key="option.value" class="radio-option">
            <input 
              type="radio"
              :name="key"
              :value="option.value"
              v-model="localData[key]"
              class="radio-input"
            />
            <span class="radio-box"></span>
            <span class="radio-label">{{ option.label }}</span>
          </label>
        </div>
        
        <!-- Checkbox -->
        <label v-if="config.type === 'checkbox'" class="checkbox-field">
          <input 
            type="checkbox"
            v-model="localData[key]"
            class="checkbox-input"
          />
          <span class="checkbox-box"></span>
          <span class="checkbox-label">{{ config.checkboxLabel || '사용' }}</span>
        </label>

        <!-- Range Slider -->
        <div v-if="config.type === 'range'" class="range-field">
          <input 
            type="range"
            v-model.number="localData[key]"
            :min="config.min || 0"
            :max="config.max || 100"
            :step="config.step || 1"
            class="range-slider"
          />
          <div class="range-value">
            {{ localData[key] }}{{ config.unit || '' }}
          </div>
        </div>
        
        <!-- Date -->
        <input 
          v-if="config.type === 'date'"
          type="date"
          v-model="localData[key]"
          class="field-input"
        />

        <!-- Hotspot Group Editor -->
        <div v-if="config.type === 'hotspot-group' && isHotspotGroupField(key)">
          <HotspotGroupEditor
            :value="getHotspotGroupValue(key)"
            :sectionKey="key"
            :selectedId="selectedHotspotId"
            :visibleTopPosition="getVisibleTopForSection(key)"
            :sidebarExpanded="sidebarExpanded"
            @input="handleHotspotGroupInput($event, key)"
            @select="handleSelectHotspot"
          />
        </div>

        <!-- Image Link Group Editor -->
        <div v-if="config.type === 'image-link-group'">
          <ImageLinkGroupEditor
            v-model="localData[key]"
            :sidebarExpanded="sidebarExpanded"
          />
        </div>

        <!-- Image Map Editor -->
        <div v-if="config.type === 'image-map-rows'">
          <ImageMapEditor
            :rows="localData.imageMapRows"
            :areas="localData.imageMapAreas"
            :selectedAreaId="selectedHotspotId"
            :visibleScrollPosition="visibleScrollPosition"
            :sidebarExpanded="sidebarExpanded"
            @update:rows="localData.imageMapRows = $event"
            @update:areas="localData.imageMapAreas = $event"
            @select-area="handleSelectHotspot"
          />
        </div>

        <!-- Date Picker -->
        <DatePicker
          v-if="config.type === 'date-picker'"
          v-model="localData[key]"
        />

        <!-- Hotdeal Row1 Editor -->
        <HotdealRow1Editor
          v-if="config.type === 'hotdeal-row1-list'"
          v-model="localData[key]"
        />

        <!-- Hotdeal Row3 Editor -->
        <HotdealRow3Editor
          v-if="config.type === 'hotdeal-row3-list'"
          v-model="localData[key]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HotspotGroupEditor from './HotspotGroupEditor.vue'
import HotdealRow1Editor from './HotdealRow1Editor.vue'
import HotdealRow3Editor from './HotdealRow3Editor.vue'
import DatePicker from './DatePicker.vue'
import ImageLinkGroupEditor from './ImageLinkGroupEditor.vue'
import ImageMapEditor from './ImageMapEditor.vue'

export default {
  components: { 
    HotspotGroupEditor,
    HotdealRow1Editor,
    HotdealRow3Editor,
    DatePicker,
    ImageLinkGroupEditor, 
    ImageMapEditor
  },
  props: ['template', 'value', 'templateConfig', 'selectedHotspotId', 'visibleTopPositions', 'visibleScrollPosition', 'sidebarExpanded'],
  data() {
    return { 
      localData: {} 
    }
  },
  created() {
    this.localData = { ...this.value }
  },
  watch: {
    value: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localData)) {
          this.localData = { ...newVal }
        }
      },
      deep: true
    },
    localData: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.value)) {
          this.$emit('input', { ...val })
        }
      },
      deep: true
    }
  },
  methods: {
    isFullWidthField(type) {
      // 이 타입들은 expanded 상태에서도 전체 너비 사용
      const fullWidthTypes = ['hotspot-group', 'image-link-group', 'image-map-rows', 'textarea']
      return fullWidthTypes.includes(type)
    },
    
    isHotspotGroupField(key) {
      return key === 'hotspots1' || key === 'hotspots2'
    },
    
    getHotspotGroupValue(key) {
      return this.localData[key] || []
    },
    
    handleHotspotGroupInput(value, key) {
      this.$set(this.localData, key, value)
    },
    
    handleSelectHotspot(id) {
      this.$emit('select-hotspot', id)
    },
    
    getVisibleTopForSection(key) {
      // visibleTopPositions가 있으면 해당 섹션의 위치 반환
      if (this.visibleTopPositions) {
        const imageIndex = key === 'hotspots1' ? 1 : 2
        return this.visibleTopPositions[imageIndex] || 10
      }
      return 10 // 기본값
    }
  }
}
</script>

<style scoped>
.template-form-deel {
  width: 100%;
}

.form-title {
  margin: 0 0 20px 0;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.3s ease;
}

.form-fields.expanded {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 20px;
}

.form-fields.expanded .field-group.full-width {
  grid-column: 1 / -1;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

/* Input Styles */
.field-input,
.field-textarea {
  width: 100%;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #1f2937;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
}

.field-input:focus,
.field-textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.field-input::placeholder,
.field-textarea::placeholder {
  color: #9ca3af;
}

.field-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Select */
.select-wrapper {
  position: relative;
}

.field-select {
  width: 100%;
  padding: 10px 40px 10px 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #1f2937;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  transition: all 0.2s;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}

.field-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Color Picker */
.color-field {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-picker {
  width: 48px;
  height: 40px;
  padding: 4px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.color-picker:hover {
  border-color: #6366f1;
}

/* Radio */
.radio-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-option:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.radio-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.radio-box {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  position: relative;
}

.radio-input:checked + .radio-box {
  border-color: #6366f1;
}

.radio-input:checked + .radio-box::after {
  content: '';
  width: 10px;
  height: 10px;
  background: #6366f1;
  border-radius: 50%;
}

.radio-label {
  color: #374151;
  font-size: 14px;
}

/* Checkbox */
.checkbox-field {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.checkbox-field:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkbox-box {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox-input:checked + .checkbox-box {
  background: #6366f1;
  border-color: #6366f1;
}

.checkbox-input:checked + .checkbox-box::after {
  content: '';
  width: 4px;
  height: 8px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-top: -2px;
}

.checkbox-label {
  color: #374151;
  font-size: 14px;
}

/* Range Slider */
.range-field {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
}

.range-slider {
  flex: 1;
  height: 6px;
  appearance: none;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.range-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #6366f1;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.range-slider::-webkit-slider-thumb:hover {
  background: #4f46e5;
  transform: scale(1.1);
}

.range-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #6366f1;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.range-slider::-moz-range-thumb:hover {
  background: #4f46e5;
  transform: scale(1.1);
}

.range-value {
  min-width: 50px;
  text-align: right;
  font-weight: 600;
  color: #6366f1;
  font-size: 14px;
}
</style>