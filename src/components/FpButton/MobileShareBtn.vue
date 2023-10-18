<template>
   <img @click='shareUnit' :src="getIconUrl('Export.svg')" class='p-0 icon-hover' style="width:20px" alt=''>
</template>

<script>
import {getIconUrl, mobileShare} from "@/utils/utils";

export default {
   data() {
      return {}
   },
   props: {
      imageList: {
         type: Array,
         default: () => ([]),
      },
      shareTxt: {
         type: String,
         default: '',
      }
   },
   computed: {},
   methods: {
      getIconUrl,
      async shareUnit() {
         await mobileShare(this.imageList, this.shareTxt);
      },
   },
}
</script>

<style scoped>
</style>
