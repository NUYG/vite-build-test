<template>
  <div class="row mt-4 p-lg-4 p-2 d-flex">
    <div class="col-auto px-0">
      <div @click="handleLevel(0)" :class="circleClassCheck(0)"
           class="d-lg-inline-flex align-items-lg-center d-flex justify-content-center process-nav-icon p-md-2">
        <img v-if="progressCheck(0)" :src="checkedIcon(0,'processLvl1-icon.svg')" class="w-100" alt="">
        <img v-else :src="getIconUrl('processLvl1-icon.svg')" class="w-100 svg-color-d9d9" alt="">
      </div>
      <p class="prg-text text-center mt-2" :class="checkCurrentLvText(0)">{{ ProgressLevel[0] }}</p>
    </div>
    <h2 :class="lineClassCheck(1)" class="line-between col-md col"></h2>
    <div class="col-auto px-0">
      <div @click="handleLevel(2)" :class="circleClassCheck(2)"
           class="d-lg-inline-flex align-items-lg-center d-flex justify-content-center process-nav-icon p-md-2">
        <img v-if="progressCheck(2)" :src="checkedIcon(2,'processLvl2-icon.svg')" class="w-100" alt="">
        <img v-else :src="getIconUrl('processLvl2-icon.svg')" class="w-100 svg-color-d9d9" alt="">
      </div>
      <p class="prg-text text-center mt-2" :class="checkCurrentLvText(2)">{{ ProgressLevel[1] }}</p>
    </div>
    <h2 :class="lineClassCheck(3)" class="line-between col-md col"></h2>
    <div class="col-auto px-0">
      <div @click="handleLevel(4)" :class="circleClassCheck(4)"
           class="d-lg-inline-flex align-items-lg-center d-flex justify-content-center process-nav-icon p-md-2 ">
        <img v-if="progressCheck(4)" :src="checkedIcon(4,'processLvl3-icon.svg')" class="w-100 " alt="">
        <img v-else :src="getIconUrl('processLvl3-icon.svg')" class="w-100 svg-color-d9d9" alt="">
      </div>
      <p class="prg-text text-center mt-2" :class="checkCurrentLvText(4)">{{ ProgressLevel[3] }}</p>
    </div>
    <h2 :class="lineClassCheck(5)" class="line-between col-md col " v-if="!rentCheck"></h2>
    <div class="col-auto px-0">
      <div @click="handleLevel(6)" :class="circleClassCheck(6)" v-if="!rentCheck"
           class="d-lg-inline-flex align-items-lg-center d-flex justify-content-center process-nav-icon p-md-2 ">
        <img v-if="progressCheck(6)" :src="checkedIcon(6,'processLvl4-icon.svg')" class="w-100" alt="">
        <img v-else :src="getIconUrl('processLvl4-icon.svg')" class="w-100 svg-color-d9d9" alt="">
      </div>
      <p class="prg-text text-center mt-2" v-if="!rentCheck" :class="checkCurrentLvText(6)">{{ ProgressLevel[5] }}</p>
    </div>
    <h2 :class="`${lineClassCheck(7) } ${rentCheck ? ' ' : ' line-between-step-5'}`"
        class="line-between col-md col"></h2>
    <div class="col-auto px-0">
      <div @click="handleLevel(8)" :class="circleClassCheck(8)"
           class="d-lg-inline-flex align-items-lg-center d-flex justify-content-center process-nav-icon p-md-2">
        <img v-if="progressCheck(8)" :src="checkedIcon(8,'processLvl5-icon.svg')" class="w-100" alt="">
        <img v-else :src="getIconUrl('processLvl5-icon.svg')" class="w-100 svg-color-d9d9" alt="">
      </div>
      <p class="prg-text text-center mt-2" :class="checkCurrentLvText(8)">{{ ProgressLevel[7] }}</p>
    </div>
  </div>
</template>

<script>
import {getIconUrl} from "@/utils/utils";

const ProgressLevel = {
  0: 'Tư vấn',
  1: "Xem nhà",
  3: "Đặt cọc",
  5: "Công chứng",
  7: "Bàn giao",
};
export default {
  components: {},
  data() {
    return {
      ProgressLevel
    };
  },
  props: {
    currentLevel: {
      type: Number,
      default: 0,
    },
    peakLevel: {
      type: Number,
      default: 0,
    },
    canceled: {
      type: Boolean,
      default: false,
    },
    rentCheck: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    activeTextClass() {
      if(this.canceled)
      {
        return 'font-weight-600 '
      }
      return (this.rentCheck ? 'rent-text' : 'sell-text') + ' font-weight-600'
    }
  },
  methods: {
    getIconUrl,
    checkedIcon(currentLvl = 1, icon) {
      if (this.canceled) {
        return this.curentProgress(currentLvl) ? getIconUrl("XCircle.svg") : getIconUrl(icon);
      }
      return ((this.currentLevel === currentLvl) || (this.currentLevel === (currentLvl - 1))) ? getIconUrl('active-' + icon) : getIconUrl(icon)
    },
    checkCurrentLvText(currentLvl) {
      if (this.currentLevel === currentLvl) {
        return this.activeTextClass
      }
    },
    handleLevel(level) {
      this.$emit("status-click", level);
    },
    lineClassCheck(lvl) {
      return (this.progressCheck(lvl)
          ? this.canceled
              ? "line-between-canceled"
              : this.rentCheck
                  ? "line-rent-done"
                  : "line-sell-done"
          : "");
    },
    circleClassCheck(lvl) {
      let res =
          this.progressCheck(lvl)
              ? this.canceled
                  // ? "process-canceled-box"
                  ? ''
                  : this.rentCheck
                      ? "process-rent-done"
                      : "process-sell-done"
              : "";
      // if (this.currentLevel === lvl) {
      //    res += " outLine";
      // }
      return res;
    },
    progressCheck(lvl) {
      if (this.canceled) {
        lvl -= this.peakLevel >= 2 ? 2 : 1;
      }
      return this.peakLevel >= lvl;
    },
    curentProgress(lvl) {
      if (this.canceled) {
        lvl -= this.peakLevel >= 2 ? 2 : 1;
      }
      return (this.peakLevel === lvl) || (this.peakLevel === lvl - 1);
    },
  },
  watch: {},
  emits: ["status-click"],
  mounted() {
  }
}
</script>

<style scoped>
.outLine {
  box-shadow: 0 0 0 5px #ebedee;
}

.prg-text {
  font-size: 10px;
}

@media (min-width: 768px) {
  .prg-text {
    font-size: 12px;
  }
}

@media only screen and (max-width: 767px) {
  .line-between-step-5 {
    margin: 0 -2px 65px -4px !important;
  }
}
@media only screen and (min-width: 768px) {
  .line-between-step-5 {
    margin: 10px 0 70px -12px !important;
  }
}
</style>
