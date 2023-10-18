<template>
  <div v-if="!svgBefore" class="d-flex" :class="{'text-gray':!solidStyle}">
    <FpSvg :size="20" :svgSrc="furIcon"/>
    <FpText tag="h6" :text="amenities" />
  </div>
  <div v-else class="d-flex" :class="{'text-gray':!solidStyle}">
    <FpText tag="h6" :text="amenities"/>
    <FpSvg :size="20" :svgSrc="furIcon"/>
  </div>
</template>

<script>
import FpSvg from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpSvg.vue";
import FpText from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpText.vue";
export default {
  props: {
    furIcon: {
      type: String,
      default: ''
    },
    amenities: {
      type: [Number,String],
      default: 0,
    },
    svgBefore: {
      type: Boolean,
      default: true
    },
    solidStyle: {
      type: Boolean,
      default: false
    }
  },components:{
    FpSvg,
    FpText
  }
}
</script>

