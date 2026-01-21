<template>
  <div class="template-form">
    <h3 class="section-title">템플릿 설정</h3>
    <div class="form-content">
      <div v-for="(config, key) in templateConfig" :key="key" class="form-field">
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
        <div v-else-if="config.type === 'color'" class="color-picker">
          <input 
            type="color"
            v-model="localData[key]"
            class="color-input"
          />
          <input 
            type="text"
            v-model="localData[key]"
            class="field-input"
            style="flex: 1;"
          />
        </div>
        
        <!-- Select -->
        <select
          v-else-if="config.type === 'select'"
          v-model="localData[key]"
          class="field-select"
        >
          <option v-for="option in config.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        
        <!-- Radio -->
        <div v-else-if="config.type === 'radio'" class="radio-group">
          <label v-for="option in config.options" :key="option.value" class="radio-label">
            <input 
              type="radio"
              :name="key"
              :value="option.value"
              v-model="localData[key]"
              class="radio-input"
            />
            <span class="radio-text">{{ option.label }}</span>
          </label>
        </div>
        
        <!-- Checkbox -->
        <label v-else-if="config.type === 'checkbox'" class="checkbox-label">
          <input 
            type="checkbox"
            v-model="localData[key]"
            class="checkbox-input"
          />
          <span class="checkbox-text">{{ config.checkboxLabel || '사용' }}</span>
        </label>

        <!-- Range Slider -->
        <div v-else-if="config.type === 'range'" class="range-group">
          <input 
            type="range"
            v-model.number="localData[key]"
            :min="config.min || 0"
            :max="config.max || 100"
            :step="config.step || 1"
            class="range-input"
          />
          <span class="range-value">
            {{ localData[key] }}{{ config.unit || '' }}
          </span>
        </div>
        
        <!-- Date -->
        <input 
          v-else-if="config.type === 'date'"
          type="date"
          v-model="localData[key]"
          class="field-input"
        />

        <!-- Hotspot Group Editor (em-type-3 전용) -->
        <div v-else-if="config.type === 'hotspot-group' && isHotspotGroupField(key)">
          <HotspotGroupEditor
            :value="getHotspotGroupValue(key)"
            :sectionKey="key"
            :selectedId="selectedHotspotId"
            @input="handleHotspotGroupInput($event, key)"
            @select="handleSelectHotspot"
          />
        </div>

        <!-- Image Link Group Editor (em-type-6) -->
        <div v-else-if="config.type === 'image-link-group'">
          <ImageLinkGroupEditor
            v-model="localData[key]"
          />
        </div>

        <!-- Image Map Editor (em-type-imagemap) -->
        <div v-else-if="config.type === 'image-map-rows'">
          <ImageMapEditor
            :rows="localData.imageMapRows"
            :areas="localData.imageMapAreas"
            :selectedAreaId="selectedHotspotId"
            @update:rows="localData.imageMapRows = $event"
            @update:areas="localData.imageMapAreas = $event"
            @select-area="handleSelectHotspot"
          />
        </div>

        <!-- Date Picker (커스텀) -->
        <DatePicker
          v-else-if="config.type === 'date-picker'"
          v-model="localData[key]"
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
  props: ['template', 'value', 'templateConfig', 'selectedHotspotId'],
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
    }
  }
}
</script>

<style scoped>
.template-form {
  width: 100%;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -0.1px;
}

/* Input Styles */
.field-input,
.field-textarea,
.field-select {
  width: 100%;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
}

.field-input:focus,
.field-textarea:focus,
.field-select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.field-input::placeholder,
.field-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.field-textarea {
  resize: vertical;
  min-height: 80px;
}

.field-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23ffffff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

/* Color Picker */
.color-picker {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-input {
  width: 50px;
  height: 40px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.color-input:hover {
  border-color: #667eea;
}

/* Radio Group */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: normal;
}

.radio-label:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(102, 126, 234, 0.5);
}

.radio-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.radio-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: normal;
}

.checkbox-label:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(102, 126, 234, 0.5);
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

/* Range Slider */
.range-group {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.range-input {
  flex: 1;
  height: 6px;
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.range-input::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.range-input::-webkit-slider-thumb:hover {
  background: #7c8ff5;
  transform: scale(1.1);
}

.range-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #667eea;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.range-input::-moz-range-thumb:hover {
  background: #7c8ff5;
  transform: scale(1.1);
}

.range-value {
  min-width: 50px;
  text-align: right;
  font-weight: 600;
  color: #667eea;
  font-size: 14px;
}
</style>