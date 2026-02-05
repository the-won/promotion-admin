<template>
  <div class="image-map-editor">
    <!-- 행(Row) 목록 -->
    <div 
      v-for="(row, rowIndex) in localRows" 
      :key="row.id"
      class="card mb-4"
      :class="{ 'card-active': activeRowId === row.id }"
      @mouseenter="setActiveRow(row.id)"
      @mouseleave="setActiveRow(null)"
    >
      <div class="card-header">
        <span class="card-title">행 {{ rowIndex + 1 }}</span>
        <button @click="removeRow(row.id)" class="btn btn-danger btn-sm">행 삭제</button>
      </div>

      <!-- 이미지 설정 -->
      <div class="image-settings">
        <div class="form-group">
          <label>이미지 URL</label>
          <input 
            type="url" 
            v-model="row.imageUrl"
            placeholder="http://example.com/image.jpg"
            class="form-input"
          />
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>너비 (px)</label>
            <input 
              type="number" 
              v-model.number="row.width"
              class="form-input"
            />
          </div>
          <div class="form-group half">
            <label>높이 (px)</label>
            <input 
              type="number" 
              v-model.number="row.height"
              class="form-input"
            />
          </div>
        </div>
        
        <!-- 자동 입력 성공 메시지 -->
        <div v-if="row._autoFilled" class="auto-fill-message">
          ✓ {{ row.width }} × {{ row.height }} 자동 입력됨
        </div>

        <div class="form-group">
          <label>이미지 Alt</label>
          <input 
            type="text" 
            v-model="row.imageAlt"
            placeholder="이미지 설명"
            class="form-input"
          />
        </div>
      </div>

      <!-- 핫스팟(Area) 목록 -->
      <div class="hotspots-section">
        <div class="section-header">
          <h5>핫스팟 목록 ({{ getAreasForRow(row.id).length }}개)</h5>
          <button @click="addArea(row.id)" class="btn btn-success btn-sm">핫스팟 추가</button>
        </div>

        <div v-if="getAreasForRow(row.id).length === 0" class="empty-state">
          핫스팟을 추가하면 프리뷰에서 드래그로 위치/크기를 조정할 수 있습니다.
        </div>

        <div class="items-grid" :class="{ 'cols-2': sidebarExpanded }">
          <div 
            v-for="(area, areaIndex) in getAreasForRow(row.id)" 
            :key="area.id"
            class="card selectable card-nested"
            :class="{ 'selected': selectedAreaId === area.id }"
            @click="selectArea(area.id)"
          >
            <div class="card-header card-header-sm">
              <span class="card-title">핫스팟 {{ areaIndex + 1 }}</span>
              <button @click.stop="removeArea(area.id)" class="btn btn-danger btn-sm">삭제</button>
            </div>

            <div class="form-group">
              <label>링크 URL (href)</label>
              <input 
                type="url" 
                v-model="area.href"
                placeholder="https://example.com"
                class="form-input"
                @click.stop
              />
            </div>

            <div class="form-group">
              <label>대체 텍스트 (alt)</label>
              <input 
                type="text" 
                v-model="area.alt"
                placeholder="버튼 설명"
                class="form-input"
                @click.stop
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 행 추가 버튼 -->
    <div class="text-center mt-4">
      <button @click="addRow" class="btn btn-primary btn-lg">새 행 추가</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageMapEditor',
  props: {
    rows: {
      type: Array,
      default: () => []
    },
    areas: {
      type: Array,
      default: () => []
    },
    selectedAreaId: {
      type: [Number, String],
      default: null
    },
    visibleScrollPosition: {
      type: Object,
      default: () => ({ scrollTop: 0, viewportHeight: 400 })
    },
    sidebarExpanded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localRows: [],
      localAreas: [],
      activeRowId: null
    }
  },
  created() {
    this.localRows = this.rows ? JSON.parse(JSON.stringify(this.rows)) : []
    this.localAreas = this.areas ? JSON.parse(JSON.stringify(this.areas)) : []
  },
  mounted() {
    // 각 row의 imageUrl 변경 감지
    this.setupImageUrlWatchers()
  },
  watch: {
    rows: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localRows)) {
          this.localRows = newVal ? JSON.parse(JSON.stringify(newVal)) : []
        }
      },
      deep: true
    },
    areas: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localAreas)) {
          this.localAreas = newVal ? JSON.parse(JSON.stringify(newVal)) : []
        }
      },
      deep: true
    },
    localRows: {
      handler(val) {
        // 기존 로직: 부모로 전달
        if (JSON.stringify(val) !== JSON.stringify(this.rows)) {
          this.$emit('update:rows', JSON.parse(JSON.stringify(val)))
        }
      },
      deep: true
    },
    localAreas: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.areas)) {
          this.$emit('update:areas', JSON.parse(JSON.stringify(val)))
        }
      },
      deep: true
    }
  },
  methods: {
    setupImageUrlWatchers() {
      // 각 row의 imageUrl을 감시
      this.localRows.forEach((row, index) => {
        this.$watch(
          () => this.localRows[index].imageUrl,
          (newUrl, oldUrl) => {
            if (newUrl && newUrl !== oldUrl) {
              console.log('이미지 URL 변경 감지:', newUrl)
              this.updateImageSize(this.localRows[index], newUrl)
            }
          }
        )
      })
    },
    
    setActiveRow(rowId) {
      this.activeRowId = rowId
      this.$emit('active-row-change', rowId)
    },
    
    updateImageSize(row, url) {
      console.log('updateImageSize 호출됨:', url)
      
      // 이전 타이머 취소 (디바운스)
      if (row._timer) {
        clearTimeout(row._timer)
      }
      
      // 500ms 후 실행
      row._timer = setTimeout(() => {
        console.log('이미지 로드 시작:', url)
        const img = new Image()
        
        img.onload = () => {
          console.log('이미지 로드 성공:', img.naturalWidth, 'x', img.naturalHeight)
          // 크기 업데이트
          row.width = img.naturalWidth
          row.height = img.naturalHeight
          
          // 성공 메시지 3초간 표시
          this.$set(row, '_autoFilled', true)
          setTimeout(() => {
            this.$set(row, '_autoFilled', false)
          }, 3000)
        }
        
        img.onerror = () => {
          // 에러는 조용히 무시
          console.log('이미지 로드 실패:', url)
        }
        
        img.src = url
      }, 500)
    },
    
    handleFileSelect(event, row) {
      const file = event.target.files[0]
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          // Base64 데이터 URL로 변환하여 이미지 URL로 사용
          row.imageUrl = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    
    getAreasForRow(rowId) {
      return this.localAreas.filter(a => a.rowId === rowId)
    },

    addRow() {
      const newId = Date.now()
      const mapName = `mapContents${String(newId).slice(-4)}`
      
      const newRow = {
        id: newId,
        imageUrl: 'https://via.placeholder.com/720x400',
        width: 720,
        height: 400,
        imageAlt: '새 이미지',
        mapName: mapName
      }
      
      this.localRows.push(newRow)
      this.activeRowId = newId
      
      // 새 row에 대한 watcher 추가
      this.$nextTick(() => {
        const index = this.localRows.length - 1
        this.$watch(
          () => this.localRows[index].imageUrl,
          (newUrl, oldUrl) => {
            if (newUrl && newUrl !== oldUrl) {
              console.log('새 row - 이미지 URL 변경 감지:', newUrl)
              this.updateImageSize(this.localRows[index], newUrl)
            }
          }
        )
      })
    },

    removeRow(rowId) {
      const index = this.localRows.findIndex(r => r.id === rowId)
      if (index !== -1) {
        this.localRows.splice(index, 1)
        this.localAreas = this.localAreas.filter(a => a.rowId !== rowId)
        
        if (this.activeRowId === rowId) {
          this.activeRowId = this.localRows.length > 0 ? this.localRows[0].id : null
        }
      }
    },

    addArea(rowId) {
      const row = this.localRows.find(r => r.id === rowId)
      if (!row) return

      const areasInRow = this.getAreasForRow(rowId)
      const newId = Date.now()
      
      const rowPositions = this.visibleScrollPosition?.imageMapRowPositions || {}
      const baseY = rowPositions[rowId] || 50
      
      const offsetX = (areasInRow.length % 3) * 150
      const offsetY = (areasInRow.length % 2) * 100

      const newArea = {
        id: newId,
        rowId: rowId,
        href: 'https://example.com',
        alt: `버튼 ${areasInRow.length + 1}`,
        coords: {
          x1: 60 + offsetX,
          y1: Math.max(20, baseY + offsetY),
          x2: 200 + offsetX,
          y2: Math.max(100, baseY + 80 + offsetY)
        }
      }

      this.localAreas.push(newArea)
      this.$emit('select-area', newId)
    },

    removeArea(areaId) {
      const index = this.localAreas.findIndex(a => a.id === areaId)
      if (index !== -1) {
        this.localAreas.splice(index, 1)
        if (this.selectedAreaId === areaId) {
          this.$emit('select-area', null)
        }
      }
    },

    selectArea(areaId) {
      this.$emit('select-area', areaId)
    }
  }
}
</script>

<style scoped>
.image-map-editor {
  padding: 16px;
  background: var(--color-bg-secondary, #f5f6fa);
  border-radius: var(--card-radius, 10px);
}

.image-settings {
  background: var(--color-bg-tertiary, #eceef2);
  padding: 14px;
  border-radius: var(--form-radius, 8px);
  margin-bottom: 16px;
}

.hotspots-section {
  margin-top: 16px;
}

.card-active {
  border-color: var(--color-primary, #5568f8);
  box-shadow: 0 0 0 3px rgba(85, 104, 248, 0.1);
}

.card-nested {
  background: var(--color-bg, #fff);
}

.card-header-sm {
  margin-bottom: 10px;
  padding-bottom: 8px;
}

.image-input-wrapper {
  display: flex;
  gap: 6px;
  align-items: stretch;
}

.image-input-wrapper .form-input {
  flex: 1;
}

.btn-file {
  padding: 6px 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
}

.btn-file:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
}

.btn-file:active {
  transform: translateY(0);
}

.file-info {
  margin-top: 6px;
  padding: 6px 10px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 4px;
  color: #16a34a;
  font-size: 11px;
  font-weight: 500;
}

.auto-fill-message {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 6px;
  color: #16a34a;
  font-size: 12px;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>