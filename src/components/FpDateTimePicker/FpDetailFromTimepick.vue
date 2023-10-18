<template>
  <div class="row mt-2 d-flex justify-content-between align-items-center ">
    <span class="col-2">Từ:</span>
    <div class="w-100">
      <date-picker
          v-model:value="value"
          :minute-step="10"
          :hour-options="hours"
          format="HH:mm"
          value-type="format"
          type="time"
          placeholder="HH:mm"
      ></date-picker>
    </div>
  </div>
</template>

<script>
import FpTimePicker from "@/components/FpDateTimePicker/FpTimePicker.vue";
import DatePicker from "vue-datepicker-next";

export default {
  components: { DatePicker, FpTimePicker },
  props: {
    aPickedTime: {
      type: Array,
      default: () => ([
        ["Fri Aug 25 2023 15:00:00 GMT+0700 (Giờ Đông Dương)", "Fri Aug 25 2023 18:00:00 GMT+0700 (Giờ Đông Dương)"],
      ]),
    },
    sPickedTime: {
      type: Array,
      default: () => ([]),
    },
    pickedDay: {
      type: String,
      default:"2023-08-25"
    },
  },
  data() {
    return {
      value: "",
      hours: Array.from({ length: 22 }).map((_, i) => i + 1),
      samePickedDay:[]
    };
  },
  methods: {
    checkFreeTime() {
      const combinedPickedTime = [...this.aPickedTime, ...this.sPickedTime];

      this.samePickedDay = combinedPickedTime.filter(timeRange => {
        return timeRange.filter(day => {
          return new Date(day).toISOString().slice(0, 10)===this.pickedDay
        })
      });
    },
  },
  watch: {
    pickedDay: "checkFreeTime", // Re-run checkFreeTime when pickedDay changes
    aPickedTime: "checkFreeTime", // Re-run checkFreeTime when aPickedTime changes
    sPickedTime: "checkFreeTime", // Re-run checkFreeTime when sPickedTime changes
  },
  mounted() {
    this.checkFreeTime();
  },
};
</script>

