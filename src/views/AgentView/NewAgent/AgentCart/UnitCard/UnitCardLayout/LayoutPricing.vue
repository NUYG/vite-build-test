<template>
  <DuoLayout>
    <template #comp1>
      <StatusPricing :renting="true" :price="unitData.rentingPrice" :requiredNumb="unitData.totalRUI" :coverage="unitData.managementCoverage"/>
    </template>
    <template #comp2>
      <StatusPricing :renting="false" :price="unitData.sellingPrice" :requiredNumb="unitData.totalBUI" :coverage="unitData.transferringCoverage"/>
    </template>
  </DuoLayout>
</template>


<script>
import DuoLayout from "@/components/FpLayout/DuoLayout.vue";
import StatusPricing from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardGroupItems/StatusPricing.vue";

export default {
  components: {
    DuoLayout,
    StatusPricing
  },
  props: {
    unitData: {
      type: Object,
      default: () => {
      }
    }
  },
  mounted() {
    // console.log(this.unitData)
  },

}
</script>