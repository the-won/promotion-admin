<template>
    <div style="position: relative;">
      <img :src="data.backgroundImage"  alt="Background" />
      <!-- 각 버튼 영역 -->
                <!-- 각 버튼 영역 -->
                <a 
                  v-for="hotspot in data.hotspots"
                  :key="hotspot.id"
                  :href="hotspot.href"
                  :alt="hotspot.alt"
                  :title="hotspot.text"
                  :style="getHotspotStyle(hotspot)"
                  class="hotspot-area"
                >
                  {{ hotspot.text }}
                </a>
    </div>
 
</template>

<script>
export default {
  props: ['data'],
  methods: {
    getHotspotStyle(hotspot) {
      const pos = hotspot.position
      return `
        position: absolute;
        left: ${pos.left}%;
        top: ${pos.top}%;
        width: ${pos.width}%;
        height: ${pos.height}%;
        background: rgba(0, 123, 255, 0.5);
        border: 5px dashed red;
        color: #007bff;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        transition: all 0.3s;
        box-sizing: border-box;
      `
    }
  }
}
</script>

<style scoped>
.hotspot-area:hover {
  background: rgba(0, 123, 255, 0.4) !important;
  border-color: #0056b3 !important;
  transform: scale(1.02);
}
</style>