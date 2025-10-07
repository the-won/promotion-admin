<template>
  <div>
    <h3>입력폼 ({{ template }})</h3>
    <div v-for="(val, key) in localData" :key="key" style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; font-weight: bold;">{{ key }}</label>
      <input 
        v-model="localData[key]" 
        style="width: 100%; padding: 8px; border: 5px solid #ddd; border-radius: 4px;"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['template', 'value'],
  data() {
    return { 
      localData: {} 
    }
  },
  created() {
    this.localData = { ...this.value }
  },
  watch: {
    value: {
      handler(newVal) {
        // 외부에서 값이 변경될 때만 업데이트 (무한루프 방지)
        if (JSON.stringify(newVal) !== JSON.stringify(this.localData)) {
          this.localData = { ...newVal }
        }
      },
      deep: true
    },
    localData: {
      handler(val) {
        // 내부에서 값이 변경될 때만 emit (무한루프 방지)
        if (JSON.stringify(val) !== JSON.stringify(this.value)) {
          this.$emit('input', { ...val })
        }
      },
      deep: true
    }
  }
}
</script>