<template>
  <div class="preview-deel">
    <div class="preview-card">
      <div class="preview-body" ref="previewBody" @scroll="handleScroll">
        <!-- TopBanner (디바이스별) -->
        <TopBanner v-if="deviceType === 'web' && showTopBanner" />
        <TopBannerMobile v-if="deviceType === 'mobile' && showTopBanner" />

        <!-- 템플릿 컴포넌트 -->
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

         <!-- 공지사항 -->
        <div v-if="showNotice && noticeData.items && noticeData.items.length > 0" class="preview-notice">
          <h2 class="preview-notice-title">{{ noticeData.title || '꼭 확인하세요' }}</h2>
          <ul class="preview-notice-list">
            <li v-for="(item, i) in noticeData.items" :key="i">{{ item }}</li>
          </ul>
        </div>

        <!-- BottomBanner (디바이스별) -->
        <BottomBanner v-if="deviceType === 'web' && showBottomBanner" />
        <BottomBannerMobile v-if="deviceType === 'mobile' && showBottomBanner" />

       

      </div>
    </div>
  </div>
</template>

<script>
import TopBanner from './event/common/TopBanner.vue'
import TopBannerMobile from './event/common/TopBannerMobile.vue'
import BottomBanner from './event/common/BottomBanner.vue'
import BottomBannerMobile from './event/common/BottomBannerMobile.vue'
import EmType1 from '../templates/EmType1.vue'
import EmType2 from '../templates/em/type-image-link/EmType2.vue'
import EmType3 from '../templates/event/EmType3.vue'
import EmType4 from '../templates/em/efamily/EmType4.vue'
import EmType5 from '../templates/em/secret-sale/EmType5.vue'
import EmTypeImageMap from '../templates/em/type-usemap/EmTypeImageMap.vue'
import PrivacyPreview from '../templates/privacy/PrivacyPreview.vue'

export default {
  name: 'PreviewFrame',
  components: {
    TopBanner,
    TopBannerMobile,
    BottomBanner,
    BottomBannerMobile,
    EmType1,
    EmType2,
    EmType3,
    EmType4,
    EmType5,
    EmTypeImageMap,
    PrivacyPreview
  },
  props: {
    template: String,
    formData: Object,
    selectedHotspotId: [Number, String],
    deviceType: {
      type: String,
      default: 'web'
    },
    showTopBanner: {
      type: Boolean,
      default: false
    },
    showBottomBanner: {
      type: Boolean,
      default: false
    },
    showNotice: {
      type: Boolean,
      default: true
    },
    noticeData: {
      type: Object,
      default: () => ({
        title: '꼭 확인하세요',
        items: []
      })
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
        'em-type-imagemap': 'EmTypeImageMap',
        'em-type-coupon' : 'EmType2',
        'em-type-letter' : 'EmTypeImageMap',
        'privacy-policy': 'PrivacyPreview'
      }
      return map[this.template] || 'EmType1'
    }
  },
  mounted() {
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
    handleUpdateHotspot(hotspot, hotspotsKey, imageIndex) {
      this.$emit('update-hotspot', hotspot, hotspotsKey, imageIndex)
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
      this.updateScrollInfo()
    },
    updateScrollInfo() {
      this.scrollInfo = {
        scrollTop: window.scrollY || window.pageYOffset,
        viewportHeight: window.innerHeight,
        contentHeight: document.documentElement.scrollHeight
      }
      this.$emit('scroll-update', this.scrollInfo)
    },
    
    getVisibleTopPosition(groupIndex) {
      console.log(`🔍 getVisibleTopPosition 호출: Group ${groupIndex}`)
      
      const templateComponent = this.$refs.templateComponent
      if (!templateComponent) {
        console.log('⚠️ templateComponent ref 없음')
        return 10
      }
      
      const containerRef = `image-container-${groupIndex}`
      const rawRef = templateComponent.$refs[containerRef]
      const container = Array.isArray(rawRef) ? rawRef[0] : rawRef
      
      if (!container) {
        console.log(`⚠️ ${containerRef} ref 없음`)
        return 10
      }
      
      const rect = container.getBoundingClientRect()
      const containerTop = rect.top
      const containerHeight = rect.height
      const viewportHeight = window.innerHeight
      
      let visibleCenter = 0
      
      if (containerTop < 0 && containerTop + containerHeight > 0) {
        const visibleHeight = Math.min(containerHeight, containerTop + containerHeight)
        const visibleTop = Math.abs(containerTop)
        visibleCenter = (visibleTop + (viewportHeight / 2)) / containerHeight * 100
      } else if (containerTop >= 0 && containerTop < viewportHeight) {
        const centerY = viewportHeight / 2
        const offsetFromCenter = containerTop - centerY
        visibleCenter = ((containerHeight / 2) - offsetFromCenter) / containerHeight * 100
      } else if (containerTop >= viewportHeight) {
        visibleCenter = 10
      } else {
        visibleCenter = 90
      }
      
      visibleCenter = Math.max(0, Math.min(100, visibleCenter))
      
      console.log(`📊 Group ${groupIndex} 가시 영역:`, {
        containerTop: containerTop.toFixed(2),
        containerHeight: containerHeight.toFixed(2),
        viewportHeight,
        visibleCenter: visibleCenter.toFixed(2) + '%'
      })
      
      return visibleCenter
    },
    
    getVisibleYPositionForRow(rowId) {
      const templateComponent = this.$refs.templateComponent
      
      if (!templateComponent) {
        return 50
      }
      
      const containerRef = templateComponent.$refs[`container_${rowId}`]
      if (!containerRef) {
        return 50
      }
      
      const container = Array.isArray(containerRef) ? containerRef[0] : containerRef
      if (!container) {
        return 50
      }
      
      const containerRect = container.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const containerHeight = containerRect.height
      
      if (containerHeight <= 0) return 50
      
      let visibleStartY = 0
      
      if (containerRect.top < 0) {
        visibleStartY = Math.abs(containerRect.top)
      }
      
      if (containerRect.top > viewportHeight) {
        return 50
      }
      
      if (containerRect.bottom < 0) {
        return Math.max(50, containerHeight - 100)
      }
      
      return Math.max(50, Math.min(containerHeight - 100, visibleStartY + 50))
    },
    
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
.is-mobile {
  font-size: 12px;
}
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

.preview-body {
  padding: 25px;
  background: #fff;
  min-height: 500px;
}

.page-event-templates .preview-body {
  width: 960px;
}

.is-mobile .preview-body  {
  padding: 0;
}
.page-event-templates .is-mobile .preview-body {
  width: 480px;
}

/* 공지사항 프리뷰 */
.preview-notice {
  padding: 60px 39px 60px 187px;
  background-color: #f8f8f8;
  box-sizing: border-box;
}

.is-mobile .preview-notice {
  padding: 8.33vw 5.41vw;
}

.preview-notice-title {
  font-size: 32px;
  font-weight: bold;
  line-height: 38px;
  color: #000;
}

.is-mobile .preview-notice-title {
  font-size: 4.44vw;
  line-height: 5.27vw;
}

.preview-notice-list {
  margin-top: 28px;
  list-style: none;
  padding: 0;
}

.preview-notice-list li {
  position: relative;
  padding-left: 17px;
  font-size: 24px;
  font-weight: 400;
  line-height: 29px;
  color: #212121;
  word-break: keep-all;
}

.is-mobile .preview-notice-list li {
  font-size: 3.33vw;
  line-height: 4.02vw;
  padding-left: 2.36vw;
}

.preview-notice-list li::before {
  content: '*';
  position: absolute;
  top: 3px;
  left: 0;
}

.preview-notice-list li + li {
  margin-top: 18px;
}
</style>