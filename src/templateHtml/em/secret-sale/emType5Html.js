export function generateEmType5Html(data) {
  console.log('emType5Html data:', data) // 디버깅용

  const companyUrls = {
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

  const companyType = data.companyType || 'normal'
  const urls = companyUrls[companyType]
  
  const sendDate = data.sendDate || { year: '2026', month: '01', day: '01' }
  const formattedDate = `${sendDate.year}년 ${parseInt(sendDate.month)}월 ${parseInt(sendDate.day)}일`

  function getProductUrl(productId) {
    return urls.product.replace(/{}/g, productId || '')
  }

  // 1단 상품 HTML 생성
  let row1Html = ''
  console.log('row1Products:', data.row1Products) // 디버깅용
  
  if (data.row1Products && Array.isArray(data.row1Products) && data.row1Products.length > 0) {
    data.row1Products.forEach((product, index) => {
      console.log(`Processing row1 product ${index}:`, product) // 디버깅용
      
      // 빈 값 체크
      if (!product.productId && !product.imageUrl) {
        console.log(`Skipping row1 product ${index} - empty`) // 디버깅용
        return
      }
      
      const height = index === 0 ? 60 : 13
      row1Html += `
        <tr>
          <td height="${height}"></td>
        </tr>
        <tr>
          <td style="FONT-SIZE: 0px; VERTICAL-ALIGN: top">
            <table cellSpacing="0" cellPadding="0" width="720" border="0">
              <tr>
                <td width="45"></td>
                <td style="FONT-SIZE: 0px; VERTICAL-ALIGN: top">
                  <a href="${getProductUrl(product.productId)}" target="_blank">
                    <img src="${product.imageUrl || ''}" align="left" width="630" alt="${product.imageAlt || ''}" border="0">
                  </a>
                </td>
                <td width="45"></td>
              </tr>
            </table>
          </td>
        </tr>`
    })
  }

  console.log('Generated row1Html length:', row1Html.length) // 디버깅용

  // 3단 상품 HTML 생성
  let row3Html = ''
  console.log('row3Products:', data.row3Products) // 디버깅용
  
  if (data.row3Products && Array.isArray(data.row3Products) && data.row3Products.length > 0) {
    data.row3Products.forEach((productSet, index) => {
      console.log(`Processing row3 productSet ${index}:`, productSet) // 디버깅용
      
      // products 배열 확인
      if (!productSet.products || !Array.isArray(productSet.products) || productSet.products.length !== 3) {
        console.log(`Skipping row3 productSet ${index} - invalid products array`) // 디버깅용
        return
      }
      
      const product1 = productSet.products[0]
      const product2 = productSet.products[1]
      const product3 = productSet.products[2]
      
      // 모든 상품이 비어있지 않은지 확인
      if ((!product1.productId && !product1.imageUrl) &&
          (!product2.productId && !product2.imageUrl) &&
          (!product3.productId && !product3.imageUrl)) {
        console.log(`Skipping row3 productSet ${index} - all products empty`) // 디버깅용
        return
      }
      
      const height = index === 0 ? 43 : 30
      row3Html += `
        <tr>
          <td height="${height}"></td>
        </tr>
        <tr>
          <td style="FONT-SIZE: 0px; VERTICAL-ALIGN: top">
            <table cellSpacing="0" cellPadding="0" width="720" border="0">
              <tr>
                <td width="45"></td>
                <td style="FONT-SIZE: 0px; VERTICAL-ALIGN: top">
                  <a href="${getProductUrl(product1.productId)}" target="_blank">
                    <img src="${product1.imageUrl || ''}" align="left" width="200" alt="${product1.imageAlt || ''}" border="0">
                  </a>
                </td>
                <td width="15"></td>
                <td style="FONT-SIZE: 0px; VERTICAL-ALIGN: top">
                  <a href="${getProductUrl(product2.productId)}" target="_blank">
                    <img src="${product2.imageUrl || ''}" align="left" width="200" alt="${product2.imageAlt || ''}" border="0">
                  </a>
                </td>
                <td width="15"></td>
                <td style="FONT-SIZE: 0px; VERTICAL-ALIGN: top">
                  <a href="${getProductUrl(product3.productId)}" target="_blank">
                    <img src="${product3.imageUrl || ''}" align="left" width="200" alt="${product3.imageAlt || ''}" border="0">
                  </a>
                </td>
                <td width="45"></td>
              </tr>
            </table>
          </td>
        </tr>`
    })
  }

  console.log('Generated row3Html length:', row3Html.length) // 디버깅용

  return `<!DOCTYPE html PUBLIC "-//W3C//Dtd XHTML 1.0 transitional//EN" "https://www.w3.org/tr/xhtml1/Dtd/xhtml1-transitional.dtd">
<html xmlns="https://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
<head>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
<title>베네피아 화끈딜</title>
</head>
<body style="TEXT-ALIGN: center" bottommargin="0" leftmargin="0" rightmargin="0" topmargin="0" bgcolor="#ffffff" marginheight="0" marginwidth="0">
<table cellspacing="0" cellpadding="0" width="708" align="center" border="0">
<tbody>
  <tr>
    <td><table cellspacing="0" cellpadding="0" width="100%" border="0">
    <tbody>
      <tr>
        <td height="88" rowspan="2" width="148"><img alt="BENEPIA" src="https://newfront.benepia.co.kr/upload/xquared/b9d3364e-f386-4138-a6a4-6d61ed93422c.gif" width="148" height="88"></td>
        <td height="51" align="right"></td>
        <td height="88" rowspan="2" width="325"><a href="${urls.detail}" target="_blank" title="상세조회"><img border="0" alt="의 베네피아 잔여 포인트를 지금 확인하세요!" src="https://i.benepia.co.kr/ckeditor/D9E5A1E20280.mns0115844189801720.gif" width="325" height="88"></a></td>
      </tr>
      <tr>
        <td style="FONT-SIZE: 12px" height="37" valign="top" align="right"><strong>%UserName%님</strong></td>
      </tr>
    </tbody>
    </table>
    <table style="border:1px solid #bebebe;" cellspacing="0" cellpadding="0" width="720">
    <tbody>
      <tr>
        <td style="PADDING-BOTTOM: 3px; PADDING-TOP: 3px; PADDING-LEFT: 3px; PADDING-RIGHT: 3px" align="center">
        <!-- contents start -->
        <table cellSpacing="0" cellPadding="0" width="720" border="0">
          <tr>
            <td>
              <img src="${data.headerImage || ''}" align="left" width="720" alt="${data.headerImageAlt || ''}" border="0">
            </td>
          </tr>
        </table>

        <!-- 정기 교체 영역: 상품 -->
        <table cellSpacing="0" cellPadding="0" width="720" border="0" style="background-color: #eeeeee;">
          <!-- 1단반복 -->
${row1Html}
          <!-- // 1단반복 -->
          
          <!-- 3단반복 -->
${row3Html}
          <!-- // 3단반복 -->
          
          <tr>
            <td height="80"></td>
          </tr>
        </table>
        <!-- // 정기 교체 영역: 상품 -->

        <table cellSpacing="0" cellPadding="0" width="720" border="0">
          <tr>
            <td>
              <img src="http://i.benepia.co.kr/ckeditor/d20-10ad76abd4f417217996045900.jpg" align="left" width="720" alt="꼭 확인하세요! / - 고객사별 복지 허용 카테고리에 따라 상품 확인이 불가 할 수 있습니다. / - 본 내용은 당사 사정으로 별도 고지 없이 변경 또는 종료 될 수 있습니다." border="0">
            </td>
          </tr>
        </table>
        <!-- //contents end -->
      </td>
      </tr> 
    </tbody>
    </table>
    <table cellSpacing="0" cellPadding="0" width="728" border="0">
      <tbody>
      <tr> 
        <td style="HEIGHT: 5px"></td>
      </tr>
      <tr>
        <td style="BACKGROUND: #f2f2f2; PADDING-BOTTOM: 18px; PADDING-TOP: 18px; PADDING-LEFT: 9px; PADDING-RIGHT: 9px"><table style="TEXT-ALIGN: left" cellSpacing="0" cellPadding="0" width="100%" border="0">
          <tbody>
          <tr>
            <td style="FONT-SIZE: 12px; FONT-FAMILY: '돋움',dotum,sans-serif; COLOR: #5b5b5b"> · 본 메일은 ${formattedDate} 기준 회원님의 베네피아 이메일 수신 동의 여부를 확인한 결과, 수신에 동의하였기에 발송됩니다.</td>
          </tr> 
          <tr>
            <td style="FONT-SIZE: 12px; FONT-FAMILY: '돋움',dotum,sans-serif; COLOR: #5b5b5b; PADDING-TOP: 4px"> · 베네피아 메일을 수신을 원하지 않으시면, <a style="COLOR: #21a7e5; TEXT-DECORATION: none" href="${urls.refuse}" target="_blank"><strong>[수신거부]</strong></a>를 클릭해주시기 바랍니다. (If you don\`t want this of information or <br />&nbsp;&nbsp;e-mail, please <a style="COLOR: #21a7e5; TEXT-DECORATION: none" href="${urls.refuse}" target="_blank"> <strong>[click the Refusal]</strong></a>)</td>                 
          </tr>
          <tr>
            <td style="FONT-SIZE: 12px; FONT-FAMILY: '돋움',dotum,sans-serif; COLOR: #5b5b5b; PADDING-TOP: 4px"> · 본 메일은 발신전용으로 회신되지 않습니다. 궁금하신 사항은 <a style="COLOR: #21a7e5; TEXT-DECORATION: none" href="${urls.inquiry}" target="_blank"><strong>[온라인문의]</strong></a>로 문의하시면 친절하게 안내해 드리겠습니다. </td>
          </tr>
          </tbody>
        </table></td>
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