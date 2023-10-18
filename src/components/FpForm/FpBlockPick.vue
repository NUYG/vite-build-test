<template>
  <div  :class="{'border-gray rounded border':borderBox}">
    <div class="d-flex justify-content-between">
       <span class="col-auto">
           <FpIcon :src-icon="titleIcon" :size="sizeIcon"></FpIcon>
           <span class="text-gray small"> {{title}}</span>
       </span>
        <span class="col-auto px-2" v-if="canExtClick" @click="extendOpt=!extendOpt">
             <FpIconRotate :src="getIconUrl('chevron-down-solid.svg')" :class="{'rotate-180' : extendOpt}"
                           :size="12" ></FpIconRotate>
        </span>
    </div>

    <div class="d-flex flex-wrap" v-if="extendOpt">
      <button class="border-number me-lg-5 mt-lg-3 mt-3 me-3 col-auto"  v-for="(opt,index) in optionsVal" :key="index" @click="onPick(opt.id)" :class="{'button-blue-teal':picked.includes(opt.id)}">
        {{opt.name}}
      </button>
    </div>
  </div>
</template>

<script>
import {getIconUrl} from "@/utils/utils";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpIconRotate from "@/components/FpIcon/FpIconRotate.vue";

export default {
  components: {FpIconRotate, FpIcon},
  data()
  {
    return{
      picked:[],
      extendOpt:true
    }
  },
  methods: {
    getIconUrl,
    onPick(id)
    {
      if (this.picked.includes(id)) {
        this.picked.splice(this.picked.indexOf(id), 1);
      } else {
        this.picked.push(id);
      }
      this.$emit('optVal',id)
    },
    setPickedItem()
    {
      if(this.selectedBlock)
      {
        for (let i = 0; i < this.selectedBlock.length; i++) {
          if (this.optionsVal.some(elem => elem.id === this.selectedBlock[i])) {
            this.picked.push(this.selectedBlock[i]);
          }
        }
      }
    }
  },
  mounted() {
    this.setPickedItem()
    this.extendOpt=this.setExtendOpt
  },
  watch:{
    setExtendOpt(newVal)
    {
      this.extendOpt=newVal
    }
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
    selectedBlock:{
      type:Array,
      default:() => []
    },
    setExtendOpt:{
      type:Boolean,
      default:true
    },
    canExtClick:{
      type:Boolean
    },
    sizeIcon:{
      type:Number,
      default:24
    }
  }
}
</script>