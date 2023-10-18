<template>
  <FpDefLayout
     :bc-props="pgMeta"
  >
    <template #comp>


      <div class="d-flex">
        <div class="col-lg col-md col-12">
          <div class="d-md-flex justify-content-between mt-4 px-4">
            <div class="col-md-8 col-12 d-flex justify-content-between">
              <div class="col-3 col-xl-2 d-flex justify-content-between text-content cursor-pointer">
                <a @click="renting=true" :class="{'current-process_status':renting}" class="text-gray">Thuê</a>
                <a @click="renting=false" :class="{'current-process_status':!renting}"
                   class="text-gray">Mua</a>
              </div>
              <span class="text-content text-gray">{{ totalResult }} kết quả</span>
            </div>
            <div class="col-md-3 d-flex justify-content-end mt-4 mt-md-0">
              <button @click="goToURL(S_CREATE_CUS_URL)"
                      class="gray-button small btn-wrap-text w-100">Tạo yêu cầu mới
              </button>
            </div>
          </div>
          <div class="row p-3">
            <div v-for="(inq, index) in inquiries" :key="index" @click="$router.push(uiInfoURL(inq.id))"
                 class="mt-3 col-lg-6 col-12 ">
              <div class="card-gray-teal p-4 d-flex flex-grow-1 flex-column h-100">
                <div class="d-flex justify-content-between px-2 ">
                  <div class="col-auto d-flex flex-wrap">
                               <span v-for="(pj, index) in inq.pjData" :key="index"
                                     class="border-rounded mt-2 project-color-bar"
                                     :style="{'background-color':pj.projectColor}"
                                     style=" margin-right: 3px;"></span>
                    <div class="col-auto mt-2">
                              <span :class="inq.rent ? 'rent-color' : 'sell-color'" class="rent-color dot"
                                    style="margin-top: 0;">
                              </span>
                    </div>
                  </div>

                  <div class="col-auto d-flex justify-content-end">
                    <img alt="starIcon" v-show="inq.fav" :src="getIconUrl('star-solid.svg')"
                         style="width: 20px; height: 20px;margin-right: 5px;">
                  </div>
                </div>

                <div class="p-2 d-flex justify-content-between">
                  <b> {{ inq.cusData.name }} </b>
                  <b class='text-content'>{{ inq.cusData.phone }}</b>
                </div>
                <div class="d-flex flex-wrap px-2">
                  <span class=""> {{ inq.rent ? 'Thuê' : 'Mua' }} </span>
                  <span v-for="(pj, index) in inq.pjData" class="px-1" :key="index"> {{
                      pj.name
                    }}{{ (index + 1) < inq.pjData.length ? ',' : '' }} </span>
                  <span v-if="inq.ceilingPrice>0" class=""><b> {{
                      inq.ceilingPrice
                    }}{{ inq.rent ? 'Tr' : ' Tỷ' }} </b></span>
                </div>
                <div class="row  px-2 mt-2">
                                    <span v-if="inq.bedroom" class="text-gray small col-auto">{{ inq.bedroom }} <img
                                       alt="bedIcon" :src="getIconUrl('bed-solid.svg')"/></span>
                  <span v-if="inq.furniture === 'fully'" class="text-gray small col-auto"> <img
                     alt="furnitureIcon" :src="getIconUrl('furniture.svg')"/></span>
                  <span v-if="inq.moveInDay" class="text-gray small col-auto"><img
                     alt="calendarIcon" :src="getIconUrl('calender-gray.svg')"> {{
                      getDdMm(new Date(inq.moveInDay))
                    }} </span>
                  <span v-if="inq.ttRSP>0" class="text-gray small col-auto">{{ inq.ttRSP }}<img
                     alt="swapIcon" :src="getIconUrl('Swap.svg')"></span>
                </div>
                <div v-if="inq.sNote!== ''" class="p-2 mt-1 small text-sm-11">
                  {{ inq.sNote }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </template>

    <template #rightBar>
      <SInqMgmtFilter @filter-data="filterItems"/>
    </template>
  </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import SInqMgmtFilter from "@/views/SalesView/SInqMgmtFilter.vue";

import {getIconUrl, goToURL} from "@/utils/utils";
import {getDdMm} from "@/utils/dateTimeUtils";
import {post} from "@/utils/dataQuery";
import {S_CREATE_CUS_URL, S_INQ_DETAIL_URL} from "@/router/URLs";
import {breadcrumpProp} from "@/models/customProp";

export default {
  components: {
    SInqMgmtFilter,
    FpDefLayout,
  },
  data() {
    return {
      inquiries: [],
      totalItems: 3,
      page: 1,
      filterData: {},
      totalResult: 0,
      renting: true,
      // Trans dict
      CUSTOMER_SOURCE: [],
      S_CREATE_CUS_URL,
      // Meta
      pgMeta: {
        [breadcrumpProp.enableRB]: true,
      },
    }
  },
  computed: {},
  methods: {
    getIconUrl,
    goToURL,
    getDdMm,
    uiInfoURL(id) {
      return S_INQ_DETAIL_URL + "/" + id;
    },
    scrollHandle() {
      const bottom = document.documentElement.scrollHeight - window.innerHeight;
      const distance = bottom - window.scrollY;
      if (distance < 1) {
        this.getUIData(this.filterData);
      }
    },
    async getUIData(filterData) {
      const res = await post("/sales/get_filtered_ui", {
        ...{
          selfItems: true,
          status: "waiting",
          page: this.page,
          rent: this.renting,
          favSorting: "-last_update",
          listLen: 12,
        },
        ...filterData,
      })
      if (res) {
        this.totalItems = res.totalResult;
        this.inquiries = this.inquiries.concat(
           res.returnData
        );
        this.totalResult = res.totalResult;
        // console.log(this.inquiries);
        this.page++;
      }
    },
    async filterItems(filterData) {
      this.page = 1;
      this.filterData = filterData;

      const res = await post("/sales/get_filtered_ui", {
        ...{
          page: 1,
          listLen: 12,
          status: "waiting",
          selfItems: true,
          rent: this.renting,
          favSorting: "-last_update",
        },
        ...filterData,
      })
      if (res) {
        this.inquiries = res.returnData;
        this.totalItems = res.totalResult;
        this.page++;
      }
    },
  },
  watch: {
    renting() {
      this.filterItems();
    },
  },
  mounted() {
    this.getUIData();
    window.addEventListener("scroll", this.scrollHandle);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.scrollHandle);
  }
}
</script>

<style scoped>
</style>
