<template>
  <div class="w-100">
    <date-picker
      v-model:value="value"
      :minute-step="10"
      format="HH:mm"
      value-type="format"
      type="time"
      :placeholder="placeholderVal"
      class="w-100 none-shadow"
      :default-value="defaultVal"
      :hour-options="hoursOpts"
      :disabled-time="disableTime"
    ></date-picker>
  </div>
</template>

<script>
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';

export default {
  components: {DatePicker},
  data() {
    return {
      value: '',
      hourVal: new Date().getHours(),
      minuteVal: new Date().getMinutes(),
    };
  },
  computed: {
    timeNow() {
      return new Date();
    },
    minuteDef() {
      const currentMinutes = this.minuteVal;
      const remainder = currentMinutes % this.minuteStep;
      const roundedMinutes = currentMinutes + (this.minuteStep - remainder);
      return roundedMinutes;
    },
    placeholderVal() {
      let adjustedMinutes = this.minuteVal;
      let adjustedHours = this.hourVal;
      return adjustedHours.toString().padStart(2, '0') + ':' + adjustedMinutes.toString().padStart(2, '0');
    },
    defaultVal() {
      return new Date().setHours(this.hourVal, this.minuteVal, 0, 0)
    },
    hoursOpts() {
      return Array.from({length: 23}).map((_, i) => i);
    }
  },
  methods: {
    disableTime(date) {
      return this.lockTimeAfter < date && date < this.lockTimeBefore;
    },
  },
  props: {
    minuteStep: {
      type: Number,
      default: 10
    },
    hoursDefaultValue: {
      type: Number,
    },
    minutesDefaultValue: {
      type: Number,
    },
    name: {
      type: String
    },
    isFromDate: {
      type: Boolean,
      default: false
    },
    isTodayPick: {
      type: Boolean,
    },
    lockTimeBefore: {
      type: Number,
      default: 0
    },
    lockTimeAfter: {
      type: Number,
      default: 24
    }
  },
  watch: {
    value(newVal) {
      this.$emit('time-picked', newVal)
    },
    hoursDefaultValue(newVal) {
      this.hourVal = newVal;
      this.value = this.placeholderVal;
    },
    minutesDefaultValue(newVal) {
      this.minuteVal = newVal;
      this.value = this.placeholderVal;
    }
  },
  mounted() {
    this.hourVal = this.hoursDefaultValue
  }
};
</script>

<style>
.none-shadow input {
  box-shadow: none !important;
}
</style>
