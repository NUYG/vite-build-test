<template>
  <div class="row mt-4">
    <div class="col-3 mt-auto">
      <label class="small">Telesales</label>
      <select v-model="user" class="form-control-plaintext border border-1">
        <option value=''>Tất cả</option>
        <option v-for="(tele, index) in teles" :key="index" :value="tele.id">{{ tele.username }}</option>
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
      <input type="submit" @click="getCallHistory" class="btn btn-primary" value="Lọc"/>
    </div>
  </div>
  <div class="row mt-4">
    <table class="table table-striped">
      <thead class="thead-light ">
      <tr class="small">
        <th class="col-2"></th>
        <th class="col-1" v-for="(statName, index) in Object.values(tableHeader)" :key="index">{{ statName }}</th>
        <th class="col"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(data, pjName, index) in callStats" :key="index" v-show="transStatus(pjName) !== ''">
        <th scope="row">{{ transStatus(pjName) }}</th>
        <td v-for="(callNum, index) in Object.values(data)" :key="index">{{ callNum }}</td>
        <td></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {getCompareValue, post} from "@/utils/dataQuery";
import {translate} from "@/utils/utils";
import {DataLibType} from "@/utils/dataLib";
import {defaultFromDateInput, fixDateTime, defaultTomorrowInput} from "@/utils/dateTimeUtils";

export default {
  components: {},
  data() {
    return {
      callStats: {},
      // Filter
      user: "",
      fromDate: "",
      toDate: "",
      teles: [],
      // Trans dict
      UNIT_STATUS: [],
    }
  },
  computed: {
    tableHeader() {
      let keys = Object.keys(this.callStats);
      if (Object.keys(this.callStats).length !== 0) {
        let firstData = this.callStats[keys[0]];
        return Object.keys(firstData);
      }
      return {};
    },
  },
  props: {},
  methods: {
    fixDateTime,
    transStatus(status) {
      return translate(this.UNIT_STATUS, status, '');
    },
    async getUserApi() {
      const res = await post("/dashboard/get_user/", {
        userName: "",
        role: "Telesale",
      })
      this.teles = res.users;
    },
    async getCallHistory() {
      const res = await post("/dashboard/get_tele_call_stats", {
        user: this.user,
        fromDate: this.fromDate,
        toDate: this.toDate,
        role: "Telesale",
      })
      this.callStats = res.callStats;
    },
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.UNIT_STATUS]
      );
      this.UNIT_STATUS = res.UNIT_STATUS;
    },
  },
  mounted() {
    this.toDate = defaultTomorrowInput();
    this.fromDate = defaultFromDateInput();
    this.getCallHistory();
    this.getUserApi();
    this.getDataLib();
  }
}
</script>

<style scoped>
</style>
