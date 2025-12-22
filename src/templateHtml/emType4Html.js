export function generateEmType4Html(data) {
  const hotspotsHtml = (data.hotspots || []).map(hotspot => {
    const pos = hotspot.position
    return `
    <a 
      href="${hotspot.href}"
      alt="${hotspot.alt}"
      title="${hotspot.text}"
      style="position:absolute;left:${pos.left}%;top:${pos.top}%;width:${pos.width}%;height:${pos.height}%;display:block;text-indent:-9999px;overflow:hidden;"
    >
      ${hotspot.text}
    </a>`
  }).join('')

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
            <td style="padding:0;">
              <div style="position:relative;width:100%;">
                <img src="${data.backgroundImage}" style="width:100%;display:block;" alt="Background" />
                ${hotspotsHtml}
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