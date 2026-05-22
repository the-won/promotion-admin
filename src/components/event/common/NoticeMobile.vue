<template>
  <div v-if="items && items.length > 0" class="cnt-notice-container">
    <div class="evt-cnt cnt-notice">
      <h2>{{ title || '꼭 확인하세요' }}</h2>
      <ul class="evt-notice-list">
        <li v-for="(item, i) in items" :key="i">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeMobile',
  props: {
    title: { type: String, default: '꼭 확인하세요' },
    items: { type: Array, default: () => [] }
  }
}
</script>

<style scoped>
.cnt-notice-container {
  container-type: inline-size;
}
.evt-cnt.cnt-notice {
  padding: 8.33cqw 5.41cqw;
  background-color: #f8f8f8;
}
.cnt-notice h2 {
  font-size: 4.44cqw;
  font-weight: bold;
  line-height: 5.27cqw;
  color: #000000;
}
.cnt-notice .evt-notice-list {
  margin-top: 3.88cqw;
  list-style: none;
  padding: 0;
}
.cnt-notice .evt-notice-list li {
  position: relative;
  padding-left: 2.36cqw;
  font-size: 3.33cqw;
  font-weight: 400;
  line-height: 4.02cqw;
  color: #212121;
  word-break: keep-all;
}
.cnt-notice .evt-notice-list li::before {
  content: '*';
  position: absolute;
  top: 0.4cqw;
  left: 0;
}
.cnt-notice .evt-notice-list li + li {
  margin-top: 2.5cqw;
}
</style>
