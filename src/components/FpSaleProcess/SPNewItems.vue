<template>
  <p class="text-title mb-0">
    {{ negoCateTrans(categoryName) }}
  </p>
  <div v-for="(itemData, index) in itemDataList" :key="index" class="d-flex flex-wrap align-items-center"
       :style="{marginTop: marginTop+'px', marginBottom: marginBot+'px'}">
    <div v-if="!canChangeDesc" class="col-auto">
      <span class="text-content me-3">
        {{ itemData.desc }}
      </span>
    </div>
    <div v-else class="col pe-2">
      <input v-model="itemData.desc" :id="'descForm'+index" class="form-control border-white px-0" type="text" :placeholder="descFormPlaceholder[categoryName]" required/>
    </div>
    <div v-if="categoryName !== NegotiateCategoryEnum.OTHER" class="col">
      <div class="row d-flex flex-wrap align-items-center">
        <div class="col">
          <input v-if="itemTypeList[index] === TypeName.DATE" :min="calendarMinDate" max="2099-06-08"
                 v-model="itemData.val" :id="'toDay'+index" class="form-control border-white" type="date" required/>
          <input v-else-if="itemTypeList[index] === TypeName.NUMBER" v-model="itemData.val" :id="'numberForm'+index" class="form-control border-white" type="number" required/>
          <div v-else-if="itemTypeList[index] === TypeName.BOOLEAN" class="form-check form-switch">
            <input v-model="itemData.val" :id="'checkForm'+index" class="form-switch form-switch-xl form-check-input form-control-xxsm" type="checkbox" role="switch"/>
          </div>
          <input v-else v-model="itemData.val" :id="'textForm'+index" class="form-control border-white" type="text" required/>
        </div>
        <div class="col-auto">
          {{ getItemUnit(itemData, itemNames[index]) }}
        </div>
      </div>
    </div>

  </div>

  <div class="row d-flex flex-wrap">
    <div class="col-auto px-2">
      <div class="d-flex">
        <div class="col-auto pe-2 ps-1">
          <ButtonView status="gray-btn" :textSize="14" content="Xác nhận" @click="addItemsBtnClk"/>
        </div>
        <div class="col-auto pe-2 ps-1">
          <ButtonView status="gray-btn" :textSize="14" content="Hủy bỏ" @click="cancelBtnClk"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ButtonView from "@/components/FpButton/ButtonView.vue";
import {getIconUrl, grayToOpacity, calendarMinDate, TypeName, typeCheck} from "@/utils/utils";
import {DefNegotiateItem, DefNegotiateItemType, itemUnit, negoCateTrans, negoItemTrans} from "@/utils/saleProcess";
import {NegotiateCategoryEnum, NegotiateItemEnum} from "@/models/saleProcess";
import {sha256} from "js-sha256";


export default {
  data() {
    return {
      // Data
      itemNames: [],
      itemDataList: [],
      itemTypeList: [],
      // Other
      TypeName,
      NegotiateCategoryEnum,
    }
  },
  components: {ButtonView},
  props: {
    categoryName: {
      type: String,
      required: true,
    },
    canChangeDesc: {
      type: Boolean,
      required: false,
    },
    rent: {
      type: Boolean,
      required: true,
    },
    marginTop: {
      type: Number,
      default: 0,
    },
    marginBot: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    descFormPlaceholder(){
      return {
        [NegotiateCategoryEnum.OTHER]: 'Mô tả điều khoản',
        [NegotiateCategoryEnum.FURNITURE]: 'Điền loại nội thất',
      }
    },
    finalItemData() {
      let returnData = {};
      for (let i = 0; i < this.itemDataList.length; i++) {
        const name = !this.canChangeDesc ? this.itemNames[i] : sha256(this.itemDataList[i].desc)
        returnData[name] = this.itemDataList[i];
      }
      return returnData;
    },
    defCategoryItems() {
      return {
        [NegotiateCategoryEnum.DEPOSIT]: [NegotiateItemEnum.DEPOSIT],
        [NegotiateCategoryEnum.OTHER]: ['other'],
        [NegotiateCategoryEnum.CONTRACT_DURATION]: [NegotiateItemEnum.CONTRACT_DURATION],
        [NegotiateCategoryEnum.FURNITURE]: ['furniture'],
        [NegotiateCategoryEnum.FEE]: (this.rent ? [NegotiateItemEnum.MGMT_COVERAGE] : [NegotiateItemEnum.FEE_COVERAGE, NegotiateItemEnum.TRANSFER_COVERAGE]),
        [NegotiateCategoryEnum.MOVE_IN_DAY]: [NegotiateItemEnum.MOVE_IN_DAY],
      }
    },
    valueRequired() {
      return ![NegotiateCategoryEnum.OTHER, NegotiateCategoryEnum.FEE].includes(this.categoryName);
    },
    hasEmptyValue(){
      for (let idx in this.itemDataList){
        if (!this.itemDataList[idx].val){
          // console.log('itemData: ', this.itemDataList[idx].val);
          return true;
        }
      }
      return false;
    },
    hasEmptyDesc(){
      for (let idx in this.itemDataList){
        if (!this.itemDataList[idx].desc){
          // console.log('itemDesc: ', this.itemDataList[idx].desc);
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    negoItemTrans,
    getIconUrl,
    grayToOpacity,
    negoCateTrans,
    calendarMinDate,
    getItemUnit(itemData, itemName) {
      return itemUnit(itemData, itemName, this.rent);
    },
    newCategoryItems(category) {
      return this.defCategoryItems[category].map(val => {
        try {
          return JSON.parse(JSON.stringify(DefNegotiateItem[val]));
        } catch (err) {
          return JSON.parse(JSON.stringify(DefNegotiateItem['other']));
        }
      })
    },
    newCategoryNames(category) {
      return this.defCategoryItems[category];
    },
    newCategoryItemsType(category) {
      return this.defCategoryItems[category].map(val => {
        try {
          return JSON.parse(JSON.stringify(DefNegotiateItemType[val]));
        } catch (err) {
          return JSON.parse(JSON.stringify(DefNegotiateItemType['other']));
        }
      })
    },
    cancelBtnClk() {
      this.$emit('canceled');
    },
    addItemsBtnClk() {
      if (this.hasEmptyDesc || (this.valueRequired && this.hasEmptyValue)){
        // console.log('AXC: ', (this.hasEmptyValue))
        return;
      }
      this.$emit('addItem', this.finalItemData);
    },
  },
  watch: {
    categoryName(val) {
      this.itemDataList = this.newCategoryItems(val);
      this.itemTypeList = this.newCategoryItemsType(val);
      this.itemNames = this.newCategoryNames(this.categoryName);
      // console.log(this.itemTypeList)
    },
    itemDataList: {
      handler(val) {
        for (let idx in this.itemDataList){
          if (typeCheck(this.itemDataList[idx].val) === TypeName.NUMBER){
            this.itemDataList[idx].val = Math.max(0, this.itemDataList[idx].val);
          }
        }
      },
      deep: true,
    },
  },
  emits: ['canceled', 'addItem'],
  mounted() {
    this.itemDataList = this.newCategoryItems(this.categoryName);
    this.itemTypeList = this.newCategoryItemsType(this.categoryName);
    this.itemNames = this.newCategoryNames(this.categoryName);
  }
}
</script>

