<template>
  <div :class="rowClasses" v-for="(field,index) in contentData" :key="index" class="text-content">
      <span class="col-6" >{{ field.fieldTitle }}</span>
      <InvoiceEditInfo :value="field.fieldInfo" :canEdit="field.canEdit" :type="field.type"/>
  </div>
</template>


<script>
import InvoiceEditInfo from "@/components/FpForm/InvoiceEditInfo.vue";
// verifiedContractDuration    return hạn hợp đồng
export default {
  components:{
    InvoiceEditInfo
  },
  data()
  {
    return {
      contentData:[],
      editField:false
    }
  },
  mounted() {
    this.contentData=this.fields
  },
  watch:{
    fields(newVal)
    {
      this.contentData=newVal
    }
  },
  props: {
    fields: {
      type: Array,
      default:() => [],
      required: true,
    },
    rowClasses:{
      type:String
    },
  },
};
</script>