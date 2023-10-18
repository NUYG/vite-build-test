<template>
    <div class="card-blue" style="border-radius: 16px;padding: 14px 24px"  @click="goToURL(spsDetailUrl())">
        <span class="font-weight-600 text-content text-color-black">{{cusName}}</span>
        <div class="row d-flex justify-content-between">
            <span class="col-auto text-content text-color-black">{{transStatus(status)}}</span>
            <span v-if="nextMeetingDate" class="col-auto text-gray text-12">{{getDdMm(nextMeetingDate)}}</span>
        </div>
        <div class="mt-2">
          <FpProgressBar :value="progressBarVal(status)" :progressBarColor="getColorByRentStatus(renting)" ></FpProgressBar>
        </div>
    </div>
</template>

<script>
import FpProgressBar from "@/components/FpProgressBar/FpProgressBar.vue";
import {getDdMm} from "@/utils/dateTimeUtils";
import {getColorByRentStatus, getValueProgressBarWithStatus, goToURL, translate} from "@/utils/utils";
import { S_SP_DETAIL_URL} from "@/router/URLs";
import {SALE_PROCESS_STATUS} from "@/utils/TransContent";

export default {
  methods: {
    goToURL,
    getColorByRentStatus,
    getDdMm,
    progressBarVal(status) {
      return getValueProgressBarWithStatus(status)
    },
    transStatus(status) {
      return translate(SALE_PROCESS_STATUS, status);
    },
    spsDetailUrl() {
      if(this.id)
      {
        return S_SP_DETAIL_URL + "-" + this.id
      }
    },
  },
  components:{
    FpProgressBar
  },
  props:{
    id:{
      type:Number,
    },
    cusName:{
      type:String,
    },
    status:{
      type:String
    },
    renting:{
      type:Boolean
    },
    nextMeetingDate:{
      type:String
    }
  }
}
</script>
