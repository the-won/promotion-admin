<template>
  <div class="product-group-list-editor">
    <div class="section-header">
      <h4>상품 그룹 관리</h4>
      <button @click="addGroup" class="btn btn-success">새 그룹 추가</button>
    </div>

    <div v-if="localGroups.length === 0" class="empty-state">
      상품 그룹을 추가하세요.
    </div>

    <!-- 각 그룹 -->
    <div 
      v-for="(group, groupIndex) in localGroups" 
      :key="group.id"
      class="group-wrapper"
    >
      <!-- 그룹 헤더 -->
      <div class="group-header">
        <span class="group-title">📦 상품 그룹 {{ groupIndex + 1 }}</span>
        <button 
          @click="removeGroup(group.id)" 
          class="btn btn-danger btn-sm"
          :disabled="localGroups.length === 1"
        >
          그룹 삭제
        </button>
      </div>

      <!-- 타이틀 이미지 -->
      <div class="title-image-section">
        <div class="form-row">
          <div class="form-group">
            <label>타이틀 이미지 URL</label>
            <input 
              type="url" 
              v-model="group.titleImage.url"
              placeholder="http://www.efamilyshop.co.kr/storage/..."
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>타이틀 대체 텍스트</label>
            <input 
              type="text" 
              v-model="group.titleImage.alt"
              placeholder="예: 지금이 운동할 시기!"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- items-grid -->
      <div class="items-grid">
        <!-- 각 행 (card) -->
        <div 
          v-for="(row, rowIndex) in group.rows" 
          :key="row.id"
          class="card"
        >
          <div class="card-header card-header-orange">
            <span class="card-title">🛍️ 상품 행 {{ rowIndex + 1 }} (3개)</span>
            <button 
              @click="removeRow(group.id, row.id)" 
              class="btn btn-danger btn-sm"
              :disabled="group.rows.length === 1"
            >
              삭제
            </button>
          </div>

          <!-- 상품 1 -->
          <div class="form-row mb-3">
            <div class="form-group">
              <label>상품코드</label>
              <input 
                type="text" 
                v-model="row.products[0].productCode"
                placeholder="상품코드"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>대체 텍스트</label>
              <input 
                type="text" 
                v-model="row.products[0].imageAlt"
                placeholder="대체 텍스트"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>이미지 URL</label>
              <input 
                type="url" 
                v-model="row.products[0].imageUrl"
                placeholder="이미지 URL"
                class="form-input"
              />
            </div>
          </div>

          <!-- 상품 2 -->
          <div class="form-row mb-3">
            <div class="form-group">
              <label>상품코드</label>
              <input 
                type="text" 
                v-model="row.products[1].productCode"
                placeholder="상품코드"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>대체 텍스트</label>
              <input 
                type="text" 
                v-model="row.products[1].imageAlt"
                placeholder="대체 텍스트"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>이미지 URL</label>
              <input 
                type="url" 
                v-model="row.products[1].imageUrl"
                placeholder="이미지 URL"
                class="form-input"
              />
            </div>
          </div>

          <!-- 상품 3 -->
          <div class="form-row">
            <div class="form-group">
              <label>상품코드</label>
              <input 
                type="text" 
                v-model="row.products[2].productCode"
                placeholder="상품코드"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>대체 텍스트</label>
              <input 
                type="text" 
                v-model="row.products[2].imageAlt"
                placeholder="대체 텍스트"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>이미지 URL</label>
              <input 
                type="url" 
                v-model="row.products[2].imageUrl"
                placeholder="이미지 URL"
                class="form-input"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 행 추가 버튼 -->
      <div class="text-center mt-3 mb-4">
        <button @click="addRow(group.id)" class="btn btn-success">
          상품 행 추가 (3개 묶음)
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localGroups: []
    }
  },
  created() {
    this.localGroups = this.value && this.value.length > 0 
      ? JSON.parse(JSON.stringify(this.value)) 
      : [this.createNewGroup()]
  },
  watch: {
    value: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localGroups)) {
          this.localGroups = newVal && newVal.length > 0
            ? JSON.parse(JSON.stringify(newVal))
            : [this.createNewGroup()]
        }
      },
      deep: true
    },
    localGroups: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.value)) {
          this.$emit('input', JSON.parse(JSON.stringify(val)))
        }
      },
      deep: true
    }
  },
  methods: {
    createNewGroup() {
      return {
        id: Date.now(),
        titleImage: {
          url: '',
          alt: ''
        },
        rows: [this.createNewRow()]
      }
    },
    
    createNewRow() {
      return {
        id: Date.now() + Math.random(),
        products: [
          { productCode: '', imageUrl: '', imageAlt: '' },
          { productCode: '', imageUrl: '', imageAlt: '' },
          { productCode: '', imageUrl: '', imageAlt: '' }
        ]
      }
    },
    
    addGroup() {
      this.localGroups.push(this.createNewGroup())
    },
    
    removeGroup(groupId) {
      const index = this.localGroups.findIndex(g => g.id === groupId)
      if (index !== -1) {
        if (this.localGroups.length === 1) {
          alert('최소 1개의 그룹이 필요합니다.')
          return
        }
        this.localGroups.splice(index, 1)
      }
    },
    
    addRow(groupId) {
      const group = this.localGroups.find(g => g.id === groupId)
      if (group) {
        group.rows.push(this.createNewRow())
      }
    },
    
    removeRow(groupId, rowId) {
      const group = this.localGroups.find(g => g.id === groupId)
      if (group) {
        const index = group.rows.findIndex(r => r.id === rowId)
        if (index !== -1) {
          if (group.rows.length === 1) {
            alert('최소 1개의 행이 필요합니다.')
            return
          }
          group.rows.splice(index, 1)
        }
      }
    }
  }
}
</script>

<style scoped>
.product-group-list-editor {
  margin-top: 16px;
}

/* 섹션 헤더 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text, #2d3748);
}

/* Empty State */
.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--color-text-secondary, #64748b);
  background: var(--color-bg-secondary, #f5f6fa);
  border-radius: var(--form-radius, 8px);
  border: 2px dashed var(--color-border, #e8ebf0);
}

/* 그룹 래퍼 */
.group-wrapper {
  /* margin-bottom: 32px;
  padding: 20px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px; */
}

.group-wrapper:last-child {
  margin-bottom: 0;
}

/* 그룹 헤더 */
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

/* 타이틀 이미지 섹션 */
.title-image-section {
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
/* 템플릿 설정 확장 케이스 */
.expanded .group-wrapper .items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px 16px;
}
</style>
