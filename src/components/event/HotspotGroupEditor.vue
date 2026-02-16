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
        :ref="'card-' + hotspot.id"
        class="card selectable"
        :class="{ 
          selected: selectedId === hotspot.id,
          'flash-highlight': flashingId === hotspot.id 
        }"
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
      type: [Number, String],
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
      },
      flashingId: null
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
    // 🔑 프리뷰에서 핫스팟 클릭 → 사이드바 카드 스크롤 + 하이라이트
    selectedId(newId) {
      if (newId != null) {
        this.scrollToCard(newId)
      }
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
    
    /**
     * 🔑 이미지 컨테이너 DOM 요소를 확실하게 찾는 메서드
     * 
     * EmType3.vue 구조:
     *   .image-container (ref="container1")  ← groupIndex 1
     *   .image-container (ref="container2")  ← groupIndex 2
     * 
     * 방법: 모든 .image-container를 수집 → groupIndex로 접근
     */
    findImageContainer() {
      const idx = this.groupIndex // 1-based
      
      // 방법 1: 모든 image-container를 찾아서 index로 접근 (가장 확실)
      const allContainers = document.querySelectorAll('.image-container')
      if (allContainers.length >= idx) {
        return allContainers[idx - 1]
      }
      
      // 방법 2: preview-body 안에서 찾기
      const previewBody = document.querySelector('.preview-body')
      if (previewBody) {
        const containers = previewBody.querySelectorAll('.image-container')
        if (containers.length >= idx) {
          return containers[idx - 1]
        }
      }
      
      // 방법 3: data 속성으로 찾기
      const byData = document.querySelector(`[data-group-index="${idx}"]`)
      if (byData) return byData
      
      return null
    },
    
    /**
     * 🔑 추가 버튼 클릭 시점에 실시간으로 뷰포트 대비 위치 계산
     */
    getRealtimeVisibleTop() {
      const container = this.findImageContainer()
      
      if (!container) {
        console.warn('⚠️ 이미지 컨테이너를 찾을 수 없음, fallback 30%')
        return 30
      }
      
      const rect = container.getBoundingClientRect()
      const containerHeight = rect.height
      
      if (containerHeight <= 0) {
        return 30
      }
      
      // 뷰포트 중앙이 컨테이너의 어디(%)에 해당하는지
      const viewportCenter = window.innerHeight / 2
      const posInContainer = viewportCenter - rect.top
      let topPercent = (posInContainer / containerHeight) * 100
      
      // 컨테이너가 화면 밖에 있는 경우 처리
      if (rect.top > window.innerHeight) {
        // 컨테이너가 완전히 아래에 있음 → 상단에 배치
        topPercent = 10
      } else if (rect.bottom < 0) {
        // 컨테이너가 완전히 위에 있음 → 하단에 배치
        topPercent = 80
      }
      
      // 범위 제한 (5% ~ 85%)
      topPercent = Math.max(5, Math.min(85, topPercent))
      
      console.log('📐 위치 계산:', {
        groupIndex: this.groupIndex,
        containerTop: Math.round(rect.top),
        containerHeight: Math.round(containerHeight),
        viewportCenter: Math.round(viewportCenter),
        result: Math.round(topPercent) + '%'
      })
      
      return Math.round(topPercent * 10) / 10
    },
    
    addHotspot() {
      const newId = `hs_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
      
      // ✅ 추가 버튼 클릭 시점에 실시간으로 위치 계산
      const baseTop = this.getRealtimeVisibleTop()
      
      // 같은 위치에 겹치지 않도록 작은 랜덤 오프셋 (±2%)
      const randomOffset = (Math.random() - 0.5) * 4
      const finalTop = Math.max(5, Math.min(85, baseTop + randomOffset))
      
      const newHotspot = {
        id: newId,
        text: `버튼 ${this.localData.hotspots.length + 1}`,
        href: 'https://example.com',
        alt: `버튼 ${this.localData.hotspots.length + 1}`,
        title: `버튼 ${this.localData.hotspots.length + 1}`,
        position: {
          left: 10 + Math.round(Math.random() * 30),
          top: Math.round(finalTop * 10) / 10,
          width: 20,
          height: 10
        }
      }
      
      console.log('✅ 새 핫스팟:', {
        id: newHotspot.id,
        top: newHotspot.position.top + '%',
        left: newHotspot.position.left + '%'
      })
      
      this.localData.hotspots.push(newHotspot)
      
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
      this.$emit('select', id)
      this.$emit('select-hotspot', { hotspotId: id, groupIndex: this.groupIndex })
    },
    
    selectImage() {
      this.$emit('select-image', { groupIndex: this.groupIndex })
    },
    
    /**
     * 🔑 해당 카드로 스크롤 이동 + 깜빡임 효과
     */
    scrollToCard(hotspotId) {
      this.$nextTick(() => {
        const refKey = 'card-' + hotspotId
        const cardEl = this.$refs[refKey]
        
        if (!cardEl) return
        
        // v-for ref는 배열로 반환됨
        const el = Array.isArray(cardEl) ? cardEl[0] : cardEl
        if (!el) return
        
        // 부드럽게 스크롤 이동
        el.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
        
        // 깜빡임 효과
        this.flashingId = hotspotId
        setTimeout(() => {
          this.flashingId = null
        }, 1500)
      })
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

/* 🔑 프리뷰에서 클릭 시 깜빡임 효과 */
.card.flash-highlight {
  animation: flashPulse 0.5s ease-in-out 3;
}

@keyframes flashPulse {
  0%, 100% {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background: rgba(99, 102, 241, 0.02);
  }
  50% {
    border-color: #f59e0b;
    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.3);
    background: rgba(245, 158, 11, 0.08);
  }
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