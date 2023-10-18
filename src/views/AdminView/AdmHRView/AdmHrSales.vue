<template>
  <div class="row mt-4">
    <div class="col-3 mt-auto">
      <label class="small">Sales</label>
      <select v-model="user" class="form-control-plaintext border border-1">
        <option value=''>Tất cả</option>
        <option v-for="(sales, index) in salesData" :key="index" :value="sales.id">{{ sales.username }}</option>
      </select>
    </div>
    <div class="col-3">
      <label class="small">Từ ngày</label>
      <input v-model="fromDate" class="form-control" type="date"/>
    </div>
    <div class="col-3">
      <label class="small">Đến ngày</label>
      <input v-model="toDate" id="toDay" class="form-control" type="date"/>
    </div>
    <div class="col-3 mt-auto">
      <label class="small">Độ dài</label>
      <select v-model="listLen" class="form-control-plaintext border border-1">
        <option :value="10"> 10 hàng</option>
        <option :value="20"> 20 hàng</option>
        <option :value="30"> 30 hàng</option>
      </select>
    </div>

    <div class="col-3 pt-3 mb-n3 form-check form-switch">
      <input
        type="checkbox"
        v-model="dataMode"
        class="form-switch form-switch-xl form-check-input"
        role="switch"
        id="id_data_mode"
      />
    </div>

    <div class="col-3 mt-3">
      <input type="submit" @click="getCommissionData" class="btn btn-primary" value="Lọc"/>
    </div>
  </div>
  <p class="mt-5"></p>
  <table class="table mt-4">
    <thead class="thead-light">
    <tr>
      <th class="col-2">Sales</th>
      <th class="col">Doanh thu</th>
    </tr>
    </thead>
    <tbody v-for="(data,index) in commissionData" :key="index">
    <tr :class="{'bg-white': index % 2 === 0}">
      <td>
        {{ data.sales }}
      </td>
      <td>
        {{ data.commission }} Triệu
      </td>
    </tr>
    </tbody>
  </table>
  <div class="mb-5">
    <div>
      <FPPaginator
        @to-page="toPage"
        :current-page="currentPage"
        :total-item="totalItems"
        :item-per-page="listLen"
      ></FPPaginator>
    </div>
  </div>
</template>

<script>
import {post} from "@/utils/dataQuery";
import {fixDateTime} from "@/utils/dateTimeUtils";
import FPPaginator from "@/components/Misc/FPPaginator.vue";
import {Roles} from "@/utils/constants";

export default {
  components: {
    FPPaginator,
  },
  data() {
    return {
      commissionData: [],
      salesData: [],
      // Filter
      user: "",
      fromDate: "",
      toDate: "",
      dataMode: false,
      listLen: 10,
      currentPage: 1,
      page: 1,
      // Other
      totalItems: 3,
      // Trans dict
      UNIT_STATUS: [],
    }
  },
  props: {},
  methods: {
    fixDateTime,
    toPage(pageNum) {
      this.currentPage = pageNum;
      this.getCommissionData();
    },
    async getUserApi() {
      const res = await post("/dashboard/get_user/", {
        userName: "",
        role: Roles.Sales,
      })
      this.salesData = res.users;
    },
    async getCommissionData() {
      const res = await post("/dashboard/get_sales_commissions_data", {
        fromDate: this.fromDate,
        toDate: this.toDate,
        listLen: this.dataMode ? 999999 : this.listLen,
        page: this.currentPage,
      })
      this.commissionData = res.returnData;
      // console.log(this.commissionData)
    },
  },
  mounted() {
    this.getCommissionData();
    this.getUserApi();
  }
}
</script>

<style scoped>
</style>
