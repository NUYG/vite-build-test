<template>
  <div class="d-flex flex-wrap align-items-center" :style="{marginTop: marginTop+'px', marginBottom: marginBot+'px'}">
    <div class="col col-md-12 col-xxl">
      <span v-if="!editing" class="text-content">
        {{ isAgent ? itemData.desc : 'Khách cần trả' }} {{ getSPFinalPrice(negoData, rent, unitData, isAgent) }} {{ getItemUnit }}
      </span>
      <div v-if="editing" class="row d-flex flex-wrap align-items-center mb-2">
        <div class="col-xxl-auto col-sm-auto col-12">
          <span class="text-content me-3">
            {{ itemData.desc }}
          </span>
        </div>
        <div class="col col-sm-3 col-md-3">
          <input v-model.lazy="editingVal" id="numberForm" step=".1" class="p-0 form-control border-white" type="number" pattern="\d*" required/>
        </div>
        <div class="col-auto">
          {{ getItemUnit }}
        </div>

      </div>

      <div v-if="editing" class="row d-flex flex-wrap align-items-center">
        <div class="col-xxl-auto col-md-12 col-sm-auto col-12">
          <span class="text-content me-3">Hỗ trợ khách</span>
        </div>
        <div class="col col-sm-3 col-md-3">
          <input v-if="isAgent" v-model="editingASF" id="numberForm" class="p-0 form-control border-white" type="number"
                 required pattern="\d*"/>
          <input v-if="!isAgent" v-model="editingSSF" id="numberForm" class="p-0 form-control border-white"
                 type="number" required pattern="\d*"/>
        </div>
        <div class="col-auto">{{ rent ? 'Tr/Tháng' : 'Tr'}}</div>

      </div>

      <div v-if="editing" class="row d-flex flex-wrap align-items-center">
        <div class="col">
          <span class="text-content text-gray me-3">Hoa hồng còn lại {{ FinalFeeCalculate(negoData, rent, unitData, isAgent, (isAgent ? editingASF : editingSSF), editingVal) }} Tr</span>
          <br>
          <span v-if="!isAgent" class="text-content text-gray me-3">Khách cần trả {{ cusFinalPriceCalculate(editingASF, rent, editingSSF, editingVal) }} {{ rent ? 'Tr/Tháng' : 'Tr'}}</span>
        </div>
        <div class="col-auto">
          <div class="row d-flex flex-wrap">
            <div class="col-auto pe-3 ps-1">
              <ButtonView :btnIcon="getIconUrl('XCircleIcon.svg')" :btnOpacity="16" :iconSize="29" :rmPadding="true"
                          @click="onEditCancelClk" status="no-bg-btn"/>
            </div>
            <div class="col-auto pe-2 ps-2">
              <ButtonView :btnIcon="getIconUrl('TickCircle.svg')" :btnOpacity="16" :iconSize="29" :rmPadding="true"
                          @click="onEditVerifyClk" status="no-bg-btn"/>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div v-if="!editing && editable" class="col-auto ps-md-0">
      <div class="d-flex">
        <div v-show="canDeny" class="col-auto pe-3 ps-1 ps-md-0">
          <ButtonView :btnIcon="getIconUrl('XCircleIcon.svg')" :btnOpacity="16" :iconSize="29" :rmPadding="true"
                      @click="onDenyClk" status="no-bg-btn"/>
        </div>
        <div v-show="canApprove" class="col-auto pe-2 ps-2">
          <ButtonView :btnIcon="getIconUrl('TickCircle.svg')" :btnOpacity="16" :iconSize="29" :rmPadding="true"
                      @click="onApproveClk" status="no-bg-btn"/>
        </div>
        <div v-show="canChange" class="col-auto pe-2 ps-1 ps-md-0">
          <ButtonView  :textSize="14" content="Chỉnh sửa" @click="editing=true" status="gray-btn"/>
        </div>
        <div v-show="canDelete" class="col-auto pe-2 ps-1 ps-md-0">
          <ButtonView status="gray-btn" :textSize="14" content="Thu hồi" @click="onDelClk"/>
        </div>
        <div v-show="canSugDelete" class="col-auto pe-2 ps-1 ps-md-0">
          <ButtonView status="gray-btn" :textSize="14" content="Thu hồi" @click="onSugDelClk"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ButtonView from "@/components/FpButton/ButtonView.vue";
import {calendarMinDate, clamp, floatBugFixed, getIconUrl, grayToOpacity, typeCheck, TypeName} from "@/utils/utils";
import {
  descEditableCategory, getSPFinalPrice,
  itemUnit, getSPPriceVal2,
  justApproveNegoItem, setSPPriceAgent,
  valueEditableCategory, FinalFeeCalculate, cusFinalPriceCalculate
} from "@/utils/saleProcess";
import {NegotiateCategoryEnum, NegotiateItemEnum} from "@/models/saleProcess";

export default {
  components: {ButtonView},
  data() {
    return {
      editing: false,
      editingDesc: '',
      editingVal: '',
      editingASF: 0,
      editingSSF: 0,
      // Other
      TypeName,
    }
  },
  props: {
    negoData: {
      type: Object,
      required: true,
    },
    unitData: {
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
      required: true,
    },
    canApprove: {
      type: Boolean,
      default: true,
    },
    canDeny: {
      type: Boolean,
      default: true,
    },
    canChange: {
      type: Boolean,
      default: false
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
    canSugDelete: {
      type: Boolean,
      default: false,
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
    itemData() {
      return this.negoData.price;
    },
    itemName() {
      return NegotiateItemEnum.PRICE;
    },
    cateName() {
      return NegotiateCategoryEnum.PRICE;
    },
    getItemUnit() {
      return itemUnit(this.itemData, this.itemName, this.rent);
    },
    calendarMinDate,
    maxSSF(){
      return floatBugFixed(this.editingVal * (this.rent ? (1/12) : 10) * this.negoData.sFeePercent / 100);
    },
    maxASF(){
      return floatBugFixed(this.editingVal * (this.rent ? (1/12) : 10) - this.maxSSF);
    },
  },
  methods: {
    cusFinalPriceCalculate,
    FinalFeeCalculate,
    getSPFinalPrice,
    getSPPriceVal2,
    getIconUrl,
    grayToOpacity,
    descEditableCategory,
    valueEditableCategory,
    //
    setPriceVal(val) {
      this.editingVal = getSPPriceVal2(this.negoData.price, this.rent, this.unitData);
    },
    typeCheck,
    approveItem(agent){
      justApproveNegoItem(this.itemData, agent);
      this.$emit('approved');
    },
    onApproveClk() {
      this.approveItem(this.isAgent);
    },
    onDenyClk() {
      this.$emit('deleted');
      this.notifyPriceRejected();
    },
    onDelClk() {
      this.$emit('deleted');
    },
    onSugDelClk() {
      this.$emit('reset');
    },
    onEditVerifyClk() {
      setSPPriceAgent(this.negoData, this.editingVal, this.editingASF, this.editingSSF, this.rent, this.isAgent);
      this.editing = false;

      if (this.oneMan){
        // if one user do this negotiate, automatic applied approve
        this.approveItem(!this.isAgent);
      } else {
        this.notifyPriceChange();
      }
    },
    onEditCancelClk() {
      this.editingDesc = this.itemData.desc;
      this.setPriceVal(this.itemData.val);
      this.editingASF = this.negoData.aSF;
      this.editingSSF = this.negoData.sSF;
      this.editing = false;
    },
    notifyPriceChange(){
      this.$emit('updated');
    },
    notifyPriceRejected(){
      this.$emit('denied');
    },
  },
  watch: {
    editingVal(val){
      this.editingVal = Math.max(0.01, val);
      this.editingASF = clamp(this.editingASF, 0, this.maxASF);
      this.editingSSF = clamp(this.editingSSF, 0, this.maxSSF);
    },
    editingASF(val){
      this.editingASF = clamp(val, 0, this.maxASF);
    },
    editingSSF(val){
      this.editingSSF = clamp(val, 0, this.maxSSF);
    }
  },
  mounted() {
    this.onEditCancelClk();
  },
  emits: ['approved', 'denied', 'deleted', 'updated', 'reset']
}
</script>

