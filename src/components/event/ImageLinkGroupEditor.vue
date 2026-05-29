<template>
  <div class="event-ilg-editor">
    <!-- 각 그룹 -->
    <div
      v-for="{ group, actualIdx } in displayGroups"
      :key="group.id"
      class="image-map-editor"
    >
      <div class="card-header">
        <span class="card-title">링크그룹 {{ actualIdx + 1 }}</span>
        <button
          v-if="localGroups.length > 1"
          @click="removeGroup(group.id)"
          class="btn btn-danger btn-sm"
        >그룹 삭제</button>
      </div>

      <!-- ── 링크 설정 ── -->
      <div class="link-section">
        <div class="link-section-header">링크 설정</div>

        <!-- 링크 타입 셀렉트 (deviceType별 목록) -->
        <div class="form-group">
          <label>링크 타입</label>
          <select
            :value="getGroupConfig(group).linkType"
            @change="onLinkTypeChange(group, $event.target.value)"
            class="form-input"
            @click.stop
          >
            <option v-for="lt in currentLinkTypes" :key="lt.value" :value="lt.value">{{ lt.label }}</option>
          </select>
        </div>

        <!-- 기획전 / 상품 / 브랜드e쿠폰 / 브랜드매장결제 : 코드 단일 입력 -->
        <div v-if="['plan','product','brand_ecoupon','brand_store'].includes(getGroupConfig(group).linkType)" class="form-group">
          <label>{{ codeLabelMap[getGroupConfig(group).linkType] }}</label>
          <input
            type="text"
            :value="getGroupConfig(group).linkData.code"
            @input="updateLinkData(group, 'code', $event.target.value)"
            placeholder="코드 입력"
            class="form-input"
            @click.stop
          />
        </div>

        <!-- 기획전 / 상품 : a/button 선택 -->
        <div v-if="['plan','product'].includes(getGroupConfig(group).linkType)" class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="getGroupConfig(group).useLink"
              @change="onUseLinkChange(group, $event.target.checked)"
              class="form-checkbox"
              @click.stop
            />
            <span>a 태그 사용 (미체크 시 button)</span>
          </label>
        </div>

        <!-- 이벤트 : 웹/모바일 코드 분리 -->
        <template v-if="getGroupConfig(group).linkType === 'event'">
          <div v-if="deviceType === 'web'" class="form-group">
            <label>웹 이벤트 코드</label>
            <input
              type="text"
              :value="getGroupConfig(group).linkData.webEventCode"
              @input="updateLinkData(group, 'webEventCode', $event.target.value)"
              placeholder="웹 이벤트 코드"
              class="form-input"
              @click.stop
            />
          </div>
          <div v-if="deviceType === 'mobile'" class="form-group">
            <label>모바일 이벤트 코드</label>
            <input
              type="text"
              :value="getGroupConfig(group).linkData.mobileEventCode"
              @input="updateLinkData(group, 'mobileEventCode', $event.target.value)"
              placeholder="모바일 이벤트 코드"
              class="form-input"
              @click.stop
            />
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="getGroupConfig(group).useLink"
                @change="onUseLinkChange(group, $event.target.checked)"
                class="form-checkbox"
                @click.stop
              />
              <span>a 태그 사용 (미체크 시 button)</span>
            </label>
          </div>
        </template>

        <!-- 파트너사 : 웹/모바일 코드 분리 + returnUrl -->
        <template v-if="getGroupConfig(group).linkType === 'partner'">
          <div v-if="deviceType === 'web'" class="form-group">
            <label>웹 제휴사 코드</label>
            <input
              type="text"
              :value="getGroupConfig(group).linkData.webPartnerCode"
              @input="updateLinkData(group, 'webPartnerCode', $event.target.value)"
              placeholder="웹 제휴사 코드"
              class="form-input"
              @click.stop
            />
          </div>
          <div v-if="deviceType === 'mobile'" class="form-group">
            <label>모바일 제휴사 코드</label>
            <input
              type="text"
              :value="getGroupConfig(group).linkData.mobilePartnerCode"
              @input="updateLinkData(group, 'mobilePartnerCode', $event.target.value)"
              placeholder="모바일 제휴사 코드"
              class="form-input"
              @click.stop
            />
          </div>
          <div class="form-group">
            <label>returnUrl <span class="optional-label">(선택)</span></label>
            <input
              type="text"
              :value="getGroupConfig(group).linkData.returnUrl"
              @input="updateLinkData(group, 'returnUrl', $event.target.value)"
              placeholder="/frnt/..."
              class="form-input"
              @click.stop
            />
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="getGroupConfig(group).useLink"
                @change="onUseLinkChange(group, $event.target.checked)"
                class="form-checkbox"
                @click.stop
              />
              <span>a 태그 사용 (미체크 시 button)</span>
            </label>
          </div>
        </template>

        <!-- 외부URL / 기타 -->
        <template v-if="['external','custom'].includes(getGroupConfig(group).linkType)">
          <div class="form-group">
            <label>전체 URL</label>
            <input
              type="url"
              :value="getGroupConfig(group).linkData.url"
              @input="updateLinkData(group, 'url', $event.target.value)"
              placeholder="https://example.com"
              class="form-input"
              @click.stop
            />
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="getGroupConfig(group).useLink"
                @change="onUseLinkChange(group, $event.target.checked)"
                class="form-checkbox"
                @click.stop
              />
              <span>a 태그 사용 (미체크 시 button)</span>
            </label>
          </div>
        </template>

        <!-- 쿠폰 (모바일 전용) -->
        <template v-if="getGroupConfig(group).linkType === 'coupon'">
          <div class="form-group">
            <label>쿠폰 타입</label>
            <select
              :value="getGroupConfig(group).linkData.couponType"
              @change="updateLinkData(group, 'couponType', $event.target.value)"
              class="form-input"
              @click.stop
            >
              <option v-for="ct in couponTypes" :key="ct.value" :value="ct.value">{{ ct.label }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>
              쿠폰번호
              <span v-if="['multi','brgg_multi'].includes(getGroupConfig(group).linkData.couponType)" class="optional-label">(콤마로 구분)</span>
            </label>
            <input
              type="text"
              :value="getGroupConfig(group).linkData.couponCodes"
              @input="updateLinkData(group, 'couponCodes', $event.target.value)"
              :placeholder="['multi','brgg_multi'].includes(getGroupConfig(group).linkData.couponType) ? '코드1,코드2' : '쿠폰번호'"
              class="form-input"
              @click.stop
            />
          </div>
        </template>

        <!-- 검색어 -->
        <div v-if="getGroupConfig(group).linkType === 'search'" class="form-group">
          <label>검색어</label>
          <input
            type="text"
            :value="getGroupConfig(group).linkData.keyword"
            @input="updateLinkData(group, 'keyword', $event.target.value)"
            placeholder="예: 커피"
            class="form-input"
            @click.stop
          />
        </div>

        <!-- 링크 미리보기 (현재 디바이스) -->
        <div class="link-preview">
          <div class="preview-row">
            <span class="preview-device-label">{{ deviceType === 'mobile' ? '모바일' : '웹' }}</span>
            <code class="preview-code">{{ getPreview(group) }}</code>
          </div>
        </div>
      </div>

      <!-- ── 이미지 목록 ── -->
      <div
        :ref="`image-section-${actualIdx}`"
        class="image-url-section"
        :class="{ 'flash-highlight': flashingImageIdx === actualIdx }"
      >
        <div class="images-header">
          <span class="images-label">이미지 목록</span>
          <button type="button" class="btn btn-success btn-sm" @click.stop="addImage(actualIdx)">이미지 추가</button>
        </div>

        <div class="items-grid" :class="{ 'cols-2': sidebarExpanded }">
          <div
            v-for="(img, imgIdx) in group.images"
            :key="img.id"
            :ref="`img-entry-${actualIdx}-${imgIdx}`"
            class="img-entry"
            :class="{ 'img-entry-selected': selectedImageInfo && selectedImageInfo.imageId === img.id }"
            @click.stop="selectImageEntry(group.id, img.id, imgIdx)"
          >
            <div class="img-entry-header">
              <span class="img-entry-label">이미지 {{ imgIdx + 1 }}</span>
              <button
                v-if="group.images.length > 1"
                type="button"
                class="btn btn-danger btn-sm"
                @click.stop="removeImage(actualIdx, imgIdx)"
              >삭제</button>
            </div>

            <div class="form-group">
              <label>이미지 URL</label>
              <input
                type="url"
                v-model="img.url"
                placeholder="https://example.com/image.jpg"
                class="form-input"
                @click.stop
              />
            </div>

            <div class="form-group">
              <label>이미지 업로드</label>
              <div class="image-input-wrapper">
                <input
                  type="file"
                  :id="`upload-${actualIdx}-${imgIdx}`"
                  accept="image/*"
                  @change="handleImageUpload(actualIdx, imgIdx, $event)"
                  class="file-input-hidden"
                  @click.stop
                />
                <label :for="`upload-${actualIdx}-${imgIdx}`" class="btn-file" @click.stop>
                  📁 파일 선택
                </label>
                <span v-if="img.fileName" class="file-info">✓ {{ img.fileName }}</span>
                <button
                  v-if="img.url && img.url.startsWith('data:')"
                  type="button"
                  class="btn-cut"
                  @click.stop="openCutter(actualIdx, imgIdx, img)"
                >✂ 자르기</button>
              </div>
            </div>

            <div class="form-group">
              <label>대체텍스트 (스크린리더용)</label>
              <input
                type="text"
                v-model="img.alt"
                placeholder="이미지 설명"
                class="form-input"
                @click.stop
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 새 그룹 추가 -->
    <div class="add-group-section">
      <button @click="addGroup" class="btn btn-add-group">
        + 새 이미지링크 그룹 추가
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
import ImageCutterModal from '../common/ImageCutterModal.vue'
import {
  WEB_LINK_TYPES,
  MOBILE_LINK_TYPES,
  COUPON_TYPES,
  createEmptyLinkData,
  buildWebAction,
  buildMobileAction
} from '../../utils/hotspotLinkBuilder.js'

export default {
  name: 'EventImageLinkGroupEditor',
  components: { ImageCutterModal },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    selectedGroupIndex: {
      type: Number,
      default: null
    },
    sidebarFocusInfo: {
      type: Object,
      default: null
    },
    sidebarExpanded: {
      type: Boolean,
      default: false
    },
    deviceType: {
      type: String,
      default: 'web'
    },
    selectedImageInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      localGroups: [],
      flashingImageIdx: null,
      couponTypes: COUPON_TYPES,
      codeLabelMap: {
        plan: '기획전 코드',
        product: '상품 코드',
        brand_ecoupon: '브랜드 코드',
        brand_store: '브랜드 코드'
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
    sidebarFocusInfo: {
      handler(info) {
        if (!info || !info.refKey) return
        const key = info.refKey
        for (let i = 0; i < this.localGroups.length; i++) {
          const group = this.localGroups[i]
          if (`image-group-${group.id}` === key) {
            this.flashGroupSection(i)
            return
          }
          if (key.startsWith(`img-item-${group.id}-`)) {
            const imageId = key.slice(`img-item-${group.id}-`.length)
            const imgIdx = group.images.findIndex(img => img.id === imageId)
            if (imgIdx !== -1) this.scrollToImageEntry(i, imgIdx)
            return
          }
        }
      },
      deep: true
    },
    selectedImageInfo: {
      handler(info) {
        if (!info || !info.imageId) return
        for (let i = 0; i < this.localGroups.length; i++) {
          const imgIdx = this.localGroups[i].images.findIndex(img => img.id === info.imageId)
          if (imgIdx !== -1) {
            this.scrollToImageEntry(i, imgIdx)
            return
          }
        }
      },
      deep: true
    }
  },
  methods: {
    generateId(prefix) {
      return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    },

    getGroupConfig(group) {
      const key = this.deviceType
      if (!group[key]) {
        this.$set(group, key, {
          linkType: 'plan',
          useLink: false,
          linkData: createEmptyLinkData()
        })
      }
      return group[key]
    },

    onLinkTypeChange(group, newType) {
      const cfg = this.getGroupConfig(group)
      this.$set(cfg, 'linkType', newType)
      this.$set(cfg, 'linkData', createEmptyLinkData())
      this.$set(cfg, 'useLink', false)
    },

    onUseLinkChange(group, checked) {
      const cfg = this.getGroupConfig(group)
      this.$set(cfg, 'useLink', checked)
    },

    updateLinkData(group, field, value) {
      const cfg = this.getGroupConfig(group)
      this.$set(cfg.linkData, field, value)
    },

    getPreview(group) {
      const cfg = group[this.deviceType]
      if (!cfg) return '(없음)'
      if (this.deviceType === 'web') {
        const r = buildWebAction(cfg)
        if (!r.action) return '(없음)'
        return `<${r.tag} ${r.action}${r.extra ? ' ' + r.extra : ''}>`
      } else {
        const r = buildMobileAction(cfg)
        return r.action ? `<${r.tag} ${r.action}${r.extra ? ' ' + r.extra : ''}>` : '(없음)'
      }
    },

    flashGroupSection(idx) {
      this.$nextTick(() => {
        this.flashingImageIdx = idx
        const ref = this.$refs[`image-section-${idx}`]
        const el = Array.isArray(ref) ? ref[0] : ref
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => { this.flashingImageIdx = null }, 780)
      })
    },

    scrollToImageEntry(groupIdx, imgIdx) {
      this.$nextTick(() => {
        const ref = this.$refs[`img-entry-${groupIdx}-${imgIdx}`]
        const el = Array.isArray(ref) ? ref[0] : ref
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    },

    selectImageSection(groupId, actualIdx) {
      this.$emit('select-image', { groupId, groupIndex: actualIdx })
    },

    selectImageEntry(groupId, imageId, imgIndex) {
      this.$emit('select-image', { groupId, imageId, imgIndex })
    },

    // ── 그룹 관리 ──
    createNewGroup() {
      const ld = createEmptyLinkData()
      return {
        id: this.generateId('grp_el'),
        images: [
          { id: this.generateId('img_el'), url: '', fileName: '', alt: '' }
        ],
        web: { linkType: 'plan', useLink: false, linkData: { ...ld } },
        mobile: { linkType: 'plan', useLink: false, linkData: { ...ld } }
      }
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

    // ── 이미지 관리 ──
    addImage(actualIdx) {
      this.localGroups[actualIdx].images.push({
        id: this.generateId('img_el'),
        url: '',
        fileName: '',
        alt: ''
      })
    },

    removeImage(actualIdx, imgIdx) {
      this.localGroups[actualIdx].images.splice(imgIdx, 1)
    },

    handleImageUpload(actualIdx, imgIdx, event) {
      const file = event.target.files[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const img = this.localGroups[actualIdx].images[imgIdx]
        this.$set(img, 'url', e.target.result)
        this.$set(img, 'fileName', file.name)
      }
      reader.readAsDataURL(file)
    },

    // ── 자르기 ──
    openCutter(actualIdx, imgIdx, img) {
      this.cutterTarget = { actualIdx, imgIdx }
      this.cutterImageUrl = img.url
      this.cutterFileName = img.fileName || ''
      this.cutterVisible = true
    },

    closeCutter() {
      this.cutterVisible = false
      this.cutterTarget = null
      this.cutterImageUrl = ''
      this.cutterFileName = ''
    },

    onCutterConfirm(pieces) {
      const { actualIdx, imgIdx } = this.cutterTarget
      const images = this.localGroups[actualIdx].images

      // 첫 번째 조각은 현재 이미지를 대체
      this.$set(images[imgIdx], 'url', pieces[0].url)
      this.$set(images[imgIdx], 'fileName', `cut_1_${this.cutterFileName}`)

      // 나머지 조각은 뒤에 삽입
      const newImages = pieces.slice(1).map((p, i) => ({
        id: this.generateId('img_el'),
        url: p.url,
        fileName: `cut_${i + 2}_${this.cutterFileName}`,
        alt: images[imgIdx].alt || ''
      }))
      images.splice(imgIdx + 1, 0, ...newImages)

      this.closeCutter()
    }
  }
}
</script>

<style scoped>
.event-ilg-editor {
  width: 100%;
}

.image-map-editor {
  margin-bottom: 16px;
  border: 1px solid var(--color-border, #d2d2d7);
  border-radius: 6px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--color-bg-secondary, #f5f6fa);
  border-bottom: 1px solid var(--color-border, #d2d2d7);
}

.card-title {
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
}

/* ── 이미지 그리드 ── */
.items-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.items-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

/* ── 이미지 섹션 ── */
.image-url-section {
  padding: 12px;
  border-bottom: 1px solid var(--color-border, #d2d2d7);
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  border-radius: 0;
}

.image-url-section:hover {
  background: rgba(0, 113, 227, 0.04);
  box-shadow: inset 0 0 0 2px rgba(0, 113, 227, 0.1);
}

.image-url-section.flash-highlight {
  position: relative;
  background: rgba(0, 113, 227, 0.06);
  box-shadow: inset 0 0 0 2px rgba(0, 113, 227, 0.4);
}

.image-url-section.flash-highlight::after {
  content: '';
  position: absolute;
  inset: -2px;
  border: 2px solid rgba(0, 113, 227, 0.65);
  border-radius: 4px;
  pointer-events: none;
  animation: flashRing 750ms cubic-bezier(0.22, 1, 0.36, 1) 1 forwards;
}

@keyframes flashRing {
  0%   { opacity: 1; transform: scale(1); }
  30%  { opacity: 1; transform: scale(1.02); }
  100% { opacity: 0; transform: scale(1.06); }
}

@media (prefers-reduced-motion: reduce) {
  .image-url-section.flash-highlight::after { animation: none; opacity: 0; }
  .img-entry-selected::after { animation: none; opacity: 0; }
}

.images-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.images-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-tertiary, #888);
}

.img-entry {
  padding: 10px;
  margin-bottom: 8px;
  background: var(--color-bg, #fff);
  border: 1px solid var(--color-border, #e8e8ed);
  border-radius: 5px;
}

.img-entry:last-child { margin-bottom: 0; }

.img-entry {
  position: relative;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
}

.img-entry-selected {
  background: rgba(0, 113, 227, 0.06);
  box-shadow: inset 0 0 0 2px rgba(0, 113, 227, 0.4);
}

.img-entry-selected::after {
  content: '';
  position: absolute;
  inset: -2px;
  border: 2px solid rgba(0, 113, 227, 0.65);
  border-radius: 4px;
  pointer-events: none;
  animation: flashRing 750ms cubic-bezier(0.22, 1, 0.36, 1) 1 forwards;
}

.img-entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.img-entry-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary, #6e6e73);
}

/* ── 링크 섹션 ── */
.link-section {
  padding: 12px;
}

.link-section-header {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-tertiary, #888);
  margin-bottom: 10px;
}

/* 버튼 공통 */
/* .btn {
  padding: 7px 14px;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-success { background: #10b981; color: #fff; }
.btn-success:hover { background: #059669; }
.btn-danger  { background: #ef4444; color: #fff; }
.btn-danger:hover  { background: #dc2626; }
.btn-sm { padding: 3px 9px; font-size: 11px; } */



.add-group-section {
  margin-top: 8px;
}

/* 파일 업로드 */
.file-input-hidden {
  display: none;
}

.image-input-wrapper {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}

.btn-file {
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;
  background: var(--color-primary, #0071e3);
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  user-select: none;
}

.btn-file:hover { background: #005bb5; }

.file-info {
  padding: 4px 8px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 4px;
  color: #16a34a;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
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

/* 링크 미리보기 */
.link-preview {
  margin-top: 10px;
  padding: 8px 10px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.preview-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.preview-device-label {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  color: #0071e3;
  background: rgba(0, 113, 227, 0.08);
  border-radius: 3px;
  padding: 2px 6px;
  margin-top: 1px;
}

.preview-code {
  font-size: 10px;
  color: #374151;
  word-break: break-all;
  line-height: 1.5;
  font-family: 'Consolas', 'Monaco', monospace;
}

.optional-label {
  font-weight: 400;
  color: #9ca3af;
  font-size: 11px;
}
</style>
