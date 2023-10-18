<template>
    <div class="row mt-4">
        <div class="col-3 mt-auto">
            <label class="small">Agent</label>
            <select v-model="user" class="form-control-plaintext border border-1">
                <option value=''>Tất cả</option>
                <option v-for="(agent, index) in agents" :key="index" :value="agent.id" >{{agent.username}}</option>
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
            <input type="submit"  @click="getCallHistory" class="btn btn-primary" value="Lọc" />
        </div>
    </div>
    <div class="row mt-4">
        <table class="table table-striped">
            <thead class="thead-light ">
            <tr class="small">
                <th class="col-1"></th>
                <th class="col-1" v-for="(statName, index) in Object.values(tableHeader)" :key="index">{{ statName }}</th>
                <th class="col"></th>
            </tr>
            </thead>
            <tbody >
            <tr v-for="(data, pjName, index) in callStats" :key="index">
                <th scope="row" >{{ pjName }}</th>
                <td v-for="(callNum, index) in Object.values(data)" :key="index">{{ callNum }}</td>
                <td></td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {post} from "@/utils/dataQuery";
import {translate} from "@/utils/utils";
import {defaultFromDateInput, defaultTomorrowInput} from "@/utils/dateTimeUtils";

export default {
    components: {
    },
    data() {
        return {
            callStats: {},
            user: "",
            fromDate: "",
            toDate: "",
            agents: [],
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
    props:{
    },
    methods: {
        async getUserApi() {
            const res = await post("/dashboard/get_user/", {
                userName: "",
                role: "Agent",
            })
            this.agents = res.users;
        },
        async getCallHistory() {
            const res = await post("/dashboard/get_as_call_stats", {
                user: this.user,
                fromDate: this.fromDate,
                toDate: this.toDate,
                role: "Agent",
            })
            this.callStats = res.callStats;
        },
    },
    mounted() {
        this.toDate = defaultTomorrowInput();
        this.fromDate = defaultFromDateInput();
        this.getCallHistory();
        this.getUserApi();
    }
}
</script>

<style scoped>
</style>
