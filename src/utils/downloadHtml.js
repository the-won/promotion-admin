import { generateTemplateHtml } from '../templateHtml/index.js'

export function downloadHtml(templateName, formData) {
  const emailHtml = generateTemplateHtml(templateName, formData)
  
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${getTemplateTitle(formData)}</title>
</head>
<body>
${emailHtml}
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html; charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${templateName}_${Date.now()}.html`
  a.click()
  URL.revokeObjectURL(a.href)
}

function getTemplateTitle(formData) {
  return formData.title || formData.bannerTitle || formData.headerText || 'Email Template'
}