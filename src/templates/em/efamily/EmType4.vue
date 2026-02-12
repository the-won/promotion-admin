<template>
  <table id="__01" cellspacing="0" cellpadding="0" width="770" align="center" border="0">
    <tbody>
      <!-- 로고 -->
      <tr>
        <td style="font-size:0; vertical-align:top;">
          <a href="https://benepia.efamilyshop.co.kr/" target="_blank">
            <img src="https://www.efamilyshop.co.kr/storage/fud/20240528/top_logo_20240528_20240528142617.png" width="770" border="0" alt="e familyshop">
          </a>
        </td>
      </tr>

      <!-- 상단 이미지 -->
      <tr>
        <td style="font-size:0; vertical-align:top;">
          <a target="_blank" :href="buildHeaderUrl()">
            <img :src="data.headerImage" :alt="data.headerImageAlt" width="770" border="0" />
          </a>
        </td>
      </tr>

      <!-- 👇 각 상품 그룹 -->
      <template v-for="(group, groupIndex) in productGroups">
        <!-- 그룹 타이틀 이미지 -->
        <tr :key="`title-${group.id}`">
          <td style="font-size:0; vertical-align:top;">
            <img :src="group.titleImage.url" :alt="group.titleImage.alt" width="770" border="0" />
          </td>
        </tr>

        <!-- 상품들 (3개씩 묶인 행들) -->
        <tr :key="`products-${group.id}`">
          <td style="font-size:0; vertical-align:top;background:#e4e4e4;">
            <table cellspacing="0" cellpadding="0" width="770" border="0">
              <tbody>
                <template v-for="(row, rowIndex) in group.rows">
                  <!-- 상품 3개 행 -->
                  <tr :key="`row-${row.id}`">
                    <td style="width: 25px;"></td>
                    <td style="font-size:0;vertical-align:top;">
                      <a :href="buildProductUrl(row.products[0].productCode)" style="padding:0;">
                        <img :src="row.products[0].imageUrl" width="234" border="0" :alt="row.products[0].imageAlt" />
                      </a>
                    </td>
                    <td style="width: 9px;"></td>
                    <td style="font-size:0;vertical-align:top;">
                      <a :href="buildProductUrl(row.products[1].productCode)" style="padding:0;">
                        <img :src="row.products[1].imageUrl" width="234" border="0" :alt="row.products[1].imageAlt" />
                      </a>
                    </td>
                    <td style="width: 9px;"></td>
                    <td style="font-size:0;vertical-align:top;">
                      <a :href="buildProductUrl(row.products[2].productCode)" style="padding:0;">
                        <img :src="row.products[2].imageUrl" width="234" border="0" :alt="row.products[2].imageAlt" />
                      </a>
                    </td>
                    <td style="width: 25px;"></td>
                  </tr>

                  <!-- 👇 행 사이 11px 간격 (마지막 행 제외) -->
                  <tr v-if="rowIndex < group.rows.length - 1" :key="`spacer-${row.id}`">
                    <td colspan="7" height="11">&nbsp;</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </td>
        </tr>

        <!-- 👇 마지막 그룹 뒤에만 60px 간격 -->
        <tr v-if="groupIndex === productGroups.length - 1" :key="`group-spacer-${group.id}`">
          <td height="60" style="background:#e4e4e4;"></td>
        </tr>
      </template>

      <!-- 👇 배너들 -->
      <template v-for="(banner, bannerIndex) in banners">
        <tr :key="`banner-${banner.id}`">
          <td style="font-size:0; vertical-align:top;">
            <a :href="buildBannerUrl(banner.eventCode)" target="_blank" style="padding:0;">
              <img :src="banner.imageUrl" width="770" border="0" :alt="banner.imageAlt" />
            </a>
          </td>
        </tr>

        <!-- 👇 배너 사이: 8px, 마지막 배너 뒤: 6px -->
        <tr v-if="bannerIndex < banners.length - 1" :key="`banner-spacer-${banner.id}`">
          <td height="8" style="background:#d8d8d8;"></td>
        </tr>
        <tr v-else-if="bannerIndex === banners.length - 1" :key="`banner-last-spacer-${banner.id}`">
          <td height="6" style="background:#d8d8d8;"></td>
        </tr>
      </template>

      <!-- 푸터 -->
      <tr>
        <td style="font-size:0; vertical-align:top;">
          <table width="770" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td colspan="3" height="35"></td>
            </tr>
            <tr>
              <td style="width: 65px;"></td>
              <td>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width: 650px; font-size:11px; margin:0;padding:0; font-family:'맑은고딕' 'NanumGothic', 'MalgunGothic', sans-serif; color:#222222;">
                  <tbody>
                    <tr>
                      <td style="vertical-align:text-top; padding-top:5px;">&middot;</td>
                      <td style="padding:3px; line-height:18px;">
                        본 메일은 <a :href="`https://${globalDomain}.efamilyshop.co.kr/shop/front/member/mypage03`" target="_blank"><span style="font-weight:bold; color:#ff4d16;">{{ getFormattedDate() }}</span></a> 기준 회원님의 이패밀리샵 이메일 수신 동의 여부를 확인한 결과, 수신에 동의하였기에 발송됩니다.
                      </td>
                    </tr>
                    <tr>
                      <td style="vertical-align:text-top; padding-top:5px;">&middot;</td>
                      <td style="padding:3px;">이패밀리샵 메일 수신을 원하지 않으시면, <a :href="`https://${globalDomain}.efamilyshop.co.kr/shop/front/unsubscribe.view?c=[$etc2]`" target="_blank"><span style="font-weight:bold; color:#ff4d16;">[수신거부]</span></a>해 주세요를 클릭해주시기 바랍니다.<br>(If you no longer wish to receive these e-mail, click here to <a :href="`https://${globalDomain}.efamilyshop.co.kr/shop/front/unsubscribe.view?c=[$etc2]`" target="_blank"><span style="font-weight:bold; color:#ff4d16;">[Unsubscribe]</span></a>)</td>
                    </tr>
                    <tr>
                      <td style="vertical-align:text-top; padding-top:5px;">&middot;</td>
                      <td style="padding:3px;">본 메일은 발신전용 메일로 회신되지 않으므로 문의사항은 1800-1091 고객센터로 문의해 주시기 바랍니다.</td>
                    </tr>
                    <tr>
                      <td style="vertical-align:text-top; padding-top:5px;">&middot;</td>
                      <td style="padding:3px;">본 메일 내 상품의 가격 및 정보는 발송일 기준이므로 고객님의 오픈 시점에 따라 변경될 수 있습니다. </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td style="width: 55px;"></td>
            </tr>
            <tr>
              <td colspan="3" height="35"></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="font-size:0; vertical-align:top;">
          <table width="770" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td height="100" style="background-color:#f1f1f1;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td width="215" style="padding-left:30px; padding-right:20px;">
                        <a :href="`https://${globalDomain}.efamilyshop.co.kr/`" target="_blank"><img src="https://www.efamilyshop.co.kr/storage/fud/20240528/footer_logo_20240528_20240528142617.png" border="0" alt="하단로고" /></a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td width="555" style="background-color:#f1f1f1;">
                <img src="https://www.efamilyshop.co.kr/storage/fud/20250116/img_em_addr_20250116150819.jpg" border="0" alt="회사정보">
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    globalDomain() {
      return this.data.globalDomain || 'sema'
    },
    productGroups() {
      return this.data.productGroups || []
    },
    banners() {
      return this.data.banners || []
    }
  },
  methods: {
    buildHeaderUrl() {
      const code = this.data.headerImageCode
      if (!code) return '#'
      const domain = this.globalDomain
      return `https://${domain}.efamilyshop.co.kr/shop/event/eventDetail.view?pageNo=1&eventId=${code}`
    },
    
    buildProductUrl(productCode) {
      if (!productCode) return '#'
      const domain = this.globalDomain
      return `https://${domain}.efamilyshop.co.kr/shop/goods/goodsView.view?goodscode=${productCode}`
    },

    buildBannerUrl(eventCode) {
      if (!eventCode) return '#'
      const domain = this.globalDomain
      return `https://${domain}.efamilyshop.co.kr/shop/event/eventDetail.view?pageNo=1&eventId=${eventCode}`
    },
    getFormattedDate() {
      if (!this.data.sendDate) return ''
      const { year, month, day } = this.data.sendDate
      return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
    }
  },
  mounted() {
    console.log('EmType4 mounted')
    console.log('Global Domain:', this.globalDomain)
    console.log('Product Groups:', this.productGroups)
    console.log('Banners:', this.banners)
  }
}
</script>