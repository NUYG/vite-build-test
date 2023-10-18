<template>
  <div class="d-flex justify-content-between">
    <FpInput class="col-5 " v-for="(filed,index) in fieldValue" :key="index" v-bind="filed"
             @formInput="fieldVal"
    />
  </div>
</template>

<script>
import FpInput from "@/components/FpInput/FpInput.vue";

export default {
  data() {
    return {
      fieldValue: [
        {
          id: 'bedroom',
          type: 'text',
          label: 'PN',
          boldLabel: true
        },
        {
          id: 'bathroom',
          type: 'text',
          label: 'WC',
          boldLabel: true
        }
      ],
      value:{}
    }
  },
  emits:['dataFilter'],
  methods: {
    fieldVal(data) {
      this.value={...this.value,...data}
      this.$emit('dataFilter',this.value)
    }
  },
  components: {
    FpInput
  }
}
</script>