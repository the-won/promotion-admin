export function generateEmType3Html(data) {
  
  // 각 이미지 섹션 생성 (핫스팟 포함)
  const generateImageSection = (imageUrl, hotspots) => {
    if (!imageUrl) return ''
    
    // 핫스팟이 없으면 단순 이미지
    if (!hotspots || !Array.isArray(hotspots) || hotspots.length === 0) {
      return `
          <tr>
            <td style="padding: 0; line-height: 0;">
              <img 
                src="${imageUrl}" 
                style="width: 100%; display: block; max-width: 600px; height: auto; border: 0;" 
                alt="Email Content"
              />
            </td>
          </tr>`
    }
    
    // 핫스팟 오버레이 생성
    const hotspotOverlays = hotspots.map((hotspot, index) => {
      const pos = hotspot.position || { left: 0, top: 0, width: 20, height: 10 }
      const href = hotspot.href || '#'
      const alt = hotspot.alt || hotspot.text || ''
      const title = hotspot.title || hotspot.text || ''
      
      return `
              <a href="${href}" 
                 title="${title}"
                 style="position: absolute; 
                        left: ${pos.left}%; 
                        top: ${pos.top}%; 
                        width: ${pos.width}%; 
                        height: ${pos.height}%;
                        display: block;
                        z-index: ${10 + index};
                        text-decoration: none;
                        font-size: 0;
                        line-height: 0;">
                <span style="display: block; width: 100%; height: 100%;"></span>
              </a>`
    }).join('\n')
    
    return `
          <tr>
            <td style="padding: 0; line-height: 0;">
              <!--[if mso]>
              <table width="600" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
              <![endif]-->
              <div style="position: relative; width: 100%; max-width: 600px; margin: 0 auto;">
                <img 
                  src="${imageUrl}" 
                  style="width: 100%; display: block; max-width: 600px; height: auto; border: 0; margin: 0;" 
                  alt="Email Content"
                />
                ${hotspotOverlays}
              </div>
              <!--[if mso]>
                  </td>
                </tr>
              </table>
              <![endif]-->
            </td>
          </tr>`
  }

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Email Template</title>
  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <style type="text/css">
    /* 이메일 클라이언트 호환성 */
    body, table, td, a { 
      -webkit-text-size-adjust: 100%; 
      -ms-text-size-adjust: 100%; 
    }
    table, td { 
      mso-table-lspace: 0pt; 
      mso-table-rspace: 0pt; 
    }
    img { 
      -ms-interpolation-mode: bicubic; 
      border: 0; 
      height: auto; 
      line-height: 100%; 
      outline: none; 
      text-decoration: none; 
    }
    
    /* 반응형 */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      .mobile-full-width {
        width: 100% !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; width: 100% !important;">
  <center style="width: 100%; background-color: #f4f4f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; margin: 0; padding: 0;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <!--[if mso]>
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
          <![endif]-->
          <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; margin: 0 auto;">
${(data.hotspotGroups || []).map(group => {
  const imageUrl = group.webImageUrl || group.mobileImageUrl
  return generateImageSection(imageUrl, group.hotspots)
}).join('\n')}
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