<template>
  <div v-show="$route.name==='Sales Cart'">
    <FpDefLayout :bc-props="pgMeta" ref="pgLayout" @breadcrumbBackIcon="onBreadcrumbBackIcon"
                   :show-back-to-top="true"
                 :is-guest="isGuest"
                 :show-req-login="loginReqPopup">
      <template #breadCrumbExtIcon>
        <ButtonBadge class="col-auto p-0" :badge-numb="unitCompSelectedList.length"
                     badge-numb-class="text-white sell-color">
          <template #objectBadged>
            <FpIcon src-icon="comparasion.svg" :size="24" @click="showUnitComparison=true"></FpIcon>
          </template>
        </ButtonBadge>
        <PopupTemplate popup-class="w-100 comparePopup" content-class="h-100"
                       :pop-index="scrWdtFrom(scrWdtEnum.MD) ? 999 : 100"
                       v-if="showUnitComparison" @close-popup="showUnitComparison = false" boxPopupClass="bg-transparent">
          <template #contentPopup>
            <div class="row overflow-x-scroll">
              <div class="row d-flex justify-content-between">
                <span class="col-auto">Số căn hộ được chọn: {{ unitCompSelectedList.length }}</span>
                <ButtonView content="Hoàn thành" class="col-auto" status="gray-btn" text-size="14"
                            @click="showUnitComparison = false"/>
              </div>
              <ComparisonUnit :unit-comparison-list="unitCompSelectedList" :renting="filterRent"
                              @closeCompare="showUnitComparison = false"></ComparisonUnit>
            </div>
          </template>
        </PopupTemplate>
      </template>
      <template #comp>

        <div class="d-flex d-md-none">
          <UnitImg :ratio-img="[2,1]" :img-src="pjPickData?.avtData?.imgUrl" :border8="false"
                   styleImg='object-fit: cover;'></UnitImg>
        </div>
        <div class="container-fluid">
          <div class="d-flex justify-content-between mt-lg-2 p-lg-3 px-2">
            <div class="col-12 col-lg search-container">
              <SalesCusFilter :createCusIcon="false" searchPlaceholder="Tìm dự án"
                              :extendFilterData="filterData"
                              @resetFilter="resetFilter"
                              @cusFilter="onUnitFilter"
                              :filtering="isFiltering"
                              :cusStatusPick="false"
                              :projectPick="filterData.project"
                              @submitFilter="onSubmitFilter"
                              :unitRenting="rentingPick.salesRenting"
                              :setExtSearch="extSearch"
                              @searchExtending="searchExtending"
                              :realTimeSearch="!!scrWdtFrom(scrWdtEnum.LG)"
                              :canSearchPj="false"
                              :renting-pick="false"
                              :inputSearch="false"
                              :extend-box-class="`${scrWdtFrom(scrWdtEnum.LG)? 'w-25' : 'w-100'} end-0` "
                              representObjectClass="d-flex justify-content-between">
                <template #customArea>
                  <div class="col">
                    <div class="row d-flex justify-content-between align-items-center">
                    <span class="text-title text-color-black font-weight-600 col-auto">{{ pjPickData.name }}
                      <FpIcon src-icon="Info.svg" :size="26" class="col-auto p-0"
                              @click="goPjInfo"></FpIcon>
                    </span>

                      <span class="col-auto d-flex" @click="onChangeLayout">
                         <ButtonView :squarePadding="true"
                                     :btnIcon="getIconUrl(splitTwoCol? 'GridTwo.svg' : 'splitRow.svg')" :iconSize="24"
                                     status="gray-btn" on-btn-color="#5E52FF"/>
                    </span>
                    </div>
                  </div>
                </template>
              </SalesCusFilter>
            </div>
          </div>
          <div class="col-12 d-flex justify-content-between ">
            <div class="row d-lg-inline-block  justify-content-around text-content " style="font-weight: 600;">
              <button class="status-button col-auto mx-3" @click="onStatusPick('salesRenting')"
                      :class="{'rent-button-active':rentingPick.salesRenting}">
                <span class="text-status" :class="{'text-white font-weight-600': rentingPick.salesRenting}">Cho thuê</span>
              </button>
              <button class="status-button col-auto" @click="onStatusPick('salesSelling')"
                      :class="{'sell-button-active':rentingPick.salesSelling}">
                <span class="text-status" :class="{'text-white font-weight-600': rentingPick.salesSelling}">Bán</span>
              </button>
            </div>
          </div>
          <div class="row mt-3 px-lg-2">
            <div class="col-auto">
              <div class="row">
                <FpSimpleFilter @fur-bedroom-filter="onUnitFilter" @submit-filter="onSubmitFilter" :renting="filterRent"
                                :default-filter-data="filterData" @fast-picked-price="onUnitFilter">
                </FpSimpleFilter>
              </div>
            </div>
            <div class="col-12 col-lg-4 mt-3 mt-lg-0">
              <FpFormSearch @search-val="onBlockSearch" placeholder-input="Tìm tòa " input-classes="text-12" ></FpFormSearch>
            </div>
          </div>

          <LoadingAnimContainer
              :isLoading="!finishLoading">
            <template #content>
              <div v-if="!unitNotFound" class=" px-xl-2 mt-2">
                <div class="row  border8 mt-1">
                  <template v-if="hotUnit">
                    <div class="mt-4 py-2 border8" v-for="(unit,index) in hotUnit"
                         :class="splitColCheck ? 'col-6' : 'col-12'" :key="index">
                      <UnitHighLightCard :unitInformation="getUnitInformation(unit)" :freshLv="getUnitLvl(unit)"
                                         :unitFirstImg="getUnitImg(unit).firstImg" :favUnit="unit.fav"
                                         :unitImgs="getUnitImg(unit).extImg" style="padding:8px;" :not-available="checkNotAvailableUnit(unit)"
                                         @click="!checkNotAvailableUnit(unit) ? goUnitDetail(unit.id) : '' " :ttImg="unit.imgs.length"
                                         :unitTag="getImgUnitTag(unit)"  :is-top-unit="true" :minor-version=" splitTwoCol">
                        <template #imgTagExt>
                          <div class="position-absolute bg-white border8 d-flex justify-content-center align-items-center"
                               style="bottom: 5%;right: 2%">
                          <span style="font-size: 10px" class="mx-2 m-1"
                                @click.stop="onUnitSelected(unit)">so sánh</span>
                          </div>
                        </template>
                      </UnitHighLightCard>
                    </div>
                  </template>
                  <template v-if="highlightUnit">
                    <div v-for="(hUnit,index) in highlightUnit" :key="index" class="mt-4 py-2 border8"
                         :class="splitColCheck ? 'col-6' : 'col-12'">
                      <UnitHighLightCard :unitInformation="getUnitInformation(hUnit)" :freshLv="getUnitLvl(hUnit)"
                                         :unitFirstImg="getUnitImg(hUnit).firstImg" :favUnit="hUnit.fav"
                                         :unitImgs="getUnitImg(hUnit).extImg" style="padding:8px;" :not-available="checkNotAvailableUnit(hUnit)"
                                         @click="!checkNotAvailableUnit(hUnit) ? goUnitDetail(hUnit.id): ''" :ttImg="hUnit.imgs.length"
                                         :unitTag="getImgUnitTag(hUnit)" :minor-version="splitTwoCol">
                        <template #imgTagExt>
                          <div class="position-absolute bg-white border8 d-flex justify-content-center align-items-center"
                               style="bottom: 5%;right: 2%">
                          <span style="font-size: 10px" class="mx-2 m-1"
                                @click.stop="onUnitSelected(hUnit)">so sánh</span>
                          </div>
                        </template>
                        <template #extContent>
                          <p class="px-2 row mt-2" v-if="!checkNotAvailableUnit(hUnit)">
                            <template v-for="(data,index) in getStatusOfUnit(hUnit,filterRent)" :key="index">
                              <FpTag class="col-auto m-1 mx-2" :tag-color="data.color" :border-radius="16">
                                <template #default>
                                  <div :style="`font-size: ${splitColCheck && isMobile ?10:14}px`">{{ data.content }}</div>
                                </template>
                              </FpTag>
                            </template>
                          </p>
                        </template>
                      </UnitHighLightCard>
                    </div>
                  </template>
                </div>
                <div class="row mt-1">
                  <div v-for="(unit, index) in units" :key="index"
                       class="mt-4 py-2 mt-2 p-1 col-md-3" v-show="!unit.disable"
                       :class="splitColCheck ? 'col-6 ' : 'col-12'" ref="unitElements">
                    <FpUnitCard :imgSrc="unitThumbImg(unit)"
                                :classes="splitColCheck ? 'p-2 card-gray-active h-100' : 'px-3 h-100 py-4 card-gray-active'"
                                :favTag="true" unitTextImgStyle="margin-top:10% !important"
                                :freshLv="getUnitLvl(unit)" :notAvailable="checkNotAvailableUnit(unit)"
                                :pjInformation="getUnitInformation(unit)" :ratioImg="[3,2]" :unitTag="getImgUnitTag(unit)"
                                :splitTwo="splitColCheck && !scrWdtFrom(scrWdtEnum.LG)" :short-pj-info="splitColCheck"
                                :show-fur-text="!!scrWdtFrom(scrWdtEnum.LG)"
                                @click="onUnitCardClick(unit,index)" :favUnit="unit.fav">
                      <template #imgTagExt>
                        <div class="position-absolute bg-white border8 d-flex justify-content-center align-items-center"
                             style="bottom: 5%;right: 2%">
                          <span style="font-size: 10px" class="mx-2 m-1" @click.stop="onUnitSelected(unit)">so sánh</span>
                        </div>
                      </template>
                      <template #customField>
                        <p class="px-2 row" v-if="!checkNotAvailableUnit(unit)">
                          <template v-for="(data,index) in getStatusOfUnit(unit,filterRent)" :key="index">
                            <FpTag class="col-auto mx-1" :tag-color="data.color" :border-radius="16">
                              <template #default>
                                <div :style="`font-size: ${splitColCheck &&!scrWdtFrom(scrWdtEnum.LG) ? 10 : 14 }px`">
                                  {{ data.content }}
                                </div>
                              </template>
                            </FpTag>
                          </template>
                        </p>

                      </template>
                    </FpUnitCard>
                  </div>
                </div>
              </div>
              <div v-else class="row d-flex justify-content-center">
                <p class="text-title">{{ unitNotFound }}</p>
              </div>

            </template>
          </LoadingAnimContainer>
        </div>
        <TextNotification v-if='showToast' :message='toastMsg' @close='removeNotifications'/>
      </template>
    </FpDefLayout>
  </div>
  <router-view></router-view>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";

import {
  findProjectIdByName,
  floatFixed,
  formatTimeMaxIsWeek,
  getIconUrl,
  getItemFromLocalStorage,
  getObjField,
  goToURL,
  removeLocalItem, replaceCharacter,
  setLocalStorageItem,
  translate
} from "@/utils/utils";
import {IMG_URL, Roles} from "@/utils/constants";
import {getDdMm} from "@/utils/dateTimeUtils";
import {post} from "@/utils/dataQuery";
import {breadcrumpProp, defLayoutBehaType} from "@/models/customProp";
import SalesCusFilter from "@/components/FpFilter/SalesFilter/SalesCusFilter.vue";
import FpUnitCard from "@/components/FpUnit/FpUnitCard.vue";
import UnitHighLightCard from "@/components/FpUnit/UnitHighLightCard.vue";
import {
  checkContractExpiryWithinDays,
  checkFreeUnit,
  checkNewUnit,
  checkUnitFresh,
  getImgUnitTag,
  getStatusOfUnit,
  unitPrice,
  uPricePfxExt,
} from "@/utils/unit";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import SalesUnitDetail from "@/views/SalesView/SalesUnitDetail/SalesUnitDetail.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {HEIGHT, UNIT_TYPE, VIEW} from "@/utils/TransContent";
import TextNotification from "@/components/Misc/TextNotification.vue";
import {FpGuestCart, S_DASHBOARD_URL, S_PJ_INFO, S_PJ_PICK} from "@/router/URLs";
import FpTag from "@/components/FpTag/FpTag.vue";
import FpSimpleFilter from "@/components/FpFilter/SalesFilter/FpSimpleFilter.vue";
import ButtonBadge from "@/components/FpButton/ButtonBadge.vue";
import PopupTemplate from "@/components/FpPopup/PopupTemplate.vue";
import SwipeVideo from "@/views/ConciergeSwipe/SwipeVideo.vue";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";
import ComparisonUnit from "@/components/FpUnit/ComparisonUnit.vue";
import LoadingAnimContainer from "@/components/FpAnimation/LoadingAnimContainer.vue";
import {mapActions, mapGetters} from "vuex";
import FpFormSearch from "@/components/FpForm/FpFormSearch.vue";

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
    FpFormSearch,
    LoadingAnimContainer,
    ComparisonUnit,
    SwipeVideo,
    PopupTemplate,
    ButtonBadge,
    FpSimpleFilter,
    FpTag,
    TextNotification,
    ButtonView,
    FpIcon,
    SalesUnitDetail,
    UnitImg,
    UnitHighLightCard,
    FpUnitCard,
    SalesCusFilter,
    FpDefLayout,
  },
  props: {
    filter: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
    },
  },
  data() {
    return {
      splitTwoCol: false,
      finishLoading: false,
      loginReqPopup: false,
      units: [],
      lockLoadUnits: false,
      extSearch: false,
      unitNotFound: '',
      highlightUnit: [],
      page: 1,
      totalItems: 0,
      pjData: "",
      projects: [],
      rentingPick: {
        salesRenting: true,
        salesSelling: false,
      },
      HEIGHT,
      VIEW,
      UNIT_TYPE,
      pjSearch: '',
      filterData: {
        bedroom: '',
        views: [],
        balconies: [],
        unitType: '',
        project: '',
        furniture: '',
        availableIn: 0,
        block:'',
        rentingPriceTo: undefined,
        rentingPriceFrom: undefined,
        sellingPriceTo: undefined,
        sellingPriceFrom: undefined,
      },
      IMG_URL,
      // Meta
      pgMeta: {
        [breadcrumpProp.title]: 'Giỏ hàng',
        [breadcrumpProp.behaviorType]: defLayoutBehaType.signal,
      },
      pjPickData: [],
      //check from this to unitDetail or from another component to unitDetail
      indexUnitActive: 1,
      isRendered: false,
      showToast: false,
      toastMsg: 'Căn hộ đã giao dịch !',
      S_PJ_INFO,
      S_PJ_PICK,
      hotUnit:[],
      hotUnitPage:1,
      showUnitComparison:false,
      showPickedUnitCompare:false,
      unitCompSelectedList:[],
      pjId:-1,
      rentingDefault:true,
      unitIdDefault:-1
    }
  },
  computed: {
    ...mapGetters(['getPjLibData','getIsLoggedIn','getAllStore']),
    isGuest()
    {
      return !this.getIsLoggedIn
    },
    Roles() {
      return Roles
    },
    scrWdtEnum() {
      return scrWdtEnum
    },
    filterRent() {
      return this.rentingPick.salesRenting;
    },
    rBarShowing() {
      return this.$refs.pgLayout.rBShow;
    },
    isNotExtFiltering() {
      return (
        !this.filterData.bedroom && !this.filterData.furniture &&
        !this.filterData.views.length && !this.filterData.balconies.length && !this.filterData.unitType &&
        !this.filterData.project && !this.pjSearch && this.filterData.availableIn === 0
      )
    },
    isFiltering() {
      return !this.isNotExtFiltering
    },
    splitColCheck() {
      return this.splitTwoCol
    },
    unitDataEndpoint() {
      return this.isGuest ? '/fp_guest/get_units_data_guest' : '/sales/get_units_data_api'
    },
    isMobile() {
      return !scrWdtFrom(scrWdtEnum.MD)
    },
    pjName()
    {
      return replaceCharacter(this.pjData.name, ' ', '-')
    },
    userRole()
    {
      return sessionStorage.getItem('currentRole')
    }
  },
  methods: {
    goPjInfo()
    {
      this.$router.push({name: 'project information', params: {pjName: this.pjName}})
    },
    onBlockSearch(val)
    {
      this.filterData.block=val
      this.filterItems()
    },
    replaceCharacter,
    getStatusOfUnit,
    checkContractExpiryWithinDays,
    checkFreeUnit,
    checkNewUnit,
    scrWdtFrom,
    translate,
    getIconUrl,
    goToURL,
    getDdMm,
    floatFixed,
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
    removeNotifications() {
      this.showToast = false
    },
    onUnitCardClick(unit, index) {
      if (this.checkNotAvailableUnit(unit)) {
        this.showToast = true
      } else {
        this.goUnitDetail(unit.id, index)
      }
    },
    onChangeLayout() {
      this.splitTwoCol = !this.splitTwoCol
      setLocalStorageItem('unitSplitTwoLayout', this.splitTwoCol)
    },
    searchExtending(value) {
      this.extSearch = value
    },
    onBreadcrumbBackIcon() {
      if (this.extSearch) {
        this.extSearch = false
      }
      else {
        this.$router.push(this.role === Roles.Guest ? FpGuestCart : S_PJ_PICK)
      }
    },
    showRightBar(show) {
      this.$refs.pgLayout.showRightBar(show);
    },
    goUnitDetail(id) {
      const renting = this.filterRent ? 'thue' : 'ban'
      this.$router.push({name:'Sales Unit Detail', params:{renting: renting,unitID:id,pjName:this.pjName}})
    },
    // Controller
    setFBedroom(val) {
      this.filterData.bedroom = this.filterData.bedroom === val ? "" : val;
    },
    bedroomEqual(val) {
      return this.filterData.bedroom === val;
    },
    scrollHandle() {
      const bottom = document.documentElement.scrollHeight - window.innerHeight;
      const distance = bottom - window.scrollY;
      if (distance < 1) {
        this.loadUnits();
      }
    },
    resetFilter() {
      this.filterData.bedroom = "";
      this.filterData.furniture = "";
      this.rentingPick.salesRenting = true;
      this.rentingPick.salesSelling = false;
      this.filterData.views = [];
      this.filterData.balconies = [];
      this.filterData.unitType = '';
      this.filterData.project = '';
      this.filterData.availableIn = 0
    },
    // APIs
    async loadUnits() {
      if (this.lockLoadUnits) {
        return ''
      }
      if (this.isGuest && this.units.length === 24) {
        return this.loginReqPopup = true
      }
      this.lockLoadUnits = true
      await this.loadHotUnit()
      const res = await this.postApi(false, false, this.page)
      if (res) {
        this.units = this.units.concat(res.returnData);
        this.finishLoading = true
        this.totalItems = res.totalResult;
        this.pgMeta[breadcrumpProp.title] = `Giỏ hàng`;
        this.page++;
      }
      this.lockLoadUnits = false
    },
    async loadHotUnit() {
      const res = await this.postApi(true, false, this.hotUnitPage)
      this.hotUnit = res.returnData
    },
    async postApi(getTopUnit, filterItem, page) {
      const filterHotUnit = this.filterRent ? {rentFeaturing: true} : {sellFeaturing: true}
      const ignoreFilterHotUnit = this.filterRent ? {exRentFeaturing: true} : {exSellFeaturing: true}
      return await post(this.unitDataEndpoint, {
        ...this.filterData,
        ...this.rentingPick,
        ...(getTopUnit ? filterHotUnit : ignoreFilterHotUnit),
        ...(filterItem ? {pjSearch: this.pjSearch} : {}),
        ...{
          project: this.pjId,
          page: page,
          nonBnb: this.rentingPick.salesRenting,
          listLen: 12,
          favSorting: !this.isGuest ? (this.rentingPick.salesRenting ? "-rentPoint" : "-sellPoint") : undefined,
        },
      })
    },
    getUnitLvl(unit) {
      if (unit) {
        return checkUnitFresh(unit.lastRefresh, this.rentingPick.salesRenting, unit.lcr)
      }
    },
    getUnitInformation(data) {
      if (data) {
        const freshTime = data?.lastRefresh ? formatTimeMaxIsWeek(getObjField(data, 'lastRefresh')) : ''
        const feeCoverAll = this.rentingPick.salesRenting ? getObjField(data, 'managementCoverage') : getObjField(data, 'transferringCoverage')
        return {
          renting: this.rentingPick.salesRenting,
          id: getObjField(data, 'id'),
          pjData: getObjField(data, 'pjData'),
          priceText: convertVndToUserCurrency(unitPrice(this.rentingPick.salesRenting, data), this.rentingPick.salesRenting, UnitCurrency.half),
          fee: feeCoverAll,
          freshTime: freshTime,
          bedroom: getObjField(data, 'bedroom'),
          size: getObjField(data, 'size'),
          view: translate(this.VIEW, getObjField(data, 'view')),
          view2: translate(this.VIEW, getObjField(data, 'view2')),
          block: getObjField(data, 'block'),
          height: translate(this.HEIGHT, getObjField(data, 'height')),
          unitType: data.unitType !== 'ap' ? translate(this.UNIT_TYPE, data.unitType) : '',
          desc: getObjField(data, 'desc'),
        }
      }
    },
    getImgUnitTag(unit) {
      return getImgUnitTag({
        unit_type: unit.unit_type,
        renting: this.rentingPick.renting,
        furniture: unit.furniture === 'fully'
      })
    },
    getUnitImg(unit) {
      const unitImgs = {
        firstImg: {},
        extImg: []
      };
      if (unit && unit.imgs.length) {
        unitImgs.firstImg = unit.imgs[0];
        unitImgs.extImg = unit.imgs.slice(1);
      }
      return unitImgs;
    },
    async filterItems() {
      this.finishLoading = false
      this.page = 1;
      await this.loadHotUnit()
      const res = await this.postApi(false, true)
      if (res) {
        this.units = res.returnData;
        await this.checkClearHighlightUnit()
        this.finishLoading = true
        this.totalItems = res.totalResult;
        this.unitNotFound = ''
        this.page++;
      }
      if (!res.returnData.length) {
        this.unitNotFound = 'Không tìm thấy căn phù hợp !'
      }
    },
    viewIcon(view) {
      return viewImg[view];
    },
    transView(val) {
      return translate(this.VIEW, val);
    },
    async getPjFilterData() {
      const res = await post("/sales/get_pjs_filter", {
        activeOnly: true,
      });
      this.projects = res.returnData;
    },
    unitThumbImg(unit) {
      if (unit.imgs.length && unit) {
        return unit.imgs[0].thumb
      } else {
        return ''
      }
    },
    onStatusPick(status) {
      this.rentingPick.salesRenting = false;
      this.rentingPick.salesSelling = false;
      this.rentingPick[status] = true;
    },
    onUnitFilter(field, value) {
      if (field === 'project' || field === 'views' || field === 'balconies') {
        this.filterData[field] = value
      } else if (field === 'active') {
        this[field] = value
      } else if (field === 'search') {
        this.pjSearch = value
      } else if (field === 'rent') {
        this.onStatusPick(value === 'rent' ? 'salesRenting' : 'salesSelling')
      } else {
        this.filterData[field] = this.filterData[field] === value ? '' : value
      }
    },
    setHighlightUnit() {
      this.highlightUnit = [];
      if (this.units.length > 0) {
        this.units.map(unit => {
          if (!((this.rentingPick.salesRenting && !unit.rent_available) || (this.rentingPick.salesSelling && !unit.sell_available)) && this.highlightUnit.length < 4) {
            this.highlightUnit.push(unit)
            unit.disable = true
          }
        })
      }
    },
    checkNotAvailableUnit(unit) {
      return (this.rentingPick.salesRenting && !unit.rent_available) || (this.rentingPick.salesSelling && !unit.sell_available)
    },
    async checkClearHighlightUnit() {
      if (this.isNotExtFiltering) {
        this.setHighlightUnit()
      } else {
        this.highlightUnit = []
      }
    },
    onSubmitFilter() {
      this.filterItems();
    },
    async getPjPickData() {
      const res = await post('/sales/get_unit_cart_pj_data', {
        id: this.pjId
      })
      this.pjPickData = res.returnData
    },
    checkUnitSplitTwoLayout() {
      this.splitTwoCol = getItemFromLocalStorage('unitSplitTwoLayout') === 'true'
    },
    clearPriceFilter() {
      this.filterData.rentingPriceFrom = undefined
      this.filterData.rentingPriceTo = undefined
      this.filterData.sellingPriceTo = undefined
      this.filterData.sellingPriceFrom = undefined
    },
    getValueByParamsName()
    {
      const rentingParams = this.$route.params?.renting;
      const pjName = this.$route.params?.pjName;
      this.unitIdDefault = this.$route.params?.unitId ?  this.$route.params?.unitId : -1 ;
      const formatPjName = replaceCharacter(pjName,'-',' ')
      this.pjId = findProjectIdByName(formatPjName, this.getPjLibData)
      this.rentingDefault = ( rentingParams === 'thue' )
    },
  },
  async mounted() {
    await  this.onChangeLayout()
    await this.loadUnits();
    this.getValueByParamsName()
    await this.getPjPickData()
    await this.getPjFilterData();
    await this.checkClearHighlightUnit()
    this.checkUnitSplitTwoLayout()
    window.addEventListener("scroll", this.scrollHandle);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.scrollHandle);
    removeLocalItem('unitFilter')
  },
  watch: {
    rentingPick: {
      handler() {
        this.checkClearHighlightUnit()
        this.filterItems();
        this.clearPriceFilter()
      },
      deep: true,
    },
  }
}
</script>

<style scoped>
.unitInfor span {
  flex: 0 0 auto;
  width: auto;
  margin: .5rem;
}

.status-button {
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.05);
  border: white;
}

.text-status {
  color: #999;
  font-size: 12px;
  font-style: normal;
  line-height: 18px;
  margin: 4px;
}

.rent-button-active {
  background-color: #48BD48 !important;
}

.sell-button-active {
  background-color: #ff4747 !important;
}


@media only screen and (max-width: 576px) {
  .filter-box {
    position: sticky;
    top: 0;
    z-index: 200;
    background: white;
  }
}
</style>


