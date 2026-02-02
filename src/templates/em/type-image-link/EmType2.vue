<template>
  <table cellspacing="0" cellpadding="0" width="730" align="center" border="0">
    <tbody>
      <tr>
        <td>

          <!-- header table -->
          <table cellspacing="0" cellpadding="0" width="100%" border="0">
              <!-- 2013-06-19 username 간격 수정 -->
              <tbody>
                <tr>
                  <td height="88" rowspan="2" width="148"><img alt="BENEPIA" src="https://newfront.benepia.co.kr/upload/xquared/b9d3364e-f386-4138-a6a4-6d61ed93422c.gif" width="148" height="88"><!-- 2022-02-15 BI변경 --></td>
                  <td height="51" align="right"></td>
                  <td height="88" rowspan="2" width="325">
                    <a href="https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://$:domain:$.benepia.co.kr/frnt/mypage/main.do?mnuTopLevel=0%26mnuLevel=0&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?domain=$:domain:$%26linkUrl=/frnt/mypage/pointInfo.bene"  target="_blank" title="상세조회">
                      <!-- 2020-05-26 이미지 경로 수정 -->
                      <img border="0" alt="의 베네피아 잔여 포인트를 지금 확인하세요!" src="https://i.benepia.co.kr/ckeditor/D9E5A1E20280.mns0115844189801720.gif" width="325" height="88">
                    </a>
                  </td>
                </tr>
                <tr> 
            <td style="FONT-SIZE: 12px" height="37" valign="top" align="right"><strong>%UserName%님</strong></td>
                </tr>
                <!-- // 2013-06-19 username 간격 수정 -->
              </tbody>
          </table>

          <!-- contents table -->
          <table style="border:1px solid #bebebe;" cellspacing="0" cellpadding="0" width="720">
            <tbody>
               <tr v-for="group in data.imageLinkGroups" :key="group.id">
                  <td align="center" :style="{ paddingBottom: '3px', paddingTop: '3px', paddingLeft: '3px', paddingRight: '3px' }">
                    <a 
                      :href="group.href" 
                      :target="group.targetBlank ? '_blank' : '_self'" 
                      rel="noopener noreferrer"
                    >
                      <!-- 그룹 내의 모든 이미지 렌더링 -->
                      <img 
                        v-for="image in group.images" 
                        :key="image.id"
                        :src="image.url" 
                        :alt="image.alt"
                      />
                    </a>
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
                  <td :style="`font-size: 12px; font-family: '돋움',dotum,sans-serif; color: #5b5b5b`"> · 본 메일은 2025년 12월 11일 기준 회원님의 베네피아 이메일 수신 동의 여부를 확인한 결과, 수신에 동의하였기에 발송됩니다.</td>
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
export default {
  props: ['data'],
  methods: {
   
  }
}
</script>