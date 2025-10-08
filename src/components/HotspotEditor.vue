<template>
  <div class="hotspot-editor">
    <div class="header">
      <h4>클릭 영역 관리</h4>
      <button @click="addHotspot" class="add-btn">+ 새 버튼 추가</button>
    </div>

    <div v-if="localHotspots.length === 0" class="empty-state">
      버튼을 추가하여 클릭 가능한 영역을 만들어보세요.
    </div>

    <div v-for="(hotspot, index) in localHotspots" :key="hotspot.id" class="hotspot-item">
      <div class="hotspot-header">
        <span class="hotspot-title">버튼 {{ index + 1 }}</span>
        <button @click="removeHotspot(index)" class="delete-btn">🗑️</button>
      </div>

      <div class="form-group">
        <label>텍스트</label>
        <input 
          type="text" 
          v-model="hotspot.text"
          placeholder="예: 지금 신청하기"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label>링크 (href)</label>
        <input 
          type="url" 
          v-model="hotspot.href"
          placeholder="https://example.com"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label>대체 텍스트 (alt)</label>
        <input 
          type="text" 
          v-model="hotspot.alt"
          placeholder="예: 신청하기 버튼"
          class="form-input"
        />
      </div>

      <div class="position-section">
        <h5>📍 위치 및 크기</h5>

        <!-- Left -->
        <div class="form-group">
          <label>가로 위치 (Left)</label>
          <div class="slider-input-group">
            <input 
              type="range"
              v-model.number="hotspot.position.left"
              min="0"
              max="100"
              step="0.5"
              class="slider"
            />
            <input 
              type="number"
              v-model.number="hotspot.position.left"
              min="0"
              max="100"
              step="0.5"
              class="number-input"
            />
            <span class="unit">%</span>
          </div>
        </div>

        <!-- Top -->
        <div class="form-group">
          <label>세로 위치 (Top)</label>
          <div class="slider-input-group">
            <input 
              type="range"
              v-model.number="hotspot.position.top"
              min="0"
              max="100"
              step="0.5"
              class="slider"
            />
            <input 
              type="number"
              v-model.number="hotspot.position.top"
              min="0"
              max="100"
              step="0.5"
              class="number-input"
            />
            <span class="unit">%</span>
          </div>
        </div>

        <!-- Width -->
        <div class="form-group">
          <label>너비 (Width)</label>
          <div class="slider-input-group">
            <input 
              type="range"
              v-model.number="hotspot.position.width"
              min="5"
              max="80"
              step="0.5"
              class="slider"
            />
            <input 
              type="number"
              v-model.number="hotspot.position.width"
              min="5"
              max="80"
              step="0.5"
              class="number-input"
            />
            <span class="unit">%</span>
          </div>
        </div>

        <!-- Height -->
        <div class="form-group">
          <label>높이 (Height)</label>
          <div class="slider-input-group">
            <input 
              type="range"
              v-model.number="hotspot.position.height"
              min="3"
              max="30"
              step="0.5"
              class="slider"
            />
            <input 
              type="number"
              v-model.number="hotspot.position.height"
              min="3"
              max="30"
              step="0.5"
              class="number-input"
            />
            <span class="unit">%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      localHotspots: []
    }
  },
  created() {
    this.localHotspots = this.value ? [...this.value] : []
  },
  watch: {
    value: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localHotspots)) {
          this.localHotspots = newVal ? [...newVal] : []
        }
      },
      deep: true
    },
    localHotspots: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.value)) {
          this.$emit('input', [...val])
        }
      },
      deep: true
    }
  },
  methods: {
    addHotspot() {
      this.localHotspots.push({
        id: Date.now(),
        text: '버튼 텍스트',
        href: '#',
        alt: '버튼',
        position: {
          left: 30,
          top: 50,
          width: 25,
          height: 10
        }
      })
    },
    removeHotspot(index) {
      this.localHotspots.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.hotspot-editor {
  margin-top: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.add-btn {
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.add-btn:hover {
  background: #218838;
}

.empty-state {
  padding: 30px;
  text-align: center;
  color: #999;
  background: #f9f9f9;
  border: 2px dashed #ddd;
  border-radius: 8px;
}

.hotspot-item {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.hotspot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #007bff;
}

.hotspot-title {
  font-weight: bold;
  color: #007bff;
  font-size: 15px;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background: #c82333;
}

.form-group {
  margin-bottom: 15px;
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
}

.position-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.position-section h5 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #666;
}

.slider-input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #ddd;
  border-radius: 3px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #007bff;
  cursor: pointer;
  border-radius: 50%;
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #007bff;
  cursor: pointer;
  border-radius: 50%;
  border: none;
}

.number-input {
  width: 70px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

.unit {
  font-size: 14px;
  color: #666;
  min-width: 20px;
}
</style>