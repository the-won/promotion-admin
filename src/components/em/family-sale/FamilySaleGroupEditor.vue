<template>
  <div class="family-sale-group-editor">
    <div v-if="localGroups.length === 0" class="empty-state">
      상품 그룹을 추가하세요.
    </div>

    <div
      v-for="(group, groupIndex) in localGroups"
      :key="group.id"
      v-show="selectedGroupIndex === null || selectedGroupIndex === groupIndex"
      class="group-wrapper"
    >
      <!-- 그룹 헤더 -->
      <div class="group-header">
        <span class="group-title">상품 그룹 {{ groupIndex + 1 }}</span>
        <button
          @click="removeGroup(group.id)"
          class="btn btn-danger btn-sm"
          :disabled="localGroups.length === 1"
        >
          상품그룹 {{ groupIndex + 1 }} 삭제
        </button>
      </div>

      <!-- 배경색 -->
      <div class="group-bg-color">
        <label>배경색</label>
        <div class="color-field">
          <input type="color" v-model="group.backgroundColor" class="color-picker" />
          <input type="text" v-model="group.backgroundColor" class="form-input" />
        </div>
      </div>

      <!-- 타이틀 이미지 -->
      <div
        class="title-image-section selectable"
        :class="{ 'flash-highlight': flashingTitleId === group.id }"
        @click="selectTitleImage(group.id)"
      >
        <div class="form-row">
          <div class="form-group">
            <label>타이틀 이미지 URL</label>
            <input
              type="url"
              v-model="group.titleImage.url"
              placeholder="타이틀 이미지 URL"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>대체 텍스트</label>
            <input
              type="text"
              v-model="group.titleImage.alt"
              placeholder="대체 텍스트"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- 상품 카드들 -->
      <div class="items-grid">

        <!-- 대표 상품 (products[0]) -->
        <div
          class="card selectable"
          :class="{ 'flash-highlight': flashingCardKey === group.id + '-featured' }"
          @click="selectCard(group.id + '-featured', 'familysale-featured-' + group.id)"
        >
          <div class="card-header">
            <span class="card-title">대표 상품 (전체 너비)</span>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>상품코드</label>
              <input type="text" v-model="group.products[0].productCode" placeholder="상품코드" class="form-input" />
            </div>
            <div class="form-group">
              <label>이미지 URL</label>
              <input type="url" v-model="group.products[0].imageUrl" placeholder="이미지 URL" class="form-input" />
            </div>
            <div class="form-group">
              <label>대체 텍스트</label>
              <input type="text" v-model="group.products[0].imageAlt" placeholder="대체 텍스트" class="form-input" />
            </div>
          </div>
        </div>

        <!-- 그리드 1행 (products[1], products[2]) -->
        <div
          class="card selectable"
          :class="{ 'flash-highlight': flashingCardKey === group.id + '-grid1' }"
          @click="selectCard(group.id + '-grid1', 'familysale-grid1-' + group.id)"
        >
          <div class="card-header card-header-orange">
            <span class="card-title">그리드 1행 (2개)</span>
          </div>
          <div class="form-row mb-3">
            <div class="form-group">
              <label>상품코드 1</label>
              <input type="text" v-model="group.products[1].productCode" placeholder="상품코드" class="form-input" />
            </div>
            <div class="form-group">
              <label>이미지 URL 1</label>
              <input type="url" v-model="group.products[1].imageUrl" placeholder="이미지 URL" class="form-input" />
            </div>
            <div class="form-group">
              <label>대체 텍스트 1</label>
              <input type="text" v-model="group.products[1].imageAlt" placeholder="대체 텍스트" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>상품코드 2</label>
              <input type="text" v-model="group.products[2].productCode" placeholder="상품코드" class="form-input" />
            </div>
            <div class="form-group">
              <label>이미지 URL 2</label>
              <input type="url" v-model="group.products[2].imageUrl" placeholder="이미지 URL" class="form-input" />
            </div>
            <div class="form-group">
              <label>대체 텍스트 2</label>
              <input type="text" v-model="group.products[2].imageAlt" placeholder="대체 텍스트" class="form-input" />
            </div>
          </div>
        </div>

        <!-- 그리드 2행 (products[3], products[4]) -->
        <div
          class="card selectable"
          :class="{ 'flash-highlight': flashingCardKey === group.id + '-grid2' }"
          @click="selectCard(group.id + '-grid2', 'familysale-grid2-' + group.id)"
        >
          <div class="card-header card-header-orange">
            <span class="card-title">그리드 2행 (2개)</span>
          </div>
          <div class="form-row mb-3">
            <div class="form-group">
              <label>상품코드 3</label>
              <input type="text" v-model="group.products[3].productCode" placeholder="상품코드" class="form-input" />
            </div>
            <div class="form-group">
              <label>이미지 URL 3</label>
              <input type="url" v-model="group.products[3].imageUrl" placeholder="이미지 URL" class="form-input" />
            </div>
            <div class="form-group">
              <label>대체 텍스트 3</label>
              <input type="text" v-model="group.products[3].imageAlt" placeholder="대체 텍스트" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>상품코드 4</label>
              <input type="text" v-model="group.products[4].productCode" placeholder="상품코드" class="form-input" />
            </div>
            <div class="form-group">
              <label>이미지 URL 4</label>
              <input type="url" v-model="group.products[4].imageUrl" placeholder="이미지 URL" class="form-input" />
            </div>
            <div class="form-group">
              <label>대체 텍스트 4</label>
              <input type="text" v-model="group.products[4].imageAlt" placeholder="대체 텍스트" class="form-input" />
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 새 그룹 추가 버튼 -->
    <div class="text-center mt-4">
      <button @click="addGroup" class="btn btn-primary btn-lg">새 상품 그룹 추가</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FamilySaleGroupEditor',
  props: {
    value: { type: Array, default: () => [] },
    selectedGroupIndex: { type: Number, default: null }
  },
  data() {
    return {
      localGroups: [],
      flashingCardKey: null,
      flashingTitleId: null
    }
  },
  created() {
    this.localGroups = this.normalizeGroups(this.value)
  },
  watch: {
    value: {
      handler(newVal) {
        const normalized = this.normalizeGroups(newVal)
        if (JSON.stringify(normalized) !== JSON.stringify(this.localGroups)) {
          this.localGroups = normalized
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
    normalizeGroups(groups) {
      if (!groups || groups.length === 0) return [this.createNewGroup()]
      return JSON.parse(JSON.stringify(groups)).map(g => {
        if (!('backgroundColor' in g)) g.backgroundColor = '#E9F9FF'
        return g
      })
    },
    createNewGroup() {
      return {
        id: `pg_fs_${Date.now()}`,
        backgroundColor: '#E9F9FF',
        titleImage: { url: '', alt: '' },
        products: [
          { productCode: '', imageUrl: '', imageAlt: '' },
          { productCode: '', imageUrl: '', imageAlt: '' },
          { productCode: '', imageUrl: '', imageAlt: '' },
          { productCode: '', imageUrl: '', imageAlt: '' },
          { productCode: '', imageUrl: '', imageAlt: '' }
        ]
      }
    },
    selectTitleImage(groupId) {
      this.flashingTitleId = groupId
      setTimeout(() => { this.flashingTitleId = null }, 780)
      this.$emit('select-product', { refKey: 'familysale-title-' + groupId })
    },
    selectCard(cardKey, refKey) {
      this.flashingCardKey = cardKey
      setTimeout(() => { this.flashingCardKey = null }, 780)
      this.$emit('select-product', { refKey })
    },
    addGroup() {
      this.localGroups.push(this.createNewGroup())
    },
    removeGroup(groupId) {
      if (this.localGroups.length === 1) {
        alert('최소 1개의 그룹이 필요합니다.')
        return
      }
      const index = this.localGroups.findIndex(g => g.id === groupId)
      if (index !== -1) {
        this.localGroups.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.family-sale-group-editor {
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

.group-wrapper {
  margin-bottom: 24px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.group-bg-color {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
}

.group-bg-color label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary, #64748b);
  white-space: nowrap;
}

.color-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-picker {
  width: 36px;
  height: 28px;
  padding: 2px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 4px;
  cursor: pointer;
  background: none;
}

.color-field .form-input {
  width: 100px;
  font-size: 12px;
  font-family: monospace;
}

.title-image-section {
  margin-bottom: 16px;
  padding: 16px;
  background: var(--color-bg, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  cursor: pointer;
}

.card.flash-highlight,
.title-image-section.flash-highlight {
  position: relative;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.15);
}

.card.flash-highlight::after,
.title-image-section.flash-highlight::after {
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
