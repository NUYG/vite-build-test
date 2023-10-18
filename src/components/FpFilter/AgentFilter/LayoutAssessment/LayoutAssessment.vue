<template>
  <div>
    <div>
      <RentSellBtnPick @dataFilter="dataFilter"/>
    </div>
    <div class="mt-2" v-if="advanceFilter">
      <BedroomWcFilter @dataFilter="dataFilter"/>
    </div>
    <div class="mt-2" v-if="advanceFilter">
      <FurnitureFilter  @dataFilter="dataFilter"/>
    </div>
    <div class="mt-2" v-if="advanceFilter">
      <DirectionFilter @pointingPicked="dataFilter"/>
    </div>
  </div>
</template>


<script>
import RentSellBtnPick from "@/components/FpFilter/AgentFilter/LayoutAssessment/RentSellBtnPick.vue";
import BedroomWcFilter from "@/components/FpFilter/AgentFilter/LayoutAssessment/BedroomWcFilter.vue";
import FurnitureFilter from "@/components/FpFilter/AgentFilter/LayoutAssessment/FurnitureFilter.vue";
import DirectionFilter from "@/components/FpFilter/AgentFilter/LayoutAssessment/DirectionFilter.vue";
export default {
  components: {
    RentSellBtnPick,
    BedroomWcFilter,
    FurnitureFilter,
    DirectionFilter
  },
  data()
  {
    return {
      value:{}
    }
  },
  props:{
    advanceFilter:{
      type:Boolean,
      default:false
    }
  },
  methods:{
    dataFilter(data)
    {
      this.value={...this.value,...data}
      this.$emit('groupRentFilter',this.value)
    }
  }
}

</script>