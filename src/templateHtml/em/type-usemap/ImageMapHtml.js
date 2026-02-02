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
  const imageMapHtml = generateImageMapHtml(data)
  
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>이메일 템플릿</title>
</head>
<body style="margin: 0; padding: 0;">
  <center>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <!--[if mso]>
          <table role="presentation" width="720" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
          <![endif]-->
          <table role="presentation" width="720" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 720px; margin: 0 auto;">
            <tbody>
              <tr>
                <td>
${imageMapHtml}
                </td>
              </tr>
            </tbody>
          </table>
          <!--[if mso]>
              </td>
            </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`
}

export default {
  generateImageMapHtml,
  generateFullEmailHtml
}