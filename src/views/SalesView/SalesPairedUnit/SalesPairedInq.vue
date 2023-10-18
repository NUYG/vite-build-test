<template>
  <FpDefLayout :is-loading="!finishLoading" :show-loading="true" :bc-props="pgMeta">
    <template #breadCrumbExtIcon>
      <ButtonBadge class="col-auto p-0" :badge-numb="unitCompSelectedList.length"
                   badge-numb-class="text-white sell-color">
        <template #objectBadged>
          <FpIcon src-icon="comparasion.svg" :size="24" @click="showUnitComparison=true"></FpIcon>
        </template>
      </ButtonBadge>
      <PopupTemplate popup-class="w-100 comparePopup " content-class="h-100"
                     :pop-index="scrWdtFrom(scrWdtEnum.MD) ? 999 : 100"
                     v-if="showUnitComparison" @close-popup="showUnitComparison = false" boxPopupClass="bg-transparent">
        <template #contentPopup>
          <div class="row overflow-x-scroll">
            <div class="row d-flex justify-content-between">
              <span class="col-auto">Số căn hộ được chọn: {{ unitCompSelectedList.length }}</span>
              <ButtonView content="Hoàn thành" class="col-auto" status="gray-btn" text-size="14"
                          @click="showUnitComparison = false"/>
            </div>
            <ComparisonUnit :unit-comparison-list="unitCompSelectedList" :renting="cusInq.rent"
                            @closeCompare="showUnitComparison = false"></ComparisonUnit>
          </div>
        </template>
      </PopupTemplate>
    </template>
    <template #comp>

      <div v-if="!successPageDirect " class="position-relative">
        <div class="navbar fixed-top sticky-md-top" style="top:7%;z-index: 100!important;">
          <PairInqTag :cusInq="cusInq" :pjName="getPjNameInCusInqData(cusInq.pjData,cusInq.blkData)"
                      :tt-card-item="getCartItems.length" @extend-click="onExtendClick"
                      @cart-click="onCartClick"></PairInqTag>
        </div>
        <PopupTemplate v-if="openPopup" @close-popup="openPopup=false" popup-class="border8">
          <template #contentPopup>
            <div class="row d-flex align-items-center primary-btn-hover border8 p-2">
              <img :src="getIconUrl('Headset.svg')" class="col-auto" alt="icon-request"
                   style="width: 20px;height: 20px;padding: 0"/>
              <span class="col-auto" @click="onCreateRequest">Gửi yêu cầu tìm căn</span>
            </div>
            <div class="row d-flex align-items-center primary-btn-hover border8 p-2">
              <img :src="getIconUrl('HandCoins.svg')" class="col-auto" alt="icon-request"
                   style="width: 20px;height: 20px;padding: 0"/>
              <span class="col-auto" @click="onPairPSP">Tạo giao dịch cá nhân</span>
            </div>

              </template>
            </PopupTemplate>
            <div class="container-fluid  mt-lg-0" style="margin-top: 100px">
              <div class="row px-3 card-gray-teal  mt-lg-0" v-if="!cartShow">
                <template v-for="(unit,index) in displayedItems" :key="index">
                  <div class="col-lg-4 col-12 p-0 px-lg-2 mt-5" v-if="checkArchiveUnit(unit)">
                    <div class="bg-white p-3 border8 h-100">
                      <div class="mt-2" v-if="unit.imgs.length">
                        <SwipeBox
                          :downloadBtn='true'
                          :shareBtn='true'
                          :img='unit.imgs.map((item) => item.wm_url)'
                          :showThumb="false"
                          :calHeight="false"
                          :pjUnitText="pjInformationBotUnitImg(unit,'block')"
                          :show-current-slide="true">
                          <template #extTag v-if="checkHotUnit(unit)">
                            <div class="position-absolute highlight-unit"
                                 style="background-color: rgb(255, 71, 71);z-index: 100; left:0">
                              <span class="text-mb-12 py-1 px-3">Căn hot</span>
                            </div>
                          </template>
                        </SwipeBox>
                      </div>
                      <UnitImg v-else :ratio-img="[3,2]" :pjUnitText="pjInformationBotUnitImg(unit,'block')"></UnitImg>
                      <div class="row px-2 d-flex justify-content-between mt-4">
                    <span class="col-auto font-weight-600 text-title d-flex align-items-center">
                      {{ inqPrice(unit) }}
                    </span>
                    <div class="col">
                      <div class="row d-flex justify-content-end">
                        <div class="col-auto first-pair-unit-tour-3" @click="onUnitSelected(unit)">
                          <ButtonView :btn-icon="getIconUrl('comparasion.svg')" :icon-size="28" status="gray-btn"
                                      :square-padding="true" ></ButtonView>
                        </div>
                        <div class="col-auto  border8 p-0  position-relative cart-share-btn first-pair-unit-tour-5a"
                             @click="archiveUnit(unit)">
                          <FpIcon src-icon="ShoppingCart.svg" :size="28" style="margin: 7px"></FpIcon>
                        </div>
                        <div class="col-auto  border8 p-0 ms-3 position-relative cart-share-btn first-pair-unit-tour-4"
                             @click="shareUnit(unit)">
                          <FpIcon src-icon="ShareNetwork.svg" :size="28" style="margin: 7px"></FpIcon>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="">
                    <UnitDetailInformation :pj-information="getPjInformation(unit)" :unitInteract="false"
                                           :keepHeightUnitType="false" :freshLv="getUnitLvl(unit)">
                      <template #extUnitInfo>
                        <p class="row mt-4 first-pair-unit-tour-2">
                          <template v-for="(data,index) in getStatusOfUnit(unit,cusInq.rent)" :key="index">
                            <FpTag class="col-auto ms-2" :tag-color="data.color" :border-radius="16">
                              <template #default>
                                <span class="text-12">{{ data.content }}</span>
                              </template>
                            </FpTag>
                          </template>
                        </p>
                      </template>
                    </UnitDetailInformation>
                  </div>
                </div>
              </div>
            </template>

              </div>
              <div v-else class="row px-lg-5   mt-lg-3 " style="margin-top: 200px">
                <div class="row d-flex justify-content-between align-items-center  mt-lg-0 px-2">
                  <span class="font-weight-700 text-content col-auto ">Các căn đã tư vấn</span>
                  <div class="col-auto " @click="cartShow=false">
                    <button class="gray-button text-12  d-flex align-items-center">
                      <FpIcon srcIcon="arrowLeft.svg" :size="12"></FpIcon>
                      Quay lại
                    </button>
                  </div>

                </div>
                <div class="row overflow-scroll" style="height: 45vh">
                  <template v-for="(inq,index) in getCartItems" :key="index">
                    <div class="row d-flex justify-content-center mt-5">
                      <div class="col-lg-10 col-12 cursor-pointer " @click="toggleSelection(inq)">
                        <div class="row sidebar-menu_item  p-md-3">
                          <div class="col-auto d-flex align-items-center">
                            <input type="checkbox" :checked="selectedItems.includes(inq)">
                          </div>
                          <div class="col-auto p-0 px-md-2">
                            <img style="width: 100px;height: 100px;border-radius: 8px"
                                 :src='inq.imgs[0] ? (IMG_URL + inq.imgs[0]?.wm_url) : getIconUrl("emptyImg.png")'
                                 alt=""

                        />
                      </div>
                      <div class="col d-flex align-items-center">
                        <UnitpairArchived :data-render="inq"></UnitpairArchived>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

            </div>

            <div class="row mt-3 d-flex justify-content-center">
              <div class="col-auto ">
                <span class="fst-italic "
                      v-if="selectedItems.length>4">Hiện tại bạn chỉ có thể tạo tối đa 4 giao dịch</span>
                <div class="row d-flex align-items-center mt-3">
                  <span class="col-auto d-flex align-items-center">
                     <input type="checkbox" class="me-2" @click="toggleSelectAll" v-model="selectedAll"> Chọn tất cả
                 </span>
                  <div class="col d-flex justify-content-around">
                    <ButtonView class="col-auto" status="gray-btn" content="Xóa" @click="deleteCartItemPick"/>
                    <ButtonView class="col-auto ms-5" status="gray-btn" content="Tạo giao dịch"
                                @click="handleCreateSPS"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-3 mt-lg-4" v-if="!displayedItems.length>0 " style="margin-top: 100px">
          <p>Hiện tại chưa có căn phù hợp với nhu cầu khách này! </p>
          <div class="row">
               <span class="col-auto">Nhấn vào biểu tượng
                 <img :src="getIconUrl('SquaresFour.svg')" alt="advance-icon"/>
              <span>
              </span> để gửi yêu cầu tìm căn phù hợp</span>
          </div>
        </div>

      </div>

      <div class="row d-flex justify-content-center" v-if='successPageDirect '>
        <div class="col-lg-4 col-md-5 col-10">
          <div class="row mt-4 p-4 d-flex justify-content-center ">
            <div class="process-rent-done d-inline-flex align-items-center rounded-circle"
                 style="width: 60px;height: 60px">
              <img :src="getIconUrl('rentCheck.svg')" class="w-100" alt="">
            </div>
          </div>
          <div class="row ">
            <h2 class="d-flex justify-content-center text-center"><b>Ghép căn thành công !</b></h2>
          </div>
          <div class="row text-center text-gray">
          </div>
          <div class="row justify-content-between p-lg-3 p-2 mt-2">
            <div class="col-12">
              <button class="w-100 gray-button btn-wrap-text text-white bg-dark text-content p-2" @click="goCusGeneral">
                Đi đến trang quản lý
              </button>
            </div>
            <div class="col-12  d-flex justify-content-center mt-md-3 mt-2">
              <a>
                <span class="text-content cursor-pointer " @click="successPageDirect=false;cartShow=false">Tiếp tục tư vấn</span>
              </a>
            </div>
          </div>
        </div>
      </div>


      <PopupTemplate v-if="false" popup-class="border8 col-lg-4 col-10 d-flex justify-content-center py-5"
                     contentClass="col-lg-10 col-12">
        <template #contentPopup>
          <div class="row d-flex justify-content-center">
            <p class="font-weight-600 text-center" style="font-size: 24px">Ghi chú khách hàng</p>
            <p class="text-center col-11">Chúng tôi sẽ giúp bạn ghi nhớ tính cách, mong muốn hoặc đánh giá mức độ quan
              tâm sản phẩm của khách hàng tại đây.</p>
            <div class="col-12">
              <textarea v-model="cusInq.cusData.persona" class="form-control" placeholder="Ghi chú: "
                        style="height: 15vh !important;"></textarea>
            </div>
            <div class="row d-flex justify-content-center mt-4">
              <ButtonView class="col-auto" status="gray-btn" content="Hoàn thành" @click="updateCusData"/>
            </div>
          </div>
        </template>
      </PopupTemplate>


      <TextNotification
        v-if='copy_notification'
        :message='notiMsg'
        @close='removeNotifications'
        :closeNotiTime="1600"
      />
    </template>
  </FpDefLayout>

  <TourHost
    pageName="salesPairingUnitTour"
    :tourOptions="pageTour['Sales Pairing Unit Tour']"
  />
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import {post} from "@/utils/dataQuery";
import {copyTextToClipboard, floatFixed, getIconUrl, getObjField, mobileShare} from "@/utils/utils";
import SwipeBox from "@/components/FpImg/SwipeBox.vue";
import {IMG_URL, Roles} from "@/utils/constants";
import {
  checkUnitFresh, getStatusOfUnit, pjInformationBotUnitImg,
  shareContent, unitPrice, unitPriceText,
} from "@/utils/unit";
import FpPjInformationTag from "@/components/FpTag/FpPjInformationTag.vue";
import FpDot from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpDot.vue";
import VerifyModal from "@/components/Misc/VerifyModal.vue";
import {S_CUS_DETAIL_URL, S_PSP_URL, S_UNIT_DETAIL_URL} from "@/router/URLs";
import TextNotification from "@/components/Misc/TextNotification.vue";
import {mapActions, mapGetters} from 'vuex';
import PairInqTag from "@/views/SalesView/SalesPairedUnit/PairInqTag.vue";
import UnitDetailInformation from "@/views/SalesView/SalesUnitDetail/UnitDetailInformation.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import PopupTemplate from "@/components/FpPopup/PopupTemplate.vue";
import {POINTING, VIEW} from "@/utils/TransContent";
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import UnitpairArchived from "@/views/SalesView/SalesPairedUnit/UnitpairArchived.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {maxRunningSP} from "@/utils/inqConstant";
import FpTag from "@/components/FpTag/FpTag.vue";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";
import {breadcrumpProp} from "@/models/customProp";
import ComparisonUnit from "@/components/FpUnit/ComparisonUnit.vue";
import ButtonBadge from "@/components/FpButton/ButtonBadge.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import TourHost from "@/views/Guidance/TourHost.vue";
import {pageTour} from "@/views/Guidance/pageTour";

export default {
  components: {
    TourHost,
    ButtonBadge, ComparisonUnit,
    FpTag,
    ButtonView,
    UnitpairArchived,
    UnitImg,
    PopupTemplate,
    FpIcon,
    UnitDetailInformation,
    PairInqTag,
    FpDot,
    FpPjInformationTag,
    SwipeBox,
    FpDefLayout,
    VerifyModal,
    TextNotification
  },
  data() {
    return {
      inqData: [],
      finishLoading: false,
      IMG_URL,
      showCarousel: false,
      ssImgs: [],
      copy_notification: false,
      notiMsg: '',
      cusInq: [],
      successPageDirect: false,
      pairedUnit: {},
      spId: -1,
      displayedItems: [],     // Array of items to display in the v-for loop
      itemsPerScroll: 6,
      cartShow: false,
      openPopup: false,
      POINTING,
      VIEW,
      selectedItems: [],
      selectedAll: false,
      addNotePop: false,
      lockedPairInq: false,
      cusPersona: '',
      pgMeta: {
        [breadcrumpProp.title]: 'Tư vấn',
      },
      unitCompSelectedList: [],
      showUnitComparison: false,
      // import
      pageTour,
    }
  },
  computed: {
    scrWdtEnum() {
      return scrWdtEnum
    },
    ...mapGetters(['getCardsByInqId']),
    getCartItems() {
      return this.getCardsByInqId(parseInt(this.inqId));
    },
    inqId() {
      return this.$route?.params?.inqId
    }
  },
  methods: {
    scrWdtFrom,
    onUnitSelected(unit) {
      if (this.unitCompSelectedList.length < 3) {
        if (this.unitCompSelectedList.includes(unit)) {
          this.unitCompSelectedList.splice(this.unitCompSelectedList.indexOf(unit), 1);
        } else {
          this.unitCompSelectedList.push(unit);
        }
      } else {
        this.showToast = true
        this.toastMsg = 'Chỉ được so sánh 3 căn hộ'
      }
    },
    getStatusOfUnit,
    pjInformationBotUnitImg,
    unitPriceText,
    getIconUrl,
    floatFixed,
    ...mapActions(['addCardToCart', 'removeCardFromCart']),
    addToCart(card) {
      this.addCardToCart({card, inqId: parseInt(this.inqId)});
    },
    removeFromCart(card) {
      this.removeCardFromCart({card, inqId: parseInt(this.inqId)});
    },
    archiveUnit(unit) {
      this.addToCart(unit)
      if (this.getCartItems.length % 5 === 0) {
        this.scrollWindow()
      }
    },
    checkArchiveUnit(unit) {
      const isArchiveUnit = this.getCartItems?.some(obj => obj.id === unit.id)
      return !isArchiveUnit
    },
    onExtendClick() {
      this.openPopup = true
    },
    onCartClick() {
      this.cartShow = !this.cartShow
    },
    deleteCartItemPick() {
      this.selectedItems.map(item => {
        this.removeFromCart(item)
      })
      this.selectedAll = false
    },
    handleCreateSPS() {
      if (this.cusInq.tt_running_sp <= maxRunningSP) {
        this.selectedItems.map(item => {
          this.pairUnit(item)
        })
      } else {
        this.copy_notification = true
        this.notiMsg = 'Chỉ có thể tạo tối đa 4 giao dịch!'
      }
    },
    checkHotUnit(unit) {
      return this.cusInq?.rent ? unit?.rentFeaturing : unit?.sellFeaturing
    },
    toggleSelection(item) {
      const selectedItem = this.selectedItems.find(selected => selected.id === item.id);
      if (selectedItem) {
        const selectedIndex = this.selectedItems.indexOf(selectedItem);
        this.selectedItems.splice(selectedIndex, 1);
      } else {
        this.selectedItems.push(item);
      }
    },
    toggleSelectAll() {
      if (!this.selectedAll) {
        this.selectedItems = this.getCartItems.slice();
      } else {
        this.selectedItems = []
      }
    },
    getUnitLvl(unit) {
      if (unit) {
        return checkUnitFresh(unit.lastRefresh, unit.renting, unit.lcr)
      }
    },
    async shareUnit(unit) {
      await mobileShare(unit.imgs.map((item) => item.wm_url), this.getShareContent(this.cusInq.rent, unit));
    },
    async getUnitDef() {
      const res = await post('/sales/get_compatible_units', {
        id: this.inqId
      })
      const returnData = res.returnData
      this.inqData = [...returnData['1'], ...returnData['2'], ...returnData['3'], ...returnData['4'], ...returnData['5']]
      // console.log(this.inqData, 'INQ DATA')
    },
    getPjInformation(data) {
      return {
        id: getObjField(data, 'id'),
        bedroom: getObjField(data, 'bedroom'),
        bathroom: getObjField(data, 'bathroom'),
        size: getObjField(data, 'size'),
        furniture: getObjField(data, 'furniture'),
        balcony: getObjField(data, 'balcony'),
        managementCoverage: getObjField(data, 'managementCoverage'),
        view: getObjField(data, 'view'),
        view2: getObjField(data, 'view2'),
        desc: getObjField(data, 'desc')
      }
    },
    copyUnitContent(rent, unit) {
      copyTextToClipboard(this.getShareContent(rent, unit));
      this.copy_notification = true
      this.notiMsg = 'Đã sao chép!'
    },
    unitImgClk(unitImgs) {
      this.showCarousel = true;
      this.ssImgs = unitImgs;
    },
    getShareContent(rent, unit) {
      return shareContent(
        rent, unit, this.FURNITURE, this.VIEW, this.POINTING
      )
    },
    async getCusData() {
      const res = await post("/sales/get_compa_units_page_ui_data", {
        id: this.inqId ? this.inqId : -1,
        role: Roles.Sales,
      })
      this.cusInq = res.returnData
      this.finishLoading = true
      // console.log(this.cusInq, 'CUSINQ')
    },
    async updateCusData() {
      const res = await post("/sales/update_customer_data_api", {
        id: this.cusInq.cusData.id,
        persona: this.cusInq.cusData.persona
      })
      // console.log(res)
      this.addNotePop = false
      this.successPageDirect = true
    },
    getOutlineDot(rent) {
      return rent ? '0 0 0 7px #48BD48' : '0 0 0 7px #F76754'
    },
    pairUnitContent(unit) {
      return `Bạn vừa ghép Căn ${unit.pjData.name} ${unit.bedroom} Phòng ngủ
      giá ${convertVndToUserCurrency(unitPrice(this.cusInq.rent, unit), this.cusInq.rent, UnitCurrency.extend)}
      ${
        this.cusInq.rent ? "Triệu" : "Tỷ"
      } với yêu cầu hiện tại, bạn có xác nhận tiếp tục ghép căn này không?`;
    },
    inqPrice(inq) {
      return convertVndToUserCurrency(unitPrice(this.cusInq.rent, inq), this.cusInq.rent, UnitCurrency.extend)
    },

    getPjNameInCusInqData(pjData, blocks) {
      let name = ''
      if (Object.values(blocks).length > 0) {
        for (const [key, value] of Object.entries(blocks)) {
          name = name + `${key} ${this.splitBlockValue(value)} `;
        }
      }
      return name
    },
    splitBlockValue(blockVal) {
      if (blockVal.length < 0) {
        return '';
      } else {
        return blockVal.map(blockName => `[${blockName}]`).join(' ')
      }
    },
    onCreateRequest() {
      this.createUnitRequest();
    },
    async createUnitRequest() {
      const res = await post('/u_request/create_u_request', {
        inqId: this.cusInq.id,
      })
      if (res && res.succeed) {
        window.alert('Gửi yêu cầu tìm căn thành công');
        this.$router.back()
      } else {
        this.copy_notification = true
        this.notiMsg = 'Bạn đã tạo yêu cầu tìm căn này rồi.'
      }
      this.openPopup = false
    },
    async onPairPSP() {
      const res = await post('/personal_sp/create_personal_sp', {
        inquiryId: this.cusInq.id,
      })
      if (res && res.succeed) {
        this.$router.push(S_PSP_URL + '?pspID=' + res.pspID)
      } else {
        this.copy_notification = true
        this.notiMsg = res.resText
        this.openPopup = false
      }
    },
    async pairUnit(unit) {
      this.lockedPairInq = true
      const res = await post("/sale_process/create_sale_process", {
        inquiryId: this.cusInq.id,
        unitId: unit.id,
      })
      if (res && res.succeed) {
        this.successPageDirect = true
        this.removeFromCart(unit)
        await this.getUnitDef();
        this.pairedUnit = unit
        this.spId = res.spID
      } else if (!res.succeed) {
        this.copy_notification = true
        this.notiMsg = res.resText
      }
      this.lockedPairInq = false
    },
    removeNotifications() {
      this.copy_notification = false
    },
    goCusGeneral() {
      this.$router.push({name: 'Sales cus detail general', params: {cusID: this.cusInq?.cusData?.id}})
    },
    handleScroll() {
      const bottom = document.documentElement.scrollHeight - window.innerHeight;
      const distance = bottom - window.scrollY;
      if (distance < 1) {
        const startIndex = this.displayedItems.length;
        const endIndex = startIndex + this.itemsPerScroll;
        this.displayedItems = [...this.displayedItems, ...this.inqData.slice(startIndex, endIndex)];
      }
    },
    scrollWindow() {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const newScrollTop = window.pageYOffset + windowHeight + 30;
      window.scrollTo({
        top: newScrollTop,
        behavior: 'auto'
      });
    }
  },
  async mounted() {
    await this.getUnitDef()
    await this.getCusData()
    this.displayedItems = [...this.displayedItems, ...this.inqData.slice(0, 6)]
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
}
</script>

<style scoped>


.gray-button:hover img {
  opacity: 1;

}

.cart-share-btn {
  background: rgb(242, 242, 242);
}

.cart-share-btn:active {
  background: black
}


@media (min-width: 768px) {
  .navbar.fixed-top {
    position: static;
  }

  .navbar {
    width: 100%;
  }

  .cart-share-btn:hover {
    background: none;
  }
}

.primary-btn-hover:hover {
  background: #5E52FF;
  color: white;
}

.primary-btn-hover:hover img {
  filter: invert(100%) sepia(0%) saturate(2%) hue-rotate(351deg) brightness(104%) contrast(101%);
}

</style>
