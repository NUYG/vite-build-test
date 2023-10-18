<template>
   <div id="contentcollab" class="overflow-scroll container-fluid">
      <div class="row mt-2 justify-content-between  container-fluid">
         <div class="col-7 ">
            <h6 v-bind:style="{'color':projectColor}">{{ project }}</h6>
            <h5 class="mt-auto ">{{ code }}</h5>
         </div>
         <div class="col-5 padding-right-init">
            <div class="w-100  border-left " v-bind:style="{'background-color':projectColor}">
            </div>
            <div class="row mt-2 justify-content-center">
               <div class="col-4">
                  <span class="dotRentNumber text-center"><b>{{ editingUnit.totalRUI }}</b></span>
               </div>
               <div class="col-4">
                  <span class="dotSellNumber text-center"><b>{{ editingUnit.totalBUI }}</b></span>
               </div>
            </div>
         </div>
      </div>
      <div class="row mt-2 underline-change ">
         <div class="col-4">
            <h6 v-if="bedroom > 0.0 && bedroom!==''" class="text-gray">
               {{ bedroom }}
               <img class="iconInCart " :src="getIconUrl('bed-solid.svg')" alt=""/>
            </h6>
         </div>
         <div class="col-4 text-gray">
            <h6 v-if="bathroom > 0.0 && bathroom" class="m-auto btn-wrap-text">
               {{ bathroom }}
               <img class="iconInCart " :src="getIconUrl('bath-solid.svg')" alt=""/>
            </h6>
         </div>
         <div class="col-4 text-gray">
            <h6 v-if="size>0.0" class="">{{ size }} m²</h6>
         </div>
      </div>
      <div class="row mt-4 underline-change">
         <div class="col-9">
            <h5 class="text-dark">{{ ownerName }}</h5>
            <p class="mt-2 text-gray">
               <img class="iconInCart" :src="getIconUrl('call_icon.png')" alt=""/>
               {{ ownerPhone }}
            </p>
         </div>
      </div>
      <div v-for="customer in pairedInquiries">
         <div :class="(customer.rent === true ) ? 'row mt-4  ms-1 left-line-green' : ' row mt-4  left-line-red ms-1'">
            <div clas="col-12">
               <div class="row mt-2 ">
                  <div class="col-8">
                     <b>{{ customer.inquiryData.contactor_name }}</b>
                  </div>
                  <div class="col-4">
                     <h5 v-if="customer.inquiryData.ceilingPrice>0 && customer.rent">
                        {{ customer.inquiryData.ceilingPrice }}Tr</h5>
                     <h5 v-if="customer.inquiryData.ceilingPrice>0 && !customer.rent">
                        {{ customer.inquiryData.ceilingPrice }}Tỷ</h5>
                  </div>
               </div>
               <div class="row ">
                  <div class="col-8">
                     <span class="small">{{ transStatus(customer.status) }} </span>
                  </div>
                  <div class="col-4">
                     <span class="small ">{{ customer.inquiryData.salesData.first_name }}</span>
                  </div>
               </div>
               <div class="row mt-2">
                  <div class="col-10">
                     <span class="small">Ngày ở: {{ customer.inquiryData.moveInDay || 'Chưa có dữ liệu' }}</span>
                  </div>
               </div>
               <div class="row mt-2">
                  <div class="col-10">
                     <span class="small">Ngày xem nhà: {{ checkingDate || 'Chưa có dữ liệu' }}</span>
                  </div>
               </div>
               <div class="row mt-2">
                  <div class="col-12">
                     <textarea disabled name="note" cols="40" rows="10" class="form-control small-text-box">{{customer.note}}</textarea>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {getCompareValue, post} from '@/utils/dataQuery'
import {DataLibType} from "@/utils/dataLib";
import {floatFixed, getIconUrl} from "@/utils/utils";

export default {
   data() {
      return {
         getIconUrl,
         focusId: "",
         units: {},
         projectColor: "",
         ownerName: "",
         ownerPhone: 0,
         code: "",
         zalo: "",
         project: "",
         block: "",
         floor: "",
         unit: "",
         rentingPrice: 0,
         sellingPrice: 0,
         bedroom: "",
         bathroom: 0,
         balcony: "",
         size: [],
         furniture: "",
         note: "",
         unitStatus: "",
         pairedInquiriesId: false,
         pairedInquiries: [],
         toastMessages: false,
         comparePointing: {},
         compareFurniture: {},
         compareStatus: {},
         compareInquiry: {},
         SALE_PROCESS_STATUS: "",
      };
   },
   methods: {
      async getDataLib() {
         const res = await getCompareValue([
            DataLibType.SALE_PROCESS_STATUS]
         );
         this.SALE_PROCESS_STATUS = res.SALE_PROCESS_STATUS;
      },
      transStatus(status) {
         for (let i = 0; i < this.SALE_PROCESS_STATUS.length; i++) {
            if (this.SALE_PROCESS_STATUS[i][0] === status) {
               return this.SALE_PROCESS_STATUS[i][1];
            }
         }
      },
      getValueFromProps() {
         const checkblock =
            this.editingUnit.block === "" ? "" : this.editingUnit.block + "-";
         this.focusId = this.editingUnit.id;
         this.projectColor = this.editingUnit.pjData.projectColor;
         this.ownerName = this.editingUnit.owner_data.name;
         this.ownerPhone = this.editingUnit.owner_data.phone;
         this.project = this.editingUnit.pjData.name;
         this.code =
            checkblock + this.editingUnit.floor + "." + this.editingUnit.unit;

         this.selling = this.editingUnit.selling;
         this.renting = this.editingUnit.renting;
         this.rentingPrice = parseFloat(floatFixed(this.editingUnit.rentingPrice));
         this.sellingPrice = parseFloat(floatFixed(this.editingUnit.sellingPrice));
         (this.bedroom = this.editingUnit.bedroom);
         this.bathroom = this.editingUnit.bathroom;
         this.size = this.editingUnit.size;
         this.transferringCoverage = this.editingUnit.transferringCoverage;
      },
      fixedStatus(status) {
         for (let i = 0; i < this.compareInquiry.length; i++) {
            if (this.compareInquiry[i][0] === status) {
               return this.compareInquiry[i][1];
            }
         }
         return "";
      },
      async updateUnit() {
         this.errorType = "danger";
         const res = await post("/agent/update_unit_data", {
            unit_id: this.focusId,
            renting: this.renting,
            selling: this.selling,
            rentingPrice: this.rentingPrice,
            sellingPrice: this.sellingPrice,
            furniture: this.furniture,
            minRentingTime: this.minRentingTime,
            rentingDeposit: this.rentingDeposit,
            sellingDeposit: this.sellingDeposit,
            managementCoverage: this.managementCoverage,
            rentingUrgency: this.rentingUrgency,
            sellingUrgency: this.sellingUrgency,
            feeCoverage: this.feeCoverage,
            transferringCoverage: this.transferringCoverage,
            note: this.note,
            rentingFee: this.rentingFee,
            sellingFee: this.sellingFee,
            rentingFeeSale: this.rentingFeeSale,
            sellingFeeSale: this.sellingFeeSale,
            contractExpiry: this.contractExpiry,
            status: this.unitStatus,
         })
         let succeed = res.succeed;
         this.callToast();
         this.showErrorBox = true;
      },
      async getInquiriesData() {
         // console.log(this.editingUnit);
         const res = await post("/agent/get_sale_processes_data", {
            ids: this.editingUnit.sale_processes,
         })
         this.pairedInquiries = res["saleProcesses"];
      },
   },
   props: {
      editingUnit: {
         type: Object,
      },
      rentInqCount: {
         type: Number,
      },
      buyInqCount: {
         type: Number,
      },
      POINTING: {
         type: String,
      },
      FURNITURE: {
         type: String,
      },
      UNIT_STATUS: {
         type: String,
      },
      INQUIRY_STATUS: {
         type: String,
      },
   },
   watch: {
      editingUnit(val, oldVal) {
         this.getInquiriesData();
         this.getValueFromProps();
         this.comparePointing = this.POINTING;
         this.compareFurniture = this.FURNITURE;
         this.compareStatus = this.UNIT_STATUS;
         this.compareInquiry = this.INQUIRY_STATUS;
      },
   },
   mounted() {
      this.getDataLib();
   },
}
</script>