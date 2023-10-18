<template>
  <FpDefLayout
      :bc-props="pgMeta"
      ref="pgLayoutComp"
      @breadcrumbBackIcon="onBreadcrumbBackIcon">
    <template #comp>

      <div class="container-fluid">
        <div class="py-3 col-12">
          <div class="row justify-content-between mt-3">
            <div class="col-auto d-flex ">
              <div class="row d-lg-flex text-content mt-3" style="font-weight: 600;">
                <span @click="onFilteredStatusUr(false,URequestSttEnum.PROCESSING)" class="col-auto cursor-pointer "
                      :class="{'current-process_status':!assigning && assigning!=='' && status===URequestSttEnum.PROCESSING}">Đang xử lý</span>
                <span @click="onFilteredStatusUr(true,URequestSttEnum.PROCESSING)" class="col-auto cursor-pointer "
                      :class="{'current-process_status':assigning}">{{ waitingAssignText.tab }} {{
                    totalWaitingAssign
                  }}</span>
                <span @click="onWaitingCreateRequest" class="col-auto cursor-pointer" v-if="role===Roles.Manager"
                      :class="{'current-process_status':waitingCreateReq}">Chưa khởi tạo</span>
                <span @click="onFilteredStatusUr(false,URequestSttEnum.DONE)" class="col-auto cursor-pointer"
                      :class="{'current-process_status':status===URequestSttEnum.DONE}">Hoàn thành</span>
                <span @click="onFilteredStatusUr(false,URequestSttEnum.CANCELED)" class="col-auto cursor-pointer "
                      :class="{'current-process_status':status===URequestSttEnum.CANCELED}">Đã hủy</span>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-auto">
              <div class="row">
                <FpSimpleFilter :renting="true" @furBedroomFilter="onSimpleFilter" @submit-filter="onSimpleFilter"
                                :default-filter-data="filterData">
                </FpSimpleFilter>
              </div>
            </div>
            <div v-if="role === Roles.Manager" class="col-auto">
              <select v-model="filterData.agent" class="form-control-plaintext text-content text-gray">
                <option value="" selected>Tất cả</option>
                <option v-for="(agent, index) in agentData" :key="index" :value="agent.id" >{{ agent.username || agent.first_name }}</option>
              </select>
            </div>
            <div class="col-3">
              <FpFormSearch @search-val="onSearchName"></FpFormSearch>
            </div>
          </div>
          <LoadingAnimContainer
              :isLoading="!finishLoading"
          >
            <template #content>

              <div class="row mt-4" v-if="requestVal.length && !waitingCreateReq">
                <div v-for="(data, index) in requestVal" :key="index"
                     class="col-lg-4 col-xl-4 col-sm-6 col-md-6 mt-3">
                  <div class="p-3 mt-4 card-gray-teal h-100">
                    <div class="row d-flex justify-content-between align-items-center">
                      <div class="col-auto">
                      <span class="col-auto font-weight-600 text-content">{{ data?.salesData?.username }}
                      <span
                          v-if="getUserExtData(data?.salesData, 'phone')">- {{getUserExtData(data?.salesData, 'phone', '')
                        }} </span></span>
                        <p class="text-12 text-gray">Yêu cầu {{ data.id }} <span
                            v-if="role===Roles.Agent || role===Roles.Manager">- {{ getDdMm(data?.init_time) }}</span>
                        </p>
                      </div>
                      <span class="col-auto ">
                      <FpUserImg :size="32" :borderRound="16"
                                 :url="getUrlTypeAvtOfCusData(data?.salesData?.extData[0]).url"
                                 :type="getUrlTypeAvtOfCusData(data?.salesData?.extData[0]).type"></FpUserImg>
                  </span>
                    </div>
                    <p>{{ cusInqShortened(data.inquiryData) }}</p>
                    <div class="text-content">
                      <span v-if="data.tt_picked_units>0">Đã đề xuất {{ data.tt_picked_units }} căn hộ</span>
                      <div v-if="data.tt_paired_units>0">{{ data.tt_paired_units }} căn hộ phù hợp</div>
                      <div v-if="data?.inquiryData.tt_running_sp && data?.inquiryData.tt_running_sp>0">
                        Đã ghép {{ data?.inquiryData.tt_running_sp }} căn hộ
                      </div>
                      <p v-if="data?.inquiryData?.init_time">Ngày tạo nhu cầu:
                        {{ getDdMm(data?.inquiryData?.init_time) }}</p>
                    </div>


                    <div v-if="assigning" class="d-flex justify-content-between row">
                      <div class="col-auto" v-if="role===Roles.Manager">
                        <select v-model="data.agentID" class="form-control-plaintext border border-1">
                          <option :value="null"> Chưa ghép</option>
                          <option v-for="(ag, index) in agentData" :key="index" :value="ag.id">{{
                              ag.username
                            }}
                          </option>
                        </select>
                      </div>
                      <div class="col d-flex justify-content-end">
                        <ButtonView status="more-btn" :content="waitingAssignText.accept" class="col-auto"
                                    @click="onPickedRequest(data)"></ButtonView>
                        <ButtonView status="gray-btn" content="Từ chối" class="col-auto ms-2"
                                    v-if="role===Roles.Manager"
                                    @click="onMnCancelRequest(data.id)"></ButtonView>
                      </div>
                    </div>
                    <div v-else :class=" {'d-flex justify-content-between align-items-center':role!==Roles.Manager}"
                         class="row">
                      <div class="col-auto">
                        <div class="col-auto" v-if="data.agentData && role===Roles.Manager">Agent:
                          {{ data.agentData.username }}
                        </div>
                      </div>
                      <div class="col d-flex justify-content-end" @click="urDetail(data.id)">
                        <button class="gray-button text-content col-auto">Chi tiết
                          <FpIcon srcIcon="arrowLeft.svg" class="rotate-180" :size="12"></FpIcon>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              <!--          region: set request for Agent-->

              <div class="row mt-4 p-2" v-if="waitingCreateReq">
                <div class="col-md-4 col-12 mt-3" v-for="(inq,index) in inqData" :key="index">
                  <div class="card-gray-teal p-3 h-100">
                    <div class="row d-flex justify-content-between">
                      <div class="col">
                    <span class="font-weight-600 text-content">{{ inq?.salesData?.username }}
                      <span class="text-sm-12"
                            v-if="getUserExtData(inq?.salesData, 'phone')"> - {{
                          getUserExtData(inq?.salesData, 'phone', '')
                        }}
                      </span>
                    </span>
                        <p style="font-size: 12px">{{ getTime(inq?.init_time) }} {{ getDdMm(inq?.init_time) }}</p>
                      </div>
                      <div class="col-auto">
                        <FpUserImg :size="32" :borderRound="16"
                                   :url="getUrlTypeAvtOfCusData(inq?.salesData?.extData[0]).url"
                                   :type="getUrlTypeAvtOfCusData(inq?.salesData?.extData[0]).type"></FpUserImg>
                      </div>
                    </div>
                    <p class="text-content">{{ getInqData(inq) }}</p>
                    <div class="row d-flex justify-content-between ">
                      <div class="col-6">
                        <select v-model="inq.agentID" class="form-control-plaintext border border-1">
                          <option :value="null"> Chưa ghép</option>
                          <option v-for="(ag, index) in agentData" :key="index" :value="ag.id">{{
                              ag.username
                            }}
                          </option>
                        </select>
                      </div>
                      <div class="col-auto mt-1" @click="onSetAgentRequest(inq)">
                        <ButtonView status="more-btn" content="Tạo" :btn-height="75" class="col-auto px-4"></ButtonView>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </template>
          </LoadingAnimContainer>

          <!--          end region-->
        </div>
      </div>


      <div v-show="totalItem > 0 && finishLoading" class="row mt-5">
        <FPPaginator
            @to-page="toPage"
            :current-page="currentPage"
            :total-item="totalItem"
            :item-per-page="listLen"
        />
      </div>

    </template>

    <template #rightBar>
      <SPSFilter
          @filterData="onFilterData"
          :role="role"
          :statusFilter="false"
          :shorting="false" @reset-filter="onResetFilter">
        <template #extSearch>
          <div class="p-2">
            <p>Thời gian</p>
            <div class="row d-flex align-items-center justify-content-between">
              <div class="col-auto">
                <span>Từ: </span>
              </div>
              <div class="col-8">
                <input type="date" class="form-control" v-model="fromDate"/>
              </div>
            </div>
            <div class="row d-flex align-items-center justify-content-between mt-3">
              <div class="col-auto">
                <span>Đến: </span>
              </div>
              <div class="col-8">
                <input type="date" class="form-control" v-model="toDate"/>
              </div>
            </div>
          </div>
        </template>
      </SPSFilter>
    </template>
  </FpDefLayout>
</template>

<script>

import {floatBugFixed, getIconUrl, translate} from "@/utils/utils";
import {goToURL} from "@/utils/utils";
import {post} from "@/utils/dataQuery";
import {baseUrl, Roles} from "@/utils/constants";
import {fixDateTime, getDdMm, getTime} from "@/utils/dateTimeUtils";
import FPPaginator from "@/components/Misc/FPPaginator.vue";
import SPSFilter from "@/views/CommonView/SPSFilter.vue";
import FpDefLayout from "@/views/FpDefLayout.vue";
import {breadcrumpProp, defLayoutBehaType} from "@/models/customProp";
import SalesPersonProcMgCard from "@/views/SalesView/SalesPersonal/SalesPersonProcMgCard.vue";
import {U_REQUEST_STT, VIEW, viewsTranslate} from "@/utils/TransContent";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {URequestSttEnum} from "@/models/unitRequest";
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";
import {getPjNameInPjData, getStatusTextByRent, transFurniture, uPricePfxExt} from "@/utils/unit";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {InqEnum} from "@/models/inquiry";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";
import LoadingAnimContainer from "@/components/FpAnimation/LoadingAnimContainer.vue";
import {A_U_REQUEST_DETAIL, MG_REQUEST_MGMT, MG_U_REQUEST_DETAIL_URL, spDetail} from "@/router/URLs";
import FpSimpleFilter from "@/components/FpFilter/SalesFilter/FpSimpleFilter.vue";
import FpFormSearch from "@/components/FpForm/FpFormSearch.vue";
import router from "@/router";

export default {
  components: {
    FpFormSearch,
    FpSimpleFilter,
    LoadingAnimContainer,
    FpIcon,
    SalesPersonProcMgCard,
    FPPaginator,
    SPSFilter,
    FpDefLayout,
    FpUserImg,
    ButtonView
  },
  data() {
    return {
      processingReq: [],
      assigningReq: [],
      totalResult: 0,
      totalRequest: 0,
      totalInq: 0,
      totalItem: 0,
      listLen: 12,
      currentPage: 1,
      page: 1,
      status: 'processing',
      rightBarShow: true,
      // For roles that have 2 tab (Mgmt, assign) (Agent, Manager)
      assigning: true,
      // Trans dict
      Roles,
      // Meta
      pgMeta: {
        [breadcrumpProp.enableRB]: true,
        [breadcrumpProp.title]: 'Quản lý yêu cầu căn',
        [breadcrumpProp.behaviorType]: defLayoutBehaType.signal,
        [breadcrumpProp.showRB]: false,
      },
      search: '',
      finishLoading: false,
      agentData: [],
      agentId: '',
      countWaitingAssign: 0,
      waitingCreateReq: false,
      inqData: [],
      VIEW,
      fromDate: '',
      toDate: '',
      filterData: {
        bedroom: '',
        views: [],
        balconies: [],
        unitType: '',
        project: '',
        furniture: '',
        availableIn: 0,
        fromPrice: undefined,
        toPrice: undefined,
        agent: '',
      },
      nameSearch:{}
    }
  },

  props: {
    role: {
      type: String,
      required: true,
    },
    defaultStt: {
      type: String,
      default: URequestSttEnum.PROCESSING,
    },
    notInitialized: {
      type: String,
      default: ''
    }
  },
  computed: {
    URequestSttEnum() {
      return URequestSttEnum
    },
    waitingAssignText() {
      return this.role === Roles.Manager  ? {tab: 'Phân quyền', accept: 'Phân quyền'} : {
        tab: 'Chờ tiếp nhận',
        accept: 'Tiếp nhận'
      }
    },
    totalWaitingAssign() {
      return this.totalResult > 0 ? `(${this.totalResult})` : ''
    },
    agentMgmtFilter() {
      return {
        selfItems: true,
      }
    },
    assignFilter() {
      return {
        nonAgent: true,
      }
    },
    salesMgmtFilter() {
      return {
        selfItems: true,
      }
    },
    defaultFilter() {
      if (this.assigning && this.role !== Roles.Sales) {
        return this.assignFilter;
      }
      if (this.role === Roles.Agent) {
        return this.agentMgmtFilter;
      }
      if (this.role === Roles.Manager) {
        return this.agentMgmtFilter;
      }
      if (this.role === Roles.Sales) {
        return this.salesMgmtFilter;
      }
    },
    requestVal() {
      return this.assigning ? this.assigningReq : this.processingReq;
    },
    pickingAgent(){
      return this.filterData.agent;
    }
  },
  methods: {
    getTime,
    getDdMm,
    getUrlTypeAvtOfCusData,
    floatBugFixed,
    fixDateTime,
    getIconUrl,
    goToURL,
    onResetFilter() {
      this.fromDate = '';
      this.toDate = '';
    },
    onWaitingCreateRequest() {
      this.waitingCreateReq = true;
      this.assigning = '';
      this.status = '';
      // this.pgMeta[breadcrumpProp.enableRB] = true;
      // if (scrWdtFrom(scrWdtEnum.MD)) {
      //   this.$refs.pgLayoutComp.rBShow = true;
      // }
      this.totalItem = this.totalInq;
      this.currentPage = 1;
    },
    async onFilteredStatusUr(val, status) {
      if (status) {
        this.status = status;
      }
      this.currentPage = 1;
      this.waitingCreateReq = false;
      this.assigning = val;
      await this.getUnitRequests(this.defaultFilterData());
      this.totalItem = this.totalRequest;
    },
    cusInqShortened(inq) {
      const name = inq?.cusData?.sName;
      const status = getStatusTextByRent(inq.rent);
      const pjName = this.getPjName(inq?.pjData);
      const bedroom = parseInt(inq?.bedroom) > 0 ? inq?.bedroom + 'PN' : '';
      const bathroom = parseInt(inq?.bathroom) > 0 ? inq?.bathroom + 'WC' : '';
      const fur = transFurniture(inq?.furniture);
      const view = this.viewTranslate(inq?.views);
      return `${name} ${status} ${pjName} ${bedroom} ${bathroom} ${fur}`;
    },
    viewTranslate(views) {
      let view = '';
      if (views.length > 0) {
        views.map(el => {
          view = view + translate(VIEW, el) + ' '
        })
      }
      return view
    },
    getPjName(pjData) {
      let code = '';
      if (pjData.length > 0) {
        pjData.map(pj => {
          code = code + pj.name + ' ';
        })
      }
      return code
    },
    tabHref(id) {
      return `${baseUrl[this.role]}${spDetail}-${id}`;
    },
    urDetail(id) {
      if (!this.assigning) {
        const compName = this.role === Roles.Agent ? A_U_REQUEST_DETAIL : MG_U_REQUEST_DETAIL_URL
        this.$router.push({
          path: `${compName}-${id}` ,
        });
      }
    },
    onFilterData(value) {
      this.finishLoading = false
      const data = {
        project: value.project,
        rent: value.rent,
        status: this.status,
        sorting: "-last_update",
        listLen: this.listLen,
        page: this.currentPage,
        role: this.role,
        ...value.sort,
      };
      this.getUnitRequests(data);
      this.getManagerInqData(data)
    },
    transRequestStt(stt) {
      return translate(U_REQUEST_STT, stt);
    },
    toPage(pageNum) {
      this.currentPage = pageNum;
      if (!this.waitingCreateReq) {
        this.getUnitRequests(this.defaultFilterData());
      } else {
        this.getManagerInqData();
      }
    },
    defaultFilterData() {
      return {
        project: "",
        rent: "",
        status: this.status,
        listLen: this.listLen,
        page: this.currentPage,
        sorting: "-last_update",
        role: this.role,
      };
    },
    async getUnitRequests(filterData) {
      this.finishLoading = false;
      const res = await post("/u_request/get_u_requests_mgmt", {
        ...filterData, ...this.defaultFilter, ...this.filterData,...this.nameSearch
      });
      if (this.assigning) {
        this.assigningReq = res.returnData;
        this.totalResult = res.totalResult;
        this.totalRequest = res.totalResult;
      } else {
        this.processingReq = res.returnData;
        this.totalRequest = res.totalResult;
      }
      this.finishLoading = true;
    },
    onPickedRequest(data) {
      if (this.role === Roles.Manager) {
        this.requestAgentAssign(data.id, data.agentID)
      } else if (this.role === Roles.Agent) {
        this.requestSelfAssign(data.id)
      }
      this.getUnitRequests(this.defaultFilterData())
    },
    async onMnCancelRequest(id) {
      const res = await post('/u_request/u_request_cancel', {
        id: id
      })
      if (res.succeed) {
        await this.getUnitRequests(this.defaultFilterData())
      }
    },
    async requestSelfAssign(id) {
      if (this.assigning) {
        const res = await post("/u_request/u_request_self_assign", {
          id: id,
        });
        if (res && res.succeed) {
          this.totalResult--
        }
      }
    },
    async requestAgentAssign(id, agentID) {
      const res = await post("/u_request/u_request_assign_agent", {
        id: id,
        agent: agentID
      });
      if (res && res.succeed) {
        this.totalResult--
      }
    },
    setStatuses(status) {
      this.status = status;
    },
    onBreadcrumbBackIcon() {
      if (!scrWdtFrom(scrWdtEnum.MD) && this.rightBarShow) {
        this.$refs.pgLayoutComp.showRightBar(false);
        this.rightBarShow = false;
      } else {
        this.$router.back();
      }
    },
    closeRightBarInMb() {
      if (!scrWdtFrom(scrWdtEnum.MD)) {
        this.$refs.pgLayoutComp.showRightBar(false);
      }
    },
    async getUserApi() {
      const res = await post("/dashboard/get_user/", {
        userName: "",
        role: "Agent",
      });
      this.finishLoading = true
      this.agentData = res.users;
    },
    async getManagerInqData(filterData) {
      const res = await post('/u_inquiry/get_manager_inq_create_req_data', {
        status: InqEnum.PROCESSING,
        nonRequest: true,
        page: this.currentPage,
        listLen: 12,
        project: filterData?.project,
        rent: filterData?.rent,
        sorting: '-init_time',
        fromDate: this.fromDate,
        toDate: this.toDate
      })
      this.inqData = res.returnData;
      this.totalInq = res.totalResult;
    },
    getUserExtData(data, dataName, defValue) {
      return (data?.extData && data?.extData.length > 0) ? data?.extData[0][dataName] : defValue;
    },
    getInqData(data) {
      const rentStatus = data.rent ? 'Thuê ' : 'Mua '
      const price = convertVndToUserCurrency(data.ceilingPrice, data.rent, UnitCurrency.simple)
      const bedroom = parseInt(data?.bedroom) > 0 ? data?.bedroom + 'PN ' : ' '
      let code = ''
      if (data.pjData && data.pjData.length > 0) {
        data.pjData.map(pj => {
          code = code + pj.name + ' '
        })
      }
      const views = data.views.length ? ` View ${viewsTranslate(data.views)}` : ''
      return rentStatus + code + bedroom + price + views
    },
    async onSetAgentRequest(data) {
      this.finishLoading = false
      const res = await post('/u_request/create_u_request', {
        inqId: data?.id,
        agentId: data?.agentID
      })
      if (res) {
        this.finishLoading = true
        await this.getManagerInqData({project: '', rent: ''})
      }
    },
    setDefaultTab() {
      if (this.notInitialized === 'true') {
        this.waitingCreateReq = true
        this.assigning = ''
        this.pgMeta["enableRB"] = true
        this.rightBarShow = scrWdtFrom(scrWdtEnum.MD)
      }
    },
    onSimpleFilter(field, val) {
      if (val && (field === 'bedroom' || field === 'furniture')) {
        this.filterData[field] = (val === this.filterData[field]) ? '' : val
      } else if (val && field === 'rentingPriceTo') {
        this.filterData.toPrice = val
      } else if (val && field === 'rentingPriceFrom') {
        this.filterData.fromPrice = val
      }
      this.getUnitRequests(this.defaultFilterData())
    },
    onSearchName(val)
    {
      if(this.role === Roles.Manager)
      {
        this.nameSearch.sAName = val
      }
      else {
        this.nameSearch.sName = val
      }
      this.getUnitRequests(this.defaultFilterData())
    }
  },
  watch: {
    pickingAgent(){
      this.getUnitRequests(this.defaultFilterData());
    },
  },
  async mounted() {
    const status = this.defaultStt === '' ? URequestSttEnum.PROCESSING : this.defaultStt
    this.setDefaultTab()
    this.setStatuses(status)
    await this.getUnitRequests(this.defaultFilterData());
    await this.getUserApi()
    await this.getManagerInqData()
    if (parseInt(this.totalResult) === 0 && !this.waitingCreateReq) {
      await this.onFilteredStatusUr(false, URequestSttEnum.PROCESSING)
    }
  },
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
