<template>
  <div class="row">
    <ProjectSelected @projectSelected="getFormValue"/>
  </div>
  <div class="row mt-2" v-if="advanceFilter">
    <UnitStatusPick @unitStatus="getFormValue"/>
  </div>
  <div class="row" v-if="advanceFilter">
    <BlockFloorFilter @floorBlockVal="getFormValue"/>
  </div>
</template>


<script>
import ProjectSelected from "@/components/FpFilter/AgentFilter/LayoutResidence/ProjectSelected.vue";
import UnitStatusPick from "@/components/FpFilter/AgentFilter/LayoutResidence/UnitStatusPick.vue";
import BlockFloorFilter from "@/components/FpFilter/AgentFilter/LayoutResidence/BlockFloorFilter.vue";

export default {
  data() {
    return {
      dataFilter:{}
    }
  },
  props:{
    advanceFilter:{
      type:Boolean,
      default:false
    }
  },
  components: {
    ProjectSelected,
    UnitStatusPick,
    BlockFloorFilter
  },
  emits:['residence'],
  methods: {
    getFormValue(data) {
      this.dataFilter= {...this.dataFilter,...data}
      return this.$emit('residence',this.dataFilter)
    }
  },

}
</script>