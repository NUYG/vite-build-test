<template>
  <div :class="classStyle">
    <div class="rounded-circle" :style="dotStyle" :class="dotClass">
      {{ content }}
      <slot name="customContent"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dotSize: {
      type: Number,
      default: 0,
    },
    dotColor: {
      type: String,
      default: 'white',
    },
    classStyle: {
      type: String,
      default: ''
    },
    content: {
      type: [Number, String],
      default: ''
    },
    borderStyle: {
      type: Object,
      default: () => ({})
    },
    outlineCustom:{
      type:String
    },
    dotClass:{
      type:String
    }
  },
  computed: {
    dotStyle() {
      return {
        boxShadow:this.outlineCustom,
        border: this.borderStyle ? this.borderStyle.border : 'none',
        borderRadius: this.borderStyle ? this.borderStyle.borderRadius : '0px',
        backgroundColor: this.dotColor,
        width: `${this.dotSize}px`,
        height: `${this.dotSize}px`
      }
    }
  }
}
</script>

<style scoped>
</style>