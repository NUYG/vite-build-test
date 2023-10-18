<template>
  <img :src="getIconUrl(srcIcon)" :alt="alt" class="cursor-pointer" :style="sizeIcon" @click="handleClick"/>
</template>

<script>
import {getIconUrl} from "@/utils/utils";
export default {
  props: {
    srcIcon: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    canClick:{
      type:Boolean,
      default:true
    },
    size:{
      type:Number,
    }
  },
  computed: {
    sizeIcon()
    {
      return this.size ? `width:${this.size}px !important ; height:${this.size}px !important` : 'width:100%;height:100%'
    }
  },
  emits:['iconClicked'],
  methods: {
    getIconUrl,
    handleClick() {
      this.$emit('iconClicked')
    }
  }
}
</script>
