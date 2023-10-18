<template>
  <img :src="getIconUrl(srcIcon)" :alt="alt" class="cursor-pointer" :style="rotateSvg" @click="handleClick"/>
</template>

<script>
import {getIconUrl} from "@/utils/utils";
export default {
  data() {
    return {
      rotated: false
    }
  },
  props: {
    srcIcon: {
      type: String,
      default: ''
    },
    rotateClick: {
      type: Boolean,
      default: false
    },
    alt: {
      type: String,
      default: ''
    },
    rotateDegrees: {
      type: Number,
      default: 180
    },
    size:{
      type:Number,
    }
  },
  computed: {
    rotateSvg() {
      const sizeIcon= this.size ? `width:${this.size}px; height:${this.size}px` : 'width:100%;height:100%'
      return this.rotateClick && this.rotated ? `transform: rotate(${this.rotateDegrees}deg); ${sizeIcon}` : `${sizeIcon}`
    }
  },
  emits:['svgClick'],
  methods: {
      getIconUrl,
    handleClick() {
      this.rotated = !this.rotated
      this.$emit('svgClick')
    }
  }
}
</script>
