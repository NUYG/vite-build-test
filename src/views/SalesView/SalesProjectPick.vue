<template>
  <div v-show="componentName==='Sales Project Pick'">

    <FpDefLayout :bc-props="pgMeta" ref="pgLayout" @breadcrumbBackIcon="onBreadcrumbBackIcon"
                 :is-guest="isGuest" :hidden-back-icon="searchExtending && isGuest"
                 :bannerLoginReq="showBannerLoginReq">
      <template #comp>
        <div class="container-fluid">
          <div class="d-flex justify-content-between align-items-center row px-3">
            <span class="text-color-black font-weight-600 p-3 mt-2 col-auto" style="font-size: 18px">Chọn dự án</span>

            <div class="col d-flex d-md-none justify-content-end">
              <SearchDynamicLayout ref="searchDynamic" class="col-2 col-md-4" @search-val="onSearchVal"
                                   @search-ext="onSearchExt"
                                   :placeholderInput="placeholderInput">
                <template #sugData v-show="isMobile && searchExt">
                  <div class=" mt-3" v-for="(pj,index) in pjData" :key="index">
                    <div class="p-3 card-gray-active sidebar-menu_item" @click="goToUnitPjCart(pj)">
                      <span class="mt-2">{{ pj.name }}</span>
                    </div>
                  </div>
                </template>
              </SearchDynamicLayout>
            </div>
          </div>
          <div class="row p-lg-3 px-2">
            <div v-for="(item, index) in districtData" :key="index" class="col-auto p-0 pe-2">
              <div class="tag d-flex justify-content-between " :class="{'button-blue-teal':checkPjPicked(item.id)}"
                   @click="onPickDistrict(item.id)">
                <div class='d-flex tag-text align-items-center'>
                  <span class="text-sm-10">{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-lg-4 col-6 " v-for="(pj,index) in pjData" :key="index">
              <div class="p-lg-3 p-2 h-100" @click="goToUnitPjCart(pj)">
                <UnitImg :img-src="pj.avtData?.imgUrl" :ratio-img="[3,2]"></UnitImg>
                <div class="font-weight-600 mt-2 text-color-black text-truncate row px-3" style="font-size: 16px">
                  {{ pj.name }}
                </div>
                <span class="px-3 text-gray row text-sm-12" :class="textSize">{{ pj?.address.slice(0, 49) }}</span>
                <div class="row mt-2">
                  <div class="col-auto  d-flex align-items-center" v-if="pj.rUnits && parseInt(pj.rUnits)>0">
                    <FpDot dot-color="#48BD48" :dotSize="isMobile?6:12"></FpDot>
                    <span class="mx-2 text-sm-10 ">{{ pj.rUnits }} Cho thuê</span>
                  </div>
                  <div class="col-auto d-flex align-items-center" v-if="pj.sUnits && parseInt(pj.sUnits)>0">
                    <FpDot dot-color="#ff4747" :dotSize="isMobile?6:12"></FpDot>
                    <span class="mx-2 text-sm-10">{{ pj.sUnits }} Bán</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </FpDefLayout>

    <TourHost
      v-if="!!scrWdtTo(scrWdtEnum.SM) && !isGuest"
      pageName="projectpickpick"
      :tourOptions="pageTour['New Sales Project Pick']"
      :startDelay="500"
    />
  </div>

  <router-view></router-view>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";

import {
  floatFixed,
  getIconUrl, getItemFromLocalStorage,
  goToURL, setLocalStorageItem,
  translate
} from "@/utils/utils";
import {IMG_URL} from "@/utils/constants";
import {getDdMm} from "@/utils/dateTimeUtils";
import {post} from "@/utils/dataQuery";
import {breadcrumpProp, defLayoutBehaType} from "@/models/customProp";
import {GUEST_UNITS_URL, S_DASHBOARD_URL, S_PJ_PICK, S_UNITS_URL} from "@/router/URLs";
import SalesCusFilter from "@/components/FpFilter/SalesFilter/SalesCusFilter.vue";
import {scrWdtEnum, scrWdtFrom, scrWdtTo} from "@/utils/windowWidth";
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import FpDot from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpDot.vue";
import SearchDynamicLayout from "@/components/FpLayout/SearchDynamicLayout.vue";
import MultTagField from "@/components/FpInput/FpFields/MultTagField.vue";
import {mapGetters} from "vuex";
import TourHost from "@/views/Guidance/TourHost.vue";
import {pageTour} from "@/views/Guidance/pageTour";


export default {
  components: {
    TourHost,
    MultTagField,
    SearchDynamicLayout,
    FpDot,
    UnitImg,
    SalesCusFilter,
    FpDefLayout,
  },
  data() {
    return {
      IMG_URL,
      // Meta
      pgMeta: {
        [breadcrumpProp.title]: 'Chọn dự án',
        [breadcrumpProp.behaviorType]: defLayoutBehaType.signal
      },
      finishLoading: false,
      pjData: [],
      pjSearch: '',
      searchExt: true,
      districtData: [],
      districtPick: [],
      showBannerLoginReq: true,
      // import
      pageTour,
      scrWdtEnum,
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIn']),
    isMobile() {
      return !scrWdtFrom(scrWdtEnum.MD);
    },
    textSize() {
      return this.isMobile ? 'text-side ' : 'text-content';
    },
    placeholderInput() {
      return this.isMobile ? '' : 'Tìm dự án';
    },
    searchExtending() {
      return this.$refs?.searchDynamic?.$data.searchExt;
    },
    componentName() {
      return this.$route.name
    },
    isGuest() {
      return !this.getIsLoggedIn
    }
  },
  methods: {
    scrWdtTo,
    scrWdtFrom,
    translate,
    getIconUrl,
    goToURL,
    getDdMm,
    floatFixed,
    async getPjData() {
      const res = await post('/sales/get_unit_cart_pj_pick_data', {
        name: this.pjSearch,
        dists: this.districtPick,
        activeOnly: true,
        sorting: '-ttAvailSort',
      })
      if (res && res.succeed) {
        this.pjData = res.returnData;
        this.finishLoading = true;
      }
      // console.log(this.pjData)
    },
    onSearchVal(val) {
      this.pjSearch = val;
      this.getPjData();
    },
    onSearchExt(val) {
      this.showBannerLoginReq = !val;
    },
    onBreadcrumbBackIcon() {
      if (this.$refs?.searchDynamic?.$data.searchExt) {
        this.$refs.searchDynamic.cancelPopup()
      } else {
        this.$router.back()
      }
      this.pjSearch = ''
    },
    goToUnitPjCart(pj) {
      const formattedPjName = pj.name.replace(/\s+/g, '-');
      this.$router.push({name: 'Sales Cart', params: {renting: 'thue', pjName: formattedPjName}})
    },
    async getDistrictsData() {
      const res = await post('/areas/get_districts_data', {
        activeOnly: true
      })
      this.districtData = res.returnData;
    },
    checkPjPicked(id) {
      if (this.districtPick.length) {
        return this.districtPick.includes(id);
      }
    },
    onPickDistrict(id) {
      if (this.districtPick.includes(id)) {
        this.districtPick.splice(this.districtPick.indexOf(id), 1);
      } else {
        this.districtPick.push(id);
      }
      setLocalStorageItem('cartPjPick', JSON.stringify(this.districtPick));
      this.getPjData();
    },
    getDefaultDistrictFromLocal() {
      this.districtPick = JSON.parse(getItemFromLocalStorage('cartPjPick')) || []
      if (this.districtPick.length) {
        this.getPjData();
      }
    }
  },
  props: {
    // isGuest: {
    //   type: Boolean,
    //   default: false
    // }
  },
  async mounted() {
    console.log('mount')
    await this.getPjData()
    await this.getDistrictsData()
    await this.getDefaultDistrictFromLocal()
  },
  watch: {}
}
</script>

<style scoped>

</style>
