<template>
    <div :class="boxClass" class="pj-information" >
      <span v-if="bedroom&&bedroom!==0&& bedroom!=='0'" ><FpIcon srcIcon="bed.svg" :size="iconSize" ></FpIcon>  {{ bedroom }}</span>
      <span v-if="size&&size>0" ><FpIcon srcIcon="Squaremetre.svg" :size="iconSize" ></FpIcon> {{ size }}m²</span>
      <span>
         <FpIcon v-if="block"  srcIcon="Building_Level.svg" :size="iconSize" class="col-auto">
         </FpIcon>
          <span>{{blockHeight}}</span>
      </span>
      <span v-if="unitType">{{unitType}}</span>
      <div v-if="view || view2">
            <span>View: {{view2 && view ? view+',' : view}} {{view2}}</span>
      </div>
    </div>
</template>

<script>
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {HEIGHT} from "@/utils/TransContent";
import {translate} from "@/utils/utils";
export default {
  components: {FpIcon},
  props:{
    pjInfoBoxClass:{
      type:String
    },
    height: {
      type: String,
    },
    view: {
      type: String
    },
    view2: {
      type: String
    },
    block: {
      type: String,
    },
    size: {
      type: Number
    },
    bedroom: {
      type: [Number,String]
    },
    iconSize:{
      type:Number
    },
    smallSize:{
      type:Boolean,
      default:false
    },
    unitType:{
      type:String,
    }
  },
  data()
  {
    return {
      HEIGHT
    }
  },
  computed:{
    blockHeight()
    {
      if(this.block && this.height)
      {
        return  `${this.block} · ${this.height} `
      }else {
        return `${this.block ? this.block : ''} ${this.height ? 'Tầng '+this.height : ''} `
      }
    },
    boxClass()
    {
      return  this.smallSize ? ` text-small ${this.smallSize}}` : `${this.smallSize}`
    }
  }
}
</script>

<style scoped>
.text-small span{
  font-size: 10px;
}
</style>