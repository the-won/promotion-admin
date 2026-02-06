export function generateEmType2Html(data) {
  const companyUrls = {
    normal: {
      detail: "https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://$:domain:$.benepia.co.kr/frnt/mypage/main.do?mnuTopLevel=0%26mnuLevel=0&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?domain=$:domain:$%26linkUrl=/frnt/mypage/pointInfo.bene",
      refuse: "https://$:domain:$.benepia.co.kr/mail/rcvMailYn/rcvMailYn.do?encMailId=$:enc_mail_id:$&encMbrId=$:enc_mbr_id:$",
      inquiry: "https://$:domain:$.benepia.co.kr/frnt/mypage/qnaList.do?mnuId=84&mnuTopLevel=11&mnuLevel=1&list"
    },
    hynix: {
      detail: "https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://skhynix.benepia.co.kr/hynix/myPointCondition.do&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?domain=skhynix%26linkUrl=/frnt/mypage/pointUseTrMonthlyList.bene",
      refuse: "https://newfront.benepia.co.kr/mail/rcvMailYn/rcvMailYn.do?encMailId=$:enc_mail_id:$&encMbrId=$:enc_mbr_id:$",
      inquiry: "https://skhynix.benepia.co.kr/hynix/myQna.do"
    }
  }

  const companyType = data.companyType || 'normal'
  const urls = companyUrls[companyType]

  const sendDate = data.sendDate || { year: '2026', month: '01', day: '01' }
  const formattedDate = `${sendDate.year}년 ${parseInt(sendDate.month)}월 ${parseInt(sendDate.day)}일`

  // imageLinkGroups 처리
  const groups = data.imageLinkGroups || []
  
  const groupsHtml = groups.map(group => {
    const imagesHtml = group.images.map(img => 
      `            <img src="${img.url}" align="left" width="720" alt="${img.alt}" border="0">`
    ).join('\n')
    
    return `        <tr>
          <td>
            <a href="${group.href}" target="_blank" title="새창열림">
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
      <table cellspacing="0" cellpadding="0" width="100%" border="0">
        <tbody>
          <tr>
            <td height="88" rowspan="2" width="148"><img alt="BENEPIA" src="https://newfront.benepia.co.kr/upload/xquared/b9d3364e-f386-4138-a6a4-6d61ed93422c.gif" width="148" height="88"></td>
            <td height="51" align="right"></td>
            <td height="88" rowspan="2" width="325">
              <a href="${urls.detail}" target="_blank" title="상세조회">
                <img border="0" alt="의 베네피아 잔여 포인트를 지금 확인하세요!" src="https://i.benepia.co.kr/ckeditor/D9E5A1E20280.mns0115844189801720.gif" width="325" height="88">
              </a>
            </td>
          </tr>
          <tr>
            <td style="FONT-SIZE: 12px" height="37" valign="top" align="right"><strong>%UserName%님</strong></td>
          </tr>
        </tbody>
      </table>
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