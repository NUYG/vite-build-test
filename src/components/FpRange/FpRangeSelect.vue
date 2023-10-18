<template>
    <div class="row mt-2">
      <div  :class="rangeBoxClass">
        <input v-model="rangeNumb" type="number" class="form-control " max="200 " pattern="\d*">
        <span class="mt-2 ps-2">m²</span>
      </div>
      <div  :class="inputClass">
        <input v-model="rangeNumb" type="range" class="form-range col" id="customRange1" step="1" max="200" >
      </div>
    </div>
</template>

<script>
  import { debounce } from 'lodash'
  import {getIconUrl} from "@/utils/utils";
  import FpIcon from "@/components/FpIcon/FpIcon.vue";
  export default {
    components:{
      FpIcon
    },
    data()
    {
      return{
        rangeNumb:this.numbDefault
      }
    },
    methods: {
      getIconUrl,
      emitRangeNumb: debounce(function() {
        this.$emit('rangeNumbChanged', parseInt(this.rangeNumb)<200 ? parseInt(this.rangeNumb) : 0 )
      }, 500)
    },
    watch: {
      rangeNumb() {
        this.emitRangeNumb()
      },
      numbDefault()
      {
        this.rangeNumb=this.numbDefault
      }
    },
    emits:['rangeNumbChanged'],
    props:{
      numbDefault:{
        type:[Number,String],
      },
      rangeBoxClass:{
        type:String,
        default:'col-lg-4 col-5 d-flex'
      },
      inputClass:{
        type:String,
        default:'col mt-auto'
      }

    },
  }
</script>
