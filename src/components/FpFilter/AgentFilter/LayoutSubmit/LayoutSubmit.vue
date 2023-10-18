<template>
  <div>
    <ControlButton @onSubmit="onFilterData"/>
  </div>
  <div class="mt-2" v-if="advanceFilter">
    <DouLayout :lgFirstBlock="7">
      <template #comp1>
        <LayoutNewUnit @newUnitFilter="onFilterData"/>
      </template>
      <template #comp2>
        <LayoutFreshUnit @unitFresh="onFilterData"/>
      </template>
    </DouLayout>
  </div>
</template>


<script>
import ControlButton from "@/components/FpFilter/AgentFilter/LayoutSubmit/ControlButton.vue";
import LayoutNewUnit from "@/components/FpFilter/AgentFilter/LayoutSubmit/LayoutNewUnit.vue";
import DouLayout from '@/components/FpLayout/DuoLayout.vue'
import LayoutFreshUnit from "@/components/FpFilter/AgentFilter/LayoutSubmit/LayoutFreshUnit.vue";

export default {
  data() {
    return {
      value: {}
    }
  },
  props: {
    advanceFilter: {
      type: Boolean,
      default: false
    }
  },
  emits:['onFilterCLicked'],
  methods: {
    onFilterData(data) {
      this.value = {...this.value, ...data}
      this.$emit('onFilterCLicked',this.value)
    }
  },
  components: {
    ControlButton,
    LayoutNewUnit,
    DouLayout,
    LayoutFreshUnit
  }
}
</script>