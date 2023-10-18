<template>
   <img @click='handleTooltipClick' :src="getIconUrl('Export.svg')" class='p-0' style="width:20px" alt=''>
   <div v-show='showTooltip' class='tooltip-bottom-content py-2' >
      <div class='mt-2 border8 p-2 w-100 social-icons'>
         <img :src="getIconUrl('facebook.svg')" alt=''>
      </div>
      <div class='mt-2 border8 p-2 w-100 social-icons'>
         <img :src="getIconUrl('zaloIcon.svg')" alt=''>
      </div>
      <div class='mt-2 mb-2 border8 w-100 social-icons'>
         <img :src="getIconUrl('viberIcon.svg')" alt=''>
      </div>
   </div>
</template>

<script>
import {getIconUrl} from "@/utils/utils";

export default {
   data() {
      return {
         showTooltip:false
      }
   },
   props: {
   },
   computed: {},
   methods: {
      getIconUrl,
      handleTooltipClick()
      {
         this.showTooltip=!this.showTooltip
      }
   },
}
</script>

<style scoped>
</style>
