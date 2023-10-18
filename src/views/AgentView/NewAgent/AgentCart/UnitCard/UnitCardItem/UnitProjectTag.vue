<template>
  <div class="row h-100 w-100">
   <div :style="tagStyle"></div>
  </div>
</template>


<script>
export default {
  props:{
    tagColor:{
      type:String,
      default:''
    },
    tagHeight:{
      type:Number,
      default: 100
    },
    tagWidth:{
      type:Number,
      default: 100
    },
    borderStyle:{
      type:Object,
      default: () => ({})
    },
  },
  computed:{
    tagStyle()
    {
      return {
        border:this.borderStyle.border || 'none',
        borderRadius:this.borderStyle.borderRadius || '0px',
        backgroundColor:this.tagColor,
        width:`${this.tagWidth}%`,
        height:`${this.tagHeight}%`
      }
    }
  }
}
</script>