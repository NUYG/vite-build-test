<template>
  <div class="row mt-4">
    <div class="col-3 mt-auto">
      <label class="small">Username, tên, SĐT</label>
      <input v-model="filterSales.namePhoneSearch" class="form-control" type="text"/>
    </div>

    <div class="col-3 mt-auto">
      <label class="small">Role</label>
      <select v-model="filterSales.role" class="form-control-plaintext border border-1">
        <option value=''>Tất cả</option>
        <option v-for="(role, index) in Object.values(Roles)" :key="index" :value="role">{{ role }}</option>
      </select>
    </div>

    <div class="col-3">
      <label class="small">Từ ngày</label>
      <input v-model="filterSales.signingFrom" class="form-control" type="date"/>
    </div>
    <div class="col-3">
      <label class="small">Đến ngày</label>
      <input v-model="filterSales.signingTo" id="toDay" class="form-control" type="date"/>
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
      <th scope="col"> Tên</th>
      <th scope="col"> Hoạt động lần cuối</th>
      <th scope="col"> Thời gian sử dụng</th>
    </tr>
    </thead>
    <tbody v-for="(salesData, index) in refDataArr" :key="index">
    <tr :class="{'bg-white': index % 2 === 0}">
      <td> {{ salesData.username }}</td>
      <td>
        {{ salesData.firstName }}
      </td>
      <td>
        {{ getFullDateTime(salesData.lastActive) }}
      </td>
      <td>
        {{ formatTime(salesData.ttOnlineTime) }}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import {getCompareValue, post} from "@/utils/dataQuery";
import {translate} from "@/utils/utils";
import {fixDateTime, getFullDateTime} from "@/utils/dateTimeUtils";
import {SPSttEnum, U_REQUEST_STT} from "@/utils/TransContent";
import {DataLibType} from "@/utils/dataLib";
import {Roles} from "@/utils/constants";

export default {
  components: {},
  data() {
    return {
      refDataArr: [],
      totalItems: 3,
      // Filter
      filterSales: {
        namePhoneSearch: "",
        signingFrom: "",
        signingTo: "",
        role: '',
        sorting: '-last_login',
      },
      // Data for filter
      projects: [],
      U_REQUEST_STT,
      Roles,
    }
  },
  props: {},
  methods: {
    getFullDateTime,
    fixDateTime,
    transStatus(status) {
      return translate(U_REQUEST_STT, status);
    },
    async dataFilter() {
      const res = await post("/dashboard/get_user_stats_data", {
        ...this.filterSales,
      })
      this.refDataArr = res.returnData;
      this.totalItems = res.totalResult;
    },
    async getDataLib() {
      const res = await getCompareValue([DataLibType.projects]);
      this.projects = res.projects;
    },
    formatTime(totalSeconds) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hours > 0) {
        return `${hours} giờ ${minutes} phút ${seconds} giây`;
      } else if (minutes > 0) {
        return `${minutes} phút ${seconds} giây`;
      } else {
        return `${seconds} giây`;
      }
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
