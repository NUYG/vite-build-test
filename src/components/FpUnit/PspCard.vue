<template>
  <div class="h-100 position-relative">
    <div style="height: 20%">
      <div class="row mt-2 px-2">
        <span class="text-content text-color-black">{{ sttCard }}</span>
      </div>
      <div class="row mt-2 px-2">
        <span class="text-12 text-gray">{{ pspData?.salesNote }}</span>
      </div>
    </div>
    <div class="overflow-hidden" style="height: 30%">
      <div v-for="(categoryData, categoryName, index) in negotiateData" :key="index" class="row d-flex flex-wrap px-2">
        <div v-if="index < 3" v-for="(itemData, itemName, innerIndex) in categoryData" :key="innerIndex" class="col-12">
          <SPNegoItem
              :itemData="itemData" :cateName="categoryName"
              :canDelete="false" :itemName="itemName" :rent="pspData?.rent"
              :isAgent="false" :editable="false" :oneMan="true"
          />
        </div>
      </div>
    </div>

    <div class="row px-2" v-if="pspData?.price && parseInt(pspData?.price) > 0">
      <span class="font-weight-600 text-title">{{convertVndToUserCurrency(pspData?.price,pspData?.rent,UnitCurrency.extend)}}</span>
    </div>
    <div class="row">
      <FpPjInformationTag v-bind="pjInformationData"></FpPjInformationTag>
    </div>
    <div class="row px-2 mt-2 w-100 position-absolute" style="bottom: 10%">
      <div class="row d-flex justify-content-between">
      <span class="col-auto text-content text-color-black">
        {{ translate(SALE_PROCESS_STATUS(), pspData?.status) }}
      </span>
        <span v-if="pspData?.nextMeetingDate" class="col-auto text-gray text-12">
        {{ getDdMm(pspData?.nextMeetingDate) }}
      </span>
      </div>
      <div class="mt-2">
        <FpProgressBar
            :value="progressBarVal(pspData?.status)"
            :progressBarColor="getColorByRentStatus(pspData?.rent)"
            :hProgressbar="4"
        />
      </div>
    </div>
  </div>


</template>

<script>
import FpPjInformationTag from "@/components/FpTag/FpPjInformationTag.vue";
import FpProgressBar from "@/components/FpProgressBar/FpProgressBar.vue";
import {getStatusTextByRent, uPricePfxExt} from "@/utils/unit";
import {getColorByRentStatus, getObjField, getValueProgressBarWithStatus, translate} from "@/utils/utils";
import {POINTING, SALE_PROCESS_STATUS} from "@/utils/TransContent";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";
import {getDdMm} from "@/utils/dateTimeUtils";
import SPNegoItem from "@/components/FpTag/SPNegoItem.vue";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";

export default {
  props: {
    pspData: {
      type: Object,
      default: () => {
      }
    }
  },
  methods: {
    convertVndToUserCurrency,
    SALE_PROCESS_STATUS() {
      return SALE_PROCESS_STATUS
    },
    getUrlTypeAvtOfCusData,
    uPricePfxExt,
    getDdMm,
    translate,
    getColorByRentStatus,
    progressBarVal(status) {
      return getValueProgressBarWithStatus(status)
    },
  },
  components: {SPNegoItem, FpProgressBar, FpPjInformationTag},
  computed: {
    UnitCurrency() {
      return UnitCurrency
    },
    sttCard() {
      const bedroom = parseInt(this.pspData?.bedroom) > 0 ? this.pspData?.bedroom + 'PN' : ''
      return `#${this.pspData?.id}
       ${this.pspData?.cusData?.name} ${getStatusTextByRent(this.pspData?.rent)} ${this.pspData?.pjName} ${bedroom} `
    },
    pjInformationData() {
      return {
        bedroom: getObjField(this.pspData, 'bedroom'),
        bathroom: getObjField(this.pspData, 'bathroom'),
        size: getObjField(this.pspData, 'size'),
        balcony: translate(POINTING, getObjField(this.pspData, 'balcony')),
        managementCoverage: getObjField(this.pspData, 'managementCoverage')
      }
    },
    negotiateData()
    {
      return this.pspData?.negotiate
    }
  }
}
</script>
