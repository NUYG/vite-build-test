<template>
    <div class="row d-flex justify-content-around align-items-center ">
        <div class="col-12 col-md-4 font-size-12 ps-lg-0">
          <div class="row">
            <div class="font-weight-600 col-md-12 col-auto pe-0"> {{ transPrice(stateData.renting,stateData) }}</div>
            <div  class="mt-lg-2 mt-0 col-md-12 col-12">{{unitDetailInfo}}</div>
            <div  class="mt-2 text-gray col-md-12 col-12">{{pjInformationBotUnitImg(stateData,'block')}}</div>
          </div>

        </div>
        <div class="col-12 col-md-3 font-size-12 mt-2 mt-lg-0">
          <div class="row">
            <div class="font-weight-600 col-md-12 col-auto pe-0">
              <FpIcon  :srcIcon="getFurIcon(stateData.furniture)" :size="24"/> <span v-if="isNotMobile">{{ transFurniture(stateData.furniture) }}</span>
            </div>
            <div  class="mt-lg-2 mt-0 col-md-12 col-auto"  v-if="stateData.managementCoverage">
                <FpIcon  :size="24" srcIcon="Checks-solid.svg"/>
                <span v-if="isNotMobile"> Phí quản lý</span>
            </div>
            <div  class="mt-lg-2 mt-0  col-md-12 col-auto d-flex align-items-center">
                  <FpIcon v-if="isNotMobile" src-icon="Building_Level.svg" :size="24">
                </FpIcon> Tầng {{ translate(HEIGHT, stateData.height) }}</div>
          </div>

        </div>
        <div class="col-12 col-md-4 font-size-12 mt-2 mt-lg-0">
          <div class="row">
            <div class="col-auto col-md-12">
              <span v-if="(stateData.view ||stateData.view2 )" class="text-gray">View
                <span v-if="stateData.view"> <img alt="" :src="getIconUrl(stateData.view)"/> {{ translate(this.VIEW, stateData.view) }}</span>
                <span v-if="stateData.view2"><img alt="" :src="getIconUrl(stateData.view2)"/> {{ translate(this.VIEW, stateData.view2) }}</span>
              </span>
            </div>
            <div class="col-auto mt-lg-3  text-gray  col-md-12">
              <span v-if="stateData.balcony">Hướng: {{translate(this.POINTING,stateData.balcony)}}</span>
            </div>
          </div>

        </div>
    </div>
</template>

<script>
import {
  getFurIcon,
  getPjDistrict,
  pjInformationBotUnitImg,
  transFurniture,
  unitPrice,
  unitPriceTextExt
} from "@/utils/unit";
import FpPjInformationTag from "@/components/FpTag/FpPjInformationTag.vue";
import {getIconUrl, translate} from "@/utils/utils";
import {VIEW, POINTING, HEIGHT} from "@/utils/TransContent";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";

export default {
  components: {FpIcon, FpPjInformationTag},
  data()
  {
    return {
      VIEW,
      POINTING,
      HEIGHT
    }
  },
  methods: {
    transFurniture,
    getFurIcon,
    translate,
    getIconUrl,
    pjInformationBotUnitImg,
    getPjDistrict,
    unitPriceTextExt,
    transPrice(rent,unit)
    {
      return convertVndToUserCurrency(unitPrice(rent, unit),rent,UnitCurrency.extend)
      // return unitPriceTextExt(rent,unit)
    }
  },
  props:{
    dataRender:{
      type:Object,
      default:() => {}
    }
  },
  computed:{
    isNotMobile()
    {
      return scrWdtFrom(scrWdtEnum.MD)
    },
    stateData()
    {
      return this.dataRender
    },
    unitDetailInfo()
    {
      const bedroom= parseInt(this.stateData.bedroom) > 0 ? this.stateData.bedroom+ 'PN ' : ''
      const bathroom= parseInt(this.stateData.bathroom) > 0 ? this.stateData.bathroom+ 'WC ' : ''
      const size= parseInt(this.stateData.size) > 0 ? this.stateData.size+ 'm²' : ''
      return bedroom + bathroom + size
    },

  }
}
</script>

<style>
.font-size-12 {
  font-size: 12px !important;
}

</style>
