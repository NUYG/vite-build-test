<template>
  <div class="row">
    <div :class="widthFirstBlock">
      <slot name="comp1"></slot>
    </div>
    <div class="col">
      <slot name="comp2"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    smFirstBlock: {
      type: Number,
      default: 6
    },
    mdFirstBlock: {
      type: Number,
      default: 6
    },
    lgFirstBlock:{
      type:Number,
      default:6
    },
  },
  computed:{
    widthFirstBlock()
    {
      return `col-sm-${this.smFirstBlock} col-md-${this.mdFirstBlock} col-lg-${this.lgFirstBlock}`
    },

  }
}
</script>