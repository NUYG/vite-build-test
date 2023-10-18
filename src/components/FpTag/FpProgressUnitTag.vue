<template>
  <div class="">
    <span class="pe-3 w-100 text-truncate d-inline-block"><b>{{ code }}</b></span>
    <div class="mt-1">
      <FpProgressBar :value="progressBarVal" :progressBarColor="progressColor" :hProgressbar="4"/>
    </div>
    <div class="mt-2 d-flex justify-content-between ">
      <span v-if="totalSps">Đã tư vấn {{totalSps}} căn hộ</span>
      <span v-else>Chưa tư vấn</span>
      <span>{{spsStatus}}</span>
    </div>
  </div>
</template>

<script>
import FpProgressBar from "@/components/FpProgressBar/FpProgressBar.vue";
import {getValueProgressBarWithStatus} from "@/utils/utils";

export default {
  components: {
    FpProgressBar
  },
  props: {
    code: {
      type: String,
    },
    totalSps: {
      type: Number
    },
    spsStatus: {
      type: String
    },
    processing:{
      type:String
    },
    progressColor:{
      type:String,
    }
  },
  computed: {
    progressBarVal() {
      return getValueProgressBarWithStatus(this.processing)
    },


  },
  methods: {

  },
  mounted() {

  }
}
</script>

