<template>
  <div class="hotspot-group-editor">
    <!-- 각 그룹 -->
    <div
      v-for="{ group, actualIdx } in displayGroups"
      :key="group.id"
      class="image-map-editor"
    >
      <div class="card-header">
        <span class="card-title">이미지 {{ actualIdx + 1 }}</span>
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
        @mouseenter="setActiveImage(actualIdx + 1)"
        @mouseleave="setActiveImage(null)"
        @click="selectImage(actualIdx + 1)"
      >
        <div class="form-group">
          <label>
            {{ deviceType === 'mobile' ? '모바일' : '웹' }} 이미지 URL
          </label>
          <input
            type="url"
            :value="getImageUrl(group)"
            @input="updateImageUrl(actualIdx, $event.target.value)"
            placeholder="https://example.com/image.jpg"
            class="form-input"
            @click.stop
          />
        </div>

        <!-- 이미지 업로드 -->
        <div class="form-group">
          <label>
            {{ deviceType === 'mobile' ? '모바일' : '웹' }} 이미지 업로드
          </label>
          <div class="image-input-wrapper">
            <input
              type="file"
              :id="`upload-${deviceType}-${actualIdx}`"
              accept="image/*"
              @change="handleImageUpload(actualIdx, $event)"
              class="file-input-hidden"
              @click.stop
            />
            <label :for="`upload-${deviceType}-${actualIdx}`" class="btn-file">
              📁 파일 선택
            </label>
            <span v-if="getUploadedFileName(group)" class="file-info">
              ✓ {{ getUploadedFileName(group) }}
            </span>
            <button
              v-if="getImageUrl(group) && getImageUrl(group).startsWith('data:')"
              type="button"
              class="btn-cut"
              @click.stop="openCutter(actualIdx, group)"
            >✂ 자르기</button>
          </div>
        </div>

        <div class="form-group">
          <label>
            {{ deviceType === 'mobile' ? '모바일' : '웹' }} 이미지 대체텍스트 (스크린리더용)
          </label>
          <input
            type="text"
            :value="getImageAlt(group)"
            @input="updateImageAlt(actualIdx, $event.target.value)"
            placeholder="이미지 설명"
            class="form-input"
            @click.stop
          />
        </div>
      </div>

      <!-- 핫스팟 목록 헤더 -->
      <div class="section-header">
        <h4>버튼 목록 ({{ group.hotspots.length }}개)</h4>
        <button @click="addHotspot(actualIdx)" class="btn btn-success">추가</button>
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
          @click="selectHotspot(hotspot.id, actualIdx + 1)"
        >
          <div class="card-header">
            <span class="card-title">버튼 {{ hsIdx + 1 }}</span>
            <button @click.stop="removeHotspot(actualIdx, hotspot.id)" class="btn btn-danger btn-sm">삭제</button>
          </div>

          <!-- 링크 타입 셀렉트 (deviceType별 분리) -->
          <div class="form-group">
            <label>링크 타입</label>
            <select
              :value="getHotspotConfig(hotspot).linkType"
              @change="onLinkTypeChange(hotspot, $event.target.value)"
              class="form-input"
              @click.stop
            >
              <option
                v-for="lt in currentLinkTypes"
                :key="lt.value"
                :value="lt.value"
              >{{ lt.label }}</option>
            </select>
          </div>

          <!-- 기획전 / 상품 / 브랜드e쿠폰 / 브랜드매장결제 : 코드 단일 입력 -->
          <div v-if="['plan','product','brand_ecoupon','brand_store'].includes(getHotspotConfig(hotspot).linkType)" class="form-group link-inputs">
            <label>{{ codeLabelMap[getHotspotConfig(hotspot).linkType] }}</label>
            <input
              type="text"
              :value="getHotspotConfig(hotspot).linkData.code"
              @input="updateLinkData(hotspot, 'code', $event.target.value)"
              placeholder="코드 입력"
              class="form-input"
              @click.stop
            />
          </div>

          <!-- 기획전 / 상품 / 브랜드e쿠폰 : 웹에서 a/button 선택 (brand_store 제외) -->
          <div v-if="deviceType === 'web' && ['plan','product','brand_ecoupon'].includes(getHotspotConfig(hotspot).linkType)" class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="getHotspotConfig(hotspot).useLink"
                @change="onUseLinkChange(hotspot, $event.target.checked)"
                class="form-checkbox"
                @click.stop
              />
              <span>a 태그 사용 (미체크 시 button)</span>
            </label>
          </div>

          <!-- 이벤트 : 웹/모바일 코드 분리 -->
          <template v-if="getHotspotConfig(hotspot).linkType === 'event'">
            <div v-if="deviceType === 'web'" class="form-group">
              <label>웹 이벤트 코드</label>
              <input
                type="text"
                :value="getHotspotConfig(hotspot).linkData.webEventCode"
                @input="updateLinkData(hotspot, 'webEventCode', $event.target.value)"
                placeholder="웹 이벤트 코드"
                class="form-input"
                @click.stop
              />
            </div>
            <div v-if="deviceType === 'mobile'" class="form-group">
              <label>모바일 이벤트 코드</label>
              <input
                type="text"
                :value="getHotspotConfig(hotspot).linkData.mobileEventCode"
                @input="updateLinkData(hotspot, 'mobileEventCode', $event.target.value)"
                placeholder="모바일 이벤트 코드"
                class="form-input"
                @click.stop
              />
            </div>
            <!-- 웹에서 a/button 선택 -->
            <div v-if="deviceType === 'web'" class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="getHotspotConfig(hotspot).useLink"
                  @change="onUseLinkChange(hotspot, $event.target.checked)"
                  class="form-checkbox"
                  @click.stop
                />
                <span>a 태그 사용 (미체크 시 button)</span>
              </label>
            </div>
          </template>

          <!-- 파트너사 : 웹/모바일 코드 분리 + returnUrl -->
          <template v-if="getHotspotConfig(hotspot).linkType === 'partner'">
            <div v-if="deviceType === 'web'" class="form-group">
              <label>웹 제휴사 코드</label>
              <input
                type="text"
                :value="getHotspotConfig(hotspot).linkData.webPartnerCode"
                @input="updateLinkData(hotspot, 'webPartnerCode', $event.target.value)"
                placeholder="웹 제휴사 코드"
                class="form-input"
                @click.stop
              />
            </div>
            <div v-if="deviceType === 'mobile'" class="form-group">
              <label>모바일 제휴사 코드</label>
              <input
                type="text"
                :value="getHotspotConfig(hotspot).linkData.mobilePartnerCode"
                @input="updateLinkData(hotspot, 'mobilePartnerCode', $event.target.value)"
                placeholder="모바일 제휴사 코드"
                class="form-input"
                @click.stop
              />
            </div>
            <div class="form-group">
              <label>returnUrl <span class="optional-label">(선택)</span></label>
              <input
                type="text"
                :value="getHotspotConfig(hotspot).linkData.returnUrl"
                @input="updateLinkData(hotspot, 'returnUrl', $event.target.value)"
                placeholder="/frnt/..."
                class="form-input"
                @click.stop
              />
            </div>
            <!-- 웹에서 a/button 선택 -->
            <div v-if="deviceType === 'web'" class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="getHotspotConfig(hotspot).useLink"
                  @change="onUseLinkChange(hotspot, $event.target.checked)"
                  class="form-checkbox"
                  @click.stop
                />
                <span>a 태그 사용 (미체크 시 button)</span>
              </label>
            </div>
          </template>

          <!-- 외부URL / 기타 -->
          <template v-if="['external','custom'].includes(getHotspotConfig(hotspot).linkType)">
            <div class="form-group">
              <label>전체 URL</label>
              <input
                type="url"
                :value="getHotspotConfig(hotspot).linkData.url"
                @input="updateLinkData(hotspot, 'url', $event.target.value)"
                placeholder="https://example.com"
                class="form-input"
                @click.stop
              />
            </div>
            <!-- 웹에서 a/button 선택 -->
            <div v-if="deviceType === 'web'" class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="getHotspotConfig(hotspot).useLink"
                  @change="onUseLinkChange(hotspot, $event.target.checked)"
                  class="form-checkbox"
                  @click.stop
                />
                <span>a 태그 사용 (미체크 시 button)</span>
              </label>
            </div>
          </template>

          <!-- 쿠폰 (모바일 전용) -->
          <template v-if="getHotspotConfig(hotspot).linkType === 'coupon'">
            <div class="form-group">
              <label>쿠폰 타입</label>
              <select
                :value="getHotspotConfig(hotspot).linkData.couponType"
                @change="updateLinkData(hotspot, 'couponType', $event.target.value)"
                class="form-input"
                @click.stop
              >
                <option v-for="ct in couponTypes" :key="ct.value" :value="ct.value">{{ ct.label }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>
                쿠폰번호
                <span v-if="['multi','brgg_multi'].includes(getHotspotConfig(hotspot).linkData.couponType)" class="optional-label">(콤마로 구분)</span>
              </label>
              <input
                type="text"
                :value="getHotspotConfig(hotspot).linkData.couponCodes"
                @input="updateLinkData(hotspot, 'couponCodes', $event.target.value)"
                :placeholder="['multi','brgg_multi'].includes(getHotspotConfig(hotspot).linkData.couponType) ? '코드1,코드2' : '쿠폰번호'"
                class="form-input"
                @click.stop
              />
            </div>
          </template>

          <!-- 검색어 -->
          <div v-if="getHotspotConfig(hotspot).linkType === 'search'" class="form-group">
            <label>검색어</label>
            <input
              type="text"
              :value="getHotspotConfig(hotspot).linkData.keyword"
              @input="updateLinkData(hotspot, 'keyword', $event.target.value)"
              placeholder="예: 커피"
              class="form-input"
              @click.stop
            />
          </div>

          <!-- 미리보기 -->
          <div class="link-preview">
            <div class="preview-row">
              <span class="preview-device-label">{{ deviceType === 'web' ? '웹' : '모바일' }}</span>
              <code class="preview-code">{{ getPreview(hotspot) }}</code>
            </div>
          </div>

          <!-- 대체텍스트 -->
          <div class="form-group">
            <label>대체텍스트 (스크린리더용)</label>
            <input type="text" v-model="hotspot.alt" placeholder="버튼 설명" class="form-input" @click.stop />
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

    <ImageCutterModal
      :visible="cutterVisible"
      :image-url="cutterImageUrl"
      :file-name="cutterFileName"
      @confirm="onCutterConfirm"
      @cancel="closeCutter"
    />
  </div>
</template>

<script>
import {
  WEB_LINK_TYPES,
  MOBILE_LINK_TYPES,
  COUPON_TYPES,
  createEmptyLinkData,
  buildWebAction,
  buildMobileAction,
} from '../../utils/hotspotLinkBuilder.js'
import ImageCutterModal from '../common/ImageCutterModal.vue'

export default {
  name: 'HotspotGroupEditor',
  components: { ImageCutterModal },
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
    },
    selectedGroupIndex: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      localGroups: [],
      flashingId: null,
      couponTypes: COUPON_TYPES,
      codeLabelMap: {
        plan: '기획전 코드',
        product: '상품 코드',
        brand_ecoupon: '브랜드 코드',
        brand_store: '브랜드 코드',
      },
      cutterVisible: false,
      cutterTarget: null,
      cutterImageUrl: '',
      cutterFileName: ''
    }
  },
  computed: {
    currentLinkTypes() {
      return this.deviceType === 'mobile' ? MOBILE_LINK_TYPES : WEB_LINK_TYPES
    },
    displayGroups() {
      if (this.selectedGroupIndex !== null && this.selectedGroupIndex !== undefined) {
        const group = this.localGroups[this.selectedGroupIndex]
        return group ? [{ group, actualIdx: this.selectedGroupIndex }] : []
      }
      return this.localGroups.map((group, actualIdx) => ({ group, actualIdx }))
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

    // ── 이미지 URL / Alt ──
    getImageUrl(group) {
      return this.deviceType === 'mobile'
        ? (group.mobileImageUrl || group.webImageUrl)
        : group.webImageUrl
    },
    updateImageUrl(groupIdx, url) {
      if (this.deviceType === 'mobile') {
        this.localGroups[groupIdx].mobileImageUrl = url
      } else {
        this.localGroups[groupIdx].webImageUrl = url
      }
    },
    getImageAlt(group) {
      return this.deviceType === 'mobile'
        ? (group.mobileImageAlt || group.webImageAlt || '')
        : (group.webImageAlt || '')
    },
    updateImageAlt(groupIdx, alt) {
      if (this.deviceType === 'mobile') {
        this.localGroups[groupIdx].mobileImageAlt = alt
      } else {
        this.localGroups[groupIdx].webImageAlt = alt
      }
    },

    // ── 이미지 업로드 ──
    handleImageUpload(groupIdx, event) {
      const file = event.target.files[0]
      if (!file) return

      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.')
        return
      }

      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.')
        return
      }

      // FileReader로 Base64 변환
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Url = e.target.result
        
        // 파일명 저장
        if (this.deviceType === 'mobile') {
          this.$set(this.localGroups[groupIdx], 'mobileImageFileName', file.name)
        } else {
          this.$set(this.localGroups[groupIdx], 'webImageFileName', file.name)
        }

        // URL 업데이트 (실제로는 서버에 업로드 후 URL을 받아와야 함)
        // 여기서는 임시로 Base64 URL 사용
        this.updateImageUrl(groupIdx, base64Url)
        
        console.log('이미지 업로드:', file.name, '크기:', (file.size / 1024).toFixed(2), 'KB')
      }
      reader.readAsDataURL(file)
    },

    getUploadedFileName(group) {
      if (this.deviceType === 'mobile') {
        return group.mobileImageFileName || ''
      } else {
        return group.webImageFileName || ''
      }
    },

    // ── 링크 설정 접근 (현재 deviceType 기준) ──
    getHotspotConfig(hotspot) {
      const key = this.deviceType // 'web' | 'mobile'
      if (!hotspot[key]) {
        this.$set(hotspot, key, {
          linkType: this.deviceType === 'mobile' ? 'plan' : 'plan',
          useLink: false,
          linkData: createEmptyLinkData()
        })
      }
      return hotspot[key]
    },

    onLinkTypeChange(hotspot, newType) {
      const cfg = this.getHotspotConfig(hotspot)
      cfg.linkType = newType
      cfg.linkData = createEmptyLinkData()
      cfg.useLink = false
    },

    onUseLinkChange(hotspot, checked) {
      const cfg = this.getHotspotConfig(hotspot)
      cfg.useLink = checked
    },

    updateLinkData(hotspot, field, value) {
      const cfg = this.getHotspotConfig(hotspot)
      this.$set(cfg.linkData, field, value)
    },

    // ── 미리보기 ──
    getPreview(hotspot) {
      const cfg = hotspot[this.deviceType]
      if (!cfg) return '(없음)'
      if (this.deviceType === 'web') {
        const r = buildWebAction(cfg)
        if (!r.action) return '(없음)'
        return `<${r.tag} ${r.action}${r.extra ? ' ' + r.extra : ''}>`
      } else {
        const r = buildMobileAction(cfg)
        return r.action ? `<${r.tag} ${r.action}>` : '(없음)'
      }
    },

    // ── 그룹 관리 ──
    createNewGroup() {
      return {
        id: this.generateId('hg'),
        webImageUrl: '',
        webImageAlt: '',
        webImageFileName: '',
        mobileImageUrl: '',
        mobileImageAlt: '',
        mobileImageFileName: '',
        hotspots: []
      }
    },
    openCutter(actualIdx, group) {
      this.cutterTarget = { actualIdx }
      this.cutterImageUrl = this.getImageUrl(group)
      this.cutterFileName = this.getUploadedFileName(group) || ''
      this.cutterVisible = true
    },

    closeCutter() {
      this.cutterVisible = false
      this.cutterTarget = null
      this.cutterImageUrl = ''
      this.cutterFileName = ''
    },

    onCutterConfirm(pieces) {
      const { actualIdx } = this.cutterTarget
      const srcGroup = this.localGroups[actualIdx]
      const isWeb = this.deviceType !== 'mobile'

      if (isWeb) {
        srcGroup.webImageUrl = pieces[0].url
        srcGroup.webImageFileName = `cut_1_${this.cutterFileName}`
      } else {
        srcGroup.mobileImageUrl = pieces[0].url
        srcGroup.mobileImageFileName = `cut_1_${this.cutterFileName}`
      }

      const newGroups = pieces.slice(1).map((p, i) => ({
        id: this.generateId('hg'),
        webImageUrl: isWeb ? p.url : '',
        webImageAlt: srcGroup.webImageAlt || '',
        webImageFileName: isWeb ? `cut_${i + 2}_${this.cutterFileName}` : '',
        mobileImageUrl: !isWeb ? p.url : '',
        mobileImageAlt: srcGroup.mobileImageAlt || '',
        mobileImageFileName: !isWeb ? `cut_${i + 2}_${this.cutterFileName}` : '',
        hotspots: []
      }))

      this.localGroups.splice(actualIdx + 1, 0, ...newGroups)
      this.closeCutter()
    },

    addGroup() {
      this.localGroups.push(this.createNewGroup())
      this.$nextTick(() => this.$emit('add-group'))
    },
    removeGroup(groupId) {
      if (this.localGroups.length <= 1) return
      const index = this.localGroups.findIndex(g => g.id === groupId)
      if (index !== -1) this.localGroups.splice(index, 1)
    },

    // ── 핫스팟 관리 ──
    findImageContainer(groupIndex) {
      const allContainers = document.querySelectorAll('.image-container')
      if (allContainers.length >= groupIndex) return allContainers[groupIndex - 1]
      const previewBody = document.querySelector('.preview-body')
      if (previewBody) {
        const containers = previewBody.querySelectorAll('.image-container')
        if (containers.length >= groupIndex) return containers[groupIndex - 1]
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

      const defaultLinkData = createEmptyLinkData()
      this.localGroups[groupIdx].hotspots.push({
        id: newId,
        alt: `버튼 ${this.localGroups[groupIdx].hotspots.length + 1}`,
        position: {
          left: 10 + Math.round(Math.random() * 30),
          top: Math.round(finalTop * 10) / 10,
          width: 20,
          height: 10
        },
        web: {
          linkType: 'plan',
          useLink: false,
          linkData: { ...defaultLinkData }
        },
        mobile: {
          linkType: 'plan',
          linkData: { ...defaultLinkData }
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
        if (this.selectedId === hotspotId) this.$emit('select', null)
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
        setTimeout(() => { this.flashingId = null }, 780)
      })
    }
  }
}
</script>

<style scoped>
.hotspot-group-editor {
  width: 100%;
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
  background: rgba(0, 113, 227, 0.05);
  box-shadow: 0 0 0 2px rgba(0, 113, 227, 0.1);
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
  border: 1px solid var(--color-border, #d2d2d7);
  border-radius: 3px;
  background: white;
  transition: all 0.2s;
}

.card.selectable { cursor: pointer; }

.card.selectable:hover {
  border-color: #0071e3;
  box-shadow: 0 2px 8px rgba(0, 113, 227, 0.15);
}

.card.selected {
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
  background: rgba(0, 113, 227, 0.02);
}

.card.flash-highlight {
  position: relative;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.15);
}

.card.flash-highlight::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid rgba(0, 113, 227, 0.65);
  border-radius: inherit;
  pointer-events: none;
  animation: flashRing 750ms cubic-bezier(0.22, 1, 0.36, 1) 1 forwards;
}

@keyframes flashRing {
  0%   { opacity: 1; transform: scale(1); }
  30%  { opacity: 1; transform: scale(1.03); }
  100% { opacity: 0; transform: scale(1.10); }
}

@media (prefers-reduced-motion: reduce) {
  .card.flash-highlight::after { animation: none; opacity: 0; }
}

.btn-add-group {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 2px dashed #d1d5db;
  background: transparent;
  color: #0071e3;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-group:hover {
  background: rgba(0, 113, 227, 0.05);
  border-color: #0071e3;
}

.btn-cut {
  flex-shrink: 0;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.btn-cut:hover {
  background: #fef3c7;
  border-color: #f59e0b;
  color: #b45309;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: #374151;
}

.form-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #0071e3;
}

.optional-label {
  font-weight: 400;
  color: #9ca3af;
  font-size: 11px;
}

.link-preview {
  margin: 8px 0 10px;
  padding: 8px 10px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.preview-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.preview-device-label {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  color: #0071e3;
  background: var(--color-primary-light, rgba(0, 113, 227, 0.08));
  border-radius: 3px;
  padding: 2px 6px;
  margin-top: 1px;
}

.preview-code {
  font-size: 11px;
  color: #374151;
  word-break: break-all;
  line-height: 1.5;
  font-family: 'Consolas', 'Monaco', monospace;
}

</style>