<template>
   <SaleProcesses :role="Roles.Sales" :statusProps="status"/>
</template>

<script>
import {Roles} from "@/utils/constants";
import SaleProcesses from "@/views/CommonView/SaleProcesses.vue";

export default {
   components: {
      SaleProcesses,
   },
   data() {
      return {
         Roles,
      }
   },
    props:{
     status:{
       type:String,
     }
    },
   computed: {},
   methods: {},
   watch: {},
   mounted() {
   }
}
</script>

<style scoped>
</style>
