<template>
  <div class="em-type5-container">
    <table cellspacing="0" cellpadding="0" width="708" align="center" border="0">
      <tbody>
        <tr>
          <td>
            <!-- 헤더 -->
            <table cellspacing="0" cellpadding="0" width="100%" border="0">
              <tbody>
                <tr>
                  <td height="88" rowspan="2" width="148">
                    <img alt="BENEPIA" src="https://newfront.benepia.co.kr/upload/xquared/b9d3364e-f386-4138-a6a4-6d61ed93422c.gif" width="148" height="88">
                  </td>
                  <td height="51" align="right"></td>
                  <td height="88" rowspan="2" width="325">
                    <a :href="getUrl('detail')" target="_blank" title="상세조회">
                      <img border="0" alt="의 베네피아 잔여 포인트를 지금 확인하세요!" src="https://i.benepia.co.kr/ckeditor/D9E5A1E20280.mns0115844189801720.gif" width="325" height="88">
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="FONT-SIZE: 12px" height="37" valign="top" align="right">
                    <strong>%UserName%님</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- 메인 컨텐츠 -->
            <table style="border:1px solid #bebebe;" cellspacing="0" cellpadding="0" width="720">
              <tbody>
                <tr>
                  <td style="PADDING: 3px" align="center">
                    <!-- 상단 이미지 -->
                    <table cellSpacing="0" cellPadding="0" width="720" border="0">
                      <tbody>
                        <tr>
                          <td>
                            <img :src="data.headerImage" align="left" width="720" :alt="data.headerImageAlt" border="0">
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- 상품 영역 -->
                    <table cellSpacing="0" cellPadding="0" width="720" border="0" style="background-color: #eeeeee;">
                      <tbody>
                        <!-- 1단 상품 -->
                        <template v-for="(product, index) in data.row1Products">
                          <tr :key="'row1-space-' + product.id + '-' + index">
                            <td :height="index === 0 ? 60 : 13"></td>
                          </tr>
                          <tr :key="'row1-product-' + product.id + '-' + index">
                            <td style="FONT-SIZE: 0px; VERTICAL-ALIGN: top">
                              <table cellSpacing="0" cellPadding="0" width="720" border="0">
                                <tbody>
                                  <tr>
                                    <td width="45"></td>
                                    <td style="FONT-SIZE: 0px; VERTICAL-ALIGN: top">
                                      <a :href="getProductUrl(product.productId)" target="_blank">
                                        <img :src="product.imageUrl" align="left" width="630" :alt="product.imageAlt" border="0">
                                      </a>
                                    </td>
                                    <td width="45"></td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </template>

                        <!-- 3단 상품 -->
                        <template v-for="(productSet, index) in data.row3Products">
                          <tr :key="'row3-space-' + productSet.id + '-' + index">
                            <td :height="index === 0 ? 43 : 30"></td>
                          </tr>
                          <tr :key="'row3-product-' + productSet.id + '-' + index">
                            <td style="FONT-SIZE: 0px; VERTICAL-ALIGN: top">
                              <table cellSpacing="0" cellPadding="0" width="720" border="0">
                                <tbody>
                                  <tr>
                                    <td width="45"></td>
                                    <td style="FONT-SIZE: 0px; VERTICAL-ALIGN: top">
                                      <a :href="getProductUrl(productSet.products[0].productId)" target="_blank">
                                        <img :src="productSet.products[0].imageUrl" align="left" width="200" :alt="productSet.products[0].imageAlt" border="0">
                                      </a>
                                    </td>
                                    <td width="15"></td>
                                    <td style="FONT-SIZE: 0px; VERTICAL-ALIGN: top">
                                      <a :href="getProductUrl(productSet.products[1].productId)" target="_blank">
                                        <img :src="productSet.products[1].imageUrl" align="left" width="200" :alt="productSet.products[1].imageAlt" border="0">
                                      </a>
                                    </td>
                                    <td width="15"></td>
                                    <td style="FONT-SIZE: 0px; VERTICAL-ALIGN: top">
                                      <a :href="getProductUrl(productSet.products[2].productId)" target="_blank">
                                        <img :src="productSet.products[2].imageUrl" align="left" width="200" :alt="productSet.products[2].imageAlt" border="0">
                                      </a>
                                    </td>
                                    <td width="45"></td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </template>

                        <tr>
                          <td height="80"></td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- 하단 안내 -->
                    <table cellSpacing="0" cellPadding="0" width="720" border="0">
                      <tbody>
                        <tr>
                          <td>
                            <img src="http://i.benepia.co.kr/ckeditor/d20-10ad76abd4f417217996045900.jpg" align="left" width="720" alt="꼭 확인하세요!" border="0">
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- 푸터 -->
            <table cellSpacing="0" cellPadding="0" width="728" border="0">
              <tbody>
                <tr>
                  <td style="HEIGHT: 5px"></td>
                </tr>
                <tr>
                  <td style="BACKGROUND: #f2f2f2; PADDING: 18px 9px">
                    <table style="TEXT-ALIGN: left" cellSpacing="0" cellPadding="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="FONT-SIZE: 12px; FONT-FAMILY: '돋움',dotum,sans-serif; COLOR: #5b5b5b">
                            · 본 메일은 {{ getFormattedDate() }} 기준 회원님의 베네피아 이메일 수신 동의 여부를 확인한 결과, 수신에 동의하였기에 발송됩니다.
                          </td>
                        </tr>
                        <tr>
                          <td style="FONT-SIZE: 12px; FONT-FAMILY: '돋움',dotum,sans-serif; COLOR: #5b5b5b; PADDING-TOP: 4px">
                            · 베네피아 메일 수신을 원하지 않으시면, <a style="COLOR: #21a7e5; TEXT-DECORATION: none" :href="getUrl('refuse')" target="_blank"><strong>[수신거부]</strong></a>를 클릭해주시기 바랍니다.
                          </td>
                        </tr>
                        <tr>
                          <td style="FONT-SIZE: 12px; FONT-FAMILY: '돋움',dotum,sans-serif; COLOR: #5b5b5b; PADDING-TOP: 4px">
                            · 본 메일은 발신전용으로 회신되지 않습니다. 궁금하신 사항은 <a style="COLOR: #21a7e5; TEXT-DECORATION: none" :href="getUrl('inquiry')" target="_blank"><strong>[온라인문의]</strong></a>로 문의하시면 친절하게 안내해 드리겠습니다.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img border="0" alt="Copyright (C) SK M&service. All rights Reserved" src="https://org-i.benepia.co.kr/ckeditor/2025/05/21/afb-19d54843e91e17478007034700.jpg" width="708" height="54">
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
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
.em-type5-container * {
  font-family: '돋움', dotum, sans-serif;
  background: #ffffff;
}
</style>