<template>
  <div id="content" class="overflow-scroll container-fluid">
    <div class="row mt-2 justify-content-between container-fluid">
      <div class="col-7 ">
        <h6 v-bind:style="{'color':projectColor}">{{ project }}  <FpIcon src-icon="Info.svg" :size="24" class="col-auto p-0" @click="$router.push(S_PJ_INFO + '-' + replaceCharacter(editingUnit?.pjData.name,' ','-'))"></FpIcon></h6>
      </div>
      <div class="col-5 padding-right-init">
        <div class="w-100  border-left " v-bind:style="{'background-color':projectColor}">
        </div>
        <div class="row mt-2 justify-content-center" v-if="currentPage==='Agent'">
          <div class="col-4">
            <span class="dotRentNumber text-center"><b>{{ editingUnit.totalRUI }}</b></span>
          </div>
          <div class="col-4">
            <span class="dotSellNumber text-center"><b>{{ editingUnit.totalBUI }}</b></span>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-12">
        <div class="row mt-2 d-flex">
          <div class="col-auto">
            <h5 class="mt-auto ">{{ code }}</h5>
          </div>
          <div class="col-auto">
            <img class="img-responsive right-tab-icon" @click="onFavIconClk" alt="favIcon" :src="getIconUrl(favIcon)">
          </div>
        </div>
      </div>
    </div>

    <div v-if="imgs && imgs.length" class="d-flex mt-2 justify-content-center">
      <div @click='unitImgClk(imgs)' class="col-12" >
        <SwipeBox :img='imgs.map((item) => item.wm_url)'/>
      </div>
    </div>

    <button @click="showImgMgmt=true" class="w-100 mt-3 mt-lg-3 btn-wrap-text small gray-button">Tải ảnh lên</button>

    <div class="row mt-4 underline-change">
      <div class="col-4">
        <h6 v-if="bedroom != 0.0 && bedroom!==''" class="text-gray">
          {{ bedroom }}
          <img class="iconInCart " :src="getIconUrl('bed-solid.svg')" alt=""/>
        </h6>
      </div>
      <div class="col-4 text-gray">
        <h6 v-if="bathroom > 0.0 && bathroom" class="m-auto btn-wrap-text">
          {{ bathroom }}
          <img class="iconInCart " :src="getIconUrl('bath-solid.svg')" alt=""/>
        </h6>
      </div>
      <div class="col-4 text-gray">
        <h6 v-if="size>0.0">{{ size }} m²</h6>
      </div>
    </div>
    <div class="row mt-4 underline-change">
      <div class="col-11">
        <h5 class="text-dark">{{ ownerName }}</h5>
        <div v-for="(phone, index) in splitPhone" :key="index" class="row d-flex align-content-center align-items-center pb-2">
          <div class="col-auto">
            <img class="iconInCart" :src="getIconUrl('call_icon.png')" alt=""/>
          </div>
          <div class="col-auto p-0">
            <p class="mt-2 text-gray m-0 p-0">
              <a v-bind:href="'tel:' + phone" class="text-gray"> {{ phone }}&nbsp </a>
            </p>
          </div>
          <div class="col-auto">
            <ZaloIcon
              :zaloDirect="true" :size="24"
              :phoneNumber="phone"
            />
          </div>
        </div>

      </div>
    </div>
    <div class="row mt-4">
      <div class="col-5 m-auto">
        <span class="mt-2 small text-gray">Tình trạng:</span>
      </div>
      <div class="col-7">
        <select v-model="unitStatus" class="form-control-plaintext form-control-border small">
          <option class="small" value="available">Tìm khách hàng</option>
          <option class="small" value="notAvail">Không nhu cầu</option>
          <option class="small" value="staying">Đang ở</option>
        </select>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-6">
        <div class="row">
          <div class="col-3 m-auto">
            <img style="height:20px;width: 20px" :src="getIconUrl('furniture.svg')" alt=""/>
          </div>
          <div class="col-9">
            <select v-model="furniture" class="form-control-plaintext form-control-border small ">
              <option v-for="(fur, index) in FURNITURE" :key="index" :value="fur[0]">{{ fur[1] }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="row mt-2">
          <div class="col-3 m-auto">
            <img style="height:20px;width: 20px" :src="getIconUrl('compass-solid.svg')" alt=""/>
          </div>
          <div class="col-9 m-auto">
            <span class="small">{{ fixedBalcony }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="row  mt-4">
      <div class="col-6">
        <button @click="renting=!renting" type="button" :class="{'green-latel':renting}"
                class=" tab-button w-100 rounded btn-wrap-text">Cho Thuê
        </button>
        <span v-show="!renting && isRent">Đã cho thuê</span>
      </div>
      <div class="col-6">
        <button @click="selling=!selling" type="button" :class="{'red-latel':selling}"
                class=" tab-button w-100 rounded">Bán
        </button>
        <span v-show="!selling && isSold">Đã bán</span>
      </div>
    </div>
    <div class="row mt-4 left-line-green ms-1 " v-show="renting">
      <div class="col-12">
        <div class="row">
          <div class="col-6">
            <span class="text-success u-tab-text">Giá Thuê (Tr) </span>
            <input v-model="rentingPrice" type="number" pattern="^d+(?:.d{1,2})?$" min="0"
                   class="form-control form-control-sm text-success w-75">
          </div>
          <div class="col-6 red-switch">
            <span class="text-success u-tab-text">Thuê Gấp</span>
            <span class="form-check form-switch ">
              <input v-model="rentingUrgency" class="form-switch form-switch-lg form-check-input"
                     type="checkbox" role="switch">
            </span>
          </div>
        </div>
        <div class="row mt-2 ">
          <div class="col-7">
            <input class="form-check-input" type="checkbox" v-model="managementCoverage">
            <span class="p-2 u-tab-text">Bao PQL</span>
          </div>
          <div class="col-5">
            <input class="form-check-input " type="checkbox" v-model="rentFeaturing">
            <span class="p-2 u-tab-text">Căn hot</span>
          </div>
        </div>

        <div class="row mt-2">
          <div class="col-8">
            <input class="form-check-input" type="checkbox" v-model="isRent">
            <span class="p-2 u-tab-text">Đã cho thuê</span>
          </div>
        </div>

        <div class="row mt-3 mb-4">
          <div class="col-4">
            <span class="text-11 text-gray">Cọc(Tr)</span>
            <input v-model="rentingDeposit" min="0" pattern="^d+(?:.d{1,2})?$" type="number"
                   class="form-control form-control-sm text-success ">
          </div>
          <div class="col-4 px-0">
            <span class="text-11 text-gray">Hoa hồng</span>
            <input v-model="rentingFee" min="0" pattern="^d+(?:.d{1,2})?$" type="number"
                   class="form-control form-control-sm text-success ">
          </div>
          <div class="col-4 ">
            <span class="text-11 text-gray">Phí LK(%)</span>
            <input v-model="rentingFeeSale" min="0" type="number" pattern="^d+(?:.d{1,2})?$"
                   class="form-control form-control-sm text-success ">
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4 left-line-red ms-1" v-show="selling">
      <div class="col-12">
        <div class="row mt-2">
          <div class="col-6">
            <span class="text-danger u-tab-text">Giá Bán (tỷ)</span>
            <input v-model="sellingPrice" min="0" pattern="^d+(?:.d{1,2})?$" type="number"
                   class="form-control form-control-sm w-75">
          </div>
          <div class="col-6 red-switch">
            <span class="text-danger u-tab-text">Bán Gấp</span>
            <span class="form-check form-switch ">
                <input v-model="sellingUrgency" class="form-switch form-switch-lg form-check-input"
                       type="checkbox" role="switch">
            </span>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-7">
            <input class="form-check-input " type="checkbox" v-model="feeCoverage">
            <span class="p-2 u-tab-text">Bao Thuế Phí</span>
          </div>
          <div class="col-5">
            <input class="form-check-input " type="checkbox" v-model="transferringCoverage">
            <span class="p-2 u-tab-text">Bao sổ</span>
          </div>
        </div>

        <div class="row mt-2">
          <div class="col-7">
            <input class="form-check-input" type="checkbox" v-model="isSold">
            <span class="p-2 u-tab-text">Đã bán</span>
          </div>
          <div class="col-5">
            <input class="form-check-input " type="checkbox" v-model="sellFeaturing">
            <span class="p-2 u-tab-text">Căn hot</span>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-4">
            <span class="text-11 text-gray">Cọc(Tr)</span>
            <input v-model="sellingDeposit" min="0" pattern="^d+(?:.d{1,2})?$" type="number"
                   class="form-control form-control-sm text-success">
          </div>
          <div class="col-4 px-0">
            <span class="text-11 text-gray">Phí MG(%)</span>
            <input v-model="sellingFee" min="0" type="number" pattern="^d+(?:.d{1,2})?$"
                   class="form-control form-control-sm text-success">
          </div>
          <div class="col-4">
            <span class="text-11 text-gray">Phí LK(%)</span>
            <input v-model="sellingFeeSale" min="0" type="number" pattern="^d+(?:.d{1,2})?$"
                   class="form-control form-control-sm text-success">
          </div>
        </div>
      </div>
    </div>
  </div>
  <div style="height: 35%" class="overflow-scroll">
    <div class="row ">
      <div class="col-auto mt-2">
        <input class="form-check-input " type="checkbox" v-model="scoutFree">
        <span class="p-2 ">Dễ xem nhà</span>
      </div>

    </div>
    <div class="row mt-2 d-flex align-items-center">
      <div class="col">
        <span class="u-tab-text text-gray">Ngày hết hạn hợp đồng : </span>
        <input v-model="contractExpiry" type="date" name="contractExpiry" class="form-control form-control-sm">
      </div>
<!--      <div class="col-auto h-100 mt-3">-->
<!--        <ButtonView content="" class="col-auto" :status="scoutFree ? 'more-btn' :'gray-btn'" :text-size="12" @click="scoutFree=!scoutFree"></ButtonView>-->
<!--      </div>-->
    </div>
    <div class="row mt-2">
      <div class="col-12  d-inline-block">
        <FilterLayout :can-ext="true" label-content="Note" :extending="true" layout-class="d-flex align-items-center">
          <template #filterContent>
            <textarea v-model="note" name="note" cols="40" rows="10" class="form-control small-text-box"></textarea>
          </template>
        </FilterLayout>
      </div>
      <div class="col-12 d-inline-block">
        <FilterLayout :can-ext="true" label-content="Miêu tả " layout-class="d-flex align-items-center" :extending="true">
          <template #filterContent>
            <textarea v-model="desc" name="desc" cols="40" rows="10" class="form-control small-text-box"></textarea>
          </template>
        </FilterLayout>
      </div>

    </div>
    <div class="row mt-lg-4 mt-2 mb-5">
      <div class="col-6">
        <button type="button" @click="handleUpdateClick" class=" tab-button w-100 rounded btn-wrap-text">Cập nhật
        </button>
      </div>
      <div class="col-6">
        <div class="bling mt-2 justify-content-around">
          <img v-show="fresh && level===4 " class="iconInCart " :src="getIconUrl('bling.svg')" alt=""/>
          <span v-show="level>1" class="text-gray u-tab-text-s"
                :class="{'text-success': level>2}">{{ fixedDate }}</span>
        </div>
      </div>
    </div>
  </div>
  <div id="snackbar" class="show" v-show="showToast">
    {{ toastMessages }}
  </div>
  <div id="warningToast" class="show" v-show="showWarning">
    <div class="text-center">
      <h6 class="text-center m-auto">⚠️</h6>
      <div class="exitSvg " @click="exitWarning"><img class="mt-2 w-50 h-50" :src="getIconUrl('Union.svg')" alt="">
      </div>
      <h6><b class="text-dark">Thông tin không đổi </b></h6>
      <p class="text-center small">Bạn vừa bấm cập nhật nhưng không có thông tin nào được thay đổi.Bạn có xác nhận đã
        liên lạc và cập nhật chính xác?</p>
    </div>

    <div class="row">
      <div class="col-6 ">
        <button type="button" @click="updateUnit(true)" style="background-color: #f2f2f2"
                class=" tab-button w-100 rounded btn-wrap-text small">Vẫn Cập nhật
        </button>
      </div>
      <div class="col-6">
        <button type="button" @click="updateUnit(false)"
                class="border-danger tab-button w-100 rounded btn-wrap-text small">Chưa Liên lạc được
        </button>
      </div>
    </div>
  </div>

  <div v-show="showWarning" id="overlay" @click="exitWarning"></div>
  <div v-if="showImgMgmt" class="d-flex justify-content-center align-items-center w-100 vh-100 position-fixed bg-white"
       style="top: 50%; left: 50%; transform: translate(-50%, -50%);z-index: 9999">
    <div @click='imgMgmtClosing' class='position-absolute top-0 end-0'>
      <div class="close-btn text-dark">&times;</div>
    </div>
    <ImgMgmt
      :objId="editingUnit.id"
      objDataEP="/sales/get_unit_data_api"
      imgsEP="/mlib/img/get_unit_imgs"
      updateImgsEP="/mlib/img/up_unit_img_pos"
      uploadImgEP="/mlib/img/create_unit_img"
    />
  </div>

</template>


<script>
import {floatFixed, getIconUrl, replaceCharacter, translate} from "@/utils/utils";
import {post} from '@/utils/dataQuery'
import SwipeBox from "@/components/FpImg/SwipeBox.vue";
import ImgMgmt from "@/components/FpImg/ImgMgmt.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {ddMmYyyy} from '@/utils/dateTimeUtils'
import {favObj, favObjAPI} from "@/utils/favAPI";
import ZaloIcon from "@/components/SocialItem/ZaloIcon.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {S_PJ_INFO} from "@/router/URLs";
import FpLabelFormTemplate from "@/components/FpLayout/FpLabelFormTemplate.vue";
import FilterLayout from "@/components/FpFilter/SalesFilter/FilterLayout.vue";
export default {
  components: {
    FilterLayout,
    FpLabelFormTemplate,
    FpIcon,
    ZaloIcon,
    ImgMgmt,
    SwipeBox,
    ButtonView
  },
  data() {
    return {
      S_PJ_INFO,
      watchLocking: false,
      focusId: "",
      units: {},
      projectColor: "",
      ownerName: "",
      ownerPhone: '0',
      code: "",
      zalo: "",
      project: "",
      block: "",
      floor: "",
      unit: "",
      renting: false,
      selling: false,
      rentingPrice: 0.0,
      sellingPrice: 0.0,
      bedroom: "",
      bathroom: 0,
      balcony: "",
      size: [],
      furniture: "",
      note: "",
      rentingFee: 0,
      sellingFee: 0,
      rentingFeeSale: 0,
      sellingFeeSale: 0,
      rentingUrgency: false,
      sellingUrgency: false,
      rentingDeposit: 0.0,
      sellingDeposit: 0.0,
      unitStatus: "",
      contractExpiry: "",
      fresh: false,
      checkAgainToast: false,
      toastMessages: "",
      showToast: false,
      managementCoverage: false,
      feeCoverage: false,
      transferringCoverage: false,
      refresh: false,
      showWarning: false,
      successIcon: false,
      lastRefresh: "",
      favorited: false,
      lcr: "",
      level: 1,
      cloneProps: {},
      comparePointing: {},
      compareFurniture: {},
      compareStatus: {},
      imgs: [],
      showCarousel: false,
      ssImgs: [],
      showImgMgmt: false,
      isRent: false,
      isSold: false,
      desc:'',
      lockedReq:false,
      getIconUrl,
      ddMmYyyy,
      scoutFree:false,
      sellFeaturing:false,
      rentFeaturing:false
    };
  },
  computed: {
    fixedBalcony() {
      return translate(this.POINTING, this.balcony);
    },
    fixedDate() {
      return this.lastRefresh
        ? ddMmYyyy(this.lastRefresh)
        : "";
    },
    favIcon() {
      return this.favorited ? 'star-solid.svg' : 'star.svg';
    },
    splitPhone() {
      const split = this.ownerPhone.split('-');
      split.forEach((element, index, array) => {
        array[index] = element.trim();
      });
      return split;
    },
    firstPhoneNum() {
      return this.splitPhone.length > 0 ? this.splitPhone[0] : '';
    },
  },
  methods: {
    replaceCharacter,
    imgMgmtClosing() {
      this.showImgMgmt = false;
      this.getUnitImgs();
    },
    unitImgClk(unitImgs) {
      this.showCarousel = true;
      this.ssImgs = unitImgs;
    },
    setValue(value) {
      const checkblock = value.block === "" ? "" : value.block + "-";
      this.focusId = value.id;
      this.projectColor = value.pjData.projectColor;
      this.ownerName = value.owner_data.name;
      this.ownerPhone = value.owner_data.phone;
      this.project = value.pjData.name;
      this.code = checkblock + value.floor + "." + value.unit;
      this.unitStatus = value.status;
      this.balcony = value.balcony;
      this.selling = value.selling;
      this.favorited = value.fav;
      this.renting = value.renting;
      this.rentingPrice = parseFloat(floatFixed(value.rentingPrice));
      this.sellingPrice = parseFloat(floatFixed(value.sellingPrice, 3));
      this.bedroom = value.bedroom;
      this.bathroom = value.bathroom;
      this.size = value.size;
      this.rentingUrgency = value.rentingUrgency;
      this.sellingUrgency = value.sellingUrgency;
      this.managementCoverage = value.managementCoverage;
      this.rentingDeposit = parseFloat(floatFixed(value.rentingDeposit));
      this.sellingDeposit = parseFloat(floatFixed(value.sellingDeposit));
      this.rentingFee = parseFloat(floatFixed(value.rentingFee));
      this.sellingFee = parseFloat(floatFixed(value.sellingFee));
      this.rentingFeeSale = parseFloat(floatFixed(value.rentingFeeSale));
      this.sellingFeeSale = parseFloat(floatFixed(value.sellingFeeSale));
      this.note = value.note;
      this.furniture = value.furniture;
      this.contractExpiry = value.contractExpiry;
      this.feeCoverage = value.feeCoverage;
      this.transferringCoverage = value.transferringCoverage;
      this.lastRefresh = value.lastRefresh;
      this.lcr = value.lcr;
      this.desc= value.desc;
      this.scoutFree=value.scoutFree;
      this.rentFeaturing=value.rentFeaturing;
      this.sellFeaturing=value.sellFeaturing;
      this.isRent = false;
      this.isSold = false;
    },
    async onFavIconClk() {
      const favSucceed = await favObjAPI(
        favObj.UNIT, this.focusId, !this.favorited);
      if (favSucceed) {
        this.favorited = !this.favorited;
        this.cloneNUpdateData({fav: this.favorited}, false);
      }
    },
    checkFresh() {
      const today = new Date();
      const freshDate = new Date(this.lastRefresh);
      const countDate = Math.round(today - freshDate) / 86400000;
      if (this.renting) {
        countDate < 5 ? (this.fresh = true) : (this.fresh = false);
      } else {
        countDate < 14 ? (this.fresh = true) : (this.fresh = false);
      }
      if (this.lcr === "Agent" || this.lcr === "A.Assistant") {
        if (this.lcr === "Agent") {
          this.fresh ? (this.level = 4) : (this.level = 2);
        } else {
          this.fresh ? (this.level = 3) : (this.level = 2);
        }
      }
    },
    updateEditingUnit() {
      const infoUpdated = {};
      infoUpdated.rentingPrice = this.rentingPrice;
      infoUpdated.furniture = this.furniture;
      infoUpdated.status = this.unitStatus;
      infoUpdated.rentingUrgency = this.rentingUrgency;
      infoUpdated.managementCoverage = this.managementCoverage;
      infoUpdated.contractExpiry = this.contractExpiry;
      infoUpdated.rentingDeposit = this.rentingDeposit;
      infoUpdated.rentingFee = this.rentingFee;
      infoUpdated.note = this.note;
      infoUpdated.sellingPrice = this.sellingPrice;
      infoUpdated.transferringCoverage = this.transferringCoverage;
      infoUpdated.sellingUrgency = this.sellingUrgency;
      infoUpdated.sellingDeposit = this.sellingDeposit;
      infoUpdated.sellingFee = this.sellingFee;
      infoUpdated.sellingFeeSale = this.sellingFeeSale;
      infoUpdated.renting = this.renting;
      infoUpdated.selling = this.selling;
      infoUpdated.feeCoverage = this.feeCoverage;
      infoUpdated.rentingFeeSale = this.rentingFeeSale;
      infoUpdated.desc=this.desc;
      infoUpdated.fav = this.favorited;
      infoUpdated.scoutFree=this.scoutFree;
      infoUpdated.rentFeaturing=this.rentFeaturing;
      infoUpdated.sellFeaturing=this.sellFeaturing
      return infoUpdated;
    },
    clearToast() {
      this.showToast = false;
      this.showWarning = false;
      this.refresh = false;
    },
    exitWarning() {
      this.showWarning = false;
    },
    checkHasUpdated() {
      for (const [key, value] of Object.entries(this.updateEditingUnit())) {
        if (value != this.cloneProps[key]) {
          return false;
        }
      }
      return true;
    },
    handleUpdateClick() {
      //check all input number than 0
      if (
        this.rentingPrice < 0 ||
        (this.rentingPrice === 0 && this.renting) ||
        this.sellingPrice < 0 ||
        (this.sellingPrice === 0 && this.selling) ||
        this.rentingDeposit < 0 ||
        this.sellingDeposit < 0 ||
        this.rentingFee < 0 ||
        this.sellingFee < 0 ||
        this.rentingFeeSale < 0 ||
        this.sellingFeeSale < 0
      ) {
        window.alert("Vui lòng nhập số lớn hơn 0 !");
        return;
      }
      // not change
      if (this.checkHasUpdated()) {
        if (this.fresh && this.currentPage === "A.Assistant") {
          this.showToast = !this.showToast;
          this.toastMessages = "⛔ xin hãy hoàn lương, quay đầu là bờ ";
          setTimeout(this.clearToast, 1700);
        } else {
          this.showWarning = !this.showWarning;
        }
      }
      // has change
      else {
        this.showToast = !this.showToast;
        this.toastMessages = "Cập nhật thành công ✅ ";
        setTimeout(this.clearToast, 1200);
        this.updateUnit(true);
      }
    },
    async getUnitImgs() {
      const res = await post("/mlib/img/get_unit_imgs", {
        id: this.editingUnit.id,
        imgType: "mini_ss",
      })
      this.imgs = res.returnData;
    },
    async archiveUnit() {
      const res = await post("/telesale/archive_unit/", {id: this.editingUnit.id})
      if (res) {
        alert("Đã lưu trữ thành công !");
      }
    },
    async updateUnit(freshUpdate) {

      if (freshUpdate) {
        this.refresh = true;
        this.lastRefresh = new Date().toLocaleDateString("en-US");
      }
      if(!this.lockedReq)
      {
        this.lockedReq=true
        const res = await post("/agent/update_unit_data", {
          projectColor: this.projectColor,
          unit_id: this.focusId,
          renting: this.renting,
          selling: this.selling,
          rentingPrice: this.rentingPrice,
          sellingPrice: this.sellingPrice,
          furniture: this.furniture,
          minRentingTime: this.minRentingTime,
          rentingDeposit: this.rentingDeposit,
          sellingDeposit: this.sellingDeposit,
          managementCoverage: this.managementCoverage,
          rentingUrgency: this.rentingUrgency,
          sellingUrgency: this.sellingUrgency,
          feeCoverage: this.feeCoverage,
          transferringCoverage: this.transferringCoverage,
          note: this.note,
          rentingFee: this.rentingFee,
          sellingFee: this.sellingFee,
          rentingFeeSale: this.rentingFeeSale,
          sellingFeeSale: this.sellingFeeSale,
          contractExpiry: this.contractExpiry,
          status: this.unitStatus,
          fresh: this.fresh,
          refresh: this.refresh,
          desc:this.desc,
          scoutFree:this.scoutFree,
          isRent: this.isRent,
          isSold: this.isSold,
          rentFeaturing:this.rentFeaturing,
          sellFeaturing:this.sellFeaturing
        })
        this.cloneNUpdateData(res.updatedUnit, this.refresh)
        this.lockedReq = false
      }

    },
    cloneNUpdateData(upUnitData, refresh = false, upData = this.updateEditingUnit()) {
      const updateEditingData = {
        ...this.editingUnit,
        ...upData,
      }
      if (refresh) {
        this.fresh = true;
        this.lcr = upUnitData.lcr;
        updateEditingData.lcr = upUnitData.lcr;
        updateEditingData.lastRefresh = new Date();
      }
      this.checkFresh();
      this.$emit("submit-event", updateEditingData);
      this.cloneProps = upUnitData;
      this.successIcon = !this.successIcon;
      setTimeout(this.clearToast, 1000);
    },
  },
  props: {
    editingUnit: {
      type: Object,
    },
    POINTING: {
      type: Array,
    },
    FURNITURE: {
      type: Array,
    },
    UNIT_STATUS: {
      type: Array,
    },
    currentPage: {
      type: String,
    }
  },
  watch: {
    editingUnit(val) {
      this.watchLocking = true;
      this.setValue(val);
      this.checkFresh();
      this.cloneProps = {...val};
      this.comparePointing = this.POINTING;
      this.compareFurniture = this.FURNITURE;
      this.compareStatus = this.UNIT_STATUS;
      this.getUnitImgs();
    },
    renting(val) {
      if (val) {
        this.unitStatus = "available";
        this.isRent = false;
      } else {
        if (!this.selling) {
          this.unitStatus = "notAvail";
        }
      }
    },
    selling(val) {
      if (val) {
        this.unitStatus = "available";
        this.isSold = false;
      } else {
        if (!this.renting) {
          this.unitStatus = "notAvail";
        }
      }
    },
    unitStatus(val) {
      if (val !== "available") {
        this.renting = false;
        this.selling = false;
      }
    },
    contractExpiry() {
      if (!this.watchLocking) {
        this.renting = false;
      } else {
        this.watchLocking = false;
      }
    },
    isRent(val) {
      if (val) {
        this.renting = false;
      }
    },
    isSold(val) {
      if (val) {
        this.selling = false;
      }
    },
  },
  emits: ["submit-event"],
  mounted() {
  },
}
</script>
