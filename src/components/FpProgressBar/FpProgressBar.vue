<template>
  <div class="progress" :style="heightBar">
    <div class="progress-bar-inner" :style="progressBarStyle"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
    hProgressbar:{
      type:Number,
      default:4
    },
    progressBarColor:{
      type:String,
    }
  },
  computed: {
    heightBar()
    {
      return `height:${this.hProgressbar}px`
    },
    progressBarStyle()
    {
      const widthPbar= ` width: ${this.value}%;`
      const heightPbar = `height:${this.hProgressbar}px;`
      const color = `background-color:${this.progressBarColor};`
      return widthPbar + heightPbar + color
    }
  },
};
</script>

<style>
.progress-bar-inner {
  transition: width 0.3s;
}
</style>
