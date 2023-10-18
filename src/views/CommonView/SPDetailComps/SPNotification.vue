<template>
   <div class="p-3 border rounded border-secondary border-3 d-flex justify-content-between">
      <div class="col-8">
         <b v-if="code==='confirmDate'">Xác nhận lịch hẹn</b>
         <b v-if="code==='confirmStatus'">Xác nhận {{transProcessStatus(currentStatus).toLowerCase()}} </b>
         <b v-if="code==='skipStatus'">Thông báo lược giai đoạn</b>
         <b v-if="code==='verifySug'">Xác nhận bỏ qua giai đoạn </b>
         <b v-if="code==='waitSugVerify'"> Đang chờ hệ thống xác nhận </b>
         <div class="row mt-2" v-if="code==='confirmDate'">
            <i  class="text-gray text-content">Có một lịch hẹn với {{oppositeOwner}} vào lúc:
               {{getHours}}:{{getMinutes}}
               ngày {{getDate}}/{{getMonth}}/{{getFullYear}}
            </i>
         </div>
         <div class="row mt-2" v-if="code==='confirmStatus'">
            <!--                <p class="text-gray text-content">Bạn đã thay đổi tình trạng từ <i>{{transProcessStatus(currentStatus)}} </i> đến <i> {{transProcessStatus(toStatus)}}</i>-->
            <!--                 </p>-->
         </div>
         <div class="row mt-2" v-if="code==='skipStatus'">
            <p class="text-gray text-content">Bạn đã thay đổi tình trạng từ <i>{{transProcessStatus(currentStatus)}}</i> đến <i>{{transProcessStatus(toStatus)}}</i>
            </p>
            <p  class="text-gray text-content" v-if="toStatus>=2 && !showScout && !scoutingDate"><i>
               Ngày xem nhà: {{fixedDate(getOldDates(scoutingDate))}} </i>
               <img alt="" @click="pickScout" class="p-2" :src="getIconUrl('PencilSimple.svg')" />
            </p>
            <div class="d-flex col-12 justify-content-around" v-if="showScout">
               <i class="text-content text-gray">Ngày xem nhà: </i>
               <input v-model="scoutDate" class="form-control h-75 w-50" type="date">
               <img alt="" @click="pickScout" class="p-2" :src="getIconUrl('undo-alt-solid.svg')" style="width: 30px;height:30px "/>
            </div>
            <p  class="text-gray text-content" v-if="toStatus>=4 && !showDeposit && !depDate"><i>
               Ngày cọc: {{fixedDate(getOldDates(depDate))}} </i>
               <img alt="" @click="pickDeposit" class="p-2" :src="getIconUrl('PencilSimple.svg')"/>
            </p>
            <div class="d-flex col-12 justify-content-around" v-if="showDeposit">
               <i class="text-content text-gray">Ngày cọc: </i>
               <input v-model="depositDate" class="form-control h-75 w-50" type="date">
               <img alt="" @click="pickDeposit" class="p-2" :src="getIconUrl('undo-alt-solid.svg')" style="width: 30px;height:30px "/>
            </div>
            <p class="text-gray text-content" v-if="toStatus>=6 && !showNotarizing && !notDate && !rent"><i>
               Ngày hẹn công chứng: {{fixedDate(getOldDates(notDate))}} </i>
               <img alt="" @click="pickNotarizing" class="p-2" :src="getIconUrl('PencilSimple.svg')"/>
            </p>
            <div class="d-flex col-12 justify-content-around" v-if="showNotarizing">
               <i class="text-content text-gray">Ngày hẹn công chứng: </i>
               <input v-model="notarizingDate" class="form-control h-75 w-50" type="date">
               <img alt="" @click="pickNotarizing" class="p-2" :src="getIconUrl('undo-alt-solid.svg')" style="width: 30px;height:30px "/>
            </div>
            <p class="text-gray text-content" v-if="toStatus>=8 && !showTrans && !sigDate"><i>
               Ngày hẹn giao dịch: {{fixedDate(getOldDates(sigDate))}} </i>
               <img alt="" @click="pickTransaction" class="p-2" :src="getIconUrl('PencilSimple.svg')"/>
            </p>
            <div class="d-flex col-12 justify-content-around" v-if="showTrans">
               <i class="text-content text-gray">Ngày hẹn giao dịch: </i>
               <input v-model="transDate" class="form-control h-75 w-50" type="date">
               <img alt="" @click="pickTransaction" class="p-2" :src="getIconUrl('undo-alt-solid.svg')" style="width: 30px;height:30px "/>
            </div>
         </div>

         <div class="row mt-2" v-if="code==='verifySug'">
            <p class="text-gray text-content">{{ partner }} đã thay đổi tình trạng từ <i>{{transProcessStatus(currentStatus)}}</i> đến <i>{{transProcessStatus(toStatus)}}</i>
            </p>
            <p  class="text-gray text-content" v-if="toStatus>1 && !showScout"><i>
               Ngày xem nhà: {{addZeroToDateTime(new Date(scoutingDate).getDate())}}/{{addZeroToDateTime(new Date(scoutingDate).getMonth()+1)}}/{{new Date(scoutingDate).getFullYear()}}
               {{addZeroToDateTime(new Date(scoutingDate).getHours())}}:{{addZeroToDateTime(new Date(scoutingDate).getMinutes())}}
            </i>
            </p>
            <p  class="text-gray text-content" v-if="toStatus>=4 && !showDeposit"><i>
               Ngày cọc: {{addZeroToDateTime(new Date(sugDepDate).getDate())}}/{{addZeroToDateTime(new Date(sugDepDate).getMonth()+1)}}/{{new Date(sugDepDate).getFullYear()}}
               {{addZeroToDateTime(new Date(sugDepDate).getHours())}}:{{addZeroToDateTime(new Date(sugDepDate).getMinutes())}} </i>
            </p>
            <p class="text-gray text-content" v-if="toStatus>=6 && !showNotarizing"><i>
               Ngày hẹn công chứng: {{addZeroToDateTime(new Date(sugNotDate).getDate())}}/{{addZeroToDateTime(new Date(sugNotDate).getMonth()+1)}}/{{new Date(sugNotDate).getFullYear()}}
               {{addZeroToDateTime(new Date(sugNotDate).getHours())}}:{{addZeroToDateTime(new Date(sugNotDate).getMinutes())}} </i>
            </p>

            <p class="text-gray text-content" v-if="toStatus>=8 && !showTrans"><i>
               Ngày hẹn giao dịch: {{addZeroToDateTime(new Date(sugSigDate).getDate())}}/{{addZeroToDateTime(new Date(sugSigDate).getMonth()+1)}}/{{new Date(sugSigDate).getFullYear()}}
               {{addZeroToDateTime(new Date(sugSigDate).getHours())}}:{{addZeroToDateTime(new Date(sugSigDate).getMinutes())}} </i>
            </p>
         </div>
         <p v-if="code==='confirmDate'" class="text-content mt-2">Bạn có xác nhận {{owner}} có thể hẹn vào khung giờ này không ?</p>
         <p v-if="code==='confirmStatus'" class=" mt-2">Bạn có xác nhận đã {{rmHen(transProcessStatus(currentStatus).toLowerCase())}} thành công không  ?</p>
         <p v-if="code==='skipStatus'" class="text-content mt-2">Bạn có xác nhận thông tin này là chính xác không ?</p>
         <p v-if="code==='skipStatus'" class="text-content mt-2">** Lưu ý: không thể phục hồi về trạng thái ban đầu khi đã xác nhận</p>

         <p v-if="code==='verifySug'" class="text-content mt-2">Bạn có xác nhận thông tin này là chính xác không ?</p>
         <p v-if="code==='verifySug'" class="text-content mt-2">** Lưu ý: không thể phục hồi về trạng thái ban đầu khi đã xác nhận</p>
      </div>
      <div v-show="code !== 'waitSugVerify'">
         <div class="col-2 d-flex align-items-end flex-column ">
            <img @click="confirmPopup(true)" :src="getIconUrl('confirm-check-solid.svg')"  alt="" style="width: 40px ;height: 40px;">
            <img @click="confirmPopup(false)" :src="getIconUrl('CheckCircle.svg')" class=" mt-2" alt="" style="width: 40px ;height: 40px;">
         </div>
      </div>
   </div>
</template>

<script>
import {getIconUrl, translate} from "@/utils/utils";
import {addZeroToDateTime} from "@/utils/dateTimeUtils";
import {getCompareValue} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";

const ProgressLevel = {
   0: "waiting",
   1: "depositing",
   3: "notarizing",
   5: "signing",
   7: "done",
};

export default {
   components: {},
   data() {
      return {
         toDate: new Date(),
         transDate: "",
         scoutDate: "",
         depositDate: "",
         notarizingDate: "",
         showTrans: false,
         showDeposit: false,
         showNotarizing: false,
         showScout: false,
         // trans dict
         SALE_PROCESS_STATUS: "",
      };
   },
   props: {
      // code=confirmDate - Xac nhan lich hen
      // code=confirmStatus - Xac nhan tien hoa
      // code=skipStatus - Xac nhan skip
      //
      code: {
         type: String,
         default: "skipStatus",
      },
      currentStatus: {
         type: Number,
         default: 0,
      },
      toStatus: {
         type: Number,
         default: 8,
      },
      dateTime: {
         type: [String, Object],
         default: "Wed Feb 15 2023 05:00:00 GMT+0700 (Giờ Đông Dương)",
      },
      agent: {
         type: Boolean,
         default: true,
      },
      scoutingDate: {
         type: Object,
         default: null,
      },
      depDate:{
         type: Object,
         default: null,
      },
      notDate:{
         type: Object,
         default: null,
      },
      sigDate:{
         type: Object,
         default: null,
      },
      sugDepDate: {
         type: Object,
         default: null,
      },
      sugNotDate: {
         type: Object,
         default: null,
      },
      sugSigDate: {
         type: Object,
         default: null,
      },
      rent:{
         type: Boolean,
         default: false,
      }
   },
   computed: {
      getHours() {
         return addZeroToDateTime(new Date(this.dateTime).getHours());
      },
      getMinutes() {
         return addZeroToDateTime(new Date(this.dateTime).getMinutes());
      },
      getDate() {
         return addZeroToDateTime(new Date(this.dateTime).getDate());
      },
      getMonth() {
         return addZeroToDateTime(new Date(this.dateTime).getMonth() + 1);
      },
      getFullYear() {
         return new Date(this.dateTime).getFullYear();
      },
      partner() {
         return this.agent ? "Sales" : "Agent";
      },
      owner() {
         return this.agent ? "chủ" : "khách";
      },
      oppositeOwner() {
         return this.agent ? "khách" : "chủ";
      },
   },
   methods: {
      addZeroToDateTime,
      getIconUrl,
      getOldDates(od){
         return od ? new Date(od) : new Date();
      },
      fixedDate(d){
         return `${addZeroToDateTime(d.getDate())}/${addZeroToDateTime(
           d.getMonth() + 1
         )}/${addZeroToDateTime(d.getFullYear())}`;
      },
      async getDataLib() {
         const res = await getCompareValue([
            DataLibType.SALE_PROCESS_STATUS]
         );
         this.SALE_PROCESS_STATUS = res.SALE_PROCESS_STATUS;
      },
      transProcessStatus(status) {
         if (this.rent && status === 4){
            status += 2;
         }
         const getStatus = ProgressLevel[Math.max(0, status - 1)];
         return translate(this.SALE_PROCESS_STATUS, getStatus)
      },
      rmHen(str){
         return str.replace('hẹn ', '');
      },
      confirmPopup(check) {
         const dateConfirm = {};
         dateConfirm.signingDate =
           this.transDate != "" && this.showTrans
             ? new Date(this.transDate)
             : this.getOldDates(this.sigDate);
         dateConfirm.depositDate =
           this.depositDate != "" && this.showDeposit
             ? new Date(this.depositDate)
             : this.getOldDates(this.depDate);
         dateConfirm.notarizeDate =
           this.notarizingDate != "" && this.showNotarizing
             ? new Date(this.notarizingDate)
             : this.getOldDates(this.notDate);
         dateConfirm.scoutingDate =
           this.scoutDate != "" && this.showScout
             ? new Date(this.scoutDate)
             : this.getOldDates(this.scoutingDate);

         this.$emit("confirm-popup", check, this.code, dateConfirm);
      },
      pickScout() {
         this.showScout = !this.showScout;
      },
      pickTransaction() {
         this.showTrans = !this.showTrans;
      },
      pickDeposit() {
         this.showDeposit = !this.showDeposit;
      },
      pickNotarizing() {
         this.showNotarizing = !this.showNotarizing;
      },
   },
   watch: {},
   emits: ["confirm-popup"],
   mounted() {
      this.getDataLib();
   }
}
</script>

<style scoped>
</style>
