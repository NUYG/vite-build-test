<template>
  <select v-model="src" class="form-control-plaintext">
    <option v-for="(cusSrc, index) in CUSTOMER_SOURCE" :key="index" :value="cusSrc[0]">{{ cusSrc[1] }}</option>
  </select>
</template>

<script>
import {getCompareValue} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";

export default {
  data()
  {
    return{
      src:'',
      CUSTOMER_SOURCE:[]
    }
  },
  props:{
    cusSrcDefault:{
      type:String,
    }
  },
  methods:{
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.CUSTOMER_SOURCE]
      );
      this.CUSTOMER_SOURCE = res.CUSTOMER_SOURCE
    },
  },
  async mounted() {
    await this.getDataLib()
  },
  emits:['srcCusPick'],
  watch:{
    cusSrcDefault(newVal)
    {
      this.src=newVal
    },
    src(newVal)
    {
      this.$emit('srcCusPick',newVal)
    }
  }

}
</script>