<template>
  <div :class="classStyle">
    <component :is="tag">{{text}}</component>
  </div>
</template>


<script>
export default {
  props:{
    tag:{
      type:String,
      default:'span'
    },
    text:{
      type:String,
      required:true
    },
    classStyle:{
      type:String,
      default: ''
    }
  }
}
</script>