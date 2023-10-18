<template>
  <FpDefLayout
      :bc-props="pgMeta"
      ref="pgLayoutComp"
      @breadcrumbBackIcon="onBreadcrumbBackIcon"
      :show-loading="true"
      :is-loading="!finishLoading"
  >
    <template #comp>

      <div class="container-fluid">
        <div class="py-3 col-12">
          <div class="row justify-content-between mt-3">
            <div class="col-auto d-flex ">
              <span @click="personalSP=false" class="col-auto cursor-pointer me-4 text-content"
                    :class="{' current-process_status':!personalSP}">Liên kết giỏ hàng</span>
              <span v-if="role===Roles.Sales" @click="personalSP=true" class="col-auto cursor-pointer text-content"
                    :class="{' current-process_status':personalSP}">Giao dịch của tôi</span>
            </div>
            <div class="col-auto col-md-3 col-lg-2 text-gray d-flex justify-content-end align-items-center">
              <span class="text-12" v-if="!personalSP">{{ totalResult }} kết quả</span>
              <span v-else class="text-12">{{ personalSpData.length }} kết quả</span>
            </div>
          </div>
          <div class="mt-4 row" v-if="personalSP && role===Roles.Sales">
            <div class="col-lg-4 col-12 mt-3" v-for="(psp,index) in personalSpData" :key="index">
              <div class="card-gray-teal p-2 h-100" @click="$router.push(S_PSP_URL()+'?pspID='+psp.id)">
                <SalesPersonProcMgCard :pjInformation="psp"></SalesPersonProcMgCard>
              </div>
            </div>
          </div>
          <div class="row mt-2 mb-5" v-if="processData && !personalSP">
            <div v-for="(data, index) in processData" :key="index"
                 class="col-lg-4 col-xl-4 col-sm-6 col-md-6 mt-3">
              <div @click="$router.push(tabHref(data.id))"
                   class="p-3 py-lg-3 px-lg-2 mt-4 border8 card-gray-teal h-100">
                <div>
                  <FpUnitCard :imgSrc="data.unitData.thumbnail" unitTextImgStyle="margin-bottom:30px;font-size:12px"
                              :ratioImg="[3,2]"
                              :pj-information="getUnitInformation(data,data.unitData)"
                              :unit-tag="getUnitImgTag(data,data.unitData)"
                              :isAgentManager="role === Roles.Manager ||role === Roles.Agent "
                              :cusData="role!==Roles.Agent ? data.cusData : ''" :tt-img="data.unitData.tt_imgs"
                              :tag-pj-code="getPjCodeTag(data,data.unitData)"
                  ></FpUnitCard>
                </div>
                <div class="text-content text-gray col-10 px-2 mt-2">
                  <span v-if="data?.agentData && role!=='Agent'">Agent: {{ data.agentData.first_name }} </span>
                  <div v-if="data.agentData==null && role!=='Agent'">Agent: Chưa chọn </div>
                  <div v-if="data?.salesData && role!=='Sales'">Sales: {{ data?.salesData?.first_name }} -
                    {{getUserExtData(data?.salesData, 'phone', '')}} </div>
                  <div v-if="data?.unitData && (role===Roles.Agent || role===Roles.Manager)">
                      Chủ nhà: {{ getOwnerData(data?.unitData, 'name', '')}} - {{getOwnerData(data?.unitData, 'phone', '')}}</div>
                  <div v-if="data?.init_time && role!==Roles.Sales">Ngày khởi tạo: {{ddMmYyyy(data?.init_time)}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <FPPaginator
                @to-page="toPage"
                :current-page="currentPage"
                :total-item="totalResult"
                :item-per-page="listLen"
            />
          </div>
        </div>
      </div>

    </template>

    <template #rightBar>
      <SPSFilter
          @pspFilter="pspFilter"
          @filterData="onFilter"
          :role="role"
          :is-psp-page="personalSP"
          :statusDefault="statuses"
      />

    </template>
  </FpDefLayout>
</template>

<script>

import {floatBugFixed, floatFixed, getIconUrl, getObjField, translate} from "@/utils/utils";
import {goToURL} from "@/utils/utils";
import {getCompareValue, post} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {baseUrl, Roles} from "@/utils/constants";
import {ddMmYyyy, fixDateTime} from "@/utils/dateTimeUtils";
import FPPaginator from "@/components/Misc/FPPaginator.vue";
import SPSFilter from "@/views/CommonView/SPSFilter.vue";
import FpDefLayout from "@/views/FpDefLayout.vue";
import {breadcrumpProp, defLayoutBehaType} from "@/models/customProp";
import SalesPersonProcMgCard from "@/views/SalesView/SalesPersonal/SalesPersonProcMgCard.vue";
import {S_PSP_URL, spDetail} from "@/router/URLs";
import {SALE_PROCESS_STATUS} from "@/utils/TransContent";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import FpUnitCard from "@/components/FpUnit/FpUnitCard.vue";
import {getImgUnitTag, getUserExtData, unitPrice, unitPriceTextExt, uPricePfxExt} from "@/utils/unit";
import {getOwnerData} from "@/models/unit";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";


export default {
  components: {
    FpUnitCard,
    SalesPersonProcMgCard,
    FPPaginator,
    SPSFilter,
    FpDefLayout,
  },
  data() {
    return {
      processData: [],
      totalResult: 0,
      listLen: 12,
      currentPage: 1,
      page: 1,
      statuses: ["waiting", "depositing", "signing", 'notarizing'],
      personalSP: false,
      rightBarShow: true,
      personalSpData: [],
      filterData: {},
      // Trans dict
      SALE_PROCESS_STATUS: [],
      Roles,
      // Meta
      pgMeta: {
        [breadcrumpProp.enableRB]: true,
        [breadcrumpProp.title]: 'Quản lý giao dịch',
        [breadcrumpProp.behaviorType]: defLayoutBehaType.signal,
      },
      search: '',
      finishLoading: false
    }

  },
  mounted() {
    this.getDataLib();
    const status = this.statusProps === '' ? 'waiting,depositing,signing,notarizing' : this.statusProps
    this.setStatuses(status)
    this.getPersonalSp(this.defaultFilterData())
    this.getSaleProcess(this.defaultFilterData());
  },
  props: {
    role: {
      type: String,
      required: true,
    },
    statusProps: {
      type: String,
      default: ''
    }
  },
  computed: {},
  methods: {
    ddMmYyyy,
    getOwnerData,
    getUserExtData,
    S_PSP_URL() {
      return S_PSP_URL
    },
    floatBugFixed,
    fixDateTime,
    getIconUrl,
    goToURL,
    tabHref(id) {
      return `${baseUrl[this.role]}${spDetail}-${id}`;
    },
    onFilter(value) {
      // this.finishLoading = false
      this.setStatuses(value.statuses)
      const data = {
        project: value.project,
        rent: value.rent,
        statuses: this.statuses,
        sNotify: value.sNotify,
        favSorting: "-last_update",
        aNotify: value.aNotify,
        listLen: this.listLen,
        role: this.role,
        selfItems: this.role !== Roles.Manager,
        ...value.sort,
      };
      this.role !== Roles.Sales
          ? (data.aSearch = value.search)
          : (data.cusNamePhone = value.search);
      this.filterData = data;
      this.getSaleProcess(this.defaultFilterData());
    },
    transProcessSt(stt) {
      return translate(SALE_PROCESS_STATUS, stt);
    },
    psProgress(data) {
      if (data.peakStatus === "waiting" && data.nextMeetingDate != null) {
        return "scouting";
      }
      return data.peakStatus;
    },
    progressBar(status) {
      const statusRepo = {
        waiting: 0.1,
        scouting: 1,
        depositing: 2,
        notarizing: 3,
        signing: 4,
        done: 5,
      };
      return `${(statusRepo[status] / 4) * 100}%`;
    },
    fixedPrice(price) {
      return floatFixed(price);
    },
    toPage(pageNum) {
      this.currentPage = pageNum;
      this.getSaleProcess(this.defaultFilterData());
      this.getPersonalSp(this.defaultFilterData());
    },
    getDataLib() {
      this.SALE_PROCESS_STATUS = SALE_PROCESS_STATUS;
    },
    defaultFilterData() {
      const data = {
        project: "",
        rent: "",
        statuses: this.statuses,
        sNotify: false,
        aNotify: false,
        listLen: this.listLen,
        page: this.currentPage,
        favSorting: "-last_update",
        role: this.role,
        selfItems: this.role !== Roles.Manager,
        aSearch: '',
        cusNamePhone: ''
      };
      this.role !== Roles.Sales
          ? (data.aSearch = this.search)
          : (data.cusNamePhone = this.search);
      return {
        ...data,
        ...this.filterData,
      };
    },
    async getSaleProcess(filterData) {
      // this.finishLoading = false
      const res = await post("/sale_process/get_sale_processes", filterData)
      this.processData = res.saleProcesses;
      this.totalResult = res.totalResult;
      this.finishLoading = true
    },
    async getPersonalSp(filterData) {
      // this.finishLoading = false
      const res = await post('/personal_sp/get_psp_mgmt_data', filterData)
      if (res) {
        this.personalSpData = res.returnData
      }
      // this.finishLoading = true

    },
    progressBarColor(data) {
      return this.psIsCanceled(data)
          ? "ps-cancel-color"
          : data.rent
              ? "rent-color "
              : "sell-color";
    },
    psIsCanceled(data) {
      return data.status === "cusCanceled" || data.status === "ownCanceled";
    },
    pspFilter(data, rent) {
      this.setStatuses(data)
      this.getPersonalSp({...this.defaultFilterData(), rent: rent})
      this.closeRightBarInMb()
    },
    setStatuses(status) {
      if (status && status.split(',').length >= 2) {
        this.statuses = status.split(',')
      } else {
        this.statuses = [status]
      }
    },
    onBreadcrumbBackIcon() {
      if (!scrWdtFrom(scrWdtEnum.MD) && this.rightBarShow) {
        this.$refs.pgLayoutComp.showRightBar(false);
        this.rightBarShow = false
      } else {
        this.$router.back()
      }
    },
    closeRightBarInMb() {
      if (!scrWdtFrom(scrWdtEnum.MD)) {
        this.$refs.pgLayoutComp.showRightBar(false);
      }
    },
    getUnitInformation(psData, unitData) {
      if (unitData) {
        let price =  convertVndToUserCurrency(getObjField(psData, 'ownPrice'),psData.rent,UnitCurrency.extend)
        return {
          id: getObjField(unitData, 'id'),
          pjData: getObjField(unitData, 'pjData'),
          price: price,
          bedroom: getObjField(unitData, 'bedroom'),
          size: getObjField(unitData, 'size'),
          pjBlock: getObjField(unitData, 'block'),
          status: getObjField(psData, 'status'),
          aFreeTime: getObjField(psData, 'aFreeTime'),
          sFreeTime: getObjField(psData, 'sFreeTime'),
          nextMeetingDate: getObjField(psData, 'nextMeetingDate'),
          rent: getObjField(psData, 'rent'),
          unit_code: getObjField(unitData, 'unit_code'),
          agentData: psData.agentData?.first_name,
        }
      }
    },
    getUnitImgTag(psData, unitData) {
      return getImgUnitTag({
        managementCoverage: unitData.managementCoverage,
        transferringCoverage: unitData.transferringCoverage,
        feeCoverage: unitData.feeCoverage,
        unit_type: unitData.unit_type,
        renting: getObjField(psData, 'rent'),
        furniture: unitData.furniture === 'fully'
      })
    },
    getPjCodeTag(prsData, unit) {
      return `#${prsData.id}`
    }
  },
}
</script>

<style scoped>
</style>
