<template>
  <table width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">
         
          <tr v-for="group in data.imageLinkGroups" :key="group.id">
            <td>
              <a 
                :href="group.href" 
                :target="group.targetBlank ? '_blank' : '_self'" 
                rel="noopener noreferrer"
              >
                <!-- 그룹 내의 모든 이미지 렌더링 -->
                <img 
                  v-for="image in group.images" 
                  :key="image.id"
                  :src="image.url" 
                  :alt="image.alt"
                />
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
   
  }
}
</script>