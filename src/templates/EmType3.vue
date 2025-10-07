<template>
  <div>
    <h1 style="color:#fff;margin:0;font-size:24px;">{{ data.headerText }}</h1>

    <div style="position: relative;">
      <img src="https://d2odciwzsa8zjd.cloudfront.net/public/editorImage/202509/8dae3bd8-5e33-4d1c-af7e-3cdbc39b3b1a.png" alt="">
    </div>
  </div>

</template>

<script>
export default {
  props: ['data'],
  methods: {
  
    getButtonSize() {
      const sizes = {
        'small': { padding: '8px 16px', fontSize: '12px' },
        'medium': { padding: '12px 24px', fontSize: '14px' },
        'large': { padding: '16px 32px', fontSize: '16px' }
      }
      return sizes[this.data.buttonSize || 'medium']
    },
   
  }
}
</script>