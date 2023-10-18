<template>
<div>
   <img v-for='(img,index) in imgList' :key="index"
    :src="img.url" class="img-fluid " alt="" :style="getStyle" :class="spacing" />
</div>
</template>

<script>
export default {
  props: {
    imgList: {
      type: Array,
      default: () => ([])
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    removed:{
      type: Boolean,
      default: false
    },
    spacing:{
      type: String,
      default: ""
    }
    
  },
  computed: {
    getStyle() {
      const width = this.width > 0 ? `${this.width}px` : `100%`
      return `${width} ; height:${this.height}px;`
    }
  }
}
</script>