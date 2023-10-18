<template>
   <div class="container mt-4 p-3">
      <div class="row">
         <div class="col-xl-2 col-4">
            <label class="small">Tình trạng</label>
            <select v-model="status" class="form-control-plaintext border border-1 ">
               <option value="">Tất Cả</option>
               <option v-for="(status,index) in REQUEST_STATUS " :key="index" :value="status[0]">{{
                   status[1]
                  }}
               </option>
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
         <div class="col-xl-2 col-4">
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
         <div class="col-sm-6 col-md-4 col-lg-3 col-xl-3" v-for="(req,index) in requests" :key="index">
            {{ setRequestHash(index, req.id) }}
            <div class="p-3 mt-4" style="border-radius:16px ; border:none;background-color: #F7F9FB">
               <div>
                  <div class="row p-2">
                         <span v-for="(pj,index) in req.inquiryData.pjData"
                               :key="index"
                               class="border-rounded"
                               style="height: 8px; width: 28px;border-radius: 20px; margin-left: 3px"
                               v-bind:style="{'background-color':pj.projectColor}">
                         </span>
                     <div class="col p-0" style="transform: translateY(-9px)">
                        <span v-if="req.inquiryData.rent" class="dot "
                              style="background-color: rgb(72, 189, 72);margin-top: auto; margin-left: 5px"></span>
                        <span v-else class="dot "
                              style="background-color: #F76754;margin-top: auto; margin-left: 5px"></span>
                     </div>
                  </div>
                  <div class="row ">
                     <div class="col">
                        <div class="row d-flex">
                           <div class="col-auto pe-0 text-title">#{{ req.id }} </div>
                           <div class="col-auto pe-0 text-title">{{ req.inquiryData.cusData.sName }} </div>
                        </div>
                     </div>
                     <div class="col-auto d-flex justify-content-end textRentColor" v-if="req.inquiryData.rent">
                        <b class="text-title"
                           v-show="req.inquiryData.ceilingPrice>0 && req.inquiryData.ceilingPrice">{{ req.inquiryData.ceilingPrice }}Tr</b>
                     </div>
                     <b class="col-auto d-flex justify-content-end textSellColor text-title" v-if="!req.inquiryData.rent">{{ req.inquiryData.ceilingPrice }}Tỷ</b>
                  </div>

                  <div class="row">
                     <div class="col">
                        <div class="d-flex" v-if="req.inquiryData.pjData.length > 1">
                           <span class="text-content">{{ subProjectCode(req.inquiryData.pjData) }}</span>
                        </div>
                        <div v-else>
                           <div v-for="(pj,index) in req.inquiryData.pjData" :key="index">
                              <div class="text-content">{{ pj.name }}</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="row mt-3">
                     <div class="col-12">
                        <div class="row">
                           <div class="col-4">
                              <div class="d-flex">
                                 <img class="iconCardInquiry" :src="getIconUrl('bed-solid.svg')" alt="">
                                 <div class="text-gray mt-auto small text-content">{{ req.inquiryData.bedroom }}</div>
                              </div>
                           </div>
                           <div class="col-8">
                              <div class="d-flex">
                                 <img class="iconCardInquiry" :src="getIconUrl('furniture.svg')" alt="">
                                 <div v-if="req.inquiryData.furniture==='fully'"
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
                                 <img class="iconCardInquiry" :src="getIconUrl('floor.svg')" alt="">
                                 <div v-if="req.inquiryData.unitHeight!==''"
                                      class="text-gray mt-auto small text-content">
                                    {{ transHeight(req.inquiryData.unitHeight) }}
                                 </div>
                              </div>
                           </div>
                           <div class="col-8">
                              <div class="d-flex">
                                 <img class="iconCardInquiry" :src="getIconUrl('agent_direction.svg')" alt="">
                                 <div v-if="req.inquiryData.balcony!==''" class="text-gray mt-auto small text-content">
                                    {{ transPointing(req.inquiryData.balcony) }}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="row mt-3">
                     <div class="col-12">
                        <textarea :placeholder="req.note" cols="40" rows="10"
                                  class="text-content form-control small-text-box bg-white" disabled></textarea>
                     </div>
                  </div>
                  <div class="row mt-3">
                     <div class="small text-content">Ngày ở: <span
                           v-show="req.inquiryData.moveInDay">{{ fixDateTime(req.inquiryData.moveInDay) }}</span></div>
                  </div>
                  <div class="mt-2 d-flex justify-content-between">
                     <span class="small text-gray text-content"
                           v-if="req.inquiryData.salesData">MG: {{ req.inquiryData.salesData.first_name }}</span>
                  </div>
                  <div class="mt-2 d-flex justify-content-between">
                     <span class="small text-gray text-content"
                           v-if="req.inquiryData.salesData">Sđt: {{ getUserExtData(req.inquiryData.salesData, 'phone', '') }}</span>
                  </div>
                  <div class="mt-4 d-flex justify-content-around mt-2 mb-4" v-if="req.status==='waiting'">
                     <div class="col-6 ">
                        <button @click="handleRequest(req.id,'processing')"
                                class="w-100 btn-wrap-text gray-button textBoldHover"><small>Tiếp nhận</small></button>
                     </div>
                     <div class="col-5 ">
                        <button class="w-100 btn-wrap-text gray-button textBoldHover"
                                @click="handleRequest(req.id,'rejected')"><small>Từ chối</small></button>
                     </div>
                  </div>
                  <div class="mt-4 d-flex justify-content-around mt-2 mb-4" v-if="req.status==='processing'">
                     <div class="col-6">
                        <button @click="setCurrentId(req.id,'done')" data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                                class="w-100 btn-wrap-text gray-button textBoldHover">
                           <small>Đã xử lý</small>
                        </button>
                        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"
                             tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                           <div class="modal-dialog modal-dialog-centered">
                              <div class="modal-content">
                                 <div class="modal-header">
                                    <h5 class="modal-title" id="staticBackdropLabel">Xác nhận hoàn thành yêu cầu</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                 </div>
                                 <div class="modal-body">
                                    Chọn xác nhận nếu đã hoàn thành xong yêu cầu
                                 </div>
                                 <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" id="close" data-bs-dismiss="modal">
                                       Đóng
                                    </button>
                                    <button @click="updateCurrentTab" type="button" class="btn btn-primary">Xác nhận
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
   <FPPaginator @to-page="toPage"
                :current-page="currentPage"
                :total-item="totalRequest"
                :item-per-page="itemPerPage"
   ></FPPaginator>
</template>


<script>
import FPPaginator from "@/components/Misc/FPPaginator.vue";
import {getCompareValue, post} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {getIconUrl, translate} from "@/utils/utils";
import {fixDateTime} from "@/utils/dateTimeUtils";

export default {
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
         listLength: 12,
         requestHash: new Map(),
         REQUEST_STATUS: "",
         POINTING: "",
         HEIGHT: "",
         FURNITURE: "",
         fixDateTime,
         rent: "",
         currentTab: {
            id: -1,
            status: "",
         },
         getIconUrl
      };
   },
   methods: {
      async getDataLib() {
         const res = await getCompareValue([
            DataLibType.REQUEST_STATUS, DataLibType.POINTING, DataLibType.FURNITURE, DataLibType.HEIGHT]
         );
         this.REQUEST_STATUS = res.REQUEST_STATUS;
         this.POINTING = res.POINTING;
         this.FURNITURE = res.FURNITURE;
         this.HEIGHT = res.HEIGHT
      },
      //set hash map to find this index updated
      setRequestHash(index, itemId) {
         this.requestHash.set(itemId, index);
      },
      getUserExtData(data, dataName, defValue){
         return (data.extData && data.extData.length > 0) ? data.extData[0][dataName] : defValue;
      },
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
            exStatuses: this.status ? [] : ["done", "rejected", "canceled"],
            toDate: this.toDate,
            rent: this.rent,
         })
         this.requests = res.returnData;
         this.totalRequest = JSON.parse(res.totalResult);
         // console.log(this.requests)
         this.itemPerPage = this.listLength;
      },
      toPage(pageNum) {
         this.currentPage = pageNum;
         this.getFilteredRequest();
      },
      updateCurrentTab() {
         if (this.currentTab.id === -1) {
            // console.log("loi update current tab");
            return;
         }
         this.updateRequest(this.currentTab.id, this.currentTab.status);
      },
      setCurrentId(id, status) {
         this.currentTab.id = id;
         this.currentTab.status = status;
      },
      handleRequest(id, status) {
         this.setCurrentId(id, status);
         this.updateCurrentTab();
      },
      async updateRequest(id, status) {
         const res = await post("/sales/update_request_data", {
            id: id,
            status: status,
         })
         this.newData = res["updatedRequest"];
         this.requests[this.requestHash.get(this.newData.id)] = this.newData;
         this.closeModal();
         await this.getFilteredRequest();
         this.showErrorBox = true;
      },
   },
   components: {
      FPPaginator,
   },
   watch: {},
   mounted() {
      this.getFilteredRequest();
      this.getDataLib();
   },
}
</script>