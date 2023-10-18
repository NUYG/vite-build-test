<template>
  <div class="p-3 w-100 py-3 border8" style="background:rgba(0, 0, 0, 0.05);" v-if="masterPlanImgList.length">
    <div class="d-flex align-items-center justify-content-center  w-100 ">
      <swiper :pagination="{ type: 'fraction' }" :navigation="true" :modules="modules" class="mySwiper h-75 col-12"
              :loop="false" @slide-change="onSwipeChange">
        <swiper-slide v-for="(mpData, index) in masterPlanImgList" :key="index" class="col-auto">
          <UnitImg :img-src="mpData.wm_url" class="col-auto" :ratio-img="[3, 2]"></UnitImg>
          <p class="mt-3 text-center" v-if="mpData.floorCode">
            Tầng {{ mpData.floorCode }}
          </p>
        </swiper-slide>
      </swiper>
    </div>
  </div>

</template>

<script>
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Navigation, Pagination} from 'swiper';
import UnitImg from '@/components/FpUnit/UnitImg.vue';
import {extractFirstNum} from "@/utils/utils";

export default {
  components: {
    UnitImg,
    Swiper,
    SwiperSlide,
  },
  props: {
    blockData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      modules: [Navigation],
      currentMasterPlan: 0,
      masterPlanImgList: [],
    };
  },
  methods: {
    onSwipeChange(slide) {
      if (slide.realIndex === this.masterPlanImgList.length - 1) {
        this.currentMasterPlan++;
        this.setImgToMasterPlanImgList();
      }
    },
    setImgToMasterPlanImgList() {
      const masterPlanData = this.blockData.masterPlanData || [];
      const imgs = masterPlanData[this.currentMasterPlan]?.imgs || [];
      const imgsWithFloorCode = imgs.map(img => ({
        ...img,
        floorCode: this.convertFloorCodeToString(masterPlanData[this.currentMasterPlan]?.floor) || '',
      }));
      this.masterPlanImgList.push(...imgsWithFloorCode);
    },
    alignFloors(floor1, floor2) {
      return Math.abs(extractFirstNum(floor1) - extractFirstNum(floor2)) <= 1;
    },
    getFloorString(floorList, index = 0, buildingStr = '') {
      if (index >= floorList.length || index < 0) {
        return buildingStr;
      }
      let addString = ''
      if (index === 0) {
        addString = floorList[index];
      } else {
        if (!this.alignFloors(floorList[index], floorList[index - 1])) {
          addString = ', ' + floorList[index];
        } else if (!(index < floorList.length - 1 && this.alignFloors(floorList[index], floorList[index + 1]))) {
          addString = '-' + floorList[index];
        }
      }

      return this.getFloorString(floorList, index + 1, buildingStr + addString);
    },
    convertFloorCodeToString(floorList) {
      return floorList.length ? this.getFloorString(floorList) : '';
    }
  },
  mounted() {
    this.setImgToMasterPlanImgList();
  },
};
</script>
