<template>
  <div class="preview-deel">
    <div class="preview-card">
     
      <div class="preview-body" ref="previewBody" @scroll="handleScroll">
        <component 
          ref="templateComponent"
          :is="currentComponent"
          :data="formData"
          :deviceType="deviceType"
          :show-top-banner="showTopBanner"
          :show-bottom-banner="showBottomBanner"
          :selectedId="selectedHotspotId"
          :selectedImageInfo="selectedImageInfo"
          :selectedRowInfo="selectedRowInfo"
          :selectedHotspotInfo="selectedHotspotInfo"
          @select-hotspot="handleSelectHotspot"
          @update-hotspot="handleUpdateHotspot"
          @delete-hotspot="handleDeleteHotspot"
          @clear-highlight="handleClearHighlight"
        />
      </div>
    </div>
  </div>
</template>

<script>
import EmType1 from '../templates/EmType1.vue'
import EmType2 from '../templates/em/type-image-link/EmType2.vue'
import EmType3 from '../templates/event/EmType3.vue'
import EmType4 from '../templates/EmType4.vue'
import EmType5 from '../templates/em/secret-sale/EmType5.vue'
import EmTypeImageMap from '../templates/em/type-usemap/EmTypeImageMap.vue'

export default {
  components: {
    EmType1,
    EmType2,
    EmType3,
    EmType4,
    EmType5,
    EmTypeImageMap
  },
  props: {
    template: String,
    formData: Object,
    selectedHotspotId: [Number, String],
    deviceType: {
      type: String,
      default: 'web'
    },
    showTopBanner: {  // 👈 추가
      type: Boolean,
      default: false
    },
    showBottomBanner: {  // 👈 추가 (사용은 안하지만 props 에러 방지)
      type: Boolean,
      default: false
    },
    selectedImageInfo: {
      type: Object,
      default: () => ({ groupId: null, imageId: null })
    },
    selectedRowInfo: {
      type: Object,
      default: () => ({ rowId: null, rowIndex: null })
    },
    selectedHotspotInfo: {
      type: Object,
      default: () => ({ hotspotId: null, groupIndex: null })
    }
  },
  data() {
    return {
      scrollInfo: {
        scrollTop: 0,
        viewportHeight: 0,
        contentHeight: 0
      }
    }
  },
  computed: {
    currentComponent() {
      const map = {
        'em-type-1': 'EmType1',
        'em-type-2': 'EmType2',
        'em-type-3': 'EmType3',
        'em-type-4': 'EmType4',
        'em-type-5': 'EmType5',
        'em-type-imagemap': 'EmTypeImageMap'
      }
      return map[this.template] || 'EmType1'
    }
  },
  mounted() {
    // window 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', this.handleWindowScroll, { passive: true })
    this.$nextTick(() => {
      this.updateScrollInfo()
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleWindowScroll)
  },
  methods: {
    handleSelectHotspot(id) {
      this.$emit('select-hotspot', id)
    },
    handleUpdateHotspot(hotspot, hotspotsKey) {
      this.$emit('update-hotspot', hotspot, hotspotsKey)
    },
    handleDeleteHotspot(id) {
      this.$emit('delete-hotspot', id)
    },
    handleClearHighlight() {
      this.$emit('clear-highlight')
    },
    handleWindowScroll() {
      this.updateScrollInfo()
    },
    handleScroll() {
      // 내부 스크롤 (preview-body)용
      this.updateScrollInfo()
    },
    updateScrollInfo() {
      // window 기준 스크롤 정보
      this.scrollInfo = {
        scrollTop: window.scrollY || window.pageYOffset,
        viewportHeight: window.innerHeight,
        contentHeight: document.documentElement.scrollHeight
      }
      this.$emit('scroll-update', this.scrollInfo)
    },
    /**
     * 현재 보이는 영역에서의 상대적 위치를 % 로 계산
     * @param {number} imageIndex - 이미지 인덱스 (1 또는 2)
     * @returns {number} - top 위치 (%)
     */
    getVisibleTopPosition(imageIndex) {
      const templateComponent = this.$refs.templateComponent
      
      if (!templateComponent) {
        return 5 // 기본값
      }
      
      // 해당 이미지 컨테이너 찾기
      const containerRef = templateComponent.$refs[`container${imageIndex}`]
      if (!containerRef) {
        return 5
      }
      
      const containerRect = containerRef.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const containerHeight = containerRect.height
      
      if (containerHeight <= 0) return 5
      
      // 컨테이너의 상단이 뷰포트 기준으로 어디에 있는지
      // containerRect.top이 음수면 컨테이너 상단이 화면 위로 벗어남
      // containerRect.top이 양수면 컨테이너 상단이 화면 안에 있음
      
      // 현재 뷰포트에서 보이는 컨테이너 영역의 시작점 (컨테이너 내부 기준)
      let visibleStartInContainer = 0
      
      if (containerRect.top < 0) {
        // 컨테이너 상단이 화면 위로 벗어난 경우
        visibleStartInContainer = Math.abs(containerRect.top)
      }
      
      // 컨테이너가 완전히 화면 아래에 있으면 기본값
      if (containerRect.top > viewportHeight) {
        return 5
      }
      
      // 컨테이너가 완전히 화면 위에 있으면 기본값
      if (containerRect.bottom < 0) {
        return 5
      }
      
      // 현재 보이는 영역의 시작점을 % 로 변환
      let topPercent = (visibleStartInContainer / containerHeight) * 100
      
      // 약간의 여유를 두고 배치 (5% ~ 85% 범위)
      topPercent = Math.max(5, Math.min(85, topPercent + 5))
      
      return Math.round(topPercent * 10) / 10
    },
    
    /**
     * ImageMap용 - 특정 rowId의 컨테이너에서 현재 보이는 Y 좌표(px) 계산
     * @param {number|string} rowId - row의 id
     * @returns {number} - Y 좌표 (px)
     */
    getVisibleYPositionForRow(rowId) {
      const templateComponent = this.$refs.templateComponent
      
      if (!templateComponent) {
        return 50 // 기본값
      }
      
      // EmTypeImageMap의 ref는 'container_' + row.id 형태
      const containerRef = templateComponent.$refs[`container_${rowId}`]
      if (!containerRef) {
        return 50
      }
      
      // Vue 2에서 v-for 내의 ref는 배열로 반환될 수 있음
      const container = Array.isArray(containerRef) ? containerRef[0] : containerRef
      if (!container) {
        return 50
      }
      
      const containerRect = container.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const containerHeight = containerRect.height
      
      if (containerHeight <= 0) return 50
      
      // 현재 뷰포트에서 보이는 컨테이너 영역의 시작점 (컨테이너 내부 기준, px)
      let visibleStartY = 0
      
      if (containerRect.top < 0) {
        // 컨테이너 상단이 화면 위로 벗어난 경우
        visibleStartY = Math.abs(containerRect.top)
      }
      
      // 컨테이너가 완전히 화면 아래에 있으면 기본값
      if (containerRect.top > viewportHeight) {
        return 50
      }
      
      // 컨테이너가 완전히 화면 위에 있으면 하단 근처
      if (containerRect.bottom < 0) {
        return Math.max(50, containerHeight - 100)
      }
      
      // 약간의 여유를 두고 배치
      return Math.max(50, Math.min(containerHeight - 100, visibleStartY + 50))
    },
    
    /**
     * ImageMap의 모든 row에 대한 보이는 Y 위치 반환
     * @returns {Object} - { rowId: yPosition, ... }
     */
    getVisiblePositionsForImageMap() {
      const templateComponent = this.$refs.templateComponent
      const result = {}
      
      if (!templateComponent || !templateComponent.rows) {
        return result
      }
      
      templateComponent.rows.forEach(row => {
        result[row.id] = this.getVisibleYPositionForRow(row.id)
      })
      
      return result
    }
  }
}
</script>

<style scoped>
.preview-deel {
  width: 100%;
}

.preview-card {
  margin-top: 30px;
  padding: 40px 5px 5px;
  background: #3d3d3e;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}
.preview-card::after {
  content: '';
  box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
  height: 12px;
  left: 12px;
  width: 12px;
  top: 9px;
  margin-top: 3px;
  position: absolute;
  background: #fc625d;
  border-radius: 50%;
  pointer-events: all;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(to bottom, #fafbfc, #f9fafb);
  border-bottom: 1px solid #f3f4f6;
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.preview-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.preview-subtitle {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #1f2937;
}

.preview-body {
  padding: 25px;
  background: #fff;
  min-height: 500px;
}
/* 이벤트템플릿 사이즈  */
.page-event-templates .preview-body {
  width: 960px;
}

/* 이벤트템플릿 모바일인 경우 */
.is-mobile .preview-body  {
  padding: 0;
}
.page-event-templates .is-mobile .preview-body {
  width: 480px;
}
</style>