<template>
    <img class="p-0" :style="svgStyle" :src="svgSrc" alt="svgSrc"/>
</template>


<script>
export default {
  props:{
    svgSrc:{
      type:String,
      default:''
    },
    size:{
      type:Number,
      default: 0
    },
  },
  computed:{
    svgStyle()
    {
      return `width:${this.size}px;height:${this.size}px`
    }
  }
}
</script>