<template>
  <div class="row mt-4">
    <div class="col-3">
      <label class="small">Đến ngày</label>
      <input v-model="toDate" id="toDay" class="form-control" type="date"/>
    </div>
  </div>

  <div class="p-2 mt-5">
    <h2 class="text-title"> Số căn hộ cần gọi hôm nay đến {{ ddMmYyyy(toDate) }} </h2>
  </div>
  <table class="table mt-2">
    <thead class="thead-light">
    <tr>
      <th class="col-3">Dự Án</th>
      <th>Số lượng căn hộ</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(data,index) in restockData" :key="index" :class="{'bg-white': index % 2 === 0}">
      <td>
        {{ data.project__name }}
      </td>
      <td>
        {{ data.totalCall }}
      </td>
    </tr>
    </tbody>
  </table>
  <div class="p-2 mt-5">
    <h2 class="text-title"> Số căn hộ có thể gọi hiện tại </h2>
  </div>
  <table class="table mt-2">
    <thead class="thead-light">
    <tr>
      <th class="col-3">Dự Án</th>
      <th>Số lượng căn hộ</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(data,index) in availUnitData" :key="index" :class="{'bg-white': index % 2 == 0}">
      <td>
        {{ data.project__name }}
      </td>
      <td>
        {{ data.totalCall }}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import {getCompareValue, post} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {ddMmYyyy, defaultDayInput} from "@/utils/dateTimeUtils";
import {diffDays} from "@/utils/utils";

export default {
  components: {},
  data() {
    return {
      restockData: [],
      availUnitData: [],
      project: "",
      toDate: "",
      // Translator
      projects: [],
    }
  },
  computed: {

  },
  props: {},
  methods: {
    ddMmYyyy,
    async getTeleCallableCount() {
      const res = await post("/dashboard/get_tele_callable_count", {})
      this.availUnitData = res.returnData;
    },
    async getTeleRestockData() {
      const res = await post("/dashboard/get_tele_call_restock", {
        restocking: diffDays(this.toDate) - 1,
        validOnly: true,
      })
      this.restockData = res.returnData;
    },
    async getDataLib() {
      const res = await getCompareValue([DataLibType.projects]);
      this.projects = res.projects;
    },
  },
  watch: {
    toDate(val){
      this.getTeleRestockData();
    },
  },
  mounted() {
    this.toDate = defaultDayInput(30);
    this.getDataLib();
    this.getTeleCallableCount();
    this.getTeleRestockData();
  }
}
</script>

<style scoped>
</style>
