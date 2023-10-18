<template>
  <div  class="vh-100 overflow-scroll">
   <div v-for="(unit, index) in compaUnits" :key="index" class="row p-xl-4">
      <div class="card-gray-teal mt-3 p-lg-3">
         <div class="row p-2 d-flex">
            <span class="border-rounded mt-2" :style="{'background-color': unit.pjData.projectColor}"
                  style="height: 8px; width: 28px; border-radius: 20px; margin-left: 3px;"></span>
            <span class="col-auto"> {{ unit.pjData.name }} </span>
            <div class="col">
               <img @click="copyUnitContent(rent, unit)" :src="getIconUrl('CopySimple.svg')" alt=''
                    style='width:20px;height:20px;'>
            </div>
         </div>

         <div v-if="unit.imgs && unit.imgs.length" class="mt-1 d-flex justify-content-center">
            <div @click='unitImgClk(unit.imgs)' class="col-12" style='height: 150px'>
               <SwipeBox
                     :downloadBtn='true'
                     :shareBtn='true'
                     :img='unit.imgs.map((item) => item.wm_url)'
                     :shareTxt="getShareContent(rent, unit)"
               />

            </div>
         </div>

         <div class="row p-2 d-flex justify-content-between mt-2">
            <h4 class="col-7"><b>{{ floatFixed(rent ? unit.rentingPrice : unit.sellingPrice, 2) }}{{
                rent ? 'Tr' : ' Tỷ'
               }}</b></h4>
            <div class="col-5 d-flex justify-content-center">
               <b class="px-2">{{ unit.bedroom }} </b><img alt="bedIcon" :src="getIconUrl('bed-detail.svg')"
                                                           style="width: 20px;height: 20px;margin-top: 2px">
            </div>
         </div>
         <div class="row p-2 d-flex justify-content-between">
            <div class="col-4 d-flex justify-content-start">
               <img alt="bathIcon" :src="getIconUrl('bath-solid-info.svg')" style="width: 20px;height: 20px;margin-top: 2px">
               {{ unit.bathroom }}
            </div>
            <div class="col-7 d-flex justify-content-start">
               <img alt="directionIcon" :src="getIconUrl('direction-solid.svg')" style="width: 20px;height: 20px;margin-top: 2px"><span
                  class="px-2 small"> {{ transDirection(unit.balcony) }}</span>
            </div>
         </div>
         <div class="row p-2 d-flex justify-content-between">
            <div class="col-4 d-flex justify-content-start">
               <img alt="sizeIcon" :src="getIconUrl('size-inquiry.svg')" style="width: 12px;height: 12px;margin-top: 2px"><span
                  class="px-2 text-sm-11 small"> {{ unit.size }}m2</span>
            </div>
            <div class="col-7 d-flex justify-content-start">
               <img alt="furnitureIcon" :src="getIconUrl('furniture-detail.svg')"><span
                  class="px-2 small"> {{ transFurniture(unit.furniture) }} </span>
            </div>
         </div>
         <div class="row justify-content-between p-lg-3 p-2">
            <div class="col-md-12 col-6">
               <VerifyModal
                     @func-btn-clicked="pairUnit"
                     :id="'pairVerify'+ unit.id"
                     triggerBtnText="Ghép căn này"
                     title="XÁC NHẬN GHÉP CĂN"
                     :content="pairUnitContent(unit)"
                     funcBtnText="Xác nhận"
                     :parameters="{unit: unit}"
               />
            </div>
            <div @click="goToURL(unitHref(unit.id))"
                 class="col-md-12 col-6 d-md-flex justify-content-center mt-md-3 mt-2">
               <span class="text-content">Chi tiết căn</span>
            </div>
         </div>
      </div>
   </div>

   <div class="card-gray-teal p-3 mt-4">
      <p class="text-gray text-center">Không tìm thấy căn phù hợp? </p>
      <div class="row d-flex justify-content-center">
         <VerifyModal
               @func-btn-clicked="createRequest"
               id="crtResVerifyRB"
               triggerBtnText="Yêu cầu tìm căn"
               title="XÁC NHẬN GỬI YÊU CẦU"
               :content="crtRequestContent"
               funcBtnText="Xác nhận"
         />
      </div>
   </div>
   <TextNotification
         v-if='copy_notification'
         message='Đã sao chép!'
         @close='removeNotifications'
   />
</div>
</template>

<script>
import VerifyModal from "@/components/Misc/VerifyModal.vue";
import SwipeBox from "@/components/FpImg/SwipeBox.vue";
import TextNotification from "@/components/Misc/TextNotification.vue";

import {floatFixed, getIconUrl, translate, copyTextToClipboard} from "@/utils/utils";
import {goToURL} from "@/utils/utils";
import {unitPriceText, shareContent} from "@/utils/unit";
import {IMG_URL} from "@/utils/constants";
import {S_UNIT_DETAIL_URL, S_UNITS_URL} from "@/router/URLs";


export default {
   components: {
      VerifyModal,
      SwipeBox,
      TextNotification,
   },
   data() {
      return {
         IMG_URL,
         showCarousel: false,
         ssImgs: [],
         copy_notification: false,
      }
   },
   computed: {
      crtRequestContent() {
         return `Bạn có xác nhận muốn gửi yêu cầu không?`;
      },
   },
   methods: {
      getIconUrl,
      goToURL,
      floatFixed,
      unitPriceText,
      removeNotifications() {
         this.copy_notification = false
      },
      getShareContent(rent, unit) {
         return shareContent(
            rent, unit, this.FURNITURE, this.VIEW, this.POINTING
         )
      },
      copyUnitContent(rent, unit) {
         copyTextToClipboard(this.getShareContent(rent, unit));
         this.copy_notification = true
      },
      unitImgClk(unitImgs) {
         this.showCarousel = true;
         this.ssImgs = unitImgs;
      },
      pairUnitContent(unit) {
         return `Bạn vừa ghép Căn ${unit.pjData.name} ${unit.bedroom} Phòng ngủ
      giá ${this.floatFixed(this.rent ? unit.rentingPrice : unit.sellingPrice)}
      ${
            this.rent ? "Triệu" : "Tỷ"
         } với yêu cầu hiện tại, bạn có xác nhận tiếp tục ghép căn này không?`;
      },
      unitHref(id) {
         return S_UNIT_DETAIL_URL + "?unit=" + id;
      },
      transFurniture(status) {
         return translate(this.FURNITURE, status);
      },
      transDirection(status) {
         return translate(this.POINTING, status);
      },
      pairUnit(param) {
         this.$emit("pair-unit", param.unit);
      },
      createRequest() {
         this.$emit("unit-request");
      },
   },
   props: {
      compaUnits: {
         type: Array,
         default: () => ([]),
      },
      rent: {
         type: Boolean,
         default: false,
      },
      POINTING: {
         type: Array,
         default: () => ([]),
      },
      FURNITURE: {
         type: Array,
         default: () => ([]),
      },
      VIEW: {
         type: Array,
         default: () => ([]),
      },
   },
   watch: {},
   emits: ["pair-unit", "unit-request"],
   mounted() {
   }
}
</script>

<style scoped>
</style>
