<template>
  <div class=" card-gray-active h-100 cusMgmtCard" :class="{'canceled-card':!active}">
    <FpCusTag :cusId="cusTagId" v-bind="cusTagData" :avtSize="60" @favClick="onFavClick"/>
    <div class="row mt-2 position-relative bottom-0">
<!--      :autoplayTime="2000"-->
      <FpSwiperWContent>
        <template #swiperSlide>
          <swiper-slide v-for="(inq,index) in inqVal" :key="index" class="swiper-wrapper">
            <FpProgressUnitTag v-bind="fillInqValToUnitTag(inq)" :progressColor="cusTagData.avtOutline"/>
          </swiper-slide>
        </template>
      </FpSwiperWContent>
    </div>
  </div>
</template>

<script>
import {SwiperSlide} from 'swiper/vue';
import FpCusTag from "@/components/FpTag/FpCusTag.vue";
import FpSwiperWContent from "@/components/FpSwiper/FpSwiperWContent.vue";
import FpProgressUnitTag from "@/components/FpTag/FpProgressUnitTag.vue";
import {getObjField, translate} from "@/utils/utils";
import {transSPDetailStt2} from "@/utils/saleProcess";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";

export default {
  data() {
    return {}
  },
  components: {
    FpProgressUnitTag,
    FpSwiperWContent,
    FpCusTag,
    SwiperSlide
  },
  computed: {
    borderColor() {
      const color = this.cusTagData.avtOutline === '#FFD028' ? '#FFD028' : ''
      return color !== '' ? `border: 2px solid ${color}` : ''
    },
  },
  props: {
    cusTagData: {
      type: Object,
      default: () => {
      }
    },
    cusTagId: {
      type: Number,
    },
    inqVal: {
      type: Array,
      default: () => []
    },
    active: {
      type: Boolean
    },
    SALE_PROCESS_STATUS: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    transSPStt(spData) {
      if (!spData) {
        return '';
      }
      return !spData.status ? '' : (
        (spData.aFreeTime !== undefined && spData.sFreeTime !== undefined && spData.nextMeetingDate !== undefined) ? transSPDetailStt2(
          spData.status, spData.agentData, spData.aFreeTime, spData.sFreeTime,
          spData.nextMeetingDate, spData.rent) : this.transStatus(spData.status)
      )
    },
    fillInqValToUnitTag(data) {
      return {
        code: this.getStatusCodeByData(data),
        processing: getObjField(data, 'peakSP')?.status,
        spsStatus: this.transSPStt(data.peakSP),
        totalSps: data.ttSPs,
        rent: data.rent
      }
    },
    getStatusCodeByData(data) {
      const rentStatus = data.rent ? 'Thuê ' : 'Mua '
      const price = convertVndToUserCurrency(data.ceilingPrice,data.rent,UnitCurrency.simple)
      let code = ''
      if (data.pjData && data.pjData.length > 0) {
        data.pjData.map(pj => {
          code = code + pj.name + ' '
        })
      }
      return rentStatus + code + price
    },
    onFavClick(favStatus) {
      this.$emit('favClick', this.cusTagData, favStatus, 'icon');
    },
  },
  mounted() {
    console.log('moun mount')
  },
  beforeUnmount() {
    console.log('un mount')
  },
  emits: ['favClick', 'rmCusClick']
}
</script>

<style scoped>
.cusMgmtCard {
  padding: 17px 20px 13px;
}

.swiper-wrapper {
  margin-bottom: 30px !important;
}
</style>
