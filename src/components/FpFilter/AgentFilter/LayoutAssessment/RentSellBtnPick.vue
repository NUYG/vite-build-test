<template>
  <div class="d-flex justify-content-between">
    <ButtonCLickFilter :btnValue="btnValue" btnClass="col-5" @btnClick="onBtnClick"/>
  </div>
</template>


<script>
import ButtonCLickFilter from "@/components/FpFilter/AgentFilter/LayoutAssessment/ButtonCLickFilter.vue";

export default {
  data() {
    return {
      btnValue: [
        {
          id: 'renting',
          content: 'Thuê',
          status: 'default',
          onBtnColor: 'green',
        },
        {
          id: 'selling',
          content: 'Bán',
          status: 'default',
          onBtnColor: 'red',
        }
      ],
      dataFilter: [
        {
          id: 'renting',
          value: false
        },
        {
          id: 'selling',
          value: false
        },
      ]
    }
  },
  components: {
    ButtonCLickFilter
  },
  methods: {
    onBtnClick(data) {
     this.dataFilter.map(val => {
       if(val.id===data)
       {
         val.value= ! val.value
       }
       let result = {}
       result[val.id] = val.value
       this.$emit('dataFilter', result)
     })

    }
  }
}
</script>