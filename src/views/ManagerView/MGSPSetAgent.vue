<template>
  <FpDefLayout
      :bc-props="pgMeta"
      ref="pgLayoutComp"
      :is-loading="!finishLoading"
      :show-loading="true">
    <template #comp>


      <div class="row">
        <div class="p-4 col-12">
          <div class="row justify-content-between mt-3">
            <div class="d-none d-lg-flex col-md-10 col-lg-8 d-flex justify-content-around text-content text-gray">
            </div>
            <div class="col-md-4 d-flex d-lg-none">
            </div>
            <div class="col-auto col-md-3 col-lg-2 text-gray d-flex justify-content-end">
              <span class="text-content">{{ totalResult }} kết quả</span>
            </div>
          </div>
          <div class="row mt-4">
            <div v-for="(data, index) in processData" :key="index"
                 :class="{'col-lg-4 col-xl-4 col-sm-6 col-md-6 ':rBarShowing, 'col-lg-3 col-xl-3  col-md-4 ' :!rBarShowing }">
              <div class="p-3 mt-4" style="border-radius: 8px;border: none;background-color: rgb(247,249,251);">
                <div>
                  <div class="row p-2 d-flex align-items-center">
                    <span :style="{'background-color':data.unitData.pjData.projectColor}" class="border-rounded"
                          style="height: 8px;width: 28px;border-radius: 20px;margin-left: 3px; "></span>
                    <div class="col px-0">
                      <span :class="data.rent ? 'rent-color ' : 'sell-color'" class="dot"
                            style="margin-top: auto; margin-left: 5px;"></span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <div>
                        <div style="font-weight: 600" class="text-title">{{ data.customerName }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="row mt-2">
                    <div class="col-lg-7 col-md-12 d-flex">
                      <img alt=""
                           style="padding: 0; height: 20px;width: 20px;margin-right: 10px;"
                           :src="getIconUrl('Swap.svg')"/>
                      <span class="text-content">{{ data.unitData?.unit_code }}</span>
                      <span class="text-content">{{ data.unitData.unitCode }}</span>
                    </div>

                    <div class="col-lg-5 col-md-12 d-flex justify-content-lg-end mt-md-2 mt-lg-0">
                      <b class="text-content">

                        {{  convertVndToUserCurrency(unitPrice(data.rent, data.unitData),data.rent,UnitCurrency.simple)}}
                        </b>
<!--                      <b class="text-content"-->
<!--                         v-show="!data.rent && data.unitData.sellingPrice > 0">{{-->
<!--                          fixedPrice(data.unitData.sellingPrice)-->
<!--                        }}-->
<!--                        Tỷ</b>-->
                    </div>
                  </div>
                  <div class="text-content mt-2 text-gray" v-if="data?.cusData?.name">Khách hàng:
                    {{ data?.cusData?.name }}
                  </div>
                  <div class="row d-flex" v-if="isManager">
                    <div class="text-content text-gray col-10">Sales: {{ data.salesData.first_name }}</div>
                  </div>
                  <div class="row mt-3 d-flex">
                    <label class="col-4">Agent: </label>
                    <div class="col-8 mt-auto">
                      <select v-model="data.agentData" class="form-control-plaintext border border-1">
                        <option :value="null"> Chưa ghép</option>
                        <option v-for="(ag, index) in agent" :key="index" :value="ag.id">{{ ag.username }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="mt-4 d-flex justify-content-around mt-2 mb-4">
                    <div class="col-6" v-show="data.agentData==null">
                      <button @click="handleCancelPermission(data.id)"
                              class="w-100 btn-wrap-text gray-button textBoldHover">
                        <small>Từ chối</small>
                      </button>
                    </div>
                    <div class="col-5" v-show="data.agentData!=null">
                      <button @click="permissionAgent(data.agentData,data.id)"
                              class="w-100 btn-wrap-text gray-button textBoldHover">
                        <small>Phân quyền</small>
                      </button>
                    </div>
                  </div>
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
            ></FPPaginator>
          </div>
        </div>
      </div>
    </template>

    <template #rightBar>
      <SPSFilter
          @filterData="filterData"
          :role="role"
          :statusFilter="false"
      />
    </template>
  </FpDefLayout>
</template>

<script>

import {floatFixed, getIconUrl, translate} from "@/utils/utils";
import {goToURL} from "@/utils/utils";
import {getCompareValue, post} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {Roles} from "@/utils/constants";
import FPPaginator from "@/components/Misc/FPPaginator.vue";
import SPSFilter from "@/views/CommonView/SPSFilter.vue";
import FpDefLayout from "@/views/FpDefLayout.vue";
import {breadcrumpProp} from "@/models/customProp";
import {defineComponent} from "vue";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";
import {unitPrice} from "@/utils/unit";

export default defineComponent({
  components: {
    FPPaginator,
    SPSFilter,
    FpDefLayout,
  },
  data() {
    return {
      processData: {},
      totalResult: 0,
      listLen: 12,
      currentPage: 1,
      page: 1,
      currentStatus: "",
      finishLoading: false,
      statuses: ["waiting"],
      dropStatus: "",
      agent: "",
      role: Roles.Manager,
      // Trans dict
      SALE_PROCESS_STATUS: [],
      Roles,
      // Meta
      pgMeta: {
        [breadcrumpProp.enableRB]: true,
        [breadcrumpProp.title]:'Phân quyền'
      },
    }
  },
  props: {},
  computed: {
    UnitCurrency() {
      return UnitCurrency
    },
    isManager() {
      return this.role === Roles.Manager;
    },
    rBarShowing() {
      return true
    },
  },
  methods: {
    unitPrice, convertVndToUserCurrency,
    getIconUrl,
    goToURL,
    async permissionAgent(agentId, id) {
      this.finishLoading = false
      const res = await post("/sale_process/sp_set_agent_api", {
        agent: agentId,
        id: id,
        role: "Manager",
        validate: {},
      });
      if (!res) {
        return;
      }
      if (res.succeed) {
        await this.getSaleProcess(this.defaultFilterData());
        this.finishLoading = true
      }
    },
    async handleCancelPermission(id) {
      const res = await post("/sale_process/manager_sp_cancel", {
        role: "Manager",
        id: id,
      });
      if (!res) {
        return;
      }
      if (res.succeed) {
        await this.getSaleProcess(this.defaultFilterData());
      }
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
    setCurrentSt(status) {
      this.currentStatus = status;
      if (status === "") {
        this.statuses = [];
      } else {
        this.statuses = status.split(",");
      }
      this.getSaleProcess(this.defaultFilterData());
    },
    filterData(value) {
      const data = {
        project: value.project,
        rent: value.rent,
        statuses: ['waiting'],
        sNotify: value.sNotify,
        listLen: this.listLen,
        page: this.currentPage,
        role: this.role,
        selfItems: true,
        ...value.sort,
      };
      // this.role !== Roles.Sales
      //     ? (data.aSearch = value.search)
      //     : (data.cusNamePhone = value.search);
      this.getSaleProcess(data);
    },
    transProcessSt(stt) {
      return translate(this.SALE_PROCESS_STATUS, stt);
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
    },
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.SALE_PROCESS_STATUS]
      );
      this.SALE_PROCESS_STATUS = res.SALE_PROCESS_STATUS;
    },
    defaultFilterData() {
      const data = {
        project: "",
        rent: "",
        statuses: this.statuses,
        sNotify: false,
        listLen: this.listLen,
        page: this.currentPage,
        sort: "-last_update",
        role: this.role,
        selfItems: true,
      };
      this.role !== Roles.Sales
          ? (data.aSearch = this.search)
          : (data.cusNamePhone = this.search);
      return data;
    },
    async getSaleProcess(filterData) {
      // this.finishLoading = false
      const res = await post("/sale_process/get_sale_processes", filterData)
      this.processData = res.saleProcesses;
      this.totalResult = res.totalResult;
      this.finishLoading = true
    },
    async getUserApi() {
      const res = await post("/dashboard/get_user/", {
        userName: "",
        role: "Agent",
      });
      this.finishLoading = true
      this.agent = res.users;
    },
  },
  watch: {
    dropStatus(val) {
      if (val === "") {
        this.statuses = val;
      } else {
        this.statuses = val.split(",");
      }
      this.getSaleProcess(this.defaultFilterData());
    },
  },
  mounted() {
    this.getDataLib();
    this.getSaleProcess(this.defaultFilterData());
    this.getUserApi();
  }
})
</script>

<style scoped>
</style>

