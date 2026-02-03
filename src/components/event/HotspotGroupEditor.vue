<template>
  <div class="hotspot-group-editor">
    <!-- Device Toggle -->
    <DeviceToggle v-model="currentDevice" />

    <!-- Image URL Fields -->
    <div class="image-url-section">
      <div class="form-group">
        <label>🖥️ 웹 이미지 URL</label>
        <input 
          type="url" 
          v-model="localData.webImageUrl"
          placeholder="https://example.com/web-image.jpg"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label>📱 모바일 이미지 URL</label>
        <input 
          type="url" 
          v-model="localData.mobileImageUrl"
          placeholder="https://example.com/mobile-image.jpg"
          class="form-input"
        />
      </div>
    </div>

    <!-- Section Header -->
    <div class="section-header">
      <h4>
        <span class="device-badge" :class="currentDevice">{{ currentDevice === 'mobile' ? '📱' : '🖥️' }}</span>
        핫스팟 목록
      </h4>
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
import DeviceToggle from '../DeviceToggle.vue'

export default {
  components: {
    DeviceToggle
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        webImageUrl: '',
        mobileImageUrl: '',
        hotspots: []
      })
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
      },
      currentDevice: 'web'
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
    currentDevice(newVal) {
      this.$emit('device-change', newVal)
    }
  },
  methods: {
    initLocalData() {
      if (this.value) {
        this.localData = {
          webImageUrl: this.value.webImageUrl || '',
          mobileImageUrl: this.value.mobileImageUrl || '',
          hotspots: this.value.hotspots ? JSON.parse(JSON.stringify(this.value.hotspots)) : []
        }
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
  margin-top: 16px;
}

.image-url-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--color-bg-secondary, #f5f6fa);
  border-radius: var(--card-radius, 10px);
}

.section-header h4 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.device-badge {
  font-size: 14px;
}

.device-badge.mobile {
  color: var(--color-success, #4ade80);
}

.device-badge.web {
  color: var(--color-primary, #5568f8);
}
</style>