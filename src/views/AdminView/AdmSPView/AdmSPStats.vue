<template>
    <div class="row mt-4">
        <div class="col-3 mt-auto">
            <label class="small">Dự Án</label>
            <select v-model="project" class="form-control-plaintext border border-1">
                <option value="" selected>Tất cả</option>
                <option v-for="(pj, index) in projects" :key="index" :value="pj.id">{{ pj.name }}</option>
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

        <div class="col-3 mt-3">
            <input type="submit" @click="getCallHistory" class="btn btn-primary" value="Lọc"/>
        </div>
    </div>
    <div class="row mt-4">
        <table class="table table-striped">
            <thead class="thead-light ">
            <tr class="small">
                <th class="col-2"></th>
                <th class="col-1" v-for="(statName, index) in Object.values(tableHeader)" :key="index">{{ transProcessStatus(statName) }}</th>
                <th class="col"></th>
            </tr>
            </thead>
            <tbody >
            <tr v-for="(data, pjName, index) in returnData" :key="index">
                <th scope="row" >{{ pjName }}</th>
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
    components: {
    },
    data() {
        return {
            returnData: {},
            project: "",
            fromDate: "",
            toDate: "",
            projects: [],
            // Trans dict
            SALE_PROCESS_STATUS: [],
        }
    },
    computed: {
        tableHeader() {
            let keys = Object.keys(this.returnData);
            if (Object.keys(this.returnData).length !== 0) {
                let firstData = this.returnData[keys[0]];
                return Object.keys(firstData);
            }
            return {};
        },
    },
    props: {},
    methods: {
        fixDateTime,
        transProcessStatus(status) {
            return translate(this.SALE_PROCESS_STATUS, status);
        },
        async getCallHistory() {
            const res = await post("/sale_process/get_sp_stats_admin", {
                project: this.project,
                lastUpFrom: this.fromDate,
                lastUpTo: this.toDate,
                role: "Admin",
            })
            this.returnData = res.returnData;
        },
        async getDataLib() {
            const res = await getCompareValue([
                DataLibType.projects, DataLibType.SALE_PROCESS_STATUS]
            );
            this.projects = res.projects;
            this.SALE_PROCESS_STATUS = res.SALE_PROCESS_STATUS;
        },
    },
    mounted() {
        this.toDate = defaultTomorrowInput();
        this.fromDate = defaultFromDateInput();
        this.getCallHistory();
        this.getDataLib();
    }
}
</script>

<style scoped>
</style>
