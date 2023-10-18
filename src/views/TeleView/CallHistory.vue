<template>
   <div class="container-fluid p-4" style="background: #f2f2f2">
      <h2 class="common-title mt-2 "></h2>
      <div class="row">
         <div class="col-3 mt-auto">
            <label class="small">Chọn dự án</label>
            <select v-model="filterData.project" class="form-control-plaintext border border-1">
               <option value="" selected>Tất cả</option>
               <option v-for="(pj, index) in projects" :key="index" :value="pj.id">{{ pj.name }}</option>
            </select>
         </div>
         <div class="col-4">
            <label class="small">Từ ngày</label>
            <input v-model="filterData.fromDate" id="fromDay" class="form-control" type="date"/>
         </div>
         <div class="col-4">
            <label class="small">Đến ngày</label>
            <input v-model="filterData.toDate" id="toDay" class="form-control" type="date"/>
         </div>
         <div class="col-3 mt-auto">
            <label class="small">Tình trạng</label>
            <select v-model="filterData.newStatus" class="form-control-plaintext border border-1">
               <option value="">Tất cả</option>
               <option v-for="(st, index) in UNIT_STATUS" :key="index" :value="st[0]">{{ st[1] }}</option>
            </select>
         </div>
         <div class="col-3 mt-auto">
            <label class="small">Độ dài</label>
            <select v-model="listLen" class="form-control-plaintext border border-1">
               <option :value="5">5 hàng</option>
               <option :value="10"> 10 hàng</option>
               <option :value="15"> 15 hàng</option>
            </select>
         </div>
         <div class="col-3 mt-auto" v-if="selfFilter">
            <label class="small">Lọc riêng mình</label>
            <select v-model="filterData.selfStats" class="form-control-plaintext border border-1">
               <option :value=true>bản thân</option>
               <option :value=false>Tât Cả</option>
            </select>
         </div>
         <div class="col-3 mt-auto">
            <input type="submit" @click="postFilterCall" class="btn btn-primary" value="Lọc"/>
         </div>

      </div>
      <p class="mt-5">
         Trong ngày gần nhất, có {{ totalItems }} căn hộ đã thay đổi.
      </p>

      <div class="row">
         <table class="table">
            <thead class="thead-light">
            <tr class="small">
               <th class="col-1">Mã Căn</th>
               <th class="col-1">Chủ nhà</th>
               <th class="col-1 small">Tình trạng</th>
               <th class="col-2">Thay đổi</th>
               <th class="col-2">Note</th>
               <th class="col-1">Thời gian</th>
               <th class="col-1">Người gọi</th>
            </tr>
            </thead>
            <tbody v-for="(data, index) in filteredCall" :key="index">
            <tr :class="{'bg-white': index % 2 === 0}">
               <td>
                                <span v-for="(afterLine, index) in data.code.substring(0,data.code.indexOf('-'))"
                                      :key="index">{{ afterLine }}</span>
                  <br>
                  <span v-for="(afterLine, index) in data.code.substring(data.code.indexOf('-') + 1, data.code.length)"
                        :key="index">{{ afterLine }}</span>
               </td>
               <td>{{ data.ownerName }}</td>
               <td>
                  <span v-if="data.oldStatus === data.newStatus">{{ transStatus(data.oldStatus) }}</span>
                  <span v-else class="text-gray">{{ transStatus(data.oldStatus) }} → <span
                        class="text-dark">  {{ transStatus(data.newStatus) }}</span></span>
               </td>
               <td>
                  <div v-for="(rowSplit, index) in data.updateNote.split('|')" :key="index">
                     <span>{{ changeUpdate(rowSplit) }}</span>
                     <span class="text-gray ">{{ afterChangeUpdate(rowSplit) }}</span>
                     <span class="rent-text ">{{ beforeChangeUpdate(rowSplit) }}</span>
                     <br>
                  </div>
               </td>
               <td>
                  <span class="text-dark ">{{ beforeChangeUpdate(data.note) }}</span>
               </td>
               <td>{{ fixDateTime(data.updateTime) }}</td>
               <td>{{ data.userFirstName }}</td>
            </tr>
            </tbody>
         </table>
      </div>
      <FPPaginator
            @to-page="toPage"
            :current-page="currentPage"
            :total-item="totalItems"
            :item-per-page="listLen"
      ></FPPaginator>
   </div>
</template>

<script>
import {getCompareValue, post} from "@/utils/dataQuery";
import {translate} from "@/utils/utils";
import {DataLibType} from "@/utils/dataLib";
import FPPaginator from "@/components/Misc/FPPaginator.vue";

export default {
   components: {
      FPPaginator,
   },
   data() {
      return {
         filteredCall: [],
         statusApi: [],
         filterData: {
            fromDate: '',
            toDate: '',
            project: '',
            newStatus: '',
            selfStats: true,
         },
         projects: "",
         // Paginator
         listLen: 10,
         currentPage: 1,
         totalItems: 3,
         page: 1,
         // Trans dict
         UNIT_STATUS: [],
      }
   },
   props: {
      selfFilter: {
         type: Boolean,
         default: false,
      }
   },
   methods: {
      fixDateTime(dateTime) {
         return new Date(dateTime)
            .toLocaleString("en-US", {
               hour12: false,
            })
            .slice(0, -3);
      },
      transStatus(status) {
         return translate(this.UNIT_STATUS, status)
      },
      changeUpdate(updateString) {
         return updateString.substring(0, updateString.indexOf(":") + 1);
      },
      afterChangeUpdate(updateString) {
         return updateString.substring(
            updateString.indexOf(":") + 1,
            updateString.indexOf("→") + 1
         );
      },
      afterUpdate(string) {
         return string.substring(0, string.indexOf("→") + 1);
      },
      beforeChangeUpdate(updateString) {
         return updateString.substring(
            updateString.indexOf("→") + 1,
            updateString.length
         );
      },
      getFilteredCall() {
         return {
            ...this.filterData,
            listLen: this.listLen,
            page: this.currentPage,
            pjPermission: true,
         };
      },
      async postFilterCall() {
         const res = await post("/telesale/get_call_history/", this.getFilteredCall());
         this.filteredCall = res.callHistory;
         this.totalItems = res.totalResult;
      },
      toPage(pageNum) {
         this.currentPage = pageNum;
         this.postFilterCall();
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
      this.getDataLib();
      this.postFilterCall();
   }
}
</script>

<style scoped>
</style>
