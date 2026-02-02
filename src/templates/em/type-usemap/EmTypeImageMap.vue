<template>
  <div class="em-type-imagemap">
    <table cellSpacing="0" cellPadding="0" width="720" border="0">
      <tr v-for="(row, rowIndex) in rows" :key="row.id">
        <td>
          <div 
            class="image-container"
            :ref="'container_' + row.id"
            :style="{ width: row.width + 'px', position: 'relative' }"
            @mousedown="handleContainerClick($event, row)"
          >
            <img 
              :src="row.imageUrl" 
              :width="row.width"
              :height="row.height"
              :alt="row.imageAlt"
              align="left"
              border="0"
              class="preview-image"
              @dragstart.prevent
            />

            <!-- 핫스팟 오버레이 - 해당 row에 속한 areas만 표시 -->
            <div
              v-for="area in getAreasForRow(row.id)"
              :key="area.id"
              class="hotspot-overlay"
              :class="{ selected: selectedId === area.id }"
              :style="getAreaStyle(area)"
              @mousedown.stop="startDrag($event, area, row)"
            >
              <span class="hotspot-label">{{ area.alt }}</span>

              <!-- 리사이즈 핸들 (선택된 경우에만) -->
              <template v-if="selectedId === area.id">
                <div class="resize-handle nw" @mousedown.stop="startResize($event, area, row, 'nw')"></div>
                <div class="resize-handle ne" @mousedown.stop="startResize($event, area, row, 'ne')"></div>
                <div class="resize-handle sw" @mousedown.stop="startResize($event, area, row, 'sw')"></div>
                <div class="resize-handle se" @mousedown.stop="startResize($event, area, row, 'se')"></div>
              </template>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <div v-if="rows.length === 0" class="empty-preview">
      행을 추가하면 여기에 프리뷰가 표시됩니다.
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmTypeImageMap',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    selectedId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      dragging: false,
      resizing: false,
      resizeCorner: null,
      currentArea: null,
      currentRow: null,
      startX: 0,
      startY: 0,
      initialCoords: null
    }
  },
  computed: {
    rows() {
      return this.data.imageMapRows || []
    },
    areas() {
      return this.data.imageMapAreas || []
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    handleKeydown(event) {
      // Delete 또는 Backspace 키로 선택된 핫스팟 삭제
      if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedId) {
        // input, textarea 등에서는 동작하지 않도록
        const tagName = event.target.tagName.toLowerCase()
        if (tagName === 'input' || tagName === 'textarea' || event.target.isContentEditable) {
          return
        }
        
        event.preventDefault()
        this.$emit('delete-hotspot', this.selectedId)
      }
    },
    
    // 특정 row에 속한 areas 반환
    getAreasForRow(rowId) {
      return this.areas.filter(a => a.rowId === rowId)
    },

    getAreaStyle(area) {
      const { x1, y1, x2, y2 } = area.coords
      return {
        left: x1 + 'px',
        top: y1 + 'px',
        width: (x2 - x1) + 'px',
        height: (y2 - y1) + 'px'
      }
    },

    handleContainerClick(event, row) {
      this.$emit('select-hotspot', null)
    },

    startDrag(event, area, row) {
      event.preventDefault()
      
      this.dragging = true
      this.currentArea = area
      this.currentRow = row
      this.startX = event.clientX
      this.startY = event.clientY
      this.initialCoords = { ...area.coords }

      this.$emit('select-hotspot', area.id)

      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
    },

    onDrag(event) {
      if (!this.dragging || !this.currentArea) return

      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY

      const width = this.initialCoords.x2 - this.initialCoords.x1
      const height = this.initialCoords.y2 - this.initialCoords.y1

      let newX1 = this.initialCoords.x1 + dx
      let newY1 = this.initialCoords.y1 + dy

      // 경계 제한
      newX1 = Math.max(0, Math.min(newX1, this.currentRow.width - width))
      newY1 = Math.max(0, Math.min(newY1, this.currentRow.height - height))

      this.currentArea.coords.x1 = Math.round(newX1)
      this.currentArea.coords.y1 = Math.round(newY1)
      this.currentArea.coords.x2 = Math.round(newX1 + width)
      this.currentArea.coords.y2 = Math.round(newY1 + height)

      // 'imageMapAreas'를 hotspotsKey로 전달 → 기존 App.vue 로직 활용
      this.$emit('update-hotspot', this.currentArea, 'imageMapAreas')
    },

    stopDrag() {
      this.dragging = false
      this.currentArea = null
      this.currentRow = null
      this.initialCoords = null

      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
    },

    startResize(event, area, row, corner) {
      event.preventDefault()

      this.resizing = true
      this.resizeCorner = corner
      this.currentArea = area
      this.currentRow = row
      this.startX = event.clientX
      this.startY = event.clientY
      this.initialCoords = { ...area.coords }

      document.addEventListener('mousemove', this.onResize)
      document.addEventListener('mouseup', this.stopResize)
    },

    onResize(event) {
      if (!this.resizing || !this.currentArea) return

      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY
      const minSize = 20

      let { x1, y1, x2, y2 } = this.initialCoords

      switch (this.resizeCorner) {
        case 'nw':
          x1 = Math.min(this.initialCoords.x1 + dx, x2 - minSize)
          y1 = Math.min(this.initialCoords.y1 + dy, y2 - minSize)
          break
        case 'ne':
          x2 = Math.max(this.initialCoords.x2 + dx, x1 + minSize)
          y1 = Math.min(this.initialCoords.y1 + dy, y2 - minSize)
          break
        case 'sw':
          x1 = Math.min(this.initialCoords.x1 + dx, x2 - minSize)
          y2 = Math.max(this.initialCoords.y2 + dy, y1 + minSize)
          break
        case 'se':
          x2 = Math.max(this.initialCoords.x2 + dx, x1 + minSize)
          y2 = Math.max(this.initialCoords.y2 + dy, y1 + minSize)
          break
      }

      // 경계 제한
      x1 = Math.max(0, x1)
      y1 = Math.max(0, y1)
      x2 = Math.min(this.currentRow.width, x2)
      y2 = Math.min(this.currentRow.height, y2)

      this.currentArea.coords.x1 = Math.round(x1)
      this.currentArea.coords.y1 = Math.round(y1)
      this.currentArea.coords.x2 = Math.round(x2)
      this.currentArea.coords.y2 = Math.round(y2)

      // 'imageMapAreas'를 hotspotsKey로 전달
      this.$emit('update-hotspot', this.currentArea, 'imageMapAreas')
    },

    stopResize() {
      this.resizing = false
      this.resizeCorner = null
      this.currentArea = null
      this.currentRow = null
      this.initialCoords = null

      document.removeEventListener('mousemove', this.onResize)
      document.removeEventListener('mouseup', this.stopResize)
    }
  },

  beforeDestroy() {
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)
    document.removeEventListener('mousemove', this.onResize)
    document.removeEventListener('mouseup', this.stopResize)
  }
}
</script>

<style scoped>
.em-type-imagemap {
  padding: 20px;
  background: #f5f5f5;
}

.image-container {
  position: relative;
  display: inline-block;
  user-select: none;
  background: #fff;
}

.preview-image {
  display: block;
  pointer-events: none;
}

.hotspot-overlay {
  position: absolute;
  background: rgba(0, 123, 255, 0.25);
  border: 2px dashed #007bff;
  box-sizing: border-box;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.hotspot-overlay:hover {
  background: rgba(0, 123, 255, 0.35);
  border-color: #0056b3;
}

.hotspot-overlay.selected {
  background: rgba(0, 123, 255, 0.4);
  border-color: #0056b3;
  border-style: solid;
  border-width: 3px;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
  z-index: 10;
}

.hotspot-label {
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
  width: 12px;
  height: 12px;
  background: white;
  border: 2px solid #007bff;
  border-radius: 50%;
  z-index: 20;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
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
  transition: all 0.15s;
}

.empty-preview {
  color: #999;
  text-align: center;
  padding: 60px 20px;
  font-size: 14px;
  background: #fff;
}
</style>