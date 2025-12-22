<template>
  <div 
    class="draggable-hotspot"
    :class="{ selected: isSelected }"
    :style="hotspotStyle"
    @mousedown="startDrag"
  >
    <span class="label">{{ hotspot.text }}</span>
    
    <!-- 리사이즈 핸들 (4개 모서리) -->
    <div 
      v-if="isSelected"
      class="resize-handle nw" 
      @mousedown.stop="startResize($event, 'nw')"
    ></div>
    <div 
      v-if="isSelected"
      class="resize-handle ne" 
      @mousedown.stop="startResize($event, 'ne')"
    ></div>
    <div 
      v-if="isSelected"
      class="resize-handle sw" 
      @mousedown.stop="startResize($event, 'sw')"
    ></div>
    <div 
      v-if="isSelected"
      class="resize-handle se" 
      @mousedown.stop="startResize($event, 'se')"
    ></div>
  </div>
</template>

<script>
export default {
  props: ['hotspot', 'isSelected', 'containerRect'],
  data() {
    return {
      dragging: false,
      resizing: null,
      startX: 0,
      startY: 0,
      initialPos: null
    }
  },
  computed: {
    hotspotStyle() {
      const pos = this.hotspot.position
      return {
        position: 'absolute',
        left: pos.left + '%',
        top: pos.top + '%',
        width: pos.width + '%',
        height: pos.height + '%'
      }
    }
  },
  methods: {
    startDrag(event) {
      if (this.resizing) return
      
      this.$emit('select', this.hotspot.id)
      
      this.dragging = true
      this.startX = event.clientX
      this.startY = event.clientY
      this.initialPos = { ...this.hotspot.position }
      
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
      
      event.preventDefault()
    },
    
    onDrag(event) {
      if (!this.dragging) return
      
      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY
      
      const deltaLeft = (dx / this.containerRect.width) * 100
      const deltaTop = (dy / this.containerRect.height) * 100
      
      let newLeft = this.initialPos.left + deltaLeft
      let newTop = this.initialPos.top + deltaTop
      
      // 경계 제한
      newLeft = Math.max(0, Math.min(100 - this.hotspot.position.width, newLeft))
      newTop = Math.max(0, Math.min(100 - this.hotspot.position.height, newTop))
      
      this.$emit('update', {
        ...this.hotspot,
        position: {
          ...this.hotspot.position,
          left: newLeft,
          top: newTop
        }
      })
    },
    
    stopDrag() {
      this.dragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
    },
    
    startResize(event, corner) {
      this.resizing = corner
      this.startX = event.clientX
      this.startY = event.clientY
      this.initialPos = { ...this.hotspot.position }
      
      document.addEventListener('mousemove', this.onResize)
      document.addEventListener('mouseup', this.stopResize)
      
      event.preventDefault()
    },
    
    onResize(event) {
      if (!this.resizing) return
      
      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY
      
      const deltaX = (dx / this.containerRect.width) * 100
      const deltaY = (dy / this.containerRect.height) * 100
      
      let newPos = { ...this.initialPos }
      
      // 모서리별 리사이즈 로직
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
      
      // 최소 크기 제한
      newPos.width = Math.max(5, Math.min(80, newPos.width))
      newPos.height = Math.max(3, Math.min(30, newPos.height))
      
      // 경계 제한
      newPos.left = Math.max(0, Math.min(100 - newPos.width, newPos.left))
      newPos.top = Math.max(0, Math.min(100 - newPos.height, newPos.top))
      
      this.$emit('update', {
        ...this.hotspot,
        position: newPos
      })
    },
    
    stopResize() {
      this.resizing = null
      document.removeEventListener('mousemove', this.onResize)
      document.removeEventListener('mouseup', this.stopResize)
    }
  }
}
</script>

<style scoped>
.draggable-hotspot {
  background: rgba(0, 123, 255, 0.2);
  border: 2px dashed #007bff;
  box-sizing: border-box;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.draggable-hotspot:hover {
  background: rgba(0, 123, 255, 0.3);
}

.draggable-hotspot.selected {
  background: rgba(0, 123, 255, 0.35);
  border-color: #0056b3;
  border-width: 3px;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
}

.label {
  color: #007bff;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  pointer-events: none;
  user-select: none;
}

.resize-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: white;
  border: 2px solid #007bff;
  border-radius: 50%;
  z-index: 10;
}

.resize-handle.nw {
  top: -6px;
  left: -6px;
  cursor: nw-resize;
}

.resize-handle.ne {
  top: -6px;
  right: -6px;
  cursor: ne-resize;
}

.resize-handle.sw {
  bottom: -6px;
  left: -6px;
  cursor: sw-resize;
}

.resize-handle.se {
  bottom: -6px;
  right: -6px;
  cursor: se-resize;
}

.resize-handle:hover {
  background: #007bff;
  transform: scale(1.3);
}
</style>