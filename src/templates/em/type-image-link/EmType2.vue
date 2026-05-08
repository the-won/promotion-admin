<template>
  <table cellspacing="0" cellpadding="0" width="730" align="center" border="0">
    <tbody>
      <tr>
        <td>

          <!-- header table -->
          <table cellspacing="0" cellpadding="0" width="100%" border="0">
              <tbody>
                <tr>
                  <td height="88" rowspan="2" width="148"><img :alt="headerConfig.logoAlt" :src="headerConfig.logoUrl" :width="headerConfig.logoWidth" :height="headerConfig.logoHeight"></td>
                  <td height="51" align="right"></td>
                  <td height="88" rowspan="2" width="325">
                    <a :href="headerDetailUrl" target="_blank" title="상세조회">
                      <img border="0" :alt="headerConfig.bannerAlt" :src="headerConfig.bannerUrl" :width="headerConfig.bannerWidth" :height="headerConfig.bannerHeight">
                    </a>
                  </td>
                </tr>
                <tr>
                  <td :style="`font-size: 12px`" height="37" valign="top" align="right"><strong>%UserName%님</strong></td>
                </tr>
              </tbody>
          </table>

          <!-- contents table -->
          <table :style="`border:1px solid #bebebe;`" cellspacing="0" cellpadding="0" width="720">
            <tbody>
               <tr v-for="group in data.imageLinkGroups" :key="group.id">
                  <td align="center" :style="{ paddingBottom: '3px', paddingTop: '3px', paddingLeft: '3px', paddingRight: '3px' }">
                    <div
                      class="image-group-wrapper"
                      :class="{ 'group-selected': isGroupActive(group.id) }"
                    >
                      <a
                        :href="group.href"
                        :target="group.targetBlank ? '_blank' : '_self'"
                        rel="noopener noreferrer"
                      >
                        <!-- 그룹 내의 모든 이미지 렌더링 -->
                        <img
                          v-for="image in group.images"
                          :key="image.id"
                          :ref="`image-${group.id}-${image.id}`"
                          :src="image.url"
                          :alt="image.alt"
                        />
                      </a>
                    </div>
                  </td>
                </tr>
            </tbody>
          </table>

          <!-- footer table -->
          <table cellSpacing=0 cellPadding=0 width=728 border=0>
            <tbody>
              <tr> 
              <td :style="`HEIGHT: 5px`"></td>
              </tr>
              <tr>
              <td :style="{ background: '#f2f2f2', padding: '18px 9px' }"><table style="TEXT-ALIGN: left" cellSpacing="0" cellPadding="0" width="100%" border="0">
                <tbody>
                  <tr>
                  <td :style="`font-size: 12px; font-family: '돋움',dotum,sans-serif; color: #5b5b5b`"> · 본 메일은 {{ getFormattedDate() }} 기준 회원님의 베네피아 이메일 수신 동의 여부를 확인한 결과, 수신에 동의하였기에 발송됩니다.</td>
                  </tr> 
                  <tr>
                  <td :style="`font-size: 12px; font-family: '돋움',dotum,sans-serif; color: #5b5b5b; padding-top: 4px`"> · 베네피아 메일을 수신을 원하지 않으시면, <a style="color: #21a7e5; TEXT-DECORATION: none" href="https://$:domain:$.benepia.co.kr/mail/rcvMailYn/rcvMailYn.do?encMailId=$:enc_mail_id:$&encMbrId=$:enc_mbr_id:$" target="_blank" title="새창열림"><strong>[수신거부]</strong></a>를 클릭해주시기 바랍니다. (If you don`t want this of information or <br />
                    &nbsp;&nbsp;e-mail, please <a :style="`color: #21a7e5; TEXT-DECORATION: none`" href="https://$:domain:$.benepia.co.kr/mail/rcvMailYn/rcvMailYn.do?encMailId=$:enc_mail_id:$&encMbrId=$:enc_mbr_id:$" target="_blank" title="새창열림"> <strong>[click the Refusal]</strong></a>) </td>				  
                  </tr>
                  <tr>
                  <td :style="`font-size: 12px; font-family: '돋움',dotum,sans-serif; color: #5b5b5b; padding-top: 4px`"> · 본 메일은 발신전용으로 회신되지 않습니다. 궁금하신 사항은 <a style="COLOR: #21a7e5; TEXT-DECORATION: none" href="https://$:domain:$.benepia.co.kr/frnt/mypage/qnaList.do?mnuId=84&amp;mnuTopLevel=11&amp;mnuLevel=1&amp;list" target="_blank" title="새창열림"><strong>[온라인문의]</strong></a>로 문의하시면 친절하게 안내해 드리겠습니다. </td>
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

</template>

<script>
import imageHighlightMixin from '../../../utils/imageHighlightMixin.js'
import { HEADER_CONFIGS } from '../../../config/headerConfig.js'

export default {
  mixins: [imageHighlightMixin],

  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    selectedImageInfo: {
      type: Object,
      default: () => ({ groupId: null, imageId: null })
    }
  },

  computed: {
    headerConfig() {
      return HEADER_CONFIGS[this.data.headerType || 'benepia'] || HEADER_CONFIGS.benepia
    },
    headerDetailUrl() {
      return this.headerConfig.detailUrls[this.data.companyType || 'normal'] || this.headerConfig.detailUrls.normal
    }
  },

  methods: {
    isImageActive(groupId, imageId) {
      return this.selectedImageInfo &&
             this.selectedImageInfo.groupId === groupId &&
             this.selectedImageInfo.imageId === imageId
    },

    isGroupActive(groupId) {
      return this.selectedImageInfo && this.selectedImageInfo.groupId === groupId
    },
    
    scrollToImage(groupId, imageId) {
      const refKey = `image-${groupId}-${imageId}`
      this.scrollToImageByRef(refKey)
    },
    getFormattedDate() {
      if (!this.data.sendDate) return ''
      const { year, month, day } = this.data.sendDate
      return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
    }
  },
  
  watch: {
    'selectedImageInfo.timestamp'(newVal) {
      console.log('👀 타임스탬프 변경됨:', newVal)
      
      if (this.selectedImageInfo && this.selectedImageInfo.groupId && this.selectedImageInfo.imageId) {
        // Mixin의 scrollToImageByRef 사용
        this.scrollToImage(this.selectedImageInfo.groupId, this.selectedImageInfo.imageId)
        
        // Mixin의 startHighlightTimer 사용 (2초 후 하이라이트 제거)
        this.startHighlightTimer(2000)
      }
    }
  }
}
</script>

<style scoped>
.image-group-wrapper {
  position: relative;
  display: inline-block;
}

.image-group-wrapper.group-selected {
  outline: 2px solid rgba(0, 113, 227, 0.6);
  outline-offset: 2px;
}

.image-group-wrapper.group-selected::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid rgba(0, 113, 227, 0.65);
  border-radius: 2px;
  pointer-events: none;
  animation: flashRing 750ms cubic-bezier(0.22, 1, 0.36, 1) 1 forwards;
}

@keyframes flashRing {
  0%   { opacity: 1; transform: scale(1); }
  30%  { opacity: 1; transform: scale(1.03); }
  100% { opacity: 0; transform: scale(1.10); }
}

@media (prefers-reduced-motion: reduce) {
  .image-group-wrapper.group-selected::after { animation: none; opacity: 0; }
}
</style>