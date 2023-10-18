<template>
  <div class="col-12 mt-5">
    <FpIcon v-if="rentPick" srcIcon="rentImgCreateCus.svg" class="row slide-left-animation" style="height:246px"/>
    <FpIcon v-else srcIcon="sellImgCreateCus.svg" class="row slide-right-animation" style="height:246px"/>
    <FpRentStatusPick :rentProps="rentProps" @rent="onRentingPick"/>
  </div>
</template>

<script>
import FpRentStatusPick from "@/components/FpForm/FpRentStatusPick.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import ButtonNextPrevCreatedCus from "@/views/SalesView/SalesCusCreatedInMobile/ButtonNextPrevCreatedCus.vue";
import {pageTour} from "@/views/Guidance/pageTour";
import TourHost from "@/views/Guidance/TourHost.vue";

export default {
  components: {
    ButtonNextPrevCreatedCus,
    FpIcon,
    FpRentStatusPick,
    TourHost
  },
  data() {
    return {
      rentPick: true,
      pageTour
    }
  },
  methods: {
    onRentingPick(rentingStt) {
      this.rentPick = rentingStt
      this.$emit('cusRent', rentingStt)
    }
  },
  emits: ['cusRent'],
  props: {
    rentProps: {
      type: Boolean,
      default: true
    }
  }

}
</script>

<style>
@keyframes slide-left {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slide-right {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

.slide-left-animation {
  animation: slide-left 0.5s ease-in-out;
}

.slide-right-animation {
  animation: slide-right 0.5s ease-in-out;
}
</style>
