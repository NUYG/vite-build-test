<template>
  <div class="row mt-2">
    <SelectedField classes="px-0" :boldLabel="true" label="Diện tích" :multiple="true" :optionArr="sizeArr"/>
  </div>
</template>

<script>
import SelectedField from "@/components/FpInput/FpFields/SelectedField.vue";
import {post} from '@/utils/dataQuery'
export default {
  components:{
    SelectedField
  },
  data()
  {
    return{
        sizeApi:[]
    }
  },
  computed:{
    sizeArr()
    {
      return this.sizeApi.sizes?.map(size => {
          return {'value':size,'content':`${size}m2`}
      })
    }
  },
  methods:{
    async getSizeVal()
    {
      this.sizeApi= await post('/agent/get_pj_unit_sizes',{})
    }
  },
  mounted() {
    this.getSizeVal()
  }
}
</script>