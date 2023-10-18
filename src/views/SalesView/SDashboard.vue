<template>
  <FpDefLayout :bcProps="pgMeta" @breadcrumbBackIcon="onBreadcrumbBackIcon" :hidden-back-icon="hiddenBackIcon">
    <template #comp>

      <div v-if="salesData" class="container p-lg-6" style="padding-bottom: 6rem" @click="onExitSearchPc">
        <div class="row d-flex justify-content-center">
          <div class="col-lg-10 pt-lg-4 pt-1">
            <div class="row mt-4 p-3 p-lg-0">
              <div class="col-lg-6 px-lg-5">
                <div class="row">
                  <div class="col-12 d-flex p-1">
                    <SearchDynamicLayout @searchVal="onCusSearch" ref="searchDynamic" class="col"
                                         inputSearchStyle="height:50px" @search-ext="onSearchExt">
                      <template #sugData>
                        <div class="p-2" v-if="cusData && cusData.length">
                          <div v-for="(cus,index) in cusData" :key="index"
                               class=" p-3 card-gray-teal mt-3 sidebar-menu_item ">
                            <div class="d-flex row justify-content-between"
                                 @click="goToCusGeneral(cus.id)">
                              <div class="col-auto d-flex align-items-center">
                                <span class="text-content">{{ cus.name }}</span><span
                                v-if="cus.phone"> ({{ cus.phone }})</span>
                              </div>
                              <div class="col d-flex justify-content-end">
                                <FpUserImg :url="getUrlTypeAvtOfCusData(cus).url"
                                           :type="getUrlTypeAvtOfCusData(cus).type"
                                           :size="40" :borderRound="20" class="col-auto"/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </SearchDynamicLayout>
                    <div class="step-1 col-auto ps-4">
                      <ButtonView class="col-auto " :text-size="14"
                                  @click="$router.push(S_CREATE_CUS_URL())" content="Tạo khách"
                                  :btnIcon="getIconUrl('UserCirclePlus.svg')"
                                  :iconSize="24" status="gray-btn"/>
                    </div>
                  </div>
                  <div class="col-12  mt-4 card-gray-teal  p-1 click-active">
                    <div class="step-2 row py-3">
                      <span class="font-weight-600  px-4">4 khách hàng gần nhất</span>
                      <div class="col-3 mt-3 " v-for="(cusData,index) in lastUpCusData" :key="index">
                        <div class="d-flex justify-content-center">
                          <FpUserImg :url="getUrlTypeAvtOfCusData(cusData).url"
                                     :type="getUrlTypeAvtOfCusData(cusData).type"
                                     :size="40" :borderRound="20" class="cursor-pointer"
                                     @click="goToCusGeneral(cusData.id)"/>
                        </div>
                        <div class="text-12 d-flex justify-content-center text-truncate mt-2 text-start px-2">
                          {{ cusData.sName.slice(0, 10) }}
                        </div>
                      </div>
                      <span v-if="!lastUpCusData.length" class="text-gray px-4 fst-italic">Trống</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6 p-0 px-lg-2 mt-3 mt-lg-0 ">
                <div class="card-gray-teal click-active">
                  <div class="p-4">
                    <div class="d-flex justify-content-between">
                      <div class="col-lg-5 col-8 ">
                        <b>{{ salesData.sales.last_name }} {{ salesData.sales.first_name }}</b>
                        <p class="text-gray small mt-2">
                          <img :src="getIconUrl('UserCircle.svg')" alt='User'/> Chuyên viên kinh doanh</p>
                      </div>
                      <a class="profile col-4 d-flex justify-content-end"
                         @click="$router.push(FPU_INFO_URL())">
                        <FpUserAvt/>
                      </a>
                    </div>
                    <div class="d-flex mt-2 justify-content-around col-lg-10">
                      <div class="col-auto border-end border-2 pe-3  ">
                        <span>Hoa hồng của tôi</span>
                        <div class="text-title font-weight-600">
                          {{
                            parseInt(salesData.commission) > 0 ? `${convertVndToUserCurrency(salesData.commission, true, UnitCurrency.simple)} ` : 0
                          }}
                        </div>
                      </div>
                      <div class="col ps-3 ">
                        <span>Tỉ lệ chuyển đổi</span>
                        <div class="text-title font-weight-600">
                          {{ salesData.conversionRate > 0 ? floatFixed(salesData.conversionRate * 100) : 0 }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="col-10 px-lg-4 mt-2 mt-lg-3">
              <!--              <p class="text-title font-weight-600 mb-0 mt-4"> Hiệu quả công việc </p>-->
              <div class="col-auto col-lg-4 px-0">
                <select v-model="fromDate" class="form-control-plaintext text-content">
                  <option :value=1>Thống kê hôm nay</option>
                  <option :value=7 selected>Thống kê tuần này</option>
                  <option :value=30>Thống kê tháng này</option>
                  <!--                  <option :value=60>2 tháng gần đây</option>-->
                </select>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-6">
                <div class="row d-lg-flex justify-content-around px-1 px-lg-4 mt-2">
                  <div @click="$router.push(S_CUSTOMERS_URL)" class=" col-6 mt-3">
                    <div class="card-blue-teal p-xl-4 p-3 click-active">
                      <p><b>Khách mới</b></p>
                      <div class="d-flex justify-content-around">
                        <h2><b>{{ salesData.cus.new }}</b></h2>
                        <div class="m-auto">
                                            <span class="small"> {{
                                                pctNumber(floatFixed(salesData.cus.newPct))
                                              }} </span>
                          <img v-if="salesData.cus.newPct !== 0"
                               :class="(salesData.cus.newPct) < 0 ? 'flip-y' : ''"
                               :src="getIconUrl('ArrowRise.svg')" alt='arrowRise'/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div @click="$router.push(S_SPS_URL + '?status=waiting')" class=" col-6 mt-3">
                    <div class=" p-xl-4 p-3 card-blue-clicked">
                      <p><b>Tư vấn</b></p>
                      <div class="d-flex justify-content-around">
                        <h2><b>{{ salesData.cus.inPro }}</b></h2>
                        <div class="m-auto">
                            <span class="small">{{
                                pctNumber(floatFixed(salesData.cus.inProPct))
                              }}</span>
                          <img v-if="salesData.cus.inProPct !== 0"
                               :class="(salesData.cus.inProPct) < 0 ? 'flip-y' : ''"
                               :src="getIconUrl('ArrowRise.svg')" alt='arrowRise'/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div @click="$router.push(S_SPS_URL + '?status=depositing')"
                       class=" col-6 mt-3">
                    <div class=" p-xl-4 p-3 card-blue">
                      <p><b>Đã xem nhà</b></p>
                      <div class="d-flex justify-content-around">
                        <h2><b> {{ salesData.cus.scouted }} </b></h2>
                        <div class="m-auto">
                          <span class="small">{{ pctNumber(floatFixed(salesData.cus.scoutedPct)) }}</span>
                          <img v-if="salesData.cus.scoutedPct !== 0"
                               :class="(salesData.cus.scoutedPct) < 0 ? 'flip-y' : ''"
                               :src="getIconUrl('ArrowRise.svg')" alt='ArrowRise'/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div @click="$router.push(S_SPS_URL + '?status=done')" class=" col-6  mt-3">
                    <div class="card-blue-teal  p-xl-4 p-3">
                      <p><b>Đã giao dịch</b></p>
                      <div class="d-flex justify-content-around">
                        <h2><b>{{ salesData.cus.done }}</b></h2>
                        <div v-show="true" class="m-auto">
                              <span class="small">{{
                                  pctNumber(floatFixed(salesData.cus.donePct))
                                }}</span>
                          <img v-if="salesData.cus.donePct !== 0"
                               :class="(salesData.cus.donePct) < 0 ? 'flip-y' : ''"
                               :src="getIconUrl('ArrowRise.svg')" alt='ArrowRise'/>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div class="col-lg-6">
                <div class="row  mt-4">
                  <div class="col-12 ">
                    <div class="p-3 card-gray-teal">
                      <p><b>Lịch hẹn sắp diễn ra</b></p>
                      <div v-for="(sc, index) in salesData.schedule" :key="index"
                           class="row sidebar-menu_item p-2" @click="goToDetail(sc.id)">
                        <div class="col-auto">
                          <b>{{ getTime(sc.nextMeetingDate) }}</b>,
                          {{ ddMm(sc.nextMeetingDate) }}
                          <p class="text-gray">{{ sc.pjData.name }}</p>
                        </div>
                        <div class="col d-flex">
                          <FpUserImg :url="getUrlTypeAvtOfCusData(sc.customerData).url"
                                     :type="getUrlTypeAvtOfCusData(sc.customerData).type"
                                     :size="40" :borderRound="20" class="cursor-pointer"/>
                          <span class="text-content mt-2 px-2">{{ sc.customerData.name }}</span>
                        </div>
                      </div>

                      <div v-for="(sc, index) in salesData.pspSchedule" :key="index"
                           class="row sidebar-menu_item p-2" @click="goToPspDetail(sc.id)">
                        <div class="col-auto">
                          <b>{{ getTime(sc.nextMeetingDate) }}</b>,
                          {{ ddMm(sc.nextMeetingDate) }}
                          <p class="text-gray">{{ sc.pjName }}</p>
                        </div>
                        <div class="col d-flex">
                          <FpUserImg :url="getUrlTypeAvtOfCusData(sc.customerData).url"
                                     :type="getUrlTypeAvtOfCusData(sc.customerData).type"
                                     :size="40" :borderRound="20" class="cursor-pointer"/>
                          <span class="text-content mt-2 px-2">{{ sc.customerData.name }}</span>
                        </div>
                      </div>
                      <span v-if="!salesData.pspSchedule.length && !salesData.schedule.length"
                            class="text-gray fst-italic">Chưa có lịch hẹn</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </template>
  </FpDefLayout>

<!--  <TourHost-->
<!--    pageName="salesDashboard"-->
<!--    :tourOptions="pageTour['Sales Dashboard']"-->
<!--  />-->
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import FpUserAvt from "@/components/FpImg/FpUserAvt.vue";
import {getIconUrl} from "@/utils/utils";
import {getTime, VNDateFormat} from "@/utils/dateTimeUtils";
import {floatFixed, goToURL} from "@/utils/utils";
import {getCompareValue, post} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {
  FPU_INFO_URL,
  S_CREATE_CUS_URL, S_CUS_DETAIL_URL,
  S_CUSTOMERS_URL,
  S_INQUIRIES_URL, S_PSP_URL, S_SP_DETAIL_URL,
  S_SPS_URL,
  S_UNITS_URL
} from "@/router/URLs";
import FpFormSearch from "@/components/FpForm/FpFormSearch.vue";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";
import SearchDynamicLayout from "@/components/FpLayout/SearchDynamicLayout.vue";
import TourHost from "@/views/Guidance/TourHost.vue";
import {breadcrumpProp, defLayoutBehaType} from "@/models/customProp";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {ddMm} from "@/utils/dateTimeUtils";
import {convertVndToUserCurrency, UnitCurrency, unitTextOfCurrency} from "@/models/currency";
import {uPricePfxExt} from "@/utils/unit";
import {pageTour} from "@/views/Guidance/pageTour";

export default {
  computed: {
    UnitCurrency() {
      return UnitCurrency
    },
    unitTextOfCurrency() {
      return unitTextOfCurrency
    }
  },
  components: {
    SearchDynamicLayout,
    FpFormSearch,
    FpDefLayout,
    FpUserAvt,
    FpUserImg, ButtonView,
    TourHost
  },
  data() {
    return {
      salesData: false,
      cusData: [],
      lastUpCusData: [],
      // Filter
      search: '',
      fromDate: 7,
      // Constants
      S_CUSTOMERS_URL,
      S_INQUIRIES_URL,
      S_UNITS_URL,
      S_SPS_URL,
      toastMessage: false,
      message: '',
      pgMeta: {
        [breadcrumpProp.behaviorType]: defLayoutBehaType.signal,
      },
      hiddenBackIcon: true,
      finishLoading: false,
      // import
      pageTour,
    }
  },
  methods: {
    FPU_INFO_URL() {
      return FPU_INFO_URL
    },
    uPricePfxExt,
    convertVndToUserCurrency,
    onSearchExt(val) {
      this.hiddenBackIcon = !val
    },
    ddMm,
    S_CREATE_CUS_URL() {
      return S_CREATE_CUS_URL
    },
    goToDetail(id) {
      this.$router.push(S_SP_DETAIL_URL + "-" + id);
    },
    goToPspDetail(id) {
      this.$router.push(S_PSP_URL + '?pspID=' + id)
    },
    getUrlTypeAvtOfCusData,
    VNDateFormat,
    getIconUrl,
    getTime,
    floatFixed,
    goToURL,
    goToCusGeneral(id) {
      return this.$router.push({name: 'Sales cus detail general', params: {cusID: id}})
    },
    pctNumber(val) {
      return (val > 0 ? "+" : "") + val + (val ? "%" : '');
    },
    async getSalesData() {
      const res = await post("/sales/sales_dashboard_api", {
        fromDate: this.fromDate,
      })
      if (res.succeed) {
        this.salesData = res.returnData;
        this.finishLoading = true
      }
    },
    async getCusData(searchVal) {
      const res = await post("/sales/get_dashboard_cus_data", {
        search: searchVal,
        selfStats: true,
        sorting: '-last_update',
        page: 1,
        listLen: 5,
      })
      this.cusData = res.returnData;
    },
    async getLastUpCusData() {
      const res = await post("/sales/get_dashboard_last_up_cus", {
        selfStats: true,
        sorting: '-last_update',
        page: 1,
        listLen: 4,
      })
      this.lastUpCusData = res.returnData;

    },
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.SALE_PROCESS_STATUS]
      );
      this.SALE_PROCESS_STATUS = res.SALE_PROCESS_STATUS;
    },
    onCusSearch(values) {
      if (values) {
        this.getCusData(values)
        this.$refs.searchDynamic.$data.searchExt = true
      } else {
        this.cusData = []
      }
    },
    onBreadcrumbBackIcon() {
      // console.log(this.$refs.searchDynamic,'refs')
      if (this.$refs.searchDynamic) {
        this.$refs.searchDynamic.cancelPopup()
      }
      this.onCusSearch('')
    },
    onExitSearchPc() {
      if (scrWdtFrom(scrWdtEnum.MD)) {
        this.onBreadcrumbBackIcon()
      }
    }
  },
  watch: {
    fromDate() {
      this.getSalesData();
    },
  },
  mounted() {
    this.getSalesData();
    this.getLastUpCusData();
    this.getDataLib();
  },
  title: 'telelelele',
}
</script>

<style scoped>
</style>
