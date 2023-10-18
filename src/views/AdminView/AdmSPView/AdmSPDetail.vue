<template>
  <div class="row mt-4">
    <div class="col-3 mt-auto">
      <label class="small">Dự Án</label>
      <select v-model="project" class="form-control-plaintext border border-1">
        <option value="" selected>Tất cả</option>
        <option v-for="(pj, index) in projects" :key="index" :value="pj.id">{{ pj.name }}</option>
      </select>
    </div>
    <div class="col-3 mt-auto">
      <label class="small">Nhu cầu</label>
      <select v-model="rent" class="form-control-plaintext border border-1">
        <option value="">Tất cả</option>
        <option :value="true">Thuê</option>
        <option :value="false">Bán</option>
      </select>
    </div>

    <div class="col-3 mt-auto">
      <label class="small">Tình trạng</label>
      <select v-model="peakStt" class="form-control-plaintext border border-1  ">
        <option value="">Tất cả</option>
        <option v-for="(value, key, index) in SP_STATUS_AD_SELL"
                v-show="key !== 'ownCanceled' && key !== 'cusCanceled'" :value="key" :key="index">{{
            value
          }}
        </option>
      </select>
    </div>
    <div class="col-3 mt-auto">
      <label class="small"> Lọc hủy: </label>
      <select v-model="status" class="form-control-plaintext border border-1">
        <option value="" selected>Không lọc</option>
        <option v-for="(value, key, index) in SP_STATUS_AD_SELL" :key="index"
                v-show="key === 'ownCanceled' || key === 'cusCanceled'" :value="key"> {{ value }}
        </option>
      </select>
    </div>

    <div class="col-3 mt-auto">
      <label class="small">Agent</label>
      <select v-model="agent" class="form-control-plaintext border border-1">
        <option value=''>Tất cả</option>
        <option v-for="(a, index) in agentData" :key="index" :value="a.id">{{ a.username }}</option>
      </select>
    </div>
    <div class="col-3 mt-auto">
      <label class="small">Sales</label>
      <select v-model="sales" class="form-control-plaintext border border-1">
        <option value=''>Tất cả</option>
        <option v-for="(s, index) in salesData" :key="index" :value="s.id">{{ s.username }}</option>
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
      <th scope="col"> Mã căn</th>
      <th scope="col"> Nhu cầu</th>
      <th scope="col"> Tình trạng</th>
      <th scope="col"> TT Hủy</th>
      <th scope="col"> Ngày xem nhà</th>
      <th scope="col"> Ngày cọc</th>
      <th scope="col"> Ngày ký HĐ</th>
      <th scope="col"> Agent</th>
      <th scope="col"> Môi giới</th>
    </tr>
    </thead>
    <tbody v-for="(data, index) in saleProcesses" :key="index">
    <tr :class="{'bg-white': index % 2 === 0}">
      <td> {{ data.unitCode }}</td>
      <td>
        <div v-show="data.rent">Thuê</div>
        <div v-show="!data.rent">Bán</div>
      </td>
      <td> {{ transProcessStatus(data.peakStatus, data.rent) }}</td>
      <td> {{ cancelStt(data.status) }}</td>
      <td>
        <span v-if="data.scoutingDate">{{ fixDateTime(data.scoutingDate) }} </span>
      </td>
      <td>
        <span v-if="data.depositDate">{{ fixDateTime(data.depositDate) }} </span>
      </td>
      <td>
        <span v-if="data.signingDate">{{ fixDateTime(data.signingDate) }} </span>
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
import {dictTranslate} from "@/utils/utils";
import {DataLibType} from "@/utils/dataLib";
import {fixDateTime} from "@/utils/dateTimeUtils";

export default {
  components: {},
  data() {
    return {
      saleProcesses: [],
      project: "",
      rent: "",
      status: "",
      peakStt: "",
      agent: "",
      sales: "",
      fromDate: "",
      toDate: "",
      agentData: [],
      salesData: [],
      totalItems: 3,
      projects: [],
      // Trans dict
      SP_STATUS_AD_SELL: {},
      SP_STATUS_AD_RENT: {},
    }
  },
  props: {},
  methods: {
    fixDateTime,
    transProcessStatus(status, rent = false) {
      const dict = rent ? this.SP_STATUS_AD_RENT : this.SP_STATUS_AD_SELL;
      return dictTranslate(dict, status);
    },
    cancelStt(stt) {
      return ['ownCanceled', 'cusCanceled'].includes(stt) ? this.transProcessStatus(stt) : '';
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
      const res = await post("/sale_process/get_sp_detail_admin", {
        project: this.project,
        rent: this.rent,
        status: this.status,
        peakStt: this.peakStt,
        agent: this.agent,
        sales: this.sales,
        lastUpFrom: this.fromDate,
        lastUpTo: this.toDate,
      })
      this.saleProcesses = res.returnData;
      this.totalItems = res.totalResult;
    },
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.projects, DataLibType.SP_STATUS_AD_SELL,
        DataLibType.SP_STATUS_AD_RENT]
      );
      this.projects = res.projects;
      this.SP_STATUS_AD_SELL = res.SP_STATUS_AD_SELL;
      this.SP_STATUS_AD_RENT = res.SP_STATUS_AD_RENT;
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
