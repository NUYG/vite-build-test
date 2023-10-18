<template>
  <div>
      <SwitchesField  label="Nhà mới" id="new" :boldLabel="true" @switches="filterData"/>
  </div>
  <div class="row mt-2">
      <UnitSizeFilter />
  </div>
</template>

<script>
import SwitchesField from "@/components/FpButton/SwitchesField.vue";
import UnitSizeFilter from "@/components/FpFilter/AgentFilter/LayoutSubmit/UnitSizeFilter.vue";
export default {
  data()
  {
      return{

      }
  },
  emits:['newUnitFilter'],
  methods:{
    filterData(data)
    {
        this.$emit('newUnitFilter',data)
    }
  },
    components:{
      SwitchesField,
      UnitSizeFilter
    }
}
</script>