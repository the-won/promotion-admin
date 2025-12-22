<template>
  <div class="preview-container">
    <component 
      :is="currentComponent"
      :data="formData"
      :selectedId="selectedHotspotId"
      @select-hotspot="handleSelectHotspot"
      @update-hotspot="handleUpdateHotspot"
    />
  </div>
</template>

<script>
import EmType1 from '../templates/EmType1.vue'
import EmType2 from '../templates/EmType2.vue'
import EmType3 from '../templates/EmType3.vue'
import EmType4 from '../templates/EmType4.vue'

export default {
  components: {
    EmType1,
    EmType2,
    EmType3,
    EmType4
  },
  props: ['template', 'formData', 'selectedHotspotId'],
  computed: {
    currentComponent() {
      const map = {
        'em-type-1': 'EmType1',
        'em-type-2': 'EmType2',
        'em-type-3': 'EmType3',
        'em-type-4': 'EmType4'
      }
      return map[this.template] || 'EmType1'
    }
  },
  methods: {
    handleSelectHotspot(id) {
      this.$emit('select-hotspot', id)
    },
    handleUpdateHotspot(hotspot) {
      this.$emit('update-hotspot', hotspot)
    }
  }
}
</script>

<style scoped>
.preview-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #fff;
}
</style>