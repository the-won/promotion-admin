<template>
  <div class="hotdeal-row1-editor">
    <div v-if="localProducts.length === 0" class="empty-state">
      1단 상품을 추가하세요.
    </div>

    <div class="items-grid">
      <div
        v-for="(product, index) in localProducts"
        :key="product.id"
        v-show="selectedIndex === null || selectedIndex === index"
        :data-product-id="product.id"
        class="card selectable"
        :class="{ 'flash-highlight': flashingId === product.id }"
        @click="selectProduct(product.id)"
      >
        <div class="card-header">
          <span class="card-title">1X1 상품 {{ index + 1 }}</span>
          <button @click.stop="removeRow(index)" class="btn btn-danger btn-sm">삭제</button>
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

    <!-- 새 상품 추가 버튼 -->
    <div class="text-center mt-4">
      <button @click="addRow" class="btn btn-primary btn-lg">새 1단 상품 추가</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: Array, default: () => [] },
    selectedIndex: { type: Number, default: null },
    sidebarFocusInfo: { type: Object, default: null }
  },
  data() {
    return {
      flashingId: null,
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
    },
    sidebarFocusInfo: {
      handler(info) {
        if (!info || !info.refKey) return
        const prefix = 'hotdeal-row1-'
        if (!info.refKey.startsWith(prefix)) return
        const id = Number(info.refKey.slice(prefix.length))
        const product = this.localProducts.find(p => p.id === id)
        if (!product) return
        this.$nextTick(() => {
          this.flashingId = product.id
          setTimeout(() => { this.flashingId = null }, 780)
          const el = this.$el.querySelector(`[data-product-id="${product.id}"]`)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
      },
      deep: true
    }
  },
  methods: {
    selectProduct(id) {
      this.flashingId = id
      setTimeout(() => { this.flashingId = null }, 780)
      this.$emit('select-product', { refKey: 'hotdeal-row1-' + id })
    },
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

.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--color-text-secondary, #64748b);
  background: var(--color-bg-secondary, #f5f6fa);
  border-radius: 8px;
  border: 2px dashed var(--color-border, #e8ebf0);
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
