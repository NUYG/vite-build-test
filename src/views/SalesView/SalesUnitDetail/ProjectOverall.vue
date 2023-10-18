<template>
  <div class="row">
    <div class="row d-flex justify-content-between d-md-none mb-4">
      <span class="col-auto text-content text-color-black font-weight-700">Thông tin dự án</span>
      <button class="gray-button text-12 text-gray col-auto" @click="goToPjInfoDetail">Xem thêm
        <FpIcon srcIcon="arrowLeft.svg" class="rotate-180 " :size="12"></FpIcon>
      </button>
    </div>
    <div class="col-lg-4 col-6">
      <UnitImg :ratioImg="[1,1]" :imgSrc="pjInformation?.avtData?.imgUrl"></UnitImg>
    </div>

    <div class="col">
      <div class="row d-flex justify-content-between">
        <span class="col-auto text-title text-color-black font-weight-700">{{pjInformation.name}}</span>
        <div class="col-auto d-md-flex d-none">
          <button class="gray-button text-12 text-gray" @click="goToPjInfoDetail">Xem thêm
            <FpIcon srcIcon="arrowLeft.svg" class="rotate-180 " :size="12"></FpIcon>
          </button>
        </div>
      </div>
      <span class="d-block mt-1 text-gray ">{{pjInformation.district || 'Đang cập nhật'}}</span>
      <div class="row mt-2">
        <span class="col-md-auto col-12"><FpIcon srcIcon="Building_Level.svg" :size="20"></FpIcon> {{pjInformation.blkData.length || 'Đang cập nhật'}} Block, {{pjInformation.level || 'Đang cập nhật'}} Tầng</span>
        <span class="col-auto mt-2 mt-lg-0"><FpIcon srcIcon="Squaremetre.svg" :size="20"></FpIcon> {{ (pjInformation.size> 0) ? pjInformation.size + 'm²' : 'Đang cập nhật' }} </span>
        <span class="col-auto d-none d-md-flex">Mật độ: {{ (pjInformation.density > 0) ?  pjInformation.density + '%' : 'Đang cập nhật'}}</span>
      </div>
      <div class="row d-md-flex d-none">
        <span class="col-auto mt-2" v-if="pjInformation.mgmtCompData"><FpIcon srcIcon="ShieldStar.svg" :size="20"></FpIcon> Ban quản lý: {{pjInformation?.mgmtCompData?.name || 'Đang cập nhật'}}</span>
        <span class="col-auto mt-2" v-if="pjInformation.hoc_status"><FpIcon srcIcon="Scroll.svg" :size="20"></FpIcon> {{pjHocStatus(pjInformation.hoc_status)}}</span>
        <span class="col-auto mt-2"><FpIcon srcIcon="Globe.svg" :size="20"></FpIcon>Internet: {{getProjectInternet(pjInformation.internetData) || 'Đang cập nhật'}}</span>
      </div>
    </div>
    <div class="row mt-4">
      <FpGoogleMap :location="pjInformation?.address" ></FpGoogleMap>
    </div>

  </div>

</template>

<script>
import ButtonView from "@/components/FpButton/ButtonView.vue";
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {getPjHocSts} from "@/utils/TransContent";
import {S_PJ_INFO} from "@/router/URLs";
import {getProjectInternet} from "@/models/pj";
import FpGoogleMap from "@/components/FpMap/FpGoogleMap.vue";
import {replaceCharacter} from "@/utils/utils";
export default {
  methods:{
    getProjectInternet,
    pjHocStatus(stt) {
      return getPjHocSts(stt)
    },
    goToPjInfoDetail()
    {
      this.$router.push(S_PJ_INFO + '-' + replaceCharacter(this.pjInformation.name,' ','-'))
    }
  },
  components: {
    FpIcon,
    UnitImg,
    ButtonView,
    FpGoogleMap
  },
  props: {
    pjImg: {
      type: String
    },
    pjInformation: {
      type: Object,
      default: () => {
      }
    },
  }
}
</script>

<style scoped>
.gray-button img {
  opacity: 30%;
}
.gray-button:hover img {
  opacity: 1;
  filter: invert(100%) sepia(0%) saturate(7498%) hue-rotate(149deg) brightness(113%) contrast(101%);
}
</style>
