<template>
  <div class="image-link-group-editor">
    <div
      v-for="(group, groupIndex) in localGroups"
      :key="group.id"
      v-show="selectedGroupIndex === null || selectedGroupIndex === groupIndex"
      class="card mb-4"
    >
      <div class="card-header">
        <span class="card-title">링크 그룹 {{ groupIndex + 1 }}</span>
        <button @click.stop="removeGroup(group.id)" class="btn btn-danger btn-sm">그룹 삭제</button>
      </div>

      <!-- 링크 타입 선택 -->
      <div class="form-group">
        <label>링크 타입</label>
        <select 
          v-model="group.linkType" 
          @change="updateGroupUrl(group)"
          class="form-input"
          @click.stop
        >
          <option value="plan">기획전</option>
          <option value="product">상품</option>
          <option value="event">이벤트</option>
          <option value="search">검색어</option>
          <option value="custom">기타 (전체 URL)</option>
        </select>
      </div>

      <!-- 기획전 입력 -->
      <div v-if="group.linkType === 'plan'" class="link-inputs">
        <div class="form-group">
          <label>기획전 코드</label>
          <input 
            type="text" 
            v-model="group.linkData.planCode"
            @input="updateGroupUrl(group)"
            placeholder="예: 12345"
            class="form-input"
            @click.stop
          />
        </div>
      </div>

      <!-- 상품 입력 -->
      <div v-if="group.linkType === 'product'" class="link-inputs">
        <div class="form-group">
          <label>상품 코드</label>
          <input 
            type="text" 
            v-model="group.linkData.productCode"
            @input="updateGroupUrl(group)"
            placeholder="예: PRD001"
            class="form-input"
            @click.stop
          />
        </div>
      </div>

      <!-- 이벤트 입력 -->
      <div v-if="group.linkType === 'event'" class="link-inputs">
        <!-- 일반: 웹 + 모바일 코드 둘 다 -->
        <div v-if="globalVendor === 'normal'">
          <div class="form-group">
            <label>웹 이벤트 코드</label>
            <input 
              type="text" 
              v-model="group.linkData.webEventCode"
              @input="updateGroupUrl(group)"
              placeholder="웹용 코드"
              class="form-input"
              @click.stop
            />
          </div>
          <div class="form-group">
            <label>모바일 이벤트 코드</label>
            <input 
              type="text" 
              v-model="group.linkData.mobileEventCode"
              @input="updateGroupUrl(group)"
              placeholder="모바일용 코드"
              class="form-input"
              @click.stop
            />
          </div>
        </div>
        
        <!-- 하이닉스: 모바일 코드만 -->
        <div v-else>
          <div class="form-group">
            <label>모바일 이벤트 코드</label>
            <input 
              type="text" 
              v-model="group.linkData.mobileEventCode"
              @input="updateGroupUrl(group)"
              placeholder="모바일용 코드"
              class="form-input"
              @click.stop
            />
          </div>
        </div>
      </div>

      <!-- 검색어 입력 -->
      <div v-if="group.linkType === 'search'" class="link-inputs">
        <div class="form-group">
          <label>검색어</label>
          <input 
            type="text" 
            v-model="group.linkData.searchKeyword"
            @input="updateGroupUrl(group)"
            placeholder="예: 커피"
            class="form-input"
            @click.stop
          />
        </div>
      </div>

      <!-- 기타 (전체 URL) 입력 -->
      <div v-if="group.linkType === 'custom'" class="link-inputs">
        <div class="form-group">
          <label>전체 URL</label>
          <input 
            type="url" 
            v-model="group.linkData.customUrl"
            @input="updateGroupUrl(group)"
            placeholder="https://example.com"
            class="form-input"
            @click.stop
          />
        </div>
      </div>

      <!-- 생성된 URL 미리보기 -->
      <div class="form-group">
        <label>🔗 생성된 URL</label>
        <input 
          type="text" 
          :value="getDecodedUrl(group.href)"
          readonly
          class="form-input url-preview"
          @click.stop
        />
        <small class="help-text">※ 위 정보를 바탕으로 자동 생성됩니다</small>
      </div>

      <!-- 이미지 목록 -->
      <div class="images-section">
        <div class="section-header">
          <h5>이미지 목록 ({{ group.images.length }}개)</h5>
          <button @click.stop="addImage(group.id)" class="btn btn-success btn-sm">이미지 추가</button>
        </div>

        <div v-if="group.images.length === 0" class="empty-state">
          이미지를 추가하세요.
        </div>

        <div class="items-grid" :class="{ 'cols-2': sidebarExpanded }">
          <div 
            v-for="(image, imageIndex) in group.images" 
            :key="image.id"
            class="card card-nested"
            :class="{ 'card-active': activeGroupId === group.id && activeImageId === image.id }"
            @mouseenter="setActiveImage(group.id, image.id)"
            @mouseleave="setActiveImage(null, null)"
            @click="selectImage(group.id, image.id, imageIndex)"
          >
            <div class="card-header card-header-sm">
              <span class="card-title text-muted">이미지 {{ imageIndex + 1 }}</span>
              <button @click.stop="removeImage(group.id, image.id)" class="btn btn-danger btn-sm">삭제</button>
            </div>

            <div class="form-group">
              <label>이미지 URL</label>
              <div class="image-input-wrapper">
                <input
                  type="url"
                  v-model="image.url"
                  placeholder="https://cdn.example.com/image.jpg"
                  class="form-input"
                  @click.stop
                />
                <input
                  type="file"
                  :id="`upload-img-${image.id}`"
                  accept="image/*"
                  @change="handleImageUpload($event, image)"
                  class="file-input-hidden"
                />
                <label :for="`upload-img-${image.id}`" class="btn-file" @click.stop>
                  📁 파일 선택
                </label>
              </div>
              <div v-if="image._uploadedFileName" class="file-info">
                ✓ {{ image._uploadedFileName }}
              </div>
              <button
                v-if="image.url && image.url.startsWith('data:')"
                type="button"
                class="btn-cut"
                @click.stop="openCutter(group, imageIndex, image)"
              >✂ 자르기</button>
            </div>

            <div class="form-group">
              <label>대체 텍스트 (alt)</label>
              <input 
                type="text" 
                v-model="image.alt"
                placeholder="이미지 설명"
                class="form-input"
                @click.stop
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 새 그룹 추가 버튼 -->
    <div class="text-center mt-4">
      <button @click="addGroup" class="btn btn-primary btn-lg">새 링크 그룹 추가</button>
    </div>

    <image-cutter-modal
      :visible="cutterVisible"
      :image-url="cutterImageUrl"
      :file-name="cutterFileName"
      @confirm="onCutterConfirm"
      @cancel="closeCutter"
    />
  </div>
</template>

<script>
import ImageCutterModal from '../../common/ImageCutterModal.vue'

export default {
  components: { ImageCutterModal },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    sidebarExpanded: {
      type: Boolean,
      default: false
    },
    companyType: {
      type: String,
      default: 'normal'
    },
    selectedGroupIndex: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      localGroups: [],
      globalVendor: 'normal',
      activeGroupId: null,
      activeImageId: null,
      cutterVisible: false,
      cutterTarget: null,
      cutterImageUrl: '',
      cutterFileName: ''
    }
  },
  created() {
    this.localGroups = this.value && this.value.length > 0
      ? JSON.parse(JSON.stringify(this.value))
      : [this.createNewGroup()]

    // companyType props로 globalVendor 초기화
    this.globalVendor = this.companyType || 'normal'

    // 기존 그룹 초기화
    this.initializeGroups()
  },
  mounted() {
    // 탭 전환 후 재마운트 시 현재 companyType 기준으로 URL 재생성
    this.$nextTick(() => {
      this.localGroups.forEach(group => this.updateGroupUrl(group))
    })
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
    globalVendor(val) {
      this.$emit('update:companyType', val)
    },
    companyType(newVal) {
      if (newVal !== this.globalVendor) {
        this.globalVendor = newVal
        this.$nextTick(() => {
          this.localGroups.forEach(group => this.updateGroupUrl(group))
          this.$emit('input', JSON.parse(JSON.stringify(this.localGroups)))
        })
      }
    }
  },
  methods: {
    handleImageUpload(event, image) {
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
        image.url = e.target.result
        this.$set(image, '_uploadedFileName', file.name)
        console.log('이미지 업로드:', file.name, '크기:', (file.size / 1024).toFixed(2), 'KB')
      }
      reader.readAsDataURL(file)
    },

    openCutter(group, imageIndex, image) {
      this.cutterTarget = { group, imageIndex }
      this.cutterImageUrl = image.url
      this.cutterFileName = image._uploadedFileName || ''
      this.cutterVisible = true
    },

    closeCutter() {
      this.cutterVisible = false
      this.cutterTarget = null
      this.cutterImageUrl = ''
      this.cutterFileName = ''
    },

    onCutterConfirm(pieces) {
      const { group, imageIndex } = this.cutterTarget
      group.images[imageIndex].url = pieces[0].url
      const newImages = pieces.slice(1).map((p, i) => ({
        id: this.generateId(`img_cut_${i}`),
        url: p.url,
        alt: group.images[imageIndex].alt || ''
      }))
      group.images.splice(imageIndex + 1, 0, ...newImages)
      this.closeCutter()
    },

    // 고유 ID 생성 (템플릿 간 충돌 방지)
    generateId(prefix = 'id') {
      return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },
    
    createNewGroup() {
      return {
        id: this.generateId('grp'),
        
        // 링크 타입 및 데이터
        linkType: 'custom',
        linkData: {
          planCode: '',
          productCode: '',
          webEventCode: '',
          mobileEventCode: '',
          searchKeyword: '',
          customUrl: 'https://example.com'
        },
        
        href: 'https://example.com',
        images: [
          {
            id: this.generateId('img'),
            url: '',
            alt: ''
          }
        ]
      }
    },
    
    createNewImage() {
      return {
        id: this.generateId('img'),
        url: '',
        alt: ''
      }
    },
    
    // URL 생성
    generateUrl(group) {
      if (!group.linkType || !group.linkData) {
        return ''
      }

      const { linkType, linkData } = group
      const vendorType = this.globalVendor

      const templates = {
        normal: {
          plan: (code) => 
            `https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://$:domain:$.benepia.co.kr/frnt/pointmall/pointmall.do?returnUrl=/main/eventDisplay.bene?dpPlanNo=${code}&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?domain=$:domain:$%26linkUrl=/main/planDetail.bene?dpPlanNo=${code}`,
          
          product: (code) => 
            `https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://$:domain:$.benepia.co.kr/frnt/pointmall/pointmall.do?returnUrl=https://newmall.benepia.co.kr/disp/storeMain.bene?chnlId=%26custCoCd=$:co_cd:$%26shopId=%26prdId=${code}&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?domain=$:domain:$%26linkUrl=/disp/detailView.bene?prdId=${code}`,
          
          event: (webCode, mobileCode) => 
            `https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://$:domain:$.benepia.co.kr/frnt/eventzone/eventZoneView.do?evtTypCd=1%26evtNo=${webCode}&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?domain=$:domain:$%26linkUrl=/disp/eventDetailView.bene?dispAreaSeq=${mobileCode}`,
          
          search: (keyword) => 
            `https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://$:domain:$.benepia.co.kr/search/searchList.do?srchLocChck=header%26srchTxt=${keyword}&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?domain=$:domain:$%26linkUrl=/searchResult.bene?srchTxt=${keyword}`
        },
        
        hynix: {
          plan: (code) => 
            `https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://skhynix.benepia.co.kr/hynix/pointmall/pointmall.do?returnUrl=/main/eventDisplay.bene?dpPlanNo=${code}&&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?linkUrl=/main/planDetail.bene?dpPlanNo=${code}`,
          
          product: (code) => 
            `https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://skhynix.benepia.co.kr/hynix/pointmall/pointmall.do?returnUrl=/disp/storeMain.bene?chnlId=BENE%26custCoCd=00C4%26shopId=%26prdId=${code}&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?linkUrl=/disp/detailView.bene?prdId=${code}`,
          
          event: (mobileCode) => 
            `https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://skhynix.benepia.co.kr/hynix/getFrontMain.do&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?linkUrl=/disp/eventDetailView.bene?dispAreaSeq=${mobileCode}`,
          
          search: (keyword) => 
            `https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://skhynix.benepia.co.kr/hynix/getFrontMain.do&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?linkUrl=/searchResult.bene?srchTxt=${keyword}`
        }
      }

      switch(linkType) {
        case 'plan':
          if (!linkData.planCode) return ''
          return templates[vendorType].plan(linkData.planCode)
        
        case 'product':
          if (!linkData.productCode) return ''
          return templates[vendorType].product(linkData.productCode)
        
        case 'event':
          if (vendorType === 'normal') {
            if (!linkData.webEventCode || !linkData.mobileEventCode) return ''
            return templates[vendorType].event(linkData.webEventCode, linkData.mobileEventCode)
          } else {
            if (!linkData.mobileEventCode) return ''
            return templates[vendorType].event(linkData.mobileEventCode)
          }
        
        case 'search':
          if (!linkData.searchKeyword) return ''
          const keyword = encodeURIComponent(linkData.searchKeyword)
          return templates[vendorType].search(keyword)
        
        case 'custom':
          return linkData.customUrl || ''
        
        default:
          return ''
      }
    },
    
    updateGroupUrl(group) {
      const newUrl = this.generateUrl(group)
      if (newUrl !== group.href) {
        group.href = newUrl
      }
    },
    
    handleVendorChange() {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🔄 벤더 변경됨:', this.globalVendor)
      console.log('📊 전체 그룹 수:', this.localGroups.length)
      
      // 모든 그룹의 URL 재생성
      this.localGroups.forEach((group, index) => {
        console.log(`\n그룹 ${index + 1}:`)
        console.log('  - linkType:', group.linkType)
        console.log('  - 변경 전 href:', group.href)
        
        this.updateGroupUrl(group)
        
        console.log('  - 변경 후 href:', group.href)
      })
      
      // 명시적으로 부모에게 전달
      this.$emit('input', JSON.parse(JSON.stringify(this.localGroups)))
      
      console.log('\n✅ 모든 그룹 URL 업데이트 완료')
      console.log('✅ 부모 컴포넌트에 업데이트된 groups 전달 완료')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    },
    
    getDecodedUrl(url) {
      if (!url) return ''
      try {
        // URL 디코딩 (한글 등이 보이도록)
        return decodeURIComponent(url)
      } catch (e) {
        // 디코딩 실패 시 원본 반환
        return url
      }
    },
    
    initializeGroups() {
      this.localGroups.forEach(group => {
        if (!group.linkType) {
          this.$set(group, 'linkType', 'custom')
        }
        if (!group.linkData) {
          this.$set(group, 'linkData', {
            planCode: '',
            productCode: '',
            webEventCode: '',
            mobileEventCode: '',
            searchKeyword: '',
            customUrl: group.href || ''
          })
        }
      })
    },
    
    addGroup() {
      this.localGroups.push(this.createNewGroup())
    },
    
    removeGroup(groupId) {
      const index = this.localGroups.findIndex(g => g.id === groupId)
      if (index !== -1) {
        if (this.localGroups.length === 1) {
          alert('최소 1개의 그룹이 필요합니다.')
          return
        }
        this.localGroups.splice(index, 1)
      }
    },
    
    addImage(groupId) {
      const group = this.localGroups.find(g => g.id === groupId)
      if (group) {
        group.images.push(this.createNewImage())
      }
    },
    
    removeImage(groupId, imageId) {
      const group = this.localGroups.find(g => g.id === groupId)
      if (group) {
        const index = group.images.findIndex(img => img.id === imageId)
        if (index !== -1) {
          if (group.images.length === 1) {
            alert('최소 1개의 이미지가 필요합니다.')
            return
          }
          group.images.splice(index, 1)
        }
      }
    },
    
    setActiveImage(groupId, imageId) {
      this.activeGroupId = groupId
      this.activeImageId = imageId
      this.$emit('active-image-change', { groupId, imageId })
    },
    
    selectImage(groupId, imageId, imageIndex) {
      // 이미지 클릭 시 부모에 알림 (프리뷰 스크롤 이동용)
      this.$emit('select-image', { groupId, imageId, imageIndex })
    }
  }
}
</script>

<style scoped>


/* 전역 벤더 선택 영역 */
/* .global-vendor-selector {
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  margin-bottom: 20px;
}

.global-vendor-selector .form-group {
  margin-bottom: 0;
} */

.global-vendor-selector label {
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 8px;
  display: block;
}

/* .vendor-select {
  width: 100%;
  max-width: 200px;
  font-weight: 600;
  font-size: 14px;
  padding: 8px 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.vendor-select:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: #fff;
}

.vendor-select:focus {
  outline: none;
  border-color: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
} */




/* 이미지 카드 하이라이트만 적용 (그룹 카드는 제외) */
.card-nested.card-active {
  position: relative;
  background: var(--color-primary-light);
  outline: none;
  cursor: pointer;
}
.card-nested.card-active::before {
  content: '';
  position: absolute;
  inset: -2px;
  padding: 2px;
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    transparent 68%,
    rgba(125, 211, 252, 0.4) 78%,
    #0a84ff 87%,
    rgba(125, 211, 252, 0.4) 96%,
    transparent 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  /* animation: spinBorderLight 2s linear infinite; */
  pointer-events: none;
  z-index: 1;
}

/* @keyframes spinBorderLight {
  to { transform: rotate(360deg); }
} */

</style>