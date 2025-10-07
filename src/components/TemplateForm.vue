<template>
  <div>
    <h3>입력폼 ({{ template }})</h3>
    <div v-for="(val, key) in formData" :key="key">
      <label>{{ key }}</label>
      <input v-model="localData[key]" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['template', 'value'],
  data() {
    return { localData: { ...this.value } }
  },
  watch: {
    localData: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  computed: {
    formData() {
      return this.localData
    }
  }
}
</script>
