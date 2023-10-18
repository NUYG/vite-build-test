<template>
  <div class="container-fluid h-100">
    <div class="row d-flex ">
      <div class="col px-0" v-if="unitData.pjName">
        <span class="pjText">{{ unitData.pjName }}</span>
        <slot name="titleUnit">

        </slot>
      </div>
      <div class="col-auto d-flex justify-content-center h-100 pe-lg-0" v-if="unitInteract">
        <div class="row d-flex justify-content-around ">
          <div class="col-auto btn-padding-gray" @click="onFavUnit">
            <FpIcon :srcIcon="favIcon" :size="sizeInteractIcon"></FpIcon>
          </div>
          <div class="col-auto btn-padding-gray" @click="onDownloadShare">
            <FpIcon :srcIcon="shareIcon" :size="sizeInteractIcon"></FpIcon>
          </div>
          <div class="col-auto btn-padding-gray" @click="onOpenRB">
            <FpIcon srcIcon="Handshake.svg" :size="sizeInteractIcon"></FpIcon>
          </div>
        </div>
      </div>
    </div>
    <div class="row d-flex" v-if="keepHeightUnitType">
      <span class="font-weight-600 ">{{ unitData.unitType }}</span>
    </div>


    <div class="row mt-2" :class="{'mt-4':!unitData.unitType}">
      <span v-if="unitData.bedroom !== 0 && unitData.bedroom" class="col-auto unit-important-info">{{ unitData.bedroom }}<FpIcon srcIcon="bed.svg"
                                                                                                       :size="24"
                                                                                                       class="ms-1"></FpIcon></span>
      <span v-if="unitData.bathroom" class="col-auto unit-important-info">{{ unitData.bathroom }}<FpIcon
          srcIcon="Shower.svg" :size="24" class="ms-1"></FpIcon></span>
      <span v-if="unitData.size>0" class="col-auto unit-important-info"><FpIcon srcIcon="Squaremetre.svg" :size="24"
                                                                                class="me-1"></FpIcon>{{ unitData.size }}m2</span>
    </div>
    <slot name="contractAndFee">

    </slot>
    <div class="row ">
      <span v-if="unitData.block" class="col-auto pj-info-field pe-0"><FpIcon srcIcon="Building_Level.svg"
                                                                         :size="20"></FpIcon> Block: </span>
      <span v-if="unitData.block" class="col-auto px-1 pj-info-content">{{ unitData.block }},</span>
      <span v-if="unitData.height" class="col-auto  pj-info-content">Tầng {{translate(HEIGHT, unitData.height) }}</span>
    </div>

    <div class="row" style="margin-top: 2px" v-show="unitData.balcony">
      <span class="col-auto pj-info-field"><FpIcon srcIcon="Compass.svg" :size="20"></FpIcon>Hướng ban công:</span>
      <span class="col-auto px-0 pj-info-content">{{ translate(POINTING, unitData.balcony) }}</span>
    </div>
    <div class="row" style="margin-top: 2px" v-if="unitData.door">
      <span class="col-auto pj-info-field"><FpIcon srcIcon="Door-solid.svg" :size="20"></FpIcon>Hướng cửa:</span>
      <span class="col-auto px-0 pj-info-content">{{ translate(POINTING, unitData.door) }}</span>
    </div>
    <div class="row" style="margin-top: 2px">
      <span class="col-auto pj-info-field"><FpIcon srcIcon="FNT.svg" :size="20"></FpIcon> Nội thất:</span>
      <span class="col-auto px-0 pj-info-content">{{ transFurniture(unitData.furniture) }}</span>
    </div>
    <div class="row mt-xl-3 mt-lg-2 mt-xxl-4 mt-2" v-if="unitData.view || unitData.view2">
      <span style="color:rgba(0, 0, 0, 0.40);font-size: 12px;line-height: 18px;">View</span>
    </div>
    <div class="row mt-lg-2 mt-1">
      <div class="col-auto"  v-if="unitData.view">
        <FpIcon :srcIcon="viewIcon(unitData.view)" :size="18"></FpIcon>
        <span
            style="margin-left: 4px;color: #1C1C1C;font-size: 14px;line-height: 18px;">{{ translate(VIEW, unitData.view) }}</span>
      </div>
      <div class="col-auto" v-if="unitData.view2">
        <FpIcon :srcIcon="viewIcon(unitData.view2)" :size="18"></FpIcon>
        <span
            style="margin-left: 4px;color: #1C1C1C;font-size: 14px;line-height: 18px;">{{ translate(VIEW, unitData.view2) }}</span>
      </div>
    </div>
    <p class=" mt-2 text-gray" style="font-size: 14px" v-if="unitData.desc">{{unitData.desc}}</p>

    <slot name="extUnitInfo"></slot>

    <div class="row mt-2 mt-xl-3 mt-xxl-4 w-100 p-1 border8 first-pair-unit-tour-2a" v-if="freshLv" :class="freshLvBox">
      <div class="col-auto px-0">
        <FpIcon :srcIcon="getUnitFreshIcon(freshLv)" :size="36" class="p-0" style="margin: 7px"></FpIcon>
      </div>
      <span class="col  d-flex  align-items-center"
            style="font-size: 12px;line-height: 20px">{{freshUnitContent[freshLv]}}</span>
    </div>
  </div>
</template>

<script>
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {freshUnitContent, getUnitFreshIcon, getViewIcon, transFurniture} from "@/utils/unit";
import {translate} from "@/utils/utils";
import {HEIGHT, POINTING, VIEW} from "@/utils/TransContent";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";

export default {
  components: {FpIcon},
  data() {
    return {
      unitData: {
        bedroom: '',
        bathroom: '',
        size: '',
        view: '',
        view2: '',
        block: '',
        height: '',
        furniture: '',
        pjName: '',
        balcony: '',
        door: '',
        unitType:'',
        fav:false,
        desc:'',
      },
      HEIGHT,
      POINTING,
      VIEW,
    }
  },
  props: {
    pjInformation: {
      type: Object,
      default: () => {
      }
    },
    freshLv:{
      type:Number
    },
    unitInteract:{
      type:Boolean,
      default:true
    },
    keepHeightUnitType:{
      type:Boolean,
      default:true
    }
  },
  methods: {
    transFurniture,
    translate,
    getUnitFreshIcon,
    viewIcon(view) {
      return getViewIcon(view, true);
    },
    copyPropsToData() {
      const propsKeys = Object.keys(this.pjInformation);
      propsKeys.forEach((key) => {
        if (this.unitData.hasOwnProperty(key)) {
          this.unitData[key] = this.pjInformation[key];
        }
      });
    },
    onFavUnit()
    {
      this.unitData.fav=!this.unitData.fav
      this.$emit('favUnit',this.unitData.fav)
    },
    onDownloadShare()
    {
      // scrWdtFrom(scrWdtEnum.MD) ? this.$emit('downloadUnit') : this.$emit('shareUnit')
      this.$emit('shareUnit')
    },
    onOpenRB()
    {
      this.$emit('openRB')
    }
  },
  emits:['favUnit','downloadUnit','shareUnit','openRB'],
  mounted() {
    this.copyPropsToData();
  },
  computed:{
    sizeInteractIcon()
    {
      return scrWdtFrom(scrWdtEnum.MD) ? 20 : 24
    },
    freshUnitContent() {
      return freshUnitContent
    },
    favIcon()
    {
      return this.unitData.fav ? 'Heart-red.svg': `Heart.svg`
    },
    shareIcon()
    {
      // return scrWdtFrom(scrWdtEnum.MD) ? 'DownloadSimple.svg' : 'ShareNetwork.svg'
      return  'ShareNetwork.svg'

    },
    freshLvBox()
    {
      return this.freshLv>=2 ? 'style-fresh-lv2' : 'style-fresh-lv1'
    }
  },
  watch: {
    pjInformation: {
      handler(newVal) {
        this.copyPropsToData(newVal);
      },
      deep: true,
    },
  }
}
</script>
<style>
.btn-padding-gray {
  padding: 8px;
  border-radius: 8px;
  background: #F2F2F2;
  margin: 0 8px;
}
.btn-padding-gray:active {
  background: black !important;
}
.btn-padding-gray:active img{
  filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(1deg) brightness(102%) contrast(104%);
}

.pjText {
  font-size: 12px;
  line-height: 25px;
  font-weight: 700;
}

.pj-info-field {
  text-align: right;
  font-size: 14px;
  line-height: 22px;
}

.pj-info-content {
  color: #1C1C1C;
  text-align: right;
  font-size: 14px;
  line-height: 22px;
}

.unit-important-info {
  font-size: 18px;
  line-height: 22px;
  margin-right: 5px
}
.style-fresh-lv2
{
  background: rgba(20, 174, 92, 0.1);
  color: rgb(20, 174, 92);
}
.style-fresh-lv1
{
  background: rgba(0, 0, 0, 0.05);
  color:  #999;
}

</style>
