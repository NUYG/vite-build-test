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
                <option v-for="(tele, index) in teles " :key="index" :value="tele.id" >{{tele.username}}</option>
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
            <label class="small">Tình trạng</label>
            <select v-model="newStatus" class="form-control-plaintext border border-1  ">
                <option value="">Tất cả</option>
                <option v-for="(st, index) in UNIT_STATUS " :value="st[0]" :key="index">{{ st[1] }} </option>
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
            <td>
                <span v-if="data.oldStatus===data.newStatus">{{transStatus(data.oldStatus)}}</span>
                <span v-else class="text-gray">{{transStatus(data.oldStatus)}} → <span class="text-dark">{{transStatus(data.newStatus)}}</span></span>
            </td>
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

    <div class="mb-5">
        <h3> Số căn cần gọi / dự án: </h3>
        <p v-for="(data, index) in callableCount" :key="index"> {{ data.project__name }}: {{ data.totalCall }} căn </p>
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
            newStatus: "",
            fromDate: "",
            toDate: "",
            bedroom: '',
            dataMode: false,
            role: "Telesale",
            listLen: 20,
            currentPage: 1,
            totalItems: 3,
            page: 1,
            teles: [],
            search: "",
            projects: [],
            callableCount: [],
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
                role: "Telesale",
            })
            this.teles = res.users;
        },
        async getCallHistory() {
            const res = await post("/dashboard/admin_call_detail", {
                project: this.project,
                user: this.user,
                newStatus: this.newStatus,
                fromDate: this.fromDate,
                toDate: this.toDate,
                role: "Telesale",
                bedroom: this.bedroom,
                listLen: this.dataMode ? 999999 : this.listLen,
                page: this.currentPage,
                search: this.search,
            })
            this.callHistory = res.callHistory;
            this.totalItems = res.totalResult;
        },
        async getTeleCallableCount() {
            const res = await post("/dashboard/get_tele_callable_count", {
            })
            this.callableCount = res.returnData
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
        this.getTeleCallableCount();
    }
}
</script>

<style scoped>
</style>
