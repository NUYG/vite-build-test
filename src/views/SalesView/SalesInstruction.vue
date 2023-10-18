<template>
    <FpDefLayout>
        <template #comp>


            <div class="container ">
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="instruction-card mb-3" style="background-color: #f2f2f2">
                            <div class="instruction-title d-flex justify-content-between" @click="toggleActive(1)">
                                <span class="text-content">Tôi không hiểu các kí tự trên hệ thống ?</span>
                                <span>
                                   <img :src="getIconUrl('chevron-left.svg')" alt="check_icon"
                                        style="transform:  rotate(-90deg)">
                              </span>
                            </div>
                            <div class="p-2 text-content" v-show="toggleId===1">
                                <p><i>Nhu cầu</i></p>
                                <div class="d-flex mt-2">
                                    <span class="dot rent-color mt-2"></span>
                                    <span class="px-2">Cần thuê / cho thuê</span>
                                </div>
                                <div class="d-flex mt-2">
                                    <span class="dot sell-color mt-2"></span>
                                    <span class="px-2">Cần mua / bán</span>
                                </div>
                                <div class="d-flex mt-2">
                                    <span class="dot bg-dark mt-2"></span>
                                    <span class="px-2">Đã hủy</span>
                                </div>

                                <p class="mt-4"><i>Dự án</i></p>
                                <div class="d-flex mt-2" v-for="(pj, index) in projects" :key="index">
                                    <span class="border-rounded mt-1" :style="{'background-color':pj.projectColor}"
                                          style="height: 8px; width: 28px; border-radius: 20px; margin-left: 3px;"></span>
                                    <span class="px-2">{{ pj.name }}. <span
                                            class="text-gray">Mã: {{ pj.code }}</span></span>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="instruction-card mb-3" style="background-color: #f2f2f2">
                            <div class="instruction-title d-flex justify-content-between" @click="toggleActive(2)">
                                <span class="text-content">Làm sao để tôi có thể sử dụng FPLAND trên thiết bị di động ?</span>
                                <span>
                                       <img :src="getIconUrl('chevron-left.svg')" alt="check_icon"
                                            style="transform:  rotate(-90deg)">
                                      </span>
                            </div>
                            <div class="p-2 text-content" v-show="toggleId===2">
                                <span>IOS</span>
                                <p>Sử dụng <b>Safari</b> truy cập vào <i>more.fpland.vn</i> chọn nút <i>chia sẻ </i>
                                    <img alt="shareIcon" :src="getIconUrl('share.svg')"/> , <b>Thêm vào màn hình chính </b>
                                </p>

                                <span>Android</span>
                                <p>Sử dụng <b>Chrome</b> truy cập vào <i>more.fpland.vn</i> chọn <i>Mở rộng</i>
                                    <img alt="...Icon" :src="getIconUrl('DotsThreeVertical.svg')"/> , <b>Thêm vào màn hình chính </b>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="instruction-card mb-3" style="background-color: #f2f2f2">
                            <div class="instruction-title d-flex justify-content-between" @click="toggleActive(3)">
                                <span class="text-content">Tôi phải làm thế nào để tạo khách hàng hoặc yêu cầu mới ?</span>
                                <span>
                                       <img :src="getIconUrl('chevron-left.svg')" alt="check_icon"
                                            style="transform:  rotate(-90deg)">
                                  </span>
                            </div>
                            <div class="p-2 text-content" v-show="toggleId===3">
                                <span>Bạn có thể tạo khách hàng/yêu cầu mới từ </span>
                                <div class="mt-2"><b><i>Trang chủ > Tạo mới</i></b></div>
                                <div>hoặc <b><i>Khách hàng > Tạo mới</i></b></div>
                                <div>hoặc <b><i>Nhu cầu > Tạo mới.</i></b></div>
                                <p class="mt-2"><i>Đối với khách hàng có nhiều hơn một nhu cầu, Bạn có thể tìm đến khách
                                    hàng và tạo trực tiếp nhu cầu mới từ trang thông tin của khách đó.</i></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="instruction-card mb-3" style="background-color: #f2f2f2">
                            <div class="instruction-title d-flex justify-content-between" @click="toggleActive(4)">
                                <span class="text-content">Làm sao để tôi có thể tạo đơn hàng?</span>
                                <span>
                                   <img :src="getIconUrl('chevron-left.svg')" alt="check_icon"
                                        style="transform:  rotate(-90deg)">
                              </span>
                            </div>
                            <div class="p-2 text-content" v-show="toggleId===4">
                                <p class="mt-2">
                                    Bạn có thể tạo đơn hàng mới bằng cách truy cập <b>Nhu cầu > [Chi tiết nhu cầu] >
                                    Ghép căn </b>
                                    hoặc <b>Giỏ hàng > [Chi tiết hàng] > Ghép nhu cầu </b>
                                </p>
                                <p>Bạn có thể tạo đơn hàng mới thông qua việc <b>Ghép căn</b> trong <i>chi tiết một nhu
                                    cầu khách hàng</i>
                                    hoặc <b>Ghép nhu cầu</b> trong chi tiết một căn trong giỏ hàng
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="instruction-card mb-3" style="background-color: #f2f2f2">
                            <div class="instruction-title d-flex justify-content-between" @click="toggleActive(5)">
                                <span class="text-content">Làm sao để tôi có thể theo dõi đơn hàng mình đã tạo?</span>
                                <span>
                                       <img :src="getIconUrl('chevron-left.svg')" alt="check_icon"
                                            style="transform:  rotate(-90deg)">
                                  </span>
                            </div>
                            <div class="p-2 text-content" v-show="toggleId===5">
                                <p class="mt-2">
                                    Để theo dõi đơn hàng, truy cập vào <b>Đơn hàng > Chi tiết đơn hàng. </b>
                                    Mỗi đơn hàng sẽ có một thanh tiến trình đơn hàng gồm các giai đoạn của một đơn hàng
                                    và tình trạng hiện tại của đơn hàng đó.
                                    Bạn có thể xem lại lịch sử các bước bằng cách nhấn trực tiếp vào các bước trên thanh
                                    tiến trình.
                                </p>
                                <p>Đối với các đơn hàng có cập nhật từ hệ thống, sẽ có một
                                    <b>chuông thông báo</b> đặt cạnh tên Chuyên viên tư vấn của đơn hàng.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="instruction-card mb-3" style="background-color: #f2f2f2">
                            <div class="instruction-title d-flex justify-content-between" @click="toggleActive(6)">
                                <span class="text-content">Câu hỏi / phản hồi / góp ý khác</span>
                                <span>
                                   <img :src="getIconUrl('chevron-left.svg')" alt="check_icon"
                                        style="transform:  rotate(-90deg)">
                                  </span>
                            </div>
                            <div class="p-2 text-content" v-show="toggleId===6">
                                <p class="mt-2">
                                    Để phản hồi thêm những thông tin khác, vui lòng lên hệ với bộ phận CSKH của chúng
                                    tôi:
                                </p>
                                <div>Hotline: <b>0908 328 568 </b></div>
                                <div>Email: fpland.hr@gmail.com</div>
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

import {getIconUrl} from "@/utils/utils";
import {getCompareValue} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";

export default {
    components: {
        FpDefLayout,
    },
    data() {
        return {
            toggleId: -1,
            projects: [],
        }
    },
    computed: {},
    methods: {
        getIconUrl,
        toggleActive(index) {
            this.toggleId = index === this.toggleId ? -1 : index;
        },
        async getDataLib() {
            const res = await getCompareValue([
                DataLibType.projects]
            );
            this.projects = res.projects;
        },
    },
    watch: {},
    mounted() {
        this.getDataLib();
    }
}
</script>

<style scoped>
</style>
