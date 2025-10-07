export function generateEmType2Html(data) {
  return `
  <table width="100%" cellspacing="0" cellpadding="0" style="background:#fff5e6;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;">
          <tr>
            <td align="center" style="padding:20px;">
              <h1 style="color:${data.themeColor};margin:0;">${data.bannerTitle}</h1>
            </td>
          </tr>
          <tr>
            <td><img src="${data.bannerImage}" style="width:100%;border-radius:8px 8px 0 0;display:block;" alt="Banner Image" /></td>
          </tr>
          <tr>
            <td style="padding:20px;">
              <p style="margin:0 0 15px 0;line-height:1.6;">${data.description}</p>
              <a href="${data.actionLink}" style="display:inline-block;padding:10px 24px;background:${data.themeColor};color:#fff;text-decoration:none;border-radius:4px;font-weight:bold;">
                ${data.actionText}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}