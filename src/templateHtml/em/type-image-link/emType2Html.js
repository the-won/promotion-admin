import { generateHeaderHtml } from '../../shared/headerHtml.js'

const LINK_TEMPLATES = {
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

function buildGroupUrl(group, companyType) {
  const vendorType = companyType || 'normal'
  const t = LINK_TEMPLATES[vendorType] || LINK_TEMPLATES['normal']

  if (group.linkType && group.linkData) {
    const { linkType, linkData } = group
    switch (linkType) {
      case 'plan':
        if (linkData.planCode) return t.plan(linkData.planCode)
        break
      case 'product':
        if (linkData.productCode) return t.product(linkData.productCode)
        break
      case 'event':
        if (vendorType === 'normal') {
          if (linkData.webEventCode && linkData.mobileEventCode)
            return t.event(linkData.webEventCode, linkData.mobileEventCode)
        } else {
          if (linkData.mobileEventCode) return t.event(linkData.mobileEventCode)
        }
        break
      case 'search':
        if (linkData.searchKeyword) return t.search(encodeURIComponent(linkData.searchKeyword))
        break
      case 'custom':
        return linkData.customUrl || 'javascript:void(0)'
    }
  }

  return group.href || 'javascript:void(0)'
}

export function generateEmType2Html(data) {
  const footerUrls = {
    normal: {
      refuse: "https://$:domain:$.benepia.co.kr/mail/rcvMailYn/rcvMailYn.do?encMailId=$:enc_mail_id:$&encMbrId=$:enc_mbr_id:$",
      inquiry: "https://$:domain:$.benepia.co.kr/frnt/mypage/qnaList.do?mnuId=84&mnuTopLevel=11&mnuLevel=1&list"
    },
    hynix: {
      refuse: "https://newfront.benepia.co.kr/mail/rcvMailYn/rcvMailYn.do?encMailId=$:enc_mail_id:$&encMbrId=$:enc_mbr_id:$",
      inquiry: "https://skhynix.benepia.co.kr/hynix/myQna.do"
    }
  }

  const companyType = data.companyType || 'normal'
  const urls = footerUrls[companyType] || footerUrls.normal

  const sendDate = data.sendDate || { year: '2026', month: '01', day: '01' }
  const formattedDate = `${sendDate.year}년 ${parseInt(sendDate.month)}월 ${parseInt(sendDate.day)}일`

  // imageLinkGroups 처리
  const groups = data.imageLinkGroups || []
  
  const groupsHtml = groups.map(group => {
    const imagesHtml = group.images.map(img =>
      `            <img src="${img.url}" align="left" width="720" alt="${img.alt}" border="0">`
    ).join('\n')
    const href = buildGroupUrl(group, companyType)

    return `        <tr>
          <td>
            <a href="${href}" target="_blank" title="새창열림">
${imagesHtml}
            </a>
          </td>
        </tr>`
  }).join('\n')

  return `<!DOCTYPE html PUBLIC "-//W3C//Dtd XHTML 1.0 transitional//EN" "https://www.w3.org/tr/xhtml1/Dtd/xhtml1-transitional.dtd">
<html xmlns="https://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
<head>
<meta content="text/html; charset=UTF-8" http-equiv=Content-Type>
<title></title>
</head>
<body style="TEXT-ALIGN: center" bottommargin="0" leftmargin="0" rightmargin="0" topmargin="0" bgcolor="#ffffff" marginheight="0" marginwidth="0">
<table cellspacing="0" cellpadding="0" width="708" align="center" border="0">
  <tbody>
  <tr>
    <td>
      ${generateHeaderHtml(data.headerType, data.companyType)}
    </td> 
  </tr>
  <tr>
    <td style="padding: 3px; border: 1px solid #bebebe">
      <table cellSpacing="0" cellPadding="0" width="720" border="0">
${groupsHtml}
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <table cellspacing="0" cellpadding="0" width="728" border="0">
        <tbody>
          <tr> 
            <td style="HEIGHT: 5px"></td>
          </tr>
          <tr>
            <td style="BACKGROUND: #f2f2f2; PADDING-BOTTOM: 18px; PADDING-TOP: 18px; PADDING-LEFT: 9px; PADDING-RIGHT: 9px">
              <table style="TEXT-ALIGN: left" cellspacing="0" cellpadding="0" width="100%" border="0">
                <tbody>
                  <tr>
                    <td style="FONT-SIZE: 12px; FONT-FAMILY: '돋움',dotum,sans-serif; COLOR: #5b5b5b"> · 본 메일은 ${formattedDate} 기준 회원님의 베네피아 이메일 수신 동의 여부를 확인한 결과, 수신에 동의하였기에 발송됩니다.</td>
                  </tr> 
                  <tr>
                    <td style="FONT-SIZE: 12px; FONT-FAMILY: '돋움',dotum,sans-serif; COLOR: #5b5b5b; PADDING-TOP: 4px"> · 베네피아 메일을 수신을 원하지 않으시면, <a style="COLOR: #21a7e5; TEXT-DECORATION: none" href="${urls.refuse}" target="_blank" title="새창열림"><strong>[수신거부]</strong></a>를 클릭해주시기 바랍니다. (If you don\`t want this of information or <br>
                      &nbsp;&nbsp;e-mail, please <a style="COLOR: #21a7e5; TEXT-DECORATION: none" href="${urls.refuse}" target="_blank" title="새창열림"> <strong>[click the Refusal]</strong></a>) </td>				  
                  </tr>
                  <tr>
                    <td style="FONT-SIZE: 12px; FONT-FAMILY: '돋움',dotum,sans-serif; COLOR: #5b5b5b; PADDING-TOP: 4px"> · 본 메일은 발신전용으로 회신되지 않습니다. 궁금하신 사항은 <a style="COLOR: #21a7e5; TEXT-DECORATION: none" href="${urls.inquiry}" target="_blank" title="새창열림"><strong>[온라인문의]</strong></a>로 문의하시면 친절하게 안내해 드리겠습니다. </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td><img border="0" alt="Copyright (C) SK M&amp;service. All rights Reserved" src="https://org-i.benepia.co.kr/ckeditor/2025/05/21/afb-19d54843e91e17478007034700.jpg" width="708" height="54"></td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</tbody>
</table> 
</body>
</html>`
}