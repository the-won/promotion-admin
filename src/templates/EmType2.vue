<template>
  <table width="100%" cellspacing="0" cellpadding="0" style="background:#fff5e6;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;">
          <tr>
            <td align="center" style="padding:20px;">
              <h1 :style="'color:'+data.themeColor">{{ data.bannerTitle }}</h1>
              <p style="margin:10px 0 0 0; color:#666; font-size:14px;">
                📅 {{ formatDate(data.eventDate) }}
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <img 
                :src="data.bannerImage" 
                :style="'width:100%;border-radius:8px 8px 0 0;display:block;opacity:' + (data.bannerOpacity / 100)" 
              />
            </td>
            
          </tr>
          <!-- <tr>
            <td :style="background-color: black; height: 50px; margin-top: 50px; opacity: ${data.bannerOpacity / 100}"></td>
          </tr> -->
          <tr>
            <td style="padding:20px;">
              <p style="margin:0 0 15px 0;line-height:1.6;">{{ data.description }}</p>
              <a 
                :href="data.actionLink"
                :style="'display:inline-block;padding:10px 24px;background:'+data.themeColor+';color:#fff;text-decoration:none;border-radius:4px;'"
              >
                {{ data.actionText }}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: ['data'],
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}년 ${month}월 ${day}일`
    }
  }
}
</script>