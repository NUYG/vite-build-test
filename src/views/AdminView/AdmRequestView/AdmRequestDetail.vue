<template>
  <div class="row mt-4">
    <div class="col-3 mt-auto">
      <label class="small">Dự Án</label>
      <select v-model="filterData.project" class="form-control-plaintext border border-1">
        <option value="" selected>Tất cả</option>
        <option v-for="(pj, index) in projects" :key="index" :value="pj.id">{{ pj.name }}</option>
      </select>
    </div>
    <div class="col-3 mt-auto">
      <label class="small">Nhu cầu</label>
      <select v-model="filterData.rent" class="form-control-plaintext border border-1">
        <option value="">Tất cả</option>
        <option :value="true">Thuê</option>
        <option :value="false">Bán</option>
      </select>
    </div>

    <div class="col-3 mt-auto">
      <label class="small">Tình trạng</label>
      <select v-model="filterData.status" class="form-control-plaintext border border-1  ">
        <option value="">Tất cả</option>
        <option v-for="(value, index) in U_REQUEST_STT"
                :value="value[0]" :key="index">{{ value[1] }}
        </option>
      </select>
    </div>

    <div class="col-3 mt-auto">
      <label class="small">Agent</label>
      <select v-model="filterData.agent" class="form-control-plaintext border border-1">
        <option value=''>Tất cả</option>
        <option v-for="(a, index) in agentData" :key="index" :value="a.id">{{ a.username }}</option>
      </select>
    </div>
    <div class="col-3 mt-auto">
      <label class="small">Sales</label>
      <select v-model="filterData.sales" class="form-control-plaintext border border-1">
        <option value=''>Tất cả</option>
        <option v-for="(s, index) in salesData" :key="index" :value="s.id">{{ s.username }}</option>
      </select>
    </div>

    <div class="col-3">
      <label class="small">Từ ngày</label>
      <input v-model="filterData.fromDate" class="form-control" type="date"/>
    </div>
    <div class="col-3">
      <label class="small">Đến ngày</label>
      <input v-model="filterData.toDate" id="toDay" class="form-control" type="date"/>
    </div>

    <div class="col-3 mt-3">
      <input type="submit" @click="dataFilter" class="btn btn-primary" value="Lọc"/>
    </div>
  </div>
  <p class="mt-5">
    Đã lọc được {{ totalItems }} kết quả
  </p>
  <table class="table mt-4 ">
    <thead class="thead-light">
    <tr>
      <th scope="col"> Dự án</th>
      <th scope="col"> Nhu cầu</th>
      <th scope="col"> Tình trạng</th>
      <th scope="col"> Căn đã chọn</th>
      <th scope="col"> Đã tạo giao dịch</th>
      <th scope="col"> Agent</th>
      <th scope="col"> Môi giới</th>
    </tr>
    </thead>
    <tbody v-for="(data, index) in requestData" :key="index">
    <tr :class="{'bg-white': index % 2 === 0}">
      <td> {{ data.projectsName }}</td>
      <td>
        <div v-show="data.rent">Thuê</div>
        <div v-show="!data.rent">Bán</div>
      </td>
      <td> {{ transStatus(data.status) }}</td>
      <td>
        <span v-if="data.tt_picked_units">{{ data.tt_picked_units }} </span>
      </td>
      <td>
        <span v-if="data.tt_paired_units">{{ data.tt_paired_units }} </span>
      </td>
      <td>
        <span v-if="data.agentData"> {{ data.agentData.first_name }} </span>
      </td>
      <td> {{ data.salesData.first_name }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import {getCompareValue, post} from "@/utils/dataQuery";
import {translate} from "@/utils/utils";
import {fixDateTime} from "@/utils/dateTimeUtils";
import {U_REQUEST_STT} from "@/utils/TransContent";
import {DataLibType} from "@/utils/dataLib";

export default {
  components: {},
  data() {
    return {
      requestData: [],
      totalItems: 3,
      // Filter
      filterData: {
        project: "",
        rent: "",
        status: "",
        agent: "",
        sales: "",
        fromDate: "",
        toDate: "",
      },
      // Data for filter
      agentData: [],
      salesData: [],
      projects: [],
      U_REQUEST_STT,
    }
  },
  props: {},
  methods: {
    fixDateTime,
    transStatus(status) {
      return translate(U_REQUEST_STT, status);
    },
    async getSalesApi() {
      const res = await post("/dashboard/get_user/", {
        userName: "",
        role: "Sales",
      })
      this.salesData = res.users;
    },
    async getAgentApi() {
      const res = await post("/dashboard/get_user/", {
        userName: "",
        role: "Agent",
      })
      this.agentData = res.users;
    },
    async dataFilter() {
      const res = await post("/dashboard/get_u_requests_stats", {
        ...this.filterData
      })
      this.requestData = res.returnData;
      this.totalItems = res.totalResult;
    },
    async getDataLib() {
      const res = await getCompareValue([DataLibType.projects]);
      this.projects = res.projects;
    },
  },
  mounted() {
    this.dataFilter();
    this.getSalesApi();
    this.getAgentApi();
    this.getDataLib();
  }
}
</script>

<style scoped>
</style>
