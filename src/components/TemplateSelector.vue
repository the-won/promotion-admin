<template>
  <div>
    <label for="templateSelect">템플릿 선택:</label>
    <select id="templateSelect" v-model="localValue">
      <option value="em-type-1">em-type-1</option>
      <option value="em-type-2">em-type-2</option>
      <option value="em-type-3">em-type-3</option>
      <option value="em-type-4">em-type-4</option>
      <option value="em-type-5">em-type-5 (화끈딜)</option>
      <option value="em-type-imagemap">이미지맵사용</option>
    </select>
  </div>
</template>

<script>
export default {
  props: ['value'],
  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
