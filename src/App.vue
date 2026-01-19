<template>
  <div class="app-container">
    <div class="sidebar">
      <TemplateSelector v-model="selectedTemplate" />
      <TemplateForm 
        :template="selectedTemplate" 
        v-model="formData"
        :templateConfig="getTemplateConfig(selectedTemplate)"
        :selectedHotspotId="selectedHotspotId"
        @select-hotspot="handleSelectHotspot"
      />
      <div style="margin-top: 20px;">
        <button @click="handleDownload" class="download-btn">
          HTML 다운로드
        </button>
      </div>
    </div>
    <div class="preview">
      <PreviewFrame 
        :template="selectedTemplate" 
        :formData="formData"
        :selectedHotspotId="selectedHotspotId"
        @select-hotspot="handleSelectHotspot"
        @update-hotspot="handleUpdateHotspot"
      />
    </div>
  </div>
</template>

<script>
import TemplateSelector from './components/TemplateSelector.vue'
import TemplateForm from './components/TemplateForm.vue'
import PreviewFrame from './components/PreviewFrame.vue'
import { downloadHtml } from './utils/downloadHtml.js'
import { templateDefaults } from './config/templateDefaults.js'

export default {
  components: { TemplateSelector, TemplateForm, PreviewFrame },
  data() {
    return {
      selectedTemplate: 'em-type-1',
      formData: this.extractValues(templateDefaults['em-type-1']),
      selectedHotspotId: null
    }
  },
  watch: {
    selectedTemplate(newTemplate) {
      this.formData = this.extractValues(templateDefaults[newTemplate])
      this.selectedHotspotId = null
    }
  },
  methods: {
    extractValues(config) {
      const result = {}
      for (const key in config) {
        result[key] = config[key].value
      }
      return result
    },
    getTemplateConfig(templateName) {
      return templateDefaults[templateName]
    },
    handleDownload() {
      downloadHtml(this.selectedTemplate, this.formData)
    },
    handleSelectHotspot(id) {
      this.selectedHotspotId = id
    },
    handleUpdateHotspot(updatedHotspot, hotspotsKey) {
      // hotspotsKey가 전달되면 해당 배열 업데이트
      if (hotspotsKey && this.formData[hotspotsKey]) {
        const index = this.formData[hotspotsKey].findIndex(h => h.id === updatedHotspot.id)
        if (index !== -1) {
          this.formData[hotspotsKey].splice(index, 1, updatedHotspot)
        }
      } else if (this.formData.hotspots) {
        // 기존 방식 (hotspots 배열)
        const index = this.formData.hotspots.findIndex(h => h.id === updatedHotspot.id)
        if (index !== -1) {
          this.formData.hotspots.splice(index, 1, updatedHotspot)
        }
      }
    }
  }
}
</script>

<style>
.app-container {
  display: flex;
  height: 100vh;
}
.sidebar {
  flex: 1;
  padding: 20px;
  background: #f9fafb;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}
.preview {
  width: 1200px;
  background: #fff;
  padding: 20px;
  overflow-y: auto;
}
.download-btn {
  width: 100%;
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}
.download-btn:hover {
  background: #0056b3;
}
</style>