<template>
  <span> Đặt nhanh lịch hẹn ngày {{ ddMm(this.defaultTime) }} </span>

  <div v-show="!updateLocking">
    <div class="d-flex mt-3 align-items-center">
      <div class="col-7">
        <div class="d-flex justify-content-between">
          <div class="col-auto mt-1 " style="height: 14px">
            <div @click.stop="decFromMin" class="p-0" style="height: 9px">
              <img alt="" class="d-flex svg-btn px-2 opacity-20"
                   style="margin-left: -5px; transform:  rotate(180deg) ;"
                   :src="getIconUrl('CaretRight.svg')">
            </div>
          </div>

          <span> {{ addZeroToDateTime(fromTime) + ' : ' + addZeroToDateTime(fromMinute) }}</span>
          <div class="col mt-1 " style="height: 14px">
            <div @click.stop="incFromMin" class="p-0" style="height: 9px">
              <img alt="" class="d-flex svg-btn px-2 opacity-20" style="margin-left: -5px;"
                   :src="getIconUrl('CaretRight.svg')">
            </div>
          </div>
        </div>
      </div>

      <div class="col">
        <ButtonView :status="btnType" content="Đặt lịch" :textSize="textSize" class="col-auto"
                    @click.stop="verifyBtnClk"/>
      </div>
    </div>
  </div>

</template>

<script lang="js">


import ButtonView from "@/components/FpButton/ButtonView.vue";
import {getIconUrl} from "@/utils/utils";
import {nextSttLvl, setSugData, SPSttLvl} from "@/utils/saleProcess";
import {post} from "@/utils/dataQuery";
import {Roles} from "@/utils/constants";
import {NextBtnTxt} from "@/utils/spConstants";
import {addZeroToDateTime, ddMm} from "@/utils/dateTimeUtils";

const today = new Date().toISOString().slice(0, 10);
const minuteStep = 10;

export default {
  components: {ButtonView},
  data() {
    return {
      // data
      fromTime: 0,
      fromMinute: 0,
      toTime: 0,
      toMinute: 0,
      // controller
      preventClick: false,
      updateLocking: false,
    };
  },
  props: {
    spData: {
      type: Object,
      required: true,
    },
    defaultTime: {
      default: new Date(),
    },
    btnType: {
      type: String,
      default: 'gray-btn',
    },
    textSize: {
      type: Number,
      default: 14,
    },
    preventOnclick: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    timeNowHour() {
      return new Date().getHours();
    },
    nextBtnText() {
      return NextBtnTxt[SPSttLvl(this.spData.peakStatus)];
    },
    appointingTime() {
      return new Date(
        this.defaultTime.getFullYear(),
        this.defaultTime.getMonth(),
        this.defaultTime.getDate(),
        this.fromTime,
        this.fromMinute,
        0
      )
    },
    appointingToTime() {
      return new Date(
        this.defaultTime.getFullYear(),
        this.defaultTime.getMonth(),
        this.defaultTime.getDate(),
        this.toTime,
        this.toMinute,
        0
      )
    },
    pickedToday() {
      return this.defaultTime.toISOString().slice(0, 10) === today;
    },
  },
  methods: {
    ddMm,
    addZeroToDateTime,
    getIconUrl,
    btnClick() {
      if (!this.preventClick) {
        setSugData(this.spData, nextSttLvl(this.spData.peakStatus));
        this.skipProgressSP();
      }
    },
    verifyBtnClk() {
      this.updateSaleProcess();
    },
    setFromHour(t) {
      let m = this.pickedToday ? Math.min(this.timeNowHour + 1, 22) : 0;
      this.fromTime = Math.max(m, Math.min(22, t));
    },
    incFromHour() {
      this.setFromHour(this.fromTime + 1);
    },
    setFromMin(m, step = 1) {
      this.fromMinute = m;
      if (this.fromMinute >= (60 - step + 1)) {
        this.fromMinute = 0;
        this.incFromHour();
      } else if (this.fromMinute < 0) {
        this.fromMinute = 60 - step;
        this.decFromHour();
      }
      this.setToMin(m + minuteStep, minuteStep);
    },
    minStepFixed(m) {
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
    // toTime
    setToHour(t, auto = false) {
      let m = this.pickedToday ? Math.min(23, this.timeNowHour + 2) : 1;
      this.toTime = Math.max(m, Math.min(23, t));
    },
    incToHour() {
      this.setToHour(this.toTime + 1);
    },
    decToHour() {
      this.setToHour(this.toTime - 1);
    },
    setToMin(m, step = 1) {
      this.toMinute = m;
      if (this.toMinute >= (60 - step + 1)) {
        this.toMinute = 0;
        this.incToHour();
      } else if (this.toMinute < 0) {
        this.toMinute = 60 - step;
        this.decToHour();
      }
    },
    // APIs
    async updateSaleProcess() {
      if (this.updateLocking) {
        return;
      }
      this.updateLocking = true;

      let updateData = {}
      updateData = this.spData.one_man ? {
        nextMeetingDate: this.appointingTime
      } : {
        sFreeTime: [[this.appointingTime, this.appointingToTime]]
      }

      const res = await post("/sale_process/update_sale_process", {
        ...updateData,
        role: Roles.Sales,
        id: this.spData ? this.spData.id : -1,
        validate: this.spData,
      });
      this.updateLocking = false;
      if (!res) {
        return;
      }
      this.spData.sFreeTime = [[this.appointingTime, this.appointingToTime]];
    },
  },
  watch: {
    preventOnclick(newVal) {
      this.preventClick = newVal
    },
    defaultTime: {
      handler(val) {
        this.setFromHour(val.getHours());
        this.setToHour(val.getHours());
        this.setFromMin(val.getMinutes(), minuteStep);
      },
      deep: true,
    },
    fromTime(val) {
      this.setFromHour(val);
    },
    fromMinute(val) {
      this.setFromMin(val);
    },
  },
  emits: [],
  mounted() {
    this.preventClick = this.preventOnclick
  }
}
</script>

<style scoped>
</style>
