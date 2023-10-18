<template>
  <CurrencyInput
      v-model.lazy="value"
      :options="{ currency: currency }"
      @change="onInputChange"
      :inputClass="inputClass"
  />
</template>

<script>
import CurrencyInput from '@/components/FpForm/FpVueCurrencyInput.vue'
import {convertVndToUserCurrency, getCurrentCurrencyName, UnitCurrency} from "@/models/currency";
import {floatFixed} from "@/utils/utils";

export default {
  components: { CurrencyInput },
  data() {
    return {
      value: 0,
      currency: getCurrentCurrencyName()
    }
  },
  props:{
    defVal:{
      type:Number,
      default:0
    },
    renting:{
      type:Boolean,
      default:true
    },
    inputClass:{
      type:String
    }
  },
  emits:['emitPrice'],
  methods:{
    onInputChange(event)
    {
      this.$emit('emitPrice',event?.target?.value)
    },
    convertValue(propsVal)
    {
      this.value = floatFixed(convertVndToUserCurrency(propsVal,this.renting,UnitCurrency.default,false),0)
    }
  },
  mounted() {
    this.convertValue(this.defVal)
  },
  watch:{
    defVal(newVal)
    {
      this.convertValue(newVal)
    }
  }

}
</script>
