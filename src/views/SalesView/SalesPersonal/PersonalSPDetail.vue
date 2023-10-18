<template>
  <FpDefLayout
    :bc-props="pgMeta"
    :is-loading="!finishLoading"
    :show-loading="true">
    <template #comp>
      <div class="container-fluid">
        <div v-if="currentData && curNegoData" class="row d-flex justify-content-center">
          <div class="col-lg-10 col-12">
            <div class="container">
              <SPProgressNav
                  @status-click="statusIconClicked"
                  :peakLevel="currentProgress"
                  :currentLevel="viewLvl"
                  :canceled="isCanceled"
                  :rentCheck="currentData.rent"
              />
              <div v-show="showingNotify && canEdit" class="p-2">
                <SPNotification
                    @confirm-popup="notifyConfirm"
                    :code="notifyCode"
                    :currentStatus="currentPeakSttLvl"
                    :toStatus="currentSugSttLvl"
                    :dateTime="currentData.nextMeetingDate"
                    :scoutingDate="currentData.scoutingDate"
                    :depDate="currentData.depositDate"
                    :notDate="currentData.notarizeDate"
                    :sigDate="currentData.signingDate"
                    :sugDepDate="skipDepDate"
                    :sugNotDate="skipNotDate"
                    :sugSigDate="skipSigDate"
                    :rent="currentData.rent"
                />
              </div>
              <div class="row d-flex justify-content-between mt-2 ">
                <div class="col-auto px-lg-5"><b
                    style=" font-size: 20px">{{ transSPSttDetail(currentData.status) }} </b></div>
                <div v-show="!showingNotify && canEdit" class="col px-lg-5 mt-2 mt-lg-0">
                  <div class="row d-flex justify-content-end">
                    <div v-show="appointmentLvl === 1" class="col-auto mb-2 mg-md-0">
                      <button @click="nextStepBtnClk" class="col-auto btn-wrap-text small gray-button">
                        {{ nextBtnText }}
                      </button>
                    </div>
                    <div v-show="!isCanceled && !isDone" class="col-auto">
                      <button @click="cancelSaleProcess" class="col-auto btn-wrap-text small gray-button">Hủy
                        đơn
                      </button>
                    </div>
                    <div v-show="canRestoreSP && !isDone" class="col-4">
                      <button @click="restoreSaleProcess" class="w-100 btn-wrap-text small gray-button"> Khôi
                        phục
                      </button>
                    </div>

                  </div>
                </div>
              </div>
              <div class="mt-4 row d-md-flex justify-content-around " style="align-items: flex-start">
                <div class="col-md-5 col-12 order-1 order-md-0" v-if="isMobileEditCurrentData">

                  <div v-show="!viewingOldStep">
                    <div v-show="!appointmentSet">
                      <SPDTimePicker
                          v-show="!isLocked"
                          @add-free-time="setFreeTime"
                          :aPickedTime="currentData.aFreeTime"
                          :sPickedTime="currentData.sFreeTime"
                      />
                    </div>

                    <div v-show="appointmentSet" class="border border-gray rounded-3 p-3 mt-3">
                      <div class="d-lg-flex ">
                        <div class="col-lg-9 col-12">
                          <img alt="" :src="getIconUrl('CalendarCheck.svg')">
                          <span class="text-content"> Đã {{
                              transProcessStatus(this.currentData.status).toLowerCase()
                            }} vào {{
                              getTime(currentData.nextMeetingDate)
                            }} {{ getDdMm(currentData.nextMeetingDate) }}
                        </span>
                        </div>
                        <div v-if="!isLocked" class="col-lg col-12 mt-2 mt-lg-0">
                          <button @click="resetAppointment"
                                  class="gray-button w-100 rounded btn-wrap-text small"> Hẹn lại
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-show="viewingOldStep" class="border border-gray rounded-3 p-3 mt-3">
                    <img alt="" :src="getIconUrl('CalendarBlank.svg')">
                    <span> Đã {{
                        progressLvlName(viewLvl).toLowerCase()
                      }} vào ngày  {{
                        getTime(getMetDayAtLvl(viewLvl))
                      }} {{ getDdMmYyyy(getMetDayAtLvl(viewLvl)) }}
                   </span>
                  </div>

                  <div class="mt-2">
                    <SPNegotiate
                        :spData="currentData"
                        :curNegoData="curNegoData"
                        :rent="defaultData.rent"
                        :isAgent="false"
                        :editable="!isLocked"
                        :oneMan="true"
                        :priceEnable="false"
                        @nego-change="onNegotiateChange"
                        @nego-deny="onNegotiateDenied"
                        @nego-accept="onNegotiateAccepted"
                        @nego-new="onNegotiateCreated"
                        :hiddenAddNewItemSection="true"
                    />
                  </div>
                </div>
                <div v-if="!editInfo" class="col-md-6 col-12 mt-3 mt-md-0 order-0 order-md-1">
                  <div class="rounded-3 p-lg-5 p-3" style="background-color: #F7F9FB">
                    <div class="d-flex row justify-content-between">
                    <span class="col-auto d-flex align-items-center text-color-black font-weight-600 text-title cursor-pointer" @click="goCusGeneral">
                      {{tagTitle}}
                    </span>
                      <span class="col-auto" style="border-radius: 8px;background: #F2F2F2;padding: 8px">
                      <FpIcon srcIcon="PencilPick.svg" :size="24" @click="editInfo=true"></FpIcon>
                    </span>
                    </div>
                    <!--                  <p>{{ cusName.status }}</p>-->
                    <div class="row mt-3 rounded-3 p-2 py-3" style="background-color: #E5ECF6" v-if="finalPrice && finalPrice>0">
                      <div class="col-auto border-end me-3">
                        <div class="row d-flex">
                          <div class="col-auto tab-content font-weight-400">Giá </div>
                        </div>
                        <span class="d-block font-weight-600 text-title">{{ finalPrice }} {{uPricePfxHalfExt(currentData.rent)}}</span>
                      </div>
                      <div class="col" v-if="isSales">
                        <span class="col-auto tab-content font-weight-400">Hoa hồng của tôi</span>
                        <span class="d-block font-weight-600 text-title" v-if="finalSalesFee>0">{{ finalSalesFee }} Tr</span>
                      </div>
                    </div>
                    <div class="row mt-3 d-flex">
                      <FpPjInformationTag :iconsize="18" v-bind="getUnitInformation(currentData)"
                      />
                    </div>
                    <div class="mt-3 " v-if="currentData.moveDay">
                      Ngày ở: {{ getDdMm(currentData.moveDay) }}
                    </div>
                  </div>
                  <div class="col-auto  d-flex p-1  mt-3 rounded">
                    <textarea name="note" cols="40" rows="10" v-model="currentData.salesNote" class="form-control small-text-box" placeholder="Ghi chú"></textarea>
                  </div>
                </div>
                <div v-else class="col-md-6 col-12 mt-3 mt-md-0 order-0 order-md-1">
                  <PersonalSPDetailEdit :editData="getContentEdit(currentData)" :renting="getContentEdit(currentData).rent"
                                        @completeEditData="onCurrentDataChange" @cancelEdit="editInfo=false"
                  ></PersonalSPDetailEdit>
                </div>
              </div>

            </div>
          </div>

        </div>
<!--        <div v-else class="container d-flex vh-100 justify-content-center align-items-center">-->
<!--          <h1 class="text-center"> {{ serverResText }} </h1>-->
<!--        </div>-->

      </div>

    </template>

  </FpDefLayout>
</template>

<script>
import {
  dictTranslate,
  floatFixed,
  getIconUrl, getItemFromLocalStorage,
  getObjField,
  phoneCall, setLocalStorageItem,
  translate,
  typeCheck,
  TypeName
} from "@/utils/utils";
import {goToURL} from "@/utils/utils";
import {getCompareValue, post} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {addZeroToDateTime, ddMmYyyy, fixDateTime, getDdMm, getTime} from "@/utils/dateTimeUtils";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {breadcrumpProp} from "@/models/customProp";

import SwipeBox from "@/components/FpImg/SwipeBox.vue";
import ImgMgmt from "@/components/FpImg/ImgMgmt.vue";
import SPProgressNav from "@/views/CommonView/SPDetailComps/SPProgressNav.vue";
import SPDTimePicker from "@/views/CommonView/SPDetailComps/SPDTimePicker.vue";
import SPNotification from "@/views/CommonView/SPDetailComps/SPNotification.vue";
import SPNegotiate from "@/views/CommonView/SPDetailComps/SPNegotiate.vue";

import FpDefLayout from "@/views/FpDefLayout.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpPjInformationTag from "@/components/FpTag/FpPjInformationTag.vue";
import {S_CUS_DETAIL_URL} from "@/router/URLs";

import {getStatusTextByRent, transFurniture, uPricePfx, uPricePfxExt, uPricePfxHalfExt} from "@/utils/unit";
import {Roles} from "@/utils/constants";
import {favObj} from "@/utils/favAPI";
import {
  getSPFinalPrice,
  itemUnit,
  negotiateDone
} from "@/utils/saleProcess";
import {NegotiateItemEnum} from "@/models/saleProcess";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import PersonalSPDetailEdit from "@/views/SalesView/SalesPersonal/PersonalSPDetailEdit.vue";
import {debounce} from "lodash/function";

const defaultViewLvl = -99;
const ProgressLevel = {
  0: "waiting",
  1: "depositing",
  3: "notarizing",
  5: "signing",
  7: "done",
};

const StatusLevel = {
  ownCanceled: -10,
  cusCanceled: -10,
  waiting: 0,
  depositing: 2,
  notarizing: 4,
  signing: 6,
  done: 8,
};

const NextBtnTxt = {
  0: "Đã xem nhà",
  2: "Đã cọc",
  4: "Đã công chứng",
  6: "Đã ký hợp đồng",
};

export default {
  components: {
    PersonalSPDetailEdit,
    FpIcon,
    FpDefLayout,
    SwipeBox,
    // SPDetailRBar,
    ImgMgmt,
    SPProgressNav,
    SPDTimePicker,
    SPNegotiate,
    SPNotification,
    FpPjInformationTag,
    ButtonView
  },
  data() {
    return {
      // data
      defaultData: {},
      currentData: {},
      editInfo:true,
      // negotiateData
      defNegoData: {},
      curNegoData: false,
      // skippingData
      skipStt: '',
      skipScoDate: null,
      skipDepDate: null,
      skipNotDate: null,
      skipSigDate: null,
      serverResText: "",
      // controller
      waitToNextStep: false,
      viewLvl: defaultViewLvl,
      refreshLocking: false,
      negoRefreshLocking: false,
      upLocking: false,
      upWaiting: false,
      newMessage: true,
      // Negotiate controller
      negoUpLocking: false,
      negoUpWaiting: false,
      negoUpdatingType: '',
      updatingNegoCate: '',
      updatingNegoItem: null,
      // Translate
      POINTING: [],
      UNIT_TYPE: [],
      SALE_PROCESS_STATUS: [],
      SP_STATUS_AD_SELL: [],
      SP_STATUS_AD_RENT: [],
      HEIGHT: [],
      // Meta
      pgMeta: {
        [breadcrumpProp.title]: '',
        [breadcrumpProp.enableFav]: true,
        [breadcrumpProp.defFav]: false,
        [breadcrumpProp.favObjType]: favObj.PSP,
        [breadcrumpProp.favObjId]: this.pspID ? this.pspID : -1,
        // [breadcrumpProp.enableRB]: true,
        [breadcrumpProp.rBIcon]: 'chatIcon.svg',
      },
      finishLoading:false
    }
  },
  props: {
    role: {
      type: String,
      default:Roles.Sales
    },
    pspID: {
      type: Number,
      required: true
    },
    setEditDefault:{
      type:Number,
      default:1
    }
  },
  computed: {
    getAllNegotiateText() {
      let negotiateText = '';
      if (this.curNegoData && this.curNegoData.negotiate && Object.keys(this.curNegoData.negotiate).length > 0) {
        for (const category in this.curNegoData.negotiate) {
          const obj = this.curNegoData.negotiate[category];
          for (const subCategory in obj) {
            const subObj = obj[subCategory];
            const val = subObj?.val;
            const done = subObj?.done;
            const desc = subObj?.desc;
            if (val !== undefined && done !== undefined && desc !== undefined) {
              negotiateText += '' + desc + this.valTranslate(val) + (itemUnit(subObj, subCategory, this.currentData.rent) || '') + ',';
            }
          }
        }
      }
      return negotiateText;
    },
    negotiateAllApproved() {
      return negotiateDone(this.curNegoData);
    },
    negotiateRestricted() {
      return this.currentProgress >= 2 && !this.negotiateAllApproved;
    },
    NegotiateItemEnum() {
      return NegotiateItemEnum
    },
    finalPrice() {
      return this.currentData.price;
    },
    finalSalesFee() {
      return this.currentData.fee;
    },
    rentStatus() {
      return this.currentData.rent ? 'Thuê' : 'Mua'
    },
    cusName() {
      return {
        name: this.currentData?.customerData?.name,
        status: ` ${this.rentStatus}  ${this.currentData?.unitData?.pjData.name}`,
        phone: this.currentData?.customerData?.phone
      }
    },
    nextBtnText() {
      return NextBtnTxt[this.currentPeakSttLvl];
    },
    validateData() {
      return {
        role: Roles.Sales,
        id: this.pspID ? this.pspID : -1,
        validate: this.defaultData,
      };
    },
    currentPeakSttLvl() {
      return StatusLevel[this.currentData.peakStatus];
    },
    currentSugSttLvl() {
      return StatusLevel[this.skipStt];
    },
    appointmentLvl() {
      return this.appointmentSet ? 1 : 0;
    },
    appointmentSet() {
      return this.currentData.nextMeetingDate != null;
    },
    currentProgress() {
      return this.currentPeakSttLvl + this.appointmentLvl;
    },
    isSales() {
      return true;
    },
    canEdit() {
      return true;
    },
    isCanceled() {
      return ["ownCanceled", "cusCanceled"].includes(this.currentData.status);
    },
    isDone() {
      return this.currentData.peakStatus === "done";
    },
    isLocked() {
      return (
        this.isCanceled ||
        ![Roles.Agent, Roles.Sales].includes(this.role) ||
        this.showingNotify ||
        this.isDone
      );
    },
    canRestoreSP() {
      return this.currentData.sales_can_restore && this.isCanceled;
    },
    showingNotify() {
      return this.showSkipNoti || this.showNextStepNoti;
    },
    showSkipNoti() {
      return this.skipping;
    },
    showNextStepNoti() {
      return this.waitToNextStep;
    },
    notifyCode() {
      return this.showSkipNoti
        ? "skipStatus"
        : this.showNextStepNoti
          ? "confirmStatus"
          : "confirmDate";
    },
    skipping() {
      return this.skipStt !== "";
    },
    viewingOldStep() {
      return this.viewLvl !== this.currentPeakSttLvl || this.isDone;
    },
    getNextLvl() {
      return this.currentPeakSttLvl + 2;
    },
    isPC() {
      return scrWdtFrom(scrWdtEnum.LG);
    },
    userNote() {
      return this.currentData.salesNote;
    },
    // Negotiate computed
    negoValidateData() {
      return {
        role: Roles.Sales,
        id: this.pspID ? this.pspID : -1,
        validate: this.defNegoData,
      };
    },
    negoUpdateData() {
      return {
        upType: this.negoUpdatingType,
        negoCate: this.updatingNegoCate,
        negoItem: this.updatingNegoItem,
      }
    },
    isMobileEditCurrentData() {
      return !(!scrWdtFrom(scrWdtEnum.MD) && this.editInfo)
    },
    tagTitle()
    {
        const name = `${this.currentData?.cusData?.name} ${getStatusTextByRent(this.currentData?.rent)} ${this.currentData?.pjName}`
        return this.currentData.name ? this.currentData.name : name

    }
  },
  methods: {
    uPricePfxHalfExt,
    uPricePfx,
    uPricePfxExt,
    itemUnit,
    getSPFinalPrice,
    translate,
    transFurniture,
    fixDateTime,
    floatFixed,
    addZeroToDateTime,
    getIconUrl,
    goToURL,
    phoneCall,
    getContentEdit(currentData)
    {
      return {
        name:getObjField(currentData,'name'),
        price:getObjField(currentData,'price'),
        bedroom:getObjField(currentData,'bedroom'),
        rent:getObjField(currentData,'rent'),
        bathroom:getObjField(currentData,'bathroom'),
        size:getObjField(currentData,'size'),
        fee:getObjField(currentData,'fee'),
        pjName:getObjField(currentData,'pjName'),
        balcony:getObjField(currentData,'balcony')
      }
    },
    onCurrentDataChange(val)
    {
      this.currentData={...this.currentData,...val}
      this.updateSaleProcess()
      this.editInfo=false
    },
    psProgress(data) {
      if (data.peakStatus === "waiting" && data.nextMeetingDate != null) {
        return "scouting";
      }
      return data.peakStatus;
    },
    progressBarColor(data) {
      return (this.psIsCanceled(data) ? "ps-cancel-color"
        : data.rent
          ? "rent-color "
          : "sell-color");
    },
    psIsCanceled(data) {
      return data.status === "cusCanceled" || data.status === "ownCanceled";
    },
    progressBar(status) {
      const statusRepo = {
        waiting: 0.1,
        scouting: 1,
        depositing: 2,
        notarizing: 3,
        signing: 4,
        done: 5,
      };
      return `${(statusRepo[status] / 4) * 100}%`;
    },
    getTime,
    getDdMmYyyy(dateTime) {
      return ddMmYyyy(dateTime);
    },
    getDdMm,
    transProcessStatus(status) {
      return translate(this.SALE_PROCESS_STATUS, status);
    },
    transSPSttDetail(status) {
      if (!this.allFreeTimeEmpty || this.appointmentSet) {
        return translate(this.SALE_PROCESS_STATUS, status);
      }
      const dict = this.defaultData.rent ? this.SP_STATUS_AD_RENT : this.SP_STATUS_AD_SELL;
      return dictTranslate(dict, status);
    },
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.SALE_PROCESS_STATUS, DataLibType.SP_STATUS_AD_SELL,
        DataLibType.SP_STATUS_AD_RENT, DataLibType.POINTING, DataLibType.HEIGHT, DataLibType.UNIT_TYPE]
      );
      this.SALE_PROCESS_STATUS = res.SALE_PROCESS_STATUS;
      this.SP_STATUS_AD_SELL = res.SP_STATUS_AD_SELL;
      this.SP_STATUS_AD_RENT = res.SP_STATUS_AD_RENT;
      this.POINTING = res.POINTING;
      this.HEIGHT = res.HEIGHT;
      this.UNIT_TYPE = res.UNIT_TYPE;
    },
    getUnitInformation(data) {
      return {
        id: getObjField(data, 'id'),
        bedroom: getObjField(data, 'bedroom'),
        bathroom: getObjField(data, 'bathroom'),
        size: getObjField(data, 'size'),
        managementCoverage: getObjField(data, 'managementCoverage',false),
        furniture: data?.furniture,
        balcony: this.transPointing(data?.balcony),
        block: getObjField(data, 'block'),
        unitType: data?.unitType !== 'ap' ? translate(this.UNIT_TYPE, data?.unitType) : '',
      }
    },
    getUserName(userData) {
      return userData ? userData.first_name : "";
    },
    configIdBtn(string) {
      return `#${string}`;
    },
    setIdModal(string, id, value) {
      return string + id + value.toString().replace(/\s/g, '').replace(':', '').slice(5, 11);
    },
    // Utils
    decimalPlace(number, fracNum) {
      return floatFixed(number, fracNum);
    },
    progressLvlName(lvl) {
      return this.transProcessStatus(ProgressLevel[Math.max(0, lvl - 1)]);
    },
    getMetDayAtLvl(lvl) {
      if (!this.isDone) {
        lvl += 2;
      }

      if (lvl >= 8) {
        return this.currentData.signingDate;
      } else if (lvl >= 6) {
        return this.currentData.notarizeDate;
      } else if (lvl >= 4) {
        return this.currentData.depositDate;
      } else {
        return this.currentData.scoutingDate;
      }
    },
    // Controller
    async resetAppointment() {
      this.currentData.nextMeetingDate = null;
      await this.saveSP();
    },
    async gotoNextStep() {
      // validation
      if (!this.gotoNextStepValidator()) {
        return;
      }

      try {
        this.currentData.status = ProgressLevel[this.currentProgress];
        if (this.currentData.rent && this.currentData.status === "notarizing") {
          this.currentData.status = "signing";
        }

        this.currentData.peakStatus = this.currentData.status;
        this.setViewToCurrent();
        this.saveMetTime();
        await this.resetAppointment();

        if (this.isDone) {
          await this.completeSaleProcess();
        }
      } catch (err) {
        console.log("Không đủ điều kiện tiến hóa, xin kiểm tra");
        console.log(err);
      }
    },
    gotoNextStepValidator() {
      if (this.currentData.nextMeetingDate == null) {
        console.log(
          "Sai quy trinh roi, kiem tra lai, len level trng khi" +
          " chua hen kia may cha oi"
        );
        return false;
      }
      return true;
    },
    setViewToCurrent() {
      this.viewLvl = this.currentPeakSttLvl;
    },
    saveMetTime() {
      if (this.currentData.peakStatus === "depositing") {
        this.currentData.scoutingDate = this.currentData.nextMeetingDate;
      } else if (this.currentData.peakStatus === "notarizing") {
        this.currentData.depositDate = this.currentData.nextMeetingDate;
      } else if (this.currentData.peakStatus === "signing") {
        this.currentData.notarizeDate = this.currentData.nextMeetingDate;
        if (this.currentData.rent) {
          this.currentData.depositDate = this.currentData.nextMeetingDate;
        }
      } else if (this.currentData.peakStatus === "done") {
        this.currentData.signingDate = this.currentData.nextMeetingDate;
      }
    },
    nextStepBtnClk() {
      this.waitToNextStep = true;
    },
    statusIconClicked(lvl) {
      if (this.currentData.rent && lvl === 4) {
        lvl = 6;
      }

      if (lvl > this.currentProgress) {
        if (this.isLocked || this.currentProgress < 1 ) {
          return;
        }
        this.setSugData(lvl);
      } else {
        this.viewOldProgress(lvl);
      }
    },
    setSugData(lvl) {
      this.skipStt = ProgressLevel[Math.max(0, lvl - 1)];
    },
    notifyConfirm(result, code, data) {
      result ? this.notifyYes(code, data) : this.notifyNo(code);
    },
    notifyYes(code, data) {
      this.waitToNextStep = false;
      if (code === "confirmStatus") {
        this.gotoNextStep();
      } else if (code === "skipStatus") {
        this.confirmSkip(data);
      }
    },
    nextStepGetDate() {
      const ddate = this.currentData.nextMeetingDate;
      let sugLvl = this.currentSugSttLvl;
      return {
        scoutingDate: (sugLvl > 2 ? this.currentData.scoutingDate : ddate),
        depositDate: (this.currentData.depositDate ? this.currentData.depositDate : ddate),
        notarizeDate: (this.currentData.notarizeDate ? this.currentData.notarizeDate : ddate),
        signingDate: (this.currentData.signingDate ? this.currentData.signingDate : ddate),
      }
    },
    confirmSkip(data) {
      let sugLvl = this.currentSugSttLvl;
      this.currentData.scoutingDate =
        sugLvl >= 2 ? data.scoutingDate : this.currentData.scoutingDate;
      this.currentData.depositDate =
        sugLvl >= 4 ? data.depositDate : this.currentData.depositDate;
      this.currentData.notarizeDate =
        sugLvl >= 6 ? data.notarizeDate : this.currentData.notarizeDate;
      this.currentData.signingDate =
        sugLvl >= 8 ? data.signingDate : this.currentData.signingDate;
      this.currentData.status = this.skipStt;
      this.currentData.peakStatus = this.skipStt;
      this.saveSP();
      this.resetSkipData();
    },
    notifyNo(code) {
      this.waitToNextStep = false;
      if (code === "confirmStatus") {
        //pass
      } else if (code === "skipStatus") {
        this.resetSkipData();
      } else if (code === "verifySug") {
        this.cancelSPSuggest();
      }
    },
    resetSkipData() {
      this.skipStt = "";
      this.skipDepDate = null;
      this.skipNotDate = null;
      this.skipSigDate = null;
    },
    viewOldProgress(lvl) {
      this.viewLvl = lvl;
    },
    updateNegoNotifyData(negoCate, negoItem) {
      this.updatingNegoCate = negoCate;
      this.updatingNegoItem = negoItem;
    },
    onNegotiateChange(_negoCate, _negoItem) {
      this.negoUpdatingType = '';
      this.saveSPNego();
    },
    onNegotiateAccepted(negoCate, negoItem) {
      this.negoUpdatingType = 'accept';
      this.updateNegoNotifyData(negoCate, negoItem);
      this.saveSPNego();
    },
    onNegotiateCreated(negoCate, negoItem) {
      this.negoUpdatingType = 'new';
      this.updateNegoNotifyData(negoCate, negoItem);
      this.saveSPNego();
    },
    onNegotiateDenied(negoCate, negoItem) {
      this.negoUpdatingType = 'denied';
      this.updateNegoNotifyData(negoCate, negoItem);
      this.saveSPNego();
    },
    async saveSP() {
      if (this.currentData.peakStatus !== "done") {
        if (this.upLocking) {
          this.upWaiting = true;
          return;
        }
        this.upLocking = true;

        await this.updateSaleProcess();
      } else {
        await this.completeSaleProcess();
      }
    },
    async saveSPNego() {
      if (this.negoUpLocking) {
        this.negoUpWaiting = true;
        return;
      }
      this.negoUpLocking = true;
      await this.updateSPNegotiation();
    },
    setFreeTime(fromTime, _toTime) {
      this.setAppointments(fromTime);
      this.saveSP();
    },
    setAppointments(dt) {
      this.currentData.nextMeetingDate = dt;
      this.saveSP();
    },
    isRole(role) {
      return this.role === role;
    },
    setNote(text) {
      this.currentData.salesNote = text;
    },
    async autoRefresh() {
      if (this.refreshLocking || (this.showingNotify || this.isDone)) {
        return;
      }
      await this.refreshPage();
    },
    async refreshPage() {
      const tempNote = this.userNote;
      await this.getDynamicData();
      this.setNote(tempNote);
    },
    async minorRefreshPage() {
      const tempNote = this.userNote;
      await this.getMinorDynamicData();
      this.setNote(tempNote);
    },
    async asyncHandle(errorType) {
      if (errorType === 4) {
        await this.refreshPage();
        await this.updateSaleProcess();
      } else {
        await this.minorRefreshPage();
      }
    },
    fetchData(data) {
      this.defaultData = {...this.defaultData, ...JSON.parse(JSON.stringify(data))};
      this.currentData = {...this.currentData, ...JSON.parse(JSON.stringify(data))};
      this.setViewToCurrent();
    },
    // Negotiate funcs
    fetchNegoData(data) {
      this.defNegoData = {...this.defNegoData, ...JSON.parse(JSON.stringify(data))}
      this.curNegoData = {...this.curNegoData, ...JSON.parse(JSON.stringify(data))}
    },
    async negoUpAsyncHandle(errorType) {
      if (errorType === 5) {
        await this.getNegotiateData();
      } else {
        await this.getNegotiateUpTime();
      }
    },
    // region: APIs
    async getSPData() {
      const res = await post("/personal_sp/get_psp_detail_data", {
        id: this.pspID ? this.pspID : -1,
      });
      if (!res) {
        return;
      }
      this.serverResText = res.resText;
      if (res.succeed) {
        this.defaultData = res.returnData;
        this.currentData = res.returnData;
        this.setViewToCurrent();
        this.finishLoading=true
        this.pgMeta[breadcrumpProp.defFav] = this.defaultData.fav;
        this.pgMeta[breadcrumpProp.title] = this.currentData.name;
      }
    },
    async getPartSPData(endpoint) {
      const res = await post(endpoint, {
        id: this.pspID ? this.pspID : -1,
      });
      if (!res) {
        return;
      }
      this.serverResText = res.resText;
      if (res.succeed) {
        this.fetchData(res.returnData);
      }
    },
    async getDynamicData() {
      await this.getPartSPData("/personal_sp/get_psp_detail_data");
    },
    async getMinorDynamicData() {
      await this.getPartSPData("/personal_sp/get_psp_up_time");
    },
    async updateSaleProcess() {
      this.refreshLocking = true;
      const res = await post("/personal_sp/personal_sp_update", {
        ...this.currentData,
        ...this.validateData,
      });
      if (!res) {
        return;
      }
      this.serverResText = res.resText;
      // window.alert(res.resText);
      this.refreshLocking = false;
      await this.asyncHandle(res.errorType);
      if (this.upWaiting) {
        this.upWaiting = false;
        await this.updateSaleProcess();
      } else {
        this.upLocking = false;
      }
    },
    async specificUpdateSP(endpoint, data = {
      ...this.validateData,
    }) {
      const res = await post(endpoint, data);
      if (!res) {
        return;
      }
      // console.log(res.resText);
      this.serverResText = res.resText;
      if (res.succeed) {
        await this.getDynamicData();
      }
    },
    async cancelSaleProcess() {
      await this.specificUpdateSP("/personal_sp/personal_sp_cancel");
    },
    async completeSaleProcess() {
      const res = await post("/personal_sp/personal_sp_complete", {
        ...this.currentData,
        ...this.validateData,
      });
      this.serverResText = res.resText;
      await this.asyncHandle(res.errorType);
    },
    async restoreSaleProcess() {
      await this.specificUpdateSP("/personal_sp/personal_sp_restore");
    },
    // Negotiate APIs
    async getPartNegotiateData(endpoint) {
      const res = await post(endpoint, {
        id: this.pspID ? this.pspID : -1,
        role: Roles.Sales,
      });
      if (!res) {
        return;
      }
      this.serverResText = res.resText;
      if (res.succeed) {
        this.fetchNegoData(res.returnData);
      }
    },
    async getNegotiateData() {
      await this.getPartNegotiateData("/personal_sp/get_psp_detail_nego_data");
    },
    async getNegotiateUpTime() {
      await this.getPartNegotiateData("/personal_sp/get_psp_up_time");
    },
    async updateSPNegotiation() {
      this.negoRefreshLocking = true;
      const res = await post("/personal_sp/personal_sp_nego_update", {
        ...this.curNegoData,
        ...this.negoValidateData,
        ...this.negoUpdateData,
      });
      if (!res) {
        return;
      }
      this.serverResText = res.resText;
      // window.alert(res.resText);
      this.negoRefreshLocking = false;
      await this.negoUpAsyncHandle(res.errorType);
      if (this.negoUpWaiting) {
        this.negoUpWaiting = false;
        await this.updateSPNegotiation();
      } else {
        this.negoUpLocking = false;
      }
    },
    // Other
    transPointing(point) {
      return translate(this.POINTING, point);
    },
    goCusGeneral() {
      this.$router.push(S_CUS_DETAIL_URL + '-'+ this.currentData?.cusData?.id)
    },
    receiptConfirmPopup() {
      this.showPopupReceipt = true
    },
    valTranslate(val) {
      if (typeCheck(val) === TypeName.DATE) {
        return ddMmYyyy(val);
      }

      if (typeCheck(val) === TypeName.BOOLEAN) {
        return val ? 'Có' : 'Không';
      }
      return val;
    },
  },
  watch: {
    'currentData.salesNote': debounce(function(newVal) {
      if(newVal)
      {
        this.updateSaleProcess()
      }
    }, 1200)
  },
  async mounted() {
    if(this.setEditDefault===0)
    {
      this.editInfo = false
    }

    if(getItemFromLocalStorage('pspPj'))
    {
      this.currentData.pjName = getItemFromLocalStorage('pspPj')
      await this.updateSaleProcess()
      setLocalStorageItem('pspPj','')
    }
    await this.getDataLib();
    await this.getSPData();
    await this.getNegotiateData();

    document.addEventListener("keydown", this.closeModalOnEscape);
  },
}
</script>

<style scoped>
</style>
