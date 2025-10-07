<template>
  <div class="app-container">
    <div class="sidebar">
      <TemplateSelector v-model="selectedTemplate" />
      <TemplateForm :template="selectedTemplate" v-model="formData" />
      <div style="margin-top: 20px;">
        <button @click="handleDownload" class="download-btn">
          HTML 다운로드
        </button>
      </div>
    </div>
    <div class="preview">
      <PreviewFrame :template="selectedTemplate" :formData="formData" />
    </div>
  </div>
</template>

<script>
import TemplateSelector from './components/TemplateSelector.vue'
import TemplateForm from './components/TemplateForm.vue'
import PreviewFrame from './components/PreviewFrame.vue'
import { downloadHtml } from './utils/downloadHtml.js'

const templateDefaults = {
  'em-type-1': {
    title: '이벤트 타이틀',
    subtitle: '이벤트 부제목',
    heroImage: 'https://picsum.photos/500/300',
    mainHeading: '메인 문구',
    mainText: '여기에 본문 내용이 들어갑니다.',
    buttonText: '지금 참여하기',
    buttonLink: '#',
    buttonColor: '#007bff',
    footerText: 'ⓒ 2025 회사명 All rights reserved.'
  },
  'em-type-2': {
    bannerTitle: '배너 타이틀',
    bannerImage: 'https://picsum.photos/600/400',
    description: '이벤트 설명 내용입니다.',
    actionText: '자세히 보기',
    actionLink: '#',
    themeColor: '#ff6b35'
  },
  'em-type-3': {
    headerText: '헤더 텍스트',
    bodyContent: '본문 내용',
    ctaText: 'CTA 버튼',
    ctaLink: '#'
  }
}

export default {
  components: { TemplateSelector, TemplateForm, PreviewFrame },
  data() {
    return {
      selectedTemplate: 'em-type-1',
      formData: { ...templateDefaults['em-type-1'] }
    }
  },
  watch: {
    selectedTemplate(newTemplate) {
      this.formData = { ...templateDefaults[newTemplate] }
    }
  },
  methods: {
    handleDownload() {
      downloadHtml(this.selectedTemplate, this.formData)
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
  width: 40%;
  padding: 20px;
  background: #f9fafb;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}
.preview {
  flex: 1;
  background: #fff;
  padding: 20px;
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