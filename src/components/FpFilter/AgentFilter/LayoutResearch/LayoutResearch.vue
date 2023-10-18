<template>
  <div class="d-flex justify-content-between">
    <div class="col-9">
      <SearchUnit @searchVal="onDataFilter"/>
    </div>
    <div class="col-2">
      <btnAdvancedFilter :hasFiltered="hasFiltered" @advanceClicked="onDataFilter"/>
    </div>
  </div>
  <div class="row mt-2" v-if="advanceFilter">
    <label><b>View</b></label>
    <ViewUnitFilter @viewFilter="onDataFilter"/>
  </div>

</template>


<script>
import SearchUnit from "@/components/FpFilter/AgentFilter/LayoutResearch/SearchUnit.vue";
import btnAdvancedFilter from "@/components/FpFilter/AgentFilter/LayoutResearch/BtnAdvancedFilter.vue";
import ViewUnitFilter from "@/components/FpFilter/AgentFilter/LayoutResearch/ViewUnitFilter.vue";

export default {
  data()
  {
    return {
      value:''
    }
  },
  props:{
    advanceFilter:{
      type:Boolean,
      default:false
    },
    hasFiltered:{
      type:Boolean,
      default: false
    }
  },
  emits:['research'],
  methods:{
    onDataFilter(data)
    {
      this.value={...this.value,...data}
      this.$emit('research',this.value)
    }
  },
  components: {
    SearchUnit,
    btnAdvancedFilter,
    ViewUnitFilter
  }
}
</script>