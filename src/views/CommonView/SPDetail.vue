<template>
  <FpDefLayout
    :bc-props="pgMeta" @notification="onNotification" @showRB="onShowRB" :is-loading="!finishLoading"
    :show-loading="true"
  >

    <template #comp>
      <div v-if="!showPopupReceipt">
        <div v-if="currentData && curNegoData" class="row">
          <div class="col-12">
            <div class="container">
              <SPProgressNav
                class="sale-process-sales-1"
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
                  :agent="isAgent"
                  :scoutingDate="currentData.scoutingDate"
                  :depDate="currentData.depositDate"
                  :notDate="currentData.notarizeDate"
                  :sigDate="currentData.signingDate"
                  :sugDepDate="currentData.sugDepDate"
                  :sugNotDate="currentData.sugNotDate"
                  :sugSigDate="currentData.sugSigDate"
                  :rent="currentData.rent"
                />
              </div>
              <div class="row d-flex justify-content-between mt-2 ">
                <div class="col-auto px-lg-5"><b
                  style=" font-size: 20px">{{ transSPSttDetail(currentData.status) }} </b></div>
                <div v-show="!showingNotify && canEdit" class="col px-lg-5 mt-2 mt-lg-0">
                  <div class="row d-flex justify-content-end">
                    <div v-show="appointmentLvl === 1 && !negotiateRestricted" class="col-auto mb-2 mg-md-0">
                      <button @click="nextStepBtnClk" class="col-auto btn-wrap-text small gray-button">
                        {{ nextBtnText }}
                      </button>
                    </div>
                    <div v-show="!isCanceled && !isDone" class="col-auto">
                      <button @click="cancelSaleProcess" class="col-auto btn-wrap-text small gray-button">Hủy
                        đơn
                      </button>
                    </div>
                    <div v-show="canRestoreSP && !isDone" class="col-auto">
                      <button @click="restoreSaleProcess" class="col-auto btn-wrap-text small gray-button"> Khôi
                        phục
                      </button>
                    </div>

                    <!--                  Nút tạo hóa đơn-->
                    <div v-show="isDone && notHasReceipt && isAgent" class="col-auto">
                      <!--                    @click="createReceiptAPI"-->
                      <button @click="receiptConfirmPopup" class="col-auto btn-wrap-text small gray-button"> Tạo hóa
                        đơn
                      </button>
                    </div>

                    <!--                      Nút nhận hoa hồng Sales-->
                    <div v-show="isDone && !notHasReceipt && !receiptVerified && isSales" class="col-auto">
                      <button @click="receiptVerifySales" class="col-auto btn-wrap-text small gray-button"> Nhận hoa
                        hồng
                      </button>
                    </div>

                  </div>
                </div>
              </div>
              <div class="mt-4 row d-md-flex justify-content-around " style="align-items: flex-start">
                <div class="col-md-5 col-12 order-1 order-md-0">

                  <div v-show="!viewingOldStep">
                    <div v-show="!appointmentSet">
                      <SPDTimePicker
                        class="sale-process-sales-3"
                        v-show="partnerFreeTimeEmpty && !isLocked"
                        @add-free-time="setFreeTime"
                        :aPickedTime="currentData.aFreeTime"
                        :sPickedTime="currentData.sFreeTime"
                      />
                      <!--                lich hen cua agent-->
                      <div v-show="currentData.aFreeTime.length > 0"
                           class="border border-gray rounded-3  p-3 mt-3">
                        <div class="row">
                          <b v-if="isAgent">Lịch hẹn của bạn </b>
                          <b v-else>Lịch hẹn đề xuất</b>
                        </div>

                        <div v-for="(timePair, index) in currentData.aFreeTime" :key="index"
                             class="row mt-4 d-flex justify-content-between">
                          <div v-show="showAFTDate(index)" class="row mb-3 mt-2">
                                       <span class="text-gray">{{
                                           addZeroToDateTime(new Date(timePair[0]).getDate())
                                         }}/{{
                                           addZeroToDateTime(new Date(timePair[0]).getMonth() + 1)
                                         }}/{{ new Date(timePair[0]).getFullYear() }} </span>
                          </div>
                          <div class="col-lg-5 col-5 col-md-12 mt-3 mt-lg-0">
                            <div class="d-flex justify-content-between">
                                          <span>{{
                                              addZeroToDateTime(new Date(timePair[0]).getHours())
                                            }}:{{ addZeroToDateTime(new Date(timePair[0]).getMinutes()) }}</span>
                              <span>-</span>
                              <span>{{
                                  addZeroToDateTime(new Date(timePair[1]).getHours())
                                }}:{{ addZeroToDateTime(new Date(timePair[1]).getMinutes()) }}</span>
                            </div>
                          </div>
                          <div v-show="!isLocked" class="col-7 col-lg-7 col-md-12 mt-3 mt-lg-0">
                            <button v-if="isAgent" @click="rmChosenAFreeTime(index)"
                                    class="gray-button w-75 rounded btn-wrap-text small"> Hủy
                            </button>
                            <button v-else @click="refreshLocking=true" data-bs-toggle="modal"
                                    :data-bs-target="configIdBtn(setIdModal('oderTime',index, timePair[0]))"
                                    class="gray-button w-75 rounded btn-wrap-text small">Hẹn lịch này
                            </button>
                            <AppointSetModal
                              @confirm-meeting-time="setAppointments"
                              @modal-close="onTimeModalClose"
                              :fromTime="timePair[0]"
                              :toTime="timePair[1]"
                              :modalId="setIdModal('oderTime',index, timePair[0])"
                            />
                          </div>
                        </div>
                        <div v-if="!isAgent && !isLocked" class="mt-5 d-flex justify-content-center">
                          <button @click="resetAFreeTimeBtnClk"
                                  class="gray-button w-75 rounded btn-wrap-text small">Tôi muốn đặt lịch hẹn
                            khác
                          </button>
                        </div>
                      </div>

                      <div v-show="currentData.sFreeTime.length > 0"
                           class="border border-gray rounded-3  p-3 mt-3">
                        <div class="row">
                          <b v-if="isSales">Lịch hẹn của bạn</b>
                          <b v-else>Lịch hẹn đề xuất</b>
                        </div>
                        <div v-for="(timePair, index) in currentData.sFreeTime" :key="index"
                             class="row mt-4 d-flex justify-content-between">
                          <div v-show="showSFTDate(index)" class="row mb-3 mt-2 ">
                                       <span class="text-gray">{{
                                           addZeroToDateTime(new Date(timePair[0]).getDate())
                                         }}/{{
                                           addZeroToDateTime(new Date(timePair[0]).getMonth() + 1)
                                         }}/{{ new Date(timePair[0]).getFullYear() }} </span>
                          </div>
                          <div class="col-5 mt-auto">
                            <div class="d-flex justify-content-between">
                                          <span>{{
                                              addZeroToDateTime(new Date(timePair[0]).getHours())
                                            }}:{{ addZeroToDateTime(new Date(timePair[0]).getMinutes()) }}</span>
                              <span>-</span>
                              <span>{{
                                  addZeroToDateTime(new Date(timePair[1]).getHours())
                                }}:{{ addZeroToDateTime(new Date(timePair[1]).getMinutes()) }}</span>
                            </div>
                          </div>
                          <div v-show="!isLocked" class="col-7 ">
                            <button v-if="isSales" @click="rmChosenSFreeTime(index)"
                                    class="tab-button w-75 rounded btn-wrap-text small"> Hủy
                            </button>
                            <button v-else @click="refreshLocking=true" data-bs-toggle="modal"
                                    :data-bs-target="configIdBtn(setIdModal('oderTime',index,timePair[0]))"
                                    class="tab-button w-75 rounded btn-wrap-text small">Hẹn lịch này
                            </button>
                            <AppointSetModal
                              @confirm-meeting-time="setAppointments"
                              @modal-close="onTimeModalClose"
                              :fromTime="timePair[0]"
                              :toTime="timePair[1]"
                              :modalId="setIdModal('oderTime',index,timePair[0])"
                            />
                          </div>
                        </div>
                        <div v-if="!isSales && !isLocked" class="mt-5 d-flex justify-content-center">
                          <button @click="resetSFreeTimeBtnClk"
                                  class="tab-button w-75 rounded btn-wrap-text small">
                            Tôi muốn đặt lịch hẹn khác
                          </button>
                        </div>
                      </div>
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

                  <div v-if="depImgs && depImgs.length && canViewDepImgs"
                       class="d-flex mt-4 justify-content-center">
                    <div class="col-12" style='height: 300px'>
                      <SwipeBox :img='depImgs.map((item) => item.wm_url)'/>
                    </div>
                  </div>

                  <div v-if="sigImgs && sigImgs.length && canViewSigImgs"
                       class="d-flex mt-4 justify-content-center">
                    <div class="col-12" style='height: 300px'>
                      <SwipeBox :img='sigImgs.map((item) => item.wm_url)'/>
                    </div>
                  </div>

                  <div v-show="canUpDepImgs && isPC" class="mt-2 mb-5">
                    <button @click="showDepImgMgmt=true" class="w-100 mt-3 btn-wrap-text small gray-button">Tải
                      ảnh cọc
                    </button>
                  </div>

                  <div v-show="canUpSigImgs && isPC" class="mt-2 mb-5">
                    <button @click="showSigImgMgmt=true" class="w-100 mt-3 btn-wrap-text small gray-button">Tải
                      ảnh ký HĐ
                    </button>
                  </div>

                  <SPNegotiate
                    v-if="defaultData.agentData"
                    :spData="currentData"
                    :curNegoData="curNegoData"
                    :rent="defaultData.rent"
                    :isAgent="isAgent"
                    :editable="!isLocked"
                    :oneMan="currentData.one_man"
                    @nego-change="onNegotiateChange"
                    @nego-deny="onNegotiateDenied"
                    @nego-accept="onNegotiateAccepted"
                    @nego-new="onNegotiateCreated"
                  />
                </div>
                <div class="col-md-6 col-12 mt-3 mt-md-0 order-0 order-md-1">
                  <div class="rounded-3 p-lg-5 p-3" style="background-color: #F7F9FB">
                    <div class="d-flex">
                      <b class="pe-2 cursor-pointer" @click="goCusGeneral">{{ cusName.name }}</b>
                      <ZaloIcon
                        v-if="isAgent || isManager"
                        :zaloDirect="true" :size="20"
                        :phoneNumber="cusName?.phone"
                        class="me-2"
                      />
                      <FpIcon :size="20" srcIcon="spPhone.svg" @click="phoneCall(cusName.phone)"></FpIcon>
                    </div>
                    <p>{{ cusName.status }}</p>
                    <div class="row mt-3 rounded-3 p-2" style="background-color: #E5ECF6">
                      <div class="col-auto col-xl-4  border-end">
                        <div class="row d-flex">
                          <div class="col-auto"><h6>Giá</h6></div>
                        </div>
                        <h5><b>{{ finalPrice }}</b></h5>
                      </div>
                      <div class="col col-lg-7" v-if="isSales">
                        <h6>Hoa hồng của tôi</h6>
                        <h5><b>{{ finalSalesFee }}</b></h5>
                      </div>
                    </div>
                    <div class="row mt-3 d-flex ">
                      <FpPjInformationTag :iconsize="18" v-bind="getUnitInformation(currentData.unitData)"
                      />
                    </div>
                    <div class="mt-3 " v-if="currentData.moveDay">
                      Ngày ở: {{ getDdMm(currentData.moveDay) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="showDepImgMgmt && canUpDepImgs"
               class="d-flex justify-content-center align-items-center w-100 vh-100 position-fixed bg-white"
               style="top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999">
            <div @click='depImgMgmtClosing' class='position-absolute top-0 end-0'>
              <div class="close-btn text-dark">&times;</div>
            </div>
            <ImgMgmt
              :objId="defaultData.id"
              objDataEP=""
              imgsEP="/mlib/img/get_sp_imgs"
              updateImgsEP="/mlib/img/up_sp_dep_img_pos"
              uploadImgEP="/mlib/img/create_dep_sp_img"
              imgContent="depImgs"
              :getImgValidate="{role: role}"
            />
          </div>

          <div v-if="showSigImgMgmt && canUpSigImgs"
               class="d-flex justify-content-center align-items-center w-100 vh-100 position-fixed bg-white"
               style="top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999">
            <div @click='sigImgMgmtClosing' class='position-absolute top-0 end-0'>
              <div class="close-btn text-dark">&times;</div>
            </div>
            <ImgMgmt
              :objId="defaultData.id"
              objDataEP=""
              imgsEP="/mlib/img/get_sp_imgs"
              updateImgsEP="/mlib/img/up_sp_sig_img_pos"
              uploadImgEP="/mlib/img/create_sig_sp_img"
              imgContent="sigImgs"
              :getImgValidate="{role: role}"
            />
          </div>

        </div>
      </div>
      <!--      showPopupReceipt-->
      <div class="row d-flex justify-content-center" v-if="showPopupReceipt">
        <div class="col-lg-6 col-10 card-gray-teal  p-3 ">
          <p class="text-center text-title" style="font-weight: 600;">Thông tin giao dịch</p>
          <div class="col-10 p-2">
            <InvoiceEditConfirm :fields="setReceiptContent()"
                                rowClasses="d-flex justify-content-between border-bottom mt-2"/>
          </div>
          <div class="row d-flex justify-content-end mt-3 px-3">
            <ButtonView content="Tạo hóa đơn" status="gray-btn" class="col-auto me-3" @click="createReceiptAPI"/>
            <ButtonView content="Trở về" status="gray-btn" class="col-auto" @click="showPopupReceipt=false"/>
          </div>
        </div>
      </div>

    </template>


    <template #rightBar>
      <div class="chat-rightBar row">
        <div v-if="currentData" class="py-2 px-0 right-panel position-sticky end-0 top-0 h-100">
          <ConversationView :widthLineChat="75" :roomId="parseInt(spID)" :role="role" :hide-inq="true"
                            :unit-type="chatObjType.SALE_PROCESS"
                            @newMessage="newMsg" :partner="partnerData" :msg-default="spChatData?.msg_data"/>
        </div>
      </div>
    </template>

  </FpDefLayout>

  <TourHost
    pageName="salesSPDetail"
    :tourOptions="pageTour['Sales SP Detail Tour']"
  />
</template>


<script>
import {
  dictTranslate,
  floatFixed,
  getIconUrl,
  getObjField,
  phoneCall,
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
import AppointSetModal from "@/views/CommonView/SPDetailComps/AppointSetModal.vue";
import ImgMgmt from "@/components/FpImg/ImgMgmt.vue";
import SPProgressNav from "@/views/CommonView/SPDetailComps/SPProgressNav.vue";
import SPDTimePicker from "@/views/CommonView/SPDetailComps/SPDTimePicker.vue";
import SPNotification from "@/views/CommonView/SPDetailComps/SPNotification.vue";
import SPNegotiate from "@/views/CommonView/SPDetailComps/SPNegotiate.vue";

import FpDefLayout from "@/views/FpDefLayout.vue";
import ConversationView from "@/components/FpConversation/ConversationView.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpPjInformationTag from "@/components/FpTag/FpPjInformationTag.vue";
import {S_CUS_DETAIL_URL} from "@/router/URLs";

import {getStatusTextByRent, transFurniture} from "@/utils/unit";
import {Roles} from "@/utils/constants";
import {favObj} from "@/utils/favAPI";
import {
  getFinalSalesFee,
  getSPFinalPrice,
  getSPVerifiedFinalPrice,
  itemUnit,
  negotiateDone, transSPDetailStt, unitFeeText, verifiedContractDuration
} from "@/utils/saleProcess";
import {NegotiateItemEnum} from "@/models/saleProcess";
import InvoiceEditConfirm from "@/components/FpForm/InvoiceEditConfirm.vue";
import {invoiceData} from "@/utils/invoiceContent";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {SPSttLevel} from "@/utils/spConstants";
import {HEIGHT, POINTING, SALE_PROCESS_STATUS, SP_STATUS_AD_RENT, SP_STATUS_AD_SELL} from "@/utils/TransContent";
import ZaloIcon from "@/components/SocialItem/ZaloIcon.vue";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";
import {chatObjType} from "@/models/fpChat";
import {SetChatDataEnum} from "@/utils/chatConstants";
import {mapActions, mapGetters} from "vuex";
import TourHost from "@/views/Guidance/TourHost.vue";
import {pageTour} from "@/views/Guidance/pageTour";

const defaultViewLvl = -99;
const ProgressLevel = {
  0: "waiting",
  1: "depositing",
  3: "notarizing",
  5: "signing",
  7: "done",
};

const NextBtnTxt = {
  0: "Đã xem nhà",
  2: "Đã cọc",
  4: "Đã công chứng",
  6: "Đã ký hợp đồng",
};

export default {
  components: {
    TourHost,
    ZaloIcon,
    InvoiceEditConfirm,
    FpIcon,
    FpDefLayout,
    SwipeBox,
    // SPDetailRBar,
    AppointSetModal,
    ImgMgmt,
    SPProgressNav,
    SPDTimePicker,
    SPNegotiate,
    SPNotification,
    ConversationView,
    FpPjInformationTag,
    ButtonView,
  },
  data() {
    return {
      // data
      defaultData: {},
      currentData: false,
      showPopupReceipt: false,
      // negotiateData
      defNegoData: {},
      curNegoData: false,
      // snapshot
      //
      serverResText: "",
      // controller
      waitToNextStep: false,
      viewLvl: defaultViewLvl,
      showDepImgMgmt: false,
      showSigImgMgmt: false,
      showCarousel: false,
      depImgs: [],
      sigImgs: [],
      updateTimer: null,
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
        [breadcrumpProp.favObjType]: favObj.SP,
        [breadcrumpProp.favObjId]: this.spID ? this.spID : -1,
        [breadcrumpProp.enableRB]: true,
        [breadcrumpProp.rBIcon]: 'chatIcon.svg',
      },
      finishLoading: false,
      // import
      pageTour,
    }
  },
  props: {
    role: {
      type: String,
      required: true,
    },
    spID: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    chatObjType() {
      return chatObjType
    },
    ...mapGetters(['getSpChatData']),
    spChatData() {
      return this.getSpChatData[0]?.chatData
    },
    chatDataEp() {
      if (this.role === Roles.Sales) {
        return '/sale_process/get_sales_sp_chat_data'
      } else {
        return '/sale_process/get_agent_sp_chat_data'
      }
    },
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
      // console.log(negotiateText)
      return negotiateText;
    },
    invoiceData() {
      return invoiceData
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
      const price = getSPVerifiedFinalPrice(this.curNegoData, this.defaultData.rent, this.currentData.unitData, this.isAgent);
      return convertVndToUserCurrency(price, this.currentData.rent, UnitCurrency.simple)
      // const priceUnit = this.currentData.rent ? 'Tr' : 'Tỷ';
      // return '' + price + priceUnit;
    },
    finalSalesFee() {
      const fee = getFinalSalesFee(this.curNegoData, this.defaultData.rent, this.currentData.unitData, this.isAgent)
      return convertVndToUserCurrency(fee, true, UnitCurrency.simple)
    },
    rentStatus() {
      return this.currentData.rent ? 'Thuê' : 'Mua'
    },
    cusName() {
      const cusName = {
        name: '',
        status: '',
        phone: ''
      }
      if (this.isAgent || this.isManager) {
        cusName.name = `${this.currentData.unitData?.ownerData?.name} `
        cusName.status = `${this.rentStatus}  ${this.currentData.unitData.pjData.code} ${this.currentData.unitData.unitCode}`
        cusName.phone = this.currentData.unitData?.ownerData?.phone
      } else if (this.isSales) {
        cusName.name = `${this.currentData.customerData.name}`
        cusName.status = ` ${this.rentStatus}  ${this.currentData.unitData.pjData.name}`
        cusName.phone = this.currentData.customerData.phone
      }
      return cusName;
    },
    partnerData() {
      if (this.isAgent || this.isManager) {
        const saleData = this.currentData.salesData
        return {
          name: saleData.extData.length > 0 ? saleData.first_name : '',
          phone: saleData.extData.length > 0 ? saleData.extData[0].phone : '',
          img: (saleData.extData.length > 0 && saleData.extData[0]) ? saleData.extData[0] : {},
          gender: saleData.extData.length > 0 ? saleData.extData[0].gender : '',
          extData: saleData?.extData[0],
          spId: this.spID,
          chatData: this.spChatData

        }
      } else if (this.isSales) {
        const agentData = this.currentData.agentData
        return {
          name: (agentData && agentData.extData.length > 0) ? agentData.first_name : '',
          phone: (agentData && agentData.extData.length > 0) ? agentData.extData[0].phone : '',
          img: (agentData && agentData.extData.length > 0 && agentData.extData[0]) ? agentData.extData[0] : {},
          gender: (agentData && agentData.extData.length > 0) ? agentData.extData[0].gender : '',
          extData: agentData?.extData[0],
          spId: this.spID,
          chatData: this.spChatData
        }
      }
      return ''
    },
    nextBtnText() {
      return NextBtnTxt[this.currentPeakSttLvl];
    },
    unitCode() {
      if (this.isAgent || this.isManager) {
        return this.currentData.unitData.unitCode;
      } else {
        return this.currentData.salesData.id + this.spID + "";
      }
    },
    salesFee() {
      return this.decimalPlace(this.defaultFee * this.defaultSalesFee, 2) + " Tr";
    },
    defaultFee() {
      return this.currentData.rent ? this.currentData.unitData.r_fee_num : this.currentData.unitData.s_fee_num;
    },
    defaultSalesFee() {
      return this.curNegoData.sFeePercent / 100;
    },
    validateData() {
      return {
        role: this.role,
        id: this.spID ? this.spID : -1,
        validate: this.defaultData,
      };
    },
    currentPeakSttLvl() {
      return SPSttLevel[this.currentData.peakStatus];
    },
    currentSugSttLvl() {
      return SPSttLevel[this.currentData.sugStatus];
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
    partnerFreeTimeEmpty() {
      return this.isSales
        ? this.currentData.aFreeTime.length === 0
        : this.currentData.sFreeTime.length === 0;
    },
    allFreeTimeEmpty() {
      return this.currentData.aFreeTime.length === 0 && this.currentData.sFreeTime.length === 0;
    },
    isAgent() {
      return this.isRole(Roles.Agent);
    },
    isSales() {
      return this.isRole(Roles.Sales);
    },
    isManager() {
      return this.isRole(Roles.Manager);
    },
    // isAdmin() {
    //    return this.isRole(Roles.Admin);
    // },
    notHasReceipt() {
      return !this.currentData.receiptData;
    },
    receiptVerified() {
      return !this.notHasReceipt && getObjField(this.currentData.receiptData, 'salesVerified', false);
    },
    canEdit() {
      return this.isAgent || this.isSales;
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
    waitingSugVerified() {
      return this.suggesting && this.selfSuggesting;
    },
    needVerifySug() {
      return this.suggesting && !this.selfSuggesting;
    },
    canRestoreSP() {
      if (this.isAgent) {
        return this.currentData.agent_can_restore && this.isCanceled;
      } else if (this.isSales) {
        return this.currentData.sales_can_restore && this.isCanceled;
      }

      return false;
    },
    canUpDepImgs() {
      return this.isAgent && this.viewLvl === 2;
    },
    canUpSigImgs() {
      return this.isAgent && this.viewLvl === 6;
    },
    canViewDepImgs() {
      return this.viewLvl === 2;
    },
    canViewSigImgs() {
      return this.viewLvl === 6;
    },
    showingNotify() {
      return (
        this.showSkipNoti ||
        this.showNextStepNoti ||
        this.needVerifySug ||
        this.waitingSugVerified
      );
    },
    showSkipNoti() {
      return this.currentData.sugStatus !== "";
    },
    showNextStepNoti() {
      return this.waitToNextStep;
    },
    notifyCode() {
      return this.suggesting
        ? this.needVerifySug
          ? "verifySug"
          : "waitSugVerify"
        : this.showSkipNoti
          ? "skipStatus"
          : this.showNextStepNoti
            ? "confirmStatus"
            : "confirmDate";
    },
    suggesting() {
      return this.defaultData.sugStatus !== "";
    },
    selfSuggesting() {
      return this.currentData.sugByAgent === this.isAgent;
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
      return this.isAgent ? this.currentData.agentNote : this.currentData.salesNote;
    },
    // Negotiate computed
    negoValidateData() {
      return {
        role: this.role,
        id: this.spID ? this.spID : -1,
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

  },
  methods: {
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
    psProgress(data) {
      if (data.peakStatus === "waiting" && data.nextMeetingDate != null) {
        return "scouting";
      }
      return data.peakStatus;
    },
    progressBarColor(data) {
      return this.psIsCanceled(data)
        ? "ps-cancel-color"
        : data.rent
          ? "rent-color "
          : "sell-color";
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
    onShowRB(showRB) {
      this.newMessage = showRB
      this.brcIconMsg()
    },
    brcIconMsg() {
      if (this.newMessage) {
        window.localStorage.removeItem(`sp${this.spID}`)
        this.pgMeta[breadcrumpProp.rBIcon] = 'chatIcon.svg'
      }
      return ''
    },
    newMsg() {
      const localMsg = window.localStorage.getItem(`sp${this.spID}`)
      this.brcIconMsg()
      if (localMsg && !this.newMessage) {
        this.pgMeta[breadcrumpProp.rBIcon] = 'chatIcon-dot.svg'
      }

    },
    depImgMgmtClosing() {
      this.showDepImgMgmt = false;
      this.getDepImgs();
    },
    sigImgMgmtClosing() {
      this.showSigImgMgmt = false;
      this.getSigImgs();
    },
    showAFTDate(id) {
      return (
        id === 0 ||
        this.currentData.aFreeTime[id][0].getDate() !== this.currentData.aFreeTime[id - 1][0].getDate()
      );
    },
    showSFTDate(id) {
      return (
        id === 0 ||
        this.currentData.sFreeTime[id][0].getDate() !==
        this.currentData.sFreeTime[id - 1][0].getDate()
      );
    },
    onNotification(data) {
      if (data.clf === 'SPRF') {
        this.autoRefresh();
      } else if (data.clf === 'SPNRF') {
        this.autoRefreshNegotiate();
      }
    },
    aFreeTimeSort() {
      this.currentData.aFreeTime.sort(function (a, b) {
        return a[0] - b[0];
      });
    },
    sFreeTimeSort() {
      this.currentData.sFreeTime.sort(function (a, b) {
        return a[0] - b[0];
      });
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
      return transSPDetailStt(this.currentData, status);
    },
    async getDataLib() {
      const res = await getCompareValue([DataLibType.UNIT_TYPE]);
      this.SALE_PROCESS_STATUS = SALE_PROCESS_STATUS;
      this.SP_STATUS_AD_SELL = SP_STATUS_AD_SELL;
      this.SP_STATUS_AD_RENT = SP_STATUS_AD_RENT;
      this.POINTING = POINTING;
      this.HEIGHT = HEIGHT;
      this.UNIT_TYPE = res.UNIT_TYPE
    },
    getUnitInformation(data) {
      return {
        id: getObjField(data, 'id'),
        bedroom: getObjField(data, 'bedroom'),
        bathroom: getObjField(data, 'bathroom'),
        size: getObjField(data, 'size'),
        managementCoverage: getObjField(data, 'managementCoverage'),
        furniture: data?.furniture,
        balcony: this.transPointing(data?.balcony),
        block: getObjField(data, 'block'),
        unitType: data?.unitType !== 'ap' ? translate(this.UNIT_TYPE, data?.unitType) : '',
        heights: data.height ? `Tầng ${translate(this.HEIGHT, data.height)}` : '',
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
    resetAFreeTimeBtnClk() {
      this.resetAFreeTime();
      this.saveSP();
    },
    resetAFreeTime() {
      this.currentData.aFreeTime = [];
    },
    resetSFreeTimeBtnClk() {
      this.resetSFreeTime();
      this.saveSP();
    },
    resetSFreeTime() {
      this.currentData.sFreeTime = [];
    },
    async resetAppointment() {
      this.currentData.nextMeetingDate = null;
      this.resetAFreeTime();
      this.resetSFreeTime();
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
          console.log("hoan thanh giao dich");
        }
      } catch (err) {
        // console.log("Không đủ điều kiện tiến hóa, xin kiểm tra");
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
      if (this.isAgent) {
        this.waitToNextStep = true;
      } else {
        this.statusIconClicked(this.getNextLvl);
        this.confirmSkip(this.nextStepGetDate());
      }
    },
    statusIconClicked(lvl) {
      if (this.currentData.rent && lvl === 4) {
        lvl = 6;
      }

      if (lvl > this.currentProgress) {
        if (this.isLocked || this.currentProgress < 1 || this.negotiateRestricted) {
          return;
        }
        this.setSugData(lvl);
      } else {
        this.viewOldProgress(lvl);
      }
    },
    setSugData(lvl) {
      this.currentData.sugStatus = ProgressLevel[Math.max(0, lvl - 1)];
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
      } else if (code === "verifySug") {
        this.verifySuggest();
      }
    },
    async verifySuggest() {
      await this.resetAppointment();
      await this.verifySuggestSP();
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
      this.currentData.sugDepDate =
        sugLvl >= 4 ? data.depositDate : this.currentData.sugDepDate;
      this.currentData.sugNotDate =
        sugLvl >= 6 ? data.notarizeDate : this.currentData.sugNotDate;
      this.currentData.sugSigDate =
        sugLvl >= 8 ? data.signingDate : this.currentData.sugSigDate;
      // this.resetAppointment();
      this.skipProgressSP();
    },
    notifyNo(code) {
      this.waitToNextStep = false;
      if (code == "confirmStatus") {
        //pass
      } else if (code == "skipStatus") {
        this.emptySugData();
      } else if (code == "verifySug") {
        this.cancelSPSuggest();
      }
    },
    emptySugData() {
      this.currentData.sugStatus = "";
      this.currentData.sugDepDate = null;
      this.currentData.sugNotDate = null;
      this.currentData.sugSigDate = null;
    },
    viewOldProgress(lvl) {
      this.viewLvl = lvl;
    },
    rmChosenAFreeTime(index) {
      if (index >= this.currentData.aFreeTime.length) {
        console.log("Xoa thoi gian nam ngoai array, wtf man?");
        return;
      }
      this.currentData.aFreeTime.splice(index, 1);
      this.saveSP();
    },
    onTimeModalClose() {
      this.refreshLocking = false;
      this.autoRefresh();
    },
    updateNegoNotifyData(negoCate, negoItem) {
      this.updatingNegoCate = negoCate;
      this.updatingNegoItem = negoItem;
    },
    onNegotiateChange(negoCate, negoItem) {
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
    rmChosenSFreeTime(index) {
      if (index >= this.currentData.sFreeTime.length) {
        console.log("Xoa thoi gian nam ngoai array, wtf man?");
        return;
      }
      this.currentData.sFreeTime.splice(index, 1);
      this.saveSP();
    },
    setFreeTime(fromTime, toTime) {
      if (this.currentData.one_man || this.isAgent) {
        this.setAppointments(fromTime);
      } else if (this.isSales) {
        this.currentData.sFreeTime.push([fromTime, toTime]);
        this.sFreeTimeSort();
      }
      // else if (this.isAgent) {
      //   this.currentData.aFreeTime.push([fromTime, toTime]);
      //   this.aFreeTimeSort();
      // }
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
      if (this.isAgent) {
        this.currentData.agentNote = text;
      } else if (this.isSales) {
        this.currentData.salesNote = text;
      }
    },
    async autoRefreshNegotiate() {
      if (this.negoRefreshLocking || (this.showingNotify ||
        this.isDone)) {
        console.log('refresh negotiate that bai')
        return;
      }
      await this.getNegotiateData();
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
      if (errorType == 3) {
        await this.refreshPage();
        await this.updateSaleProcess();
      } else if (errorType == 4) {
        await this.minorRefreshPage();
        await this.updateSaleProcess();
      } else {
        await this.minorRefreshPage();
      }
    },
    refineFreeTimeArray(timePairArray) {
      for (let i = 0; i < timePairArray.length; i++) {
        timePairArray[i][0] = new Date(timePairArray[i][0]);
        timePairArray[i][1] = new Date(timePairArray[i][1]);
      }
    },
    refineFreeTimeData() {
      this.refineFreeTimeArray(this.currentData.aFreeTime);
      this.refineFreeTimeArray(this.currentData.sFreeTime);
    },
    fetchData(data) {
      this.defaultData = {...this.defaultData, ...JSON.parse(JSON.stringify(data))};
      this.currentData = {...this.currentData, ...JSON.parse(JSON.stringify(data))};
      this.refineFreeTimeData();
      this.setViewToCurrent();
    },
    closeModalOnEscape(event) {
      if (event.keyCode === 27) {
        this.depImgMgmtClosing();
        this.sigImgMgmtClosing();
      }
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
      const res = await post("/sale_process/get_detail_data", {
        id: this.spID ? this.spID : -1,
        role: this.role,
      });
      if (!res) {
        return this.$router.back(-1)
      }
      this.serverResText = res.resText;
      if (res.succeed) {
        this.defaultData = JSON.parse(JSON.stringify(res.returnData));
        this.currentData = JSON.parse(JSON.stringify(res.returnData));
        this.refineFreeTimeData();
        this.setViewToCurrent();
        this.pgMeta[breadcrumpProp.defFav] = this.defaultData.fav;
        this.breadcrumbTitle(this.currentData)
        this.finishLoading = true
      }
    },
    breadcrumbTitle(data) {
      const rentStatus = data.rent ? 'thuê' : 'mua';
      const pjCode = data.unitData.unitCode;
      const pjData = data.unitData.pjData
      const bedRoom = `${data.unitData.bedroom}PN`;
      const price = data.rent ? `${floatFixed(data.unitData.rentingPrice)}Tr` : `${floatFixed(data.unitData.sellingPrice)}Tỷ`;
      let name = ''
      if (this.isAgent || this.isManager) {
        this.pgMeta[breadcrumpProp.title] = `#${this.defaultData.id} ${data.customerData.name} ${name} ${rentStatus} ${pjData.code} ${pjCode}`;
      } else if (this.isSales) {
        this.pgMeta[breadcrumpProp.title] = `#${this.defaultData.id} ${data.customerData.name} ${rentStatus} ${pjData.name} ${bedRoom}`
      }


    },
    async getPartSPData(endpoint) {
      const res = await post(endpoint, {
        id: this.spID ? this.spID : -1,
        role: this.role,
      });
      if (!res) {
        return;
      }
      this.serverResText = res.resText;
      if (res.succeed) {
        this.fetchData(res.returnData);
      }
    },
    // async getPartnerUpdate() {
    //    await this.getPartSPData("/sale_process/get_partner_update");
    // },
    async getDynamicData() {
      await this.getPartSPData("/sale_process/get_dynamic_data");
    },
    async getReceiptData() {
      await this.getPartSPData("/sale_process/get_sp_receipt_data");
    },
    async getDepImgs() {
      const res = await post("/mlib/img/get_sp_imgs", {
        id: this.spID ? this.spID : -1,
        imgContent: "depImgs",
        imgType: "mini_ss",
        role: this.role,
      });
      if (!res) {
        return;
      }
      this.serverResText = res.resText;
      if (res.succeed) {
        this.depImgs = res.returnData;
      }
    },
    async getSigImgs() {
      const res = await post("/mlib/img/get_sp_imgs", {
        id: this.spID ? this.spID : -1,
        imgContent: "sigImgs",
        imgType: "mini_ss",
        role: this.role,
      });
      if (!res) {
        return;
      }
      this.serverResText = res.resText;
      if (res.succeed) {
        this.sigImgs = res.returnData;
      }
    },
    async getMinorDynamicData() {
      await this.getPartSPData("/sale_process/get_minor_dynamic_data");
    },
    async updateSaleProcess() {
      this.refreshLocking = true;
      const res = await post("/sale_process/update_sale_process", {
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
      await this.specificUpdateSP("/sale_process/cancel_sale_process_api");
    },
    async cancelSPSuggest() {
      await this.specificUpdateSP("/sale_process/cancel_sp_suggest_api");
    },
    async completeSaleProcess() {
      const res = await post("/sale_process/complete_sp_api", {
        ...this.currentData,
        ...this.validateData,
      });
      this.serverResText = res.resText;
      await this.asyncHandle(res.errorType);
    },
    async skipProgressSP() {
      await this.specificUpdateSP("/sale_process/skip_progress_sp_api", {
        ...this.currentData,
        ...this.validateData,
      });
    },
    async verifySuggestSP() {
      await this.specificUpdateSP("/sale_process/verify_suggest_sp_api");
    },
    async restoreSaleProcess() {
      await this.specificUpdateSP("/sale_process/restore_sp_api");
    },
    // Negotiate APIs
    async getPartNegotiateData(endpoint) {
      const res = await post(endpoint, {
        id: this.spID ? this.spID : -1,
        role: this.role,
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
      await this.getPartNegotiateData("/sale_process/get_sp_nego_data");
    },
    async getNegotiateUpTime() {
      await this.getPartNegotiateData("/sale_process/get_sp_update_time_data");
    },
    async updateSPNegotiation() {
      this.negoRefreshLocking = true;
      const res = await post("/sale_process/sp_nego_up_api", {
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
    // Receipt - Post process
    async createReceiptAPI() {
      this.refreshLocking = true;
      const res = await post("/sale_process/create_sp_receipt", {
        role: this.role,
        id: this.spID ? this.spID : -1,
      });
      if (!res) {
        return;
      }
      this.serverResText = res.resText;
      // window.alert(res.resText);
      await this.getReceiptData();
      this.refreshLocking = false
      this.$router.back()
    },
    async receiptVerifySales() {
      this.refreshLocking = true;
      const res = await post("/sale_process/sales_verify_sp_receipt", {
        role: this.role,
        id: this.spID ? this.spID : -1,
      });
      if (!res) {
        return;
      }
      this.serverResText = res.resText;
      // window.alert(res.resText);
      await this.getReceiptData();
      this.refreshLocking = false;
    },
    // Other
    transPointing(point) {
      return translate(this.POINTING, point);
    },
    goCusGeneral() {
      if (this.isSales) {
        goToURL(`${S_CUS_DETAIL_URL}-${this.currentData.customerData.id}`)
      }
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
    receiptContent() {
      if (Object.keys(this.currentData).length) {
        return {
          ownerName: this.currentData.unitData.ownerData.name,
          ownerNumber: this.currentData.unitData.ownerData.phone,
          cusName: this.currentData.customerData?.name,
          cusPhone: this.currentData.customerData?.phone,
          projectName: this.currentData.unitData.pjData?.name,
          projectCode: this.currentData.unitData.pjData?.code + '-' + this.currentData.unitData?.unitCode,
          bedroom: this.currentData.unitData.bedroom,
          bathroom: "" + this.currentData.unitData.bathroom,
          size: this.currentData.unitData.size + 'm²',
          contractType: getStatusTextByRent(this.currentData.rent),
          price: this.finalPrice,
          negotiate: this.getAllNegotiateText,
          expiringContract: verifiedContractDuration(this.curNegoData) + ' tháng',
          feeCoverage: unitFeeText(this.curNegoData.negotiate, this.currentData.unitData, this.currentData.rent),
          depositDate: ddMmYyyy(this.currentData.depositDate),
          notarizingDate: ddMmYyyy(this.currentData.notarizeDate),
          signingDate: ddMmYyyy(this.currentData.signingDate),
          salesName: this.currentData.salesData?.username,
          commission: this.finalSalesFee
        }
      }
    },
    setReceiptContent() {
      if (this.receiptContent() && Object.keys(this.receiptContent()).length) {

        invoiceData.fields.forEach((fieldObj) => {
          if (this.receiptContent()[fieldObj.fieldName] || this.receiptContent()[fieldObj.fieldName] === '') {
            fieldObj.fieldInfo = this.receiptContent()[fieldObj.fieldName];
          }
        });
      }
      return invoiceData.fields
    },
    ...mapActions(['setDefaultChatData']),
    async getChatData() {
      const res = await post(this.chatDataEp, {
        id: this.spID ? this.spID : -1,
        role: this.role,
      })
      await this.setDefaultChatData({dataType: SetChatDataEnum.spChat, newData: [res.returnData]})
    },
    async joinRoom() {
      await this.socket.emit('join_room', {emitEvent: true, room: `sp${this.spID}`})
    },
    listenNewChat() {
      this.socket.on('new_msg', arg => {
        console.log('newData', arg)
        this.$store.commit('updateMsgData', {id: parseInt(this.spID), newMsgData: arg.msg})
      })
    }
  },
  inject: ['socket'],
  watch: {},
  mounted() {
    this.getDataLib();
    this.getSPData();
    this.getChatData()
    this.joinRoom()
    this.listenNewChat()
    this.getNegotiateData();
    this.getDepImgs();
    this.getSigImgs();
    document.addEventListener("keydown", this.closeModalOnEscape);
    this.updateTimer = setInterval(() => {
      this.autoRefresh();
    }, 12000);
  },
  beforeUnmount() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer)
    }
  },
}
</script>

<style scoped>

.chat-rightBar {
  height: 85vh;
}

@media only screen and (max-width: 768px) {
  .chat-rightBar {
    height: 84%;
  }
}
</style>
