<template>
   <div id="agent_u_list_vue" class="container-fluid ">
      <div class="row ">
         <div class="col-12 block-bg p-4 ">
            <p class="u-tab-text-xl mb-5"></p>
            <AgentFilter @filter-btn-clicked="unitFilter" :pageName="page"></AgentFilter>
            <div class="row justify-content-between mt-4">
               <div class="col-8">
                  <b> Đã lọc ra được {{ totalUnit }} căn. </b>
               </div>
               <div class="col-4 p-0">
                  <div class="row justify-content-end">
                     <div class="col-4  m-auto ">
                        <b class='small'><label for="unit_sorting">Sắp xếp: </label></b>
                     </div>
                     <div class="col-8 ">
                        <select v-model="sorting" name="sorting"
                                class="form-control-plaintext"
                                id="unit_sorting"
                        >
                           <option value='' selected> Không</option>
                           <option value='balcony'> Ban công ↑
                           </option>
                           <option value='-balcony'> Ban công ↓
                           </option>
                           <option value='size'> Size ↑</option>
                           <option value='-size'> Size ↓</option>
                           <option value='bedroom'> PN ↑</option>
                           <option value='-bedroom'> PN ↓</option>
                           <option value='unit'> Mã căn ↑</option>
                           <option value='-unit'> Mã căn ↓</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>

            <AgentVue @unit-tab-clicked="unitTabClicked"
                      :units="units"
                      :page="page"
            ></AgentVue>

            <FPPaginator class="mt-2" @to-page="toPage"
                         :current-page="currentPage"
                         :total-item="totalUnit"
                         :item-per-page="itemPerPage"
            />
         </div>
      </div>
   </div>
</template>


<script>
import AgentFilter from "@/views/AgentView/NewAgent/AgentFilter/AgentFilter.vue";
import AgentVue from "@/views/AgentView/AgentUListView.vue";
import {getCompareValue, post} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import FPPaginator from "@/components/Misc/FPPaginator.vue";
import {floatFixed, translate} from "@/utils/utils";

export default {
   components: {
      AgentFilter,
      AgentVue,
      FPPaginator
   },
   data() {
      return {
         units: {},
         currentPage: 1,
         itemPerPage: 5,
         totalUnit: 3,
         filterData: {},
         sorting: "",
         focusId: -1,
         ownerName: "",
         ownerPhone: 0,
         zalo: "",
         project: "",
         block: "",
         floor: "",
         unit: "",
         renting: false,
         selling: false,
         rentingPrice: 0,
         sellingPrice: 0,
         bedroom: "",
         bathroom: 0,
         balcony: "",
         size: [],
         furniture: "",
         managementCoverage: false,
         feeCoverage: false,
         transferringCoverage: false,
         note: "",
         rentingFee: 0,
         sellingFee: 0,
         rentingFeeSale: 0,
         sellingFeeSale: 0,
         lastNote: "",
         rentingUrgency: false,
         sellingUrgency: false,
         rentingDeposit: 0.0,
         sellingDeposit: 0.0,
         unitStatus: "",
         contractExpiry: "",
         minRentingTime: "",
         fresh: "",
         pairedInquiriesId: false,
         pairedInquiries: false,
         editingUnit: false,
         editingUTab: false,
         editingSPrice: false,
         editingRPrice: false,
         showErrorBox: false,
         errorText: "",
         errorType: "danger",
         showEditing: false,
         POINTING: "",
         FURNITURE: "",
         INQUIRY_STATUS: "",
         UNIT_STATUS: "",
         page: this.pageName,
      };
   },
   computed: {
      fixedSellingPrice() {
         return floatFixed(this.sellingPrice);
      },
      fixedRentingPrice() {
         return floatFixed(this.rentingPrice, 1);
      },
      code() {
         if (this.block) {
            return this.block + "-" + this.floor + "." + this.unit;
         }
         return this.floor + "." + this.unit;
      },
      transDirection() {
         return translate(this.POINTING, this.editingUnit.balcony);
      },
      transFurniture() {
         return translate(this.FURNITURE, this.editingUnit.furniture);
      },
   },
   methods: {
      async getDataLib() {
         const res = await getCompareValue([
            DataLibType.POINTING, DataLibType.UNIT_STATUS,
            DataLibType.INQUIRY_STATUS, DataLibType.FURNITURE]
         );
         this.POINTING = res.POINTING;
         this.UNIT_STATUS = res.UNIT_STATUS;
         this.FURNITURE = res.FURNITURE;
         this.INQUIRY_STATUS = res.INQUIRY_STATUS;
      },
      unitTabClicked(unitTab) {
         this.showEditing = true;
         let unit = unitTab.unitData;
         this.editingUTab = unitTab;
         this.editingUnit = unit;
         this.focusId = unit.id;
         this.ownerName = unit.owner_data.name;
         this.ownerPhone = unit.owner_data.phone;
         this.project = unit.pjData.name;
         this.sellingPrice = unit.sellingPrice;
         this.rentingPrice = unit.rentingPrice;
         this.renting = unit.renting;
         this.selling = unit.selling;
         this.bedroom = unit.bedroom;
         this.unit = unit.unit;
         this.floor = unit.floor;
         this.block = unit.block;
         this.bathroom = unit.bathroom;
         this.balcony = unit.balcony;
         this.size = unit.size;
         this.furniture = unit.furniture;
         this.pairedInquiriesId = unit.sale_processes;
         this.managementCoverage = unit.managementCoverage;
         this.feeCoverage = unit.feeCoverage;
         this.transferringCoverage = unit.transferringCoverage;
         this.note = unit.note;
         this.rentingFee = unit.rentingFee;
         this.sellingFee = unit.sellingFee;
         this.rentingFeeSale = unit.rentingFeeSale;
         this.sellingFeeSale = unit.sellingFeeSale;
         this.lastNote = unit.last_note;
         this.rentingUrgency = unit.rentingUrgency;
         this.sellingUrgency = unit.sellingUrgency;
         this.rentingDeposit = unit.rentingDeposit;
         this.sellingDeposit = unit.sellingDeposit;
         this.unitStatus = unit.status;
         this.contractExpiry = unit.contractExpiry;
         this.minRentingTime = unit.minRentingTime;
         this.$emit('editingUnit', this.editingUnit)
      },
      toggleSPrice() {
         this.editingSPrice = !this.editingSPrice;
      },
      toggleRPrice() {
         this.editingRPrice = !this.editingRPrice;
      },
      unitFilter(filterData) {
         this.filterData = filterData;
         this.getFilteredData(filterData);
      },
      async getFilteredData(filterData) {
         filterData["sorting"] = this.sorting;
         const res = await post('/agent/get_filtered_units', filterData)
         this.units = res.returnData;
         this.totalUnit = JSON.parse(res.totalResult);
         this.itemPerPage = filterData.listLen;
      },
      toPage(pageNum) {
         this.currentPage = pageNum;
         this.filterData["page"] = this.currentPage;
         this.getFilteredData(this.filterData);
      },
      unitSort(sortValue) {
         this.sorting = sortValue;
         this.getFilteredData(this.filterData);
      },
      uUpdateBtn() {
         this.showErrorBox = false;
         this.updateUnit();
      },
      updated(infoUpdated) {
         this.editingUTab.unitData = infoUpdated;
         // this.getFilteredData(this.filterData);
      },
      closePopup() {
         this.showEditing = !this.showEditing;
      },
   },
   props: {
      pageName: {
         type: String,
         default: ''
      },
      updatedUnit: {
         type: Object,
         default: () => ({})
      },
      currentRole: {
         type: String,
         default: ''
      }
   },
   watch: {
      updatedUnit(newVal) {
         this.updated(newVal)
      },
      sorting(val) {
         this.unitSort(val);
      },
      rentingFee(val) {
         this.rentingFee = Math.min(val, 99);
      },
      sellingFee(val) {
         this.sellingFee = Math.min(val, 99);
      },
      rentingFeeSale(val) {
         this.rentingFeeSale = Math.min(val, 99);
      },
      sellingFeeSale(val) {
         this.sellingFeeSale = Math.min(val, 99);
      },
   },
   mounted() {
      this.getDataLib();
   },
}
</script>

