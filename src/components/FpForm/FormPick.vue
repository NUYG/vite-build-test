<template>
  <div :class="boxStyle">
<!--    <img alt="" :src="getIconUrl(titleIcon)" :class="iconClass">-->
    <FpIcon v-if="titleIcon" :src-icon="titleIcon" :class="iconClass" :size="sizeIcon"></FpIcon>
    <span class="text-gray small"> {{title}}</span>
    <div :class="groupBtnClass">
      <button class="border-number col-auto m-1"  v-for="(opt,index) in optionsVal" :key="index" @click="onPick(opt[0])" :class="{'button-blue-teal':opt[0]==picked}">
        {{opt[1]}}
      </button>
    </div>
  </div>
</template>

<script>
import {getIconUrl} from "@/utils/utils";
import FpIcon from "@/components/FpIcon/FpIcon.vue";

export default {
  components: {FpIcon},
  data()
  {
    return{
      picked:this.pickDefault
    }
  },
  methods: {
    getIconUrl,
    onPick(val)
    {
        this.picked= this.picked === val ? '' : val
        this.$emit('optVal',this.picked)
    },
  },
  emits:['optVal'],
  props: {
    optionsVal: {
      type: Array,
      default: () => []
    },
    title:{
      type:String,
    },
    titleIcon:{
      type:String,
    },
    borderBox:{
      type:Boolean,
      default:true
    },
    pickDefault:{
      type:[Number,String],
    },
    boxClass:{
      type:String,
      default:'p-3'
    },
    groupBtnClass:{
      type:String,
      default:'p-3'
    },
    iconClass:{
      type:String
    },
    sizeIcon:{
      type:Number,
      default:24
    }
  },
  computed:{
    boxStyle()
    {
      return this.borderBox ? 'border-gray rounded border ' + this.boxClass : this.boxClass
    }
  },
  watch:{
    pickDefault(newVal){
      this.picked=newVal
    }
  },

}
</script>