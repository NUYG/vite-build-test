<template>
  <div class="row mt-4">
    <div class="col-2 col-xl-3 mt-auto">
      <label class="small">Nguồn khách hàng</label>
      <select v-model="source" class="form-control-plaintext border border-1">
        <option value=""> Tất cả</option>
        <option v-for="(cus, index) in CUSTOMER_SOURCE" :value="cus[0]" :key="index">{{ cus[1] }}</option>
      </select>
    </div>
    <div class="col-2 col-xl-3 mt-auto">
      <label class="small">Người thêm</label>
      <select v-model="user" class="form-control-plaintext border border-1">
        <option value="">Tất cả</option>
        <option v-for="(sale, index) in sales" :key="index" :value="sale.id">{{ sale.username }}</option>
      </select>
    </div>
    <div class="col-2 col-xl-3">
      <label class="small">Từ ngày</label>
      <input v-model="fromDate" id="fromDay" class="form-control" type="date"/>
    </div>
    <div class="col-2 col-xl-3">
      <label class="small">Đến ngày</label>
      <input v-model="toDate" id="toDay" class="form-control" type="date"/>
    </div>
    <div class="col-2 col-xl-3 mt-auto">
      <label class="small">Độ dài</label>
      <input type="number" class="form-control" pattern="\d*" v-model="listLen">
    </div>
    <div class="col-2 col-xl-3 mt-auto">
      <input type="submit" @click="inquiryFilter" class="btn btn-primary" value="Lọc"/>
    </div>
    <p class="mt-5">
      Đã lọc được {{ totalItems }} kết quả
    </p>
    <div>
      <table class="table mt-4 ">
        <thead class="thead-light">
        <tr>
          <th scope="col">Tên khách hàng</th>
          <th scope="col">SĐT</th>
          <th scope="col">Nguồn</th>
          <th scope="col">Yêu cầu</th>
          <th scope="col">Tình trạng</th>
          <th scope="col">Ngày thêm</th>
          <th scope="col">MG</th>
        </tr>
        </thead>
        <tbody v-for="(data,index) in inquiries" :key="index">
        <tr :class="{'bg-white': index % 2 === 0}">
          <td>
            {{ data.name }}
          </td>
          <td>{{ data.phone }}</td>
          <td>
            {{ transCusSource(data.source) }}
          </td>
          <td>{{ data.totalInquiries }}</td>
          <td>{{ customerStt(data.active) }}</td>
          <td>{{ fixDateTime(data.init_time) }}</td>
          <td>{{ data.userData?.first_name }}</td>
        </tr>
        </tbody>
      </table>
    </div>
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
import {fixDateTime} from "@/utils/dateTimeUtils";
import FPPaginator from "@/components/Misc/FPPaginator.vue";
import {CONTACTOR_STATUS, CUSTOMER_SOURCE, FURNITURE, POINTING, UNIT_STATUS} from "@/utils/TransContent";

export default {
  components: {
    FPPaginator,
  },
  data() {
    return {
      inquiries: [],
      source: "",
      fromDate: "",
      toDate: "",
      user: "",
      sales: [],
      listLen: 20,
      currentPage: 1,
      totalItems: 20,
      projects: [],
      // Trans dict
      POINTING: [],
      FURNITURE: [],
      UNIT_STATUS: [],
      CONTACTOR_STATUS: [],
      CUSTOMER_SOURCE: [],
    }
  },
  props: {},
  methods: {
    fixDateTime,
    customerStt(active) {
      return active ? 'Hoạt động' : '';
    },
    transFurniture(fur) {
      return translate(this.FURNITURE, fur);
    },
    transInquiry(inq) {
      return translate(this.INQUIRY_STATUS, inq);
    },
    transStatus(status) {
      return translate(this.UNIT_STATUS, status);
    },
    transCusSource(status) {
      return translate(this.CUSTOMER_SOURCE, status);
    },
    toPage(pageNum) {
      this.currentPage = pageNum;
      this.inquiryFilter();
    },
    async getUserApi() {
      const res = await post("/dashboard/get_user/", {
        userName: "",
        role: "Sales",
      })
      this.sales = res.users;
    },
    async inquiryFilter() {
      const res = await post("/sales/get_customers", {
        user: this.user,
        type: "customer",
        selfStats: false,
        fromInitDate: this.fromDate,
        toInitDate: this.toDate,
        listLen: this.listLen,
        page: this.currentPage,
        source: this.source,
        exNoneUser: true,
      })
      this.inquiries = res.filteredCustomer;
      this.totalItems = res.totalCustomers;
    },
    async getDataLib() {
      const res = await getCompareValue([DataLibType.projects]);
      this.projects = res.projects;
      this.UNIT_STATUS = UNIT_STATUS;
      this.FURNITURE = FURNITURE;
      this.POINTING = POINTING;
      this.CONTACTOR_STATUS = CONTACTOR_STATUS;
      this.CUSTOMER_SOURCE = CUSTOMER_SOURCE;
    },
  },
  mounted() {
    this.inquiryFilter();
    this.getUserApi();
    this.getDataLib();
  }
}
</script>

<style scoped>
</style>
