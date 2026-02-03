<template>
  <div class="hotspot-group-editor">
    <!-- Section Header -->
    <div class="section-header">
      <h4>{{ getSectionLabel() }}</h4>
      <button @click="addHotspot" class="btn btn-success">+ 핫스팟 추가</button>
    </div>

    <!-- Empty State -->
    <div v-if="localHotspots.length === 0" class="empty-state">
      핫스팟을 추가하세요.
    </div>

    <!-- Items Grid -->
    <div class="items-grid" :class="{ 'cols-2': sidebarExpanded }">
      <div 
        v-for="(hotspot, index) in localHotspots" 
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
      const baseTop = this.visibleTopPosition || 10
      const offsetTop = (this.localHotspots.length * 5) % 30
      
      const newHotspot = {
        id: newId,
        text: `버튼 ${this.localHotspots.length + 1}`,
        href: 'https://example.com',
        alt: `버튼 ${this.localHotspots.length + 1}`,
        title: `버튼 ${this.localHotspots.length + 1}`,
        position: {
          left: 10 + (this.localHotspots.length * 5) % 60,
          top: Math.min(85, baseTop + offsetTop),
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
/* 컴포넌트 고유 스타일만 */
.hotspot-group-editor {
  margin-top: 16px;
}
</style>