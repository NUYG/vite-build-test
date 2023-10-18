<template>
  <div>
    <img @click='onDirectPage' :src="avtData" class="img-fluid object-fit-cover" alt="" :style="getStyle"/>
  </div>
</template>

<script>
const typeUtils={
  img:IMG_URL,
  icon:apiUrls.ICON_URL,
  default:''
}
import {getIconUrl} from "@/utils/utils";
import {apiUrls, IMG_URL} from "@/utils/constants";
export default {
  data() {
    return {
    }
  },
  props: {
    url: {
      type: String,
    },
    borderRound: {
      type: Number,
      default: 0
      // how many px
    },
    clickGoTo: {
      type: String,
    },
    size:{
      type:Number
    },
    type:{
      type:String,
      default:'img'
    },
  },
  computed: {
    getStyle() {
      const size = this.size ? `width:${this.size}px;height:${this.size}px` : `width:100%;height:100%`
      if (this.borderRound > 0) {
        return `${size};border-radius: ${this.borderRound}px`
      }
      return ''
    },
    avtData()
    {
      return this.url ? typeUtils[this.type]+this.url :  getIconUrl('maleAvatar.png')
    },
  },
  methods: {
    onDirectPage()
    {
      if(this.clickGoTo)
      {
       this.$router.push(this.clickGoTo)
      }
    },
  },
  emits:['avtUpload']
}
</script>