<template>
  <div>
    <SelectedField class="px-0" label="Căn tươi" :boldLabel="true" :optionArr="arrData" @selectedData="freshUnit"/>
  </div>
</template>


<script>
import SelectedField from "@/components/FpInput/FpFields/SelectedField.vue";

export default {
  components: {
    SelectedField
  },
  data() {
    return {
      arrData: [
        {
          value: '',
          content: '---'
        },
        {
          value: 'fresh',
          content: 'Tươi'
        },
        {
          value: 'rotten',
          content: 'Không tươi'
        }
      ]
    }
  },
  emits:['freshUnit'],
  methods:{
    freshUnit(data)
    {
      this.$emit('freshUnit',{['fresh']:data})
    }
  }


}
</script>