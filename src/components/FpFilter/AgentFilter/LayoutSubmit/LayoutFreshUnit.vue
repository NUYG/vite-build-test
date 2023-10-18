<template>
  <div class="row">
    <div>
      <FreshUnitFilter @freshUnit="filterData"/>
    </div>
    <div class="mt-2">
      <itemPerPage @listLen="filterData"/>
    </div>
  </div>
</template>


<script>
import FreshUnitFilter from "@/components/FpFilter/AgentFilter/LayoutSubmit/FreshUnitFilter.vue";
import itemPerPage from "@/components/FpFilter/AgentFilter/LayoutSubmit/ItemPerPage.vue";
export default {
  components: {
    FreshUnitFilter,
    itemPerPage
  },
  data()
  {
    return{
      value:{}
    }
  },
  methods:{
    filterData(data)
    {
      this.value={...this.value,...data}
      this.$emit('unitFresh',this.value)
    }
  }
}
</script>