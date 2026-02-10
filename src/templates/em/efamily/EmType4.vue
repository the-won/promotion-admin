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
			<!-- // 로고 -->

      <!-- contents -->
      <tr>
        <td :style="`font-size:0; vertical-align:top;`">
          <table width="770" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td colspan="5">
                <a 
                  target="_blank"
                  :href="data.headerImageHref"
                >
                  <!-- 그룹 내의 모든 이미지 렌더링 -->
                  <img 
                    :src="data.headerImage" 
                    :alt="data.headerImageAlt"
                  />
                  <!-- <img :src="data.headerImage" align="left" width="720" :alt="data.headerImageAlt" border="0"> -->
                </a>
                {{ data }}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- end : contents -->

      <tr>
				<td style="font-size:0; vertical-align:top;">
					<table width="770" border="0" cellspacing="0" cellpadding="0">
						<tr>
							<td colspan="3" height="35"></td>
						</tr>
						<tr>
							<td style="width: 65px;"></td>
							<td>
								<table width="100%" border="0" cellspacing="0" cellpadding="0" style="width: 650px; font-size:11px; margin:0;padding:0; font-family:'¸맑은고딕' 'NanumGothic', 'MalgunGothic', sans-serif; color:#222222;">
									<tbody>
										<tr>
											<td style="vertical-align:text-top; padding-top:5px;">&middot;</td>
											<td style="padding:3px; line-height:18px;">
												본 메일은 <a href="https://benepia.efamilyshop.co.kr/shop/front/member/mypage03" target="_blank"><span style="font-weight:bold; color:#ff4d16;">2025년 9월 10일</span></a> 기준 회원님의 이패밀리샵 이메일 수신 동의 여부를 확인한 결과, 수신에 동의하였기에 발송됩니다.
											</td>
										</tr>
										<tr>
											<td style="vertical-align:text-top; padding-top:5px;">&middot;</td>
											<td style="padding:3px;">이패밀리샵 메일 수신을 원하지 않으시면, <a href="https://benepia.efamilyshop.co.kr/shop/front/unsubscribe.view?c=[$etc2]" target="_blank"><span style="font-weight:bold; color:#ff4d16;">[수신거부]</span></a>해 주세요를 클릭해주시기 바랍니다.<br>(If you no longer wish to receive these e-mail, click here to <a href="https://benepia.efamilyshop.co.kr/shop/front/unsubscribe.view?c=[$etc2]" target="_blank"><span style="font-weight:bold; color:#ff4d16;">[Unsubscribe]</span></a>)</td>
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
												<a href="https://benepia.efamilyshop.co.kr/" target="_blank"><img src="https://www.efamilyshop.co.kr/storage/fud/20240528/footer_logo_20240528_20240528142617.png" border="0" alt="하단로고" /></a>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
							<td width="555"  style="background-color:#f1f1f1;">
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
import imageHighlightMixin from '../../../utils/imageHighlightMixin.js'

export default {
  props: ['data'],
  data() {
    return {
      
    }
  },
  methods: {
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
  }
}
</script>

<style scoped>

</style>