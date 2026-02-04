/**
 * 이미지맵 기반 이메일 템플릿 HTML 생성
 * 
 * 데이터 구조:
 * - imageMapRows: [{ id, imageUrl, width, height, imageAlt, mapName }]
 * - imageMapAreas: [{ id, rowId, href, alt, coords: { x1, y1, x2, y2 } }]
 */

export function generateImageMapHtml(data) {
  const rows = data.imageMapRows || []
  const areas = data.imageMapAreas || []
  
  if (rows.length === 0) {
    return '<!-- 이미지맵 데이터가 없습니다 -->'
  }

  const rowsHtml = rows.map((row, index) => {
    const mapName = row.mapName || `mapContents${String(index + 1).padStart(2, '0')}`
    
    // 해당 row에 속한 areas만 필터링
    const rowAreas = areas.filter(a => a.rowId === row.id)
    
    // area 태그들 생성
    const areasHtml = rowAreas.map(area => {
      const coords = `${area.coords.x1},${area.coords.y1},${area.coords.x2},${area.coords.y2}`
      return `								<area shape="rect" coords="${coords}" href="${area.href}" alt="${area.alt}" target="_blank" title="새창열림">`
    }).join('\n')

    return `					<tr>
						<td>
							<img src="${row.imageUrl}" align="left" width="${row.width}" height="${row.height}" alt="${row.imageAlt}" border="0" usemap="#${mapName}">
							<map name="${mapName}">
${areasHtml}
							</map>
						</td>
					</tr>`
  }).join('\n')

  return `				<table cellSpacing="0" cellPadding="0" width="720" border="0">
${rowsHtml}
				</table>`
}

/**
 * 전체 이메일 템플릿 HTML 생성 (wrapper 포함)
 */
export function generateFullEmailHtml(data) {

  const sendDate = data.sendDate || { year: '2026', month: '01', day: '01' }
  const formattedDate = `${sendDate.year}년 ${parseInt(sendDate.month)}월 ${parseInt(sendDate.day)}일`
  const imageMapHtml = generateImageMapHtml(data)
  
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
    </td> 
  </tr>
  <tr>
    <td>
${imageMapHtml}
    </td>
  </tr>
  <tr>
    <!-- footer -->
    <td>
      <table cellspacing="0" cellpadding="0" width="728" border="0">
            <tbody>
              <tr> 
              <td style="HEIGHT: 5px"></td>
              </tr>
              <tr>
              <td style="BACKGROUND: #f2f2f2; PADDING-BOTTOM: 18px; PADDING-TOP: 18px; PADDING-LEFT: 9px; PADDING-RIGHT: 9px"><table style="TEXT-ALIGN: left" cellspacing="0" cellpadding="0" width="100%" border="0">
                <tbody>
                  <tr>
                  <td style="FONT-SIZE: 12px; FONT-FAMILY: '돋움',dotum,sans-serif; COLOR: #5b5b5b"> · 본 메일은 ${formattedDate} 기준 회원님의 베네피아 이메일 수신 동의 여부를 확인한 결과, 수신에 동의하였기에 발송됩니다.</td>
                  </tr> 
                  <tr>
                  <td style="FONT-SIZE: 12px; FONT-FAMILY: '돋움',dotum,sans-serif; COLOR: #5b5b5b; PADDING-TOP: 4px"> · 베네피아 메일을 수신을 원하지 않으시면, <a style="COLOR: #21a7e5; TEXT-DECORATION: none" href="https://$:domain:$.benepia.co.kr/mail/rcvMailYn/rcvMailYn.do?encMailId=$:enc_mail_id:$&amp;encMbrId=$:enc_mbr_id:$" target="_blank" title="새창열림"><strong>[수신거부]</strong></a>를 클릭해주시기 바랍니다. (If you don\`t want this of information or <br>
                    &nbsp;&nbsp;e-mail, please <a style="COLOR: #21a7e5; TEXT-DECORATION: none" href="https://$:domain:$.benepia.co.kr/mail/rcvMailYn/rcvMailYn.do?encMailId=$:enc_mail_id:$&amp;encMbrId=$:enc_mbr_id:$" target="_blank" title="새창열림"> <strong>[click the Refusal]</strong></a>) </td>				  
                  </tr>
                  <tr>
                  <td style="FONT-SIZE: 12px; FONT-FAMILY: '돋움',dotum,sans-serif; COLOR: #5b5b5b; PADDING-TOP: 4px"> · 본 메일은 발신전용으로 회신되지 않습니다. 궁금하신 사항은 <a style="COLOR: #21a7e5; TEXT-DECORATION: none" href="https://$:domain:$.benepia.co.kr/frnt/mypage/qnaList.do?mnuId=84&amp;mnuTopLevel=11&amp;mnuLevel=1&amp;list" target="_blank" title="새창열림"><strong>[온라인문의]</strong></a>로 문의하시면 친절하게 안내해 드리겠습니다. </td>
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
</body>
</html>`
}

export default {
  generateImageMapHtml,
  generateFullEmailHtml
}