<template>
  <div class="template-form">
    <h4 class="form-title">템플릿 설정</h4>

    <!-- Device Toggle (hotspot-group 타입이 있을 때만 표시) -->
    <div v-if="hasHotspotGroup" class="device-toggle-section">
      <DeviceToggle v-model="currentDevice" />
    </div>

    <!-- 화끈딜 템플릿일 경우 통합 업로드 표시 -->
    <HotdealExcelUploader
      v-if="template === 'em-type-5'"
      :row1Products="localData.row1Products"
      :row3Products="localData.row3Products"
      @update:row1Products="localData.row1Products = $event"
      @update:row3Products="localData.row3Products = $event"
    />

    <div class="form-fields" :class="{ expanded: sidebarExpanded }">
      <div 
        v-for="(config, key) in templateConfig" 
        :key="key" 
        class="form-group"
        :class="{ 'full-width': isFullWidthField(config.type) }"
      >
        <label v-if="!isHideLabelField(config.type)" class="form-label">{{ config.label }}</label>
        
        <!-- Text, URL, Email, Number 등 -->
        <input 
          v-if="['text', 'url', 'email', 'number'].includes(config.type)"
          :type="config.type"
          v-model="localData[key]"
          :placeholder="config.placeholder || ''"
          class="form-input"
        />
        
        <!-- Textarea -->
        <textarea
          v-else-if="config.type === 'textarea'"
          v-model="localData[key]"
          :rows="config.rows || 3"
          :placeholder="config.placeholder || ''"
          class="form-textarea"
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
            class="form-input"
          />
        </div>
        
        <!-- Select -->
        <select
          v-else-if="config.type === 'select'"
          v-model="localData[key]"
          class="form-select"
        >
          <option v-for="option in config.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        
        <!-- Radio -->
        <div v-else-if="config.type === 'radio'" class="radio-group">
          <label v-for="option in config.options" :key="option.value" class="radio-item">
            <input 
              type="radio"
              :name="key"
              :value="option.value"
              v-model="localData[key]"
              class="form-radio"
            />
            <span class="radio-label">{{ option.label }}</span>
          </label>
        </div>
        
        <!-- Checkbox -->
        <label v-else-if="config.type === 'checkbox'" class="checkbox-item">
          <input 
            type="checkbox"
            v-model="localData[key]"
            class="form-checkbox"
          />
          <span class="checkbox-label">{{ config.checkboxLabel || '사용' }}</span>
        </label>

        <!-- Range Slider -->
        <div v-else-if="config.type === 'range'" class="range-field">
          <input 
            type="range"
            v-model.number="localData[key]"
            :min="config.min || 0"
            :max="config.max || 100"
            :step="config.step || 1"
            class="form-range"
          />
          <span class="range-value">{{ localData[key] }}{{ config.unit || '' }}</span>
        </div>
        
        <!-- Date -->
        <input 
          v-else-if="config.type === 'date'"
          type="date"
          v-model="localData[key]"
          class="form-input"
        />

        <!-- Date Picker -->
        <DatePicker
          v-else-if="config.type === 'date-picker'"
          v-model="localData[key]"
        />

        <!-- Hotspot Group Editor (이미지 + 핫스팟 통합) -->
        <HotspotGroupEditor
          v-else-if="config.type === 'hotspot-group'"
          v-model="localData[key]"
          :deviceType="currentDevice"
          :selectedId="selectedHotspotId"
          :visibleTopPosition="getVisibleTopForKey(key)"
          :sidebarExpanded="sidebarExpanded"
          @select="handleSelectHotspot"
        />

        <!-- Image Link Group Editor -->
        <ImageLinkGroupEditor
          v-else-if="config.type === 'image-link-group'"
          v-model="localData[key]"
          :sidebarExpanded="sidebarExpanded"
          :companyType.sync="localData.companyType"
          @select-image="handleSelectImage"
          @active-image-change="handleActiveImageChange"
        />

        <!-- Image Map Editor -->
        <ImageMapEditor
          v-else-if="config.type === 'image-map-rows'"
          :rows="localData.imageMapRows"
          :areas="localData.imageMapAreas"
          :selectedAreaId="selectedHotspotId"
          :selectedRowInfo="selectedRowInfo"
          :visibleScrollPosition="visibleScrollPosition"
          :sidebarExpanded="sidebarExpanded"
          @update:rows="localData.imageMapRows = $event"
          @update:areas="localData.imageMapAreas = $event"
          @select-area="handleSelectHotspot"
          @select-row="handleSelectRow"
          @clear-highlight="handleClearRowHighlight"
        />

        <!-- Hotdeal Row1 Editor -->
        <HotdealRow1Editor
          v-else-if="config.type === 'hotdeal-row1-list'"
          v-model="localData[key]"
        />

        <!-- Hotdeal Row3 Editor -->
        <HotdealRow3Editor
          v-else-if="config.type === 'hotdeal-row3-list'"
          v-model="localData[key]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DeviceToggle from './DeviceToggle.vue'
import HotspotGroupEditor from './event/HotspotGroupEditor.vue'
import HotdealRow1Editor from './em/secret-sale/HotdealRow1Editor.vue'
import HotdealRow3Editor from './em/secret-sale/HotdealRow3Editor.vue'
import HotdealExcelUploader from './em/secret-sale/HotdealExcelUploader.vue'
import DatePicker from './DatePicker.vue'
import ImageLinkGroupEditor from './em/type-image-link/ImageLinkGroupEditor.vue'
import ImageMapEditor from './em/type-usemap/ImageMapEditor.vue'

export default {
  components: { 
    DeviceToggle,
    HotspotGroupEditor,
    HotdealRow1Editor,
    HotdealRow3Editor,
    HotdealExcelUploader,
    DatePicker,
    ImageLinkGroupEditor, 
    ImageMapEditor
  },
  props: [
    'template', 
    'value', 
    'templateConfig', 
    'selectedHotspotId', 
    'visibleTopPositions', 
    'visibleScrollPosition', 
    'sidebarExpanded'
  ],
  data() {
    return { 
      localData: {},
      currentDevice: 'web',
      selectedImageInfo: { groupId: null, imageId: null },
      selectedRowInfo: { rowId: null, rowIndex: null }
    }
  },
  computed: {
    hasHotspotGroup() {
      if (!this.templateConfig) return false
      return Object.values(this.templateConfig).some(config => config.type === 'hotspot-group')
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
    },
    currentDevice(newVal) {
      this.$emit('device-change', newVal)
    }
  },
  methods: {
    isFullWidthField(type) {
      const fullWidthTypes = ['hotspot-group', 'image-link-group', 'image-map-rows', 'textarea']
      return fullWidthTypes.includes(type)
    },
    
    isHideLabelField(type) {
      return ['hotspot-group'].includes(type)
    },
    
    handleSelectHotspot(id) {
      this.$emit('select-hotspot', id)
    },
    
    handleSelectImage(info) {
      console.log('🖼️ 이미지 선택됨:', info)
      this.selectedImageInfo = info
      this.$emit('select-image', info)
    },
    
    handleSelectRow(info) {
      console.log('🖼️ 행 선택됨:', info)
      this.selectedRowInfo = info
      this.$emit('select-row', info)
    },
    
    handleActiveImageChange(info) {
      this.selectedImageInfo = info
    },
    
    handleClearRowHighlight() {
      this.selectedRowInfo = { rowId: null, rowIndex: null }
    },
    
    getVisibleTopForKey(key) {
      if (this.visibleTopPositions) {
        const match = key.match(/\d+$/)
        const index = match ? parseInt(match[0]) : 1
        return this.visibleTopPositions[index] || 10
      }
      return 10
    }
  }
}
</script>

<style scoped>
.template-form {
  width: 100%;
}

.form-title {
  margin: 0 0 20px 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.device-toggle-section {
  margin-bottom: 20px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-fields.expanded {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px 16px;
}

.form-fields.expanded .form-group.full-width {
  grid-column: 1 / -1;
}

/* Form Group */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 0;
}

.form-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary, #64748b);
}

/* Color Picker */
.color-field {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-field .form-input {
  flex: 1;
}

.color-picker {
  width: 40px;
  height: var(--form-height, 32px);
  padding: 2px;
  background: var(--color-bg, #fff);
  border: 1px solid var(--color-border, #e8ebf0);
  border-radius: var(--form-radius, 8px);
  cursor: pointer;
}

.color-picker:hover {
  border-color: var(--color-border-hover, #d8dce3);
}

/* Radio Group */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--color-bg-secondary, #f5f6fa);
  border: 1px solid transparent;
  border-radius: var(--form-radius, 8px);
  cursor: pointer;
  transition: all 0.15s ease;
}

.radio-item:hover {
  background: var(--color-bg-tertiary, #eceef2);
}

.radio-item:has(.form-radio:checked) {
  background: var(--color-primary-light, #eef0ff);
  border-color: var(--color-primary, #5568f8);
}

.form-radio {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--color-primary, #5568f8);
  cursor: pointer;
}

.radio-label {
  font-size: 11px;
  color: var(--color-text, #2d3748);
}

/* Checkbox */
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--color-bg-secondary, #f5f6fa);
  border: 1px solid transparent;
  border-radius: var(--form-radius, 8px);
  cursor: pointer;
  transition: all 0.15s ease;
}

.checkbox-item:hover {
  background: var(--color-bg-tertiary, #eceef2);
}

.checkbox-item:has(.form-checkbox:checked) {
  background: var(--color-primary-light, #eef0ff);
  border-color: var(--color-primary, #5568f8);
}

.form-checkbox {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--color-primary, #5568f8);
  cursor: pointer;
}

.checkbox-label {
  font-size: 11px;
  color: var(--color-text, #2d3748);
}

/* Range Slider */
.range-field {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--color-bg-secondary, #f5f6fa);
  border-radius: var(--form-radius, 8px);
}

.form-range {
  flex: 1;
  height: 4px;
  appearance: none;
  background: var(--color-border, #e8ebf0);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.form-range::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-primary, #5568f8);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s ease;
}

.form-range::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.form-range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--color-primary, #5568f8);
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.range-value {
  min-width: 45px;
  text-align: right;
  font-weight: 600;
  font-size: 11px;
  color: var(--color-primary, #5568f8);
}
</style>