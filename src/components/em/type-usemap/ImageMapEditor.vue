<template>
  <div class="image-map-editor">
    <!-- 🆕 전역 벤더 선택 (상단) -->
    <div class="global-vendor-selector">
      <div class="form-group">
        <label>🏢 벤더 타입 (전체 핫스팟 적용)</label>
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

    <!-- 행(Row) 목록 -->
    <div 
      v-for="(row, rowIndex) in localRows" 
      :key="row.id"
      :ref="`row-${row.id}`"
      class="card mb-4"
      :class="{ 'card-active': activeRowId === row.id }"
      @mouseenter="setActiveRow(row.id)"
      @mouseleave="setActiveRow(null)"
      @click="selectRow(row.id, rowIndex)"
    >
      <div class="card-header">
        <span class="card-title">행 {{ rowIndex + 1 }}</span>
        <button @click.stop="removeRow(row.id)" class="btn btn-danger btn-sm">행 삭제</button>
      </div>

      <!-- 이미지 설정 -->
      <div class="image-settings">
        <div class="form-group">
          <label>이미지 URL</label>
          <input 
            type="url" 
            v-model="row.imageUrl"
            placeholder="http://example.com/image.jpg"
            class="form-input"
          />
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>너비 (px)</label>
            <input 
              type="number" 
              v-model.number="row.width"
              class="form-input"
            />
          </div>
          <div class="form-group half">
            <label>높이 (px)</label>
            <input 
              type="number" 
              v-model.number="row.height"
              class="form-input"
            />
          </div>
        </div>
        
        <!-- 자동 입력 성공 메시지 -->
        <div v-if="row._autoFilled" class="auto-fill-message">
          ✓ {{ row.width }} × {{ row.height }} 자동 입력됨
        </div>

        <div class="form-group">
          <label>이미지 Alt</label>
          <input 
            type="text" 
            v-model="row.imageAlt"
            placeholder="이미지 설명"
            class="form-input"
          />
        </div>
      </div>

      <!-- 핫스팟(Area) 목록 -->
      <div class="hotspots-section">
        <div class="section-header">
          <h5>핫스팟 목록 ({{ getAreasForRow(row.id).length }}개)</h5>
          <button @click="addArea(row.id)" class="btn btn-success btn-sm">핫스팟 추가</button>
        </div>

        <div v-if="getAreasForRow(row.id).length === 0" class="empty-state">
          핫스팟을 추가하면 프리뷰에서 드래그로 위치/크기를 조정할 수 있습니다.
        </div>

        <div class="items-grid" :class="{ 'cols-2': sidebarExpanded }">
          <div 
            v-for="(area, areaIndex) in getAreasForRow(row.id)" 
            :key="area.id"
            :ref="'area-card-' + area.id"
            class="card selectable card-nested"
            :class="{ 
              'selected': selectedAreaId === area.id,
              'flash-highlight': flashingAreaId === area.id
            }"
            @click="selectArea(area.id)"
          >
            <div class="card-header card-header-sm">
              <span class="card-title">핫스팟 {{ areaIndex + 1 }}</span>
              <button @click.stop="removeArea(area.id)" class="btn btn-danger btn-sm">삭제</button>
            </div>

            <div class="form-group">
              <label>링크 타입</label>
              <select 
                v-model="area.linkType" 
                @change="updateAreaUrl(area)"
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
            <div v-if="area.linkType === 'plan'" class="link-inputs">
              <div class="form-group">
                <label>기획전 코드</label>
                <input 
                  type="text" 
                  v-model="area.linkData.planCode"
                  @input="updateAreaUrl(area)"
                  placeholder="예: 12345"
                  class="form-input"
                  @click.stop
                />
              </div>
            </div>

            <!-- 상품 입력 -->
            <div v-if="area.linkType === 'product'" class="link-inputs">
              <div class="form-group">
                <label>상품 코드</label>
                <input 
                  type="text" 
                  v-model="area.linkData.productCode"
                  @input="updateAreaUrl(area)"
                  placeholder="예: PRD001"
                  class="form-input"
                  @click.stop
                />
              </div>
            </div>

            <!-- 이벤트 입력 -->
            <div v-if="area.linkType === 'event'" class="link-inputs">
              <!-- 일반: 웹 + 모바일 코드 둘 다 -->
              <div v-if="globalVendor === 'normal'">
                <div class="form-group">
                  <label>웹 이벤트 코드</label>
                  <input 
                    type="text" 
                    v-model="area.linkData.webEventCode"
                    @input="updateAreaUrl(area)"
                    placeholder="웹용 코드"
                    class="form-input"
                    @click.stop
                  />
                </div>
                <div class="form-group">
                  <label>모바일 이벤트 코드</label>
                  <input 
                    type="text" 
                    v-model="area.linkData.mobileEventCode"
                    @input="updateAreaUrl(area)"
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
                    v-model="area.linkData.mobileEventCode"
                    @input="updateAreaUrl(area)"
                    placeholder="모바일용 코드"
                    class="form-input"
                    @click.stop
                  />
                </div>
              </div>
            </div>

            <!-- 검색어 입력 -->
            <div v-if="area.linkType === 'search'" class="link-inputs">
              <div class="form-group">
                <label>검색어</label>
                <input 
                  type="text" 
                  v-model="area.linkData.searchKeyword"
                  @input="updateAreaUrl(area)"
                  placeholder="예: 커피"
                  class="form-input"
                  @click.stop
                />
              </div>
            </div>

            <!-- 기타 (전체 URL) 입력 -->
            <div v-if="area.linkType === 'custom'" class="link-inputs">
              <div class="form-group">
                <label>전체 URL</label>
                <input 
                  type="url" 
                  v-model="area.linkData.customUrl"
                  @input="updateAreaUrl(area)"
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
                :value="getDecodedUrl(area.href)"
                readonly
                class="form-input url-preview"
                @click.stop
              />
              <small class="help-text">※ 위 정보를 바탕으로 자동 생성됩니다</small>
            </div>

            <div class="form-group">
              <label>대체 텍스트 (alt)</label>
              <input 
                type="text" 
                v-model="area.alt"
                placeholder="버튼 설명"
                class="form-input"
                @click.stop
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 행 추가 버튼 -->
    <div class="text-center mt-4">
      <button @click="addRow" class="btn btn-primary btn-lg">새 행 추가</button>
    </div>
  </div>
</template>

<script>
import imageHighlightMixin from '../../../utils/imageHighlightMixin.js' 

export default {
  name: 'ImageMapEditor',
  mixins: [imageHighlightMixin],
  props: {
    rows: {
      type: Array,
      default: () => []
    },
    areas: {
      type: Array,
      default: () => []
    },
    selectedAreaId: {
      type: [Number, String],
      default: null
    },
    selectedRowInfo: {
      type: Object,
      default: () => ({ rowId: null, rowIndex: null })
    },
    visibleScrollPosition: {
      type: Object,
      default: () => ({ scrollTop: 0, viewportHeight: 400 })
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
      localRows: [],
      localAreas: [],
      activeRowId: null,
      rowWatchers: [],
      globalVendor: 'normal',
      flashingAreaId: null
    }
  },
  created() {
    this.localRows = this.rows ? JSON.parse(JSON.stringify(this.rows)) : []
    this.localAreas = this.areas ? JSON.parse(JSON.stringify(this.areas)) : []
    
    // companyType props로 globalVendor 초기화
    this.globalVendor = this.companyType || 'normal'
  },
  mounted() {
    // 각 row의 imageUrl 변경 감지
    this.setupImageUrlWatchers()
    
    // 기존 areas 초기화 및 watcher 설정
    this.initializeAreas()
  },
  beforeDestroy() {
    // 모든 watcher 해제
    this.rowWatchers.forEach(unwatch => unwatch())
    this.rowWatchers = []
  },
  watch: {
    rows: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localRows)) {
          this.localRows = newVal ? JSON.parse(JSON.stringify(newVal)) : []
        }
      },
      deep: true
    },
    areas: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localAreas)) {
          this.localAreas = newVal ? JSON.parse(JSON.stringify(newVal)) : []
        }
      },
      deep: true
    },
    localRows: {
      handler(val) {
        // 기존 로직: 부모로 전달
        if (JSON.stringify(val) !== JSON.stringify(this.rows)) {
          this.$emit('update:rows', JSON.parse(JSON.stringify(val)))
        }
      },
      deep: true
    },
    localAreas: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.areas)) {
          this.$emit('update:areas', JSON.parse(JSON.stringify(val)))
        }
      },
      deep: true
    },
    globalVendor(val) {
      // 전역 벤더 변경 시 부모에 전달
      this.$emit('update:vendor', val)
      // companyType도 함께 업데이트
      this.$emit('update:companyType', val)
    },
    'selectedRowInfo.timestamp'(newVal) {
      console.log('👀 selectedRowInfo 타임스탬프 변경됨:', newVal)
      
      if (this.selectedRowInfo && this.selectedRowInfo.rowId) {
        // 행 ID로 스크롤 (Mixin의 scrollToImageByRef 사용)
        const refKey = `row-${this.selectedRowInfo.rowId}`
        this.$nextTick(() => {
          this.scrollToImageByRef(refKey)
          // 2초 후 하이라이트 제거
          this.startHighlightTimer(2000)
        })
      }
    },
    companyType(newVal) {
      // 부모의 companyType이 변경되면 globalVendor도 동기화
      if (newVal !== this.globalVendor) {
        this.globalVendor = newVal
      }
    },
    // 프리뷰에서 핫스팟 클릭 → 사이드바 카드 스크롤 + 하이라이트
    selectedAreaId(newId) {
      if (newId != null) {
        this.scrollToAreaCard(newId)
      }
    }
  },
  methods: {
    // URL 템플릿
    generateUrl(area) {
      console.log('generateUrl 호출:', area)
      
      if (!area.linkType || !area.linkData) {
        console.log('linkType 또는 linkData 없음')
        return ''
      }

      const { linkType, linkData } = area
      const vendorType = this.globalVendor  // 전역 벤더 사용
      
      console.log('linkType:', linkType, 'linkData:', linkData, 'vendor:', vendorType)

      // 벤더별 URL 템플릿
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
          if (!linkData.planCode) {
            console.log('planCode 없음')
            return ''
          }
          const planUrl = templates[vendorType].plan(linkData.planCode)
          console.log('생성된 기획전 URL:', planUrl)
          return planUrl
        
        case 'product':
          if (!linkData.productCode) {
            console.log('productCode 없음')
            return ''
          }
          const productUrl = templates[vendorType].product(linkData.productCode)
          console.log('생성된 상품 URL:', productUrl)
          return productUrl
        
        case 'event':
          // 일반: 웹 + 모바일 코드 둘 다 필요
          // 하이닉스: 모바일 코드만 필요
          if (vendorType === 'normal') {
            if (!linkData.webEventCode || !linkData.mobileEventCode) {
              console.log('webEventCode 또는 mobileEventCode 없음')
              return ''
            }
            const eventUrl = templates[vendorType].event(linkData.webEventCode, linkData.mobileEventCode)
            console.log('생성된 이벤트 URL (일반):', eventUrl)
            return eventUrl
          } else {
            // 하이닉스는 모바일 코드만
            if (!linkData.mobileEventCode) {
              console.log('mobileEventCode 없음')
              return ''
            }
            const eventUrl = templates[vendorType].event(linkData.mobileEventCode)
            console.log('생성된 이벤트 URL (하이닉스):', eventUrl)
            return eventUrl
          }
        
        case 'search':
          if (!linkData.searchKeyword) {
            console.log('searchKeyword 없음')
            return ''
          }
          const keyword = encodeURIComponent(linkData.searchKeyword)
          const searchUrl = templates[vendorType].search(keyword)
          console.log('생성된 검색 URL:', searchUrl)
          return searchUrl
        
        case 'custom':
          console.log('기타 URL:', linkData.customUrl)
          return linkData.customUrl || ''
        
        default:
          console.log('알 수 없는 linkType:', linkType)
          return ''
      }
    },
    
    updateAreaUrl(area) {
      console.log('updateAreaUrl 호출:', area)
      const newUrl = this.generateUrl(area)
      console.log('생성된 새 URL:', newUrl)
      if (newUrl !== area.href) {
        area.href = newUrl
        console.log('area.href 업데이트 완료')
      }
    },
    
    handleVendorChange() {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🔄 벤더 변경됨:', this.globalVendor)
      console.log('📊 전체 핫스팟 수:', this.localAreas.length)
      
      // 모든 핫스팟의 URL 재생성
      this.localAreas.forEach((area, index) => {
        console.log(`\n핫스팟 ${index + 1}:`)
        console.log('  - linkType:', area.linkType)
        console.log('  - 변경 전 href:', area.href)
        
        this.updateAreaUrl(area)
        
        console.log('  - 변경 후 href:', area.href)
      })
      
      // 🆕 명시적으로 부모에게 업데이트된 areas 전달
      this.$emit('update:areas', JSON.parse(JSON.stringify(this.localAreas)))
      
      console.log('\n✅ 모든 핫스팟 URL 업데이트 완료')
      console.log('✅ 부모 컴포넌트에 업데이트된 areas 전달 완료')
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
    
    initializeAreas() {
      // 기존 area에 linkType이 없으면 초기화
      this.localAreas.forEach(area => {
        if (!area.linkType) {
          this.$set(area, 'linkType', 'custom')
        }
        if (!area.linkData) {
          this.$set(area, 'linkData', {
            planCode: '',
            productCode: '',
            webEventCode: '',
            mobileEventCode: '',
            searchKeyword: '',
            customUrl: area.href || ''
          })
        }
      })
    },
    
    setupImageUrlWatchers() {
      // 기존 watchers 모두 해제
      this.rowWatchers.forEach(unwatch => unwatch())
      this.rowWatchers = []
      
      // 각 row의 imageUrl을 감시
      this.localRows.forEach((row, index) => {
        const unwatch = this.$watch(
          () => {
            // 안전하게 체크
            if (this.localRows[index]) {
              return this.localRows[index].imageUrl
            }
            return null
          },
          (newUrl, oldUrl) => {
            // row가 여전히 존재하는지 확인
            if (newUrl && newUrl !== oldUrl && this.localRows[index]) {
              console.log('이미지 URL 변경 감지:', newUrl)
              this.updateImageSize(this.localRows[index], newUrl)
            }
          }
        )
        
        // unwatch 함수 저장
        this.rowWatchers.push(unwatch)
      })
    },
    
    setActiveRow(rowId) {
      this.activeRowId = rowId
      this.$emit('active-row-change', rowId)
    },
    
    selectRow(rowId, rowIndex) {
      console.log('🖼️ 행 선택됨:', { rowId, rowIndex })
      this.$emit('select-row', { rowId, rowIndex })
    },
    
    updateImageSize(row, url) {
      console.log('updateImageSize 호출됨:', url)
      
      // 이전 타이머 취소 (디바운스)
      if (row._timer) {
        clearTimeout(row._timer)
      }
      
      // 500ms 후 실행
      row._timer = setTimeout(() => {
        console.log('이미지 로드 시작:', url)
        const img = new Image()
        
        img.onload = () => {
          console.log('이미지 로드 성공:', img.naturalWidth, 'x', img.naturalHeight)
          // 크기 업데이트
          row.width = img.naturalWidth
          row.height = img.naturalHeight
          
          // 성공 메시지 3초간 표시
          this.$set(row, '_autoFilled', true)
          setTimeout(() => {
            this.$set(row, '_autoFilled', false)
          }, 3000)
        }
        
        img.onerror = () => {
          // 에러는 조용히 무시
          console.log('이미지 로드 실패:', url)
        }
        
        img.src = url
      }, 500)
    },
    
    handleFileSelect(event, row) {
      const file = event.target.files[0]
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          // Base64 데이터 URL로 변환하여 이미지 URL로 사용
          row.imageUrl = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    
    getAreasForRow(rowId) {
      return this.localAreas.filter(a => a.rowId === rowId)
    },

    addRow() {
      const newId = Date.now()
      const mapName = `mapContents${String(newId).slice(-4)}`
      
      const newRow = {
        id: newId,
        imageUrl: 'https://via.placeholder.com/720x400',
        width: 720,
        height: 400,
        imageAlt: '새 이미지',
        mapName: mapName
      }
      
      this.localRows.push(newRow)
      this.activeRowId = newId
      
      // watcher 재설정 (새 row 포함)
      this.$nextTick(() => {
        this.setupImageUrlWatchers()
      })
    },

    removeRow(rowId) {
      const index = this.localRows.findIndex(r => r.id === rowId)
      if (index !== -1) {
        this.localRows.splice(index, 1)
        this.localAreas = this.localAreas.filter(a => a.rowId !== rowId)
        
        if (this.activeRowId === rowId) {
          this.activeRowId = this.localRows.length > 0 ? this.localRows[0].id : null
        }
        
        // watcher 재설정 (삭제된 row의 watcher 제거)
        this.$nextTick(() => {
          this.setupImageUrlWatchers()
        })
      }
    },

    addArea(rowId) {
      const row = this.localRows.find(r => r.id === rowId)
      if (!row) return

      const areasInRow = this.getAreasForRow(rowId)
      const newId = Date.now()
      
      const rowPositions = this.visibleScrollPosition?.imageMapRowPositions || {}
      const baseY = rowPositions[rowId] || 50
      
      const offsetX = (areasInRow.length % 3) * 150
      const offsetY = (areasInRow.length % 2) * 100

      const newArea = {
        id: newId,
        rowId: rowId,
        
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
        alt: `버튼 ${areasInRow.length + 1}`,
        coords: {
          x1: 60 + offsetX,
          y1: Math.max(20, baseY + offsetY),
          x2: 200 + offsetX,
          y2: Math.max(100, baseY + 80 + offsetY)
        }
      }

      this.localAreas.push(newArea)
      
      this.$emit('select-area', newId)
    },

    removeArea(areaId) {
      const index = this.localAreas.findIndex(a => a.id === areaId)
      if (index !== -1) {
        this.localAreas.splice(index, 1)
        if (this.selectedAreaId === areaId) {
          this.$emit('select-area', null)
        }
      }
    },

    selectArea(areaId) {
      this.$emit('select-area', areaId)
    },

    scrollToAreaCard(areaId) {
      this.$nextTick(() => {
        const refKey = 'area-card-' + areaId
        const cardEl = this.$refs[refKey]
        if (!cardEl) return
        const el = Array.isArray(cardEl) ? cardEl[0] : cardEl
        if (!el) return

        el.scrollIntoView({ behavior: 'smooth', block: 'center' })

        this.flashingAreaId = areaId
        setTimeout(() => { this.flashingAreaId = null }, 1500)
      })
    }
  }
}
</script>

<style scoped>
.image-map-editor {
  padding: 16px;
  background: var(--color-bg-secondary, #f5f6fa);
  border-radius: var(--card-radius, 10px);
}

.image-settings {
  background: var(--color-bg-tertiary, #eceef2);
  padding: 14px;
  border-radius: var(--form-radius, 8px);
  margin-bottom: 16px;
}

.hotspots-section {
  margin-top: 16px;
}

.card-active {
  border-color: var(--color-primary, #5568f8);
  box-shadow: 0 0 0 3px rgba(85, 104, 248, 0.1);
}

.card-nested {
  background: var(--color-bg, #fff);
}

/* 프리뷰에서 클릭 시 깜빡임 효과 */
.card-nested.flash-highlight {
  animation: flashPulse 0.5s ease-in-out 3;
}

@keyframes flashPulse {
  0%, 100% {
    border-color: var(--color-primary, #5568f8);
    box-shadow: 0 0 0 3px rgba(85, 104, 248, 0.1);
  }
  50% {
    border-color: #f59e0b;
    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.3);
    background: rgba(245, 158, 11, 0.08);
  }
}

.card-header-sm {
  margin-bottom: 10px;
  padding-bottom: 8px;
}

.image-input-wrapper {
  display: flex;
  gap: 6px;
  align-items: stretch;
}

.image-input-wrapper .form-input {
  flex: 1;
}

.btn-file {
  padding: 6px 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
}

.btn-file:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
}

.btn-file:active {
  transform: translateY(0);
}

.file-info {
  margin-top: 6px;
  padding: 6px 10px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 4px;
  color: #16a34a;
  font-size: 11px;
  font-weight: 500;
}

.auto-fill-message {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 6px;
  color: #16a34a;
  font-size: 12px;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
</style>