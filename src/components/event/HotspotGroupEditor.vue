<template>
  <div class="hotspot-group-editor">
    <!-- Image URL Field (웹/모바일에 따라 다른 값 바인딩) -->
    <div 
      class="image-url-section"
      @mouseenter="setActiveImage(true)"
      @mouseleave="setActiveImage(false)"
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
      const baseTop = this.visibleTopPosition || 10
      const offsetTop = (this.localData.hotspots.length * 5) % 30
      
      const newHotspot = {
        id: newId,
        text: `버튼 ${this.localData.hotspots.length + 1}`,
        href: 'https://example.com',
        alt: `버튼 ${this.localData.hotspots.length + 1}`,
        title: `버튼 ${this.localData.hotspots.length + 1}`,
        position: {
          left: 10 + (this.localData.hotspots.length * 5) % 60,
          top: Math.min(85, baseTop + offsetTop),
          width: 20,
          height: 10
        }
      }
      
      this.localData.hotspots.push(newHotspot)
      this.$emit('select', newId)
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
}

.image-url-section:hover {
  background: rgba(85, 104, 248, 0.05);
  box-shadow: 0 0 0 2px rgba(85, 104, 248, 0.1);
}
</style>