<template>
  <div class="image-map-editor">
    <!-- 행(Row) 목록 -->
    <div 
      v-for="(row, rowIndex) in localRows" 
      :key="row.id"
      class="row-item"
      :class="{ 'active': activeRowId === row.id }"
    >
      <div class="row-header">
        <span class="row-title">행 {{ rowIndex + 1 }}</span>
        <button @click="removeRow(row.id)" class="delete-row-btn">🗑️ 행 삭제</button>
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

      <!-- 핫스팟(Area) 목록 - 해당 row에 속한 것만 표시 -->
      <div class="hotspots-section">
        <div class="hotspots-header">
          <h5>핫스팟 목록 ({{ getAreasForRow(row.id).length }}개)</h5>
          <button @click="addArea(row.id)" class="add-area-btn">+ 핫스팟 추가</button>
        </div>

        <div v-if="getAreasForRow(row.id).length === 0" class="empty-areas">
          핫스팟을 추가하면 프리뷰에서 드래그로 위치/크기를 조정할 수 있습니다.
        </div>

        <div class="area-items-grid" :class="{ expanded: sidebarExpanded }">
          <div 
            v-for="(area, areaIndex) in getAreasForRow(row.id)" 
            :key="area.id"
            class="area-item"
            :class="{ 'selected': selectedAreaId === area.id }"
            @click="selectArea(area.id)"
          >
          <div class="area-header">
            <span class="area-title">핫스팟 {{ areaIndex + 1 }}</span>
            <button @click.stop="removeArea(area.id)" class="delete-area-btn">삭제</button>
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
    <div class="add-row-section">
      <button @click="addRow" class="add-row-btn">+ 새 행 추가 (tr > td + img + map)</button>
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
    // 특정 row에 속한 areas 반환
    getAreasForRow(rowId) {
      return this.localAreas.filter(a => a.rowId === rowId)
    },

    // 행(Row) 추가
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
    },

    // 행 삭제
    removeRow(rowId) {
      const index = this.localRows.findIndex(r => r.id === rowId)
      if (index !== -1) {
        this.localRows.splice(index, 1)
        // 해당 row에 속한 areas도 삭제
        this.localAreas = this.localAreas.filter(a => a.rowId !== rowId)
        
        if (this.activeRowId === rowId) {
          this.activeRowId = this.localRows.length > 0 ? this.localRows[0].id : null
        }
      }
    },

    // 핫스팟(Area) 추가
    addArea(rowId) {
      const row = this.localRows.find(r => r.id === rowId)
      if (!row) return

      const areasInRow = this.getAreasForRow(rowId)
      const newId = Date.now()
      
      // 스크롤 위치를 기반으로 y 좌표 계산
      // imageMapRowPositions에서 해당 row의 보이는 Y 위치 가져오기
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

    // 핫스팟 삭제
    removeArea(areaId) {
      const index = this.localAreas.findIndex(a => a.id === areaId)
      if (index !== -1) {
        this.localAreas.splice(index, 1)
        if (this.selectedAreaId === areaId) {
          this.$emit('select-area', null)
        }
      }
    },

    // 핫스팟 선택
    selectArea(areaId) {
      this.$emit('select-area', areaId)
    }
  }
}
</script>

<style scoped>
.image-map-editor {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.row-item {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  transition: all 0.2s;
}

.row-item.active {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.row-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #007bff;
}

.row-title {
  font-weight: bold;
  font-size: 16px;
  color: #007bff;
}

.delete-row-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
}

.delete-row-btn:hover {
  background: #c82333;
}

.image-settings {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 13px;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.hotspots-section {
  margin-top: 15px;
}

.hotspots-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.hotspots-header h5 {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.add-area-btn {
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
}

.add-area-btn:hover {
  background: #218838;
}

.empty-areas {
  padding: 20px;
  text-align: center;
  color: #999;
  background: #f9f9f9;
  border: 2px dashed #ddd;
  border-radius: 6px;
  font-size: 13px;
}

.area-items-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.area-items-grid.expanded {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.area-item {
  background: #fafafa;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.area-item:hover {
  border-color: #007bff;
}

.area-item.selected {
  border-color: #007bff;
  background: #f0f8ff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.area-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.area-title {
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.delete-area-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
}

.delete-area-btn:hover {
  background: #c82333;
}

.add-row-section {
  text-align: center;
  padding: 20px;
}

.add-row-btn {
  padding: 14px 28px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  transition: background 0.2s;
}

.add-row-btn:hover {
  background: #0056b3;
}

.form-row {
  display: flex;
  gap: 10px;
}

.form-group.half {
  flex: 1;
}
</style>