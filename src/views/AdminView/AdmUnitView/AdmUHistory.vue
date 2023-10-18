<template>
    <div class="row mt-4">
        <div class="col-3 mt-auto">
            <label class="small">Dự Án</label>
            <select v-model="project"  class="form-control-plaintext border border-1">
                <option value="" selected>Tất cả</option>
                <option v-for="(pj, index) in projects" :key="index" :value="pj.id" >{{pj.name }}</option>
            </select>
        </div>
        <div class="col-3 mt-auto">
            <label class="small">Người cập nhật</label>
            <select v-model="user" class="form-control-plaintext border border-1">
                <option value=''>Tất cả</option>
                <option v-for="(tele, index) in teles" :key="index" :value="tele.id" >{{tele.username}}</option>
            </select>
        </div>
        <div class="col-3">
            <label class="small">Từ ngày</label>
            <input v-model="fromDate"  class="form-control" type="date"  />
        </div>
        <div class="col-3">
            <label class="small">Đến ngày</label>
            <input v-model="toDate" id="toDay" class="form-control" type="date" />
        </div>
        <div class="col-3 mt-auto">
            <label class="small">Trạng thái</label>
            <select v-model="newStatus" class="form-control-plaintext border border-1">
                <option value="">Tất cả</option>
                <option v-for="(status, index) in UNIT_STATUS" :key="index" :value="status[0]" >{{status[1]}}</option>
            </select>
        </div>
        <div class="col-3 mt-auto">
            <label class="small">Độ dài</label>
            <select v-model="listLen" class="form-control-plaintext border border-1">
                <option :value="5">5 hàng</option>
                <option :value="10"> 10 hàng</option>
                <option :value="15"> 15 hàng</option>
                <option :value="20"> 20 hàng</option>
            </select>
        </div>
        <div class="col-3 mt-auto">
            <input v-model="search" type="search"
                   v-on:keyup.enter="inquiryFilter"
                   class="form-control rounded" placeholder="Tìm căn" aria-label="Search"
                   aria-describedby="search-addon"
            />
        </div>
        <div class="col-3 mt-auto">
            <input type="submit"  @click="inquiryFilter" class="btn btn-primary" value="Lọc" />
        </div>
        <p class="mt-5" >
            Đã lọc được {{totalItems}} kết quả
        </p>
    </div>
    <table class="table mt-4">
        <thead class="thead-light">
        <tr>
            <th>Dự án </th>
            <th class="col-1">Căn </th>
            <th>Ngày cập nhật</th>
            <th>Người cập nhật</th>
            <th>Trạng thái </th>
            <th class="col-3">Thay đổi</th>
            <th>Note</th>
        </tr>
        </thead>
        <tbody v-for="(data, index) in filteredCall" :key="index">
        <tr :class="{'bg-white':index%2==0}" >
            <td>{{data.project}}</td>
            <td>
                <span v-for="(code, index) in data.code.substring(data.code.indexOf('-')+1,data.code.length)" :key="index">{{code}}</span>
            </td>
            <td>{{fixDateTime(data.updateTime)}}</td>
            <td>{{data.userFirstName}}</td>
            <td>{{transStatus(data.newStatus)}}</td>
            <td>
        <tr v-for="rowSplit in data.updateNote.split('|')" >
            <td>
                <span>{{changeUpdate(rowSplit)}}</span>
                <span class="text-gray ">{{afterChangeUpdate(rowSplit)}}</span>
                <span class="rent-text ">{{beforeChangeUpdate(rowSplit)}}</span>
            </td>
        </tr>
        </td>
        <td>
            <span v-for="(note, index) in data.note.substring(data.note.indexOf('→')+1,data.note.length)" :key="index">{{note}}</span>
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

export default {
    components: {
        FPPaginator,
    },
    data() {
        return {
            filteredCall: [],
            project: "",
            user: "",
            newStatus: "",
            fromDate: "",
            toDate: "",
            listLen: 20,
            teles: [],
            totalItems: 3,
            page: 1,
            currentPage: 1,
            search: "",
            projects: [],
            // Trans dict
            UNIT_STATUS: [],
        }
    },
    props:{
    },
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
                newStatus: this.newStatus,
                fromDate: this.fromDate,
                toDate: this.toDate,
                listLen: this.listLen,
                page: this.currentPage,
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
