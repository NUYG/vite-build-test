<template>
  <div class="row mt-4">
    <div class="col-2 mt-auto">
      <label class="small">Dự Án</label>
      <select v-model="project" class="form-control-plaintext border border-1">
        <option value="" selected>Tất cả</option>
        <option v-for="(pj, index) in projects" :key="index" :value="pj.id">{{ pj.name }}</option>
      </select>
    </div>

    <div class="col-2 mt-auto">
      <label class="small">Role</label>
      <select v-model="roleFilter" class="form-control-plaintext border border-1">
        <option value="" selected>Tất cả</option>
        <option :value="Roles.Agent" selected>Agent</option>
        <option :value="Roles.AAS" selected>A. Assistant</option>
        <option :value="Roles.Tele" selected>Telesale</option>
      </select>
    </div>

    <div class="col-2 mt-auto">
      <label class="small">Người cập nhật</label>
      <select v-model="user" class="form-control-plaintext border border-1">
        <option value=''>Tất cả</option>
        <option v-for="(tele, index) in teles " :key="index" :value="tele.id">{{ tele.username }}</option>
      </select>
    </div>
    <div class="col-2">
      <label class="small">Từ ngày</label>
      <input v-model="fromDate" class="form-control" type="date"/>
    </div>
    <div class="col-2">
      <label class="small">Đến ngày</label>
      <input v-model="toDate" id="toDay" class="form-control" type="date"/>
    </div>
    <div class="col-12 col-md-8 mt-4">
      <div class="row">
        <div class="col-auto mt-2">
          <button :class="{ 'green-latel' : rentOp===1 }" @click="setRentOp(1)"
                  class="m-auto tab-button rounded w-100 small">Phát sinh thuê
          </button>
        </div>
        <div class="col-auto mt-2">
          <button :class="{ 'red-latel' : sellOp===1 }" @click="setSellOp(1)"
                  class="m-auto tab-button rounded w-100 small">Phát sinh bán
          </button>
        </div>
        <div class="col-auto mt-2">
          <button :class="{ 'green-latel' : rentOp===-1 }" class="m-auto tab-button rounded w-100 small"
                  @click="setRentOp(-1)">Hết nhu cầu thuê
          </button>
        </div>
        <div class="col-auto mt-2">
          <button :class="{ 'red-latel' : sellOp===-1 }" @click="setSellOp(-1)"
                  class="m-auto tab-button rounded w-100 small">Hết nhu cầu bán
          </button>
        </div>
      </div>
    </div>
    <div class="col-auto mt-2 mt-lg-auto">
      <input v-model="search" type="search"
             v-on:keyup.enter="inquiryFilter"
             class="form-control rounded" placeholder="Tìm căn" aria-label="Search"
             aria-describedby="search-addon"/>
    </div>
    <div class="col-auto mt-auto">
      <input type="submit" @click="inquiryFilter" class="btn btn-primary" value="Lọc"/>
    </div>
    <p class="mt-5">
      Đã lọc được {{ totalItems }} kết quả
    </p>
  </div>
  <table class="table mt-4">
    <thead class="thead-light">
    <tr>
      <th>Dự án</th>
      <th class="col-1">Căn</th>
      <th>Ngày cập nhật</th>
      <th>Người cập nhật</th>
      <th>Tình trạng</th>
      <th>Phát sinh</th>
      <th>Hết nhu cầu</th>
      <th>Thay đổi</th>
      <th>Note</th>
    </tr>
    </thead>
    <tbody v-for="(data,index) in filteredCall" :key="index">
    <tr :class="{'bg-white':index%2==0}">
      <td>{{ data.project }}</td>
      <td>
        <span v-for="(code, index) in data.code.substring(data.code.indexOf('-')+1,data.code.length)"
              :key="index">{{ code }}</span>
      </td>
      <td>{{ fixDateTime(data.updateTime) }}</td>
      <td>{{ data.userFirstName }}</td>
      <td>{{ transStatus(data.newStatus) }}</td>
      <td>
        <span v-show="data.rentOp===1">Thuê </span>
        <span v-show="data.sellOp===1"> Bán</span>
      </td>
      <td>
        <span v-show="data.rentOp===-1">Thuê </span>
        <span v-show="data.sellOp===-1"> Bán</span>
      </td>
      <td>
        <tr v-for="(rowSplit, index) in data.updateNote.split('|')" :key="index">
          <td>
            <span>{{ changeUpdate(rowSplit) }}</span>
            <span class="text-gray ">{{ afterChangeUpdate(rowSplit) }}</span>
            <span class="rent-text ">{{ beforeChangeUpdate(rowSplit) }}</span>
          </td>
        </tr>
      </td>
      <td>
        <span v-for="(note, index) in data.note.substring(data.note.indexOf('→')+1,data.note.length)"
              :key="index">{{ note }}</span>
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
import {getCompareValue, post} from "@/utils/dataQuery";
import {translate} from "@/utils/utils";
import {DataLibType} from "@/utils/dataLib";
import {defaultFromDateInput, fixDateTime, defaultTomorrowInput} from "@/utils/dateTimeUtils";
import FPPaginator from "@/components/Misc/FPPaginator.vue";
import {Roles} from "@/utils/constants";

export default {
  computed: {
  },
  components: {
    FPPaginator,
  },
  data() {
    return {
      filteredCall: [],
      project: "",
      user: "",
      roleFilter: '',
      rentOp: 0,
      sellOp: 0,
      fromDate: "",
      toDate: "",
      teles: [],
      listLen: 20,
      page: 1,
      currentPage: 1,
      rentActive: false,
      sellActive: false,
      search: "",
      totalItems: 3,
      projects: [],
      Roles,
      // Trans dict
      UNIT_STATUS: [],
    }
  },
  props: {},
  methods: {
    fixDateTime,
    changeUpdate(str) {
      return str.substring(0, str.indexOf(":") + 1);
    },
    afterChangeUpdate(str) {
      return str.substring(
        str.indexOf(":") + 1, str.indexOf("→") + 1
      );
    },
    beforeChangeUpdate(str) {
      return str.substring(
        str.indexOf("→") + 1, str.length
      );
    },
    transStatus(status) {
      return translate(this.UNIT_STATUS, status);
    },
    setRentOp(num) {
      this.rentOp = this.rentOp === num ? 0 : num;
    },
    setSellOp(num) {
      this.sellOp = this.sellOp === num ? 0 : num;
    },
    toPage(pageNum) {
      this.currentPage = pageNum;
      this.inquiryFilter();
    },
    async getUserApi() {
      const res = await post("/dashboard/get_user/", {
        userName: "",
        role: "",
      })
      this.teles = res.users;
    },
    async inquiryFilter() {
      const res = await post("/telesale/get_call_history/", {
        project: this.project,
        user: this.user,
        rentOp: this.rentOp,
        sellOp: this.sellOp,
        fromDate: this.fromDate,
        toDate: this.toDate,
        listLen: this.listLen,
        page: this.currentPage,
        role: this.roleFilter,
        search: this.search,
      })
      this.filteredCall = res.callHistory;
      this.totalItems = res.totalResult;
    },
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.projects, DataLibType.UNIT_STATUS]
      );
      this.projects = res.projects;
      this.UNIT_STATUS = res.UNIT_STATUS;
    },
  },
  mounted() {
    this.toDate = defaultTomorrowInput();
    this.fromDate = defaultFromDateInput();
    this.inquiryFilter();
    this.getUserApi();
    this.getDataLib();
  }
}
</script>

<style scoped>
</style>
