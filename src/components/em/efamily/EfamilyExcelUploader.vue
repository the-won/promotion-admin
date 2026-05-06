<template>
  <div class="efamily-excel-uploader">
    <div class="upload-card">
      <div class="upload-header">
        <h4>이패밀리샵<br> 상품 일괄 업로드</h4>
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
              <li><strong>상단:</strong> 헤더 이미지 (타이틀이미지, 타이틀설명, 상품코드1에 헤더코드)</li>
              <li><strong>타이틀:</strong> 그룹 타이틀 (타이틀이미지, 타이틀설명)</li>
              <li><strong>상품:</strong> 3개 묶음 (상품코드1~3, 상품이미지1~3, 상품설명1~3)</li>
              <li><strong>배너:</strong> 하단 배너 (타이틀이미지, 타이틀설명, 상품코드1에 이벤트코드)</li>
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
              <li>상단/타이틀/상품/배너 자동 인식</li>
            </ul>
          </div>

          <textarea
            v-model="pasteData"
            @paste="handlePaste"
            placeholder="엑셀 데이터를 여기에 붙여넣으세요&#10;&#10;구분    그룹    타이틀이미지    타이틀설명    상품코드1    ...&#10;상단    -       http://...      헤더설명      3515         ..."
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
  name: 'EfamilyExcelUploader',
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
      uploadedFile: null,
      isDragOver: false,
      isProcessing: false,
      uploadResult: null,
      uploadMethod: 'paste',
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
    
    handlePaste(_event) {
      // 붙여넣기 이벤트는 자동으로 처리됨
      this.uploadResult = null
    },
    
    processPasteData() {
      if (!this.pasteData.trim()) return
      
      this.isProcessing = true
      this.uploadResult = null
      
      try {
        // 탭으로 구분된 데이터 파싱
        const lines = this.pasteData.trim().split('\n')
        const data = lines.map(line => line.split('\t').map(cell => cell.trim()))
        
        console.log('Pasted Data:', data.slice(0, 5))
        
        const result = this.parseExcelData(data)
        
        if (result.success) {
          this.$emit('update:header', result.header)
          this.$emit('update:productGroups', result.productGroups)
          this.$emit('update:banners', result.banners)
          
          this.uploadResult = {
            type: 'success',
            title: '적용 성공!',
            message: `상단: ${result.header ? '✓' : '✗'}, 상품 그룹: ${result.productGroups.length}개, 배너: ${result.banners.length}개가 적용되었습니다.`
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
          this.$emit('update:header', result.header)
          this.$emit('update:productGroups', result.productGroups)
          this.$emit('update:banners', result.banners)
          
          this.uploadResult = {
            type: 'success',
            title: '업로드 성공!',
            message: `상단: ${result.header ? '✓' : '✗'}, 상품 그룹: ${result.productGroups.length}개, 배너: ${result.banners.length}개가 적용되었습니다.`
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
            
            // 시트를 JSON으로 변환
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { 
              header: 1,
              raw: false,
              blankrows: false
            })
            
            console.log('Raw Excel Data:', jsonData.slice(0, 5))
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
        // 헤더 제거 (첫 행이 컬럼명인 경우)
        const hasHeader = data[0] && (
          String(data[0][0]).includes('구분') || 
          String(data[0][0]).includes('타입') ||
          String(data[0][0]).toLowerCase().includes('type')
        )
        
        const rows = hasHeader ? data.slice(1) : data
        
        let headerData = null
        const groupsMap = new Map()
        const banners = []
        
        rows.forEach((row, index) => {
          if (!row || row.length < 4) return
          
          const type = String(row[0] || '').trim()
          const groupNum = String(row[1] || '').trim()
          
          // 상단 처리
          if (type === '상단') {
            headerData = {
              headerImageCode: String(row[4] || '').trim(),
              headerImage: String(row[2] || '').trim(),
              headerImageAlt: String(row[3] || '').trim()
            }
          }
          
          // 타이틀 처리 (새 그룹 시작)
          else if (type === '타이틀') {
            groupsMap.set(groupNum, {
              id: Date.now() + Number(groupNum) || index,
              titleImage: {
                url: String(row[2] || '').trim(),
                alt: String(row[3] || '').trim()
              },
              rows: []
            })
          }
          
          // 상품 처리
          else if (type === '상품') {
            const group = groupsMap.get(groupNum)
            
            if (!group) {
              console.warn(`그룹 ${groupNum}의 타이틀이 없습니다.`)
              return
            }
            
            // 빈 행 체크
            const hasData = row[4] || row[5]
            
            if (hasData) {
              group.rows.push({
                id: Date.now() + Math.random(),
                products: [
                  { 
                    productCode: String(row[4] || '').trim(),
                    imageUrl: String(row[5] || '').trim(),
                    imageAlt: String(row[6] || '').trim()
                  },
                  { 
                    productCode: String(row[7] || '').trim(),
                    imageUrl: String(row[8] || '').trim(),
                    imageAlt: String(row[9] || '').trim()
                  },
                  { 
                    productCode: String(row[10] || '').trim(),
                    imageUrl: String(row[11] || '').trim(),
                    imageAlt: String(row[12] || '').trim()
                  }
                ]
              })
            }
          }
          
          // 배너 처리
          else if (type === '배너') {
            const eventCode = String(row[4] || '').trim()
            const imageUrl = String(row[2] || '').trim()
            
            if (eventCode && imageUrl) {
              banners.push({
                id: Date.now() + index,
                eventCode: eventCode,
                imageUrl: imageUrl,
                imageAlt: String(row[3] || '').trim()
              })
            }
          }
        })
        
        return {
          success: true,
          header: headerData,
          productGroups: Array.from(groupsMap.values()),
          banners: banners
        }
      } catch (error) {
        console.error('Parse error:', error)
        return {
          success: false,
          error: '데이터 파싱 중 오류가 발생했습니다: ' + error.message
        }
      }
    },
    
    downloadTemplate() {
      const wb = XLSX.utils.book_new()
      
      const templateData = [
        ['구분', '그룹', '타이틀이미지', '타이틀설명', '상품코드1', '상품이미지1', '상품설명1', '상품코드2', '상품이미지2', '상품설명2', '상품코드3', '상품이미지3', '상품설명3'],
        ['상단', '-', 'https://www.efamilyshop.co.kr/storage/fud/20250513/visual_20250513162322.jpg', '대체텍스트를 작성하세요', '3515', '', '', '', '', '', '', '', ''],
        ['타이틀', '1', 'http://www.efamilyshop.co.kr/storage/fud/20250414/tit_01_20250414144147.jpg', '지금이 운동할 시기!', '', '', '', '', '', '', '', '', ''],
        ['상품', '1', '', '', 'GD2024183099', 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_1_20250414144147.jpg', '프로-스펙스 밸런스쿠션', 'GD2024183079', 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_2_20250414144147.jpg', '프로-스펙스 땅콩 마사지볼', 'GD2024183031', 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_3_20250414144147.jpg', '프로-스펙스 안티버스트 짐볼'],
        ['상품', '1', '', '', 'GD2024178029', 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_4_20250414144147.jpg', 'S라인체중계', 'GD2024183114', 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_5_20250414144147.jpg', '멀티 짐볼 65cm', 'GD2024187759', 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_6_20250414144147.jpg', '스마트 훌라후프'],
        ['타이틀', '2', 'http://www.efamilyshop.co.kr/storage/fud/20250414/tit_02_20250414144147.jpg', '여름 특가 상품!', '', '', '', '', '', '', '', '', ''],
        ['상품', '2', '', '', 'GD2024183100', 'http://example.com/product7.jpg', '여름상품1', 'GD2024183101', 'http://example.com/product8.jpg', '여름상품2', 'GD2024183102', 'http://example.com/product9.jpg', '여름상품3'],
        ['배너', '-', 'http://www.efamilyshop.co.kr/storage/fud/20250910/bn_01_20250910134541.jpg', '주방가전&용품 기획전', '3664', '', '', '', '', '', '', '', ''],
        ['배너', '-', 'http://www.efamilyshop.co.kr/storage/fud/20250910/bn_02_20250910134541.jpg', '맞춤선물 기획전', '3662', '', '', '', '', '', '', '', '']
      ]
      
      const ws = XLSX.utils.aoa_to_sheet(templateData)
      
      // 컬럼 너비 설정
      ws['!cols'] = [
        { wch: 8 },  // 구분
        { wch: 6 },  // 그룹
        { wch: 70 }, // 타이틀이미지
        { wch: 25 }, // 타이틀설명
        { wch: 15 }, // 상품코드1
        { wch: 70 }, // 상품이미지1
        { wch: 25 }, // 상품설명1
        { wch: 15 }, // 상품코드2
        { wch: 70 }, // 상품이미지2
        { wch: 25 }, // 상품설명2
        { wch: 15 }, // 상품코드3
        { wch: 70 }, // 상품이미지3
        { wch: 25 }  // 상품설명3
      ]
      
      XLSX.utils.book_append_sheet(wb, ws, '이패밀리샵_EmType4')
      XLSX.writeFile(wb, '이패밀리샵_상품_템플릿.xlsx')
    }
  }
}
</script>

<style scoped>
.efamily-excel-uploader {
  margin-bottom: 16px;
}

.upload-card {
  background: #fff;
  border: 1px solid #d2d2d7;
  border-radius: 6px;
  overflow: hidden;
}

.upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #0071e3;
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
  background: #f5f5f7;
  border: 1px solid #d2d2d7;
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
  color: #6e6e73;
  transition: background 0.15s, color 0.15s;
}

.tab-btn:hover {
  color: #1d1d1f;
  background: rgba(0, 0, 0, 0.04);
}

.tab-btn.active {
  background: #fff;
  color: #0071e3;
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
  border: 2px dashed #d2d2d7;
  border-radius: 6px;
  padding: 28px 16px;
  text-align: center;
  transition: border-color 0.2s, background 0.2s;
  cursor: pointer;
  background: #f5f5f7;
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: #0071e3;
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
  color: #6e6e73;
  font-size: 11px;
}

.select-btn {
  padding: 5px 14px;
  background: #0071e3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: background 0.15s;
}

.select-btn:hover {
  background: #0077ed;
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
  background: #dc2626;
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

.clear-btn:hover { background: #b91c1c; }

.paste-area {
  width: 100%;
  padding: 10px 12px;
  background: #f5f5f7;
  border: 1px solid #d2d2d7;
  border-radius: 4px;
  font-family: 'SF Mono', ui-monospace, 'Cascadia Code', monospace;
  font-size: 11px;
  line-height: 1.6;
  color: #1d1d1f;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}

.paste-area:focus {
  outline: none;
  border-color: #0071e3;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(0, 113, 227, 0.12);
}

.paste-area::placeholder {
  color: #aeaeb2;
}

.upload-btn {
  width: 100%;
  padding: 10px;
  background: #059669;
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
  background: #047857;
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

/* Dark Mode */
.dark-mode .upload-card {
  background: #1c1c1e;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .tab-selector {
  background: #2c2c2e;
  border-color: rgba(255, 255, 255, 0.08);
}

.dark-mode .tab-btn { color: rgba(255, 255, 255, 0.42); }

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
.dark-mode .info-list  { color: rgba(186, 230, 253, 0.7); }

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
.dark-mode .select-btn  { background: #0a84ff; }
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