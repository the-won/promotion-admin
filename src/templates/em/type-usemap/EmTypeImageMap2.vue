<template>
  <div class="em-type-imagemap">

    <table cellspacing="0" cellpadding="0" width="708" align="center" border="0"> 
      <tbody>
        <tr>
          <td>
            <!-- 상단 -->
            <table cellspacing="0" cellpadding="0" width="100%" border="0">
              <!-- 2013-06-19 username 간격 수정 -->
              <tbody>
                <tr>
                  <td height="88" rowspan="2" width="148"><img alt="BENEPIA" src="https://newfront.benepia.co.kr/upload/xquared/b9d3364e-f386-4138-a6a4-6d61ed93422c.gif" width="148" height="88"><!-- 2022-02-15 BI변경 --></td>
                  <td height="51" align="right"></td>
                  <td height="88" rowspan="2" width="325">
                    <a :href="getUrl('detail')" target="_blank" title="상세조회">
                      <!-- 2020-05-26 이미지 경로 수정 -->
                      <img border="0" alt="의 베네피아 잔여 포인트를 지금 확인하세요!" src="https://i.benepia.co.kr/ckeditor/D9E5A1E20280.mns0115844189801720.gif" width="325" height="88">
                    </a>
                  </td>
                </tr>
                <tr>
                  <td :style="`font-size: 12px`" height="37" valign="top" align="right"><strong>%UserName%님</strong></td>
                </tr>
                <!-- // 2013-06-19 username 간격 수정 -->
              </tbody>
            </table>

            <table :style="`border:1px solid #bebebe; padding: 3px`" cellSpacing="0" cellPadding="0" width="720" border="0">
              <tr v-for="(row, rowIndex) in rows" :key="row.id">
                <td>
                  <div 
                    class="image-container"
                    :class="{ 'image-container-highlighted': activeRowId === row.id }"
                    :ref="'container_' + row.id"
                    :style="{ width: row.width + 'px', position: 'relative' }"
                    @mousedown="handleContainerClick($event, row)"
                  >
                    <img 
                      :ref="`row-${row.id}`"
                      :src="row.imageUrl" 
                      :width="row.width"
                      :height="row.height"
                      :alt="row.imageAlt"
                      align="left"
                      border="0"
                      class="preview-image"
                      :class="{ 'highlight-image': isRowActive(row.id) }"
                      @dragstart.prevent
                    />

                    <!-- 핫스팟 오버레이 - 해당 row에 속한 areas만 표시 -->
                    <div
                      v-for="area in getAreasForRow(row.id)"
                      :key="area.id"
                      class="hotspot-overlay"
                      :class="{ selected: selectedId === area.id }"
                      :style="getAreaStyle(area)"
                      @mousedown.stop="startDrag($event, area, row)"
                    >
                      <span class="hotspot-label">{{ area.alt }}</span>

                      <!-- 리사이즈 핸들 (선택된 경우에만) -->
                      <template v-if="selectedId === area.id">
                        <div class="resize-handle nw" @mousedown.stop="startResize($event, area, row, 'nw')"></div>
                        <div class="resize-handle ne" @mousedown.stop="startResize($event, area, row, 'ne')"></div>
                        <div class="resize-handle sw" @mousedown.stop="startResize($event, area, row, 'sw')"></div>
                        <div class="resize-handle se" @mousedown.stop="startResize($event, area, row, 'se')"></div>
                      </template>
                    </div>
                  </div>


                
                </td>
              </tr>
            </table>

            <!-- 푸터 -->
            <table cellspacing="0" cellpadding="0" width="728" border="0">
              <tbody>
                <tr> 
                <td :style="`height: 5px`"></td>
                </tr>
                <tr>
                <td :style="`background: #f2f2f2; padding-bottom: 18px; padding-top: 18px; padding-left: 9px; padding-right: 9px`"><table style="TEXT-ALIGN: left" cellspacing="0" cellpadding="0" width="100%" border="0">
                  <tbody>
                    <tr>
                    <td :style="`font-size: 12px; font-family: '돋움',dotum,sans-serif; color: #5b5b5b`"> · 본 메일은 {{ getFormattedDate() }} 기준 회원님의 베네피아 이메일 수신 동의 여부를 확인한 결과, 수신에 동의하였기에 발송됩니다.</td>
                    </tr> 
                    <tr>
                    <td :style="`font-size: 12px; font-family: '돋움',dotum,sans-serif; color: #5b5b5b; padding-top: 4px`"> · 베네피아 메일을 수신을 원하지 않으시면, <a :style="`color: #21a7e5; text-decoration: none`" :href="getUrl('refuse')" target="_blank" title="새창열림"><strong>[수신거부]</strong></a>를 클릭해주시기 바랍니다. (If you don`t want this of information or <br>
                      &nbsp;&nbsp;e-mail, please <a :style="`color: #21a7e5; text-decoration: none`" href="https://$:domain:$.benepia.co.kr/mail/rcvMailYn/rcvMailYn.do?encMailId=$:enc_mail_id:$&amp;encMbrId=$:enc_mbr_id:$" target="_blank" title="새창열림"> <strong>[click the Refusal]</strong></a>) </td>				  
                    </tr>
                    <tr>
                    <td :style="`font-size: 12px; font-family: '돋움',dotum,sans-serif; color: #5b5b5b; padding-top: 4px`"> · 본 메일은 발신전용으로 회신되지 않습니다. 궁금하신 사항은 <a style="color: #21a7e5; text-decoration: none" :href="getUrl('inquiry')" target="_blank" title="새창열림"><strong>[온라인문의]</strong></a>로 문의하시면 친절하게 안내해 드리겠습니다. </td>
                    </tr>
                  </tbody>
                  </table></td>
                </tr>
                <!-- 2015-02-16, add // -->
                <tr>
                <td><img border="0" alt="Copyright (C) SK M&amp;service. All rights Reserved" src="https://org-i.benepia.co.kr/ckeditor/2025/05/21/afb-19d54843e91e17478007034700.jpg" width="708" height="54"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="rows.length === 0" class="empty-preview">
      행을 추가하면 여기에 프리뷰가 표시됩니다.
    </div>
  </div>
</template>

<script>
import imageHighlightMixin from '../../../utils/imageHighlightMixin'

export default {
  name: 'EmTypeImageMap',
  mixins: [imageHighlightMixin],
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    selectedId: {
      type: [Number, String],
      default: null
    },
    activeRowId: {
      type: [Number, String],
      default: null
    },
    selectedRowInfo: {
      type: Object,
      default: () => ({ rowId: null, rowIndex: null })
    }
  },
  data() {
    return {
      dragging: false,
      resizing: false,
      resizeCorner: null,
      currentArea: null,
      currentRow: null,
      startX: 0,
      startY: 0,
      initialCoords: null,

      companyUrls: {
        normal: {
          detail: "https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://$:domain:$.benepia.co.kr/frnt/mypage/main.do?mnuTopLevel=0%26mnuLevel=0&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?domain=$:domain:$%26linkUrl=/frnt/mypage/pointInfo.bene",
          refuse: "https://$:domain:$.benepia.co.kr/mail/rcvMailYn/rcvMailYn.do?encMailId=$:enc_mail_id:$&encMbrId=$:enc_mbr_id:$",
          inquiry: "https://$:domain:$.benepia.co.kr/frnt/mypage/qnaList.do?mnuId=84&mnuTopLevel=11&mnuLevel=1&list",
          product: "https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://$:domain:$.benepia.co.kr/frnt/pointmall/pointmall.do?returnUrl=https://newmall.benepia.co.kr/disp/storeMain.bene?chnlId=%26custCoCd=$:co_cd:$%26shopId=%26prdId={}&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?domain=$:domain:$%26linkUrl=/disp/detailView.bene?prdId={}"
        },
        hynix: {
          detail: "https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://skhynix.benepia.co.kr/hynix/myPointCondition.do&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?domain=skhynix%26linkUrl=/frnt/mypage/pointUseTrMonthlyList.bene",
          refuse: "https://newfront.benepia.co.kr/mail/rcvMailYn/rcvMailYn.do?encMailId=$:enc_mail_id:$&encMbrId=$:enc_mbr_id:$",
          inquiry: "https://skhynix.benepia.co.kr/hynix/myQna.do",
          product: "https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://skhynix.benepia.co.kr/hynix/pointmall/pointmall.do?returnUrl=/disp/storeMain.bene?chnlId=BENE%26custCoCd=00C4%26shopId=%26prdId={}&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?linkUrl=/disp/detailView.bene?prdId={}"
        }
      }
    }
  },
  computed: {
    rows() {
      return this.data.imageMapRows || []
    },
    areas() {
      return this.data.imageMapAreas || []
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
  watch: {
    'selectedRowInfo.timestamp'(newVal) {
      console.log('👀 selectedRowInfo 타임스탬프 변경됨:', newVal)
      
      if (this.selectedRowInfo && this.selectedRowInfo.rowId) {
        const refKey = `row-${this.selectedRowInfo.rowId}`
        this.$nextTick(() => {
          this.scrollToImageByRef(refKey)
          this.startHighlightTimer(2000)
        })
      }
    }
  },
  methods: {
    isRowActive(rowId) {
      return this.selectedRowInfo && this.selectedRowInfo.rowId === rowId
    },
    
    handleKeydown(event) {
      // Delete 또는 Backspace 키로 선택된 핫스팟 삭제
      if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedId) {
        // input, textarea 등에서는 동작하지 않도록
        const tagName = event.target.tagName.toLowerCase()
        if (tagName === 'input' || tagName === 'textarea' || event.target.isContentEditable) {
          return
        }
        
        event.preventDefault()
        this.$emit('delete-hotspot', this.selectedId)
      }
    },
    
    // 특정 row에 속한 areas 반환
    getAreasForRow(rowId) {
      return this.areas.filter(a => a.rowId === rowId)
    },

    getAreaStyle(area) {
      const { x1, y1, x2, y2 } = area.coords
      return {
        left: x1 + 'px',
        top: y1 + 'px',
        width: (x2 - x1) + 'px',
        height: (y2 - y1) + 'px'
      }
    },

    handleContainerClick(event, row) {
      this.$emit('select-hotspot', null)
    },

    startDrag(event, area, row) {
      event.preventDefault()
      
      this.dragging = true
      this.currentArea = area
      this.currentRow = row
      this.startX = event.clientX
      this.startY = event.clientY
      this.initialCoords = { ...area.coords }

      this.$emit('select-hotspot', area.id)

      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
    },

    onDrag(event) {
      if (!this.dragging || !this.currentArea) return

      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY

      const width = this.initialCoords.x2 - this.initialCoords.x1
      const height = this.initialCoords.y2 - this.initialCoords.y1

      let newX1 = this.initialCoords.x1 + dx
      let newY1 = this.initialCoords.y1 + dy

      // 경계 제한
      newX1 = Math.max(0, Math.min(newX1, this.currentRow.width - width))
      newY1 = Math.max(0, Math.min(newY1, this.currentRow.height - height))

      this.currentArea.coords.x1 = Math.round(newX1)
      this.currentArea.coords.y1 = Math.round(newY1)
      this.currentArea.coords.x2 = Math.round(newX1 + width)
      this.currentArea.coords.y2 = Math.round(newY1 + height)

      // 'imageMapAreas'를 hotspotsKey로 전달 → 기존 App.vue 로직 활용
      this.$emit('update-hotspot', this.currentArea, 'imageMapAreas')
    },

    stopDrag() {
      this.dragging = false
      this.currentArea = null
      this.currentRow = null
      this.initialCoords = null

      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
    },

    startResize(event, area, row, corner) {
      event.preventDefault()

      this.resizing = true
      this.resizeCorner = corner
      this.currentArea = area
      this.currentRow = row
      this.startX = event.clientX
      this.startY = event.clientY
      this.initialCoords = { ...area.coords }

      document.addEventListener('mousemove', this.onResize)
      document.addEventListener('mouseup', this.stopResize)
    },

    onResize(event) {
      if (!this.resizing || !this.currentArea) return

      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY
      const minSize = 20

      let { x1, y1, x2, y2 } = this.initialCoords

      switch (this.resizeCorner) {
        case 'nw':
          x1 = Math.min(this.initialCoords.x1 + dx, x2 - minSize)
          y1 = Math.min(this.initialCoords.y1 + dy, y2 - minSize)
          break
        case 'ne':
          x2 = Math.max(this.initialCoords.x2 + dx, x1 + minSize)
          y1 = Math.min(this.initialCoords.y1 + dy, y2 - minSize)
          break
        case 'sw':
          x1 = Math.min(this.initialCoords.x1 + dx, x2 - minSize)
          y2 = Math.max(this.initialCoords.y2 + dy, y1 + minSize)
          break
        case 'se':
          x2 = Math.max(this.initialCoords.x2 + dx, x1 + minSize)
          y2 = Math.max(this.initialCoords.y2 + dy, y1 + minSize)
          break
      }

      // 경계 제한
      x1 = Math.max(0, x1)
      y1 = Math.max(0, y1)
      x2 = Math.min(this.currentRow.width, x2)
      y2 = Math.min(this.currentRow.height, y2)

      this.currentArea.coords.x1 = Math.round(x1)
      this.currentArea.coords.y1 = Math.round(y1)
      this.currentArea.coords.x2 = Math.round(x2)
      this.currentArea.coords.y2 = Math.round(y2)

      // 'imageMapAreas'를 hotspotsKey로 전달
      this.$emit('update-hotspot', this.currentArea, 'imageMapAreas')
    },

    stopResize() {
      this.resizing = false
      this.resizeCorner = null
      this.currentArea = null
      this.currentRow = null
      this.initialCoords = null

      document.removeEventListener('mousemove', this.onResize)
      document.removeEventListener('mouseup', this.stopResize)
    },

    getUrl(type) {
      const companyType = this.data.companyType || 'normal'
      return this.companyUrls[companyType][type]
    },
    getProductUrl(productId) {
      const companyType = this.data.companyType || 'normal'
      let url = this.companyUrls[companyType].product
      return url.replace(/{}/g, productId || '')
    },
    getFormattedDate() {
      if (!this.data.sendDate) return ''
      const { year, month, day } = this.data.sendDate
      return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
    }
  },

  beforeDestroy() {
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)
    document.removeEventListener('mousemove', this.onResize)
    document.removeEventListener('mouseup', this.stopResize)
  }
}
</script>

<style scoped>

.image-container {
  position: relative;
  display: inline-block;
  user-select: none;
  background: #fff;
  vertical-align: top;
  transition: all 0.3s ease;
}

.image-container-highlighted {
  outline: 4px solid #5568f8;
  outline-offset: 4px;
  box-shadow: 0 0 0 4px rgba(85, 104, 248, 0.1),
              0 8px 24px rgba(85, 104, 248, 0.2);
  background: rgba(85, 104, 248, 0.02);
  transform: scale(1.01);
  z-index: 5;
}

.image-container-highlighted::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  background: linear-gradient(135deg, 
    rgba(85, 104, 248, 0.1) 0%, 
    rgba(85, 104, 248, 0.05) 50%,
    rgba(85, 104, 248, 0.1) 100%);
  border-radius: 4px;
  pointer-events: none;
  animation: pulse-highlight 2s ease-in-out infinite;
}

@keyframes pulse-highlight {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.preview-image {
  display: block;
  pointer-events: none;
}

.hotspot-overlay {
  position: absolute;
  background: rgba(0, 123, 255, 0.25);
  border: 2px dashed #007bff;
  box-sizing: border-box;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.hotspot-overlay:hover {
  background: rgba(0, 123, 255, 0.35);
  border-color: #0056b3;
}

.hotspot-overlay.selected {
  background: rgba(0, 123, 255, 0.4);
  border-color: #0056b3;
  border-style: solid;
  border-width: 3px;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
  z-index: 10;
}

.hotspot-label {
  color: #007bff;
  font-weight: bold;
  font-size: 12px;
  text-align: center;
  pointer-events: none;
  user-select: none;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
  padding: 2px 6px;
  background: rgba(255,255,255,0.7);
  border-radius: 3px;
}

.resize-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: white;
  border: 2px solid #007bff;
  border-radius: 50%;
  z-index: 20;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.resize-handle.nw {
  top: -6px;
  left: -6px;
  cursor: nw-resize;
}

.resize-handle.ne {
  top: -6px;
  right: -6px;
  cursor: ne-resize;
}

.resize-handle.sw {
  bottom: -6px;
  left: -6px;
  cursor: sw-resize;
}

.resize-handle.se {
  bottom: -6px;
  right: -6px;
  cursor: se-resize;
}

.resize-handle:hover {
  background: #007bff;
  transform: scale(1.3);
  transition: all 0.15s;
}

.empty-preview {
  color: #999;
  text-align: center;
  padding: 60px 20px;
  font-size: 14px;
  background: #fff;
}

/* 이미지 하이라이트 */
.highlight-image {
  outline: 3px solid #6366f1;
  outline-offset: 2px;
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.5);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    outline-color: #6366f1;
    box-shadow: 0 0 12px rgba(99, 102, 241, 0.5);
  }
  50% {
    outline-color: #818cf8;
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.8);
  }
}
</style>