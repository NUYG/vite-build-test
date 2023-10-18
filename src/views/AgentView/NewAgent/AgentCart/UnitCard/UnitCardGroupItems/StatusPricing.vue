<template>
  <TripleLayout>
    <template #comp1>
      <FpText v-if="getPrice>0" :class="textClass" classStyle="mt-3" tag="h6" :text="priceRender"/>
    </template>
    <template #comp2>
      <FpDot v-if="requiredNumb>0" :dotSize="22" :content="requiredNumb" :dotColor="bgDot"
             classStyle="text-white text-center mt-3"/>
    </template>
    <template #comp3>
      <FpSvg v-if="coverage" class="mt-3" :size="20" :svgSrc="svgSrc"/>
    </template>
  </TripleLayout>
</template>

<script>
import TripleLayout from "@/components/FpLayout/TripleLayout.vue";
import FpText from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpText.vue";
import FpDot from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpDot.vue";
import FpSvg from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpSvg.vue";
import {floatFixed, getIconUrl} from '@/utils/utils'

export default {
  components: {
    TripleLayout,
    FpText,
    FpDot,
    FpSvg,
  },
  props: {
    renting: {
      type: Boolean,
      default: false
    },
    price: {
      type: String,
      default: ''
    },
    coverage: {
      type: Boolean,
      default: false
    },
    requiredNumb: {
      type: Number,
      default: 0
    }
  },
  computed: {
    getPrice() {
      return floatFixed(this.price)
    },
    priceRender() {
      return this.renting ? ` ${this.getPrice}Tr` : `${this.getPrice}Tỷ`
    },
    svgSrc() {
      return this.renting ? getIconUrl('rentCheck.svg') : getIconUrl('sellCheck.svg');
    },
    textClass() {
      return this.renting ? 'text-success' : 'text-danger'
    },
    bgDot() {
      return this.renting ? 'green' : 'red'
    }
  },
  mounted() {
  }
}
</script>