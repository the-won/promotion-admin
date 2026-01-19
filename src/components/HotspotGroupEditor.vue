<template>
  <div class="hotspot-group-editor">
    <div class="header">
      <h4>{{ getSectionLabel() }}</h4>
      <button @click="addHotspot" class="add-btn">+ 핫스팟 추가</button>
    </div>

    <div v-if="localHotspots.length === 0" class="empty-state">
      핫스팟을 추가하세요.
    </div>

    <div 
      v-for="(hotspot, index) in localHotspots" 
      :key="hotspot.id" 
      class="hotspot-item"
      :class="{ selected: selectedId === hotspot.id }"
      @click="selectHotspot(hotspot.id)"
    >
      <div class="hotspot-header">
        <span class="hotspot-title">{{ hotspot.text || `핫스팟 ${index + 1}` }}</span>
        <button @click.stop="removeHotspot(hotspot.id)" class="delete-btn">🗑️</button>
      </div>

      <div class="form-group">
        <label>라벨 텍스트</label>
        <input 
          type="text" 
          v-model="hotspot.text"
          placeholder="버튼 텍스트"
          class="form-input"
          @click.stop
        />
      </div>

      <div class="form-group">
        <label>링크 URL (href)</label>
        <input 
          type="url" 
          v-model="hotspot.href"
          placeholder="https://example.com"
          class="form-input"
          @click.stop
        />
      </div>

      <div class="form-group">
        <label>대체 텍스트 (alt)</label>
        <input 
          type="text" 
          v-model="hotspot.alt"
          placeholder="이미지 설명"
          class="form-input"
          @click.stop
        />
      </div>

      <div class="form-group">
        <label>타이틀 (title)</label>
        <input 
          type="text" 
          v-model="hotspot.title"
          placeholder="툴팁 텍스트"
          class="form-input"
          @click.stop
        />
      </div>

      <div class="position-group">
        <div class="form-group">
          <label>Left (%)</label>
          <input 
            type="number" 
            v-model.number="hotspot.position.left"
            min="0"
            max="100"
            step="0.1"
            class="form-input"
            @click.stop
          />
        </div>

        <div class="form-group">
          <label>Top (%)</label>
          <input 
            type="number" 
            v-model.number="hotspot.position.top"
            min="0"
            max="100"
            step="0.1"
            class="form-input"
            @click.stop
          />
        </div>

        <div class="form-group">
          <label>Width (%)</label>
          <input 
            type="number" 
            v-model.number="hotspot.position.width"
            min="5"
            max="80"
            step="0.1"
            class="form-input"
            @click.stop
          />
        </div>

        <div class="form-group">
          <label>Height (%)</label>
          <input 
            type="number" 
            v-model.number="hotspot.position.height"
            min="3"
            max="50"
            step="0.1"
            class="form-input"
            @click.stop
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    sectionKey: {
      type: String,
      required: true
    },
    selectedId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      localHotspots: []
    }
  },
  created() {
    this.localHotspots = this.value ? JSON.parse(JSON.stringify(this.value)) : []
  },
  watch: {
    value: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localHotspots)) {
          this.localHotspots = newVal ? JSON.parse(JSON.stringify(newVal)) : []
        }
      },
      deep: true
    },
    localHotspots: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.value)) {
          this.$emit('input', JSON.parse(JSON.stringify(val)))
        }
      },
      deep: true
    }
  },
  methods: {
    getSectionLabel() {
      const labels = {
        'hotspots1': '이미지 1 핫스팟 목록',
        'hotspots2': '이미지 2 핫스팟 목록'
      }
      return labels[this.sectionKey] || '핫스팟 목록'
    },
    
    addHotspot() {
      const newId = Date.now()
      const newHotspot = {
        id: newId,
        text: `버튼 ${this.localHotspots.length + 1}`,
        href: 'https://example.com',
        alt: `버튼 ${this.localHotspots.length + 1}`,
        title: `버튼 ${this.localHotspots.length + 1}`,
        position: {
          left: 10 + (this.localHotspots.length * 5),
          top: 20 + (this.localHotspots.length * 5),
          width: 20,
          height: 10
        }
      }
      
      this.localHotspots.push(newHotspot)
      this.$emit('select', newId)
    },
    
    removeHotspot(id) {
      const index = this.localHotspots.findIndex(h => h.id === id)
      if (index !== -1) {
        this.localHotspots.splice(index, 1)
        if (this.selectedId === id) {
          this.$emit('select', null)
        }
      }
    },
    
    selectHotspot(id) {
      this.$emit('select', id)
    }
  }
}
</script>

<style scoped>
.hotspot-group-editor {
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
  color: #333;
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
  transition: background 0.2s;
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
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
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
  transition: background 0.2s;
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
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.position-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.position-group .form-group {
  margin-bottom: 0;
}
</style>