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
            <label class="small">Người gọi</label>
            <select v-model="user" class="form-control-plaintext border border-1">
                <option value=''>Tất cả</option>
                <option v-for="(agent, index) in agents " :key="index" :value="agent.id" >{{agent.username}}</option>
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
            <label class="small">Căn tươi</label>
            <select v-model="refresh" class="form-control-plaintext border border-1">
                <option value="">Tất cả</option>
                <option :value="true">tươi</option>
                <option :value="false">chưa tươi</option>
            </select>
        </div>
        <div class="col-3 mt-auto">
            <label class="small">Độ dài</label>
            <select v-model="listLen" class="form-control-plaintext border border-1">
                <option :value="10">10 hàng</option>
                <option :value="20"> 20 hàng</option>
                <option :value="30"> 30 hàng</option>
            </select>
        </div>
        <div class="col-3 mt-auto">
            <input v-model="search" type="search"
                   @keyup.enter="getCallHistory"
                   class="form-control rounded" placeholder="Tìm căn" aria-label="Search"
                   aria-describedby="search-addon"
            />
        </div>

        <div class="col-3 mt-auto">
            <input v-model="bedroom" type="text"
                   class="form-control rounded" placeholder="PN"
            />
        </div>

        <div class="col-3 pt-3 mb-n3 form-check form-switch">
            <input
                type="checkbox"
                v-model="dataMode"
                class="form-switch form-switch-xl form-check-input"
                role="switch"
                id="id_data_mode"
            />
        </div>

        <div class="col-3 mt-3">
            <input type="submit"  @click="getCallHistory" class="btn btn-primary" value="Lọc" />
        </div>
    </div>
    <p class="mt-5" >
        Đã lọc được {{totalItems}} kết quả
    </p>
    <table class="table mt-4">
        <thead class="thead-light">
        <tr>
            <th>Dự Án </th>
            <th class="col-1">Mã Căn </th>
            <th>Chủ Nhà </th>
            <th>Tình trạng </th>
            <th>PN </th>
            <th v-if="!dataMode" class="col-2">Note</th>
            <th v-if="!dataMode" class="col-3">Thay đổi</th>
            <th>Người gọi</th>
            <th>Làm tươi căn </th>
            <th>Thời Gian</th>
        </tr>
        </thead>
        <tbody v-for="(data,index) in callHistory" :key="index">
        <tr :class="{'bg-white':index%2==0}" >
            <td >
                {{data.project}}
            </td>
            <td>
                <span v-for="(code, index) in data.code.substring(data.code.indexOf('-')+1,data.code.length)" :key="index">{{code}}</span>
            </td>
            <td>{{data.ownerName}}</td>
            <td>{{transStatus(data.newStatus)}}</td>
            <td>
                <span class="text-dark ">{{ data.bedroom }}</span>
            </td>
            <td v-if="!dataMode">
                <span class="text-dark ">{{beforeNoteUpdate(data.note)}}</span>
            </td>
            <td v-if="!dataMode">
        <tr v-for="(rowSplit, index) in data.updateNote.split('|')" :key="index">
            <td>
                <span>{{changeUpdate(rowSplit)}}</span>
                <span class="text-gray ">{{afterChangeUpdate(rowSplit)}}</span>
                <span class="rent-text ">{{beforeChangeUpdate(rowSplit)}}</span>
            </td>
        </tr>
        </td>
        <td>{{data.userFirstName}}</td>
        <td v-if="data.refresh">Có</td>
        <td v-else>Không</td>
        <td>{{fixDateTime(data.updateTime)}}</td>
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
            callHistory: [],
            project: "",
            user: "",
            refresh: "",
            fromDate: "",
            toDate: "",
            bedroom: '',
            dataMode: false,
            role: "Agent",
            listLength: 25,
            listLen: 10,
            currentPage: 1,
            totalItems: 3,
            page: 1,
            agents: [],
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
        beforeNoteUpdate(str) {
            return this.beforeChangeUpdate(str);
        },
        transStatus(status) {
            return translate(this.UNIT_STATUS, status);
        },
        toPage(pageNum) {
            this.currentPage = pageNum;
            this.getCallHistory();
        },
        async getUserApi() {
            const res = await post("/dashboard/get_user/", {
                userName: "",
                role: "Agent",
            })
            this.agents = res.users;
        },
        async getCallHistory() {
            const res = await post("/dashboard/admin_call_detail", {
                project: this.project,
                user: this.user,
                refresh: this.refresh,
                fromDate: this.fromDate,
                toDate: this.toDate,
                role: "Agent",
                bedroom: this.bedroom,
                listLen: this.dataMode ? 999999 : this.listLen,
                page: this.currentPage,
                search: this.search,
            })
            this.callHistory = res.callHistory;
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
        this.getCallHistory();
        this.getUserApi();
        this.getDataLib();
    }
}
</script>

<style scoped>
</style>
