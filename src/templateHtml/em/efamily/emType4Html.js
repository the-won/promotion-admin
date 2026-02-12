export function generateEmType4Html(data) {
  const domain = data.globalDomain || 'www'

  const sendDate = data.sendDate || { year: '2026', month: '01', day: '01' }
  const formattedDate = `${sendDate.year}년 ${parseInt(sendDate.month)}월 ${parseInt(sendDate.day)}일`
  
  // 상품 그룹 HTML 생성
  const productGroupsHtml = (data.productGroups || []).map((group, groupIndex) => {
    // 각 그룹의 행들 생성
    const rowsHtml = (group.rows || []).map((row, rowIndex) => {
      const spacerHtml = rowIndex < group.rows.length - 1 
        ? '<tr><td colspan="7" height="11">&nbsp;</td></tr>' 
        : ''
      
      return `
        <tr>
          <td style="width: 25px;"></td>
          <td style="font-size:0;vertical-align:top;">
            <a href="https://${domain}.efamilyshop.co.kr/shop/goods/goodsView.view?goodscode=${row.products[0].productCode}" style="padding:0;">
              <img src="${row.products[0].imageUrl}" width="234" border="0" alt="${row.products[0].imageAlt}" />
            </a>
          </td>
          <td style="width: 9px;"></td>
          <td style="font-size:0;vertical-align:top;">
            <a href="https://${domain}.efamilyshop.co.kr/shop/goods/goodsView.view?goodscode=${row.products[1].productCode}" style="padding:0;">
              <img src="${row.products[1].imageUrl}" width="234" border="0" alt="${row.products[1].imageAlt}" />
            </a>
          </td>
          <td style="width: 9px;"></td>
          <td style="font-size:0;vertical-align:top;">
            <a href="https://${domain}.efamilyshop.co.kr/shop/goods/goodsView.view?goodscode=${row.products[2].productCode}" style="padding:0;">
              <img src="${row.products[2].imageUrl}" width="234" border="0" alt="${row.products[2].imageAlt}" />
            </a>
          </td>
          <td style="width: 25px;"></td>
        </tr>
        ${spacerHtml}
      `
    }).join('')

    // 마지막 그룹 뒤에 60px 간격
    const groupSpacerHtml = groupIndex === data.productGroups.length - 1
      ? '<tr><td height="60" style="background:#e4e4e4;"></td></tr>'
      : ''

    return `
      <tr>
        <td style="font-size:0; vertical-align:top;">
          <img src="${group.titleImage.url}" alt="${group.titleImage.alt}" width="770" border="0" />
        </td>
      </tr>
      <tr>
        <td style="font-size:0; vertical-align:top;background:#e4e4e4;">
          <table cellspacing="0" cellpadding="0" width="770" border="0">
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </td>
      </tr>
      ${groupSpacerHtml}
    `
  }).join('')

  // 배너 HTML 생성
  const bannersHtml = (data.banners || []).map((banner, bannerIndex) => {
    let spacerHtml = ''
    if (bannerIndex < data.banners.length - 1) {
      spacerHtml = '<tr><td height="8" style="background:#d8d8d8;"></td></tr>'
    } else if (bannerIndex === data.banners.length - 1) {
      spacerHtml = '<tr><td height="6" style="background:#d8d8d8;"></td></tr>'
    }

    return `
      <tr>
        <td style="font-size:0; vertical-align:top;">
          <a href="https://${domain}.efamilyshop.co.kr/shop/event/eventDetail.view?pageNo=1&eventId=${banner.eventCode}" target="_blank" style="padding:0;">
            <img src="${banner.imageUrl}" width="770" border="0" alt="${banner.imageAlt}" />
          </a>
        </td>
      </tr>
      ${spacerHtml}
    `
  }).join('')

  return `
<!doctype html>
<html xmlns="https://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
<head>
<meta content="text/html; charset=utf-8" http-equiv=content-type>
<title>이패밀리샵 Newsletter</title>
</head>
<body bottommargin="0" leftmargin="0" rightmargin="0" topmargin="0" bgcolor="#ffffff" marginheight="0" marginwidth="0">
<table id="__01" cellspacing="0" cellpadding="0" width="770" align="center" border="0">
  <tbody>
    <!-- 로고 -->
    <tr>
      <td style="font-size:0; vertical-align:top;">
        <a href="https://${domain}.efamilyshop.co.kr/" target="_blank">
          <img src="https://www.efamilyshop.co.kr/storage/fud/20240528/top_logo_20240528_20240528142617.png" width="770" border="0" alt="e familyshop">
        </a>
      </td>
    </tr>

    <!-- 상단 이미지 -->
    <tr>
      <td style="font-size:0; vertical-align:top;">
        <a target="_blank" href="https://${domain}.efamilyshop.co.kr/shop/event/eventDetail.view?pageNo=1&eventId=${data.headerImageCode}">
          <img src="${data.headerImage}" alt="${data.headerImageAlt}" width="770" border="0" />
        </a>
      </td>
    </tr>

    <!-- 상품 그룹들 -->
    ${productGroupsHtml}

    <!-- 배너들 -->
    ${bannersHtml}

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
                      본 메일은 <a href="https://${domain}.efamilyshop.co.kr/shop/front/member/mypage03" target="_blank"><span style="font-weight:bold; color:#ff4d16;">${formattedDate}</span></a> 기준 회원님의 이패밀리샵 이메일 수신 동의 여부를 확인한 결과, 수신에 동의하였기에 발송됩니다.
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align:text-top; padding-top:5px;">&middot;</td>
                    <td style="padding:3px;">이패밀리샵 메일 수신을 원하지 않으시면, <a href="https://${domain}.efamilyshop.co.kr/shop/front/unsubscribe.view?c=[$etc2]" target="_blank"><span style="font-weight:bold; color:#ff4d16;">[수신거부]</span></a>해 주세요를 클릭해주시기 바랍니다.<br>(If you no longer wish to receive these e-mail, click here to <a href="https://${domain}.efamilyshop.co.kr/shop/front/unsubscribe.view?c=[$etc2]" target="_blank"><span style="font-weight:bold; color:#ff4d16;">[Unsubscribe]</span></a>)</td>
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
                      <a href="https://${domain}.efamilyshop.co.kr/" target="_blank"><img src="https://www.efamilyshop.co.kr/storage/fud/20240528/footer_logo_20240528_20240528142617.png" border="0" alt="하단로고" /></a>
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
</body>
</html>
  `
}