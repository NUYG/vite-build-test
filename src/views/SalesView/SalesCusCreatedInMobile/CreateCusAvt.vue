<template>
  <div v-if="isPopup" class="d-flex justify-content-end">
    <FpIcon srcIcon="times-solid.svg" :size="16" @iconClicked="onPcExitPopup"/>
  </div>
    <div class="row d-flex justify-content-center mt-2">
      <FpUserImg size="120" :borderRound="60" class="col-auto" :url="pickedAvt" :type="typeAvt" />
    </div>
  <div class="overflow-scroll p-3" style="height:35vh" :class="{'mt-4':isPopup}">
    <div class="row">
      <div class="col-3 mt-3">
        <FpUserAvt :freeSrcAvt="getIconUrl('uploadGray.svg')" @avtChanged="onUserUploadAvt"
                   :upload="true" :size="60" :anotherUser="true"/>
      </div>
      <div  class="col-3 mt-3" v-for="(icon,index) in CusAvtRepo" :key="index" @click="onAvtExampPick(icon)">
        <FpUserAvt :size="60" :freeSrcAvt="getIconUrl(icon)" :avtOutline="pickedOutline(icon)"></FpUserAvt>
      </div>

    </div>
  </div>
</template>

<script>
import FpUserAvt from "@/components/FpImg/FpUserAvt.vue";
import {getIconUrl} from "@/utils/utils";
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import {CusAvtRepo} from "@/utils/customerAvtRepo";
import FpIcon from "@/components/FpIcon/FpIcon.vue";

export default {
  props:{
    avtPickDef:{
      type:Object,
      default:() => {}
      // {  url: '' , type : 'icon || img ' }
    },
    isPopup:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      pickedAvt:'',
      typeAvt:'icon',
      CusAvtRepo,
      readyToRender: false,
    }
  },
  methods:
   {
     getIconUrl,
     onUserUploadAvt(avt) {
       this.typeAvt='default'
       this.pickedAvt=avt.dataUrl
       this.$emit('presetAvt',avt)
     },
     onAvtExampPick(avt)
     {
       this.typeAvt='icon'
       this.pickedAvt=avt
       this.$emit('presetAvt',avt)
     },
     onPcExitPopup()
     {
       this.$emit('exitPopup')
     },
     pickedOutline(icon)
     {
       return icon===this.pickedAvt ? '#549ff7' : ''
     },
     setAvtPropsToState(avtObj)
     {
       if(avtObj && avtObj.type==='icon')
       {
         this.typeAvt='icon'
         this.pickedAvt=avtObj.url
       }
       else if(avtObj.type==='default' && Object.keys(avtObj.url).length) {
         this.typeAvt='default'
         this.pickedAvt=avtObj.url
       }
     }
  },
  emits:['exitPopup','presetAvt'],
  mounted() {
    this.setAvtPropsToState(this.avtPickDef)
  },
  watch:{
    avtPickDef(newVal)
    {
      this.setAvtPropsToState(newVal)
    }
  },
  components: {
    FpIcon,
    FpUserAvt,
    FpUserImg
  },



}
</script>