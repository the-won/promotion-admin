<template>
  <div class="event-preview">
    <!-- TopBanner 조건부 렌더링 -->
    <!-- 상단 배너 (디바이스별) -->
      <TopBanner 
        v-if="deviceType === 'web' && showTopBanner" 
      />
      <TopBannerMobile 
        v-if="deviceType === 'mobile' && showTopBanner" 
      />

    <!-- 첫 번째 이미지 + 핫스팟 -->
    <div 
      v-if="imageUrl1"
      :ref="`image-container-1`"
      class="image-container"
      :class="{ 
        'image-container-highlighted': activeImageIndex === 1 || isImageContainerActive(1)
      }"
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
        :ref="`hotspot-${hotspot.id}`"
        class="draggable-hotspot"
        :class="{ 
          selected: selectedId === hotspot.id,
          'highlight-hotspot': isHotspotActive(hotspot.id, 1)
        }"
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
      :ref="`image-container-2`"
      class="image-container"
      :class="{ 
        'image-container-highlighted': activeImageIndex === 2 || isImageContainerActive(2)
      }"
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
        :ref="`hotspot-${hotspot.id}`"
        class="draggable-hotspot"
        :class="{ 
          selected: selectedId === hotspot.id,
          'highlight-hotspot': isHotspotActive(hotspot.id, 2)
        }"
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

    <!-- 하단 배너 (디바이스별) -->
      <BottomBanner 
        v-if="deviceType === 'web' && showBottomBanner" 
      />
      <BottomBannerMobile 
        v-if="deviceType === 'mobile' && showBottomBanner" 
      />
  </div>
</template>

<script>
import imageHighlightMixin from '../../utils/imageHighlightMixin'
import TopBanner  from '../../components/event/common/TopBanner.vue'
import TopBannerMobile   from '../../components/event/common/TopBannerMobile.vue'
import BottomBanner from '../../components/event/common/BottomBanner.vue';
import BottomBannerMobile  from '../../components/event/common/BottomBannerMobile.vue';

export default {
  mixins: [imageHighlightMixin],
  components: { TopBanner, TopBannerMobile, BottomBanner, BottomBannerMobile },
  props: {
    data: {
      type: Object,
      required: true
    },
    selectedId: {
      type: Number,
      default: null
    },
    activeImageIndex: {
      type: Number,
      default: null
    },
    selectedHotspotInfo: {
      type: Object,
      default: () => ({ hotspotId: null, groupIndex: null })
    },
    deviceType: {
      type: String,
      default: 'web'
    },
    showTopBanner: {  // 👈 추가
      type: Boolean,
      default: true
    },
    showBottomBanner: {  // 👈 추가 (사용은 안하지만 props 에러 방지)
      type: Boolean,
      default: false
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
    // 현재 디바이스에 따른 이미지 URL (모바일 URL 없으면 웹 URL fallback)
    imageUrl1() {
      const group = this.data.hotspotGroup1
      if (!group) return null
      if (this.deviceType === 'mobile') {
        return group.mobileImageUrl || group.webImageUrl
      }
      return group.webImageUrl
    },
    imageUrl2() {
      const group = this.data.hotspotGroup2
      if (!group) return null
      if (this.deviceType === 'mobile') {
        return group.mobileImageUrl || group.webImageUrl
      }
      return group.webImageUrl
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
  watch: {
    'selectedHotspotInfo.timestamp'(newVal) {
      console.log('👀 selectedHotspotInfo 타임스탬프 변경됨:', newVal)
      
      if (this.selectedHotspotInfo && this.selectedHotspotInfo.hotspotId) {
        // 이미지 컨테이너인 경우 (image-container-1, image-container-2)
        if (typeof this.selectedHotspotInfo.hotspotId === 'string' && 
            this.selectedHotspotInfo.hotspotId.startsWith('image-container-')) {
          const refKey = this.selectedHotspotInfo.hotspotId
          this.$nextTick(() => {
            this.scrollToImageByRef(refKey)
            this.startHighlightTimer(2000)
          })
        } else {
          // 일반 핫스팟인 경우
          const refKey = `hotspot-${this.selectedHotspotInfo.hotspotId}`
          this.$nextTick(() => {
            this.scrollToImageByRef(refKey)
            this.startHighlightTimer(2000)
          })
        }
      }
    }
  },
  methods: {
    isHotspotActive(hotspotId, groupIndex) {
      return this.selectedHotspotInfo && 
             this.selectedHotspotInfo.hotspotId === hotspotId && 
             this.selectedHotspotInfo.groupIndex === groupIndex
    },
    
    isImageContainerActive(groupIndex) {
      return this.selectedHotspotInfo && 
             this.selectedHotspotInfo.hotspotId === `image-container-${groupIndex}` &&
             this.selectedHotspotInfo.groupIndex === groupIndex
    },
    
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
        const ref = this.$refs[`image-container-${imageIndex}`]
        if (ref) {
          const rect = ref.getBoundingClientRect()
          this.containerRects[imageIndex] = {
            width: rect.width,
            height: rect.height
          }
        }
      } else {
        [1, 2].forEach(idx => {
          const ref = this.$refs[`image-container-${idx}`]
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
      const containerRef = this.$refs[`image-container-${imageIndex}`]
      if (event.target === containerRef || 
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
  transition: all 0.3s ease;
}

.image-container-highlighted {
  outline: 4px solid #5568f8;
  outline-offset: 4px;
  box-shadow: 0 0 0 4px rgba(85, 104, 248, 0.1),
              0 8px 24px rgba(85, 104, 248, 0.2);
  background: rgba(85, 104, 248, 0.02);
  transform: scale(1.005);
  z-index: 5;
}

.image-container-highlighted::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  background: linear-gradient(135deg, 
    rgba(85, 104, 248, 0.1) 0%, 
    rgba(85, 104, 248, 0.05) 50%,
    rgba(85, 104, 248, 0.1) 100%);
  border-radius: 4px;
  pointer-events: none;
  animation: pulse-highlight 2s ease-in-out infinite;
}

@keyframes pulse-highlight {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
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

/* 핫스팟 하이라이트 */
.highlight-hotspot {
  outline: 3px solid #6366f1 !important;
  outline-offset: 2px;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.8) !important;
  animation: hotspotPulse 1.5s ease-in-out infinite;
  z-index: 100 !important;
}

@keyframes hotspotPulse {
  0%, 100% {
    outline-color: #6366f1;
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.8);
  }
  50% {
    outline-color: #818cf8;
    box-shadow: 0 0 30px rgba(99, 102, 241, 1);
  }
}
</style>