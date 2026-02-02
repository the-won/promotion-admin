<template>
  <div class="hotdeal-row3-editor">
    <div class="header">
      <h4>화끈딜 3단 상품</h4>
      <button @click="addRow" class="add-btn">+ 3행 추가</button>
    </div>

    <div v-if="localProducts.length === 0" class="empty-state">
      3단 상품을 추가하세요.
    </div>

    <div 
      v-for="(productSet, index) in localProducts" 
      :key="productSet.id" 
      class="product-set-item"
    >
      <div class="product-set-header">
        <span class="product-set-title">3X3 상품 {{ index + 1 }}라인</span>
        <button @click="removeRow(index)" class="delete-btn">🗑️</button>
      </div>

      <!-- 상품 1 -->
      <div class="form-row">
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
      <div class="form-row">
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

.product-set-item {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.product-set-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ff6b35;
}

.product-set-title {
  font-weight: bold;
  color: #ff6b35;
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
  margin-bottom: 15px;
}

.form-row:last-child {
  margin-bottom: 0;
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