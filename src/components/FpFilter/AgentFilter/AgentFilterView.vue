<template>
  <div class="row mt-4" >
    <DuoLayout :lgFirstBlock="6"  :smFirstBlock="12">
      <template #comp1 >
          <DuoLayout :lgFirstBlock="7" >
              <template #comp1 >
                  <LayoutResidence :advanceFilter="filteredData.advanceClick" @residence="onFilterData"/>
              </template>
              <template #comp2>
                  <LayoutAssessment  :advanceFilter="filteredData.advanceClick" @groupRentFilter="onFilterData"/>
             </template>
          </DuoLayout>
      </template>
      <template #comp2>
          <DuoLayout :lgFirstBlock="7" class="mt-4 mt-md-0">
            <template #comp1>
              <LayoutResearch  :hasFiltered="hasFiltered" :advanceFilter="filteredData.advanceClick" @research="onFilterData"/>
            </template>
            <template #comp2>
              <LayoutSubmit :advanceFilter="filteredData.advanceClick" @onFilterCLicked="onFilterData"/>
            </template>
          </DuoLayout>
      </template>
    </DuoLayout>
  </div>
</template>

<script>
import DuoLayout from "@/components/FpLayout/DuoLayout.vue";
import LayoutResidence from "@/components/FpFilter/AgentFilter/LayoutResidence/LayoutResidence.vue";
import LayoutAssessment from "@/components/FpFilter/AgentFilter/LayoutAssessment/LayoutAssessment.vue";
import LayoutResearch from "@/components/FpFilter/AgentFilter/LayoutResearch/LayoutResearch.vue";
import LayoutSubmit from "@/components/FpFilter/AgentFilter/LayoutSubmit/LayoutSubmit.vue";
export default {
  data() {
    return {
      filteredData:{
        advanceClick:false,

      },
      defaultFilter: null,
      hasFiltered:false,
    }
  },
  created() {
    this.defaultFilter = { ...this.filteredData }
  },
  components: {
    DuoLayout,
    LayoutResidence,
    LayoutAssessment,
    LayoutResearch,
    LayoutSubmit
  },
  methods:{
    onFilterData(data)
    {
      this.filteredData={...this.filteredData,...data}
      this.$emit('agentFilterVal',data)
    }
  },

}
</script>


<style scoped>

</style>