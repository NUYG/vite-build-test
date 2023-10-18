<template>
  <SelectedField  label="Tình trạng căn" :boldLabel="true" :optionArr="optionUnitStatus" @selectedData="unitStatusVal"/>

</template>

<script>
import SelectedField from "@/components/FpInput/FpFields/SelectedField.vue";
import {getCompareValue} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {selectedArr} from '@/utils/cofigLibDataToSelected'

export default {
  components: {
    SelectedField
  },
  data() {
    return {
      UNIT_STATUS: []
    }
  },
  computed: {
    optionUnitStatus() {
      let optionVal = []
       optionVal.push(...selectedArr(this.UNIT_STATUS,[],{}))
      return optionVal
    }
  },
  emits:['unitStatus'],
  methods: {
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.UNIT_STATUS]
      );
      this.UNIT_STATUS = res.UNIT_STATUS;
    },
    unitStatusVal(data)
    {
      this.$emit('unitStatus',{['status']:data})
    }

  },
  mounted() {
    this.getDataLib()
  }
}
</script>