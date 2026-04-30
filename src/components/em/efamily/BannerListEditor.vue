<template>
  <div class="banner-list-editor">
    <div class="section-header">
      <h4>하단 배너 관리</h4>
      <button @click="addBanner" class="btn btn-success">배너 추가</button>
    </div>

    <div v-if="localBanners.length === 0" class="empty-state">
      배너를 추가하세요.
    </div>

    <div class="items-grid">
      <div 
        v-for="(banner, index) in localBanners" 
        :key="banner.id" 
        class="card"
      >
        <div class="card-header card-header-orange">
          <span class="card-title">배너 {{ index + 1 }}</span>
          <button 
            @click="removeBanner(index)" 
            class="btn btn-danger btn-sm"
          >
            삭제
          </button>
        </div>

        <!-- 배너 필드 -->
        <div class="form-row">
          <div class="form-group">
            <label>이벤트 코드</label>
            <input 
              type="text" 
              v-model="banner.eventCode"
              placeholder="예: 3664"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>이미지 URL</label>
            <input 
              type="url" 
              v-model="banner.imageUrl"
              placeholder="http://www.efamilyshop.co.kr/storage/..."
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>대체 텍스트</label>
            <input 
              type="text" 
              v-model="banner.imageAlt"
              placeholder="예: 주방가전&용품 기획전"
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
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localBanners: []
    }
  },
  created() {
    this.localBanners = this.value ? JSON.parse(JSON.stringify(this.value)) : []
  },
  watch: {
    value: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localBanners)) {
          this.localBanners = newVal ? JSON.parse(JSON.stringify(newVal)) : []
        }
      },
      deep: true
    },
    localBanners: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.value)) {
          this.$emit('input', JSON.parse(JSON.stringify(val)))
        }
      },
      deep: true
    }
  },
  methods: {
    addBanner() {
      this.localBanners.push({
        id: Date.now(),
        eventCode: '',
        imageUrl: '',
        imageAlt: ''
      })
    },
    removeBanner(index) {
      this.localBanners.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>