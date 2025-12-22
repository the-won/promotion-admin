<template>
  <table width="100%" cellspacing="0" cellpadding="0" style="background:#e8f4f8;">
    <tr>
      <td align="center">
        <table width="900" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:20px;background:#0077be;">
              <h1 style="color:#fff;margin:0;font-size:24px;">{{ data.headerText }}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0;">
              <div 
                class="image-container" 
                ref="container"
                @mousedown="handleContainerClick"
              >
                <!-- 이미지 -->
                <img 
                  :src="data.backgroundImage" 
                  class="background-image"
                  alt="Background"
                  @load="onImageLoad"
                  @dragstart.prevent
                />
                
                <!-- 각 버튼 영역 (드래그 가능) -->
                <div
                  v-for="hotspot in data.hotspots"
                  :key="hotspot.id"
                  class="draggable-hotspot"
                  :class="{ selected: selectedId === hotspot.id }"
                  :style="getHotspotStyle(hotspot)"
                  @mousedown="startDrag($event, hotspot)"
                >
                  <span class="label">{{ hotspot.text }}</span>
                  
                  <!-- 리사이즈 핸들 (선택된 경우만) -->
                  <template v-if="selectedId === hotspot.id">
                    <div class="resize-handle nw" @mousedown.stop="startResize($event, hotspot, 'nw')"></div>
                    <div class="resize-handle ne" @mousedown.stop="startResize($event, hotspot, 'ne')"></div>
                    <div class="resize-handle sw" @mousedown.stop="startResize($event, hotspot, 'sw')"></div>
                    <div class="resize-handle se" @mousedown.stop="startResize($event, hotspot, 'se')"></div>
                  </template>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px;background:#f9fafb;">
              <p style="margin:0;font-size:12px;color:#666;">{{ data.footerText }}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: ['data', 'selectedId'],
  data() {
    return {
      dragging: false,
      resizing: null,
      currentHotspot: null,
      startX: 0,
      startY: 0,
      initialPos: null,
      containerRect: null
    }
  },
  mounted() {
    this.updateContainerRect()
    window.addEventListener('resize', this.updateContainerRect)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateContainerRect)
  },
  methods: {
    onImageLoad() {
      this.$nextTick(() => {
        this.updateContainerRect()
      })
    },
    
    updateContainerRect() {
      if (this.$refs.container) {
        const rect = this.$refs.container.getBoundingClientRect()
        this.containerRect = {
          width: rect.width,
          height: rect.height
        }
      }
    },
    
    getHotspotStyle(hotspot) {
      const pos = hotspot.position
      return {
        left: pos.left + '%',
        top: pos.top + '%',
        width: pos.width + '%',
        height: pos.height + '%'
      }
    },
    
    handleContainerClick(event) {
      if (event.target === this.$refs.container || event.target.classList.contains('background-image')) {
        this.$emit('select-hotspot', null)
      }
    },
    
    startDrag(event, hotspot) {
      if (this.resizing) return
      
      this.$emit('select-hotspot', hotspot.id)
      
      this.dragging = true
      this.currentHotspot = hotspot
      this.startX = event.clientX
      this.startY = event.clientY
      this.initialPos = { ...hotspot.position }
      
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
      
      event.preventDefault()
      event.stopPropagation()
    },
    
    onDrag(event) {
      if (!this.dragging || !this.currentHotspot || !this.containerRect) return
      
      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY
      
      const deltaLeft = (dx / this.containerRect.width) * 100
      const deltaTop = (dy / this.containerRect.height) * 100
      
      let newLeft = this.initialPos.left + deltaLeft
      let newTop = this.initialPos.top + deltaTop
      
      newLeft = Math.max(0, Math.min(100 - this.currentHotspot.position.width, newLeft))
      newTop = Math.max(0, Math.min(100 - this.currentHotspot.position.height, newTop))
      
      this.$emit('update-hotspot', {
        ...this.currentHotspot,
        position: {
          ...this.currentHotspot.position,
          left: newLeft,
          top: newTop
        }
      })
    },
    
    stopDrag() {
      this
      this.dragging = false
      this.currentHotspot = null
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
    },
    
    startResize(event, hotspot, corner) {
      this.resizing = corner
      this.currentHotspot = hotspot
      this.startX = event.clientX
      this.startY = event.clientY
      this.initialPos = { ...hotspot.position }
      
      document.addEventListener('mousemove', this.onResize)
      document.addEventListener('mouseup', this.stopResize)
      
      event.preventDefault()
      event.stopPropagation()
    },
    
    onResize(event) {
      if (!this.resizing || !this.currentHotspot || !this.containerRect) return
      
      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY
      
      const deltaX = (dx / this.containerRect.width) * 100
      const deltaY = (dy / this.containerRect.height) * 100
      
      let newPos = { ...this.initialPos }
      
      if (this.resizing.includes('n')) {
        newPos.top = this.initialPos.top + deltaY
        newPos.height = this.initialPos.height - deltaY
      }
      if (this.resizing.includes('s')) {
        newPos.height = this.initialPos.height + deltaY
      }
      if (this.resizing.includes('w')) {
        newPos.left = this.initialPos.left + deltaX
        newPos.width = this.initialPos.width - deltaX
      }
      if (this.resizing.includes('e')) {
        newPos.width = this.initialPos.width + deltaX
      }
      
      newPos.width = Math.max(5, Math.min(80, newPos.width))
      newPos.height = Math.max(3, Math.min(50, newPos.height))
      
      newPos.left = Math.max(0, Math.min(100 - newPos.width, newPos.left))
      newPos.top = Math.max(0, Math.min(100 - newPos.height, newPos.top))
      
      this.$emit('update-hotspot', {
        ...this.currentHotspot,
        position: newPos
      })
    },
    
    stopResize() {
      this.resizing = null
      this.currentHotspot = null
      document.removeEventListener('mousemove', this.onResize)
      document.removeEventListener('mouseup', this.stopResize)
    }
  }
}
</script>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  user-select: none;
}

.background-image {
  width: 100%;
  display: block;
  pointer-events: none;
}

.draggable-hotspot {
  position: absolute;
  background: rgba(0, 123, 255, 0.2);
  border: 2px dashed #007bff;
  box-sizing: border-box;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.draggable-hotspot:hover {
  background: rgba(0, 123, 255, 0.3);
  border-color: #0056b3;
}

.draggable-hotspot.selected {
  background: rgba(0, 123, 255, 0.35);
  border-color: #0056b3;
  border-width: 3px;
  border-style: solid;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  z-index: 10;
}

.label {
  color: #007bff;
  font-weight: bold;
  font-size: 13px;
  text-align: center;
  pointer-events: none;
  user-select: none;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
}

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: white;
  border: 2px solid #007bff;
  border-radius: 50%;
  z-index: 20;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.resize-handle.nw {
  top: -5px;
  left: -5px;
  cursor: nw-resize;
}

.resize-handle.ne {
  top: -5px;
  right: -5px;
  cursor: ne-resize;
}

.resize-handle.sw {
  bottom: -5px;
  left: -5px;
  cursor: sw-resize;
}

.resize-handle.se {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}

.resize-handle:hover {
  background: #007bff;
  transform: scale(1.4);
  transition: all 0.15s;
}
</style>