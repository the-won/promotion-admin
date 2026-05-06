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
        class="card selectable"
        :class="{ 'flash-highlight': flashingId === productSet.id }"
        @click="selectProductSet(productSet.id)"
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
      localProducts: [],
      flashingId: null
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
    selectProductSet(id) {
      this.flashingId = id
      setTimeout(() => { this.flashingId = null }, 780)
      this.$emit('select-product', { refKey: 'hotdeal-row3-' + id })
    },
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

.card.flash-highlight {
  position: relative;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.15);
}

.card.flash-highlight::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid rgba(0, 113, 227, 0.65);
  border-radius: inherit;
  pointer-events: none;
  animation: flashRing 750ms cubic-bezier(0.22, 1, 0.36, 1) 1 forwards;
}

@keyframes flashRing {
  0%   { opacity: 1; transform: scale(1); }
  30%  { opacity: 1; transform: scale(1.03); }
  100% { opacity: 0; transform: scale(1.10); }
}
</style>