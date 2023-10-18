<template>
    <FpDefLayout>
        <template #comp>
            <div class="w-100 h-100">

                <h3 v-if="errText !== ''">{{ errText }}</h3>
                <div class="container-fluid p-xl-5 p-3" v-if="callData !== ''">
                    <div class="row mb-4">
                        <div class="col-12 col-sm-12 col-xl-7 mb-3 mb-xl-0 mr-xl-4 p-4 block-bg">
                            <p>Hôm nay bạn đã gọi được {{ totalCall }} căn, cố gắng phát huy nhe.</p>
                        </div>
                        <div class="col-12 col-sm-12 col-xl-4 p-4 block-bg">
                            <p><strong>Dự án đang gọi: </strong></p>
                            <div class="row pl-3">
                                <p class="mr-3" v-for='(pj, index) in teleCallPjs' :key="index">{{ pj }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4 mb-4">
                        <div class="col-12 col-sm-12 col-xl-7 mr-4">
                            <div class="row justify-content-between mb-3 mb-xl-0">
                                <div class="col-12 col-sm-12 col-xl-5 mb-3 mb-xl-0 p-4 block-bg">
                                    <p><strong>Chủ nhà:</strong> {{ callData.owner_data.name }}</p>
                                    <p><strong>Mã căn:</strong> {{ callData.pjData.name }} -
                                        {{ callData.block }}-{{ callData.floor }}.{{ callData.unit }}</p>
                                    <p><strong>SĐT:</strong> {{ callData.owner_data.phone }}</p>
                                </div>

                                <div class="col-6 col-sm-6 col-xl-3 p-4 block-bg">
                                    <p><strong>PN:</strong>{{ callData.bedroom }}</p>
                                    <p><strong>WC:</strong>{{ callData.bathroom }}</p>
                                    <p><strong>Diện tích:</strong> {{ callData.size }} m2</p>
                                    <p><strong>Hướng:</strong>{{ transPointing(callData.balcony) }}</p>
                                </div>
                                <div class="col-6 col-sm-6 col-xl-3 p-4 block-bg">
                                    <p><strong>Giá trung bình:</strong></p>
                                    <p>#giá trung bình</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-12 col-xl-4 p-4 block-bg">
                            <p><strong>Ghi chú trước:</strong></p>
                            <p></p>
                        </div>
                    </div>
                    <div id="tele_call_vuejs">
                        <div class="row mb-4">
                            <div class="col-12 col-sm-12 col-xl-7 mr-xl-4 p-4 block-bg">
                                <div class="row justify-content-center mt-3 mb-5">
                                    <div class="col-12 col-sm-12 col-xl-5 mr-4">
                                        <div class="row justify-content-center">
                                            <div class="col-6">
                                                <p>Cho thuê:</p>
                                                <div
                                                        class="form-check form-switch col-5 col-sm-5 col-xl-5 mr-2"
                                                >
                                                    <input
                                                            type="checkbox"
                                                            @click="rentingToggle"
                                                            :checked="this.cloneData.renting"
                                                            class="form-switch form-switch-xl form-check-input"
                                                            role="switch"
                                                            id="id_renting"
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <p>Rao bán:</p>
                                                <div class="form-check form-switch col-5 col-sm-5 col-xl-5">
                                                    <input
                                                            type="checkbox"
                                                            @click="sellingToggle"
                                                            :checked="this.cloneData.selling"
                                                            class="form-switch form-switch-xl form-check-input"
                                                            role="switch"
                                                            id="id_selling"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-5 col-sm-5 col-xl-5 ml-4"></div>
                                </div>
                                <div class="row justify-content-center mt-3 mb-3" v-show="cloneData.renting">
                                    <div
                                            class="col-12 col-sm-12 col-md-5 mb-3 col-xl-3 mb-xl-0 ml-xl-4"
                                    >
                                        <label for="id_rentingPrice">Giá thuê (triệu):</label
                                        ><input
                                            type="number"
                                            v-model="cloneData.rentingPrice"
                                            step="0.1"
                                            class="form-control"
                                            id="id_rentingPrice"
                                    />
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-6 col-xl-8 mr-xl-4">
                                        <div class="row justify-content-center">
                                            <div class="col-6">
                                                <p>
                                                    <label for="id_managementCoverage">Bao phí quản lý:</label>
                                                </p>
                                                <div class="col-5 col-sm-5 col-xl-5 form-check form-switch">
                                                    <input
                                                            type="checkbox"
                                                            v-model="cloneData.managementCoverage"
                                                            class="form-switch form-switch-xl form-check-input"
                                                            role="switch"
                                                            id="id_managementCoverage"
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-5 col-sm-5 col-xl-5 form-check form-switch">
                                                <label for="id_rentingFurniture">Nội thất:</label
                                                ><select
                                                    v-model="cloneData.rentingFurniture"
                                                    class="form-control"
                                                    id="id_rentingFurniture"
                                            >
                                                <option value="">------</option>
                                                <option value="fully">Đầy đủ</option>
                                                <option value="partly">Cơ bản</option>
                                            </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                        class="row justify-content-center mt-3 mb-5"
                                        v-show="cloneData.renting">
                                    <div
                                            class="col-12 col-sm-12 col-md-5 mb-3 mb-xl-0 ml-xl-4 col-xl-3"
                                    >
                                        <label>Thuê tối thiểu (Tháng)</label
                                        ><input
                                            type="text"
                                            v-model="cloneData.minRentingTime"
                                            maxlength="20"
                                            class="form-control"
                                            id="id_minRentingTime"
                                    />
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-6 col-xl-5 mr-xl-4 col-xl-8">
                                        <div class="row justify-content-center">
                                            <div class="col-6">
                                                <p><label for="id_rentingUrgency">Cho thuê gấp:</label></p>
                                                <div
                                                        class="col-5 col-sm-5 col-xl-5 mr-2 form-check form-switch"
                                                >
                                                    <input
                                                            type="checkbox"
                                                            v-model="cloneData.rentingUrgency"
                                                            class="form-switch form-switch-xl form-check-input"
                                                            role="switch"
                                                            id="id_rentingUrgency"
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-5 col-sm-5 col-xl-5">
                                                <label for="id_rentingDeposit">Cọc thuê:</label
                                                ><input
                                                    type="number"
                                                    v-model="cloneData.rentingDeposit"
                                                    step="0.1"
                                                    class="form-control"
                                                    id="id_rentingDeposit"
                                            />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                        class="row justify-content-center mt-3 mb-5"
                                        v-show="cloneData.selling"
                                >
                                    <div
                                            class="col-12 col-sm-12 col-md-5 mb-3 mb-xl-0 ml-xl-4 col-xl-3"
                                    >
                                        <label for="id_sellingPrice">Giá bán (tỷ):</label
                                        ><input
                                            type="number"
                                            v-model="cloneData.sellingPrice"
                                            step="0.1"
                                            class="form-control"
                                            id="id_sellingPrice"
                                    />
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-6 col-xl-5 mr-xl-4 col-xl-8">
                                        <div class="row justify-content-center">
                                            <div class="col-6">
                                                <p><label for="id_transferringCoverage">Bao sổ:</label></p>
                                                <div
                                                        class="col-5 col-sm-5 col-xl-5 mr-2 form-check form-switch"
                                                >
                                                    <input
                                                            type="checkbox"
                                                            v-model="cloneData.transferringCoverage"
                                                            class="form-switch form-switch-xl form-check-input"
                                                            role="switch"
                                                            id="id_transferringCoverage"
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-5">
                                                <p><label for="id_feeCoverage">Bao thuế phí:</label></p>
                                                <div class="col-5 col-sm-5 col-xl-5 form-check form-switch">
                                                    <input
                                                            type="checkbox"
                                                            v-model="cloneData.feeCoverage"
                                                            class="form-switch form-switch-xl form-check-input"
                                                            role="switch"
                                                            id="id_feeCoverage"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                        class="row justify-content-center mt-3 mb-5"
                                        v-show="cloneData.selling"
                                >
                                    <div
                                            class="col-12 col-sm-12 col-md-5 mb-3 mb-xl-0 ml-xl-4 col-xl-3"
                                    >
                                        <label for="id_sellingDeposit">Cọc mua:</label
                                        ><input
                                            type="number"
                                            v-model="cloneData.sellingDeposit"
                                            step="0.1"
                                            class="form-control"
                                            id="id_sellingDeposit"
                                    />
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-6 col-xl-5 mr-xl-4 col-xl-8">
                                        <div class="row justify-content-center">
                                            <div class="col-6 col-sm-6 col-xl-5">
                                                <label for="id_furniture">Nội thất:</label
                                                ><select
                                                    v-model="cloneData.furniture"
                                                    class="form-control"
                                                    id="id_furniture"
                                            >
                                                <option value="">------</option>
                                                <option value="fully">Đầy đủ</option>
                                                <option value="partly">Cơ bản</option>
                                            </select>
                                            </div>
                                            <div class="col-6 col-sm-6 col-xl-5"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-12 col-xl-4 p-4 block-bg">
                                <label for="id_note">Ghi chú:</label
                                ><textarea
                                    v-model="cloneData.note"
                                    cols="40"
                                    rows="10"
                                    class="form-control form-control-sm"
                                    id="id_note"
                                    style="max-height: 12vw"
                            ></textarea>
                            </div>
                        </div>
                        <div class="row mb-4  block-bg">
                            <div class="col-8">
                                <div class="row mt-3 mb-3">
                                    <label for="id_status">Trạng thái: </label>
                                    <div class="row">
                                        <div class="col-4 mt-auto">
                                            <button :class="{'btn-search': statusEqual('wrong')}"
                                                    @click="setUnvStt('wrong')" type="button"
                                                    class="btn-view w-100 rounded text-dark btn-wrap-text u-tab-text">
                                                Sai thông tin
                                            </button>
                                        </div>
                                        <div class="col-4 mt-2">
                                            <button :class="{'btn-search': statusEqual('cantContact')}"
                                                    @click="setUnvStt('cantContact')" type="button"
                                                    class="btn-view w-100 rounded text-dark btn-wrap-text u-tab-text">
                                                Không liên lạc được
                                            </button>
                                        </div>
                                        <div class="col-4 mt-auto">
                                            <button :class="{'btn-search': statusEqual('noRespond')}"
                                                    @click="setUnvStt('noRespond')" type="button"
                                                    class="btn-view w-100 rounded text-dark btn-wrap-text u-tab-text">
                                                Không nghe máy
                                            </button>
                                        </div>
                                        <div class="col-4 mt-2">
                                            <button :class="{'btn-search': statusEqual('notAvail')}"
                                                    @click="setUnvStt('notAvail')" type="button"
                                                    class="btn-view w-100 rounded text-dark btn-wrap-text u-tab-text">
                                                Không nhu cầu
                                            </button>
                                        </div>
                                        <div class="col-4 mt-auto">
                                            <button :class="{'btn-search': statusEqual('staying')}"
                                                    @click="setUnvStt('staying')" type="button"
                                                    class="btn-view w-100 rounded text-dark btn-wrap-text u-tab-text">
                                                Đang ở
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4 ">
                                    <input
                                            type="submit"
                                            @click="updatedData"
                                            class="btn btn-primary w-100"
                                            value="Tiếp tục >"
                                    />
                                    <button class="btn btn-primary w-100" style="margin-top: 20px" @click="archiveData">
                                        Lưu trữ
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </template>
    </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import {getCompareValue, post} from "@/utils/dataQuery";
import {floatFixed, translate} from "@/utils/utils";
import {DataLibType} from "@/utils/dataLib";

// const getData = new URLSearchParams(window.location.href.split("?")[1]);
// const unitId = getData.get("unit");

export default {
    components: {
        FpDefLayout,
    },
  props:['unitId'],
    data() {
        return {
            callData: "",
            cloneData: {},
            statusBtn: false,
            errText: "",
            totalCall: 0,
            teleCallPjs: [],
            // Trans dict
            POINTING: [],
            UNIT_STATUS: [],
        }
    },
    methods: {
        cloneCallData(callData) {
            this.cloneData = {...callData};
            this.cloneData.sellingPrice = floatFixed(this.cloneData.sellingPrice);
            this.cloneData.rentingPrice = floatFixed(this.cloneData.rentingPrice);
            this.cloneData.sellingDeposit = floatFixed(this.cloneData.sellingDeposit);
            this.cloneData.rentingDeposit = floatFixed(this.cloneData.rentingDeposit);
        },
        setStatus(stt) {
            this.cloneData.status = stt;
        },
        setUnvStt(stt) {
            this.setStatus(stt);
            this.cloneData.renting = false;
            this.cloneData.selling = false;
        },
        statusEqual(stt) {
            return this.cloneData.status === stt;
        },
        rentingToggle() {
            this.cloneData.renting = !this.cloneData.renting;
            if (this.cloneData.renting) {
                this.setStatus("available");
            } else if (!this.cloneData.selling) {
                this.setStatus("notAvail");
            }
        },
        sellingToggle() {
            this.cloneData.selling = !this.cloneData.selling;
            if (this.cloneData.selling) {
                this.setStatus("available");
            } else if (!this.cloneData.renting) {
                this.setStatus("notAvail");
            }
        },
        async archiveData() {
            await post("/telesale/archive_unit/", {id: this.cloneData.id});
            window.location.reload();
        },
        async updatedData() {
            const res = await post("/telesale/update_unit_data_call", {
                unit_id: this.cloneData.id,
                ...this.cloneData,
            });
            if (res.succeed) {
                window.location.reload();
            } else {
                alert(res.resText);
            }
        },
        transPointing(balcony) {
            return translate(this.POINTING, balcony);
        },
        async teleCallData() {
            const res = await post("/telesale/get_calling_unit_data", {
                id: this.unitId ? this.unitId : -1,
            })
            if (!res || !res.succeed) {
                this.errText =
                    "Đã hết căn có thể gọi trong dự án này, vui lòng quay lại vào hôm sau! ";
                return;
            }

            this.callData = res.returnData;
            this.cloneCallData(this.callData);
        },
        async getDataLib() {
            const res = await getCompareValue([
                DataLibType.POINTING, DataLibType.UNIT_STATUS,
                DataLibType.userTotalCall, DataLibType.teleCallPjs]
            );
            this.POINTING = res.POINTING;
            this.UNIT_STATUS = res.UNIT_STATUS;
            this.totalCall = res.userTotalCall;
            this.teleCallPjs = res.teleCallPjs;
        },
    },
    mounted() {
        this.getDataLib();
        this.teleCallData();
    }
}
</script>

<style scoped>
</style>
