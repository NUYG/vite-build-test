<template>
  <div :class="classObject">
    <label v-if="label" :class="labelClasses" >
      <FpIcon v-if="labelIcon" :srcIcon="labelIcon" :size="20"/>
      {{ label }}</label>
     <slot name="comp">

     </slot>
  </div>
</template>

<script>
import FpIcon from "@/components/FpIcon/FpIcon.vue";

export default {
  components: {FpIcon},
  props:{
    borderBox:{
      type:Boolean,
      default:true
    },
    label:{
      type:String
    },
    boldLabel:{
      type:Boolean,
      default:false
    },
    labelClass:{
      type:String,
      default:''
    },
    labelIcon:{
      type:String,
    },
    boxClass:{
      type:String,
    }
  },
  computed:{
    labelClasses(){
      return this.boldLabel ? `fw-bold ${this.labelClass}` : this.labelClass
    },
    classObject() {
      return this.borderBox ? 'p-lg-3 p-2 border border-gray rounded border8 ' + this.boxClass : this.boxClass
    },
  }
}
</script>