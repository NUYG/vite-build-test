<template>
   <div v-if="currentData" >
      <div class='row mt-3' v-if='getImgData.imgs.length>0'>
         <div class='col-12' style='height: 200px'>
            <SwipeBox :img='getImgData.imgs.map((item) => item.wm_url)'/>
         </div>
      </div>
      <div class="row mt-4 p-2 ">
         <div class="d-flex justify-content-start">
            <img alt="" class="process-sidebar_icon" :src="getIconUrl('HouseSimple-solid.svg')">
            <a class="text-content font-weight-400">{{ currentData.unitData.pjData.name }}</a>
         </div>
      </div>
      <div class="row p-2">
         <div class="d-flex justify-content-start ">
            <img alt="" class="process-sidebar_icon" :src="getIconUrl('Door.svg')">
            <span v-if="isSales"
                  class="text-content">{{ currentData.unitData.pjData.code }}{{ currentData.salesData.id }}{{ currentData.id }}</span>
            <span v-if="isAgent || isManager"
                  class="text-content">{{ currentData.unitData.unitCode }}</span>
         </div>
      </div>
      <div class="row p-2">
         <div class="d-flex justify-content-start ">
            <img alt="" class="process-sidebar_icon" :src="getIconUrl('bed-detail.svg')">
            <a class="text-content font-weight-400">{{ currentData.unitData.bedroom }} Phòng ngủ</a>
         </div>
      </div>
      <div class="row p-2">
         <div class="d-flex justify-content-start ">
            <img alt="" class="process-sidebar_icon" :src="getIconUrl('bath-solid-info.svg')">
            <a class="text-content font-weight-400">{{ currentData.unitData.bathroom }} Phòng tắm</a>
         </div>
      </div>
      <div class="row p-2">
         <div class="d-flex justify-content-start ">
            <img alt="" class="process-sidebar_icon" :src="getIconUrl('size-solid.svg')">
            <a class="text-content font-weight-400">{{ currentData.unitData.size }} m2 </a>
         </div>
      </div>
      <div class="row p-2">
         <div class="d-flex justify-content-start ">
            <img alt="" class="process-sidebar_icon" :src="getIconUrl('direction-solid.svg')">
            <a class="text-content font-weight-400">{{ transPointing(currentData.unitData.balcony) }}</a>
         </div>
      </div>
      <div class="row p-2">
         <div class="d-flex justify-content-start ">
            <img alt="" class="process-sidebar_icon" :src="getIconUrl('furniture-detail.svg')">
            <a class="text-content font-weight-400">{{ transFurniture(currentData.unitData.furniture) }}</a>
         </div>
      </div>
      <div v-show="currentData.unitData.managementCoverage" class="row p-2 ">
         <div class="d-flex justify-content-start ">
            <img alt="" class="process-sidebar_icon" :src="getIconUrl('feeCover-detail.svg')">
            <a class="text-content font-weight-400">Bao phí quản lý</a>
         </div>
      </div>
<!--      <div class="border-top border-2 p-2 mt-4" v-if="isSales">-->
<!--         <b class="mt-2 ">Lịch sử cập nhật</b>-->
<!--         <p class="mt-5"><b>{{ fixDateTime(currentData.aLastUpdate) }}</b></p>-->
<!--         <p class="mt-2" v-if="defaultData.agentNote !== defaultData.partnerUpdate.lastANote">-->
<!--            {{ getAgentName(currentData.agentData) }} đã thay đổi ghi chú</p>-->
<!--         <p class="mt-2" v-if="defaultData.status !== defaultData.partnerUpdate.lastStatus">-->
<!--            {{ getAgentName(currentData.agentData) }} đã cập nhật giai đoạn</p>-->
<!--         <p class="mt-2" v-if="!equalFreeTime(defaultData.aFreeTime, defaultData.partnerUpdate.lastAFreeTime)">-->
<!--            {{ getAgentName(currentData.agentData) }} đã đề xuất lịch hẹn </p>-->
<!--      </div>-->
<!--      <div class="border-top border-2 p-2 mt-4" v-if="isAgent">-->
<!--         <b class="mt-4 ">Lịch sử cập nhật</b>-->
<!--         <p class="mt-5"><b>{{ fixDateTime(currentData.aLastUpdate) }}</b></p>-->
<!--         <p class="mt-2" v-if="defaultData.salesNote !== defaultData.partnerUpdate.lastSNote">-->
<!--            {{ currentData.salesData.first_name }} đã thay đổi ghi chú</p>-->
<!--         <p class="mt-2" v-if="defaultData.status !== defaultData.partnerUpdate.lastStatus">-->
<!--            {{ currentData.salesData.first_name }} đã cập nhật giai đoạn</p>-->
<!--         <p class="mt-2" v-if="!equalFreeTime(defaultData.sFreeTime, defaultData.partnerUpdate.lastSFreeTime)">-->
<!--            {{ currentData.salesData.first_name }} đã đề xuất lịch hẹn </p>-->
<!--      </div>-->
   </div>
</template>

<script>
import {getIconUrl, translate} from "@/utils/utils";
import {getCompareValue} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {fixDateTime} from "@/utils/dateTimeUtils";

import SwipeBox from "@/components/FpImg/SwipeBox.vue";
import {Roles} from "@/utils/constants";

export default {
   components: {
      SwipeBox,
   },
   data() {
      return {
         // Trans dict
         FURNITURE: "",
         POINTING: "",
      }
   },
   props: {
      role: {
         type: String,
         required: true,
      },
      currentData: {
         type: Object,
         required: true,
      },
      defaultData: {
         type: Object,
         required: true,
      },
   },
   computed: {
      isAgent() {
         return this.role === Roles.Agent;
      },
      isSales() {
         return this.role === Roles.Sales;
      },
      isManager() {
         return this.role === Roles.Manager;
      },
      getImgData() {
         return this.currentData.unitData;
      },
   },
   methods: {
      fixDateTime,
      getIconUrl,
      getAgentName(agentData) {
         return agentData ? agentData.first_name : "";
      },
      equalFreeTime(ft1, ft2) {
         if (ft1.length !== ft2.length) {
            return false;
         }

         let eq = true;
         for (let i = 0; i < ft1.length; i++) {
            eq = eq && ft1[0] == ft2[0] && ft1[1] == ft2[1];
         }
         return eq;
      },
      transFurniture(fur) {
         return translate(this.FURNITURE, fur);
      },
      transPointing(balcony) {
         return translate(this.POINTING, balcony);
      },
      async getDataLib() {
         const res = await getCompareValue([
            DataLibType.FURNITURE, DataLibType.POINTING]
         );
         this.FURNITURE = res.FURNITURE;
         this.POINTING = res.POINTING;
      },
   },
   watch: {},
   mounted() {
      this.getDataLib();
   }
}
</script>

<style scoped>
</style>
