<template>
  <div class="hotdeal-row3-editor">
    <div class="section-header">
      <h4>화끈딜 3단 상품</h4>
      <button @click="addRow" class="btn btn-success">3행 추가</button>
    </div>

    <div v-if="localProducts.length === 0" class="empty-state">
      3단 상품을 추가하세요.
    </div>

    <div class="items-grid">
      <div 
        v-for="(productSet, index) in localProducts" 
        :key="productSet.id" 
        class="card"
      >
        <div class="card-header card-header-orange">
          <span class="card-title">3X3 상품 {{ index + 1 }}라인</span>
          <button @click="removeRow(index)" class="btn btn-danger btn-sm">삭제</button>
        </div>

        <!-- 상품 1 -->
        <div class="form-row mb-3">
          <div class="form-group">
            <label>상품코드 1</label>
            <input 
              type="text" 
              v-model="productSet.products[0].productId"
              placeholder="상품코드"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>대체 텍스트 1</label>
            <input 
              type="text" 
              v-model="productSet.products[0].imageAlt"
              placeholder="대체 텍스트"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>이미지 URL 1</label>
            <input 
              type="url" 
              v-model="productSet.products[0].imageUrl"
              placeholder="이미지 URL"
              class="form-input"
            />
          </div>
        </div>

        <!-- 상품 2 -->
        <div class="form-row mb-3">
          <div class="form-group">
            <label>상품코드 2</label>
            <input 
              type="text" 
              v-model="productSet.products[1].productId"
              placeholder="상품코드"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>대체 텍스트 2</label>
            <input 
              type="text" 
              v-model="productSet.products[1].imageAlt"
              placeholder="대체 텍스트"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>이미지 URL 2</label>
            <input 
              type="url" 
              v-model="productSet.products[1].imageUrl"
              placeholder="이미지 URL"
              class="form-input"
            />
          </div>
        </div>

        <!-- 상품 3 -->
        <div class="form-row">
          <div class="form-group">
            <label>상품코드 3</label>
            <input 
              type="text" 
              v-model="productSet.products[2].productId"
              placeholder="상품코드"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>대체 텍스트 3</label>
            <input 
              type="text" 
              v-model="productSet.products[2].imageAlt"
              placeholder="대체 텍스트"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>이미지 URL 3</label>
            <input 
              type="url" 
              v-model="productSet.products[2].imageUrl"
              placeholder="이미지 URL"
              class="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      localProducts: []
    }
  },
  created() {
    this.localProducts = this.value ? JSON.parse(JSON.stringify(this.value)) : []
  },
  watch: {
    value: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localProducts)) {
          this.localProducts = newVal ? JSON.parse(JSON.stringify(newVal)) : []
        }
      },
      deep: true
    },
    localProducts: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.value)) {
          this.$emit('input', JSON.parse(JSON.stringify(val)))
        }
      },
      deep: true
    }
  },
  methods: {
    addRow() {
      this.localProducts.push({
        id: Date.now(),
        products: [
          { productId: '', imageUrl: '', imageAlt: '' },
          { productId: '', imageUrl: '', imageAlt: '' },
          { productId: '', imageUrl: '', imageAlt: '' }
        ]
      })
    },
    removeRow(index) {
      this.localProducts.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.hotdeal-row3-editor {
  margin-top: 16px;
}

.card-header-orange {
  border-bottom-color: #ff6b35;
}

.card-header-orange .card-title {
  color: #ff6b35;
}
</style>