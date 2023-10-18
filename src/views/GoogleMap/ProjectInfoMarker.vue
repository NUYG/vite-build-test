<template>
  <div style="text-align: center">
    <div class="container white-bg p-3">
      <div style="font-size: 1.125rem"> {{ name }}</div>
      <div class="row mt-2">
        <div class="col-auto  d-flex align-items-center" v-if="1>0">
          <FpDot dot-color="#48BD48" :dotSize="isMobile?6:12"></FpDot>
          <span class="mx-2 text-sm-10 ">{{ rent_units_count }} Cho thuê</span>
        </div>
        <div class="col-auto d-flex align-items-center" v-if="1>0">
          <FpDot dot-color="#ff4747" :dotSize="isMobile?6:12"></FpDot>
          <span class="mx-2 text-sm-10">{{ sell_units_count }} Bán</span>
        </div>
      </div>
    </div>
    <img alt="GGMarker" :src="getIconUrl('GGMarker.png')" width="50" height="50" style="margin-top: 8px" />
  </div>
</template>

<script>

import FpDot from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpDot.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {getIconUrl} from "@/utils/utils";

export default {
  components: {FpDot},
  data() {
    return {}
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    rent_units_count: {
      type: Number,
      default: 40,
    },
    sell_units_count: {
      type: Number,
      default: 53,
    },
  },
  computed: {
    isMobile() {
      return !scrWdtFrom(scrWdtEnum.MD);
    },
  },
  methods: {getIconUrl},
  emits: []
}
</script>

<style scoped>
</style>
