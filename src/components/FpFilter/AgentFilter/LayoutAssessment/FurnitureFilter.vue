<template>
  <div>
    <label><b>Nội thất</b></label>
    <div class="d-flex justify-content-between">
      <buttonCLickFilter btnClass="col-5" :btnValue="btnValue" :selectedOne="true" @btnClick="onBtnClick"/>
    </div>
  </div>
</template>

<script>
import buttonCLickFilter from "@/components/FpFilter/AgentFilter/LayoutAssessment/ButtonCLickFilter.vue";

export default {
  data() {
    return {
      btnValue: [
        {
          id: 'partly',
          content: 'NTCB',
          status: 'default',
          onBtnColor: 'yellow',
        },
        {
          id: 'fully',
          content: 'FNT',
          status: 'default',
          onBtnColor: 'yellow',
        },
      ],
      value: {
        furniture: ''
      }
    }
  },
  components: {
    buttonCLickFilter
  },
  methods: {
    onBtnClick(data) {
      this.value.furniture = (this.value.furniture === '' || this.value.furniture !== data) ? data : ''
      this.$emit('dataFilter',this.value)
    }
  }
}
</script>