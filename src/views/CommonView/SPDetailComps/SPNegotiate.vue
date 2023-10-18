<template>
  <!-- region: Other Pending-->
  <div v-show="!otherNegoEmpty" class="border border-gray rounded-3 p-3 mt-3">
    <div class="row d-flex flex-wrap">
      <div class="col">
        <b class="text-content text-gray mb-4">{{ ownerOrCus(false) }} đề xuất </b>
      </div>
      <div class="col-auto">
        <ButtonView :btnIcon="getIconUrl('chevron-left.svg')" :btnOpacity="16" :iconSize="29" :rmPadding="true"
                    :rotate="270" status="no-bg-btn"
                    @click="openOtherData=!openOtherData"/>
      </div>
    </div>

    <div v-show="openOtherData" class="mt-4">
      <div v-if="priceEnable && otherNegoItemPending(curNegoData.price, isAgent)" class="row">
        <SPPriceItem
          :negoData="curNegoData" :rent="rent" :isAgent="isAgent" :unitData="spData.unitData"
          :editable="editable" :oneMan="oneMan"
          @approved="onPriceApproved" @deleted="onPriceDeleted" @updated="notifyNegoChange"
        />
      </div>

      <div v-for="(categoryData, categoryName, cIndex) in negoItems" :key="cIndex" class="row d-flex flex-wrap">
        <div v-for="(itemData, itemName, index) in categoryData" :key="index" class="col-12">
          <SPNegoItem v-if="otherNegoItemPending(itemData, isAgent)" :itemData="itemData" :itemName="itemName"
                      :rent="rent" :editable="editable" :oneMan="oneMan"
                      :isAgent="isAgent" :cateName="categoryName"
                      @approved="onItemApproved" @deleted="onItemDeleted" @updated="notifyNegoChange" @denied="notifyNegoDeny"
          />
        </div>
      </div>
    </div>

  </div>
  <!--  endregion  -->


  <!-- region: Own Pending-->

  <div v-if="!hiddenAddNewItemSection" class="border border-gray rounded-3 p-3 mt-3">
    <div class="row d-flex flex-wrap">
      <div class="col">
        <b class="text-content text-gray mb-4">{{ ownerOrCus(true) }} đề xuất</b>
      </div>
      <div class="col-auto">
        <ButtonView :btnIcon="getIconUrl('chevron-left.svg')" :btnOpacity="16" :iconSize="29" :rmPadding="true"
                    :rotate="270" status="no-bg-btn"
                    @click="openOwnData=!openOwnData"/>
      </div>
    </div>

    <div v-show="openOwnData" class="mt-4">
      <div v-if="priceEnable && ownNegoItemPending(curNegoData.price, isAgent)" class="row">
        <SPPriceItem
          :negoData="curNegoData" :rent="rent" :isAgent="isAgent" :unitData="spData.unitData"
          :canApprove="false" :canDeny="false" :canDelete="true" :canChange="true" :editable="editable"
          :oneMan="oneMan"
          @deleted="onPriceDeleted" @updated="notifyNegoChange" @denied="notifyPriceDeny"
        />
      </div>

      <div v-for="(categoryData, categoryName, index) in negoItems" :key="index" class="row d-flex flex-wrap">
        <!--      <div class="col-12 text-title mb-0">-->
        <!--        {{ negoCateTrans(categoryName) }}-->
        <!--      </div>-->
        <div v-for="(itemData, itemName, index) in categoryData" :key="index" class="col-12">
          <SPNegoItem v-if="ownNegoItemPending(itemData, isAgent)" :itemData="itemData" :itemName="itemName"
                      :rent="rent" :editable="editable" :oneMan="oneMan"
                      :isAgent="isAgent" :canApprove="false" :canDeny="false" :canDelete="true" :canChange="true"
                      :cateName="categoryName" @deleted="onItemDeleted" @updated="notifyNegoChange"
          />
        </div>
      </div>
    </div>

    <div v-if="editable" class="row d-flex flex-wrap mt-2" style="margin-bottom: 10px">
      <div class="col-auto">
        <ButtonView status="more-btn" :textSize="14" content="Thêm điều khoản"
                    @click="newItemsBtnClk"/>
      </div>
      <div class="col"></div>
    </div>
  </div>

  <div v-show="showNewItemSection && editable" class="border border-gray rounded-3 p-3 mt-3">
    <div class="row">
      <b class="text-content text-gray mb-3">{{!hiddenAddNewItemSection ? 'Thêm điều khoản' : 'Thương lượng'}}</b>
    </div>

    <div v-if="!addingCategory" class="row d-flex flex-wrap" style="margin-bottom: 10px">
      <div v-for="(btnName, btnValue, index) in newCategoryBtnData" :key="index" class="col-auto mt-3">
        <ButtonView status="gray-btn" :textSize="14" :content="btnName" @click="addingCategory=btnValue"/>
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
  <!--  endregion  -->

  <!--region:approved-->
  <div v-show="!approvedNegoEmpty" class="border border-gray rounded-3 p-3 mt-3">
    <div class="row d-flex flex-wrap" v-if="!hiddenAddNewItemSection">
      <div class="col">
        <b class="text-content text-gray mb-4">Thương lượng</b>
        <br>
        <b class="text-content textRentColor">Đã đồng thuận</b>
      </div>
      <div class="col-auto">
        <ButtonView :btnIcon="getIconUrl('chevron-left.svg')" :btnOpacity="16" :iconSize="29" :rmPadding="true"
                    :rotate="270" status="no-bg-btn"
                    @click="openApprovedData=!openApprovedData"/>
      </div>
    </div>

    <div v-show="openApprovedData" class="mt-4">
      <div v-if="priceEnable && negoItemApproved(curNegoData.price)" class="row">
        <SPPriceItem
          :negoData="curNegoData" :rent="rent" :isAgent="isAgent" :unitData="spData.unitData"
          :canChange="true" :canSugDelete="true" :canApprove="false" :canDeny="false"
          :editable="editable" :oneMan="oneMan"
          @deleted="onPriceDeleted" @reset="onPriceReset" @updated="notifyNegoChange" @approved="onPriceApproved"
        />
      </div>

      <div v-for="(categoryData, categoryName, index) in negoItems" :key="index" class="row d-flex flex-wrap">
        <div v-for="(itemData, itemName, index) in categoryData" :key="index" class="col-12">
          <SPNegoItem
            v-if="negoItemApproved(itemData)"
            :itemData="itemData" :canApprove="false" :canDeny="false" :cateName="categoryName"
            :canChange="true" :canSugDelete="true" :itemName="itemName" :rent="rent" :isAgent="isAgent"
            :editable="editable" :oneMan="oneMan"
            @updated="notifyNegoChange" @approved="onItemApproved"
          />
        </div>
      </div>
    </div>
  </div>
  <!--  endregion-->

  <!--region:denied-->
  <div v-show="!deniedNegoEmpty"  class="border border-gray rounded-3 p-3 mt-3">
    <div class="row d-flex flex-wrap">
      <div class="col">
        <b class="text-content text-gray mb-4">Thương lượng</b>
        <br>
        <b class="text-content textSellColor">Bị từ chối</b>
      </div>
      <div class="col-auto">
        <ButtonView :btnIcon="getIconUrl('chevron-left.svg')" :btnOpacity="16" :iconSize="29" :rmPadding="true"
                    :rotate="270" status="no-bg-btn"
                    @click="openDeniedData=!openDeniedData"/>
      </div>
    </div>

    <div v-show="openDeniedData" class="mt-4">
      <div v-if="priceEnable && negoItemDenied(curNegoData.price)" class="row">
        <SPPriceItem
          :negoData="curNegoData" :rent="rent" :isAgent="isAgent" :unitData="spData.unitData"
          :canDelete="true" :canChange="true" :canApprove="false" :canDeny="false"
          :editable="editable" :oneMan="oneMan"
          @deleted="onPriceDeleted" @updated="notifyNegoChange" @approved="onPriceApproved"
        />
      </div>

      <div v-for="(categoryData, categoryName, index) in negoItems" :key="index" class="row d-flex flex-wrap">
        <div v-for="(itemData, itemName, index) in categoryData" :key="index" class="col-12">
          <SPNegoItem
            v-if="negoItemDenied(itemData)"
            :itemData="itemData" :canApprove="false" :canDeny="false" :cateName="categoryName"
            :canDelete="ownDeniedNegoItem(itemData, isAgent)" :canChange="true" :itemName="itemName" :rent="rent"
            :isAgent="isAgent" :editable="editable" :oneMan="oneMan"
            @deleted="onItemDeleted" @updated="notifyNegoChange" @approved="onItemApproved"
          />
        </div>
      </div>
    </div>
  </div>
  <!--  endregion-->
</template>

<script lang="js">
import {
  denyNegoItem,
  negoItemApproved,
  negoItemDenied,
  negoItemPending,
  negoCateTrans,
  justApproveNegoItem,
  ownNegoItemPending,
  otherNegoItemPending,
  deleteNegoItem,
  negotiateDone,
  checkAndDelNegoItem,
  canDelNegoItem,
  revertDoneNegoItem,
  resetSPPrice,
  revertDoneSPPrice,
  setSPPriceAgent, getCusFinalPrice2, getCusOldPrice2, ownDeniedNegoItem, negoCateTranslator, negotiateApproved,
} from "@/utils/saleProcess";
import SPNegoItem from "@/components/FpTag/SPNegoItem.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import SPNewItems from "@/components/FpSaleProcess/SPNewItems.vue";
import SPPriceItem from "@/components/FpSaleProcess/SPPriceItem.vue";
import {NegotiateCategoryEnum, NegotiateItemEnum} from "@/models/saleProcess";
import {unitPrice} from "@/utils/unit";
import {getIconUrl} from "@/utils/utils";


export default {
  components: {SPNegoItem, ButtonView, SPNewItems, SPPriceItem},
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
  props: {
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
      default: true,
    },
    hiddenAddNewItemSection:{
      type:Boolean,
      default:false
    }
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
  methods: {
    getIconUrl,
    ownDeniedNegoItem,
    otherNegoItemPending,
    ownNegoItemPending,
    denyNegoItem,
    negoItemApproved,
    negoItemDenied,
    negoItemPending,
    negoCateTrans,
    getCusFinalPrice2,
    getCusOldPrice2,
    ownNegoItemPendingCheck(item){
      return ownNegoItemPending(item, this.isAgent);
    },
    otherNegoItemPendingCheck(item){
      return otherNegoItemPending(item, this.isAgent);
    },
    ownerOrCus(myBoss) {
      const owner = myBoss ? this.isAgent : !this.isAgent;
      return (owner) ? 'Chủ nhà' : 'Khách hàng';
    },
    emptyNegoStt(checkFunc){
      if (this.priceEnable &&  checkFunc(this.curNegoData.price)){
        return false;
      }
      const nego = this.curNegoData.negotiate;
      for (const negoCate in nego){
        const negoCateData = nego[negoCate]
        for (const negoItem in negoCateData){
          if (checkFunc(negoCateData[negoItem])){
            return false;
          }
        }
      }
      return true;
    },
    canChangeDesc(category) {
      return [NegotiateCategoryEnum.OTHER, NegotiateCategoryEnum.FURNITURE].includes(category);
    },
    // Controller
    newItemsBtnClk() {
      this.showNewItemSection = !this.showNewItemSection || this.addingCategory;
      this.addingCategory = "";
    },
    // onSignal
    onCancelNewItems() {
      this.addingCategory = '';
    },
    onAddNewItems(itemData) {
      for (const itemName in itemData) {
        justApproveNegoItem(itemData[itemName], this.isAgent, true);
        // special case one user do both Agent - Sales
        if (this.oneMan){
          justApproveNegoItem(itemData[itemName], !this.isAgent);
        }
      }
      const newItemData = {...this.curNegoData.negotiate[this.addingCategory], ...itemData};
      this.curNegoData.negotiate[this.addingCategory] = newItemData;
      if (this.oneMan){
        // takeSPSnapshot(this.curNegoData, this.isAgent).then();
        // console.log('Negotiation done! Take snapshot, piu piu');
      }
      const firstItemName = Object.keys(itemData)[0];
      this.notifyNewNego(this.addingCategory, itemData[firstItemName]);
      this.addingCategory = '';
    },
    onItemApproved(categoryName, itemName) {
      checkAndDelNegoItem(this.curNegoData.negotiate, categoryName, itemName);
      if (negotiateDone(this.curNegoData)) {
        // takeSPSnapshot(this.curNegoData, this.isAgent).then();
        // console.log('Negotiation done! Take snapshot, piu piu');
      }
      this.notifyNegoAccept(categoryName, this.curNegoData.negotiate[itemName]);
    },
    onItemDeleted(categoryName, itemName) {
      const item = this.curNegoData.negotiate[categoryName][itemName];
      if (item.done) {
        revertDoneNegoItem(item);
      } else {
        deleteNegoItem(this.curNegoData.negotiate, categoryName, itemName);
      }
      this.notifyNegoChange();
    },
    onPriceApproved() {
      if (canDelNegoItem(this.curNegoData.price)) {
        resetSPPrice(this.spData, this.curNegoData);
      }
      if (negotiateDone(this.curNegoData)) {
        // takeSPSnapshot(this.curNegoData, this.isAgent).then();
        // console.log('Negotiation done! Take snapshot, piu piu');
      }
      this.notifyNegoAccept(NegotiateCategoryEnum.PRICE, this.curNegoData.price);
    },
    onPriceDeleted() {
      revertDoneSPPrice(this.curNegoData);
      this.notifyNegoChange();
    },
    onPriceReset() {
      setSPPriceAgent(
        this.curNegoData, unitPrice(this.rent, this.spData.unitData),
        0, 0, this.rent, this.isAgent
      )
      this.notifyNegoChange(NegotiateCategoryEnum.PRICE, this.curNegoData.price);
    },
    // APIs
    notifyNegoChange(negoCate, negoItem) {
      this.$emit('nego-change', negoCate, negoItem);
    },
    notifyNewNego(negoCate, negoItem) {
      this.$emit('nego-new', negoCate, negoItem);
    },
    notifyNegoDeny(negoCate, negoItem) {
      this.$emit('nego-deny', negoCate, negoItem);
    },
    notifyPriceDeny() {
      this.notifyNegoDeny(NegotiateCategoryEnum.PRICE, this.curNegoData.price);
    },
    notifyNegoAccept(negoCate, negoItem) {
      this.$emit('nego-accept', negoCate, negoItem);
    },
  },
  watch: {},
  emits: ["nego-change", "nego-new", "nego-deny", "nego-accept"],
  mounted() {
    if(this.hiddenAddNewItemSection)
    {
      this.newItemsBtnClk()
      this.openApprovedData=true
    }
  }
}
</script>

<style scoped>
</style>
