<template>
  <div class="image-link-group-editor">
    <!-- 🆕 전역 벤더 선택 (상단) -->
    <div class="global-vendor-selector">
      <div class="form-group">
        <label>🏢 벤더 타입 (전체 그룹 적용)</label>
        <select 
          v-model="globalVendor" 
          @change="handleVendorChange"
          class="form-input vendor-select"
        >
          <option value="normal">일반</option>
          <option value="hynix">하이닉스</option>
        </select>
      </div>
    </div>

    <!-- 구분선 -->
    <hr class="vendor-divider" />

    <div 
      v-for="(group, groupIndex) in localGroups" 
      :key="group.id"
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
          :value="group.href"
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
          >
            <div class="card-header card-header-sm">
              <span class="card-title text-muted">이미지 {{ imageIndex + 1 }}</span>
              <button @click.stop="removeImage(group.id, image.id)" class="btn btn-danger btn-sm">삭제</button>
            </div>

            <div class="form-group">
              <label>이미지 URL</label>
              <input 
                type="url" 
                v-model="image.url"
                placeholder="https://cdn.example.com/image.jpg"
                class="form-input"
                @click.stop
              />
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
  </div>
</template>

<script>
export default {
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
    }
  },
  data() {
    return {
      localGroups: [],
      globalVendor: 'normal'
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
      }
    }
  },
  methods: {
    createNewGroup() {
      return {
        id: Date.now(),
        
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
            id: Date.now() + 1,
            url: '',
            alt: ''
          }
        ]
      }
    },
    
    createNewImage() {
      return {
        id: Date.now(),
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
    }
  }
}
</script>

<style scoped>
.image-link-group-editor {
  margin-top: 16px;
}

.images-section {
  margin-top: 16px;
  padding: 14px;
  background: var(--color-bg-secondary, #f5f6fa);
  border-radius: var(--form-radius, 8px);
}

.card-nested {
  background: var(--color-bg, #fff);
}

.card-header-sm {
  margin-bottom: 10px;
  padding-bottom: 8px;
}

.card-header-sm .card-title {
  font-size: 11px;
}

/* 전역 벤더 선택 영역 */
.global-vendor-selector {
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  margin-bottom: 20px;
}

.global-vendor-selector .form-group {
  margin-bottom: 0;
}

.global-vendor-selector label {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
}

.vendor-select {
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
}

.vendor-divider {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 20px 0;
}

/* 링크 입력 영역 */
.link-inputs {
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 12px;
}

.link-inputs .form-group {
  margin-bottom: 8px;
}

.link-inputs .form-group:last-child {
  margin-bottom: 0;
}

/* URL 미리보기 */
.url-preview {
  background: #f3f4f6 !important;
  color: #6b7280;
  font-size: 11px;
  font-family: monospace;
  cursor: text;
}

.url-preview:focus {
  background: #fff !important;
  color: #111827;
}

.help-text {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: #6b7280;
}
</style>