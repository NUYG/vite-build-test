<template>
  <div>
        <SelectedField defaultData="----" label="Hướng" :boldLabel="true" :optionArr="pointingVal" @selectedData="onPointingPick"/>
  </div>
</template>

<script>
import SelectedField from "@/components/FpInput/FpFields/SelectedField.vue";
import {getCompareValue} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {selectedArr} from "@/utils/cofigLibDataToSelected";
export default {
  components:{
    SelectedField
  },
  data()
  {
    return {
      POINTING:[]
    }
  },
  computed:{
    pointingVal() {
      let pointingVal = []
      pointingVal.push(...selectedArr(this.POINTING,[],{}))
      return pointingVal
    }
  },
  methods:{
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.POINTING]
      );
      this.POINTING = res.POINTING;
    },
    onPointingPick(data)
    {
      this.$emit('pointingPicked',{['balcony']:data})
    }
  },
  emits:['pointingPicked'],
  mounted() {
    this.getDataLib()
  }

}
</script>