<template>
  <div class="hotdeal-row1-editor">
    <div class="header">
      <h4>화끈딜 1단 상품</h4>
      <button @click="addRow" class="add-btn">+ 1행 추가</button>
    </div>

    <div v-if="localProducts.length === 0" class="empty-state">
      1단 상품을 추가하세요.
    </div>

    <div 
      v-for="(product, index) in localProducts" 
      :key="product.id" 
      class="product-item"
    >
      <div class="product-header">
        <span class="product-title">1X1 상품 {{ index + 1 }}</span>
        <button @click="removeRow(index)" class="delete-btn">🗑️</button>
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
  margin-top: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.add-btn {
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.add-btn:hover {
  background: #218838;
}

.empty-state {
  padding: 30px;
  text-align: center;
  color: #999;
  background: #f9f9f9;
  border: 2px dashed #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.product-item {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #007bff;
}

.product-title {
  font-weight: bold;
  color: #007bff;
  font-size: 15px;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background: #c82333;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 13px;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
</style>