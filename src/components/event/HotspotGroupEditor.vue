<template>
  <div class="hotspot-group-editor">
    <!-- 각 그룹 -->
    <div 
      v-for="(group, groupIdx) in localGroups" 
      :key="group.id" 
      class="group-section"
    >
      <div class="group-header">
        <span class="group-title">📌 이미지 {{ groupIdx + 1 }}</span>
        <button 
          v-if="localGroups.length > 1"
          @click="removeGroup(group.id)" 
          class="btn btn-danger btn-sm"
        >
          그룹 삭제
        </button>
      </div>

      <!-- 이미지 URL -->
      <div 
        class="image-url-section"
        @mouseenter="setActiveImage(groupIdx + 1)"
        @mouseleave="setActiveImage(null)"
        @click="selectImage(groupIdx + 1)"
      >
        <div class="form-group">
          <label>
            {{ deviceType === 'mobile' ? '📱 모바일' : '🖥️ 웹' }} 이미지 URL
          </label>
          <input 
            type="url" 
            :value="getImageUrl(group)"
            @input="updateImageUrl(groupIdx, $event.target.value)"
            placeholder="https://example.com/image.jpg"
            class="form-input"
            @click.stop
          />
        </div>
      </div>

      <!-- 핫스팟 목록 헤더 -->
      <div class="section-header">
        <h4>버튼 목록 ({{ group.hotspots.length }}개)</h4>
        <button @click="addHotspot(groupIdx)" class="btn btn-success">추가</button>
      </div>

      <!-- Empty State -->
      <div v-if="group.hotspots.length === 0" class="empty-state">
        버튼을 추가하세요.
      </div>

      <!-- 핫스팟 카드 -->
      <div class="items-grid" :class="{ 'cols-2': sidebarExpanded }">
        <div 
          v-for="(hotspot, hsIdx) in group.hotspots" 
          :key="hotspot.id"
          :ref="'card-' + hotspot.id"
          class="card selectable"
          :class="{ 
            selected: selectedId === hotspot.id,
            'flash-highlight': flashingId === hotspot.id 
          }"
          @click="selectHotspot(hotspot.id, groupIdx + 1)"
        >
          <div class="card-header">
            <span class="card-title">버튼 {{ hsIdx + 1 }}</span>
            <button @click.stop="removeHotspot(groupIdx, hotspot.id)" class="btn btn-danger btn-sm">삭제</button>
          </div>

          <div class="form-group">
            <label>링크 URL (href)</label>
            <input type="url" v-model="hotspot.href" placeholder="https://example.com" class="form-input" @click.stop />
          </div>

          <div class="form-group">
            <label>대체 텍스트 (alt)</label>
            <input type="text" v-model="hotspot.alt" placeholder="이미지 설명" class="form-input" @click.stop />
          </div>
        </div>
      </div>
    </div>

    <!-- 새 그룹 추가 버튼 -->
    <div class="add-group-section">
      <button @click="addGroup" class="btn btn-add-group">
        + 새 이미지 + 핫스팟 그룹 추가
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotspotGroupEditor',
  props: {
    value: {
      type: Array,
      default: () => []
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
    sidebarExpanded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localGroups: [],
      flashingId: null
    }
  },
  created() {
    this.localGroups = this.value && this.value.length > 0
      ? JSON.parse(JSON.stringify(this.value))
      : [this.createNewGroup()]
  },
  watch: {
    value: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localGroups)) {
          this.localGroups = newVal && newVal.length > 0
            ? JSON.parse(JSON.stringify(newVal))
            : [this.createNewGroup()]
        }
      },
      deep: true
    },
    localGroups: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.value)) {
          this.$emit('input', JSON.parse(JSON.stringify(val)))
        }
      },
      deep: true
    },
    // 프리뷰에서 핫스팟 클릭 → 사이드바 카드 스크롤 + 하이라이트
    selectedId(newId) {
      if (newId != null) {
        this.scrollToCard(newId)
      }
    }
  },
  methods: {
    generateId(prefix) {
      return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    },

    // ── 이미지 URL ──
    getImageUrl(group) {
      if (this.deviceType === 'mobile') {
        return group.mobileImageUrl || group.webImageUrl
      }
      return group.webImageUrl
    },

    updateImageUrl(groupIdx, url) {
      if (this.deviceType === 'mobile') {
        this.localGroups[groupIdx].mobileImageUrl = url
      } else {
        this.localGroups[groupIdx].webImageUrl = url
      }
    },

    // ── 그룹 관리 ──
    createNewGroup() {
      return {
        id: this.generateId('hg'),
        webImageUrl: '',
        mobileImageUrl: '',
        hotspots: []
      }
    },

    addGroup() {
      this.localGroups.push(this.createNewGroup())
    },

    removeGroup(groupId) {
      if (this.localGroups.length <= 1) return
      const index = this.localGroups.findIndex(g => g.id === groupId)
      if (index !== -1) {
        this.localGroups.splice(index, 1)
      }
    },

    // ── 핫스팟 관리 ──
    findImageContainer(groupIndex) {
      const allContainers = document.querySelectorAll('.image-container')
      if (allContainers.length >= groupIndex) {
        return allContainers[groupIndex - 1]
      }
      const previewBody = document.querySelector('.preview-body')
      if (previewBody) {
        const containers = previewBody.querySelectorAll('.image-container')
        if (containers.length >= groupIndex) {
          return containers[groupIndex - 1]
        }
      }
      return null
    },

    getRealtimeVisibleTop(groupIndex) {
      const container = this.findImageContainer(groupIndex)
      if (!container) return 30

      const rect = container.getBoundingClientRect()
      if (rect.height <= 0) return 30

      const viewportCenter = window.innerHeight / 2
      let topPercent = ((viewportCenter - rect.top) / rect.height) * 100

      if (rect.top > window.innerHeight) topPercent = 10
      else if (rect.bottom < 0) topPercent = 80

      return Math.round(Math.max(5, Math.min(85, topPercent)) * 10) / 10
    },

    addHotspot(groupIdx) {
      const groupIndex = groupIdx + 1
      const newId = this.generateId('hs')
      const baseTop = this.getRealtimeVisibleTop(groupIndex)
      const randomOffset = (Math.random() - 0.5) * 4
      const finalTop = Math.max(5, Math.min(85, baseTop + randomOffset))

      this.localGroups[groupIdx].hotspots.push({
        id: newId,
        href: 'https://example.com',
        alt: `버튼 ${this.localGroups[groupIdx].hotspots.length + 1}`,
        position: {
          left: 10 + Math.round(Math.random() * 30),
          top: Math.round(finalTop * 10) / 10,
          width: 20,
          height: 10
        }
      })

      this.$nextTick(() => {
        this.$emit('select', newId)
        this.$emit('select-hotspot', { hotspotId: newId, groupIndex })
      })
    },

    removeHotspot(groupIdx, hotspotId) {
      const hotspots = this.localGroups[groupIdx].hotspots
      const index = hotspots.findIndex(h => h.id === hotspotId)
      if (index !== -1) {
        hotspots.splice(index, 1)
        if (this.selectedId === hotspotId) {
          this.$emit('select', null)
        }
      }
    },

    // ── 선택 / 하이라이트 ──
    setActiveImage(groupIndex) {
      this.$emit('active-image-change', groupIndex)
    },

    selectImage(groupIndex) {
      this.$emit('select-image', { groupIndex })
    },

    selectHotspot(hotspotId, groupIndex) {
      this.$emit('select', hotspotId)
      this.$emit('select-hotspot', { hotspotId, groupIndex })
    },

    scrollToCard(hotspotId) {
      this.$nextTick(() => {
        const refKey = 'card-' + hotspotId
        const cardEl = this.$refs[refKey]
        if (!cardEl) return
        const el = Array.isArray(cardEl) ? cardEl[0] : cardEl
        if (!el) return

        el.scrollIntoView({ behavior: 'smooth', block: 'center' })

        this.flashingId = hotspotId
        setTimeout(() => { this.flashingId = null }, 1500)
      })
    }
  }
}
</script>

<style scoped>
.hotspot-group-editor {
  width: 100%;
}

.group-section {
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafbfc;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.group-title {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h4 {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
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

.btn-success { background: #10b981; color: white; }
.btn-success:hover { background: #059669; }
.btn-danger { background: #ef4444; color: white; }
.btn-danger:hover { background: #dc2626; }
.btn-sm { padding: 4px 10px; font-size: 12px; }

.empty-state {
  padding: 24px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  margin-bottom: 12px;
}

.items-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
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

.card.selectable { cursor: pointer; }

.card.selectable:hover {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
}

.card.selected {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: rgba(99, 102, 241, 0.02);
}

.card.flash-highlight {
  animation: flashPulse 0.5s ease-in-out 3;
}

@keyframes flashPulse {
  0%, 100% {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
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
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

.add-group-section {
  text-align: center;
  padding: 8px 0;
}

.btn-add-group {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 2px dashed #d1d5db;
  background: transparent;
  color: #6366f1;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-group:hover {
  background: rgba(99, 102, 241, 0.05);
  border-color: #6366f1;
}
</style>