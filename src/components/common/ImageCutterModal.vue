<template>
  <transition name="cutter-fade">
    <div
      v-if="visible"
      class="cutter-overlay"
      :class="{ 'is-dragging': !!dragging }"
    >
      <div class="cutter-panel">

        <div class="cutter-header">
          <div class="cutter-header-info">
            <span class="cutter-title">이미지 자르기</span>
            <span v-if="fileName" class="cutter-filename">{{ fileName }}</span>
          </div>
          <button class="cutter-close" type="button" @click="$emit('cancel')">✕</button>
        </div>

        <div class="cutter-body">
          <div class="cutter-zoom-bar">
            <button type="button" class="zoom-btn" title="축소 (−)" :disabled="zoom <= 0.25" @click="zoomOut">−</button>
            <span class="zoom-value">{{ Math.round(zoom * 100) }}%</span>
            <button type="button" class="zoom-btn" title="확대 (+)" :disabled="zoom >= 4" @click="zoomIn">+</button>
            <span class="zoom-sep"></span>
            <button type="button" class="zoom-fit" @click="resetZoom">맞춤</button>
          </div>
          <div class="cutter-image-outer">
            <div class="cutter-scale-host" :style="scaleHostStyle">
            <div
              ref="imageWrap"
              class="cutter-image-wrap"
              :style="wrapTransformStyle"
              @click="handleImageClick"
              @wheel.prevent="handleWheel"
            >
              <img
                ref="img"
                :src="imageUrl"
                :style="imageLoaded ? { width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none' } : {}"
                class="cutter-img"
                draggable="false"
                @load="onImageLoad"
              />
              <div
                v-for="line in sortedLines"
                :key="line.id"
                class="cut-line"
                :style="{ top: (line.pos * 100) + '%' }"
              >
                <div
                  class="cut-line-bar"
                  @mousedown.stop.prevent="startDrag($event, line.id)"
                ></div>
                <div
                  class="cut-line-handle"
                  @mousedown.stop.prevent="startDrag($event, line.id)"
                >
                  <span class="cut-line-px">{{ Math.round(line.pos * imgNaturalHeight) }}px</span>
                  <button
                    type="button"
                    class="cut-line-remove"
                    @click.stop="removeLine(line.id)"
                  >✕</button>
                </div>
              </div>
            </div>
            </div>
          </div>
          <p class="cutter-tip">이미지를 클릭하면 라인이 추가됩니다 · 라인을 드래그하여 위치 조정 · ✕로 삭제</p>
        </div>

        <div class="cutter-footer">
          <span class="footer-hint">
            <template v-if="lines.length === 0">라인을 추가하여 분할 위치를 지정하세요</template>
            <template v-else>{{ lines.length }}개 라인 &middot; {{ lines.length + 1 }}조각으로 분할</template>
          </span>
          <div class="footer-actions">
            <button type="button" class="btn-ghost" @click="$emit('cancel')">취소</button>
            <button
              type="button"
              class="btn-primary"
              :disabled="!imageLoaded || lines.length === 0"
              @click="confirm"
            >자르기 ({{ lines.length + 1 }}개)</button>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ImageCutterModal',
  props: {
    visible: { type: Boolean, default: false },
    imageUrl: { type: String, default: '' },
    fileName: { type: String, default: '' }
  },
  data() {
    return {
      lines: [],
      imgNaturalWidth: 0,
      imgNaturalHeight: 0,
      imageLoaded: false,
      dragging: null,
      nextId: 0,
      zoom: 1,
      baseDisplayWidth: 0,
      baseDisplayHeight: 0
    }
  },
  computed: {
    sortedLines() {
      return [...this.lines].sort((a, b) => a.pos - b.pos)
    },
    detectedMimeType() {
      if (!this.imageUrl) return 'image/png'
      const m = this.imageUrl.match(/^data:([^;]+);/)
      return m ? m[1] : 'image/png'
    },
    wrapTransformStyle() {
      if (!this.imageLoaded) return {}
      return {
        width: this.baseDisplayWidth + 'px',
        height: this.baseDisplayHeight + 'px',
        transform: `scale(${this.zoom})`,
        transformOrigin: 'top left'
      }
    },
    scaleHostStyle() {
      if (!this.imageLoaded) return {}
      // wrap에 border 1px 있으므로 양쪽 2px 더해서 스크롤 영역을 정확히 확보
      return {
        width: Math.round((this.baseDisplayWidth + 2) * this.zoom) + 'px',
        height: Math.round((this.baseDisplayHeight + 2) * this.zoom) + 'px'
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.lines = []
        this.imageLoaded = false
        this.nextId = 0
        this.zoom = 1
        this.baseDisplayWidth = 0
        this.baseDisplayHeight = 0
      }
    }
  },
  mounted() {
    document.addEventListener('mousemove', this.onDrag)
    document.addEventListener('mouseup', this.endDrag)
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.endDrag)
  },
  methods: {
    onImageLoad() {
      const img = this.$refs.img
      this.imgNaturalWidth = img.naturalWidth
      this.imgNaturalHeight = img.naturalHeight
      // CSS가 렌더링을 완료한 후 실제 표시 크기를 읽어야 JS 계산과 오차가 없음
      this.$nextTick(() => {
        this.baseDisplayWidth = img.offsetWidth
        this.baseDisplayHeight = img.offsetHeight
        this.imageLoaded = true
      })
    },

    zoomIn() {
      this.zoom = Math.min(4, Math.round((this.zoom + 0.25) * 100) / 100)
    },
    zoomOut() {
      this.zoom = Math.max(0.25, Math.round((this.zoom - 0.25) * 100) / 100)
    },
    resetZoom() {
      this.zoom = 1
    },
    handleWheel(e) {
      if (e.deltaY < 0) this.zoomIn()
      else this.zoomOut()
    },

    handleImageClick(e) {
      if (this.dragging) return
      if (e.target.closest('.cut-line')) return
      const wrap = this.$refs.imageWrap
      const rect = wrap.getBoundingClientRect()
      const pos = Math.max(0.01, Math.min(0.99, (e.clientY - rect.top) / rect.height))
      this.lines.push({ id: this.nextId++, pos })
    },

    removeLine(id) {
      const idx = this.lines.findIndex(l => l.id === id)
      if (idx !== -1) this.lines.splice(idx, 1)
    },

    startDrag(e, id) {
      const line = this.lines.find(l => l.id === id)
      if (!line) return
      this.dragging = { id, startY: e.clientY, startPos: line.pos }
    },

    onDrag(e) {
      if (!this.dragging) return
      const wrap = this.$refs.imageWrap
      if (!wrap) return
      const rect = wrap.getBoundingClientRect()
      const delta = (e.clientY - this.dragging.startY) / rect.height
      const newPos = Math.max(0.01, Math.min(0.99, this.dragging.startPos + delta))
      const idx = this.lines.findIndex(l => l.id === this.dragging.id)
      if (idx !== -1) this.$set(this.lines, idx, { ...this.lines[idx], pos: newPos })
    },

    endDrag() {
      this.dragging = null
    },

    confirm() {
      if (!this.imageLoaded || this.lines.length === 0) return
      const img = this.$refs.img
      const sorted = this.sortedLines.map(l => Math.round(l.pos * img.naturalHeight))
      const cuts = [0, ...sorted, img.naturalHeight]

      const pieces = []
      for (let i = 0; i < cuts.length - 1; i++) {
        const y = cuts[i]
        const h = cuts[i + 1] - y
        if (h <= 0) continue
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, y, img.naturalWidth, h, 0, 0, img.naturalWidth, h)
        pieces.push({
          url: canvas.toDataURL(this.detectedMimeType),
          width: img.naturalWidth,
          height: h
        })
      }
      this.$emit('confirm', pieces)
    }
  }
}
</script>

<style scoped>
.cutter-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cutter-overlay.is-dragging,
.cutter-overlay.is-dragging * {
  cursor: ns-resize !important;
}

.cutter-panel {
  background: #fff;
  border: 1px solid #d2d2d7;
  width: min(720px, 92vw);
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.10);
}

/* Header */
.cutter-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 20px 13px;
  border-bottom: 1px solid #d2d2d7;
  flex-shrink: 0;
}
.cutter-header-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.cutter-title {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  line-height: 1.3;
}
.cutter-filename {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 11px;
  color: #86868b;
  line-height: 1.3;
}
.cutter-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #86868b;
  padding: 2px 4px;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 1px;
  transition: color 0.1s;
}
.cutter-close:hover { color: #1d1d1f; }

/* Body */
.cutter-body {
  flex: 1;
  min-height: 0;
  padding: 16px 24px 14px;
  background: #f5f5f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}
.cutter-zoom-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.zoom-btn {
  width: 26px;
  height: 26px;
  background: #fff;
  border: 1px solid #d2d2d7;
  border-radius: 3px;
  color: #1d1d1f;
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: border-color 0.1s, background 0.1s;
}
.zoom-btn:hover:not(:disabled) { border-color: #0071e3; color: #0071e3; background: #f0f7ff; }
.zoom-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.zoom-value {
  min-width: 38px;
  text-align: center;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #1d1d1f;
  font-variant-numeric: tabular-nums;
}
.zoom-sep {
  width: 1px;
  height: 16px;
  background: #d2d2d7;
  margin: 0 2px;
}
.zoom-fit {
  background: #fff;
  border: 1px solid #d2d2d7;
  border-radius: 3px;
  color: #6e6e73;
  padding: 4px 9px;
  font-size: 12px;
  font-weight: 500;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  cursor: pointer;
  line-height: 1;
  transition: border-color 0.1s, color 0.1s;
}
.zoom-fit:hover { border-color: #a1a1a6; color: #1d1d1f; }

.cutter-image-outer {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: auto;
}
.cutter-scale-host {
  flex-shrink: 0;
  position: relative;
}
.cutter-image-wrap {
  position: relative;
  display: block;
  cursor: crosshair;
  user-select: none;
  border: 1px solid #d2d2d7;
  background: #fff;
  line-height: 0;
  transform-origin: top left;
}
.cutter-img {
  display: block;
  max-width: 640px;
  max-height: 58vh;
  width: auto;
  height: auto;
  pointer-events: none;
}
.cutter-tip {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 11px;
  color: #86868b;
  margin: 0;
  text-align: center;
  line-height: 1.5;
}

/* Cut lines */
.cut-line {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  transform: translateY(-50%);
  z-index: 10;
}
.cut-line-bar {
  height: 2px;
  background: #dc2626;
  width: 100%;
  pointer-events: all;
  cursor: ns-resize;
}
.cut-line-handle {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  background: #dc2626;
  color: #fff;
  padding: 3px 6px 3px 8px;
  font-size: 11px;
  font-weight: 600;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  cursor: ns-resize;
  pointer-events: all;
  white-space: nowrap;
  line-height: 1.4;
  letter-spacing: 0.01em;
}
.cut-line-remove {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0 0 0 2px;
  font-size: 10px;
  line-height: 1;
  transition: color 0.1s;
}
.cut-line-remove:hover { color: #fff; }

/* Footer */
.cutter-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 20px;
  border-top: 1px solid #d2d2d7;
  flex-shrink: 0;
  background: #fff;
  gap: 12px;
}
.footer-hint {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 12px;
  color: #6e6e73;
  flex: 1;
  min-width: 0;
}
.footer-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.btn-ghost {
  background: transparent;
  border: 1px solid #d2d2d7;
  border-radius: 3px;
  color: #6e6e73;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  cursor: pointer;
  line-height: 1;
  transition: border-color 0.1s, color 0.1s;
}
.btn-ghost:hover { border-color: #a1a1a6; color: #1d1d1f; }
.btn-primary {
  background: #0071e3;
  border: none;
  border-radius: 3px;
  color: #fff;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  cursor: pointer;
  line-height: 1;
  transition: background 0.1s;
}
.btn-primary:hover:not(:disabled) { background: #0077ed; }
.btn-primary:disabled { opacity: 0.38; cursor: not-allowed; }

/* Transition */
.cutter-fade-enter-active,
.cutter-fade-leave-active {
  transition: opacity 0.15s ease-out;
}
.cutter-fade-enter,
.cutter-fade-leave-to {
  opacity: 0;
}
</style>
