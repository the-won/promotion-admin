<template>
  <iframe ref="iframeRef" class="preview-frame"></iframe>
</template>

<script>
import EmType1 from '../templates/EmType1.vue'
import EmType2 from '../templates/EmType2.vue'
// import EmType3 from '../templates/EmType3.vue'
import Vue from 'vue'

export default {
  props: ['template', 'formData'],
  watch: {
    formData: {
      handler() {
        this.renderPreview()
      },
      deep: true
    },
    template() {
      this.renderPreview()
    }
  },
  mounted() {
    this.renderPreview()
  },
  methods: {
    renderPreview() {
      const iframe = this.$refs.iframeRef
      const iframeDoc = iframe.contentDocument
      iframeDoc.open()
      iframeDoc.write('<!DOCTYPE html><html><body><div id="app"></div></body></html>')
      iframeDoc.close()

      const map = {
        'em-type-1': EmType1,
        'em-type-2': EmType2,
        // 'em-type-3': EmType3
      }

      const comp = map[this.template]
      if (!comp) return

      new Vue({
        render: h => h(comp, { props: { data: this.formData } })
      }).$mount(iframeDoc.getElementById('app'))
    }
  }
}
</script>

<style scoped>
.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
