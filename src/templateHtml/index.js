import { generateEmType1Html } from './emType1Html.js'
import { generateEmType2Html } from './em/type-image-link/emType2Html.js'
import { generateEventMapHtml } from './event/eventMapHtml.js'
import { generateEventImageLinkHtml } from './event/eventImageLinkHtml.js'
import { generateEmType4Html } from './em/efamily/emType4Html.js'
import { generateEmType5Html } from './em/secret-sale/emType5Html.js'
import { generateEmTypeFamilySaleHtml } from './em/family-sale/emTypeFamilySaleHtml.js'
import { generateFullEmailHtml } from './em/type-usemap/ImageMapHtml.js'
import { generateFullEmailHtml2 } from './em/type-usemap/ImageMapHtml2.js'
import { generatePrivacyHtml } from './privacy/privacyHtml.js'

// 템플릿별 HTML 생성 함수 매핑
export const templateHtmlGenerators = {
  'em-type-1': generateEmType1Html,
  'em-type-2': generateEmType2Html,
  'em-type-3': generateEventMapHtml,
  'event-imagelink': generateEventImageLinkHtml,
  'em-type-4': generateEmType4Html,
  'em-type-5': generateEmType5Html,
  'em-type-familysale': generateEmTypeFamilySaleHtml,
  'em-type-imagemap': generateFullEmailHtml,
  'em-type-imagemap2': generateFullEmailHtml2,
  'em-type-letter' : generateFullEmailHtml,
  'em-type-coupon' : generateEmType2Html,
  'privacy-policy': generatePrivacyHtml
}

// 템플릿 HTML 생성
export function generateTemplateHtml(templateName, data, deviceType = 'web', options = {}) {
  const generator = templateHtmlGenerators[templateName]
  
  if (!generator) {
    console.warn(`Template generator not found for: ${templateName}`)
    return '<p>Template not found</p>'
  }
  
  return generator(data, deviceType, options)
}