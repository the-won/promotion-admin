import { generateEmType1Html } from './emType1Html.js'
import { generateEmType2Html } from './em/type-image-link/emType2Html.js'
import { generateEmType3Html } from './emType3Html.js'
import { generateEmType4Html } from './em/efamily/emType4Html.js'
import { generateEmType5Html } from './em/secret-sale/emType5Html.js'
import { generateFullEmailHtml } from './em/type-usemap/ImageMapHtml.js'

// 템플릿별 HTML 생성 함수 매핑
export const templateHtmlGenerators = {
  'em-type-1': generateEmType1Html,
  'em-type-2': generateEmType2Html,
  'em-type-3': generateEmType3Html,
  'em-type-4': generateEmType4Html,
  'em-type-5': generateEmType5Html,
  'em-type-imagemap': generateFullEmailHtml
}

// 템플릿 HTML 생성
export function generateTemplateHtml(templateName, data) {
  const generator = templateHtmlGenerators[templateName]
  
  if (!generator) {
    console.warn(`Template generator not found for: ${templateName}`)
    return '<p>Template not found</p>'
  }
  
  return generator(data)
}