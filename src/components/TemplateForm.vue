<template>
  <div>
    <h3>입력폼 ({{ template }})</h3>
    <div v-for="(config, key) in templateConfig" :key="key" style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; font-weight: bold;">
        {{ config.label }}
      </label>
      
      <!-- Text, URL, Email, Number 등 -->
      <input 
        v-if="['text', 'url', 'email', 'number'].includes(config.type)"
        :type="config.type"
        v-model="localData[key]"
        :placeholder="config.placeholder || ''"
        style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
      />
      
      <!-- Textarea -->
      <textarea
        v-else-if="config.type === 'textarea'"
        v-model="localData[key]"
        :rows="config.rows || 3"
        :placeholder="config.placeholder || ''"
        style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"
      ></textarea>
      
      <!-- Color Picker -->
      <div v-else-if="config.type === 'color'" style="display: flex; gap: 10px; align-items: center;">
        <input 
          type="color"
          v-model="localData[key]"
          style="width: 60px; height: 40px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;"
        />
        <input 
          type="text"
          v-model="localData[key]"
          style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
        />
      </div>
      
      <!-- Select -->
      <select
        v-else-if="config.type === 'select'"
        v-model="localData[key]"
        style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
      >
        <option v-for="option in config.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      
      <!-- Radio -->
      <div v-else-if="config.type === 'radio'" style="display: flex; flex-direction: column; gap: 8px;">
        <label v-for="option in config.options" :key="option.value" style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
          <input 
            type="radio"
            :name="key"
            :value="option.value"
            v-model="localData[key]"
          />
          {{ option.label }}
        </label>
      </div>
      
      <!-- Checkbox -->
      <label v-else-if="config.type === 'checkbox'" style="display: flex; align-items: center; gap: 8px; font-weight: normal; cursor: pointer;">
        <input 
          type="checkbox"
          v-model="localData[key]"
          style="width: 18px; height: 18px; cursor: pointer;"
        />
        <span>{{ config.checkboxLabel || '사용' }}</span>
      </label>

      <!-- Range Slider -->
      <div v-else-if="config.type === 'range'" style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <input 
            type="range"
            v-model.number="localData[key]"
            :min="config.min || 0"
            :max="config.max || 100"
            :step="config.step || 1"
            style="flex: 1; margin-right: 10px;"
          />
          <span style="min-width: 50px; text-align: right; font-weight: bold; color: #007bff;">
            {{ localData[key] }}{{ config.unit || '' }}
          </span>
        </div>
      </div>
      
      <!-- Date -->
      <input 
        v-else-if="config.type === 'date'"
          type="date"
          v-model="localData[key]"
          style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
        />

      <!-- Hotspot Editor -->
      <HotspotEditor
        v-else-if="config.type === 'hotspot-list'"
        v-model="localData[key]"
        :selectedId="selectedHotspotId"
        @select="handleSelectHotspot"
      />

    </div>
  </div>
</template>

<script>
import HotspotEditor from './HotspotEditor.vue'

export default {
  components: { HotspotEditor },
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
    handleSelectHotspot(id) {
      this.$emit('select-hotspot', id)
    }
  }
}
</script>