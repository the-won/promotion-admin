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
import EmType5 from '../templates/EmType5.vue'
import EmTypeImageMap from '../templates/EmTypeImageMap.vue'  // ← 추가

export default {
  components: {
    EmType1,
    EmType2,
    EmType3,
    EmType4,
    EmType5,
    EmTypeImageMap
  },
  props: ['template', 'formData', 'selectedHotspotId'],
  computed: {
    currentComponent() {
      const map = {
        'em-type-1': 'EmType1',
        'em-type-2': 'EmType2',
        'em-type-3': 'EmType3',
        'em-type-4': 'EmType4',
        'em-type-5': 'EmType5',
        'em-type-imagemap': 'EmTypeImageMap'
      }
      return map[this.template] || 'EmType1'
    }
  },
  methods: {
    handleSelectHotspot(id) {
      this.$emit('select-hotspot', id)
    },
    handleUpdateHotspot(hotspot, hotspotsKey) {
      // hotspotsKey를 함께 전달
      this.$emit('update-hotspot', hotspot, hotspotsKey)
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