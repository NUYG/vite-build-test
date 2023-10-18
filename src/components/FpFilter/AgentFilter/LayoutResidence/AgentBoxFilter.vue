<template>
  <div class="d-flex justify-content-between flex-wrap">
    <div class="col-5" v-for="(input,index) in inputFields" :key="index">
      <FpInput v-bind="input" @formInput="inputData"/>
    </div>
  </div>
</template>

<script>
import FpInput from "@/components/FpInput/FpInput.vue";

export default {
  components: {
    FpInput
  },
  props: {
    inputFields: {
      type: Array,
      default: () => ([])
    },
  },
  methods: {
    inputData(data) {
      this.$emit('boxData', data)
    }
  }
}
</script>

