<template>
  <div v-if="isArrayValid" :class="boxClasses">
    <Slider v-model="value" :format="getFormattedValue" :step="-1"  :disabled="true" class="custom-handle" :min="minValue" :max="maxValue" />
  </div>
</template>

<script>
import Slider from '@vueform/slider'


export default {
  components: {
    Slider,
  },
  props:{
    boxClasses:String,
    rangeValue:{
      type:Array,
      default:[]
    },
    renting:{
      type: Boolean,
    },
    formatMin: {
      type: Function,
      default: (value) => `~ ${value} Triệu/Tháng`,
    },
    formatMax: {
      type: Function,
      default: (value) => `~ ${value} Triệu/Tháng`,
    },
    formatCurrentPrice:{
      type:Function,
      default:(value) => `Căn hộ đang xem : ${value} Triệu/Tháng`
    }
  },
  data() {
    return {
      value: [0,100],
    }
  },
  methods:{
    getFormattedValue(value) {
      if (value === this.value[0]) {
        return this.formatMin(value);
      }else if(value === this.value[1]) {
        return this.formatCurrentPrice(value)
      }
      else if(value === this.value[2]){
        return this.formatMax(value)
      }
    },
  },
  computed:{
    minValue()
    {
      if(this.value.length > 0)
      {
        return this.value[0] - 2
      }
      return 0
    },
    maxValue()
    {
      if(this.value.length > 0)
      {
        return this.value[this.value.length - 1] + 2
      }
      return 100
    },
    isArrayValid() {
      return (
          Array.isArray(this.value) &&
          this.value.length === 3 &&
          this.value.every((element, index, array) =>
              element > 0 && element !== undefined && element !== null && array.indexOf(element) === index
          )
      );
    },
  },
  watch:{
    rangeValue(newVal)
    {
      this.value = newVal
    }
  },
  mounted() {
    this.value = this.rangeValue
  }
}
</script>
<style>
.custom-handle .slider-handle {
  border: 2px solid #5E52FF !important;
  width: 2px !important;
  background-color: #5E52FF !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  right: 0 !important;
}
.custom-handle .slider-connect{
  background-color: #5E52FF !important;
}
.custom-handle .slider-tooltip {
  background-color: #5E52FF !important;
  color: white !important;
}
.slider-origin:nth-child(3) .slider-tooltip {
  bottom: -40px !important ;
}
.slider-origin:nth-child(3) .slider-tooltip-top:before{
  bottom: 20px !important ;
}
</style>
