<template>
  <div class="template-form">

    <!-- Device Toggle (hotspot-group 타입이 있을 때만 표시) -->
    <div v-if="hasHotspotGroup" class="device-toggle-section">
      <DeviceToggle v-model="currentDevice" />
    </div>

    <!-- 화끈딜 템플릿일 경우 통합 업로드 표시 -->
    <HotdealExcelUploader
      v-if="template === 'em-type-5'"
      :row1Products="localData.row1Products"
      :row3Products="localData.row3Products"
      @update:row1Products="localData.row1Products = $event"
      @update:row3Products="localData.row3Products = $event"
    />
    <!-- 이패밀리샵 템플릿일 경우 통합 업로드 표시 -->
    <EfamilyExcelUploader
      v-if="template === 'em-type-4'"
      :productGroups="localData.productGroups"
      :banners="localData.banners"
      @update:header="updateHeader"
      @update:productGroups="localData.productGroups = $event"
      @update:banners="localData.banners = $event"
    />

    <!-- 세로 네비게이션 + 필드 래퍼 -->
    <div class="form-layout" :class="{ 'layout-expanded': sidebarExpanded && tabs.length > 1 }">

      <nav v-if="tabs.length > 1" class="form-nav" role="navigation" aria-label="설정 섹션">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          class="form-nav-item"
          :class="{ active: (activeTab || tabs[0]) === tab }"
          @click="activeTab = tab"
          :aria-current="(activeTab || tabs[0]) === tab ? 'page' : undefined"
        >
          <span class="nav-icon" aria-hidden="true" v-html="tabIcon(tab)"></span>
          <span class="nav-label">{{ tab }}</span>
        </button>

        <!-- 서브-nav: 이미지 / 이미지맵 탭에서만 표시 -->
        <template v-if="currentTabSubItems">
          <div class="form-nav-sub-header">목록</div>
          <button
            v-for="(label, idx) in currentTabSubItems.items"
            :key="`sub-${idx}`"
            type="button"
            class="form-nav-sub-item"
            :class="{ active: activeSubItem === idx }"
            @click="activeSubItem = activeSubItem === idx ? null : idx"
          >
            <span class="sub-nav-bullet" aria-hidden="true">·</span>
            {{ label }}
          </button>
        </template>
      </nav>

      <div class="form-content">
        <div class="form-fields" :class="{ expanded: sidebarExpanded }">
      <template v-for="(config, key) in filteredFields">
        <div v-if="config.type === 'divider'" :key="`d-${key}`" class="form-section-divider">
          <span>{{ config.label }}</span>
        </div>
        <div
          v-else
          :key="key"
          class="form-group"
          :class="{ 'full-width': isFullWidthField(config.type) }"
          :data-privacy-form-field="key"
        >
        <label v-if="!isHideLabelField(config.type)" class="form-label">{{ config.label }}</label>
        
        <!-- Text, URL, Email, Number 등 -->
        <input 
          v-if="['text', 'url', 'email', 'number'].includes(config.type)"
          :type="config.type"
          v-model="localData[key]"
          :placeholder="config.placeholder || ''"
          class="form-input"
        />
        
        <!-- Textarea -->
        <textarea
          v-else-if="config.type === 'textarea'"
          v-model="localData[key]"
          :rows="config.rows || 3"
          :placeholder="config.placeholder || ''"
          class="form-textarea"
        ></textarea>
        
        <!-- Color Picker -->
        <div v-else-if="config.type === 'color'" class="color-field">
          <input 
            type="color"
            v-model="localData[key]"
            class="color-picker"
          />
          <input 
            type="text"
            v-model="localData[key]"
            class="form-input"
          />
        </div>
        
        <!-- Select -->
        <select
          v-else-if="config.type === 'select'"
          v-model="localData[key]"
          class="form-select"
        >
          <option v-for="option in config.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        
        <!-- Radio -->
        <div v-else-if="config.type === 'radio'" class="radio-group">
          <label v-for="option in config.options" :key="option.value" class="radio-item">
            <input 
              type="radio"
              :name="key"
              :value="option.value"
              v-model="localData[key]"
              class="form-radio"
            />
            <span class="radio-label">{{ option.label }}</span>
          </label>
        </div>
        
        <!-- Checkbox -->
        <label v-else-if="config.type === 'checkbox'" class="checkbox-item">
          <input 
            type="checkbox"
            v-model="localData[key]"
            class="form-checkbox"
          />
          <span class="checkbox-label">{{ config.checkboxLabel || '사용' }}</span>
        </label>

        <!-- Range Slider -->
        <div v-else-if="config.type === 'range'" class="range-field">
          <input 
            type="range"
            v-model.number="localData[key]"
            :min="config.min || 0"
            :max="config.max || 100"
            :step="config.step || 1"
            class="form-range"
          />
          <span class="range-value">{{ localData[key] }}{{ config.unit || '' }}</span>
        </div>
        
        <!-- Date -->
        <input 
          v-else-if="config.type === 'date'"
          type="date"
          v-model="localData[key]"
          class="form-input"
        />

        <!-- Date Picker -->
        <DatePicker
          v-else-if="config.type === 'date-picker'"
          v-model="localData[key]"
        />

        <!-- Hotspot Group Editor (단일 그룹) -->
        <HotspotGroupEditor
          v-else-if="config.type === 'hotspot-group'"
          v-model="localData[key]"
          :groupIndex="parseInt(key.match(/\d+/)?.[0] || 1)"
          :deviceType="currentDevice"
          :selectedId="selectedHotspotId"
          :selectedHotspotInfo="selectedHotspotInfo"
          :visibleTopPosition="getVisibleTopForKey(key)"
          :sidebarExpanded="sidebarExpanded"
          @select="handleSelectHotspot"
          @select-hotspot="handleSelectHotspotWithInfo"
          @select-image="handleSelectHotspotImage"
        />

        <!-- Hotspot Group Editor (동적 N개 이미지+핫스팟) -->
        <HotspotGroupEditor
          v-else-if="config.type === 'hotspot-group-list'"
          v-model="localData[key]"
          :deviceType="currentDevice"
          :selectedId="selectedHotspotId"
          :selectedHotspotInfo="selectedHotspotInfo"
          :sidebarExpanded="sidebarExpanded"
          @select="handleSelectHotspot"
          @select-hotspot="handleSelectHotspotWithInfo"
          @select-image="handleSelectHotspotImage"
        />

        <!-- Image Link Group Editor -->
        <ImageLinkGroupEditor
          v-else-if="config.type === 'image-link-group'"
          v-model="localData[key]"
          :sidebarExpanded="sidebarExpanded"
          :companyType.sync="localData.companyType"
          :selectedGroupIndex="currentTabSubItems && currentTabSubItems.type === 'image-link' ? activeSubItem : null"
          @select-image="handleSelectImage"
          @active-image-change="handleActiveImageChange"
        />

        <!-- 👇 Product Group List Editor (추가) -->
        <ProductGroupListEditor
          v-else-if="config.type === 'product-group-list'"
          v-model="localData[key]"
        />

        <!-- 👇 Banner List Editor (추가) -->
        <BannerListEditor
          v-else-if="config.type === 'banner-list'"
          v-model="localData[key]"
        />

        <!-- Image Map Editor (usemap - 파일 업로드 지원) -->
        <ImageMapEditor
          v-else-if="config.type === 'image-map-rows'"
          :rows="localData.imageMapRows"
          :areas="localData.imageMapAreas"
          :companyType="localData.companyType"
          :selectedAreaId="selectedHotspotId"
          :selectedRowInfo="selectedRowInfo"
          :visibleScrollPosition="visibleScrollPosition"
          :sidebarExpanded="sidebarExpanded"
          :selectedRowIndex="currentTabSubItems && currentTabSubItems.type === 'image-map' ? activeSubItem : null"
          @update:rows="localData.imageMapRows = $event"
          @update:areas="localData.imageMapAreas = $event"
          @update:companyType="localData.companyType = $event"
          @select-area="handleSelectHotspot"
          @select-row="handleSelectRow"
          @clear-highlight="handleClearRowHighlight"
        />

        <!-- Image Map Editor2 (usemap2 - URL 입력 전용) -->
        <ImageMapEditor2
          v-else-if="config.type === 'image-map-rows-2'"
          :rows="localData.imageMapRows"
          :areas="localData.imageMapAreas"
          :companyType="localData.companyType"
          :selectedAreaId="selectedHotspotId"
          :selectedRowInfo="selectedRowInfo"
          :visibleScrollPosition="visibleScrollPosition"
          :sidebarExpanded="sidebarExpanded"
          :selectedRowIndex="currentTabSubItems && currentTabSubItems.type === 'image-map' ? activeSubItem : null"
          @update:rows="localData.imageMapRows = $event"
          @update:areas="localData.imageMapAreas = $event"
          @update:companyType="localData.companyType = $event"
          @select-area="handleSelectHotspot"
          @select-row="handleSelectRow"
          @clear-highlight="handleClearRowHighlight"
        />

        <!-- Hotdeal Row1 Editor -->
        <HotdealRow1Editor
          v-else-if="config.type === 'hotdeal-row1-list'"
          v-model="localData[key]"
        />

        <!-- Hotdeal Row3 Editor -->
        <HotdealRow3Editor
          v-else-if="config.type === 'hotdeal-row3-list'"
          v-model="localData[key]"
        />

        <!-- Privacy Section Editor -->
        <PrivacySectionEditor
          v-else-if="config.type === 'privacy-section-list'"
          v-model="localData[key]"
          :sidebarExpanded="sidebarExpanded"
          :privacy-preview-focus="privacyPreviewFocus"
          @active-section="$emit('active-section-index', $event)"
        />
        </div>
      </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DeviceToggle from './DeviceToggle.vue'
import HotspotGroupEditor from './event/HotspotGroupEditor.vue'
import HotdealRow1Editor from './em/secret-sale/HotdealRow1Editor.vue'
import HotdealRow3Editor from './em/secret-sale/HotdealRow3Editor.vue'
import HotdealExcelUploader from './em/secret-sale/HotdealExcelUploader.vue'
import DatePicker from './DatePicker.vue'
import ImageLinkGroupEditor from './em/type-image-link/ImageLinkGroupEditor.vue'
import ImageMapEditor from './em/type-usemap/ImageMapEditor.vue'
import ImageMapEditor2 from './em/type-usemap/ImageMapEditor2.vue'
import ProductGroupListEditor from './em/efamily/ProductGroupListEditor.vue'
import BannerListEditor from './em/efamily/BannerListEditor.vue'
import EfamilyExcelUploader from './em/efamily/EfamilyExcelUploader.vue'
import PrivacySectionEditor from './privacy/PrivacySectionEditor.vue'

export default {
  components: { 
    DeviceToggle,
    HotspotGroupEditor,
    HotdealRow1Editor,
    HotdealRow3Editor,
    HotdealExcelUploader,
    DatePicker,
    ImageLinkGroupEditor, 
    ImageMapEditor,
    ImageMapEditor2,
    ProductGroupListEditor,
    BannerListEditor,
    EfamilyExcelUploader,
    PrivacySectionEditor
  },
  props: [
    'template', 
    'value', 
    'templateConfig', 
    'selectedHotspotId', 
    'visibleTopPositions', 
    'visibleScrollPosition', 
    'sidebarExpanded',
    'privacyPreviewFocus'
  ],
  data() {
    return {
      localData: {},
      currentDevice: 'web',
      activeTab: null,
      activeSubItem: null,
      selectedImageInfo: { groupId: null, imageId: null },
      selectedRowInfo: { rowId: null, rowIndex: null },
      selectedHotspotInfo: { hotspotId: null, groupIndex: null }
    }
  },
  computed: {
    tabs() {
      const seen = new Set()
      return Object.values(this.templateConfig || {})
        .map(f => f.tab || '기본')
        .filter(t => !seen.has(t) && seen.add(t))
    },
    filteredFields() {
      if (this.tabs.length <= 1) return this.templateConfig
      const current = this.activeTab || this.tabs[0]
      const result = {}
      Object.entries(this.templateConfig || {}).forEach(([key, config]) => {
        if ((config.tab || '기본') === current) result[key] = config
      })
      return result
    },
    hasHotspotGroup() {
      if (!this.templateConfig) return false
      return Object.values(this.templateConfig).some(
        config => config.type === 'hotspot-group' || config.type === 'hotspot-group-list'
      )
    },
    currentTabSubItems() {
      const fields = Object.entries(this.filteredFields || {})
      for (const [key, config] of fields) {
        if (config.type === 'image-link-group') {
          const groups = this.localData[key] || []
          return { type: 'image-link', key, items: groups.map((_, i) => `이미지 링크 그룹${i + 1}`) }
        }
        if (['image-map-rows', 'image-map-rows-2'].includes(config.type)) {
          const rows = this.localData[key] || []
          return { type: 'image-map', key, items: rows.map((_, i) => `이미지행 목록${i + 1}`) }
        }
      }
      return null
    }
  },
  created() {
    this.localData = { ...this.value }
    this.$nextTick(() => {
      if (this.currentTabSubItems) this.activeSubItem = 0
    })
  },
  watch: {
    value: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localData)) {
          this.localData = { ...newVal }
        }
      },
      deep: true
    },
    localData: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.value)) {
          this.$emit('input', { ...val })
        }
      },
      deep: true
    },
    template() {
      this.activeTab = null
      this.activeSubItem = null
    },
    activeTab() {
      this.activeSubItem = this.currentTabSubItems ? 0 : null
    },
    'localData.imageMapRows'(newRows, oldRows) {
      if (!this.currentTabSubItems || this.currentTabSubItems.type !== 'image-map') return
      const newLen = (newRows || []).length
      const oldLen = (oldRows || []).length
      if (newLen > oldLen) {
        this.activeSubItem = newLen - 1
      } else if (this.activeSubItem !== null && this.activeSubItem >= newLen) {
        this.activeSubItem = Math.max(0, newLen - 1)
      }
    },
    'localData.imageLinkGroups'(newGroups, oldGroups) {
      if (!this.currentTabSubItems || this.currentTabSubItems.type !== 'image-link') return
      const newLen = (newGroups || []).length
      const oldLen = (oldGroups || []).length
      if (newLen > oldLen) {
        this.activeSubItem = newLen - 1
      } else if (this.activeSubItem !== null && this.activeSubItem >= newLen) {
        this.activeSubItem = Math.max(0, newLen - 1)
      }
    },
    currentDevice(newVal) {
      this.$emit('device-change', newVal)
    },
    privacyPreviewFocus: {
      handler(v) {
        if (!v || this.template !== 'privacy-policy') return
        if (!v.formField) return
        this.$nextTick(() => this.scrollPrivacyFormFieldIntoView(v.formField))
      },
      deep: true
    }
  },
  methods: {
    scrollPrivacyFormFieldIntoView(fieldKey) {
      const root = this.$el
      if (!root || !fieldKey) return
      const wrap = root.querySelector(`[data-privacy-form-field="${fieldKey}"]`)
      if (!wrap) return
      wrap.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const focusable = wrap.querySelector('input, textarea, select')
      if (focusable) focusable.focus()
      wrap.classList.add('privacy-form-field-flash')
      setTimeout(() => wrap.classList.remove('privacy-form-field-flash'), 1600)
    },
    tabIcon(tab) {
      const icons = {
        '기본': '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="4.5" r="1.5" stroke="currentColor" stroke-width="1.4"/><line x1="10" y1="4.5" x2="15" y2="4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="1" y1="4.5" x2="6" y2="4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="5" cy="11.5" r="1.5" stroke="currentColor" stroke-width="1.4"/><line x1="7" y1="11.5" x2="15" y2="11.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="1" y1="11.5" x2="3" y2="11.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
        '콘텐츠': '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><line x1="1.5" y1="3.5" x2="14.5" y2="3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="1.5" y1="7" x2="10" y2="7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="1.5" y1="10.5" x2="14.5" y2="10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="1.5" y1="14" x2="7" y2="14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
        '스타일': '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 12.5C2 12.5 4 10 8 10C12 10 14 12.5 14 12.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M8 2L9.5 6H14L10.5 8.5L12 13L8 10.5L4 13L5.5 8.5L2 6H6.5L8 2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
        '이미지': '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentColor" stroke-width="1.4"/><circle cx="5.5" cy="5.5" r="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 10.5L5 7L7.5 9.5L10 7.5L14.5 12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        '상품': '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1.5 1.5H3L4.5 9.5H11.5L13 4H5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="5.5" cy="12.5" r="1.2" stroke="currentColor" stroke-width="1.3"/><circle cx="10.5" cy="12.5" r="1.2" stroke="currentColor" stroke-width="1.3"/></svg>',
        '배너': '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="4" rx="1" stroke="currentColor" stroke-width="1.4"/><rect x="1.5" y="9.5" width="13" height="4" rx="1" stroke="currentColor" stroke-width="1.4"/></svg>',
        '이미지맵': '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M5 7L7.5 5L10.5 8L13 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="10.5" r="2" stroke="currentColor" stroke-width="1.3"/><path d="M11.4 11.9L13.5 14" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
      }
      return icons[tab] || '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.4"/></svg>'
    },
    isFullWidthField(type) {
      const fullWidthTypes = [
        'hotspot-group',
        'hotspot-group-list',
        'image-link-group',
        'image-map-rows',
        'image-map-rows-2',
        'image-map-areas',
        'textarea',
        'product-group-list',
        'banner-list',
        'hotdeal-row1-list',
        'hotdeal-row3-list',
        'privacy-section-list'
      ]
      return fullWidthTypes.includes(type)
    },
    
    isHideLabelField(type) {
      return ['hotspot-group', 'hotspot-group-list', 'privacy-section-list'].includes(type)
    },
    
    handleSelectHotspot(id) {
      this.$emit('select-hotspot', id)
    },
    
    handleSelectHotspotWithInfo(info) {
      console.log('🎯 핫스팟 정보 선택됨:', info)
      this.selectedHotspotInfo = info
      this.$emit('select-hotspot-info', info)
    },
    
    handleSelectHotspotImage(info) {
      console.log('🖼️ 이미지 영역 선택됨:', info)
      this.$emit('select-hotspot-image', info)
    },
    
    handleSelectImage(info) {
      console.log('🖼️ 이미지 선택됨:', info)
      this.selectedImageInfo = info
      this.$emit('select-image', info)
    },
    
    handleSelectRow(info) {
      console.log('🖼️ 행 선택됨:', info)
      this.selectedRowInfo = info
      this.$emit('select-row', info)
    },
    
    handleActiveImageChange(info) {
      this.selectedImageInfo = info
    },
    
    handleClearRowHighlight() {
      this.selectedRowInfo = { rowId: null, rowIndex: null }
    },
    
    getVisibleTopForKey(key) {
      if (this.visibleTopPositions) {
        const match = key.match(/\d+$/)
        const index = match ? parseInt(match[0]) : 1
        return this.visibleTopPositions[index] || 10
      }
      return 10
    },
    
    updateHeader(headerData) {
      this.localData.headerImageCode = headerData.headerImageCode
      this.localData.headerImage = headerData.headerImage
      this.localData.headerImageAlt = headerData.headerImageAlt
    }
  }
}
</script>

<style scoped>
.template-form {
  width: 100%;
}

/* 세로 nav 레이아웃 */
.form-layout {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-layout.layout-expanded {
  flex-direction: row;
  align-items: flex-start;
}

/* 세로 nav */
.form-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 12px;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--color-border, #d2d2d7);
  flex-shrink: 0;
}

.form-layout.layout-expanded .form-nav {
  width: 136px;
  padding-bottom: 0;
  padding-right: 10px;
  margin-bottom: 0;
  margin-right: 14px;
  border-bottom: none;
  border-right: 1px solid var(--color-border, #d2d2d7);
  position: sticky;
  top: 0;
}

/* nav 아이템 */
.form-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-secondary, #6e6e73);
  font-size: 12.5px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.form-nav-item:hover {
  background: var(--color-bg-tertiary, #e8e8ed);
  color: var(--color-text, #1d1d1f);
}

.form-nav-item.active {
  background: var(--color-primary-light, rgba(0, 113, 227, 0.08));
  color: var(--color-primary, #0071e3);
  font-weight: 600;
}

.nav-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  line-height: 0;
}

/* 서브-nav */
.form-nav-sub-header {
  padding: 10px 10px 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-tertiary, #888);
  opacity: 0.7;
}

.form-nav-sub-item {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 6px 10px 6px 18px;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--color-text-secondary, #6e6e73);
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}

.form-nav-sub-item:hover {
  background: var(--color-bg-tertiary, #e8e8ed);
  color: var(--color-text, #1d1d1f);
}

.form-nav-sub-item.active {
  background: var(--color-primary-light, rgba(0, 113, 227, 0.08));
  color: var(--color-primary, #0071e3);
  font-weight: 600;
}

.sub-nav-bullet {
  opacity: 0.4;
  font-size: 14px;
  line-height: 1;
  flex-shrink: 0;
}

/* fields 영역 */
.form-content {
  flex: 1;
  min-width: 0;
}

.device-toggle-section {
  margin-bottom: 20px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-fields.expanded {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 20px;
}

.form-fields.expanded .form-group.full-width {
  grid-column: 1 / -1;
}

.form-section-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-tertiary, #717175);
  grid-column: 1 / -1;
}

.form-section-divider::before,
.form-section-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border, #d2d2d7);
  opacity: 0.6;
}

/* Form Group */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #6e6e73);
  margin-bottom: 4px;
}

/* Color Picker */
.color-field {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-field .form-input {
  flex: 1;
}

.color-picker {
  width: 40px;
  height: var(--form-height, 32px);
  padding: 2px;
  background: var(--color-bg, #fff);
  border: 1px solid var(--color-border, #e8ebf0);
  border-radius: var(--form-radius, 8px);
  cursor: pointer;
}

.color-picker:hover {
  border-color: var(--color-border-hover, #d8dce3);
}

/* Radio Group */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--color-bg-secondary, #f5f6fa);
  border: 1px solid transparent;
  border-radius: var(--form-radius, 8px);
  cursor: pointer;
  transition: all 0.15s ease;
}

.radio-item:hover {
  background: var(--color-bg-tertiary, #eceef2);
}

.radio-item:has(.form-radio:checked) {
  background: var(--color-primary-light, #eef0ff);
  border-color: var(--color-primary, #5568f8);
}

.form-radio {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--color-primary, #5568f8);
  cursor: pointer;
}

.radio-label {
  font-size: 11px;
  color: var(--color-text, #2d3748);
}

/* Checkbox */
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--color-bg-secondary, #f5f6fa);
  border: 1px solid transparent;
  border-radius: var(--form-radius, 8px);
  cursor: pointer;
  transition: all 0.15s ease;
}

.checkbox-item:hover {
  background: var(--color-bg-tertiary, #eceef2);
}

.checkbox-item:has(.form-checkbox:checked) {
  background: var(--color-primary-light, #eef0ff);
  border-color: var(--color-primary, #5568f8);
}

.form-checkbox {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--color-primary, #5568f8);
  cursor: pointer;
}

.checkbox-label {
  font-size: 11px;
  color: var(--color-text, #2d3748);
}

/* Range Slider */
.range-field {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--color-bg-secondary, #f5f6fa);
  border-radius: var(--form-radius, 8px);
}

.form-range {
  flex: 1;
  height: 4px;
  appearance: none;
  background: var(--color-border, #e8ebf0);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.form-range::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-primary, #5568f8);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s ease;
}

.form-range::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.form-range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--color-primary, #5568f8);
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.range-value {
  min-width: 45px;
  text-align: right;
  font-weight: 600;
  font-size: 11px;
  color: var(--color-primary, #5568f8);
}

.privacy-form-field-flash {
  animation: privacyFormFlash 1.5s ease;
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}
@keyframes privacyFormFlash {
  from { outline-color: #6366f1; }
  to { outline-color: transparent; }
}
</style>