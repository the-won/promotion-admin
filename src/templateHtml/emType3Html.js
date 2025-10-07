export function generateEmType3Html(data) {
  // 버튼 위치 계산
  const presets = {
    'top-left': { left: 10, top: 10 },
    'top-center': { left: 50, top: 10 },
    'top-right': { left: 90, top: 10 },
    'center-left': { left: 10, top: 50 },
    'center-center': { left: 50, top: 50 },
    'center-right': { left: 90, top: 50 },
    'bottom-left': { left: 10, top: 90 },
    'bottom-center': { left: 50, top: 90 },
    'bottom-right': { left: 90, top: 90 }
  }
  
  const preset = data.buttonPreset || 'bottom-center'
  const base = presets[preset] || { left: 50, top: 90 }
  const offsetX = data.buttonOffsetX || 0
  const offsetY = data.buttonOffsetY || 0
  
  const finalLeft = base.left + offsetX
  const finalTop = base.top + offsetY
  
  // 버튼 크기
  const sizes = {
    'small': { padding: '8px 16px', fontSize: '12px' },
    'medium': { padding: '12px 24px', fontSize: '14px' },
    'large': { padding: '16px 32px', fontSize: '16px' }
  }
  const buttonSize = sizes[data.buttonSize || 'medium']
  
  return `
  <table width="100%" cellspacing="0" cellpadding="0" style="background:#e8f4f8;">
    <tr>
      <td align="center">
        <table width="900" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:20px;background:#0077be;">
              <h1 style="color:#fff;margin:0;font-size:24px;">${data.headerText}</h1>
            </td>
          </tr>
          <tr>
            <td style="position:relative;padding:0;">
              <div style="position:relative;width:100%;">
                <img src="${data.backgroundImage}" style="width:100%;display:block;" alt="Background" />
                <a 
                  href="${data.buttonLink}"
                  style="position:absolute;left:${finalLeft}%;top:${finalTop}%;transform:translate(-50%, -50%);background:${data.buttonColor};color:#fff;text-decoration:none;font-weight:bold;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.3);padding:${buttonSize.padding};font-size:${buttonSize.fontSize};"
                >
                  ${data.buttonText}
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px;background:#f9fafb;">
              <p style="margin:0;font-size:12px;color:#666;">${data.footerText}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}