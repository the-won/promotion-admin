<template>
  <div class="hotspot-group-editor">
    <!-- Image URL Field (웹/모바일에 따라 다른 값 바인딩) -->
    <div 
      class="image-url-section"
      @mouseenter="setActiveImage(true)"
      @mouseleave="setActiveImage(false)"
      @click="selectImage"
    >
      <div class="form-group">
        <label>
          {{ deviceType === 'mobile' ? '📱 모바일' : '🖥️ 웹' }} 이미지 URL
        </label>
        <input 
          type="url" 
          :value="currentImageUrl"
          @input="updateImageUrl($event.target.value)"
          placeholder="https://example.com/image.jpg"
          class="form-input"
        />
      </div>
    </div>

    <!-- Section Header -->
    <div class="section-header">
      <h4>핫스팟 목록</h4>
      <button @click="addHotspot" class="btn btn-success">추가</button>
    </div>

    <!-- Empty State -->
    <div v-if="localData.hotspots.length === 0" class="empty-state">
      핫스팟을 추가하세요.
    </div>

    <!-- Items Grid -->
    <div class="items-grid" :class="{ 'cols-2': sidebarExpanded }">
      <div 
        v-for="(hotspot, index) in localData.hotspots" 
        :key="hotspot.id" 
        class="card selectable"
        :class="{ selected: selectedId === hotspot.id }"
        @click="selectHotspot(hotspot.id)"
      >
        <!-- Card Header -->
        <div class="card-header">
          <span class="card-title">{{ hotspot.text || `핫스팟 ${index + 1}` }}</span>
          <button @click.stop="removeHotspot(hotspot.id)" class="btn btn-danger btn-sm">삭제</button>
        </div>

        <!-- Form Fields -->
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotspotGroupEditor',
  props: {
    value: {
      type: Object,
      default: () => ({
        webImageUrl: '',
        mobileImageUrl: '',
        hotspots: []
      })
    },
    groupIndex: {
      type: Number,
      default: 1
    },
    deviceType: {
      type: String,
      default: 'web'
    },
    selectedId: {
      type: Number,
      default: null
    },
    selectedHotspotInfo: {
      type: Object,
      default: () => ({ hotspotId: null, groupIndex: null })
    },
    visibleTopPosition: {
      type: Number,
      default: 10
    },
    sidebarExpanded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localData: {
        webImageUrl: '',
        mobileImageUrl: '',
        hotspots: []
      }
    }
  },
  computed: {
    currentImageUrl() {
      return this.deviceType === 'mobile' 
        ? this.localData.mobileImageUrl 
        : this.localData.webImageUrl
    }
  },
  created() {
    this.initLocalData()
  },
  watch: {
    value: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localData)) {
          this.initLocalData()
        }
      },
      deep: true
    },
    localData: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.value)) {
          this.$emit('input', JSON.parse(JSON.stringify(val)))
        }
      },
      deep: true
    },
    visibleTopPosition(newVal) {
      console.log(`📊 Group ${this.groupIndex} - visibleTopPosition 업데이트:`, newVal)
    }
  },
  methods: {
    setActiveImage(isActive) {
      this.$emit('active-image-change', isActive ? this.groupIndex : null)
    },
    
    initLocalData() {
      if (this.value) {
        this.localData = {
          webImageUrl: this.value.webImageUrl || '',
          mobileImageUrl: this.value.mobileImageUrl || '',
          hotspots: this.value.hotspots ? JSON.parse(JSON.stringify(this.value.hotspots)) : []
        }
      }
    },
    
    updateImageUrl(url) {
      if (this.deviceType === 'mobile') {
        this.localData.mobileImageUrl = url
      } else {
        this.localData.webImageUrl = url
      }
    },
    
    addHotspot() {
      const newId = Date.now()
      
      // 현재 보이는 스크롤 위치 가져오기
      let baseTop = this.visibleTopPosition || 10
      
      console.log('🎯 핫스팟 추가 위치 계산:', {
        groupIndex: this.groupIndex,
        visibleTopPosition: this.visibleTopPosition,
        baseTop: baseTop,
        currentHotspotsCount: this.localData.hotspots.length
      })
      
      // 여러 개 추가할 때 겹치지 않도록 오프셋 적용
      const offsetTop = (this.localData.hotspots.length * 8) % 40
      const finalTop = Math.min(85, Math.max(5, baseTop + offsetTop))
      
      const newHotspot = {
        id: newId,
        text: `버튼 ${this.localData.hotspots.length + 1}`,
        href: 'https://example.com',
        alt: `버튼 ${this.localData.hotspots.length + 1}`,
        title: `버튼 ${this.localData.hotspots.length + 1}`,
        position: {
          left: 10 + (this.localData.hotspots.length * 5) % 60,
          top: finalTop,
          width: 20,
          height: 10
        }
      }
      
      console.log('✅ 새 핫스팟 생성:', newHotspot)
      
      this.localData.hotspots.push(newHotspot)
      
      // 핫스팟 선택 및 스크롤
      this.$nextTick(() => {
        this.$emit('select', newId)
        this.$emit('select-hotspot', { hotspotId: newId, groupIndex: this.groupIndex })
      })
    },
    
    removeHotspot(id) {
      const index = this.localData.hotspots.findIndex(h => h.id === id)
      if (index !== -1) {
        this.localData.hotspots.splice(index, 1)
        if (this.selectedId === id) {
          this.$emit('select', null)
        }
      }
    },
    
    selectHotspot(id) {
      console.log('🎯 핫스팟 선택됨:', { hotspotId: id, groupIndex: this.groupIndex })
      this.$emit('select', id)
      this.$emit('select-hotspot', { hotspotId: id, groupIndex: this.groupIndex })
    },
    
    selectImage() {
      console.log('🖼️ 이미지 영역 선택됨:', { groupIndex: this.groupIndex })
      this.$emit('select-image', { groupIndex: this.groupIndex })
    }
  }
}
</script>

<style scoped>
.hotspot-group-editor {
  margin-top: 8px;
}

.image-url-section {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.image-url-section:hover {
  background: rgba(85, 104, 248, 0.05);
  box-shadow: 0 0 0 2px rgba(85, 104, 248, 0.1);
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-sm {
  padding: 4px 10px;
  font-size: 12px;
}

.empty-state {
  padding: 32px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  margin-bottom: 16px;
}

.items-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.items-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.card {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  transition: all 0.2s;
}

.card.selectable {
  cursor: pointer;
}

.card.selectable:hover {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
}

.card.selected {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: rgba(99, 102, 241, 0.02);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}
</style>