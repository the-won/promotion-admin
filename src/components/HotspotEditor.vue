<template>
  <div class="hotspot-editor">
    <div class="header">
      <h4>클릭 영역 관리</h4>
      <button @click="addHotspot" class="add-btn">+ 새 버튼 추가</button>
    </div>

    <div v-if="localHotspots.length === 0" class="empty-state">
      버튼을 추가한 후 프리뷰에서 드래그하여 위치를 조정하세요.
    </div>

    <div 
      v-for="(hotspot, index) in localHotspots" 
      :key="hotspot.id" 
      class="hotspot-item"
      :class="{ selected: selectedId === hotspot.id }"
      @click="selectHotspot(hotspot.id)"
    >
      <div class="hotspot-header">
        <span class="hotspot-title">버튼 {{ index + 1 }}</span>
        <button @click.stop="removeHotspot(index)" class="delete-btn">🗑️</button>
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

      <div class="position-info">
        <small>📍 위치: {{ hotspot.position.left.toFixed(1) }}%, {{ hotspot.position.top.toFixed(1) }}%</small><br>
        <small>📐 크기: {{ hotspot.position.width.toFixed(1) }}% × {{ hotspot.position.height.toFixed(1) }}%</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'selectedId'],
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
      const newHotspot = {
        id: Date.now(),
        text: '버튼 텍스트',
        href: '#',
        alt: '버튼',
        position: {
          left: 35,
          top: 40,
          width: 30,
          height: 12
        }
      }
      this.localHotspots.push(newHotspot)
      this.$emit('select', newHotspot.id)
    },
    removeHotspot(index) {
      this.localHotspots.splice(index, 1)
    },
    selectHotspot(id) {
      this.$emit('select', id)
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
  font-size: 14px;
}

.hotspot-item {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.hotspot-item:hover {
  border-color: #007bff;
}

.hotspot-item.selected {
  border-color: #007bff;
  background: #f0f8ff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
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
}

.position-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
  color: #666;
  font-size: 12px;
}
</style>