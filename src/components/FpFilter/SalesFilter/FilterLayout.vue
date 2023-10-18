<template>
    <div class="row cursor-pointer" @click="onExt" :class="layoutClass" >
      <label v-if="labelContent" :style="`font-weight: ${fontWLabel}`" :class="labelClasses" class="cursor-pointer text-content col-auto" >
        {{labelContent}}
      </label>
      <FpIconRotate  v-if="canExt" :srcIcon="arrowIcon" :size='iconSize' class="p-0" :class="{'rotate90':extend}" ></FpIconRotate>
    </div>
    <slot name="filterContent" v-if="extend || !canExt"></slot>
</template>

<script>
import FpIconRotate from "@/components/FpIcon/FpIconRotate.vue";
export default {
  components:{
    FpIconRotate
  },
  props:{
    labelContent:{
      type:String,
    },
    extending:{
      type:Boolean,
      default:false
    },
    fontWLabel:{
      type:Number,
    },
    canExt:{
      type:Boolean,
      default: true
    },
    labelClasses:{
      type:String
    },
    layoutClass:{
      type:String
    },
    arrowGray:{
      type:Boolean,
      default:true
    },
    iconSize:{
      type:Number,
      default:20
    }

  },
  data()
  {
    return {
      extend:false,
    }
  },
  computed:{
    arrowIcon()
    {
      return this.arrowGray ? 'chevron-right-solid.svg': 'chevron-right.svg'
    }
  },
  mounted() {
    this.extend=this.extending
  },
  methods:{
    onExt()
    {
      this.extend=!this.extend
    }
  },
  watch:{
    extending(newVal)
    {
      this.extend=newVal
    }
  }
}
</script>
