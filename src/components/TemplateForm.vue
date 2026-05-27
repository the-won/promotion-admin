<template>
  <div class="template-form">

    <!-- Device Toggle (hotspot-group 타입이 있을 때만 표시) -->
    <div v-if="hasHotspotGroup" class="device-toggle-section">
      <DeviceToggle v-model="currentDevice" />
    </div>

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
          v-else-if="config.type !== 'image-map-areas' && !isHiddenByHotdealNav(config.type) && !isHiddenByCondition(config)"
          :key="key"
          class="form-group"
          :class="{ 'full-width': isFullWidthField(config.type) || config.fullWidth }"
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
        
        <!-- Checkbox (Toggle Switch) -->
        <label v-else-if="config.type === 'checkbox'" class="toggle-item">
          <span class="toggle-label">{{ config.label }}</span>
          <span class="toggle-track" :class="{ active: localData[key] }">
            <input
              type="checkbox"
              v-model="localData[key]"
              class="toggle-input"
            />
            <span class="toggle-thumb"></span>
          </span>
        </label>

        <!-- Notice Items (공지사항 항목 리스트 에디터) -->
        <div v-else-if="config.type === 'notice-items'" class="notice-items-editor">
          <div v-for="(item, idx) in (localData[key] || [])" :key="idx" class="notice-item-row">
            <input
              type="text"
              :value="item"
              @input="updateNoticeItem(key, idx, $event.target.value)"
              class="form-input notice-item-input"
              placeholder="공지사항 내용"
            />
            <button type="button" @click="removeNoticeItem(key, idx)" class="btn-remove-item">✕</button>
          </div>
          <button type="button" @click="addNoticeItem(key)" class="btn-add-item">+ 항목 추가</button>
        </div>

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
          :selectedGroupIndex="currentTabSubItems && currentTabSubItems.type === 'hotspot-group' ? activeSubItem : null"
          :imageHighlightGroupIndex="focusedHotspotGroupIdx"
          @select="handleSelectHotspot"
          @select-hotspot="handleSelectHotspotWithInfo"
          @select-image="handleSelectHotspotImage"
          @add-group="handleHotspotGroupAdd"
        />

        <!-- Event Image Link Group Editor -->
        <EventImageLinkGroupEditor
          v-else-if="config.type === 'event-image-link-group'"
          v-model="localData[key]"
          :sidebarExpanded="sidebarExpanded"
          :deviceType="currentDevice"
          :selectedGroupIndex="currentTabSubItems && currentTabSubItems.type === 'event-image-link' ? activeSubItem : null"
          :sidebarFocusInfo="sidebarFocusInfo"
          :selectedImageInfo="activeImageInfo"
          @select-image="handleSelectImage"
          @active-image-change="handleActiveImageChange"
        />

        <!-- Image Link Group Editor -->
        <ImageLinkGroupEditor
          v-else-if="config.type === 'image-link-group'"
          v-model="localData[key]"
          :sidebarExpanded="sidebarExpanded"
          :companyType.sync="localData.companyType"
          :headerType="localData.headerType"
          :selectedGroupIndex="currentTabSubItems && currentTabSubItems.type === 'image-link' ? activeSubItem : null"
          :sidebarFocusInfo="sidebarFocusInfo"
          @select-image="handleSelectImage"
          @active-image-change="handleActiveImageChange"
        />

        <!-- 👇 Product Group List Editor (추가) -->
        <ProductGroupListEditor
          v-else-if="config.type === 'product-group-list'"
          v-model="localData[key]"
          :selectedGroupIndex="currentTabSubItems && currentTabSubItems.type === 'product-group' ? activeSubItem : null"
          :sidebarFocusInfo="sidebarFocusInfo"
          @select-product="handleSelectProduct"
          @add-group="() => {}"
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
          :headerType="localData.headerType"
          :selectedAreaId="selectedHotspotId"
          :selectedRowInfo="selectedRowInfo"
          :visibleScrollPosition="visibleScrollPosition"
          :sidebarExpanded="sidebarExpanded"
          :selectedRowIndex="currentTabSubItems && currentTabSubItems.type === 'image-map' ? activeSubItem : null"
          :sidebarFocusInfo="sidebarFocusInfo"
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
          :headerType="localData.headerType"
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

        <!-- Efamily 일괄 업로드 -->
        <EfamilyExcelUploader
          v-else-if="config.type === 'efamily-uploader'"
          :productGroups="localData.productGroups"
          :banners="localData.banners"
          @update:header="updateHeader"
          @update:productGroups="localData.productGroups = $event"
          @update:banners="localData.banners = $event"
        />

        <!-- 화끈딜 일괄 업로드 -->
        <HotdealExcelUploader
          v-else-if="config.type === 'hotdeal-uploader'"
          :row1Products="localData.row1Products"
          :row3Products="localData.row3Products"
          @update:row1Products="localData.row1Products = $event"
          @update:row3Products="localData.row3Products = $event"
        />

        <!-- 패밀리세일 일괄 업로드 -->
        <FamilySaleUploader
          v-else-if="config.type === 'familysale-uploader'"
          :headerImage="localData.headerImage"
          :headerImageAlt="localData.headerImageAlt"
          :productGroups="localData.productGroups"
          @update:headerImage="localData.headerImage = $event"
          @update:headerImageAlt="localData.headerImageAlt = $event"
          @update:productGroups="localData.productGroups = $event"
        />

        <!-- Hotdeal Row1 Editor -->
        <HotdealRow1Editor
          v-else-if="config.type === 'hotdeal-row1-list'"
          v-model="localData[key]"
          :selectedIndex="hotdealRow1SelectedIndex"
          :sidebarFocusInfo="sidebarFocusInfo"
          @select-product="handleSelectProduct"
          @add-row="() => {}"
        />

        <!-- Hotdeal Row3 Editor -->
        <HotdealRow3Editor
          v-else-if="config.type === 'hotdeal-row3-list'"
          v-model="localData[key]"
          :selectedIndex="hotdealRow3SelectedIndex"
          :sidebarFocusInfo="sidebarFocusInfo"
          @select-product="handleSelectProduct"
          @add-row="() => {}"
        />

        <!-- Family Sale Group Editor -->
        <FamilySaleGroupEditor
          v-else-if="config.type === 'family-sale-group'"
          v-model="localData[key]"
          :selectedGroupIndex="currentTabSubItems && currentTabSubItems.type === 'family-sale-group' ? activeSubItem : null"
          @add-group="() => {}"
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
import HotdealExcelUploader from './em/secret-sale/Hotdealexceluploader.vue'
import DatePicker from './DatePicker.vue'
import ImageLinkGroupEditor from './em/type-image-link/ImageLinkGroupEditor.vue'
import ImageMapEditor from './em/type-usemap/ImageMapEditor.vue'
import ImageMapEditor2 from './em/type-usemap/ImageMapEditor2.vue'
import ProductGroupListEditor from './em/efamily/ProductGroupListEditor.vue'
import BannerListEditor from './em/efamily/BannerListEditor.vue'
import EfamilyExcelUploader from './em/efamily/EfamilyExcelUploader.vue'
import PrivacySectionEditor from './privacy/PrivacySectionEditor.vue'
import FamilySaleGroupEditor from './em/family-sale/FamilySaleGroupEditor.vue'
import FamilySaleUploader from './em/family-sale/FamilySaleUploader.vue'
import EventImageLinkGroupEditor from './event/ImageLinkGroupEditor.vue'

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
    PrivacySectionEditor,
    FamilySaleGroupEditor,
    FamilySaleUploader,
    EventImageLinkGroupEditor
  },
  props: [
    'template',
    'value',
    'templateConfig',
    'selectedHotspotId',
    'visibleTopPositions',
    'visibleScrollPosition',
    'sidebarExpanded',
    'privacyPreviewFocus',
    'sidebarFocusInfo',
    'activeImageInfo'
  ],
  data() {
    return {
      localData: {},
      currentDevice: 'web',
      activeTab: null,
      activeSubItem: null,
      selectedImageInfo: { groupId: null, imageId: null },
      selectedRowInfo: { rowId: null, rowIndex: null },
      selectedHotspotInfo: { hotspotId: null, groupIndex: null },
      focusedHotspotGroupIdx: { idx: null, timestamp: null }
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
        config => config.type === 'hotspot-group' || config.type === 'hotspot-group-list' || config.type === 'event-image-link-group'
      )
    },
    currentTabSubItems() {
      const fields = Object.entries(this.filteredFields || {})
      for (const [key, config] of fields) {
        if (config.type === 'event-image-link-group') {
          const groups = this.localData[key] || []
          return { type: 'event-image-link', key, items: groups.map((_, i) => `링크그룹 ${i + 1}`) }
        }
        if (config.type === 'image-link-group') {
          const groups = this.localData[key] || []
          return { type: 'image-link', key, items: groups.map((_, i) => `이미지 링크 그룹${i + 1}`) }
        }
        if (['image-map-rows', 'image-map-rows-2'].includes(config.type)) {
          const rows = this.localData[key] || []
          return { type: 'image-map', key, items: rows.map((_, i) => `이미지행 목록${i + 1}`) }
        }
        if (config.type === 'hotspot-group-list') {
          const groups = this.localData[key] || []
          return { type: 'hotspot-group', key, items: groups.map((_, i) => `이미지행 목록 ${i + 1}`) }
        }
        if (config.type === 'product-group-list') {
          const groups = this.localData[key] || []
          return { type: 'product-group', key, items: groups.map((_, i) => `상품 그룹 ${i + 1}`) }
        }
        if (config.type === 'family-sale-group') {
          const groups = this.localData[key] || []
          return { type: 'family-sale-group', key, items: groups.map((_, i) => `상품 그룹 ${i + 1}`) }
        }
      }
      // 비밀특가: hotdeal-row1-list + hotdeal-row3-list 합산
      let row1Key = null, row3Key = null
      for (const [key, config] of fields) {
        if (config.type === 'hotdeal-row1-list') row1Key = key
        if (config.type === 'hotdeal-row3-list') row3Key = key
      }
      if (row1Key || row3Key) {
        const row1 = row1Key ? (this.localData[row1Key] || []) : []
        const row3 = row3Key ? (this.localData[row3Key] || []) : []
        const items = [
          ...row1.map((_, i) => `1단 상품 ${i + 1}`),
          ...row3.map((_, i) => `3단 상품 ${i + 1}`)
        ]
        return { type: 'hotdeal', row1Key, row3Key, row1Count: row1.length, items }
      }
      return null
    },
    hotdealRow1SelectedIndex() {
      if (!this.currentTabSubItems || this.currentTabSubItems.type !== 'hotdeal') return null
      if (this.activeSubItem === null) return null
      const row1Count = this.currentTabSubItems.row1Count || 0
      return this.activeSubItem < row1Count ? this.activeSubItem : null
    },
    hotdealRow3SelectedIndex() {
      if (!this.currentTabSubItems || this.currentTabSubItems.type !== 'hotdeal') return null
      if (this.activeSubItem === null) return null
      const row1Count = this.currentTabSubItems.row1Count || 0
      return this.activeSubItem >= row1Count ? this.activeSubItem - row1Count : null
    },
    allEditorTabMap() {
      const map = {}
      const editorTypes = [
        'event-image-link-group',
        'image-link-group',
        'image-map-rows',
        'image-map-rows-2',
        'hotspot-group-list',
      ]
      Object.entries(this.templateConfig || {}).forEach(([, config]) => {
        if (editorTypes.includes(config.type)) {
          map[config.type] = config.tab || '기본'
        }
      })
      return map
    },
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
      if (!this.currentTabSubItems || !['image-link', 'event-image-link'].includes(this.currentTabSubItems.type)) return
      const newLen = (newGroups || []).length
      const oldLen = (oldGroups || []).length
      if (newLen > oldLen) {
        this.activeSubItem = newLen - 1
      } else if (this.activeSubItem !== null && this.activeSubItem >= newLen) {
        this.activeSubItem = Math.max(0, newLen - 1)
      }
    },
    'localData.hotspotGroups'(newGroups, oldGroups) {
      if (!this.currentTabSubItems || this.currentTabSubItems.type !== 'hotspot-group') return
      const newLen = (newGroups || []).length
      const oldLen = (oldGroups || []).length
      if (newLen > oldLen) {
        this.activeSubItem = newLen - 1
      } else if (this.activeSubItem !== null && this.activeSubItem >= newLen) {
        this.activeSubItem = Math.max(0, newLen - 1)
      }
    },
    'localData.productGroups'(newGroups, oldGroups) {
      const subItems = this.currentTabSubItems
      if (!subItems || !['product-group', 'family-sale-group'].includes(subItems.type)) return
      const newLen = (newGroups || []).length
      const oldLen = (oldGroups || []).length
      if (newLen > oldLen) {
        this.activeSubItem = newLen - 1
      } else if (this.activeSubItem !== null && this.activeSubItem >= newLen) {
        this.activeSubItem = Math.max(0, newLen - 1)
      }
    },
    'localData.row1Products'(newRows, oldRows) {
      const subItems = this.currentTabSubItems
      if (!subItems || subItems.type !== 'hotdeal') return
      const newLen = (newRows || []).length
      const oldLen = (oldRows || []).length
      if (newLen > oldLen) {
        this.activeSubItem = newLen - 1
      } else if (this.activeSubItem !== null && this.activeSubItem < (oldLen || 0) && this.activeSubItem >= newLen) {
        this.activeSubItem = Math.max(0, newLen - 1)
      }
    },
    'localData.row3Products'(newRows, oldRows) {
      const subItems = this.currentTabSubItems
      if (!subItems || subItems.type !== 'hotdeal') return
      const row1Count = (this.localData.row1Products || []).length
      const newLen = (newRows || []).length
      const oldLen = (oldRows || []).length
      if (newLen > oldLen) {
        this.activeSubItem = row1Count + newLen - 1
      } else if (this.activeSubItem !== null && this.activeSubItem >= row1Count) {
        const row3Idx = this.activeSubItem - row1Count
        if (row3Idx >= newLen) {
          this.activeSubItem = row1Count + Math.max(0, newLen - 1)
        }
      }
    },
    selectedHotspotId(newId) {
      if (newId === null) return
      const subItems = this.currentTabSubItems
      if (!subItems) {
        const map = this.allEditorTabMap
        const targetTab = map['image-map-rows'] || map['image-map-rows-2'] || map['hotspot-group-list'] || null
        if (!targetTab) return
        this.activeTab = targetTab
        this.$nextTick(() => this._applySelectedHotspotId(newId))
        return
      }
      this._applySelectedHotspotId(newId)
    },
    sidebarFocusInfo: {
      handler(info) {
        if (!info || !info.refKey) return
        const subItems = this.currentTabSubItems
        if (!subItems) {
          const targetTab = this._findTabForRefKey(info.refKey)
          if (!targetTab) return
          this.activeTab = targetTab
          this.$nextTick(() => {
            const newSubItems = this.currentTabSubItems
            if (newSubItems) this._applySidebarFocus(info, newSubItems)
          })
          return
        }
        this._applySidebarFocus(info, subItems)
      },
      deep: true
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
    _findTabForRefKey(refKey) {
      const map = this.allEditorTabMap
      if (refKey.startsWith('image-group-') || refKey.startsWith('img-item-')) {
        return map['event-image-link-group'] || null
      }
      if (refKey.startsWith('row-')) {
        return map['image-map-rows'] || map['image-map-rows-2'] || null
      }
      if (refKey.startsWith('image-container-') || refKey.startsWith('hotspot-')) {
        return map['hotspot-group-list'] || null
      }
      if (refKey.startsWith('image-')) {
        return map['image-link-group'] || null
      }
      return null
    },
    _applySelectedHotspotId(newId) {
      const subItems = this.currentTabSubItems
      if (!subItems) return
      if (subItems.type === 'image-map') {
        const area = (this.localData.imageMapAreas || []).find(a => a.id === newId)
        if (!area) return
        const rowIndex = (this.localData.imageMapRows || []).findIndex(r => r.id === area.rowId)
        if (rowIndex !== -1) this.activeSubItem = rowIndex
      } else if (subItems.type === 'hotspot-group') {
        const groups = this.localData[subItems.key] || []
        for (let i = 0; i < groups.length; i++) {
          if ((groups[i].hotspots || []).some(h => h.id === newId)) {
            this.activeSubItem = i
            return
          }
        }
      }
    },
    _applySidebarFocus(info, subItems) {
      const key = info.refKey
      if (subItems.type === 'event-image-link') {
        const groups = this.localData[subItems.key] || []
        if (key.startsWith('image-group-')) {
          const idx = groups.findIndex(g => `image-group-${g.id}` === key)
          if (idx !== -1) this.activeSubItem = idx
        } else if (key.startsWith('img-item-')) {
          for (let i = 0; i < groups.length; i++) {
            if (key.startsWith(`img-item-${groups[i].id}-`)) {
              this.activeSubItem = i
              break
            }
          }
        }
      } else if (subItems.type === 'image-link' && key.startsWith('image-')) {
        const groups = this.localData[subItems.key] || []
        for (let i = 0; i < groups.length; i++) {
          const group = groups[i]
          for (const img of (group.images || [])) {
            if (`image-${group.id}-${img.id}` === key) {
              this.activeSubItem = i
              return
            }
          }
        }
      } else if (subItems.type === 'image-map' && key.startsWith('row-')) {
        const rows = this.localData[subItems.key] || []
        const rowId = key.slice(4)
        const idx = rows.findIndex(r => String(r.id) === rowId)
        if (idx !== -1) this.activeSubItem = idx
      } else if (subItems.type === 'product-group') {
        const groups = this.localData[subItems.key] || []
        if (key.startsWith('efamily-title-')) {
          const gid = Number(key.slice('efamily-title-'.length))
          const idx = groups.findIndex(g => g.id === gid)
          if (idx !== -1) this.activeSubItem = idx
        } else if (key.startsWith('efamily-row-')) {
          const rid = Number(key.slice('efamily-row-'.length))
          for (let i = 0; i < groups.length; i++) {
            if ((groups[i].rows || []).some(r => r.id === rid)) {
              this.activeSubItem = i
              return
            }
          }
        }
      } else if (subItems.type === 'hotspot-group') {
        const groups = this.localData[subItems.key] || []
        let targetIdx = null
        if (key.startsWith('image-container-')) {
          const idx = parseInt(key.replace('image-container-', ''), 10) - 1
          if (idx >= 0 && idx < groups.length) targetIdx = idx
        } else if (key.startsWith('hotspot-')) {
          const hotspotId = key.slice('hotspot-'.length)
          for (let i = 0; i < groups.length; i++) {
            if ((groups[i].hotspots || []).some(h => String(h.id) === hotspotId)) {
              targetIdx = i
              break
            }
          }
        }
        if (targetIdx !== null) {
          this.activeSubItem = targetIdx
          this.focusedHotspotGroupIdx = { idx: targetIdx, timestamp: Date.now() }
        }
      } else if (subItems.type === 'hotdeal') {
        const row1Count = subItems.row1Count || 0
        if (key.startsWith('hotdeal-row1-')) {
          const id = Number(key.slice('hotdeal-row1-'.length))
          const idx = (this.localData[subItems.row1Key] || []).findIndex(p => p.id === id)
          if (idx !== -1) this.activeSubItem = idx
        } else if (key.startsWith('hotdeal-row3-')) {
          const id = Number(key.slice('hotdeal-row3-'.length))
          const idx = (this.localData[subItems.row3Key] || []).findIndex(p => p.id === id)
          if (idx !== -1) this.activeSubItem = row1Count + idx
        }
      }
    },
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
        '설정': '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1.5A6.5 6.5 0 1 0 8 14.5A6.5 6.5 0 0 0 8 1.5Z" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.3"/></svg>',
      }
      return icons[tab] || '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.4"/></svg>'
    },
    isFullWidthField(type) {
      const fullWidthTypes = [
        'hotspot-group',
        'hotspot-group-list',
        'image-link-group',
        'event-image-link-group',
        'image-map-rows',
        'image-map-rows-2',
        'image-map-areas',
        'textarea',
        'product-group-list',
        'banner-list',
        'hotdeal-row1-list',
        'hotdeal-row3-list',
        'privacy-section-list',
        'efamily-uploader',
        'hotdeal-uploader',
        'familysale-uploader',
        'notice-items',
        'checkbox',
        'family-sale-group'
      ]
      return fullWidthTypes.includes(type)
    },

    isHideLabelField(type) {
      return ['hotspot-group', 'hotspot-group-list', 'privacy-section-list', 'efamily-uploader', 'hotdeal-uploader', 'familysale-uploader', 'checkbox', 'notice-items', 'family-sale-group', 'event-image-link-group'].includes(type)
    },
    
    handleSelectProduct(info) {
      this.$emit('select-product', info)
    },

    handleHotspotGroupAdd() {
      this.$nextTick(() => {
        if (this.localData.hotspotGroups) {
          this.activeSubItem = this.localData.hotspotGroups.length - 1
        }
      })
    },
    addSubNavItem() {
      const subItems = this.currentTabSubItems
      if (!subItems) return
      const { type, key } = subItems
      if (type === 'product-group') {
        const newGroup = {
          id: Date.now(),
          titleImage: { url: '', alt: '' },
          rows: [{ id: Date.now() + 1, products: [
            { productCode: '', imageUrl: '', imageAlt: '' },
            { productCode: '', imageUrl: '', imageAlt: '' },
            { productCode: '', imageUrl: '', imageAlt: '' }
          ]}]
        }
        const list = [...(this.localData[key] || []), newGroup]
        this.$set(this.localData, key, list)
        this.$nextTick(() => { this.activeSubItem = list.length - 1 })
      } else if (type === 'family-sale-group') {
        const newGroup = {
          id: `pg_fs_${Date.now()}`,
          titleImage: { url: '', alt: '' },
          products: Array(5).fill(null).map(() => ({ productCode: '', imageUrl: '', imageAlt: '' }))
        }
        const list = [...(this.localData[key] || []), newGroup]
        this.$set(this.localData, key, list)
        this.$nextTick(() => { this.activeSubItem = list.length - 1 })
      }
    },
    addHotdealItem(listType) {
      const subItems = this.currentTabSubItems
      if (!subItems || subItems.type !== 'hotdeal') return
      if (listType === 'row1') {
        const newProduct = { id: Date.now(), productId: '', imageUrl: '', imageAlt: '' }
        const list = [...(this.localData[subItems.row1Key] || []), newProduct]
        this.$set(this.localData, subItems.row1Key, list)
        this.$nextTick(() => { this.activeSubItem = list.length - 1 })
      } else if (listType === 'row3') {
        const newProductSet = {
          id: Date.now(),
          products: [
            { productId: '', imageUrl: '', imageAlt: '' },
            { productId: '', imageUrl: '', imageAlt: '' },
            { productId: '', imageUrl: '', imageAlt: '' }
          ]
        }
        const row1Count = (this.localData[subItems.row1Key] || []).length
        const list = [...(this.localData[subItems.row3Key] || []), newProductSet]
        this.$set(this.localData, subItems.row3Key, list)
        this.$nextTick(() => { this.activeSubItem = row1Count + list.length - 1 })
      }
    },
    isHiddenByCondition(config) {
      if (!config.showWhen) return false
      return !this.localData[config.showWhen]
    },

    isHiddenByHotdealNav(type) {
      const subItems = this.currentTabSubItems
      if (!subItems || subItems.type !== 'hotdeal' || this.activeSubItem === null) return false
      const row1Count = subItems.row1Count || 0
      const isRow1Selected = this.activeSubItem < row1Count
      if (type === 'hotdeal-row1-list' && !isRow1Selected) return true
      if (type === 'hotdeal-row3-list' && isRow1Selected) return true
      return false
    },

    handleSelectHotspot(id) {
      this.$emit('select-hotspot', id)
    },
    
    handleSelectHotspotWithInfo(info) {
      console.log('핫스팟 정보 선택됨:', info)
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
    },

    updateNoticeItem(key, idx, val) {
      const arr = [...(this.localData[key] || [])]
      arr[idx] = val
      this.$set(this.localData, key, arr)
    },
    removeNoticeItem(key, idx) {
      const arr = [...(this.localData[key] || [])]
      arr.splice(idx, 1)
      this.$set(this.localData, key, arr)
    },
    addNoticeItem(key) {
      this.$set(this.localData, key, [...(this.localData[key] || []), ''])
    }
  }
}
</script>

<style scoped>
.template-form {
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0;
}

.form-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text, #212121);
  margin-bottom: 4px;
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
  gap: 3px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-tertiary, #888);
  opacity: 0.7;
}

.sub-nav-add-wrap {
  display: flex;
  gap: 4px;
  opacity: 1;
}

.sub-nav-add-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 5px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  border: 1px solid var(--color-border, #d2d2d7);
  border-radius: 4px;
  background: var(--color-bg, #fff);
  color: var(--color-text-secondary, #6e6e73);
  cursor: pointer;
  transition: background 0.12s, color 0.12s, border-color 0.12s;
  letter-spacing: 0;
  text-transform: none;
  opacity: 1;
}

.sub-nav-add-btn:hover {
  background: var(--color-primary, #0071e3);
  color: #fff;
  border-color: var(--color-primary, #0071e3);
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
  gap: 28px 20px;
}

.form-fields.expanded .form-group.full-width {
  grid-column: 1 / -1;
}

.form-section-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0 12px;
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

/* Toggle Switch */
.toggle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  background: var(--color-bg-secondary, #f5f6fa);
  border: 1px solid transparent;
  border-radius: var(--form-radius, 8px);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  user-select: none;
}

.toggle-item:hover {
  background: var(--color-bg-tertiary, #eceef2);
}

.toggle-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text, #1d1d1f);
  flex: 1;
}

.toggle-track {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: var(--color-border, #d2d2d7);
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.toggle-track.active {
  background: var(--color-primary, #0071e3);
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.toggle-thumb {
  position: absolute;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.25);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toggle-track.active .toggle-thumb {
  transform: translateX(18px);
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

/* Notice Items Editor */
.notice-items-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notice-item-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notice-item-input {
  flex: 1;
  min-width: 0;
}

.btn-remove-item {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border, #e8ebf0);
  border-radius: 6px;
  background: var(--color-bg-secondary, #f5f6fa);
  color: var(--color-text-secondary, #6e6e73);
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.btn-remove-item:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #dc2626;
}

.btn-add-item {
  align-self: flex-start;
  padding: 6px 12px;
  border: 1px dashed var(--color-border, #d2d2d7);
  border-radius: 6px;
  background: transparent;
  color: var(--color-primary, #0071e3);
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.btn-add-item:hover {
  background: var(--color-primary-light, rgba(0, 113, 227, 0.06));
  border-color: var(--color-primary, #0071e3);
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