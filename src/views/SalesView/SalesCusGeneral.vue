<template>
  <div v-show="$route.name==='Sales cus detail general'">
    <FpDefLayout :is-loading="!finishLoading" :show-loading="true">
      <template #comp>

        <div class="container">
          <div class="d-flex justify-content-center">
            <div class="col-lg-6 col-11 p-3 ">
              <FpCusTag :avtSize="100" :cusName="cusData.name" :phoneNumber="cusData.phone" :cusId="cusData.id || -1"
                        :avtSrc="cusData" :dotSize="dotSize" :dotColor="cusData.rank ? avtOutlineColor : ''"
                        :avtOutline="avtOutlineColor" :note="cusData.persona" :lastInteract="cusData.last_update"
                        :updateNote="true" @editCusNote="newCusNoteData" :activeDot="cusData.active"
                        :activeColor="avtOutlineColor" :socialDirect="true" :can-go-cus-detail="true"
                        :facebook="cusData.fb"/>
            </div>
          </div>
          <div class="row mt-4 py-3 px-2 d-flex justify-content-center">
            <div class="col-lg-6 col-12">
              <div class="row d-flex justify-content-end px-2">
                <div class="col-auto">
                  <ButtonView :text-size="14" status="gray-btn" content="Tạo nhu cầu"
                              :btnIcon="getIconUrl('adminRequest.svg')" :iconSize="20" :square-padding="true"
                              @btnClick="onGoToCreateInq"/>
                </div>
                <div class="col-auto cus-detail-tour-1">
                  <ButtonView @click="cusExtendPopup=true" status="gray-btn"
                              :btnIcon="getIconUrl('DotsThreeVertical.svg')" :iconSize="20" style="rotate: 90deg"
                              :square-padding="true"/>
                </div>
                <PopupTemplate popup-class="border8 col-lg-4 col-10 text-content shadow-popup" v-if="cusExtendPopup"
                               @close-popup="cusExtendPopup=false">
                  <template #contentPopup>
                    <p @click="cusUpdateUrl()" class="px-2">Cập nhật thông tin</p>
                    <p class="px-2 text-color-black" @click="showAllDoneSp=!showAllDoneSp;cusExtendPopup=false">Đã giao
                      dịch</p>
                    <p>
                      <VerifyModal
                          @func-btn-clicked="removeCustomer"
                          :id="'rmCusVerify'+ cusData.id"
                          triggerBtnText="Xóa khách hàng"
                          title="XÁC NHẬN XÓA KHÁCH HÀNG"
                          :content="rmCusContent"
                          funcBtnText="Xác nhận"
                          trigger-btn-class="border-0 bg-white text-gray"
                      />
                    </p>
                  </template>
                </PopupTemplate>

              </div>
            </div>
          </div>

          <!--       region done sp  -->

          <div class="p-lg-3 p-2">
            <template v-for="(sp,index) in spDoneData">
              <!--            check sales process have receipt but haven't received the commission yet -->
              <div class="border8 p-lg-4 p-3 mt-3 " style="background: rgba(94, 82, 255, 0.10)" :key="index"
                   v-if="showAllDoneSp || (!notHasReceipt(sp) && !receiptSalesVerified(sp))">
                <div class=" d-flex justify-content-between">
                  <span class="font-weight-600 col-auto">Đã {{ sp?.rent ? 'thuê' : 'mua' }} {{ sp?.unitCode }} </span>
                  <span class="col-auto">
                      <FpIcon src-icon="Sparkle.svg" :size="28"></FpIcon>
                    </span>
                </div>
                <p class="text-gray text-sm-12">Ngày {{ ddMmYyyy(sp?.signingDate) }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="col-auto text-sm-12" v-if="notHasReceipt(sp)">Chờ xử lý...</span>
                  <span class="col-auto text-sm-12" v-if="!notHasReceipt(sp)"> {{
                      receiptSalesVerified(sp) ? '' : `Hoa hồng: ${sp?.receiptData?.feeSales} Triệu`
                    }}</span>
                  <ButtonView :text-size="12" status="more-btn"
                              :content="(receiptSalesVerified(sp) || notHasReceipt(sp)) ? 'Chi tiết >' :  `Nhận hoa hồng` "
                              class="col-auto"
                              @click="(receiptSalesVerified(sp) || notHasReceipt(sp)) ? onGoDetailSp(sp?.id) : receiptVerifySales(sp.id)"
                  ></ButtonView>
                </div>
              </div>
            </template>

          </div>

          <!--        end region -->

          <!--        region: done psp-->
          <div class="p-lg-3 p-2" v-if="showAllDoneSp && pspDoneData.length">
            <div class="border8 p-lg-4 p-3 mt-3" v-for="(sp,index) in pspDoneData"
                 style="background: rgba(94, 82, 255, 0.10)" :key="index">
              <div class=" d-flex justify-content-between">
                <span class="font-weight-600 col-auto">Đã {{ sp?.rent ? 'thuê' : 'mua' }} {{ sp?.pjName }} </span>
                <span class="col-auto">
                      <FpIcon src-icon="Sparkle.svg" :size="28"></FpIcon>
               </span>
              </div>
              <p class="text-gray text-sm-12">Ngày {{ ddMmYyyy(sp?.signingDate) }}</p>
              <div class="d-flex justify-content-end">
                <ButtonView :text-size="12" status="more-btn"
                            content="Chi tiết > " class="col-auto"
                            @click="goToPSPDetail(sp.id)"
                ></ButtonView>
              </div>
            </div>

          </div>
          <!--        end region-->
          <div v-if="inqData && inqData.length>0" class="p-3">
            <div class="p-lg-3 p-2 card-gray-teal mt-2" v-for="(inq, index) in inqData" :key="index" @click="onExtendCard(index)">
              <div class="mt-2 d-flex justify-content-between position-relative flex-wrap">
                <div class="col-lg-7 col-8">
                  <FpPjTag :pjStatusCode="getCusStatusFromData(inq)" :fav="inq.fav"
                           :pjInformation="getPjInformation(inq)"/>
                </div>
                <div class="col-lg col-12 mt-lg-5 mt-lg-3 mb-3 mb-lg-0" @click='onEditNote(inq.id)'>
                  <div class="d-flex justify-content-between mt-4 justify-content-lg-end flex-wrap align-items-center">
                    <div class="col-auto mx-3">
                      <div class="row d-flex align-items-center">
                        <img v-if="checkRequiredInq(inq)" :src="getIconUrl('HeadsetWavy.svg')"
                             class="col-auto pe-0" alt="icon-request" @click="goToReqChatPage(checkRequiredInq(inq))"
                             style="width: 24px;height: 24px;padding: 0"
                        />
                        <span class="col ps-1 text-wrap justify-content-lg-end d-flex align-items-center">{{
                            getTotalAdvise(inq)
                          }}</span>
                      </div>
                    </div>
                    <div class="col-auto mx-3">
                      <div class="row d-flex align-items-center">
                        <ButtonView status="gray-btn" content="Tư vấn" :textSize="14" class="col-auto cus-detail-tour-2"
                                    @click="onGotoPairingUnit(inq.id,inq.sps.length)"/>
                        <span class="col-auto pe-0 text-content position-relative">
                          <ButtonView status="gray-btn" :btnIcon="getIconUrl('DotsThreeVertical.svg')" :iconSize="20"
                                      style="rotate: 90deg" :square-padding="true"
                                      @click="showInqChangePopup=true; idPopup=inq.id"/>
                          <FpDot dot-color="#FF4747" :dot-size="8" class=" position-absolute top-0 end-0"
                                 v-if="checkSeenCanceledSp(inq.ownCanceledSPs)>=1"></FpDot>
                       </span>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="p-lg-3 p-2 position-absolute dot-position">
                  <div class="row d-flex justify-content-around align-items-center">
                    <div class="col-auto p-0">
                      <FpIcon :src="getIconUrl(inq.fav ?'star-solid.svg' : 'star.svg')" :size="28"
                              @click.stop="onFavClick(inq.id,inq.fav)" ></FpIcon>
                    </div>
                    <div class="col-auto" @click="onExtendCard(index)">
                      <FpDot :dotSize="24"
                             :outlineCustom=" showCard === index ? '0 0 0 5px #5e52ff' : getOutlineDot(inq.rent)"
                             dot-class="d-flex align-items-center justify-content-center">
                        <template #customContent>
                          <FpIconRotate :src="getIconUrl('chevron-down-solid.svg')"
                                        :class="{'rotate-180' : index === showCard}" :size="12"></FpIconRotate>
                        </template>
                      </FpDot>
                    </div>
                  </div>

                </div>
              </div>

              <div v-show="index === showCard" class="row cus-detail-tour-3">
                <div v-for="(spData,index) in getSpDataInInq(inq)" :key="index" class="mt-4 col-12 col-md-6 col-lg-4">

                  <FpUnitCard :imgSrc="getImgsInSpsData(spData)" classes="card-blue p-2 px-3 h-100 py-4"
                              :unit-tag="getImgUnitTag(spData.unitData)"
                              :class="{'canceled-card':spsStatus(spData.status)}"
                              unit-text-img-style="font-size:14px;margin-bottom:30px"
                              :pjInformation="getUnitInformation(spData,inq)" :show-fur-text="true"
                              :tag-pj-code="`#${spData.id}`"
                              :ratioImg="[3,2]" @click="goSpsDetail(spData.id)">
                    <template #customField>
                      <div class="d-flex justify-content-between mt-4 mb-4" v-if="spData?.agentData">
                        <div class="col-auto d-flex align-items-center px-2">
                          <FpUserImg :size="32" :borderRound="16"
                                     :url="getUrlTypeAvtOfCusData(spData?.agentData?.extData[0]).url"
                                     :type="getUrlTypeAvtOfCusData(spData?.agentData?.extData[0]).type"></FpUserImg>
                          <span class="mx-2 text-gray">{{ spData?.agentData?.first_name }}</span>
                        </div>

                        <VerifySttBtn btn-type="more-btn" ref="verifySttBtn" :preventOnclick="preventSpBtn"
                                      v-if="checkShowVerifyBtn(spData)"
                                      :sp-data="spData" class="col-auto h-auto" :text-size="12"
                                      @click="spStepCheckPopup(inq.id,'verifySttBtn')"></VerifySttBtn>

                        <SkipSttBtn btn-type="more-btn" ref="skipSttBtn" :preventOnclick="preventSpBtn"
                                    v-if="checkShowSkipBtn(spData)"
                                    :sp-data="spData" class="col-auto h-auto" :text-size="12"
                                    @click="spStepCheckPopup(inq.id,'skipSttBtn')"></SkipSttBtn>

                        <span class="d-flex col-auto text-gray mt-auto" v-if="spData?.sugStatus && ! spData?.sugByAgent">Chờ xác nhận</span>
                      </div>
                      <AppointingBtn
                          v-if="spData.sFreeTime.length === 0 && !spData.nextMeetingDate && spData.agentData"
                          :spData="spData" :defaultTime="appointingTime(inq)" :preventOnclick="true"
                      />

                    </template>
                  </FpUnitCard>
                </div>
                <div v-for="(psp,index) in getPspDataInInq(inq)" class="mt-4 col-12 col-md-6 col-lg-4" :key="index"
                     style="height: 500px">
                  <PspCard class="card-blue p-2 px-3 h-100 py-4" :pspData="psp"
                           @click="goToPSPDetail(psp.id)"
                           :class="{'canceled-card':spsStatus(psp.status)}"
                  ></PspCard>
                </div>
              </div>
              <PopupTemplate popup-class="border8 col-lg-4 col-10 shadow-popup"
                             v-if="showInqChangePopup && idPopup===inq.id" @close-popup="showInqChangePopup=false">
                <template #contentPopup>
                  <p class="sidebar-menu_item p-2" @click="goToInqUpdate(inq.id)">Cập nhật nhu cầu </p>
                  <p class="sidebar-menu_item p-2 d-flex align-items-center" :class="{'bg-currentSidebar':showActiveSP}"
                     @click="showActiveSP=true;showInqChangePopup=false;showCard=index">
                    <FpIcon src-icon="confirm-check-solid.svg" :size="20" v-if="showActiveSP" class="me-2"></FpIcon>
                    Đang hoạt động
                  </p>
                  <p class="sidebar-menu_item p-2  d-flex align-items-center"
                     :class="{'bg-currentSidebar':isCusCanceled && !showActiveSP}"
                     @click="onFilterCanceledSp(true);showCard=index">
                    <FpIcon src-icon="confirm-check-solid.svg" :size="20" v-if="isCusCanceled && !showActiveSP"
                            class="me-2"></FpIcon>
                    Giao dịch đã hủy
                  </p>
                  <p class="sidebar-menu_item p-2  d-flex align-items-center"
                     :class="{'bg-currentSidebar':!isCusCanceled && !showActiveSP}"
                     @click="seenOwnCanceled(inq.ownCanceledSPs);showCard=index">
                  <span :class="checkSeenCanceledSp(inq.ownCanceledSPs)>=1 ? 'font-weight-600' : ''">
                  <FpIcon src-icon="confirm-check-solid.svg" :size="20" v-if="!isCusCanceled && !showActiveSP"
                          class="me-2"></FpIcon>
                    Căn hộ dừng giao dịch
                    <span v-if="checkSeenCanceledSp(inq.ownCanceledSPs)>=1"
                          class="font-weight-600">({{ checkSeenCanceledSp(inq.ownCanceledSPs) }})</span>
                  </span>
                  </p>
                  <p class="sidebar-menu_item p-2" @click="onDeleteInq(inq.id)">Xóa nhu cầu</p>
                </template>
              </PopupTemplate>
              <PopupTemplate popup-class="border8 col-lg-4 col-xl-3 col-10 shadow-popup" v-if="spConfirmPopup===inq.id"
                             @close-popup="spConfirmPopup=-1">
                <template #contentPopup>
                  <p class="text-center">Xác nhận đã hẹn thành công?</p>
                  <div class="row d-flex justify-content-center align-items-center">
                    <ButtonView status="more-btn" content="Xác nhận" class="col-auto" :text-size="14"
                                @click="confirmSpNextStep"></ButtonView>
                    <span class="col-auto text-gray mx-2" @click="spConfirmPopup=-1"> Để sau</span>
                  </div>
                </template>
              </PopupTemplate>
            </div>

          </div>
          <div v-else>
            <div class="row d-flex justify-content-center align-items-center mt-5">
              <h2 class="text-center advise-empty">Không có sẵn nhu cầu</h2>
              <div class="col-auto">
                <FpIcon srcIcon="emptyInquiry.png" :size="200"/>
              </div>
            </div>
          </div>
        </div>

      </template>
    </FpDefLayout>
    <TextNotification
        v-if='copy_notification'
        :message='notiMsg'
        @close='removeNotifications'
        :closeNotiTime="2200"
    />

    <TourHost
      pageName="salesCusDetailTour"
      :tourOptions="pageTour['Sales Customer Detail Tour']"
      :startDelay="500"
    />
  </div>
  <router-view></router-view>
</template>

<script>
import {getIconUrl, getObjField, floatFixed, translate, floatBugFixed, replaceCharacter} from "@/utils/utils";
import PopupClickGotoInqUpdate from "@/components/FpPopup/PopupClickGotoInqUpdate.vue";
import FpCusTag from "@/components/FpTag/FpCusTag.vue";
import FpDefLayout from "@/views/FpDefLayout.vue";
import {getCompareValue, post} from "@/utils/dataQuery";
import {Roles} from "@/utils/constants";
import FpPjTag from "@/components/FpTag/FpPjTag.vue";
import FpDot from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpDot.vue";
import {cusRankColor} from "@/utils/cusConstants";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {favObj, favObjAPI} from "@/utils/favAPI";
import FpUnitCard from "@/components/FpUnit/FpUnitCard.vue";
import {DataLibType} from "@/utils/dataLib";
import {
  S_CREATE_CUS_URL,
  S_CUS_UPDATE_URL, S_DASHBOARD_URL,
  S_INQ_DETAIL_URL,
  S_PAIREDINQ,
  S_SP_DETAIL_URL
} from "@/router/URLs";
import VerifyModal from "@/components/Misc/VerifyModal.vue";
import {InquiryStatusEnum, maxRunningSP} from "@/utils/inqConstant";
import TextNotification from "@/components/Misc/TextNotification.vue";
import SalesPersonProcMgCard from "@/views/SalesView/SalesPersonal/SalesPersonProcMgCard.vue";
import PspCard from "@/components/FpUnit/PspCard.vue";
import FpIconRotate from "@/components/FpIcon/FpIconRotate.vue";
import PopupTemplate from "@/components/FpPopup/PopupTemplate.vue";
import AppointingBtn from "@/views/CommonView/SPDetailComps/AppointingBtn.vue";
import {getImgUnitTag, unitPrice} from "@/utils/unit";
import {VIEW, POINTING, viewsTranslate, SPSttEnum} from "@/utils/TransContent";
import VerifySttBtn from "@/views/CommonView/SPDetailComps/VerifySttBtn.vue";
import SkipSttBtn from "@/views/CommonView/SPDetailComps/SkipSttBtn.vue";
import FpUserAvt from "@/components/FpImg/FpUserAvt.vue";
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";
import {ddMmYyyy} from "@/utils/dateTimeUtils";
import {notHasReceipt, receiptSalesVerified} from "@/utils/saleProcess";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";
import TourHost from "@/views/Guidance/TourHost.vue";
import {pageTour} from "@/views/Guidance/pageTour";
import {breadcrumpProp} from "@/models/customProp";

const today = new Date()

export default {
  components: {
    TourHost,
    FpUserImg,
    FpUserAvt,
    SkipSttBtn,
    VerifySttBtn,
    PopupTemplate,
    PspCard,
    SalesPersonProcMgCard,
    FpUnitCard,
    FpIcon,
    FpCusTag,
    FpDefLayout,
    FpPjTag,
    FpDot,
    ButtonView,
    PopupClickGotoInqUpdate,
    VerifyModal,
    TextNotification,
    FpIconRotate,
    AppointingBtn
  },
  data() {
    return {
      cusData: [],
      editNote: -1,
      UNIT_TYPE: [],
      inqUpdatePopup: false,
      inqData: [],
      HEIGHT: [],
      copy_notification: false,
      notiMsg: '',
      finishLoading: false,
      showCard: 0,
      showInqChangePopup: false,
      idPopup: -1,
      showActiveSP: true,
      isCusCanceled: true,
      POINTING,
      VIEW,
      cusExtendPopup: false,
      spConfirmPopup: -1,
      refBtnConfirm: '',
      preventSpBtn: true,
      spDoneData: [],
      pspDoneData: [],
      showAllDoneSp: false,
      cusID:-1,
      pgMeta: {
        [breadcrumpProp.title]: '',
      },
      // import
      pageTour,
    }
  },
  computed: {
    dotSize() {
      return this.cusData.active ? 12 : 0
    },
    avtOutlineColor() {
      return cusRankColor[this.cusData.rank]
    },
    rmCusContent() {
      return `
      Bạn có xác nhận xóa khách ${this.cusData.name}
      Bạn sẽ không thể khôi phục khách sau khi đã xóa`;
    },
  },
  methods: {
    receiptSalesVerified,
    notHasReceipt,
    ddMmYyyy,
    getUrlTypeAvtOfCusData,
    onGoDetailSp(id) {
      this.goSpsDetail(id)
    },
    async getDoneSpApi() {
      const res = await post('/sales/get_cus_detail_done_sps', {
        customer: this.cusID,
        status: SPSttEnum.DONE,
      })
      this.spDoneData = res.returnData
    },
    async getDonePspApi() {
      const res = await post('/sales/get_cus_detail_done_psps', {
        customer: this.cusID,
        status: SPSttEnum.DONE,
      })
      this.pspDoneData = res.returnData
    },
    spStepCheckPopup(spID, refBtn) {
      this.spConfirmPopup = spID
      this.refBtnConfirm = refBtn
      this.preventSpBtn = false
    },
    confirmSpNextStep() {
      if (this.refBtnConfirm) {
        this.$refs[this.refBtnConfirm][0].btnClick()
        this.spConfirmPopup = -1
        this.preventSpBtn = true
      }
    },
    checkShowVerifyBtn(sp) {
      return (sp?.sugStatus && sp.sugByAgent)
    },
    checkShowSkipBtn(sp) {
      return sp?.nextMeetingDate && new Date(sp?.nextMeetingDate) < new Date() && !sp?.sugStatus
    },
    onExtendCard(index) {
      this.showCard = (this.showCard === index) ? -1 : index
      this.showActiveSP = true
      this.isCusCanceled = true
    },
    checkRequiredInq(inq) {
      return inq?.uRequest?.id
    },
    onFilterCanceledSp(active) {
      this.showActiveSP = false
      this.isCusCanceled = active
      this.showInqChangePopup = false
    },
    seenOwnCanceled(inq) {
      let ownerSpID = [];
      if (inq.length) {
        ownerSpID = inq.filter(sp => sp?.sSeen === false).map(sp => sp.id);
      }
      if (ownerSpID.length) {
        this.sendToSeverOwnCanceledSeen(ownerSpID)
      }
      this.onFilterCanceledSp(false)
    },
    appointingTime(inqData) {
      if (!inqData) {
        return;
      }

      let returnTime = null;

      for (const sp of inqData.sps) {
        const nextMDay = new Date(sp.nextMeetingDate)
        if (sp.nextMeetingDate && nextMDay > today && (nextMDay < returnTime || returnTime === null)) {
          returnTime = nextMDay;
        }
      }

      if (returnTime != null) {
        return returnTime;
      }

      for (const sp of inqData.sps) {
        const freeTime = sp.sFreeTime.length >= 1 ? new Date(sp.sFreeTime[0][0]) : today;
        if (sp.sFreeTime.length === 1 && freeTime > today && (freeTime < returnTime || returnTime === null)) {
          returnTime = freeTime;
        }
      }

      return returnTime ? returnTime : new Date();
    },
    async sendToSeverOwnCanceledSeen(ownCancelId) {
      const res = await post('/sale_process/seen_sps', {
        ids: ownCancelId,
        role: Roles.Sales
      })
      if (res) {
        await this.getInqData()
      }
    },
    getSpDataInInq(inq) {
      if (this.showActiveSP) {
        return inq?.sps
      } else {
        return this.isCusCanceled ? inq?.cusCanceledSPs : inq?.ownCanceledSPs
      }
    },
    getPspDataInInq(inq) {
      if (this.showActiveSP) {
        return inq?.psps
      }
      if (!this.showActiveSP && this.isCusCanceled) {
        return inq?.canceledPSPs
      }
    },
    goToReqChatPage(id) {
      this.$router.push({name: 'SalesChat', params: {reqChatId: id}})
    },
    goToPSPDetail(id) {
      this.$router.push({
        name: 'Sales Personal SP Detail', query: {
          pspID: id,
          setEditDefault: 0
        }
      })
    },
    checkSeenCanceledSp(ownerCanceledSp) {
      let count = 0;
      if (ownerCanceledSp.length) {
        for (const sp of ownerCanceledSp) {
          if (sp.hasOwnProperty('sSeen') && !sp.sSeen) {
            count++;
          }
        }
      }
      return count
    },
    getIconUrl,
    newCusNoteData(note) {
      note = note?.replace(/\n/g, '')
      if (note !== this.cusData.persona) {
        const res = post('/sales/update_customer_data_api', {
          id: this.cusData.id,
          persona: note
        })
      }
    },
    removeNotifications() {
      this.copy_notification = !this.copy_notification
    },
    spsStatus(status) {
      return status === 'cusCanceled' || status === 'ownCanceled'
    },
    async onFavClick(id, favStatus) {
      const favSucceed = await favObjAPI(favObj.UINQUIRY, id, !favStatus);
      if (favSucceed) {
        // this.setFavInqInCusData(id, favStatus)
        await this.getInqData()
      }
    },
    setFavInqInCusData(id, favStatus) {
      this.inqData?.map(inq => {
        if (inq.id === id) {
          inq.fav = favStatus
        }
      })
    },
    onEditNote(pjId) {
      this.editNote = pjId
    },
    // code = rent + projectName + price
    getCusStatusFromData(inqData) {
      const renting = inqData.rent ? 'Thuê' : 'Mua';
      let price = '';
      let name = ''
      if (parseInt(inqData.ceilingPrice) > 0) {
        price = convertVndToUserCurrency(inqData.ceilingPrice, inqData.rent, UnitCurrency.simple)
      } else {
        price = ''
      }
      if (inqData.blkDt && Object.values(inqData.blkDt).length > 0) {
        for (const [key, value] of Object.entries(inqData.blkDt)) {
          name = name + `${key} ${this.splitBlockValue(value)} `;
        }
      }
      return `${renting} ${name} ${price}`
    },
    splitBlockValue(blockVal) {
      if (blockVal.length < 0) {
        return '';
      } else {
        return blockVal.map(blockName => `[${blockName}]`).join(' ')
      }
    },
    getPjInformation(data) {
      let heights = `Tầng `
      data?.heights.map(e => {
        heights = heights + translate(this.HEIGHT, e) + ' '
      })
      return {
        id: getObjField(data, 'id'),
        bedroom: getObjField(data, 'bedroom'),
        bathroom: getObjField(data, 'bathroom'),
        size: getObjField(data, 'size'),
        furText: getObjField(data, 'furniture') === 'fully' ? 'Full nội thất' : 'Nội thất cơ bản',
        balcony: data.balcony ? `Hướng ${translate(this.POINTING, data?.balcony)}` : '',
        fav: getObjField(data, 'fav'),
        moveInDay: getObjField(data, 'moveInDay'),
        unitType: data?.unitType !== 'ap' ? this.transUnitType(data.unitType) : '',
        heights: data.heights.length ? heights : '',
        views: data?.views.length ? 'View ' + viewsTranslate(data.views) : ''
      }
    },
    getImgUnitTag(unit) {
      return getImgUnitTag({
        furniture: unit.furniture === 'fully'
      })
    },
    getUnitInformation(sps, inq) {
      const data = sps.unitData;
      // let price = floatBugFixed(getObjField(sps, 'cusPrice')) + (inq.rent ? 'Tr' : ' Tỷ');
      let price = convertVndToUserCurrency(getObjField(sps, 'cusPrice'), inq.rent, UnitCurrency.extend)
      return {
        id: getObjField(data, 'id'),
        bedroom: getObjField(data, 'bedroom'),
        bathroom: getObjField(data, 'bathroom'),
        pjData: getObjField(data, 'pjData'),
        pjBlock: getObjField(data, 'block'),
        size: getObjField(data, 'size'),
        managementCoverage: getObjField(data, 'managementCoverage'),
        price: price ? price : '',
        balcony: getObjField(data, 'balcony'),
        rent: inq.rent,
        status: getObjField(sps, 'status'),
        aFreeTime: getObjField(sps, 'aFreeTime'),
        sFreeTime: getObjField(sps, 'sFreeTime'),
        nextMeetingDate: getObjField(sps, 'nextMeetingDate'),
        moveInDay: getObjField(inq, 'moveInDay'),
        unitType: inq.unitType !== 'ap' ? this.transUnitType(inq.unitType) : '',
        agentData: sps.agentData?.first_name,
      }
    },
    async getUiApi() {
      const res = await post('/sales/get_cus_data_api', {
        id: this.cusID ? this.cusID : -1,
        role: Roles.Sales,
      })
      this.cusData = res.returnData
      this.pgMeta[breadcrumpProp.title] = this.cusData?.name
    },
    async getInqData() {
      const res = await post('/sales/cus_detail_inqs_data', {
        customer: this.cusID,
        status: 'waiting',
        favSorting: '-last_update'
      })
      this.inqData = res.returnData
      this.finishLoading = true
    },
    getOutlineDot(rent) {
      return rent ? '0 0 0 5px #48BD48' : '0 0 0 5px #F76754'
    },
    getTotalAdvise(inq) {
      const adviseNumb = inq?.sps.length + inq?.cusCanceledSPs.length + inq?.ownCanceledSPs.length + inq?.psps.length + inq?.canceledPSPs.length
      return adviseNumb ? `Đã tư vấn ${adviseNumb} căn hộ` : 'Chưa tư vấn'
    },
    getImgsInSpsData(spsData) {
      if (spsData && spsData.unitData) {
        return spsData.unitData?.imgs.length > 0 ? spsData.unitData?.imgs[0]?.thumb : ''
      }
      return 'noImgAvailable.jpg'
    },
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.UNIT_TYPE, DataLibType.HEIGHT]
      );
      this.UNIT_TYPE = res.UNIT_TYPE
      this.HEIGHT = res.HEIGHT
    },
    async removeCustomer() {
      const res = await post("/sales/remove_customer", {
        id: this.cusID
      })
      if (res && res.succeed) {
        this.cusExtendPopup = false
        this.$router.push(S_DASHBOARD_URL);
      }
    },
    transUnitType(unitType) {
      return translate(this.UNIT_TYPE, unitType)
    },
    cusUpdateUrl() {
      return  this.$router.push({name:'update cus data',params:{cusID: this.cusID}})
    },
    async receiptVerifySales(spID) {
      const res = await post("/sale_process/sales_verify_sp_receipt", {
        role: Roles.Sales,
        id: spID,
      });
      if (!res) {
        return;
      }
      this.copy_notification = true
      this.notiMsg = 'Nhận hoa hồng thành công rồi đó bạn ơi!'
      this.serverResText = res.resText;
      await this.getDoneSpApi()
    },
    goToInqUpdate(id) {
      if (id) {
        this.$router.push({name:'Sales UInquiry',params:{inqID:id,cusID:this.cusID}})
      }
      this.inqUpdatePopup = false
    },
    async onDeleteInq(id) {
      const res = await post('/sales/update_u_inquiry_api', {
        id: id,
        status: InquiryStatusEnum.canceled
      })
      if (res.succeed) {
        await this.getInqData();
        this.showInqChangePopup = false
      }
    },
    onGoToCreateInq() {
      this.$router.push({name:'Sales Create Inq Cus',params:{cusID:this.cusID}})
    },
    async onGotoPairingUnit(id, spsCount) {
      if (spsCount >= maxRunningSP) {
        this.copy_notification = true
        this.notiMsg = 'Xin lỗi, bạn đã sử dụng đủ số lượt tư vấn. Để tiếp tục tư vấn, vui lòng huỷ ít nhất một giao dịch đang có trong tư vấn này!.'
      } else {
        this.$router.push({
          name:'Sales paired inq',
          params: {
            inqId:id,
            cusID: this.cusID,
          }
        })
      }
    },
    goSpsDetail(id) {
      this.$router.push(S_SP_DETAIL_URL + "-" + id)
    }
  },
  async mounted() {
    this.cusID = parseInt(this.$route?.params?.cusID)
    await this.getInqData()
    await this.getDoneSpApi()
    await this.getDonePspApi()
    await this.getDataLib()
    await this.getUiApi()
  },
}
</script>

<style scoped>

.dot-position {
  right: 0;
  top: 0;
}

.advise-empty {
  color: rgba(0, 0, 0, 0.1);
}

</style>
