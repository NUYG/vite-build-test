<template>
   <FpDefLayout>
      <template #comp>


         <div class="container mt-4 p-3">
            <div class="row">
               <div class="col-xl-2 col-4">
                  <label class="small">Tình trạng</label>
                  <select v-model="status" class="form-control-plaintext border border-1 ">
                     <option value="">Tất Cả</option>
                     <option v-for="(status, index) in REQUEST_STATUS" :key="index" :value="status[0]">{{ status[1] }}</option>
                  </select>
               </div>
               <div class="col-xl-2 col-4">
                  <label class="small">Từ ngày</label>
                  <input v-model="fromDate" id="fromDay" class="form-control" type="date"/>
               </div>
               <div class="col-xl-2 col-4">
                  <label class="small">Đến ngày</label>
                  <input v-model="toDate" id="toDay" class="form-control" type="date"/>
               </div>
               <div class="col-xl-2 col-4 ">
                  <label class="small ">Độ dài</label>
                  <select v-model="listLength" class="form-control-plaintext border border-1 ">
                     <option :value="12">12 hàng</option>
                     <option :value="20">20 hàng</option>
                     <option :value="32">32 hàng</option>
                  </select>
               </div>
               <div class="col-2 ">
                  <label class="small">Yêu cầu</label>
                  <select v-model="rent" class="form-control-plaintext border border-1">
                     <option value="">Tất cả</option>
                     <option :value="true">Thuê</option>
                     <option :value="false">Bán</option>
                  </select>
               </div>
               <div class="col-xl-2 col-4 mt-auto">
                  <input type="submit" @click="getFilteredRequest" class="btn btn-primary" value="Lọc"/>
               </div>
            </div>
            <div class="mt-4 row">
               <div v-for="(req, index) in requests" :key="index" class="col-sm-6 col-md-4 col-lg-3 col-xl-3">
                  <div class="p-3 mt-4" style="border-radius:16px ; border:none;background-color: #F7F9FB">
                     <div>
                        <div class="row p-2">
                         <span v-for="(pj, index) in req.inquiryData.pjData" :key="index" class="border-rounded"
                               style="height: 8px; width: 28px;border-radius: 20px; margin-left: 3px"
                               v-bind:style="{'background-color':pj.projectColor}">
                         </span>
                           <div class="col px-0 ">
                              <span v-if="req.inquiryData.rent" class="dot "
                                    style="background-color: rgb(72, 189, 72);margin-top: auto; margin-left: 5px"></span>
                              <span v-else class="dot "
                                    style="background-color: #F76754;margin-top: auto; margin-left: 5px"></span>
                           </div>
                        </div>
                        <div class="row ">
                           <div class="col-8">
                              <div class="d-flex" v-if="req.inquiryData.pjData.length > 1">
                                 <span>{{ subProjectCode(req.inquiryData.pjData) }}</span>
                              </div>
                              <div v-else>
                                 <div v-for="(pj, index) in req.inquiryData.pjData" :key="index">
                                    <div class="text-title">{{ pj.name }}</div>
                                 </div>
                              </div>
                           </div>
                           <div class="col-4 d-flex justify-content-end textRentColor" v-if="req.inquiryData.rent">
                              <b class="text-title"
                                 v-show="req.inquiryData.ceilingPrice>0 && req.inquiryData.ceilingPrice">{{
                                  req.inquiryData.ceilingPrice
                                 }}Tr</b>
                           </div>
                           <b class="col-4 d-flex justify-content-end textSellColor text-title"
                              v-if="!req.inquiryData.rent">{{ req.inquiryData.ceilingPrice }}Tỷ</b>
                        </div>
                        <div class="row mt-3">
                           <div class="col-12">
                              <div class="row">
                                 <div class="col-4">
                                    <div class="d-flex">
                                       <img alt="" class="iconCardInquiry" :src="getIconUrl('bed-solid.svg')">
                                       <div class="text-gray mt-auto small text-content">{{ req.inquiryData.bedroom }}
                                       </div>
                                    </div>
                                 </div>
                                 <div class="col-8">
                                    <div class="d-flex">
                                       <img alt="" class="iconCardInquiry" :src="getIconUrl('furniture.svg')">
                                       <div v-if="req.inquiryData.furniture === 'fully'"
                                            class="text-gray mt-auto small text-content">FNT
                                       </div>
                                       <div v-else class="text-gray mt-auto small text-content">NTCB</div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div class="row mt-3">
                           <div class="col-12">
                              <div class="row">
                                 <div class="col-4">
                                    <div class="d-flex">
                                       <img alt="" class="iconCardInquiry" :src="getIconUrl('floor.svg')">
                                       <div v-if="req.inquiryData.unitHeight!==''"
                                            class="text-gray mt-auto small text-content">
                                          {{ transHeight(req.inquiryData.unitHeight) }}
                                       </div>
                                    </div>
                                 </div>
                                 <div class="col-8">
                                    <div class="d-flex">
                                       <img alt="" class="iconCardInquiry" :src="getIconUrl('agent_direction.svg')">
                                       <div v-if="req.inquiryData.balcony!==''"
                                            class="text-gray mt-auto small text-content">
                                          {{ transPointing(req.inquiryData.balcony) }}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div class="row mt-3">
                           <div class="col-12">
                              <textarea v-model="req.note" cols="40" rows="10"
                                        class="text-content form-control small-text-box bg-white"></textarea>
                           </div>
                        </div>
                        <div class="mt-4 d-flex justify-content-around mt-2 mb-4">
                           <div class="col-6" v-show="req.status!=='canceled'">
                              <button @click="updateRequest(req.id,req.note)"
                                      class="w-100 btn-wrap-text gray-button textBoldHover">
                                 <small>Cập nhật</small>
                              </button>
                           </div>
                           <div class="col-5" v-show="req.status!=='canceled'">
                              <button @click="cancelRequest(req.id)"
                                      class="w-100 btn-wrap-text gray-button textBoldHover">
                                 <small>Hủy bỏ</small>
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <FPPaginator
               @to-page="toPage"
               :current-page="currentPage"
               :total-item="totalRequest"
               :item-per-page="itemPerPage"
         />


      </template>
   </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import FPPaginator from "@/components/Misc/FPPaginator.vue";

import {getIconUrl, translate} from "@/utils/utils";
import {goToURL} from "@/utils/utils";
import {getCompareValue, post} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";

export default {
   components: {
      FpDefLayout,
       FPPaginator,
   },
   data() {
      return {
         requests: {},
         totalRequest: 0,
         itemPerPage: 3,
         currentPage: 1,
         page: 1,
         status: "",
         fromDate: "",
         toDate: "",
         newData: "",
         listLength: 8,
         rent: "",
         currentTab: {
            id: -1,
            status: "",
         },
         // Trans dict
         HEIGHT: [],
         FURNITURE: [],
         POINTING: [],
         REQUEST_STATUS: [],
      }
   },
   computed: {},
   methods: {
      getIconUrl,
      goToURL,
      subProjectCode(arr) {
         // arr is project array
         let projectCode = "";
         for (let i = 0; i < arr.length; i++) {
            projectCode += arr[i].code + "/";
         }
         return projectCode.slice(0, -1);
      },
      closeModal() {
         if (document.getElementById("close")) {
            document.getElementById("close").click();
         }
      },
      transStatus(status) {
         return translate(this.REQUEST_STATUS, status);
      },
      transHeight(unitHeight) {
         return translate(this.HEIGHT, unitHeight);
      },
      transPointing(balcony) {
         return translate(this.POINTING, balcony);
      },
      async getFilteredRequest() {
         const res = await post("/sales/get_unit_requests", {
            fromDate: this.fromDate,
            listLen: this.listLength,
            page: this.currentPage,
            role: "Agent",
            status: this.status,
            exStatuses: ["done", "rejected"],
            toDate: this.toDate,
            rent: this.rent,
         })
         this.requests = res.returnData;
         this.totalRequest = JSON.parse(res.totalResult);
         this.itemPerPage = this.listLength;
      },
      toPage(pageNum) {
         this.currentPage = pageNum;
         this.getFilteredRequest();
      },
      async updateRequest(id, note) {
         const res = await post("/sales/update_request_data", {
            id: id,
            note: note,
         });
         if (res) {
            return window.location.reload();
         }
         this.showErrorBox = true;
      },
      async cancelRequest(id) {
         const res = await post("/sales/update_request_data", {
            id: id,
            status: "canceled",
         });
         if (res) {
            return window.location.reload();
         }
         this.showErrorBox = true;
      },
      async getDataLib() {
         const res = await getCompareValue([
            DataLibType.REQUEST_STATUS, DataLibType.POINTING,
            DataLibType.FURNITURE, DataLibType.HEIGHT]
         );
         this.REQUEST_STATUS = res.REQUEST_STATUS;
         this.POINTING = res.POINTING;
         this.FURNITURE = res.FURNITURE;
         this.HEIGHT = res.HEIGHT;
      },
   },
   watch: {},
   mounted() {
      this.getDataLib();
      this.getFilteredRequest();
   }
}
</script>

<style scoped>
</style>
