<template>
  <Vue3Lottie
      :animationLink="getAnimJson(animationName)"
      :style="animationSize"
  />
</template>

<script>
import { Vue3Lottie } from 'vue3-lottie'
import {getAnimJson} from "@/utils/utils";
export default {
  components: {Vue3Lottie},
  methods: {getAnimJson},
  props:{
    animationName:{
      type:String
    },
    size:{
      type:Number
    }
  },
  computed:{
    animationSize()
    {
      return this.size ? `width:${this.size}px;height:${this.size}px` : 'width:100%;height:100%'
    }
  }
}
</script>