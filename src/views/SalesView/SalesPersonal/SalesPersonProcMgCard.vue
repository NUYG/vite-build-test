<template>
  <div class="position-relative h-100">
    <div class="row d-flex justify-content-between px-2" v-if="showCustomer">
      <div class=" col-auto d-flex  align-items-center" >
        <span class="text-content font-weight-600">{{pjData.price}}{{uPricePfxExt(pjData.rent)}}</span>
      </div>
      <div class="col-auto">
        <FpUserImg :size="40" :borderRound="20" :url="getUrlTypeAvtOfCusData(pjData.cusData).url"
                   :type="getUrlTypeAvtOfCusData(pjData.cusData).type" />
      </div>
    </div>
    <div class="row mt-2 px-2">
      <span class="text-content text-color-black">{{sttCard}} </span>
    </div>
    <div class="row">
      <FpPjInformationTag v-bind="pjInformationData" ></FpPjInformationTag>
    </div>
    <div class="row mt-2 px-2 " style="margin-bottom: 30%">
      <span class="text-12 text-gray">{{pjData.salesNote}}</span>
    </div>
    <div class="px-2 mt-2 row position-absolute w-100" style="bottom: 10%">
      <div class="row d-flex justify-content-between">
        <span class="col-auto text-content text-color-black">{{ translate(SALE_PROCESS_STATUS, pjData.status) }}</span>
        <span v-if="pjData.nextMeetingDate" class="col-auto text-gray text-12">{{getDdMm(pjData.nextMeetingDate)}}</span>
      </div>
      <div class="mt-2">
        <FpProgressBar :value="progressBarVal(pjData.status)" :progressBarColor="getColorByRentStatus(pjData.rent)"  :hProgressbar="4"/>
      </div>
    </div>
  </div>

</template>


<script>
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import FpPjInformationTag from "@/components/FpTag/FpPjInformationTag.vue";
import FpProgressBar from "@/components/FpProgressBar/FpProgressBar.vue";
import {getStatusTextByRent, uPricePfxExt} from "@/utils/unit";
import {getColorByRentStatus, getObjField, getValueProgressBarWithStatus, translate} from "@/utils/utils";
import {POINTING, SALE_PROCESS_STATUS} from "@/utils/TransContent";
import {getDdMm} from "@/utils/dateTimeUtils";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";

export default {
  components:{
    FpProgressBar,
    FpPjInformationTag,
    UnitImg,
    FpUserImg
  },
  props:{
    pjInformation:{
      type:Object,
      default: () => {}
    },
    showCustomer:{
      type:Boolean,
      default:true
    }
  },
  data()
  {
    return {
      SALE_PROCESS_STATUS
    }
  },
  methods:{
    getUrlTypeAvtOfCusData,
    uPricePfxExt,
    getDdMm,
    translate,
    getColorByRentStatus,
    progressBarVal(status) {
      return getValueProgressBarWithStatus(status)
    },
  },
  computed:{
    sttCard()
    {
      const bedroom = parseInt(this.pjInformation?.bedroom)>0 ?  this.pjInformation?.bedroom+'PN' : ''
      return `#${this.pjInformation?.id}
       ${this.pjInformation?.cusData?.name} ${getStatusTextByRent(this.pjInformation?.rent)} ${this.pjInformation?.pjName} ${bedroom} `
    },
    pjData()
    {
      return this.pjInformation
    },
    pjInformationData()
    {
      return {
        bedroom:getObjField(this.pjInformation,'bedroom'),
        bathroom:getObjField(this.pjInformation,'bathroom'),
        size:getObjField(this.pjInformation,'size'),
        balcony:translate(POINTING,getObjField(this.pjInformation,'balcony'))
      }
    }
  }
}
</script>