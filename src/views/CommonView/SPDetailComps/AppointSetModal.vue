<template>
   <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="index" aria-hidden="true" ref="timeModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <h5 class="modal-title ">Chọn giờ hẹn vào ngày {{ datePick }}/{{ monthPick }}</h5>
               <button
                     type="button"
                     class="btn-close"
                     data-bs-dismiss="modal"
                     aria-label="Close"
               ></button>
            </div>
            <div class="modal-body">
               <div class="row">
                  <div class="d-inline-flex justify-content-center col-3 mt-4" v-for="(time,index) in timeList" :key="index">
                     <button :class="{'green-latel':index===btnColor}" @click="selectTime(index)"
                             class="gray-button w-100 border8">{{ time }}
                     </button>
                  </div>
               </div>
            </div>
            <div class="modal-footer d-lg-flex justify-content-between">
               <div type="button" class="w-25 border8" data-bs-dismiss="modal">
                  <img class="process-sidebar_icon" :src="getIconUrl('Trash.svg')" alt="call_icon">
                  <span style="color: rgb(255, 71, 71);"> Hủy bỏ</span>
               </div>
               <button @click="submitOrderTime" data-bs-dismiss="modal" type="button"
                       class="gray-button w-25 border8 text-content">Đặt lịch
               </button>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {getIconUrl} from "@/utils/utils";
import {addZeroToDateTime} from "@/utils/dateTimeUtils";

export default {
   components: {},
   data() {
      return {
         timeList: [],
         btnColor: "",
         monthPick: "",
         datePick: "",
      }
   },
   props: {
      fromTime: {
         type: String,
      },
      toTime: {
         type: String,
      },
      modalId: {
         type: String,
      }
   },
   computed: {},
   methods: {
      addZeroToDateTime,
      getIconUrl,
      selectTime(id) {
         this.btnColor = id;
      },
      setTimeList() {
        this.timeList = [];
        this.monthPick = addZeroToDateTime(new Date(this.fromTime).getMonth() + 1);
        this.datePick = addZeroToDateTime(new Date(this.fromTime).getDate());
        const firstHours = new Date(this.fromTime).getHours();
        const firstMinutes = new Date(this.fromTime).getMinutes();
        const lastHours = new Date(this.toTime).getHours();
        const lastMinutes = new Date(this.toTime).getMinutes();

        for (let i = firstHours; i <= lastHours; i++) {
          const startMinute = i === firstHours ? Math.ceil(firstMinutes / 15) * 15 : 0;
          const endMinute = i === lastHours ? Math.floor(lastMinutes / 15) * 15 : 45;

          for (let j = startMinute; j <= endMinute; j += 15) {
            const hourPart = i.toString().padStart(2, '0');
            const minutePart = j.toString().padStart(2, '0');
            this.timeList.push(`${hourPart}:${minutePart}`);
          }
        }

      },
      submitOrderTime() {
         const hours = Number(this.timeList[this.btnColor].split(":")[0]);
         const minutes = Number(this.timeList[this.btnColor].split(":")[1]);
         const date = new Date(this.fromTime);
         const fullDateTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hours,
            minutes,
            0
         );
         this.$emit("confirm-meeting-time", fullDateTime);
      },
      modalClose(){
         this.$emit("modal-close");
      },
   },
   watch: {
      fromTime(){
         this.setTimeList();
      },
      toTime(){
         this.setTimeList();
      }
   },
   emits: ["confirm-meeting-time", "modal-close"],
   mounted() {
      this.setTimeList();
      this.$refs.timeModal.addEventListener("hidden.bs.modal", this.modalClose);
   }
}
</script>

<style scoped>
</style>
