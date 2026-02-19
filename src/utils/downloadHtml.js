import { generateTemplateHtml } from '../templateHtml/index.js'

export function downloadHtml(templateName, formData, deviceType = 'web') {
  console.log('📥 downloadHtml 호출')
  console.log('  templateName:', templateName)
  console.log('  deviceType:', deviceType)
  
  const emailHtml = generateTemplateHtml(templateName, formData, deviceType)
  
  console.log('✅ HTML 생성 완료')
  
  const html = `${emailHtml}`

  const blob = new Blob([html], { type: 'text/html; charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  
  // deviceType에 따라 파일명 변경
  let filename = `${templateName}_${Date.now()}.html`
  if (deviceType === 'mobile') {
    filename = `m.${templateName}_${Date.now()}.html`
  }
  
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

function getTemplateTitle(formData) {
  return formData.title || formData.bannerTitle || formData.headerText || 'Email Template'
}