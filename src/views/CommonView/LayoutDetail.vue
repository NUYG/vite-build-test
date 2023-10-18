<template>
   <FpDefLayout :bc-props="breadCrumbSetting">
      <template #comp>

         <ImgMgmt
               :objId="parseInt(layoutID)"
               objDataEP="/u_layout/get_layout_data"
               imgsEP="/mlib/img/get_layout_imgs"
               updateImgsEP="/mlib/img/up_layout_img_pos"
               uploadImgEP="/mlib/img/create_layout_img"
         />

      </template>
   </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import ImgMgmt from "@/components/FpImg/ImgMgmt.vue";

import {breadcrumpProp} from "@/models/customProp";
import {post} from "@/utils/dataQuery";

export default {
   components: {
      ImgMgmt,
      FpDefLayout,
   },
   data() {
      return {
         layoutData: [],
         // Meta
         breadCrumbSetting: {
            [breadcrumpProp.title]: 'Lịch hẹn',
         },
      }
   },
   computed: {
     pjID()
     {
       return this.$route?.params?.pjID
     },
     layoutID()
     {
       return this.$route?.params?.layoutID
     },
     title()
     {
       return `Layout ${this.layoutID}`
     }
   },
   methods: {
      async getLayoutData() {
         const res = await post("/u_layout/get_layout_data", {
            id: this.layoutID,
         });
         this.layoutData = res.returnData;
      },
   },
   watch: {},
   mounted() {
     this.breadCrumbSetting[breadcrumpProp.title] = this.title
      this.getLayoutData();
   }
}
</script>

<style scoped>
</style>
