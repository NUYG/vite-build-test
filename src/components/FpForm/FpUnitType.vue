<template>
  <div class="row d-flex flex-wrap p-lg-3 p-2">
    <div v-for="(val,index) in UNIT_TYPE" :key="index"
         @click="onUnitTypePick(val[0])"
         :class="{'col-auto border border8 p-2 mt-2 me-2 ms-2': val[0] !== 'ap', 'button-blue-teal': val[0] === unitTypePick && val[0] !== 'ap'}">
      {{ val[0] !== 'ap' ? val[1] : '' }}
    </div>
  </div>
</template>


<script>
import {getCompareValue} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";

export default {
  data() {
    return {
      UNIT_TYPE: [],
      unitTypePick:''
    }
  },
  props:{
    defaultUnitType:{
      type:String,
    }
  },
  watch:{
    defaultUnitType(newVal)
    {
      this.unitTypePick=newVal
    },
  },
  emits:['unitTypePick'],
  mounted() {
    this.unitTypePick=this.defaultUnitType
    this.getDataLib()
  },
  methods:{
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.UNIT_TYPE]
      );
      this.UNIT_TYPE = res.UNIT_TYPE
    },
    onUnitTypePick(type)
    {
      this.unitTypePick= this.unitTypePick ===type ? '' : type
      this.$emit('unitTypePick', this.unitTypePick)
    }
  }
}
</script>