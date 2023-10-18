<template>
    <div class="row mt-4">
        <div class="col-3 mt-auto">
            <label class="small">Nguồn khách hàng</label>
            <select v-model="source" class="form-control-plaintext border border-1">
                <option value=""> Tất cả </option>
                <option v-for="(cus, index) in CUSTOMER_SOURCE" :key="index" :value="cus[0]">{{ cus[1] }}</option>
            </select>
        </div>
        <div class="col-3 mt-auto">
            <label class="small">Dự án</label>
            <select v-model="project" class="form-control-plaintext border border-1">
                <option value="" selected>Tất cả</option>
                <option v-for="(pj, index) in projects" :key="index" :value="pj.id">{{ pj.name }}</option>
            </select>
        </div>
        <div class="col-3 mt-auto">
            <label class="small">Yêu cầu</label>
            <select v-model="rent" class="form-control-plaintext border border-1">
                <option value="">Tất cả</option>
                <option :value="true">Thuê</option>
                <option :value="false">Bán</option>
            </select>
        </div>
        <div class="col-3 mt-auto">
            <label class="small">Nội thất:</label>
            <select v-model="furniture" class="form-control-plaintext border border-1">
                <option value="">Tất cả</option>
                <option value="partly">NTCB</option>
                <option value="fully">FNT</option>
            </select>
        </div>
        <div class="col-3 mt-auto">
            <label class="small">Sales</label>
            <select v-model="user" class="form-control-plaintext border border-1">
                <option value="">Tất cả</option>
                <option v-for="(sale, index) in sales" :key="index" :value="sale.id">{{ sale.username }}</option>
            </select>
        </div>
        <div class="col-2 mt-auto">
            <label class="small">Phòng ngủ</label>
            <input v-model="bedroom" type="number" name="bedroom" maxlength="5" class="form-control px-0"
                   id="id_bedroom" pattern="\d*"
            >
        </div>
        <div class="col-3 mt-auto">
            <input type="submit" @click="inquiryFilter" class="btn btn-primary" value="Lọc"/>
        </div>
        <p class="mt-5">
            Đã lọc được {{ totalItems }} kết quả
        </p>
    </div>
    <div>
        <table class="table mt-4 ">
            <thead class="thead-light">
            <tr>
                <th scope="col">Khách hàng</th>
                <th scope="col">SĐT</th>
                <th scope="col">Nguồn</th>
                <th scope="col">Tình trạng</th>
                <th scope="col">Dự án</th>
                <th scope="col">PN</th>
                <th scope="col">Yêu cầu</th>
                <th scope="col">Tài chính</th>
                <th scope="col">Nội thất</th>
                <th scope="col">Ngày ở</th>
                <th scope="col">Căn ghép</th>
                <th scope="col">Sales</th>
                <th scope="col">Ngày cập nhật</th>
            </tr>
            </thead>
            <tbody v-for="(data,index) in inquiries" :key="index">
            <tr :class="{'bg-white': index % 2 === 0}">
                <td>
                    {{ data.contactorData.name }}
                </td>
                <td>{{ data.contactorData.phone }}</td>
                <td>
                    {{ transCusSource(data.contactorData.source) }}
                </td>
                <td>
                    {{ transStatus(data.status) }}
                </td>
                <td>
                    <div v-for="(project, index) in data.pjData" :key="index">{{ project.code }}</div>
                </td>
                <td>
                    {{ data.bedroom }}
                </td>
                <td>
                    <div v-show="data.rent">Thuê</div>
                    <div v-show="!data.rent">Bán</div>
                </td>
                <td>
                    {{ data.ceilingPrice }}{{ data.rent ? 'Tr' : ' Tỷ' }}
                </td>
                <td>
                    <div v-show="data.furniture===''"></div>
                    <div v-show="data.furniture==='partly'">NTCB</div>
                    <div v-show="data.furniture==='fully'">FNT</div>
                </td>
                <td>
                    {{ fixDateTime(data.moveInDay) }}
                </td>
                <td>
                    {{ data.ttSP }}
                </td>
                <td>
                    {{ data.sellerData.first_name }}
                </td>
                <td>
                    {{ fixDateTime(data.last_update) }}
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {getCompareValue, post} from "@/utils/dataQuery";
import {translate} from "@/utils/utils";
import {DataLibType} from "@/utils/dataLib";
import {fixDateTime} from "@/utils/dateTimeUtils";

export default {
    components: {},
    data() {
        return {
            inquiries: [],
            source: "",
            project: "",
            rent: "",
            furniture: "",
            bedroom: "",
            user: "",
            sales: [],
            totalItems: 3,
            projects: [],
            // Trans dict
            POINTING: [],
            FURNITURE: [],
            SALE_PROCESS_STATUS: [],
            CONTACTOR_STATUS: [],
            CUSTOMER_SOURCE: [],
        }
    },
    props: {
    },
    methods: {
        fixDateTime,
        transFurniture(fur) {
            return translate(this.FURNITURE, fur);
        },
        transInquiry(inq) {
            return translate(this.INQUIRY_STATUS, inq);
        },
        transStatus(status) {
            return translate(this.SALE_PROCESS_STATUS, status);
        },
        transCusSource(status) {
            return translate(this.CUSTOMER_SOURCE, status);
        },
        async getUserApi() {
            const res = await post("/dashboard/get_user/", {
                userName: "",
                role: "Sales",
            })
            this.sales = res.users;
        },
        async inquiryFilter() {
            const res = await post("/dashboard/get_processing_inquiry", {
                source: this.source,
                project: this.project,
                rent: this.rent,
                furniture: this.furniture,
                bedroom: this.bedroom,
                user: this.user,
            })
            this.inquiries = res.returnData;
            this.totalItems = res.totalResult;
        },
        async getDataLib() {
            const res = await getCompareValue([
                DataLibType.projects, DataLibType.SALE_PROCESS_STATUS,
                DataLibType.FURNITURE, DataLibType.POINTING,
                DataLibType.CONTACTOR_STATUS, DataLibType.CUSTOMER_SOURCE]
            );
            this.projects = res.projects;
            this.SALE_PROCESS_STATUS = res.SALE_PROCESS_STATUS;
            this.FURNITURE = res.FURNITURE;
            this.POINTING = res.POINTING;
            this.CONTACTOR_STATUS = res.CONTACTOR_STATUS;
            this.CUSTOMER_SOURCE = res.CUSTOMER_SOURCE;
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
