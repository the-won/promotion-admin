<template>
  <div class="hotdeal-excel-uploader">
    <div class="upload-card">
      <div class="upload-header">
        <h4>최저가보상<br> 상품 일괄 업로드</h4>
        <button @click="downloadTemplate" class="template-btn">
          엑셀 템플릿 다운로드
        </button>
      </div>

      <div class="upload-body">
        <!-- 탭 선택 -->
        <div class="tab-selector">
          <button 
            class="tab-btn" 
            :class="{ active: uploadMethod === 'excel' }"
            @click="uploadMethod = 'excel'"
          >
            📂 엑셀 파일
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: uploadMethod === 'paste' }"
            @click="uploadMethod = 'paste'"
          >
            📋 복사-붙여넣기
          </button>
        </div>

        <!-- 엑셀 업로드 방식 -->
        <div v-if="uploadMethod === 'excel'">
          <div class="upload-info">
            <p class="info-title">📋 엑셀 파일 형식</p>
            <ul class="info-list">
              <li><strong>1~3행:</strong> 1단 상품 (3개)</li>
              <li><strong>4~12행:</strong> 3단 상품 (9개, 3개씩 자동 묶음)</li>
              <li><strong>컬럼:</strong> 상품코드 | 대체텍스트 | 이미지URL</li>
            </ul>
          </div>

          <div class="upload-zone" :class="{ 'drag-over': isDragOver }" @dragover.prevent="isDragOver = true" @dragleave="isDragOver = false" @drop.prevent="handleDrop">
            <input 
              type="file" 
              ref="fileInput" 
              accept=".xlsx,.xls" 
              @change="handleFileSelect"
              style="display: none;"
            />
            
            <div v-if="!uploadedFile" class="upload-placeholder">
              <div class="upload-icon">📂</div>
              <p class="upload-text">엑셀 파일을 드래그하거나 클릭하여 선택하세요</p>
              <button @click="$refs.fileInput.click()" class="select-btn">
                파일 선택
              </button>
            </div>

            <div v-else class="upload-success">
              <div class="success-icon">✅</div>
              <p class="success-text">{{ uploadedFile.name }}</p>
              <button @click="clearFile" class="clear-btn">✕</button>
            </div>
          </div>

          <button 
            v-if="uploadedFile" 
            @click="processFile" 
            class="upload-btn"
            :disabled="isProcessing"
          >
            {{ isProcessing ? '처리 중...' : '📥 업로드 및 자동 적용' }}
          </button>
        </div>

        <!-- 복사-붙여넣기 방식 -->
        <div v-else>
          <div class="upload-info">
            <p class="info-title">📋 사용 방법</p>
            <ul class="info-list">
              <li>엑셀에서 데이터를 <strong>전체 선택</strong> 후 복사 (Ctrl+C)</li>
              <li>아래 입력창에 <strong>붙여넣기</strong> (Ctrl+V)</li>
              <li>1~3행: 1단 상품, 4~12행: 3단 상품 자동 인식</li>
            </ul>
          </div>

          <textarea
            v-model="pasteData"
            @paste="handlePaste"
            placeholder="엑셀 데이터를 여기에 붙여넣으세요&#10;&#10;상품코드    대체텍스트    이미지URL&#10;12345      상품1        http://..."
            class="paste-area"
            rows="12"
          ></textarea>

          <button 
            v-if="pasteData.trim()"
            @click="processPasteData" 
            class="upload-btn"
            :disabled="isProcessing"
          >
            {{ isProcessing ? '처리 중...' : '📥 데이터 적용' }}
          </button>
        </div>

        <div v-if="uploadResult" class="upload-result" :class="uploadResult.type">
          <p class="result-icon">{{ uploadResult.type === 'success' ? '✅' : '❌' }}</p>
          <div class="result-content">
            <p class="result-title">{{ uploadResult.title }}</p>
            <p class="result-message">{{ uploadResult.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'

export default {
  name: 'HotdealExcelUploader',
  props: {
    row1Products: {
      type: Array,
      default: () => []
    },
    row3Products: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      uploadedFile: null,
      isDragOver: false,
      isProcessing: false,
      uploadResult: null,
      uploadMethod: 'paste', // 'excel' 또는 'paste'
      pasteData: ''
    }
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.uploadedFile = file
        this.uploadResult = null
      }
    },
    
    handleDrop(event) {
      this.isDragOver = false
      const file = event.dataTransfer.files[0]
      
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        this.uploadedFile = file
        this.uploadResult = null
      } else {
        this.uploadResult = {
          type: 'error',
          title: '업로드 실패',
          message: '엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.'
        }
      }
    },
    
    clearFile() {
      this.uploadedFile = null
      this.uploadResult = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
    
    handlePaste(event) {
      // 붙여넣기 이벤트는 자동으로 처리됨
      this.uploadResult = null
    },
    
    processPasteData() {
      if (!this.pasteData.trim()) return
      
      this.isProcessing = true
      this.uploadResult = null
      
      try {
        // 탭 또는 여러 공백으로 구분된 데이터 파싱
        const lines = this.pasteData.trim().split('\n')
        const data = lines.map(line => {
          // 탭으로 구분 (엑셀 복사 시 기본)
          return line.split('\t').map(cell => cell.trim())
        })
        
        console.log('Pasted Data:', data.slice(0, 5))
        
        const result = this.parseExcelData(data)
        
        if (result.success) {
          this.$emit('update:row1Products', result.row1Products)
          this.$emit('update:row3Products', result.row3Products)
          
          this.uploadResult = {
            type: 'success',
            title: '적용 성공!',
            message: `1단 상품 ${result.row1Products.length}개, 3단 상품 ${result.row3Products.length}라인이 적용되었습니다.`
          }
          
          // 3초 후 데이터 클리어
          setTimeout(() => {
            this.pasteData = ''
            this.uploadResult = null
          }, 3000)
        } else {
          this.uploadResult = {
            type: 'error',
            title: '적용 실패',
            message: result.error
          }
        }
      } catch (error) {
        console.error('Paste processing error:', error)
        this.uploadResult = {
          type: 'error',
          title: '적용 실패',
          message: '데이터를 처리하는 중 오류가 발생했습니다.'
        }
      } finally {
        this.isProcessing = false
      }
    },
    
    async processFile() {
      if (!this.uploadedFile) return
      
      this.isProcessing = true
      this.uploadResult = null
      
      try {
        const data = await this.readExcelFile(this.uploadedFile)
        const result = this.parseExcelData(data)
        
        if (result.success) {
          this.$emit('update:row1Products', result.row1Products)
          this.$emit('update:row3Products', result.row3Products)
          
          this.uploadResult = {
            type: 'success',
            title: '업로드 성공!',
            message: `1단 상품 ${result.row1Products.length}개, 3단 상품 ${result.row3Products.length}라인이 적용되었습니다.`
          }
          
          // 3초 후 파일 클리어
          setTimeout(() => {
            this.clearFile()
          }, 3000)
        } else {
          this.uploadResult = {
            type: 'error',
            title: '업로드 실패',
            message: result.error
          }
        }
      } catch (error) {
        console.error('Excel processing error:', error)
        this.uploadResult = {
          type: 'error',
          title: '업로드 실패',
          message: '엑셀 파일을 읽는 중 오류가 발생했습니다.'
        }
      } finally {
        this.isProcessing = false
      }
    },
    
    readExcelFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = (e) => {
          try {
            const binaryStr = e.target.result
            const workbook = XLSX.read(binaryStr, { 
              type: 'binary',
              cellText: false,
              cellDates: true
            })
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
            
            // 시트를 JSON으로 변환 (값만 추출)
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { 
              header: 1,
              raw: false,
              blankrows: false
            })
            
            console.log('Raw Excel Data:', jsonData.slice(0, 5)) // 처음 5행 로그
            resolve(jsonData)
          } catch (error) {
            console.error('Excel read error:', error)
            reject(error)
          }
        }
        
        reader.onerror = () => reject(new Error('파일 읽기 실패'))
        reader.readAsBinaryString(file)
      })
    },
    
    parseExcelData(data) {
      try {
        // 헤더 제거 (첫 행이 '상품코드', '대체텍스트', '이미지URL'인 경우)
        const hasHeader = data[0] && (
          String(data[0][0]).includes('상품') || 
          String(data[0][0]).includes('코드') ||
          String(data[0][0]).toLowerCase().includes('product')
        )
        
        const rows = hasHeader ? data.slice(1) : data
        
        // 빈 행 제거 및 데이터 정제
        const validRows = rows.filter(row => {
          if (!row || row.length < 3) return false
          const productId = String(row[0] || '').trim()
          return productId.length > 0
        })
        
        if (validRows.length < 12) {
          return {
            success: false,
            error: `최소 12개의 상품이 필요합니다. (현재: ${validRows.length}개)`
          }
        }
        
        // 1단 상품 (1~3행)
        const row1Products = validRows.slice(0, 3).map((row, index) => ({
          id: Date.now() + index,
          productId: String(row[0] || '').trim(),
          imageAlt: String(row[1] || '').trim(),
          imageUrl: String(row[2] || '').trim()
        }))
        
        // 3단 상품 (4~12행, 3개씩 묶음)
        const row3Data = validRows.slice(3, 12)
        const row3Products = []
        
        for (let i = 0; i < row3Data.length; i += 3) {
          if (i + 2 < row3Data.length) {
            row3Products.push({
              id: Date.now() + 100 + i,
              products: [
                {
                  productId: String(row3Data[i][0] || '').trim(),
                  imageAlt: String(row3Data[i][1] || '').trim(),
                  imageUrl: String(row3Data[i][2] || '').trim()
                },
                {
                  productId: String(row3Data[i + 1][0] || '').trim(),
                  imageAlt: String(row3Data[i + 1][1] || '').trim(),
                  imageUrl: String(row3Data[i + 1][2] || '').trim()
                },
                {
                  productId: String(row3Data[i + 2][0] || '').trim(),
                  imageAlt: String(row3Data[i + 2][1] || '').trim(),
                  imageUrl: String(row3Data[i + 2][2] || '').trim()
                }
              ]
            })
          }
        }
        
        // 디버그: 콘솔에 첫 번째 데이터 출력
        console.log('첫 번째 1단 상품:', row1Products[0])
        console.log('첫 번째 3단 상품 세트:', row3Products[0])
        
        return {
          success: true,
          row1Products,
          row3Products
        }
      } catch (error) {
        console.error('Parse error:', error)
        return {
          success: false,
          error: '데이터 형식이 올바르지 않습니다.'
        }
      }
    },
    
    downloadTemplate() {
      // 엑셀 템플릿 생성
      const templateData = [
        ['상품코드', '대체텍스트', '이미지URL'],
        ['12345', '1단 상품1', 'https://example.com/image1.jpg'],
        ['12346', '1단 상품2', 'https://example.com/image2.jpg'],
        ['12347', '1단 상품3', 'https://example.com/image3.jpg'],
        ['12348', '3단 상품1-1', 'https://example.com/image4.jpg'],
        ['12349', '3단 상품1-2', 'https://example.com/image5.jpg'],
        ['12350', '3단 상품1-3', 'https://example.com/image6.jpg'],
        ['12351', '3단 상품2-1', 'https://example.com/image7.jpg'],
        ['12352', '3단 상품2-2', 'https://example.com/image8.jpg'],
        ['12353', '3단 상품2-3', 'https://example.com/image9.jpg'],
        ['12354', '3단 상품3-1', 'https://example.com/image10.jpg'],
        ['12355', '3단 상품3-2', 'https://example.com/image11.jpg'],
        ['12356', '3단 상품3-3', 'https://example.com/image12.jpg']
      ]
      
      const ws = XLSX.utils.aoa_to_sheet(templateData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '화끈딜상품')
      
      // 파일 다운로드
      XLSX.writeFile(wb, '화끈딜_상품_템플릿.xlsx')
    }
  }
}
</script>

<style scoped>
.hotdeal-excel-uploader {
  margin-bottom: 16px;
}

.upload-card {
  background: var(--color-bg, #fff);
  border: 1px solid var(--color-border, #d2d2d7);
  border-radius: 6px;
  overflow: hidden;
}

.upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: var(--color-primary, #0071e3);
  color: #fff;
}

.upload-header h4 {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
}

.template-btn {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s;
}

.template-btn:hover {
  background: rgba(255, 255, 255, 0.28);
}

.upload-body {
  padding: 12px;
}

.tab-selector {
  display: flex;
  margin-bottom: 14px;
  background: var(--color-bg-secondary, #f5f5f7);
  border: 1px solid var(--color-border, #d2d2d7);
  border-radius: 4px;
  padding: 3px;
  gap: 2px;
}

.tab-btn {
  flex: 1;
  padding: 6px 8px;
  background: transparent;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary, #6e6e73);
  transition: background 0.15s, color 0.15s;
}

.tab-btn:hover {
  color: var(--color-text, #1d1d1f);
  background: rgba(0, 0, 0, 0.04);
}

.tab-btn.active {
  background: var(--color-bg, #fff);
  color: var(--color-primary, #0071e3);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.upload-info {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 4px;
  padding: 10px 12px;
  margin-bottom: 12px;
}

.info-title {
  margin: 0 0 6px;
  font-weight: 600;
  color: #0369a1;
  font-size: 11px;
}

.info-list {
  margin: 0;
  padding-left: 16px;
  color: #0c4a6e;
  font-size: 11px;
  line-height: 1.7;
}

.info-list li { margin-bottom: 2px; }

.upload-zone {
  border: 2px dashed var(--color-border, #d2d2d7);
  border-radius: 6px;
  padding: 28px 16px;
  text-align: center;
  transition: border-color 0.2s, background 0.2s;
  cursor: pointer;
  background: var(--color-bg-secondary, #f5f5f7);
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: var(--color-primary, #0071e3);
  background: rgba(0, 113, 227, 0.04);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  font-size: 32px;
  opacity: 0.4;
}

.upload-text {
  margin: 0;
  color: var(--color-text-secondary, #6e6e73);
  font-size: 11px;
}

.select-btn {
  padding: 5px 14px;
  background: var(--color-primary, #0071e3);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: background 0.15s;
}

.select-btn:hover {
  background: var(--color-primary-hover, #0077ed);
}

.upload-success {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 4px;
}

.success-icon { font-size: 13px; }

.success-text {
  flex: 1;
  margin: 0;
  color: #166534;
  font-weight: 500;
  font-size: 12px;
  word-break: break-all;
}

.clear-btn {
  width: 22px;
  height: 22px;
  background: var(--color-danger, #dc2626);
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}

.clear-btn:hover { background: var(--color-danger-hover, #b91c1c); }

.paste-area {
  width: 100%;
  padding: 10px 12px;
  background: var(--color-bg-secondary, #f5f5f7);
  border: 1px solid var(--color-border, #d2d2d7);
  border-radius: 4px;
  font-family: 'SF Mono', ui-monospace, 'Cascadia Code', monospace;
  font-size: 11px;
  line-height: 1.6;
  color: var(--color-text, #1d1d1f);
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}

.paste-area:focus {
  outline: none;
  border-color: var(--color-primary, #0071e3);
  background: var(--color-bg, #fff);
  box-shadow: 0 0 0 2px rgba(0, 113, 227, 0.12);
}

.paste-area::placeholder {
  color: var(--color-text-placeholder, #aeaeb2);
}

.upload-btn {
  width: 100%;
  padding: 10px;
  background: var(--color-success, #059669);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  margin-top: 12px;
  transition: background 0.15s;
}

.upload-btn:hover:not(:disabled) {
  background: var(--color-success-hover, #047857);
}

.upload-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.upload-result {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 4px;
  margin-top: 12px;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.upload-result.success {
  background: #f0fdf4;
  border: 1px solid #86efac;
}

.upload-result.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.result-icon { font-size: 13px; margin: 0; }
.result-content { flex: 1; }

.result-title {
  margin: 0 0 2px;
  font-weight: 600;
  font-size: 12px;
}

.upload-result.success .result-title { color: #166534; }
.upload-result.error  .result-title { color: #991b1b; }

.result-message {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
}

.upload-result.success .result-message { color: #15803d; }
.upload-result.error  .result-message { color: #b91c1c; }

/* ================================
   다크 모드
   ================================ */

.dark-mode .upload-card {
  background: #1c1c1e;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .tab-selector {
  background: #2c2c2e;
  border-color: rgba(255, 255, 255, 0.08);
}

.dark-mode .tab-btn {
  color: rgba(255, 255, 255, 0.42);
}

.dark-mode .tab-btn:hover {
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.06);
}

.dark-mode .tab-btn.active {
  background: #3a3a3c;
  color: #0a84ff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}

.dark-mode .upload-info {
  background: rgba(3, 105, 161, 0.12);
  border-color: rgba(186, 230, 253, 0.14);
}

.dark-mode .info-title { color: #38bdf8; }

.dark-mode .info-list { color: rgba(186, 230, 253, 0.7); }

.dark-mode .upload-zone {
  background: #2c2c2e;
  border-color: rgba(255, 255, 255, 0.12);
}

.dark-mode .upload-zone:hover,
.dark-mode .upload-zone.drag-over {
  border-color: #0a84ff;
  background: rgba(10, 132, 255, 0.07);
}

.dark-mode .upload-text { color: rgba(255, 255, 255, 0.38); }

.dark-mode .select-btn { background: #0a84ff; }
.dark-mode .select-btn:hover { background: #409cff; }

.dark-mode .upload-success {
  background: rgba(52, 211, 153, 0.08);
  border-color: rgba(52, 211, 153, 0.22);
}

.dark-mode .success-text { color: #34d399; }

.dark-mode .paste-area {
  background: #2c2c2e;
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.88);
}

.dark-mode .paste-area:focus {
  border-color: #0a84ff;
  background: #3a3a3c;
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.18);
}

.dark-mode .paste-area::placeholder { color: rgba(255, 255, 255, 0.22); }

.dark-mode .upload-result.success {
  background: rgba(52, 211, 153, 0.08);
  border-color: rgba(52, 211, 153, 0.2);
}

.dark-mode .upload-result.error {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.2);
}

.dark-mode .upload-result.success .result-title   { color: #34d399; }
.dark-mode .upload-result.error  .result-title   { color: #f87171; }
.dark-mode .upload-result.success .result-message { color: #6ee7b7; }
.dark-mode .upload-result.error  .result-message { color: #fca5a5; }
</style>