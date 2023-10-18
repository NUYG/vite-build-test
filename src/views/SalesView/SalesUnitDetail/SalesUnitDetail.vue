<template>
  <FpDefLayout
      :bc-props="pgMeta"
      ref="pgLayoutComp"
      @breadcrumbBackIcon="onBreadcrumbBackIcon"
      :is-guest="isGuest"
      :toast-msg-content="toastMsg"
      @closeToast="toastMsg=''"
  >
    <template #comp>
      <div v-if="unitData && !successPageDirect" class="container-fluid">
        <div class="col-lg-12 mt-3">
          <div class="p-lg-1 p-xl-2 p-xxl-3  p-2 card-gray-teal">
            <div class='row p-2 d-flex justify-content-between'>
              <div v-if='unitData.imgs.length > 0' class='col-12 col-xl-7 col-md-12'>
                <SwipeBox
                    :downloadBtn='true'
                    :shareBtn='true'
                    :img='filterUnitImgData(unitData)'
                    :shareTxt="shareImgContent"
                    :showThumb="true"
                    :calHeight="false"
                    imgStyle="object-fit: contain"
                    :swipe-loop="!isGuest"
                    :imgIndexEmit="isGuest ? 3 : 0"
                    @swiper-endpoint="onPopupLoginRequest">

                  <template #extTag v-if="isHotUnit">
                    <div class="position-absolute highlight-unit"
                         style="background-color: rgb(255, 71, 71);z-index: 100; left:0">
                      <span class="text-mb-12 py-1 px-3">Căn hot</span>
                    </div>
                  </template>

                </SwipeBox>
              </div>
              <div class="col p-0 px-lg-2">
                <UnitDetailInformation :pj-information="fillUnitInformation(unitData)"
                                       @favUnit="onFavUnit"
                                       @downloadUnit="onDownloadUnit(unitData)"
                                       @shareUnit="shareUnit"
                                       :freshLv="getUnitLvl(unitData)"
                                       @openRB="onShowRbClick">
                  <template #titleUnit>
                    <div class="row mt-2">
                        <span class="font-weight-600 text-title">
                          {{ priceUnit }}
                        </span>
                      <span class="font-weight-600"
                            v-if="parseInt(unitData?.rFS)>0">Hoa hồng: {{
                          convertVndToUserCurrency(unitData?.rFS, true, UnitCurrency.simple)
                        }} </span>
                    </div>
                  </template>
                  <template #contractAndFee>
                    <div class="row mt-3">
                      <div v-if="unitData.managementCoverage || unitData.feeCoverage || unitData.transferringCoverage"
                           class="col-auto">
                        <FpIcon srcIcon="Checks-solid.svg" :size="20"></FpIcon>
                        <span class="text-color-black pj-info-field">{{ feeText }}</span>
                      </div>
                    </div>
                  </template>
                  <template #extUnitInfo>
                    <div class="px-2 row mt-3">
                      <template v-for="(data,index) in getStatusOfUnit(unitData,renting)" :key="index">
                        <FpTag class="col-auto mx-1" :tag-color="data.color" :border-radius="16">
                          <template #default>
                            <div class="text-12">{{ data.content }}</div>
                          </template>
                        </FpTag>
                      </template>
                    </div>
                    <div v-if="isGuest">
                      <p>...</p>
                      <p class="text-gray fst-italic mt-2 text-sm-12">
                        <span class="text-decoration-underline" @click="$router.push('/login')">Đăng nhập ngay </span>để
                        được truy cập đầy đủ thông tin căn hộ</p>
                    </div>
                  </template>
                </UnitDetailInformation>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 col-lg-6 " v-if="unitData?.layoutData?.thumbnail">
          <p class="text-title font-weight-600 mt-3">Layout căn hộ</p>
          <SwipeBox :swipe-loop="false" :img="[unitData?.layoutData?.thumbnail]" style-img="object-fit:cover" :ratio-img="[3,2]"></SwipeBox>
        </div>
        <div class="mt-4 col-lg-6 " v-if="unitData?.masterPlanData?.imgs?.length > 0">
          <p class="text-title font-weight-600 mt-3">Mặt bằng tầng</p>
          <SwipeBox :swipe-loop="false" :img='unitData?.masterPlanData?.imgs.map((item) => item.wm_url)'/>
        </div>

        <div class="text-title font-weight-600 mt-4">Khoảng giá phổ biến</div>
        <p class="text-content text-gray">{{ getStatusTextByRent(renting) }} căn hộ tại {{ unitData?.pjData?.name }}</p>
        <div class="mt-2 py-3 ">
            <FpPriceMultiRange :format-current-price="formatCurrentPrice" :format-max="formatMaxMinPrice" :format-min="formatMaxMinPrice"
                box-classes="py-5 px-lg-2 px-3 border border8" :renting="renting" v-if="avgPriceUnit && avgPriceUnit.length > 1" :range-value="avgPriceUnit"></FpPriceMultiRange>
        </div>
        <div class="mt-4">
          <ProjectOverall :pjInformation="unitData.pjData"></ProjectOverall>
        </div>
      </div>
      <div class="row d-flex justify-content-center" v-if='successPageDirect'>
        <div class="col-lg-4 col-md-5 col-8">
          <div class="row mt-4 p-4 d-flex justify-content-center ">
            <div class="process-rent-done d-inline-flex align-items-center rounded-circle"
                 style="width: 60px;height: 60px">
              <img :src="getIconUrl('rentCheck.svg')" class="w-100" alt="">
            </div>
          </div>
          <div class="row ">
            <h2 class="d-flex justify-content-center text-center"><b>Ghép nhu cầu thành công !</b></h2>
          </div>
          <div class="row text-center text-gray">
            Căn hộ {{ unitData.pjData.code }} {{ unitData.bedroom > 0 ? unitData.bedroom : "" }}PN Giá
            {{ getPriceByStatus(unitData) }} đã được kết nối với nhu cầu khách {{ inq.cusData.name }}
          </div>
          <div class="row justify-content-between p-lg-3 p-2 mt-2">
            <div class="col-12">
              <button class="w-100 gray-button btn-wrap-text text-white bg-dark small p-2"
                      @click='goToURL(spHref(spId))'>Xem giao dịch
              </button>
            </div>
            <div class="col-12  d-flex justify-content-center mt-md-3 mt-2">
              <a>
                <span class="text-content" @click='successPageDirect=false'>Ghép nhu cầu khác</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #rightBar v-if="!isGuest">
      <div class="mt-2">
        <div class="search-box col-12 p-2">
          <input v-model="inqNameFil" type="text" placeholder="Tìm yêu cầu " class="form-control">
        </div>
      </div>
      <div class="overflow-scroll" style="height: 70vh">
        <div v-if="compaInqs.length">
          <div v-for="(inq, index) in compaInqs" :key="index" class="card-blue mt-3 p-lg-3 p-3">
            <div class="row">
              <div class="col-auto col-md-12 col-lg-auto d-flex justify-content-md-center">
                <FpUserImg :url="getUrlTypeAvtOfCusData(inq.cusData).url"
                           :type="getUrlTypeAvtOfCusData(inq.cusData).type"
                           :size="48" :borderRound="24"/>
              </div>
              <span class="col font-weight-600 text-12 ps-0 col-md-12 col-xl"
                    style="line-height: 20px;">{{ summedCusInqText(inq) }}</span>
            </div>
            <div class="col-12 mt-2" v-show="inq.cusData.persona !== ''">
              <span style="line-height: 18px;" class="text-12 text-gray">{{ inq.cusData.persona }}</span>
            </div>
            <div class="row justify-content-center mt-3 ">
              <ButtonView status="more-btn" content="Ghép khách" class="col-auto" @click="onPairInq(inq)"></ButtonView>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="d-flex justify-content-center align-items-center">
            <FpIcon src-icon="blankcustomer.png" :size="100" class="col-auto"></FpIcon>
          </div>
          <p class=" fst-italic text-center mt-2 font-weight-600">Chưa có khách hàng phù hợp!</p>
        </div>
      </div>
      <PopupTemplate popup-class="border8" v-if="confirmPairCusPopup" :popup-backdrop-color="false"
                     @close-popup="confirmPairCusPopup=false">
        <template #contentPopup>
          <p class="text-title text-center">XÁC NHẬN GHÉP CĂN</p>
          <p class="col-auto">{{ pairUnitContent(pairInqPick) }}</p>
          <div class="row d-flex justify-content-center mt-3">
            <ButtonView content="Hủy bỏ" class="col-auto me-4" status="gray-btn"
                        @click="confirmPairCusPopup=false"></ButtonView>
            <ButtonView content="Xác nhận" class="col-auto" status="gray-btn"
                        @click="uiPairVerified(pairInqPick)"></ButtonView>
          </div>
        </template>
      </PopupTemplate>
    </template>

  </FpDefLayout>
  <RequestLogin v-if="showReqLogin" @popup-closed="showReqLogin=false;textReqLoginContent=''"
                :textContent="textReqLoginContent"></RequestLogin>
  <popup-template v-if="sharePopup&& !isGuest" @close-popup="sharePopup=false" popup-class="border8">
    <template #contentPopup>
      <p class="interact-item p-2" @click="iosShareUnit">Chia sẻ trực tiếp</p>
      <p class="interact-item p-2" @click="getLinkUnit">Sao chép liên kết</p>
      <p class="interact-item p-2" @click="copyUnitInformation">Sao chép thông tin căn hộ</p>
      <p class="interact-item p-2" @click="onDownloadUnit(unitData)">Tải ảnh xuống</p>
    </template>
  </popup-template>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import SwipeBox from "@/components/FpImg/SwipeBox.vue";
import VerifyModal from "@/components/Misc/VerifyModal.vue";
import TextNotification from "@/components/Misc/TextNotification.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {getIconUrl, translate, goToURL, floatFixed, getObjField, getItemFromLocalStorage} from "@/utils/utils";
import {copyTextToClipboard, mobileShare} from "@/utils/utils";
import {getCompareValue, post} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {breadcrumpProp, defLayoutBehaType} from "@/models/customProp"

import {
  unitPriceText,
  shareContent,
  downloadImg,
  getStatusTextByRent,
  uPriceFullPfx, checkUnitFresh, uPricePfxHalfExt, getStatusOfUnit, unitPrice
} from "@/utils/unit";
import {favObj, favObjAPI} from "@/utils/favAPI";
import {calculateWeeks, getDdMm} from "@/utils/dateTimeUtils";
import {Roles} from "@/utils/constants";
import {fpUnitBaseUrl, S_INQ_DETAIL_URL, S_SP_DETAIL_URL} from "@/router/URLs";
import UnitDetailInformation from "@/views/SalesView/SalesUnitDetail/UnitDetailInformation.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import UnitSummedTag from "@/views/SalesView/SalesUnitDetail/UnitSummedTag.vue";
import SpsCusTag from "@/views/SalesView/SalesUnitDetail/SpsCusTag.vue";
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";
import {VIEW, POINTING, HEIGHT} from "@/utils/TransContent";
import ProjectOverall from "@/views/SalesView/SalesUnitDetail/ProjectOverall.vue";
import PopupTemplate from "@/components/FpPopup/PopupTemplate.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import RequestLogin from "@/views/Authencation/RequestLogin.vue";
import FpTag from "@/components/FpTag/FpTag.vue";
import {convertVndToUserCurrency, UnitCurrency, unitTextOfCurrency} from "@/models/currency";
import FpPriceMultiRange from "@/components/FpForm/FpPriceMultiRange.vue";
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import {mapActions, mapGetters} from "vuex";


const viewImg = {
  pool: "pool.svg",
  river: "river.svg",
  city: "city.svg",
  road: "road.svg",
  park: "park.svg ",
  inner: "inner.svg",
  landmark: "landmark.svg",
};

export default {
  components: {
    UnitImg,
    FpPriceMultiRange,
    FpTag,
    RequestLogin,
    PopupTemplate,
    ProjectOverall,
    FpUserImg,
    SpsCusTag,
    UnitSummedTag,
    FpIcon,
    UnitDetailInformation,
    SwipeBox,
    FpDefLayout,
    TextNotification,
    VerifyModal,
    ButtonView
  },

  data() {
    return {
      unitData: false,
      compaInqs: false,
      spId: -1,
      // Controller
      rentingInq: true,
      inqNameFil: "",
      filLocked: false,
      filWaiting: false,
      successPageDirect: false,
      inq: false,
      wm_images: [],
      copy_notification: false,
      // Server communication
      serverResText: "",
      // Trans var
      FURNITURE: [],
      POINTING,
      VIEW,
      SALE_PROCESS_STATUS: [],
      HEIGHT,
      // Meta
      pgMeta: {
        [breadcrumpProp.title]: '',
        [breadcrumpProp.enableFav]: true,
        [breadcrumpProp.defFav]: false,
        [breadcrumpProp.favObjId]: this.unitID ? this.unitID : -1,
        [breadcrumpProp.enableRB]: false,
        [breadcrumpProp.showRB]: false,
        [breadcrumpProp.behaviorType]: defLayoutBehaType.signal,
      },
      confirmPairCusPopup: false,
      pairInqPick: {},
      finishLoading: false,
      showReqLogin: false,
      textReqLoginContent: '',
      sharePopup: false,
      toastMsg: '',
      isGuest: true
    }
  },
  props: {
    // unitID: {
    //   type: Number
    // },
    // renting: {
    //   type: Boolean,
    // },
    fromUnits: {
      type: Boolean
    },
    // isGuest: {
    //   type: Boolean,
    //   default: false
    // }
  },
  computed: {
    ...mapGetters(['getIsLoggedIn']),
    // isGuest()
    // {
    //   return !this.getIsLoggedIn
    // },
    UnitCurrency() {
      return UnitCurrency
    },
    unitTextOfCurrency() {
      return unitTextOfCurrency
    },
    feeText() {
      const coverages = [];
      if (this.unitData?.managementCoverage) {
        coverages.push('Phí quản lý');
      }
      if (this.unitData?.transferringCoverage) {
        coverages.push('Bao sổ');
      }
      if (this.unitData?.feeCoverage) {
        coverages.push('Bao thuế phí');
      }
      return coverages.join(', ');
    },
    pjData() {
      return this.unitData.pjData;
    },
    shareImgContent() {
      if (!this.isGuest) {
        return shareContent(
            this.unitData.renting,
            this.unitData,
            this.FURNITURE,
            this.VIEW,
            this.POINTING
        );
      }
    },
    rBarShowing() {
      return this.$refs.pgLayoutComp.rBShow;
    },
    unitApiUrl() {
      if (this.isGuest) {
        return this.renting ? '/fp_guest/get_renting_unit_data_guest' : '/fp_guest/get_selling_unit_data_guest'
      } else {
        console.log('chạy cái này nè ba')
        return this.renting ? '/sales/get_renting_unit_data' : '/sales/get_selling_unit_data'
      }
    },
    isChromeBrowser() {
      return getItemFromLocalStorage('browser') === 'Chrome'
    },
    isSafariBrowser() {
      return getItemFromLocalStorage('browser') === 'Safari'
    },
    isHotUnit() {
      return this.renting ? this.unitData?.rentFeaturing : this.unitData?.sellFeaturing
    },
    unitFee()
    {
      return this.renting ? parseInt(this.unitData?.rFS) : parseFloat(this.unitData?.sFS)
    },
    priceUnit() {
      return convertVndToUserCurrency(unitPrice(this.unitData?.renting, this.unitData), this.unitData?.renting, UnitCurrency.extend)
    },
    avgPriceUnit() {
      const price = convertVndToUserCurrency(unitPrice(this.unitData?.renting, this.unitData), this.unitData?.renting)
      const similarPrice = this.unitData?.similar_unit_prices
      console.log()
      const rentMin =  similarPrice?.rentMin > parseFloat(price) ? parseFloat(price) : similarPrice?.rentMin
      if (this.renting) {
        return [rentMin, parseFloat(price), similarPrice?.rentMax]
      } else {
        return [similarPrice?.sellMin, parseFloat(price), similarPrice?.sellMax]
      }
    },
    unitID() {
      return this.$route.params?.unitID
    },
    renting()
    {
      return this.$route.params?.renting === 'thue'
    }
  },
  methods: {
    getStatusTextByRent,
    unitPrice, convertVndToUserCurrency,
    getStatusOfUnit,
    calculateWeeks,
    uPricePfxHalfExt,
    getUrlTypeAvtOfCusData,
    downloadImg,
    translate,
    getIconUrl,
    goToURL,
    getDdMm,
    unitPriceText,
    floatFixed,
    formatCurrentPrice(value)
    {
      const text = scrWdtFrom(scrWdtEnum.MD) ? 'Căn hộ đang xem' : 'Hiện tại'
      return `${text}: ${value}${uPriceFullPfx(this.renting)}`
    },
    formatMaxMinPrice(value)
    {
        return `~${value}${uPriceFullPfx(this.renting)}`
    },
    onShowRbClick() {
      this.isGuest ? this.showReqLogin = true : this.showRightBar(!this.rBarShowing)
    },
    onDownloadUnit(unitData) {
      if (this.isGuest) {
        return this.onPopupLoginRequest()
      }
      if (!this.isSafariBrowser) {
        this.downloadImg(unitData.imgs.map((item) => item.wm_url))
      } else {
        this.sharePopup = false
        this.toastMsg = 'Tính năng đang phát triển !'
      }
    },
    copyUnitInformation() {
      copyTextToClipboard(this.shareImgContent)
      this.toastMsg = 'Đã sao chép thông tin căn hộ!'
      this.sharePopup = false
    },
    onPopupLoginRequest() {
      this.textReqLoginContent = 'Vui lòng đăng nhập để có thể xem được đầy đủ hình ảnh'
      this.showReqLogin = true
    },
    filterUnitImgData(unitData) {
      if (this.isGuest) {
        return unitData.imgs.slice(0, 4).map((item) => item.wm_url);
      } else {
        return unitData.imgs.map((item) => item.wm_url);
      }
    },
    getUnitLvl(unit) {
      if (unit) {
        return checkUnitFresh(unit.lastRefresh, unit.renting, unit.lcr)
      }
    },
    onPairInq(inq) {
      this.pairInqPick = inq
      this.confirmPairCusPopup = true
    },
    getLinkUnit() {
      const url = 'https://' + window.location.hostname + fpUnitBaseUrl + '-' + this.unitID;
      copyTextToClipboard(url + `\n${this.shareImgContent}`)
      this.toastMsg = 'Đã sao chép liên kết!'
      this.sharePopup = false
    },
    async shareUnit() {
      if (this.isGuest) {
        this.showReqLogin = true
      } else {
        this.sharePopup = true
      }
    },
    async iosShareUnit() {
      if (!this.isChromeBrowser) {
        await mobileShare(this.unitData.imgs.map((item) => item.wm_url), this.shareImgContent);
        this.sharePopup = false
      } else {
        this.sharePopup = false
        this.toastMsg = 'Tính năng đang phát triển !'
      }
    },
    removeNotifications() {
      this.copy_notification = false;
    },
    pairUnitContent(inq) {
      return `Bạn vừa ghép với khách ${inq.cusData.name}, bạn xác nhận tiếp tục
      ghép khách này không?`;
    },
    floatTrim(num) {
      return floatFixed(num)
    },

    spHref(id) {
      return S_SP_DETAIL_URL + "-" + id;
    },
    inqHref(id) {
      return S_INQ_DETAIL_URL + "/" + id;
    },
    viewIcon(view) {
      return viewImg[view];
    },
    transProcessStatus(val) {
      return translate(this.SALE_PROCESS_STATUS, val);
    },
    transFurniture(val) {
      return translate(this.FURNITURE, val);
    },
    transDirection(val) {
      return translate(this.POINTING, val);
    },
    transHeight(val) {
      return translate(this.HEIGHT, val);
    },
    transView(val) {
      return translate(this.VIEW, val);
    },
    // Controller
    copyUnitContent(rent) {
      copyTextToClipboard(
          shareContent(
              rent,
              this.unitData,
              this.FURNITURE,
              this.VIEW,
              this.POINTING
          )
      );
      this.copy_notification = true
    },
    loadInqs(rent) {
      this.rentingInq = rent;
      this.showRightBar(true);
      this.getComInqs(rent);
    },
    psProgress(data) {
      if (data.status === "waiting" && data.nextMeetingDate != null) {
        return "scouting";
      }
      return data.status;
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
    progressBarColor(data) {
      return data.rent ? "rent-color " : "sell-color";
    },
    uiPairVerified(inq) {
      this.pairInq(inq);
    },
    getPriceByStatus(unit) {
      return convertVndToUserCurrency(unitPrice(unit.renting, unit), unit.renting)
      // return unitPriceText(unit.renting, unit)
    },
    showRightBar(show) {
      this.$refs.pgLayoutComp.showRightBar(show);
    },
    // APIs
    async getUnitData() {
      console.log(this.isGuest,'là guiest ? ',this.unitApiUrl)
      const res = await post(this.unitApiUrl, {
        id: this.unitID ? this.unitID : -1,
        role: Roles.Sales,
      })
      // console.log(JSON.parse(res.returnData))
      if (!res) {
        return;
      }
      this.serverResText = res.resText;
      if (res.succeed) {
        this.unitData = res.returnData;
        this.rentingInq = this.unitData.renting;
        const checkRent = this.unitData.renting ? "Thuê - " : "Bán - ";
        const bedRoom = this.unitData.bedroom;
        const pjCode = this.unitData?.pjData?.code;
        const price = unitPriceText(this.unitData?.renting, this.unitData);
        this.pgMeta[breadcrumpProp.title] = `${checkRent} ${pjCode} ${bedRoom}PN ${price}`;
        await this.getComInqs(this.renting);
        this.finishLoading = true
      }
    },
    async getComInqs(rent = true) {
      if (!this.isGuest) {
        const res = await post("/sales/get_compatible_inqs", {
          exInqs: this.unitData.paired_inqs,
          rent: rent,
          status: "waiting",
          ceilingPrice: rent
              ? this.unitData.rentingPrice
              : this.unitData.sellingPrice,
          bedroom: this.unitData.bedroom,
          project: this.unitData.pjData.id,
          name: this.inqNameFil,
          exFullSP: true,
          listLen: 9999,
        })
        if (!res) {
          return;
        }
        this.serverResText = res.resText;
        if (res.succeed) {
          this.compaInqs = res.returnData;
          // console.log(this.compaInqs);

          if (this.filWaiting) {
            this.filWaiting = false;
            await this.getComInqs(rent);
          } else {
            this.filLocked = false;
          }
        }
      }
    },
    async pairInq(inq) {
      this.inq = inq;
      const res = await post("/sale_process/create_sale_process", {
        inquiryId: inq.id,
        unitId: this.unitData.id,
      })
      if (!res.succeed) {
        window.alert(res.resText);
        return;
      }
      this.showRightBar(false)
      this.spId = res.spID
      this.successPageDirect = true;
      this.confirmPairCusPopup = false
      await this.getUnitData();
    },
    async unpairInq(inqId) {
      const res = await post("/sales/cancel_sp_api", {
        inquiryId: inqId,
        unitId: this.unitData.id,
      });
      window.alert(res.resText);
      if (res.succeed) {
        await this.getUnitData();
      }
    },
    onBreadcrumbBackIcon() {
      if (this.rBarShowing && !scrWdtFrom(scrWdtEnum.MD)) {
        this.showRightBar(false)
      } else if (this.fromUnits) {
        this.$emit('unitDetailBack')
      } else {
        this.$router.back()
      }
    },
    getPjDistrict(pjData) {
      if (pjData) {
        return `${getObjField(pjData, 'name')},${getObjField(pjData, 'district')}`
      }
    },
    fillUnitInformation(data) {
      return {
        id: getObjField(data, 'id'),
        pjName: this.getPjDistrict(getObjField(data, 'pjData')),
        bedroom: getObjField(data, 'bedroom'),
        bathroom: getObjField(data, 'bathroom'),
        size: getObjField(data, 'size'),
        door: getObjField(data, 'door'),
        furniture: getObjField(data, 'furniture'),
        balcony: getObjField(data, 'balcony'),
        view: getObjField(data, 'view'),
        view2: getObjField(data, 'view2'),
        block: getObjField(data, 'block'),
        height: getObjField(data, 'height'),
        fav: getObjField(data, 'fav'),
        unitType: data?.unitType !== 'ap' ? data?.unitType : '',
        managementCoverage: getObjField(data, 'managementCoverage'),
        transferringCoverage: getObjField(data, 'transferringCoverage'),
        feeCoverage: getObjField(data, 'feeCoverage'),
        contractExpiry: getObjField(data, 'contractExpiry'),
        desc: getObjField(data, 'desc')
        // unitType:'penthouse'
      }
    },
    async onFavUnit(fav) {
      if (this.isGuest) {
        return this.showReqLogin = true
      }
      const res = await favObjAPI(favObj.UNIT, this.unitData.id, fav)
      if (res) {
        await this.getUnitData();
      }
    },
    summedCusInqText(inq) {
      const name = getObjField(inq.cusData, 'name')
      let pjName = ''
      if (inq.pjData) {
        pjName = getObjField(inq.pjData[0], 'name')
      }
      const bedroom = inq.bedroom ? inq.bedroom + 'PN' : ''
      const view = this.transViews(getObjField(inq, 'views'))
      // const price = getObjField(inq, 'ceilingPrice') + uPriceFullPfx(this.renting)
      const price = convertVndToUserCurrency(getObjField(inq, 'ceilingPrice'), this.renting, UnitCurrency.simple)
      return `${name} ${getStatusTextByRent(this.renting)} ${pjName} ${bedroom} ${view} ${price}`
    },
    transViews(views) {
      let textView = ''
      if (views && views.length) {
        textView = textView + 'view '
        views.map(view => {
          textView = textView + translate(VIEW, view) + ' '
        })
      }
      return textView
    }
  },
  watch: {
    inqNameFil() {
      if (this.filLocked) {
        this.filWaiting = true;
        return;
      }
      this.filLocked = true;
      this.getComInqs();
    },
  },
  async mounted() {
    this.showRightBar(scrWdtFrom(scrWdtEnum.MD) && !this.isGuest)
    await this.getUnitData();
  },
  async created()
  {
    this.isGuest = !this.getIsLoggedIn
  },
  emits: ['unitDetailBack']

}
</script>

<style scoped>
.unitInfor span {
  flex: 0 0 auto;
  width: auto;
  margin: .5rem;
}

.interact-item:hover {
  background: #F2F2F2;
  border-radius: 8px;
}

.interact-item :active {
  background: #F2F2F2;
  border-radius: 8px;
}
</style>
