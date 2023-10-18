<template>
  <div class="col-auto">
    <FpUserImg v-if="isPopup" :url="currentAvt.url" :type="currentAvt.type" :size="sizeAvt" :borderRound="sizeAvt/2"
               @click="openCusPickAvt=true" :class="{'position-relative hoverImg':hoverImg}" />
    <span v-if="hoverImg" class='user-img-text' style="left: 30%">Thay đổi</span>
    <div class="col-12 show" :id="isPopup?'warningToast':''" :class="{'popup-pc':isPopup}" v-if="openCusPickAvt">
      <CreateCusAvt :avtPickDef="{url:avtRender.url,type:avtRender.type}" :isPopup="isPopup" @exitPopup="openCusPickAvt=false" @presetAvt="onAvtCreate"/>
      <div class="row justify-content-around mt-3" v-if="isPopup">
        <ButtonView content="Hủy bỏ" class="col-auto" status="gray-btn" @btnClick="onUploadAvtCanceled"/>
        <ButtonView content="Hoàn thành" class="col-auto" status="gray-btn" @btnClick="onSubmitAvtUpload"/>
      </div>
    </div>
    <div v-if="openCusPickAvt && isPopup" id="overlay" @click="openCusPickAvt=false"></div>
  </div>
</template>

<script>
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import CreateCusAvt from "@/views/SalesView/SalesCusCreatedInMobile/CreateCusAvt.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {scrWdtEnum, scrWdtTo} from "@/utils/windowWidth";
export default  {
  data()
  {
    return {
      avtRender:{
        url:'',
        type:''
      },
      openCusPickAvt:false,
      // archive variable
      dataUrl:{},
      preset_avt:'',
    }
  },
  components:{
    CreateCusAvt,
    FpUserImg,
    ButtonView
  },
  props:{
    // {  url: '' , type : 'icon || img ' }
    currentAvt:{
      type:Object,
      default:() => {}
    },
    sizeAvt:{
      type:Number,
      default:100
    },
    hoverImg:{
      type:Boolean,
      default:false
    },
    isPopup: {
      type:Boolean,
      default:false
    },
    isCreateInqPage:{
      type:Boolean,
      default:false
    }
  },
  methods:
  {
    setCurrentAvtToState(currentAvt)
    {
       this.avtRender.url=currentAvt.url
       this.avtRender.type=currentAvt.type
    },
    onAvtCreate(val)
    {
      if(val.dataUrl)
      {
        this.dataUrl=val
        this.avtRender.url=val.dataUrl
        this.avtRender.type='default'
        this.preset_avt=''
      }
      else {
        this.preset_avt=val
        this.avtRender.url=val
        this.avtRender.type='icon'
        this.dataUrl={}
      }
      if(scrWdtTo(scrWdtEnum.MD) && this.isCreateInqPage)
      {
        this.$emit('updateAvt',this.preset_avt!=='' ? this.preset_avt : this.dataUrl)
      }
    },
    onUploadAvtCanceled()
    {
      this.preset_avt=''
      this.dataUrl={}
      this.openCusPickAvt=false
    },
    onSubmitAvtUpload()
    {
      this.$emit('updateAvt',this.preset_avt!=='' ? this.preset_avt : this.dataUrl)
      this.openCusPickAvt=false
    }
  },
  emits:['updateAvt'],
  mounted() {
    this.setCurrentAvtToState(this.currentAvt)
    if(scrWdtTo(scrWdtEnum.MD) && this.isCreateInqPage)
    {
      this.openCusPickAvt=true
    }
  },
  watch:{
    currentAvt(newVal)
    {
      this.setCurrentAvtToState(newVal)
    }
  }
}
</script>

<style scoped>
.hoverImg :hover{
  filter: brightness(50%);
}
.popup-pc{
  right:35%!important;
  bottom: 18% !important;
}
@media only screen and (max-width: 576px) {
  .popup-pc{
    right:0 !important;
    bottom: 18% !important;
  }
}
</style>
