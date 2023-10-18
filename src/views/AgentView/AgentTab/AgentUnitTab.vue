<template>
   <div @click="$emit('unit-clicked', this)" class="cart row mb-2 mt-2  ">
      <div class="col-1 col-xl-1 col-xxl-1 col-lg-1 col-md-1 px-0 ">
         <div class="col-3 sticket h-100" v-bind:style="{'background-color':unitData.pjData.projectColor}"></div>
      </div>
      <div class="col-xl-11 col-lg-11 col-md-11 px-0 col-11">
         <div class="row">
            <div class="col-xl-2 col-xxl-2 col-lg-2 col-md-6 col-6 px-0 ">
               <div class="row ">
                  <div class="col-xl-3 col-xxl-3 col-lg-3 col-md-2 h-100 col-1">
                     <span v-show="level===2" class="dotLv2" style=" border: #999999 solid 1.8px;"></span>
                     <span v-show="level===3" class="dotLv2"></span>
                     <span v-show="level===4" class="dot" style=" background-color: #48bd48;"></span>
                  </div>
                  <div class="col-xl-9 col-xxl-9 col-lg-9 col-md-9 h-100 px-0 col-8 order-1 order-md-1 order-lg-1">
                     <h6 class="mt-4 houseCode">{{ fixedHouseCode }}</h6>
                  </div>
               </div>
            </div>
            <div class="col-xl-5 col-xxl-5 col-lg-5 col-md-12 col-12 order-md-3 order-3 order-lg-2 ">
               <div class="row justify-content-md-between" v-if="page!=='ExpContractUnits'">
                  <div class="col-xl-6 col-xxl-6 col-lg-6 col-md-5 col-6">
                     <div class="row " v-if="unitData.rentingPrice > 0.0 && unitData.renting">
                        <div class="col-5">
                           <h6 class="mt-lg-4 textRentColor ">{{ fixedRentingPrice }}</h6>
                        </div>
                        <div class="col-3" v-if="page==='Agent'">
                           <span v-if="unitData.totalRUI > 0.0"
                                 class="dotRentNumber text-center mt-lg-4">{{ unitData.totalRUI }}</span>
                        </div>
                        <div class="col-3">
                           <p class="mt-lg-4  text-success">
                              <img class="iconInCart " :src="getIconUrl('rentCheck.svg')" alt=""/>
                           </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-xl-6 col-xxl-6 col-lg-6 col-md-5 col-6">
                     <div class="row" v-if="unitData.sellingPrice > 0.0 && unitData.selling">
                        <div class="col-5">
                           <h6 class="mt-lg-4 textSellColor ">{{ fixedSellingPrice }}</h6>
                        </div>
                        <div class="col-3" v-if="page==='Agent'">
                           <span v-if="unitData.totalBUI > 0.0"
                                 class="dotSellNumber text-center mt-lg-4"><b>{{ unitData.totalBUI }}</b></span>
                        </div>
                        <div class="col-3">
                           <p class="mt-lg-4  text-success">
                              <img class="iconInCart " :src="getIconUrl('sellCheck.svg')" alt=""/>
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               <div v-else class="mt-xl-4 mt-md-4 w-100 "><span
                     class="text-gray">Hết hạn HĐ: </span>{{ ddMm(unitData.contractExpiry) }}
               </div>
            </div>
            <div class="col-xl-3 col-xxl-3 col-lg-3 col-md-12 col-12 order-md-4 order-lg-3 order-4">
               <div class="row">
                  <div class="col-3 text-gray" v-if="parseInt(unitData.bedroom)>0 && unitData.bedroom">
                     <h6 class="mt-lg-4 mt-2 d-flex">
                        {{ unitData.bedroom }}
                        <img class="iconInCart " :src="getIconUrl('bed-solid.svg')" alt=""/>
                     </h6>
                  </div>
                  <div class="col-3 text-gray" v-else></div>
                  <div class="col-3 text-gray" v-if="unitData.size>0.0">
                     <h6 v-show=" unitData.bathroom>0" class="mt-lg-4 mt-2 m-auto btn-wrap-text">
                        {{ unitData.bathroom }}
                        <img class="iconInCart " :src="getIconUrl('bath-solid.svg')" alt=""/>
                     </h6>
                  </div>
                  <div class="col-3 m-auto text-gray">
                     <h6 v-if="unitData.size>0.0 && unitData.size" class="mt-lg-4 mt-2">{{ unitData.size }}m²</h6>
                  </div>
                  <div class="col-3 text-gray">
                     <img v-show="transFurniture==='Đầy đủ'" class="mt-lg-4 mt-2 iconInCart "
                          :src="getIconUrl('furniture.svg')"
                          alt=""
                     />
                  </div>
               </div>
            </div>
            <div class="col-xl-2 col-xxl-2 col-lg-2  col-md-6 mb-3 col-6 order-md-2 order-lg-4 order-2 ">
               <button class="col-10 bg-white mt-4 rounded-pill border btn-wrap-text ">
                  <span class="small">{{ transStatus }}</span>
               </button>
            </div>
         </div>
      </div>
   </div>
</template>


<script>
import {ddMm} from "@/utils/dateTimeUtils";
import {floatFixed, getIconUrl, translate} from "@/utils/utils";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";

export default {
   data() {
      return {
         sellingPrice: false,
         rentingPrice: false,
         unitData: this.unit,
         houseCode: "",
         fresh: false,
         lcr: "",
         level: 1,
         ddMm,
         getIconUrl
      };
   },
   computed: {
      fixedHouseCode: function () {
         const checkBlock = this.unitData.block ? this.unitData.block + "-" : "";
         return checkBlock + this.unitData.floor + "." + this.unitData.unit;
      },
      fixedSellingPrice() {
         // this.sellingPrice = this.unitData.sellingPrice;
         // return floatFixed(this.sellingPrice,3);
        return convertVndToUserCurrency(this.unitData.sellingPrice,false,UnitCurrency.simple)
      },
      fixedRentingPrice() {
         // this.rentingPrice = this.unitData.rentingPrice;
         // return floatFixed(this.rentingPrice);
        return convertVndToUserCurrency(this.unitData.rentingPrice,true,UnitCurrency.simple)

      },
      avgSellingPrice() {
         let avgSPrice =
            this.unitData.size > 0.0
               ? (this.unitData.sellingPrice / this.unitData.size) * 1000
               : 0.0;
         return floatFixed(avgSPrice);
      },
      transDirection() {
         return translate(this.POINTING, this.unitData.balcony);
      },
      transFurniture() {
         return translate(this.FURNITURE, this.unitData.furniture);
      },
      transStatus() {
         return translate(this.UNIT_STATUS, this.unitData.status);
      },
      transView1() {
         return this.transView(this.unitData.view);
      },
      transView2() {
         return this.transView(this.unitData.view2);
      },
   },
   methods: {
      checkFresh() {
         this.lcr = this.unitData.lcr;
         this.level = 1;
         const today = new Date();
         const freshDate = new Date(this.unitData.lastRefresh);
         const countDate = Math.round(today - freshDate) / 86400000;
         if (this.unitData.renting) {
            countDate < 5 ? (this.fresh = true) : (this.fresh = false);
         } else {
            countDate < 21 ? (this.fresh = true) : (this.fresh = false);
         }
         if (this.lcr === "Agent" || this.lcr === "A.Assistant") {
            if (this.lcr === "Agent") {
               this.fresh ? (this.level = 4) : (this.level = 2);
            } else {
               this.fresh ? (this.level = 3) : (this.level = 2);
            }
         }
      },
      transView(view) {
         return translate(this.VIEW, view);
      },
   },
   props: {
      unit: {
         type: Object,
         default: () => ({}),
      },
      POINTING: {
         type: Array,
      },
      FURNITURE: {
         type: Array,
      },
      UNIT_STATUS: {
         type: Array,
      },
      VIEW: {
         type: Array,
      },
      page: {
         type: String,
         default: '',
      }
   },
   watch: {
      unit(val) {
         this.unitData = val;
         this.checkFresh();
      },
      unitData() {
         this.checkFresh();
      },
   },
   emits: ["unit-clicked"],
   mounted() {
      this.checkFresh();
   },
}
</script>
