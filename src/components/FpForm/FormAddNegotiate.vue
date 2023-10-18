<template>
  <div  class="border border-gray rounded-3 p-3 mt-3">
    <div class="row">
      <b class="text-content text-gray mb-3">Thêm điều khoản</b>
    </div>

    <div v-if="!addingCategory" class="row d-flex flex-wrap" style="margin-bottom: 10px">
      <div v-for="(btnName, btnValue, index) in newCategoryBtnData" :key="index" class="col-auto mt-3">
        <ButtonView status="gray-btn"  :textSize="14" :content="btnName" @click="addingCategory=btnValue"/>
      </div>
      <div class="col"></div>
    </div>

    <div v-else class="row d-flex flex-wrap" style="margin-bottom: 10px">
      <div class="col-12">
        <SPNewItems
            v-if="addingCategory !== NegotiateCategoryEnum.PRICE"
            :rent="rent" :categoryName="addingCategory"
            :canChangeDesc="canChangeDesc(addingCategory)"
            @canceled="onCancelNewItems"
            @addItem="onAddNewItems"
        />
      </div>
    </div>
  </div>
</template>

<script>

import {defineComponent} from "vue";
import SPPriceItem from "@/components/FpSaleProcess/SPPriceItem.vue";
import SPNegoItem from "@/components/FpTag/SPNegoItem.vue";
import {NegotiateCategoryEnum, NegotiateItemEnum} from "@/models/saleProcess";
import {justApproveNegoItem, negoItemApproved, negoItemDenied} from "@/utils/saleProcess";
import SPNewItems from "@/components/FpSaleProcess/SPNewItems.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";

export default defineComponent({
  components: {
    SPNegoItem,
    SPPriceItem,
    SPNewItems,
    ButtonView
  },
  data() {
    return {
      // temporaryData
      addingCategory: '',
      addingItems: {},
      addingItemsType: [],

      otherData: 0,
      approvedData: 0,
      deniedData: 0,
      // controller
      showNewItemSection: false,
      NegotiateCategoryEnum,
      openOtherData: true,
      openOwnData: false,
      openApprovedData: false,
      openDeniedData: false,
    };
  },
  props:{
    curNegoData: {
      type: Object,
      required: true,
    },
    spData: {
      type: Object,
      required: true,
    },
    editable: {
      type: Boolean,
      required: true,
    },
    rent: {
      type: Boolean,
      required: true,
    },
    isAgent: {
      type: Boolean,
      required: true,
    },
    oneMan: {
      type: Boolean,
      required: false,
    },
    priceEnable: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    NegotiateItemEnum() {
      return NegotiateItemEnum
    },
    otherNegoEmpty(){
      return this.emptyNegoStt(this.otherNegoItemPendingCheck);
    },
    approvedNegoEmpty(){
      return this.emptyNegoStt(negoItemApproved);
    },
    deniedNegoEmpty(){
      return this.emptyNegoStt(negoItemDenied);
    },
    negoItems() {
      return this.curNegoData.negotiate;
    },
    newCategoryBtnData(){
      return this.rent ? this.newCategoryBtnDataRent : this.newCategoryBtnDataSell;
    },
    newCategoryBtnDataRent() {
      return {
        [NegotiateCategoryEnum.FURNITURE]: 'Thương lượng nội thất',
        [NegotiateCategoryEnum.FEE]: 'Các loại phí',
        [NegotiateCategoryEnum.DEPOSIT]: 'Thương lượng đặt cọc',
        [NegotiateCategoryEnum.MOVE_IN_DAY]: 'Ngày dọn vào',
        [NegotiateCategoryEnum.CONTRACT_DURATION]: 'Thời hạn hợp đồng',
        [NegotiateCategoryEnum.OTHER]: 'Điều khoản khác',
      }
    },
    newCategoryBtnDataSell() {
      return {
        [NegotiateCategoryEnum.FURNITURE]: 'Thương lượng nội thất',
        [NegotiateCategoryEnum.FEE]: 'Các loại phí',
        [NegotiateCategoryEnum.DEPOSIT]: 'Thương lượng đặt cọc',
        [NegotiateCategoryEnum.MOVE_IN_DAY]: 'Ngày dọn vào',
        [NegotiateCategoryEnum.OTHER]: 'Điều khoản khác',
      }
    },
  },
  methods:{
    onCancelNewItems() {
      this.addingCategory = '';
    },
    canChangeDesc(category) {
      return [NegotiateCategoryEnum.OTHER, NegotiateCategoryEnum.FURNITURE].includes(category);
    },
    onAddNewItems(itemData) {
      for (const itemName in itemData) {
        justApproveNegoItem(itemData[itemName], this.isAgent, true);
        // special case one user do both Agent - Sales
        if (this.oneMan){
          justApproveNegoItem(itemData[itemName], !this.isAgent);
        }
      }
      this.curNegoData.negotiate[this.addingCategory] = {...this.curNegoData.negotiate[this.addingCategory], ...itemData};
      if (this.oneMan){
      }
      const firstItemName = Object.keys(itemData)[0];
      this.notifyNewNego(this.addingCategory, itemData[firstItemName]);
      this.addingCategory = '';
    },
  }
})
</script>