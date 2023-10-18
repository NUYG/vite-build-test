<template>
   <FpDefLayout :bc-props="breadCrumbSetting">
      <template #comp>
         <CallHistory :self-filter="true"/>
      </template>
   </FpDefLayout>
</template>


<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import CallHistory from "@/views/TeleView/CallHistory.vue";
import {breadcrumpProp} from "@/models/customProp";

export default {
   components: {
      CallHistory,
      FpDefLayout,
   },
   data()
   {
     return{
       breadCrumbSetting:{
         [breadcrumpProp.title]: 'Lịch sử cập nhật',
       }
     }
   }
}
</script>
