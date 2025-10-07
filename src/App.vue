<template>
  <div class="app-container">
    <div class="sidebar">
      <TemplateSelector v-model="selectedTemplate" />
      <TemplateForm :template="selectedTemplate" v-model="formData" />
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

export default {
  components: { TemplateSelector, TemplateForm, PreviewFrame },
  data() {
    return {
      selectedTemplate: 'em-type-1',
      formData: {
        title: '이벤트 타이틀',
        subtitle: '이벤트 부제목',
        heroImage: 'https://picsum.photos/500/300',
        mainHeading: '메인 문구',
        mainText: '여기에 본문 내용이 들어갑니다.',
        buttonText: '지금 참여하기',
        buttonLink: '#',
        buttonColor: '#007bff',
        footerText: 'ⓒ 2025 회사명 All rights reserved.'
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
</style>
