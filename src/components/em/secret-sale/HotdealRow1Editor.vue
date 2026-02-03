<template>
  <div class="hotdeal-row1-editor">
    <div class="section-header">
      <h4>화끈딜 1단 상품</h4>
      <button @click="addRow" class="btn btn-success">1행 추가</button>
    </div>

    <div v-if="localProducts.length === 0" class="empty-state">
      1단 상품을 추가하세요.
    </div>

    <div class="items-grid">
      <div 
        v-for="(product, index) in localProducts" 
        :key="product.id" 
        class="card"
      >
        <div class="card-header">
          <span class="card-title">1X1 상품 {{ index + 1 }}</span>
          <button @click="removeRow(index)" class="btn btn-danger btn-sm">삭제</button>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>상품코드</label>
            <input 
              type="text" 
              v-model="product.productId"
              placeholder="상품코드"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>대체 텍스트</label>
            <input 
              type="text" 
              v-model="product.imageAlt"
              placeholder="대체 텍스트"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>이미지 URL</label>
            <input 
              type="url" 
              v-model="product.imageUrl"
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
        productId: '',
        imageUrl: '',
        imageAlt: ''
      })
    },
    removeRow(index) {
      this.localProducts.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.hotdeal-row1-editor {
  margin-top: 16px;
}
</style>