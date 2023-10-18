<template>
   <div class="border border-gray rounded-3  p-3 mt-3 mt-lg-0">
      <div class="row">
         <b>Đặt lịch hẹn</b>
      </div>
      <div class="row mt-2 px-4">
         <div class="col-lg-7 col-12">
            <input :min="calendarMin" max="2099-06-08" v-model="date" id="toDay" class="form-control" type="date"/>
         </div>
      </div>
      <div class="row mt-3 ps-4">
          <SpDetailTimePicker :pickedDay="date" @add-free-time="onPickedTime" :aPickedTime="aPickedTime" :sPickedTime="sPickedTime">
          </SpDetailTimePicker>
      </div>

   </div>
</template>

<script>
import {getIconUrl} from "@/utils/utils";
import {addZeroToDateTime} from "@/utils/dateTimeUtils";
import SpDetailTimePicker from "@/components/FpDateTimePicker/SpDetailTimePicker.vue";

const today = new Date().toISOString().slice(0, 10);
const minuteStep = 15;

export default {
   components: {SpDetailTimePicker},
   data() {
      return {
         fromTime: Math.min(22, new Date().getHours() + 1),
         toTime: Math.min(23, new Date().getHours() + 2),
         date: new Date().toISOString().slice(0, 10),
         fromMinute: 0,
         toMinute: 0,
         formFromTime: false,
         formFromMin: false,
         formToTime: false,
         formToMin: false,
         errorText: "",
      };
   },
   props: {
      aPickedTime: {
         type: Array,
         default: () => ([]),
      },
      sPickedTime: {
         type: Array,
         default: () => ([]),
      },
      ownBusyTime: {
         type: Array,
         default: () => ([]),
      },
      cusBusyTime: {
         type: Array,
         default: () => ([]),
      },
   },
   computed: {
      timeNowHour() {
         return new Date().getHours();
      },
      calendarMin() {
         const toDate = new Date();
         return `${toDate.getFullYear()}-${addZeroToDateTime(
            toDate.getMonth() + 1
         )}-${addZeroToDateTime(toDate.getDate())}`;
      },
      invalidTimes() {
         return this.hourAndMinSum(this.toTime, this.toMinute) <= this.hourAndMinSum(this.fromTime, this.fromMinute);
      }
   },
   methods: {
      getIconUrl,
      addZeroToDateTime,
      getDateString(dt) {
         let newDt = new Date().getTimezoneOffset() * 60000;
         return new Date(dt - newDt).toISOString().slice(0, 10);
      },
      hourAndMinSum(h, m) {
         return h + m / 60;
      },
      timeStackedUp(timePair, fromTime, fromMin, toTime, toMin, auto = false) {
         let from = this.hourAndMinSum(fromTime, fromMin);
         let to = this.hourAndMinSum(toTime, toMin);
         let smHour = timePair[0].getHours();
         let smMin = timePair[0].getMinutes();
         let lgHour = timePair[1].getHours();
         let lgMin = timePair[1].getMinutes();
         let smTime = this.hourAndMinSum(smHour, smMin);
         let lgTime = this.hourAndMinSum(lgHour, lgMin);
         // console.log('from: ',from,'to: ',to,'smTime: ',smTime,'lgTime: ',lgTime);
         let stackedTime = !(
            (from <= smTime && to <= smTime) ||
            (from >= lgTime && to >= lgTime)
         );

         // Auto time
         if (auto && stackedTime) {
            if (lgHour == 23) {
               let currentDate = new Date(this.date);
               currentDate.setDate(currentDate.getDate() + 1);
               this.date = currentDate.toISOString().slice(0, 10);
               this.setFromHour(8, true);
               this.setToHour(9, true);
            } else {
               this.fromMinute = lgMin;
               this.setFromHour(Math.max(lgHour, this.fromTime), true);
               this.setToHour(Math.max(lgHour + 1, this.toTime), true);
            }
         }

         return stackedTime;
      },
      stackedTimePairArray(tArray, auto = false) {
         let stacked = false;
         for (let i = 0; i < tArray.length; i++) {
            // console.log('phan tu thu: ',i, 'so sanh: ',this.date, ' : ', this.getDateString(tArray[i][0]))
            if (this.date == this.getDateString(tArray[i][0])) {
               // console.log('phan tu thu: ',i)
               stacked =
                  stacked ||
                  this.timeStackedUp(
                     tArray[i],
                     this.fromTime,
                     this.fromMinute,
                     this.toTime,
                     this.toMinute,
                     auto
                  );
            }
         }
         return stacked;
      },
      // stackedTimeArray(tArray, auto = false) {
      //    let stacked = false;
      //    for (let i = 0; i < tArray.length; i++) {
      //       // console.log('phan tu thu: ',i, 'so sanh: ',this.date, ' : ', this.getDateString(tArray[i][0]))
      //       let checkingDt = new Date(tArray[i]);
      //       let nextHour = new Date(tArray[i]);
      //       nextHour.setHours(checkingDt.getHours() + 1);
      //       if (this.date == this.getDateString(checkingDt)) {
      //          // console.log('phan tu thu: ',i)
      //          stacked =
      //             stacked ||
      //             this.timeStackedUp(
      //                [checkingDt, nextHour],
      //                this.fromTime,
      //                this.fromMinute,
      //                this.toTime,
      //                this.toMinute,
      //                auto
      //             );
      //       }
      //    }
      //    return stacked;
      // },
      checkTime(auto = false) {
         let stacked = false;
         stacked =
            stacked ||
            this.stackedTimePairArray(this.aPickedTime, auto) ||
            this.stackedTimePairArray(this.sPickedTime, auto);
         // console.log('checked time: ', stacked);

         if (stacked) {
            this.errorText =
               "Lịch đã trùng, vui lòng hẹn lịch khác!";
            return;
         }

         // stacked =
         //    stacked ||
         //    this.stackedTimeArray(this.ownBusyTime, auto) ||
         //    this.stackedTimeArray(this.cusBusyTime, auto);
         //
         // if (stacked && !auto) {
         //    this.errorText =
         //       "Chủ / khách đã có lịch hẹn ở khung giờ này, bạn hãy chọn giờ khác";
         //    return;
         // }

         this.errorText = "";
      },
      pickedToday() {
         // console.log(today, ' ', this.date);
         return today == this.date;
      },
      handleBlurFromHour() {
         this.formFromTime = false;
      },
      handleBlurFromMin() {
         this.formFromMin = false;
      },
      handleBlurToHour() {
         this.formToTime = false;
      },
      handleBlurToMin() {
         this.formToMin = false;
      },
      setDateCalendar() {
         if (this.pickedToday()) {
            this.setFromHour(this.fromTime);
            this.setToHour(this.toTime);
         }
      },
      checkNFixToTime() {
         if (this.invalidTimes) {
            this.setToHour(this.fromTime + 1);
         }
      },
      checkNFixFromTime() {
         if (this.invalidTimes) {
            this.setFromHour(this.toTime - 1);
         }
      },
      setFromHour(t, auto = false) {
         let m = this.pickedToday() ? Math.min(this.timeNowHour + 1, 22) : 0;
         this.fromTime = Math.max(m, Math.min(22, t));
         this.checkNFixToTime();
         this.checkTime(auto);
      },
      incFromHour() {
         this.setFromHour(this.fromTime + 1);
      },
      setFromMin(m, step = 1, auto = false) {
         this.fromMinute = m;
         if (this.fromMinute >= (60 - step + 1)) {
            this.fromMinute = 0;
            this.incFromHour();
         } else if (this.fromMinute < 0) {
            this.fromMinute = 60 - step;
            this.decFromHour();
         }
         else {
            this.checkNFixToTime();
         }
         this.checkTime(auto);
      },
      setToMin(m, step = 1, auto = false) {
         this.toMinute = m;
         if (this.toMinute >= (60 - step + 1)) {
            this.toMinute = 0;
            this.incToHour();
         } else if (this.toMinute < 0) {
            this.toMinute = 60 - step;
            this.decToHour();
         }
         else {
            this.checkNFixFromTime();
         }
         this.checkTime(auto);
      },
      minStepFixed(m){
         return m - (m % minuteStep);
      },
      incFromMin() {
         this.setFromMin(this.minStepFixed(this.fromMinute) + minuteStep, minuteStep);
      },
      decFromHour() {
         this.setFromHour(this.fromTime - 1);
      },
      decFromMin() {
         this.setFromMin(this.minStepFixed(this.fromMinute) - minuteStep, minuteStep);
      },
      setToHour(t, auto = false) {
         let m = this.pickedToday() ? Math.min(23, this.timeNowHour + 2) : 1;
         this.toTime = Math.max(m, Math.min(23, t));
         this.checkNFixFromTime();
         this.checkTime(auto);
      },
      incToHour() {
         this.setToHour(this.toTime + 1);
      },
      incToMin() {
         this.setToMin(this.minStepFixed(this.toMinute) + minuteStep, minuteStep);
         // this.toMinute += minuteStep;
         // if (this.toMinute > 45) {
         //    this.toMinute = 0;
         //    this.incToHour();
         // }
         // this.checkTime();
      },
      decToHour() {
         this.setToHour(this.toTime - 1);
      },
      decToMin() {
         this.setToMin(this.minStepFixed(this.toMinute) - minuteStep, minuteStep);
         // this.toMinute -= minuteStep;
         // if (this.toMinute < 0) {
         //    this.toMinute = 45;
         //    this.decToHour();
         // } else {
         //    this.checkNFixFromTime();
         // }
         // this.checkTime();
      },
      orderDateTime() {
         if (this.toTime < this.fromTime) {
            this.toTime = this.fromTime + 1;
         }
         const dateTime = new Date(this.date);
         const fromDateTime = new Date(
            dateTime.getFullYear(),
            dateTime.getMonth(),
            dateTime.getDate(),
            this.fromTime,
            this.fromMinute,
            0
         );
         if (this.toTime == "") {
            this.toTime = this.fromTime + 1;
         }
         const toDateTime = new Date(
            dateTime.getFullYear(),
            dateTime.getMonth(),
            dateTime.getDate(),
            this.toTime,
            this.toMinute,
            0
         );
         this.$emit("add-free-time", fromDateTime, toDateTime);
         this.checkTime(true);
      },
     onPickedTime(fromDate, toDate)
     {
       // console.log(fromDate,'value pick', toDate)
       this.$emit("add-free-time", fromDate, toDate);
     }
   },
   watch: {
      toTime(val) {
         this.setToHour(val);
      },
      fromTime(val) {
         this.setFromHour(val);
      },
      fromMinute(val) {
         this.setFromMin(val);
      },
      toMinute(val) {
         this.setToMin(val);
      },
      date() {
         this.setDateCalendar();
         this.checkTime();
      },
      aPickedTime: {
         handler() {
            this.checkTime();
         },
         deep: true,
      },
      sPickedTime: {
         handler() {
            this.checkTime();
         },
         deep: true,
      },
      // ownBusyTime() {
      //    this.checkTime();
      // },
      // cusBusyTime() {
      //    this.checkTime();
      // },
   },
   emits: ["add-free-time"],
   mounted() {
      this.checkTime(true);
   }
}
</script>

<style scoped>
</style>
