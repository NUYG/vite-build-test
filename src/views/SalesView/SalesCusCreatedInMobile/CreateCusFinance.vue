<template>
  <div class="container-fluid">
    <FpIcon srcIcon="createCusFinance.svg" class="row"/>
    <FpLabelFormTemplate :label="`Tài chính `"
                         labelClass="text-gray">
      <template #comp>
        <FpFinanceForm :rent="renting"  @price="setCusPrice" :price="pricing"/>
      </template>
    </FpLabelFormTemplate>
  </div>
</template>

<script>
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpFinanceForm from "@/components/FpForm/FpFinanceForm.vue";
import FpLabelFormTemplate from "@/components/FpLayout/FpLabelFormTemplate.vue";
import ButtonNextPrevCreatedCus from "@/views/SalesView/SalesCusCreatedInMobile/ButtonNextPrevCreatedCus.vue";
export default {
  components: {ButtonNextPrevCreatedCus, FpLabelFormTemplate, FpIcon,FpFinanceForm},
  props:{
    renting:{
      type:Boolean,
      default:true
    },
    pricing:{
      type:[Number,String],
    }
  },
  emits:['inqPrice'],
  methods:{
    setCusPrice(price)
    {
      this.$emit('inqPrice',price)
    }
  }
}
</script>
