import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { generateTemplateHtml } from '../templateHtml/index.js'

/**
 * HTML과 이미지를 분리하여 ZIP으로 다운로드
 * @param {string} templateName - 템플릿 이름
 * @param {object} formData - 폼 데이터
 * @param {string} deviceType - 'web' | 'mobile'
 * @param {object} options - 추가 옵션
 */
export async function imageDownloadHtml(templateName, formData, deviceType = 'web', options = {}) {
  console.log('📦 imageDownloadHtml 호출')
  console.log('  templateName:', templateName)
  console.log('  deviceType:', deviceType)
  
  try {
    // 1. HTML 생성
    const emailHtml = generateTemplateHtml(templateName, formData, deviceType, options)
    console.log('✅ HTML 생성 완료')
    
    // 2. ZIP 생성
    const zip = new JSZip()
    const imagesFolder = zip.folder('images')
    
    let processedHtml = emailHtml
    let imageIndex = 0
    const imageMap = new Map() // 중복 제거용
    
    // 3. Base64 이미지만 찾아서 처리
    const base64Regex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/g
    let match
    
    while ((match = base64Regex.exec(emailHtml)) !== null) {
      const fullImgTag = match[0]
      const mimeType = match[1] // 'jpeg', 'png', 'gif', 'webp'
      const base64Data = match[2]
      
      // 중복 체크 (같은 Base64는 한 번만 저장)
      if (imageMap.has(base64Data)) {
        const existingFilename = imageMap.get(base64Data)
        processedHtml = processedHtml.replace(
          fullImgTag,
          fullImgTag.replace(/src="data:image\/[^;]+;base64,[^"]+"/g, `src="images/${existingFilename}"`)
        )
        continue
      }
      
      // 파일명 생성
      imageIndex++
      const ext = mimeType === 'jpeg' ? 'jpg' : mimeType
      const filename = `image${imageIndex}.${ext}`
      
      try {
        // Base64를 Blob으로 변환
        const blob = base64ToBlob(base64Data, `image/${mimeType}`)
        
        // images 폴더에 추가
        imagesFolder.file(filename, blob)
        
        // HTML에서 경로 변경
        processedHtml = processedHtml.replace(
          fullImgTag,
          fullImgTag.replace(/src="data:image\/[^;]+;base64,[^"]+"/g, `src="images/${filename}"`)
        )
        
        // Map에 추가
        imageMap.set(base64Data, filename)
        
        console.log(`📸 이미지 추가: ${filename} (${(blob.size / 1024).toFixed(2)} KB)`)
        
      } catch (error) {
        console.error(`❌ 이미지 변환 실패 (${filename}):`, error)
      }
    }
    
    // 4. HTML 파일 추가
    const defaultHtmlFilename = options.htmlFilename || (deviceType === 'mobile' ? 'm.event.html' : 'event.html')
    zip.file(defaultHtmlFilename, processedHtml)
    
    console.log(`📦 ZIP 생성 완료: HTML 1개, 이미지 ${imageMap.size}개`)
    
    // 6. ZIP Blob 생성
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    })
    
    // 7. 파일명 생성 및 다운로드
    const timestamp = Date.now()
    const prefix = deviceType === 'mobile' ? 'm.' : ''
    const companySuffix = formData.companyType === 'hynix' ? '_hynix' : formData.companyType === 'normal' ? '_tobe' : ''

    // folderName이 있으면 사용, 없으면 templateName_timestamp 사용
    let zipFilename
    if (formData.folderName && formData.folderName.trim()) {
      zipFilename = `${prefix}${formData.folderName.trim()}${companySuffix}.zip`
    } else {
      zipFilename = `${prefix}${templateName}_${timestamp}${companySuffix}.zip`
    }
    
    saveAs(zipBlob, zipFilename)
    
    console.log('✅ ZIP 다운로드 완료:', zipFilename)
    
  } catch (error) {
    console.error('❌ 다운로드 실패:', error)
    alert('다운로드 중 오류가 발생했습니다: ' + error.message)
  }
}

/**
 * Base64 문자열을 Blob으로 변환
 */
function base64ToBlob(base64String, mimeType) {
  // Base64 디코딩
  const byteCharacters = atob(base64String)
  const byteArrays = []
  
  // Uint8Array로 변환
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i))
  }
  
  const byteArray = new Uint8Array(byteArrays)
  
  // Blob 생성
  return new Blob([byteArray], { type: mimeType })
}