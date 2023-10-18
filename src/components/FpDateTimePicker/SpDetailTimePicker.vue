<template>
    <div class="row mt-2 d-flex justify-content-between align-items-center ">
      <span class="col-2">Từ:</span>
      <FpTimePicker class="col" @time-picked="onFromTimePicked" :hoursDefaultValue="fromHours" :minutesDefaultValue="fromMinute" :isTodayPick="todayPicked" :is-from-date="true" name="fromTime" :max-hour="21" :lock-time-before="timeLocked.lockTimeBefore" :lock-time-after="timeLocked.lockTimeAfter"></FpTimePicker>
    </div>
    <div class="row mt-2 d-flex justify-content-between align-items-center ">
      <span class="col-2">Đến:</span>
      <FpTimePicker class="col" @time-picked="onToTimePicked" :hoursDefaultValue="toHours" :minutesDefaultValue="toMinute" name="toTime" :isTodayPick="todayPicked" :lock-time-before="timeLocked.lockTimeBefore" :lock-time-after="timeLocked.lockTimeAfter"></FpTimePicker>
    </div>

    <div v-if="errorText" class="mt-4 d-flex justify-content-center error-text">
      <p> {{ errorText }} </p>
    </div>

    <div v-else class="mt-4 d-flex justify-content-center">
      <button @click="orderDateTime" class="gray-button w-75 rounded btn-wrap-text small">Đặt lịch hẹn</button>
    </div>
</template>

<script>
import FpTimePicker from "@/components/FpDateTimePicker/FpTimePicker.vue";
import FpDetailFromTimePick from "@/components/FpDateTimePicker/FpDetailFromTimepick.vue";

export default {
  components: {FpDetailFromTimePick, FpTimePicker},
  props: {
    aPickedTime: {
      type: Array,
      default: () => ([]),
    },
    sPickedTime: {
      type: Array,
      default: () => ([]),
    },
    pickedDay: {
      type: String
    },
  },
  mounted() {
    this.onDayChange()
  },
  data() {
    return {
      fromHours: Math.min(22, new Date().getHours()),
      fromMinute: 0,
      toHours: Math.min(23, new Date().getHours() + 1),
      toMinute: 0,
      errorText: '',
    }
  },
  computed: {
    timeNowHour() {
      return new Date().getHours();
    },
    timeNow() {
      return new Date()
    },
    todayPicked() {
      return this.pickedDay === new Date().toISOString().slice(0, 10)
    },
    timeLocked() {
      if (this.todayPicked)
        return {
          lockTimeBefore: new Date().setMinutes(new Date().getMinutes() + 10),
          lockTimeAfter: 23
        }
      else {
        return {
          lockTimeBefore: 0,
          lockTimeAfter: 23
        }
      }
    },
    invalidTimes() {
      return this.hourAndMinSum(this.toHours, this.toMinute) <= this.hourAndMinSum(this.fromHours, this.fromMinute);
    },
  },
  methods: {
    defaultDateTime() {
      this.fromHours = Math.min(22, new Date().getHours())
      this.toHours = Math.min(23, new Date().getHours() + 1)
    },
    onDayChange() {
      if (!this.todayPicked) {
        this.fromHours = 0;
        this.toHours = 1
      } else {
        this.defaultDateTime()
      }
    },
    onFromTimePicked(value) {
      if (value) {
        const {hours, minutes} = this.getHoursAndMinutes(value);
        this.setFromHour(hours);
        this.fromMinute = minutes
      } else {
        this.defaultDateTime()
      }
    },
    onToTimePicked(value) {
      if (value) {
        const {hours, minutes} = this.getHoursAndMinutes(value);
        this.setToHour(hours);
        this.toMinute = minutes
      } else {
        this.defaultDateTime()
      }
    },
    getHoursAndMinutes(timeString) {
      const [hourPart, minutePart] = timeString.split(":");
      const hours = parseInt(hourPart, 10);
      const minutes = parseInt(minutePart, 10);
      return {hours, minutes};
    },

    // constructing funcs
    getDateString(dt) {
      let newDt = new Date().getTimezoneOffset() * 60000;
      return new Date(dt - newDt).toISOString().slice(0, 10);
    },
    hourAndMinSum(h, m) {
      return h + m / 60;
    },
    setDateCalendar() {
      if (this.todayPicked) {
        this.setFromHour(this.fromHours);
        this.setToHour(this.toHours);
      }
    },
    checkNFixToTime() {
      if (this.invalidTimes) {
        this.toHours = this.fromHours;
        this.setToMin(this.fromMinute + 20);
      }
    },
    checkNFixFromTime() {
      if (this.invalidTimes) {
        this.fromHours = this.toHours;
        this.setFromMin(this.toMinute - 20);
      }
    },
    setFromHour(t) {
      let m = this.todayPicked ? Math.min(this.timeNowHour, 22) : 0;
      this.fromHours = Math.max(m, Math.min(22, t));
      this.checkNFixToTime();
    },
    incFromHour() {
      this.setFromHour(this.fromHours + 1);
    },
    decFromHour() {
      this.setFromHour(this.fromHours - 1);
    },
    incToHour() {
      this.setToHour(this.toHours + 1);
    },
    decToHour() {
      this.setToHour(this.toHours - 1);
    },
    setFromMin(m) {
      this.fromMinute = m;
      if (this.fromMinute >= 60) {
        this.fromMinute = 0;
        this.incFromHour();
      } else if (this.fromMinute < 0) {
        this.fromMinute = 40;
        this.decFromHour();
      }
      else {
        this.checkNFixToTime();
      }
    },
    setToMin(m) {
      this.toMinute = m;
      if (this.toMinute >= 60) {
        this.toMinute = 0;
        this.incToHour();
      } else if (this.toMinute < 0) {
        this.toMinute = 50;
        this.decToHour();
      }
      else {
        this.checkNFixFromTime();
      }
    },
    minStepFixed(m){
      return m - (m % minuteStep);
    },
    setToHour(t) {
      let m = this.todayPicked ? Math.min(23, this.timeNowHour + 1) : 1;
      this.toHours = Math.max(m, Math.min(23, t));
      this.checkNFixFromTime();
    },
    orderDateTime() {
      this.checkNFixToTime();
      const dateTime = new Date(this.pickedDay);
      const fromDateTime = new Date(
        dateTime.getFullYear(),
        dateTime.getMonth(),
        dateTime.getDate(),
        this.fromHours,
        this.fromMinute,
        0
      );
      if (this.toHours == "") {
        this.toHours = this.fromHours + 1;
      }
      const toDateTime = new Date(
        dateTime.getFullYear(),
        dateTime.getMonth(),
        dateTime.getDate(),
        this.toHours,
        this.toMinute,
        0
      );
      this.$emit("add-free-time", fromDateTime, toDateTime);
    },
  },
  emits: ['pickedValue', 'add-free-time'],
  watch: {
    pickedDay() {
      this.onDayChange()
    },
    fromHours(newVal) {
      this.setFromHour(newVal);
      // this.$emit('pickedValue', {
      //   fromTime: newVal,
      //   toTime: this.toHours,
      //   fromMinute: this.fromMinute,
      //   toMinute: this.toMinute
      // })
    },
    toHours(newVal) {
      this.setToHour(newVal);
      // this.$emit('pickedValue', {
      //   fromTime: this.fromHours,
      //   toTime: newVal,
      //   fromMinute: this.fromMinute,
      //   toMinute: this.toMinute
      // })
    },
    fromMinute(newVal) {
      // this.$emit('pickedValue', {
      //   fromTime: this.fromHours,
      //   toTime: this.toHours,
      //   fromMinute: newVal,
      //   toMinute: this.toMinute
      // })
    },
    toMinute(newVal) {
      // this.$emit('pickedValue', {
      //   fromTime: this.fromHours,
      //   toTime: this.toHours,
      //   fromMinute: this.fromMinute,
      //   toMinute: newVal
      // })
    },
  }
}
</script>
