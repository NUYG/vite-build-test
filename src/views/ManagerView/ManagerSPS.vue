<template>
   <SaleProcesses :role="Roles.Manager"/>
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
   computed: {},
   methods: {},
   watch: {},
   mounted() {
   }
}
</script>

<style scoped>
</style>
