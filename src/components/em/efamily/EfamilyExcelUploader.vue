<template>
  <div class="efamily-excel-uploader">
    <div class="upload-section">
      <div class="section-header">
        <h4>📊 Excel 일괄 업로드</h4>
        <div class="button-group">
          <button @click="downloadTemplate" class="btn btn-secondary">
            📥 템플릿 다운로드
          </button>
          <label class="btn btn-primary">
            📤 Excel 업로드
            <input 
              type="file" 
              ref="fileInput"
              accept=".xlsx, .xls"
              @change="handleFileUpload"
              style="display: none;"
            />
          </label>
        </div>
      </div>

      <!-- 붙여넣기 영역 -->
      <div class="paste-area-wrapper">
        <label class="paste-label">또는 Excel에서 복사 후 아래 영역에 붙여넣기 (Ctrl+V)</label>
        <textarea
          ref="pasteArea"
          v-model="pasteData"
          @paste="handlePaste"
          placeholder="Excel 데이터를 복사한 후 여기에 붙여넣기하세요..."
          class="paste-area"
        ></textarea>
      </div>

      <!-- 안내 메시지 -->
      <div class="info-box">
        <p><strong>📋 Excel 형식 안내:</strong></p>
        <ul>
          <li><strong>HEADER</strong>: 상단 이미지 (상품코드, 이미지URL, Alt)</li>
          <li><strong>GROUP</strong>: 상품 그룹 (그룹번호, 타이틀이미지, 상품 3개)</li>
          <li><strong>BANNER</strong>: 하단 배너 (이벤트코드, 이미지URL, Alt)</li>
        </ul>
        <p class="tip">💡 그룹 개수와 각 그룹의 행 개수는 무제한입니다!</p>
      </div>

      <!-- 파싱 결과 -->
      <div v-if="parseResult" class="result-box">
        <div class="result-header">
          <span class="result-title">✅ 파싱 결과</span>
          <button @click="applyData" class="btn btn-success">적용하기</button>
        </div>
        <div class="result-stats">
          <span class="stat-item">상단 이미지: {{ parseResult.header ? '✓' : '✗' }}</span>
          <span class="stat-item">상품 그룹: {{ parseResult.productGroups.length }}개</span>
          <span class="stat-item">배너: {{ parseResult.banners.length }}개</span>
        </div>
      </div>

      <!-- 에러 메시지 -->
      <div v-if="errorMessage" class="error-box">
        ⚠️ {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'

export default {
  props: {
    productGroups: {
      type: Array,
      default: () => []
    },
    banners: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      pasteData: '',
      parseResult: null,
      errorMessage: ''
    }
  },
  methods: {
    // Excel 파일 업로드
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      this.errorMessage = ''
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          
          this.parseResult = this.parseExcelData(firstSheet)
          
          if (this.$refs.fileInput) {
            this.$refs.fileInput.value = ''
          }
        } catch (error) {
          console.error('Excel 파싱 오류:', error)
          this.errorMessage = 'Excel 파일을 읽는 중 오류가 발생했습니다.'
        }
      }

      reader.readAsArrayBuffer(file)
    },

    // 붙여넣기 처리
    handlePaste(event) {
      event.preventDefault()
      
      this.errorMessage = ''
      const pastedText = event.clipboardData.getData('text')
      
      if (!pastedText) {
        this.errorMessage = '붙여넣기 데이터가 없습니다.'
        return
      }

      try {
        // TSV를 배열로 변환
        const rows = pastedText.trim().split('\n').map(row => row.split('\t'))
        
        if (rows.length === 0) {
          this.errorMessage = '데이터가 비어있습니다.'
          return
        }

        // 배열을 워크시트로 변환
        const worksheet = XLSX.utils.aoa_to_sheet(rows)
        
        this.parseResult = this.parseExcelData(worksheet)
        this.pasteData = '' // 텍스트 영역 클리어
      } catch (error) {
        console.error('붙여넣기 파싱 오류:', error)
        this.errorMessage = '데이터를 파싱하는 중 오류가 발생했습니다.'
      }
    },

    // Excel 데이터 파싱
    parseExcelData(sheet) {
      const rows = XLSX.utils.sheet_to_json(sheet)
      
      let headerData = null
      const groupsMap = new Map()
      const banners = []
      
      rows.forEach((row, index) => {
        const type = row['타입'] || row['TYPE']
        
        // HEADER 처리
        if (type === 'HEADER') {
          headerData = {
            headerImageCode: String(row['데이터1'] || row['DATA1'] || ''),
            headerImage: row['데이터2'] || row['DATA2'] || '',
            headerImageAlt: row['데이터3'] || row['DATA3'] || ''
          }
        }
        
        // GROUP 처리
        else if (type === 'GROUP') {
          const groupNum = row['그룹번호'] || row['GROUP_NO'] || 1
          
          if (!groupsMap.has(groupNum)) {
            groupsMap.set(groupNum, {
              id: Date.now() + groupNum,
              titleImage: {
                url: row['데이터1'] || row['DATA1'] || '',
                alt: row['데이터2'] || row['DATA2'] || ''
              },
              rows: []
            })
          }
          
          const group = groupsMap.get(groupNum)
          
          // 빈 행 체크
          const hasData = (row['데이터3'] || row['DATA3']) || (row['데이터4'] || row['DATA4'])
          
          if (hasData) {
            group.rows.push({
              id: Date.now() + Math.random(),
              products: [
                { 
                  productCode: String(row['데이터3'] || row['DATA3'] || ''), 
                  imageUrl: row['데이터4'] || row['DATA4'] || '', 
                  imageAlt: row['데이터5'] || row['DATA5'] || '' 
                },
                { 
                  productCode: String(row['데이터6'] || row['DATA6'] || ''), 
                  imageUrl: row['데이터7'] || row['DATA7'] || '', 
                  imageAlt: row['데이터8'] || row['DATA8'] || '' 
                },
                { 
                  productCode: String(row['데이터9'] || row['DATA9'] || ''), 
                  imageUrl: row['데이터10'] || row['DATA10'] || '', 
                  imageAlt: row['데이터11'] || row['DATA11'] || '' 
                }
              ]
            })
          }
        }
        
        // BANNER 처리
        else if (type === 'BANNER') {
          const eventCode = row['데이터1'] || row['DATA1']
          const imageUrl = row['데이터2'] || row['DATA2']
          
          if (eventCode && imageUrl) {
            banners.push({
              id: Date.now() + index,
              eventCode: String(eventCode),
              imageUrl: imageUrl,
              imageAlt: row['데이터3'] || row['DATA3'] || ''
            })
          }
        }
      })
      
      return {
        header: headerData,
        productGroups: Array.from(groupsMap.values()),
        banners: banners
      }
    },

    // 데이터 적용
    applyData() {
      if (!this.parseResult) return

      // 상단 이미지
      if (this.parseResult.header) {
        this.$emit('update:header', this.parseResult.header)
      }

      // 상품 그룹
      this.$emit('update:productGroups', this.parseResult.productGroups)

      // 배너
      this.$emit('update:banners', this.parseResult.banners)

      alert('✅ 데이터가 적용되었습니다!')
      this.parseResult = null
    },

    // 템플릿 다운로드
    downloadTemplate() {
      const wb = XLSX.utils.book_new()
      
      const templateData = [
        ['타입', '그룹번호', '데이터1', '데이터2', '데이터3', '데이터4', '데이터5', '데이터6', '데이터7', '데이터8', '데이터9', '데이터10', '데이터11'],
        ['HEADER', '-', '3515', 'https://www.efamilyshop.co.kr/storage/fud/20250513/visual.jpg', '상단 이미지 설명', '', '', '', '', '', '', '', ''],
        ['GROUP', '1', 'http://www.efamilyshop.co.kr/storage/fud/20250414/tit_01.jpg', '지금이 운동할 시기!', 'GD2024183099', 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_1.jpg', '프로-스펙스 밸런스쿠션', 'GD2024183079', 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_2.jpg', '프로-스펙스 땅콩 마사지볼', 'GD2024183031', 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_3.jpg', '프로-스펙스 안티버스트 짐볼'],
        ['GROUP', '1', '', '', 'GD2024178029', 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_4.jpg', 'S라인체중계', 'GD2024183114', 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_5.jpg', '멀티 짐볼 65cm', 'GD2024187759', 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_6.jpg', '스마트 훌라후프'],
        ['GROUP', '2', 'http://www.efamilyshop.co.kr/storage/fud/20250414/tit_02.jpg', '여름 특가!', 'GD2024183100', 'http://example.com/p7.jpg', '상품7', 'GD2024183101', 'http://example.com/p8.jpg', '상품8', 'GD2024183102', 'http://example.com/p9.jpg', '상품9'],
        ['BANNER', '-', '3664', 'http://www.efamilyshop.co.kr/storage/fud/20250910/bn_01.jpg', '주방가전&용품 기획전', '', '', '', '', '', '', '', ''],
        ['BANNER', '-', '3662', 'http://www.efamilyshop.co.kr/storage/fud/20250910/bn_02.jpg', '맞춤선물 기획전', '', '', '', '', '', '', '', '']
      ]
      
      const ws = XLSX.utils.aoa_to_sheet(templateData)
      
      // 컬럼 너비 설정
      ws['!cols'] = [
        { wch: 8 },  // 타입
        { wch: 10 }, // 그룹번호
        { wch: 60 }, // 데이터1
        { wch: 30 }, // 데이터2
        { wch: 15 }, // 데이터3
        { wch: 60 }, // 데이터4
        { wch: 30 }, // 데이터5
        { wch: 15 }, // 데이터6
        { wch: 60 }, // 데이터7
        { wch: 30 }, // 데이터8
        { wch: 15 }, // 데이터9
        { wch: 60 }, // 데이터10
        { wch: 30 }  // 데이터11
      ]
      
      XLSX.utils.book_append_sheet(wb, ws, '이패밀리샵_템플릿')
      
      XLSX.writeFile(wb, 'efamily_emtype4_template.xlsx')
    }
  }
}
</script>

<style scoped>
.efamily-excel-uploader {
  margin-top: 16px;
  margin-bottom: 24px;
}

.upload-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.button-group {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #10b981;
  color: #fff;
}

.btn-primary:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-secondary {
  background: #fff;
  color: #667eea;
}

.btn-secondary:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.btn-success {
  background: #10b981;
  color: #fff;
}

.btn-success:hover {
  background: #059669;
}

/* 붙여넣기 영역 */
.paste-area-wrapper {
  margin-top: 16px;
}

.paste-label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.paste-area {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  font-size: 11px;
  font-family: 'Consolas', 'Monaco', monospace;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: #374151;
  resize: vertical;
}

.paste-area:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.paste-area::placeholder {
  color: #9ca3af;
}

/* 안내 메시지 */
.info-box {
  margin-top: 16px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  font-size: 11px;
}

.info-box p {
  margin: 0 0 8px 0;
  color: #374151;
}

.info-box strong {
  color: #1f2937;
}

.info-box ul {
  margin: 8px 0;
  padding-left: 20px;
  color: #4b5563;
}

.info-box li {
  margin-bottom: 4px;
}

.tip {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
  color: #059669 !important;
  font-weight: 600;
}

/* 결과 박스 */
.result-box {
  margin-top: 16px;
  padding: 14px;
  background: rgba(16, 185, 129, 0.95);
  border-radius: 8px;
  color: #fff;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.result-title {
  font-size: 13px;
  font-weight: 600;
}

.result-stats {
  display: flex;
  gap: 16px;
  font-size: 11px;
}

.stat-item {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}

/* 에러 박스 */
.error-box {
  margin-top: 16px;
  padding: 12px;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  color: #dc2626;
  font-size: 12px;
  font-weight: 600;
}
</style>