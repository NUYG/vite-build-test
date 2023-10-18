<template>
  <div class='row mt-4 p-2'>
    <div v-for='(img,index) in imgData' class="col-auto position-relative" :key="index">
      <img class='img-fluid border8 my-2 img-layout_detail' :src="afterSrcUrl + img[targetUrl]" alt="Image" >
      <img @click='removeItems(img[removeTarget])' class='position-absolute' :src="getIconUrl('times-solid.svg')" alt='' style='width: 12px;height: 12px;right:20px;top:12px;cursor: pointer' />
    </div>
  </div>
</template>

<script>
import {getIconUrl} from "@/utils/utils";
import {IMG_URL} from "@/utils/constants";

export default {
  props:{
    imgData:{
      type:Array,
      default:() => []
    },
    afterSrcUrl:{
      type:String,
      default:IMG_URL
    },
    targetUrl:{
      type:String
    },
    removeTarget:{
      type:String
    }
  },
  emits:['newArrImg'],
  methods: {
    getIconUrl,
    removeItems(target)
    {
      const removeIndex = this.imgData.findIndex(item => item[this.removeTarget] === target )
      if(removeIndex !== -1)
      {
        this.imgData.splice(removeIndex,1)
        this.$emit('newArrImg',this.imgData)
      }
    }
  }

}
</script>
