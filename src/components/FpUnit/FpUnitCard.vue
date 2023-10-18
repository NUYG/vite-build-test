<template>
  <div :class="classes" >
    <UnitImg :styleBottomText="unitTextImgStyle" :imgSrc="imgSrc" :ratioImg="ratioImg" :tag-pj-code="tagPjCode" :show-fur-text="showFurText"
             :custom-tag-text="availableText" :custom-tag-class=" minorVersion ? 'small-tag-top-left' : 'tag-top-left' "
             :unitTag="unitTag" :pjUnitText=" minorVersion ? '' :pjUnitText"  :ttImg="minorVersion ? 0 : ttImg " :style-img="notAvailable ? 'filter: saturate(0);':''">
      <template #extComp>
        <slot name="imgTagExt"></slot>
      </template>
    </UnitImg>

    <div class="d-flex justify-content-between mt-3">
      <div class="mt-lg-2 col-auto" :class="minorVersion ? 'pr-2' : 'px-2 mt-2'" v-if="pjData && (pjData.price|| pjData.priceText)">
        <span class="text-title font-weight-600 " :class="{'text-decoration-line-through' : notAvailable}">{{pjData.price}} </span>
        <span  class="font-weight-600 " :style="notAvailable ? `text-decoration: line-through` : ''">{{pjInformation.priceText}}</span>

      </div>
      <div class="col d-flex justify-content-end align-items-center" v-if="cusData">
          <FpUserImg :size="32" :borderRound="16"  :url="getUrlTypeAvtOfCusData(customerData).url"
                     :type="getUrlTypeAvtOfCusData(customerData).type"></FpUserImg>
      </div>
      <div class="col-auto mt-1">
          <span class="me-2" v-if="freshLv">
              <FpIcon :srcIcon="getUnitFreshIcon(freshLv)"  :size="minorVersion ? 24 : 36"></FpIcon>
        </span>
        <span class="border8 "  @click="onFavClick" style="background: #F2F2F2;"  v-if="favTag" :style="`padding:${paddingFavIcon}`">
           <FpIcon :srcIcon="favIcon" :size="minorVersion ? 16 : 24" ></FpIcon>
        </span>
      </div>
    </div>
    <div class="row mt-1" v-if="pjData">
      <FpUnitInfoView v-bind="pjData" :iconSize="16" v-if="shortPjInfo" :small-size="splitTwo"></FpUnitInfoView>
      <FpPjInformationTag v-else v-bind="pjData" :price="0" :iconSize="18" :span-margin="false"/>
    </div>
<!--    <p v-if="notAvailable" class="sell-text px-2 mt-2" :style="minorVersion ? 'font-size:10px' : 'font-size: 14px'">{{availableText}}</p>-->
    <p v-if="pjData.desc" :class="shortPjInfo ? 'text-11' :'text-content'" class="px-1 mt-2 text-gray">{{pjInformation.desc}}</p>
    <span v-if="pjData.freshTime && pjData.freshTime !== ''" :class="(shortPjInfo&&splitTwo) ? 'text-11' :'text-content'" class="px-1 mt-3 text-gray">Xác minh {{pjData.freshTime}} trước</span>
    <div class="d-flex justify-content-between p-2" v-if="pjData">
      <span v-if="pjData.status">{{transSPStt}}</span>
      <span v-if="pjData.nextMeetingDate">{{ getFullDateTime(pjData.nextMeetingDate) }}</span>
    </div>
    <div class="px-2 mt-1" v-if="pjData && pjData.status">
      <FpProgressBar :value="progressBarVal(pjData.status)" :progressBarColor="getColorByRentStatus(pjData.rent)"  :hProgressbar="4"/>
    </div>
    <slot name="customField"></slot>
  </div>
</template>

<script>
import {IMG_URL} from "@/utils/constants";
import FpPjInformationTag from "@/components/FpTag/FpPjInformationTag.vue";
import FpProgressBar from "@/components/FpProgressBar/FpProgressBar.vue";
import {getColorByRentStatus, getIconUrl, getValueProgressBarWithStatus, translate} from "@/utils/utils";
import {getDdMm, getFullDateTime} from "@/utils/dateTimeUtils";
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {getUnitFreshIcon, pjInformationBotUnitImg} from "@/utils/unit";
import {favObj, favObjAPI} from "@/utils/favAPI";
import {SALE_PROCESS_STATUS} from "@/utils/TransContent";
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";
import FpUnitInfoView from "@/components/FpUnit/FpUnitInfoView.vue";
import {transSPDetailStt2} from "@/utils/saleProcess";
import MobileShareBtn from "@/components/FpButton/MobileShareBtn.vue";
export default {
  props: {
    classes: {
      type: String
    },
    imgSrc: {
      type: String,
    },
    // unit price , percentExchange , bedroom, bathroom , size, ...
    pjInformation: {
      type: Object,
      default: () => {}
    },
    ratioImg: {
      type: Array,
      default:() => [1,1],
    },
    unitTag:{
      type:Array,
      default:[]
    },
    favTag:{
      type:Boolean,
      default:false
    },
    freshLv:{
      type:Number,
    },
    favUnit:{
      type:Boolean
    },
    ttImg:{
      type:Number
    },
    cusData:{
      type:Object,
      default:() => {}
    },
    unitTextImgStyle:{
      type:String
    },
    tagPjCode:{
      type:String
    },
    isAgentManager:{
      type:Boolean,
      default:false
    },
    notAvailable:{
      type:Boolean
    },
    splitTwo:{
      type:Boolean,
    },
    shortPjInfo:{
      type:Boolean,
      default:false
    },
    customTagText: {
      type:String
    },
    customTagClass: {
      type:String
    },
    showFurText:{
      type:Boolean
    }
  },
  data() {
    return {
      IMG_URL,
      fav:false
    }
  },
  computed:{
    favIcon()
    {
      return this.fav ? 'Heart-red.svg': `Heart.svg`
    },
    pjData()
    {
      return this.pjInformation
    },
    customerData()
    {
      return this.cusData
    },
    pjUnitText()
    {
      const pjCode= this.pjInformation?.unit_code
      return this.isAgentManager ? pjCode : this.pjInformationBotUnitImg(this.pjInformation,'pjBlock')
    },
    minorVersion()
    {
      return this.splitTwo
    },
    transSPStt(){
      return !this.pjData.status ? '' : (
        (this.pjData.aFreeTime !== undefined && this.pjData.sFreeTime !== undefined && this.pjData.nextMeetingDate !== undefined) ? transSPDetailStt2(
          this.pjData.status, this.pjData.agentData, this.pjData.aFreeTime, this.pjData.sFreeTime,
            this.pjData.nextMeetingDate, this.pjData.rent) : this.transStatus(this.pjData.status)
      )
    },
    availableText(){
      return this.notAvailable ?  (this.pjInformation.renting ? 'Đã cho thuê' : 'Đã bán')  : ''
    },
    paddingFavIcon() {
      return this.minorVersion ? '0.2rem' : '0.5rem'
    }
  },
  components:{
    FpUnitInfoView,
    FpIcon,
    FpPjInformationTag,
    FpProgressBar,
    UnitImg,
    FpUserImg,
    MobileShareBtn
  },
  methods:{
    getFullDateTime,
    getUrlTypeAvtOfCusData,
    getUnitFreshIcon,
    pjInformationBotUnitImg,
    getIconUrl,
    getColorByRentStatus,
    getDdMm,
    transStatus(status) {
      return translate(SALE_PROCESS_STATUS, status);
    },
    progressBarVal(status) {
      return getValueProgressBarWithStatus(status)
    },
    async onFavClick(event)
    {
      event.stopPropagation()
      this.fav=!this.fav
      const res= await favObjAPI(favObj.UNIT,this.pjInformation.id,this.fav)
    }
  },
  mounted() {
    this.fav=this.favUnit
  },
  watch:{
    favUnit(newVal)
    {
      this.fav=newVal
    }
  }
}
</script>

<style scoped>
.font-size-9{
  font-size: 9px !important;
}
</style>
