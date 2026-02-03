<template>
  <div class="event-preview">
    <!-- 첫 번째 이미지 + 핫스팟 -->
    <div 
      v-if="imageUrl1"
      class="image-container" 
      ref="container1"
      @mousedown="handleContainerClick($event, 1)"
    >
      <img 
        :src="imageUrl1" 
        class="background-image"
        alt="Background"
        @load="onImageLoad(1)"
        @dragstart.prevent
      />
      
      <div
        v-for="hotspot in hotspots1"
        :key="hotspot.id"
        class="draggable-hotspot"
        :class="{ selected: selectedId === hotspot.id }"
        :style="getHotspotStyle(hotspot)"
        @mousedown="startDrag($event, hotspot, 1)"
      >
        <span class="label">{{ hotspot.text }}</span>
        
        <template v-if="selectedId === hotspot.id">
          <div class="resize-handle nw" @mousedown.stop="startResize($event, hotspot, 'nw', 1)"></div>
          <div class="resize-handle ne" @mousedown.stop="startResize($event, hotspot, 'ne', 1)"></div>
          <div class="resize-handle sw" @mousedown.stop="startResize($event, hotspot, 'sw', 1)"></div>
          <div class="resize-handle se" @mousedown.stop="startResize($event, hotspot, 'se', 1)"></div>
        </template>
      </div>
    </div>

    <!-- 두 번째 이미지 + 핫스팟 -->
    <div 
      v-if="imageUrl2"
      class="image-container" 
      ref="container2"
      @mousedown="handleContainerClick($event, 2)"
    >
      <img 
        :src="imageUrl2" 
        class="background-image"
        alt="Background 2"
        @load="onImageLoad(2)"
        @dragstart.prevent
      />
      
      <div
        v-for="hotspot in hotspots2"
        :key="hotspot.id"
        class="draggable-hotspot"
        :class="{ selected: selectedId === hotspot.id }"
        :style="getHotspotStyle(hotspot)"
        @mousedown="startDrag($event, hotspot, 2)"
      >
        <span class="label">{{ hotspot.text }}</span>
        
        <template v-if="selectedId === hotspot.id">
          <div class="resize-handle nw" @mousedown.stop="startResize($event, hotspot, 'nw', 2)"></div>
          <div class="resize-handle ne" @mousedown.stop="startResize($event, hotspot, 'ne', 2)"></div>
          <div class="resize-handle sw" @mousedown.stop="startResize($event, hotspot, 'sw', 2)"></div>
          <div class="resize-handle se" @mousedown.stop="startResize($event, hotspot, 'se', 2)"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    selectedId: {
      type: Number,
      default: null
    },
    deviceType: {
      type: String,
      default: 'web'
    }
  },
  data() {
    return {
      dragging: false,
      resizing: null,
      currentHotspot: null,
      currentImageIndex: null,
      startX: 0,
      startY: 0,
      initialPos: null,
      containerRects: {
        1: null,
        2: null
      }
    }
  },
  computed: {
    // 현재 디바이스에 따른 이미지 URL
    imageUrl1() {
      const group = this.data.hotspotGroup1
      if (!group) return null
      return this.deviceType === 'mobile' ? group.mobileImageUrl : group.webImageUrl
    },
    imageUrl2() {
      const group = this.data.hotspotGroup2
      if (!group) return null
      return this.deviceType === 'mobile' ? group.mobileImageUrl : group.webImageUrl
    },
    // 핫스팟 데이터
    hotspots1() {
      return this.data.hotspotGroup1?.hotspots || []
    },
    hotspots2() {
      return this.data.hotspotGroup2?.hotspots || []
    }
  },
  mounted() {
    this.updateContainerRect()
    window.addEventListener('resize', this.updateContainerRect)
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateContainerRect)
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    handleKeydown(event) {
      if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedId) {
        const tagName = event.target.tagName.toLowerCase()
        if (tagName === 'input' || tagName === 'textarea' || event.target.isContentEditable) {
          return
        }
        
        event.preventDefault()
        this.$emit('delete-hotspot', this.selectedId)
      }
    },
    
    onImageLoad(imageIndex) {
      this.$nextTick(() => {
        this.updateContainerRect(imageIndex)
      })
    },
    
    updateContainerRect(imageIndex) {
      if (imageIndex) {
        const ref = this.$refs[`container${imageIndex}`]
        if (ref) {
          const rect = ref.getBoundingClientRect()
          this.containerRects[imageIndex] = {
            width: rect.width,
            height: rect.height
          }
        }
      } else {
        [1, 2].forEach(idx => {
          const ref = this.$refs[`container${idx}`]
          if (ref) {
            const rect = ref.getBoundingClientRect()
            this.containerRects[idx] = {
              width: rect.width,
              height: rect.height
            }
          }
        })
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
    
    handleContainerClick(event, imageIndex) {
      if (event.target === this.$refs[`container${imageIndex}`] || 
          event.target.classList.contains('background-image')) {
        this.$emit('select-hotspot', null)
      }
    },
    
    startDrag(event, hotspot, imageIndex) {
      if (this.resizing) return
      
      this.$emit('select-hotspot', hotspot.id)
      
      this.dragging = true
      this.currentHotspot = hotspot
      this.currentImageIndex = imageIndex
      this.startX = event.clientX
      this.startY = event.clientY
      this.initialPos = { ...hotspot.position }
      
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
      
      event.preventDefault()
      event.stopPropagation()
    },
    
    onDrag(event) {
      if (!this.dragging || !this.currentHotspot || !this.currentImageIndex) return
      
      const containerRect = this.containerRects[this.currentImageIndex]
      if (!containerRect) return
      
      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY
      
      const deltaLeft = (dx / containerRect.width) * 100
      const deltaTop = (dy / containerRect.height) * 100
      
      let newLeft = this.initialPos.left + deltaLeft
      let newTop = this.initialPos.top + deltaTop
      
      newLeft = Math.max(0, Math.min(100 - this.currentHotspot.position.width, newLeft))
      newTop = Math.max(0, Math.min(100 - this.currentHotspot.position.height, newTop))
      
      const groupKey = `hotspotGroup${this.currentImageIndex}`
      
      this.$emit('update-hotspot', {
        ...this.currentHotspot,
        position: {
          ...this.currentHotspot.position,
          left: newLeft,
          top: newTop
        }
      }, groupKey)
    },
    
    stopDrag() {
      this.dragging = false
      this.currentHotspot = null
      this.currentImageIndex = null
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
    },
    
    startResize(event, hotspot, corner, imageIndex) {
      this.resizing = corner
      this.currentHotspot = hotspot
      this.currentImageIndex = imageIndex
      this.startX = event.clientX
      this.startY = event.clientY
      this.initialPos = { ...hotspot.position }
      
      document.addEventListener('mousemove', this.onResize)
      document.addEventListener('mouseup', this.stopResize)
      
      event.preventDefault()
      event.stopPropagation()
    },
    
    onResize(event) {
      if (!this.resizing || !this.currentHotspot || !this.currentImageIndex) return
      
      const containerRect = this.containerRects[this.currentImageIndex]
      if (!containerRect) return
      
      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY
      
      const deltaX = (dx / containerRect.width) * 100
      const deltaY = (dy / containerRect.height) * 100
      
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
      
      newPos.width = Math.max(5, Math.min(100, newPos.width))
      newPos.height = Math.max(3, Math.min(100, newPos.height))
      
      newPos.left = Math.max(0, Math.min(100 - newPos.width, newPos.left))
      newPos.top = Math.max(0, Math.min(100 - newPos.height, newPos.top))
      
      const groupKey = `hotspotGroup${this.currentImageIndex}`
      
      this.$emit('update-hotspot', {
        ...this.currentHotspot,
        position: newPos
      }, groupKey)
    },
    
    stopResize() {
      this.resizing = null
      this.currentHotspot = null
      this.currentImageIndex = null
      document.removeEventListener('mousemove', this.onResize)
      document.removeEventListener('mouseup', this.stopResize)
    }
  }
}
</script>

<style scoped>
.event-preview {
  width: 100%;
}

.image-container {
  position: relative;
  width: 100%;
  user-select: none;
  margin-bottom: 20px;
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
  font-size: 12px;
  text-align: center;
  pointer-events: none;
  user-select: none;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
  padding: 2px 6px;
  background: rgba(255,255,255,0.7);
  border-radius: 3px;
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