<template>
    <FpDefLayout>
        <template #comp>

            <h2 class="common-title">Các Căn Đã Lưu Trữ </h2>
            <form action="" method="get">
                <div class="form-group">
                    <label for="">Lọc tên khách hàng hoặc sđt</label>
                    <input v-model="filterText"  type="text" name=""  class="form-control" id="filterText">
                </div>
            </form>
            <p style="margin-top: 40px">Có {{ archiveData.length }} căn được tìm thấy !</p>
            <table class="table">
                <thead class="thead-light">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Mã Căn</th>
                    <th scope="col">Chủ nhà</th>
                    <th scope="col">Số điện thoại</th>
                    <th scope="col">Thời gian Lưu Trữ</th>
                </tr>
                </thead>
                <tbody v-for="(data, index) in fixArchiveData" :key="index">
                <tr>
                    <th scope="row">{{index+1}}</th>
                    <td><button><a @click='this.$router.push(data.id)'>{{data.codeNumber}}</a></button></td>
                    <td>{{data.ownerName}}</td>
                    <td>{{data.ownerPhone}}</td>
                    <td>{{data.archiveTime}}</td>
                </tr>
                </tbody>
            </table>

        </template>
    </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import {post} from "@/utils/dataQuery";
import {T_CALL_URL} from "@/router/URLs";

export default {
    components: {
        FpDefLayout,
    },
    data() {
        return {
            filterText: "",
            archiveData: [],
        }
    },
    computed: {
        fixArchiveData(){
            const data = [];
            this.archiveData.map((e) => {
                data.push({
                    id: T_CALL_URL + "?unit=" + Number(e.id),
                    codeNumber: e.block + "-" + e.floor + "." + e.unit,
                    ownerName: e.owner_data.name,
                    ownerPhone: e.owner_data.phone,
                    archiveTime: e.archivedTime,
                });
            });
            return data;
        },
    },
    methods: {
        async getArchivedUnits() {
            const res = await post("/telesale/get_archived_units/", {
                filterText: this.filterText
            })
            this.archiveData = res.archivedUnits;
        },
    },
    watch: {
        filterText(v, o) {
            this.getArchivedUnits();
        },
    },
    mounted() {
        this.getArchivedUnits();
    }
}
</script>

<style scoped>
</style>
