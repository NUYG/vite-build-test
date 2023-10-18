<template>
  <div class="row mt-4">

    <div class="col-3 mt-auto">
      <label class="small">Sales</label>
      <input v-model="filterSales.usernameSearch" class="form-control" type="text"/>
    </div>

    <div class="col-3">
      <label class="small">Từ ngày</label>
      <input v-model="filterSPS.signingFrom" class="form-control" type="date"/>
    </div>
    <div class="col-3">
      <label class="small">Đến ngày</label>
      <input v-model="filterSPS.signingTo" id="toDay" class="form-control" type="date"/>
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
      <!--      <th scope="col"> Dự án</th>-->
      <th scope="col"> Sales</th>
      <th scope="col"> Sales đã liên kết</th>
      <th scope="col"> Số giao dịch</th>
    </tr>
    </thead>
    <tbody v-for="(salesData, index) in refDataArr" :key="index">
    <tr :class="{'bg-white': index % 2 === 0}">
      <td> {{ salesData.username }}</td>
      <td>
        <tr v-for="(refData, smIndex) in salesData.refData" :class="{'bg-white': smIndex % 2 === 0}">
          <td> {{ refData.username }}</td>
        </tr>
      </td>
      <td>
        <tr v-for="(refData, smIndex) in salesData.refData" :class="{'bg-white': smIndex % 2 === 0}">
          <td> {{ refData.totalDeal }}</td>
        </tr>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import {getCompareValue, post} from "@/utils/dataQuery";
import {translate} from "@/utils/utils";
import {fixDateTime} from "@/utils/dateTimeUtils";
import {SPSttEnum, U_REQUEST_STT} from "@/utils/TransContent";
import {DataLibType} from "@/utils/dataLib";

export default {
  components: {},
  data() {
    return {
      refDataArr: [],
      totalItems: 3,
      // Filter
      filterSales: {
        usernameSearch: "",
      },
      filterSPS: {
        signingFrom: "",
        signingTo: "",
        status: SPSttEnum.DONE,
      },
      // Data for filter
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
    async dataFilter() {
      const res = await post("/dashboard/get_user_refs_data", {
        filterSales: this.filterSales,
        filterSPS: this.filterSPS,
      })
      this.refDataArr = res.returnData;
      this.totalItems = res.totalResult;
    },
    async getDataLib() {
      const res = await getCompareValue([DataLibType.projects]);
      this.projects = res.projects;
    },
  },
  mounted() {
    this.dataFilter();
    this.getDataLib();
  }
}
</script>

<style scoped>
</style>
