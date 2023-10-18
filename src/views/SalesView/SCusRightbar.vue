<template>
  <div class="row p-lg-3 p-2">
    <b>Yêu cầu đang có</b>
    <div v-for="(inq, index) in inqs" :key="index" class="col-12 col-lg-3">
      <div @click="goToURL(inqHref(inq.id))" class="card-blue mt-3 p-lg-3 p-2">
        <div class=" p-2 d-flex flex-wrap" :class="{'row': inq.pjData.length>1}">
                    <span v-for="(pj, index) in inq.pjData" :key="index" class="border-rounded mt-2"
                          :style="{'background-color': pj.projectColor}"
                          style="height: 8px; width: 28px; border-radius: 20px; margin-left: 3px;"></span>
          <div class="px-0 col-1 mt-2">
                        <span :class="inq.rent ? 'rent-color' : 'sell-color'" class="dot"
                              style="margin-top: 0;margin-left: 5px;"></span>
          </div>
          <div class="row d-flex" v-if="inq.pjData.length>1">
                        <span v-for="(pj, index) in inq.pjData" :key="index" class=" col-auto px-0"> <span
                           v-if="index > 0">,</span> {{ pj.code }}</span>
          </div>
          <div class="d-flex" v-else>
                        <span v-for="(pj, index) in inq.pjData" :key="index"
                              class=" col-auto px-0"> {{ pj.name }}</span>
          </div>

        </div>
        <div class="row p-2">
          <div class="col-4 border-end border-2">
            <b>{{ inq.rent ? 'Thuê' : 'Mua' }}</b>
          </div>
          <div class="col-4 border-end border-2 d-flex justify-content-center">
            <b v-if="inq.ceilingPrice">{{ inq.ceilingPrice }}{{ inq.rent ? 'Tr' : ' Tỷ' }}</b>
            <b v-else>Không</b>
          </div>
          <div class="col-4 d-flex justify-content-center mt-0 mt-md-2 mt-lg-0">
            <b class="px-2">{{ inq.bedroom }}</b>
            <img alt="bedIcon" :src="getIconUrl('bed-detail.svg')"/>
          </div>
        </div>
        <div class="row mt-2 p-2">
          <div v-if="inq.moveInDay" class="col-4 col-lg-5 col-md-8 d-flex justify-content-around">
            <img alt="calendarIcon" :src="getIconUrl('calender-gray.svg')"/>
            <span class="text-gray">{{ getDdMm(inq.moveInDay) }}</span>
          </div>
          <div v-if="inq.sps.length > 0" class="col-3 col-md-4 d-flex ">
            <img alt="spIcon" :src="getIconUrl('Swap.svg')"/>
          </div>
        </div>
      </div>
      <div v-for="(sp, index) in inq.sps" :key="index" class="mt-2 p-lg-3 p-2">
        <div @click="goToURL(spHref(sp.id))" class="row p-2 d-flex">
          <div class="px-0 col-1 mt-2">
                        <span class="dot" :style="{'background-color': sp.unitData.pjColor}"
                              style="margin-top: 0;margin-left: 5px;"></span>
          </div>
          <span class="col-4 px-0"><b> #{{ inq.id }}{{ sp.id }} </b></span>
          <div class="px-0 col-1 mt-2">
                        <span :class="inq.rent ? 'rent-color' : 'sell-color'" class="dot"
                              style="margin-top: 0;margin-left: 5px;"></span>
          </div>
          <span v-if="parseInt(unitPriceStr(inq.rent, sp.unitData))" class="col px-0">{{
              unitPriceText(inq.rent, sp.unitData)
            }}
                    </span>
          <span v-else>Không</span>
        </div>
        <div class="text-gray"> {{ transProcessStatus(sp.status) }}</div>
        <div v-if="sp.nextMeetingDate" class="row mt-2 p-2">
          <div class="col-4 col-lg-5 d-flex justify-content-around">
            <img alt="calendarIcon" :src="getIconUrl('calender-gray.svg')"/>
            <span class="text-gray"> {{ getDdMm(sp.nextMeetingDate) }} </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {floatFixed, getIconUrl, translate} from "@/utils/utils";
import {goToURL} from "@/utils/utils";
import {unitPriceText, unitPriceStr} from "@/utils/unit";
import {getDdMm} from "@/utils/dateTimeUtils";
import {S_INQ_DETAIL_URL, S_SP_DETAIL_URL} from "@/router/URLs";

export default {
  components: {},
  data() {
    return {}
  },
  computed: {},
  methods: {
    unitPriceStr,
    getDdMm,
    getIconUrl,
    goToURL,
    floatFixed,
    unitPriceText,
    spHref(id) {
      return S_SP_DETAIL_URL + "-" + id;
    },
    inqHref(id) {
      return S_INQ_DETAIL_URL + "/" + id;
    },
    transProcessStatus(status) {
      return translate(this.SALE_PROCESS_STATUS, status);
    },
  },
  props: {
    inqs: {
      type: Array,
      default: () => ([]),
    },
    SALE_PROCESS_STATUS: {
      type: Array,
      default: () => ([]),
    },
  },
  watch: {},
  mounted() {
  }
}
</script>

<style scoped>
</style>
