export function downloadHtml(templateName, formData) {
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"></head>
<body>
${generateEmailHtml(formData)}
</body>
</html>`

  const cleanHtml = html.replace(/<script[^>]*>[\s\S]*?Live reload enabled[\s\S]*?<\/script>/gi, '')
  const blob = new Blob([cleanHtml], { type: 'text/html' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${templateName}.html`
  a.click()
  URL.revokeObjectURL(a.href)
}

function generateEmailHtml(data) {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center">
      <h1>${data.title}</h1>
      <p>${data.subtitle}</p>
      <img src="${data.heroImage}" style="width:100%">
      <p>${data.mainText}</p>
    </td></tr>
  </table>`
}
