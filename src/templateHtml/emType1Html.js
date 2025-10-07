export function generateEmType1Html(data) {
  return `
  <table width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;">
          <tr>
            <td align="center" style="padding:20px;">
              <h1>${data.title}</h1>
              <p>${data.subtitle}</p>
            </td>
          </tr>
          <tr><td><img src="${data.heroImage}" style="width:100%;" alt="Hero Image" /></td></tr>
          <tr>
            <td style="padding:20px;">
              <h2>${data.mainHeading}</h2>
              <p>${data.mainText}</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px;">
              <a href="${data.buttonLink}" style="padding:12px 30px;color:#fff;border-radius:6px;background:${data.buttonColor};text-decoration:none;display:inline-block;">${data.buttonText}</a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:10px; background:#f9fafb;">
              <p style="margin:0;font-size:12px;color:#666;">${data.footerText}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}