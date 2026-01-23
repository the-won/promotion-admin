<template>
  <div class="template-builder-container">
    <aside class="sidebar">
      <TemplateSelector @select-template="handleTemplateSelect" />
    </aside>
    
    <section class="main-content">
      <div class="form-section">
        <TemplateForm
          :template-name="currentTemplate"
          @form-update="handleFormUpdate"
        />
      </div>
      
      <div class="preview-section">
        <PreviewFrame
          :template-name="currentTemplate"
          :form-data="formData"
        />
      </div>
    </section>
  </div>
</template>

<script>
import TemplateSelector from '../components/TemplateSelector.vue'
import TemplateForm from '../components/TemplateForm.vue'
import PreviewFrame from '../components/PreviewFrame.vue'

export default {
  name: 'EventTemplates',
  components: {
    TemplateSelector,
    TemplateForm,
    PreviewFrame
  },
  data() {
    return {
      currentTemplate: 'em-type-1',
      formData: {}
    }
  },
  methods: {
    handleTemplateSelect(templateName) {
      this.currentTemplate = templateName
    },
    handleFormUpdate(data) {
      this.formData = data
    }
  }
}
</script>

<style scoped>
.template-builder-container {
  display: flex;
  gap: 24px;
  height: calc(100vh - 180px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
}

.main-content {
  flex: 1;
  display: flex;
  gap: 24px;
  min-width: 0;
}

.form-section {
  width: 400px;
  flex-shrink: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
}

.preview-section {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  min-width: 0;
}

.sidebar::-webkit-scrollbar,
.form-section::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track,
.form-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb,
.form-section::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb:hover,
.form-section::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

@media (max-width: 1400px) {
  .template-builder-container {
    flex-direction: column;
    height: auto;
  }

  .sidebar {
    width: 100%;
    max-height: 300px;
  }

  .main-content {
    flex-direction: column;
  }

  .form-section {
    width: 100%;
    max-height: 500px;
  }

  .preview-section {
    min-height: 600px;
  }
}
</style>