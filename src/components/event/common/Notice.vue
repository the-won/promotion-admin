<template>
  <div v-if="items && items.length > 0" class="evt-cnt cnt-notice">
    <h2>{{ title || '꼭 확인하세요' }}</h2>
    <ul class="evt-notice-list">
      <li v-for="(item, i) in items" :key="i">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Notice',
  props: {
    title: { type: String, default: '꼭 확인하세요' },
    items: { type: Array, default: () => [] }
  }
}
</script>

<style scoped>
.evt-cnt.cnt-notice {
  padding: 60px 39px 60px 187px;
  background-color: #f8f8f8;
  box-sizing: border-box;
}
.cnt-notice h2 {
  font-size: 32px;
  font-weight: bold;
  line-height: 38px;
  color: #000000;
}
.cnt-notice .evt-notice-list {
  margin-top: 28px;
  list-style: none;
  padding: 0;
}
.cnt-notice .evt-notice-list li {
  position: relative;
  padding-left: 17px;
  font-size: 24px;
  font-weight: 400;
  line-height: 29px;
  color: #212121;
  word-break: keep-all;
}
.cnt-notice .evt-notice-list li::before {
  content: '*';
  position: absolute;
  top: 3px;
  left: 0;
}
.cnt-notice .evt-notice-list li + li {
  margin-top: 18px;
}
</style>
