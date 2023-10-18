<template>
  <FpDefLayout
    :bc-props="pgMeta"
    @breadcrumbBackIcon="onBreadcrumbBackIcon"
  >
    <template #comp>

      <!--        region:pc-->
      <div v-if="!isMobileScreen">
        <div class="p-4" v-if="!notification">
          <div class="row d-flex justify-content-center">
            <div class="col-lg-10 d-flex justify-content-between p-3">
              <div class="col-lg-5  border8">

              </div>
              <div class="col-lg-5 col-7  border8 d-flex justify-content-end">
                <div class="col-md-5 col-6 px-2">
                  <button v-show="!creatingCusInq" @click="createBtnClk"
                          class="gray-button w-100 rounded btn-wrap-text small">Tạo mới
                  </button>
                </div>
                <div class="col-md-5 col-6 px-2">
                  <button class="w-100 btn-wrap-text small gray-button" @click="windowBack">Hủy bỏ</button>
                </div>
              </div>
            </div>
          </div>
          <div class="row d-flex justify-content-center mt-3">
            <div class="col-md-6 col-xl-5">
              <div class="row">
                <div class="col" v-if="!cusLocked">
                  <div :class="(alert && !cusData.name) ? 'alert-input' : ''" class="p-3 border border-gray border8">
                    <span class="text-gray text-content">Điền tên khách hàng</span>
                    <span class="d-flex">
                          <input type="text" :class="cusLocked ? 'me-n5' : ''"
                                 class="form-control border-white bold-input p-2"
                                 v-model="cusData.name" list="sug-cus-name" @input="nameChanged" :disabled="cusLocked">
                          <datalist id="sug-cus-name">
                              <option v-for="(cus, index) in sugCus" :key="index" :value="cus.name+' '"
                                      :data-id="cus.id"
                                      :data-phone="cus.phone">({{ cus.phone }})</option>
                      </datalist>
                      <img @click="resetCus" v-if="cusLocked" :src="getIconUrl('XCircle.svg')" alt="">
                      </span>
                  </div>
                </div>
                <div class="col-auto mt-3" v-if="!cusLocked">
                  <UploadAvt :currentAvt="onCurrentAvt" :hoverImg="true" :sizeAvt="80" @updateAvt="onUpdateAvt"
                             :isPopup="true"/>
                </div>
              </div>
              <div class="pe-4" v-if="cusLocked">
                <fpCusTag :cusId="cusData?.id" :cusName="cusData?.name" :phoneNumber="cusData?.phone"
                          :avtSrc="cusData" :dotSize="0" :lastInteract="cusData?.last_update"/>
              </div>
              <div class="d-flex p-2 cursor-pointer" @click="resetCus" v-if="cusLocked">
                <FpIcon srcIcon="delete-gray.svg" :size="14" class="mt-1"/>
                <span class="text-gray"><i>Tạo khách hàng mới</i></span>
              </div>
              <!--            NẾU LÀ TẠO TẠO INQUIRY THÌ ẨN EMAIL, FACEBOOK, NGUỒN ^^-->
              <div v-show="!cusLocked" class="mt-2">
                <div class="rounded border p-3 border8">
                  <FpVnesePhoneField labelClass="fst-italic text-gray" :defValue="cusData.phone" inputClass="p-3 "
                                     :borderNone="true" :required="true"
                                     @fieldVal="onPhoneNumberChange" placeholder="Nhập số điện thoại khách hàng"/>
                </div>
                <div class="rounded border p-3 border8 mt-3">
                  <EmailField labelClass="fst-italic text-gray" :defValue="cusData.email" inputClass="p-3 "
                              :borderNone="true" placeholder="Nhập email khách hàng" :required="true"
                              @fieldVal="onEmailChange"/>

                </div>
                <div class="p-3 border border-gray border8 mt-3">
                  <Fbfield labelClass="fst-italic text-gray" :defValue="cusData.fb" inputClass="p-3 " :borderNone="true"
                           placeholder="Nhập facebook khách hàng" :required="true"
                           @fieldVal="onFbChange"/>
                </div>
                <div class="col-12 mt-3">
                  <div class="p-3 border border-gray rounded">
                    <div class="fst-italic text-gray">Nguồn</div>
                    <select v-model="cusData.source" class="form-control-plaintext">
                      <option v-for="(src, index) in CUSTOMER_SOURCE" :key="index" :value="src[0]">{{ src[1] }}</option>
                    </select>
                  </div>
                </div>
                <div class="col-12 mt-3 ">
                               <textarea v-model="cusData.persona" placeholder="Ghi chú" name="note"
                                         class="form-control small-text-box  text-content p-3">
                              </textarea>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-xl-5 mt-3 mt-lg-0">
              <div class="col-12">
                <FpLabelFormTemplate label="Dự án" labelClass="text-gray">
                  <template #comp>
                    <FormMultiTagOptionsPicked title="Dự án" :sugData="projects" :selectedList="pjSelectedList"
                                               @selectedHandler="pickedHandler"/>
                  </template>
                </FpLabelFormTemplate>
              </div>
              <div class="col-12 mt-3">
                <FpRentStatusPick :rentProps="inqData.rent" @rent="onRentingPick"/>
              </div>
              <div class="col-12 mt-3">
                <div class="d-flex justify-content-between row">
                  <div class="col-6 ">
                    <FpLabelFormTemplate :label="`Tài chính `"
                                         labelClass="text-gray text-content" class="w-100">
                      <template #comp>
                        <FpFinanceForm :rent="inqData.rent" @price="setCusPrice" :price="inqData.ceilingPrice"/>
                      </template>
                    </FpLabelFormTemplate>
                  </div>
                  <div class="col-6">
                    <fpLabelFormTemplate label="Ngày ở" labelClass="text-gray">
                      <template #comp>
                        <input type="date" class="form-control border-0 border-white border"
                               v-model="inqData.moveInDay"/>
                      </template>
                    </fpLabelFormTemplate>
                  </div>
                </div>
              </div>
              <div class="col-12 mt-3">
                <PickBedroomWUnitType :bedroomProps="inqData.bedroom" :unitTypeProps="inqData.unitType"
                                      @bedroomType="onBedroomUnitTypePick" class="mt-3"/>
              </div>
              <div class="col-12 mt-3">
                <FpFurniturePick :fullFur="inqData.furniture==='fully'" styleBtn="padding:1.5rem!important"
                                 @furniturePick="onFurPick"/>
              </div>
              <div class="col-12 mt-3">
                <fpLabelFormTemplate label="Diện tích" labelClass="text-gray">
                  <template #comp>
                    <FpRangeSelect class="py-2" @rangeNumbChanged="onSizeChange" :numbDefault="inqData.size"/>
                  </template>
                </fpLabelFormTemplate>
              </div>
              <div class="col-12 mt-3">
                <fpLabelFormTemplate label="Chọn Hướng" labelClass="text-gray">
                  <template #comp>
                    <FormPickBalcony :balconyDefault="inqData.balcony" @balconyPick="onBalconyChange"
                                     :basicPointing="true"/>
                  </template>
                </fpLabelFormTemplate>
              </div>
              <div class="col-12 mt-3">
                <fpLabelFormTemplate label="View" labelClass="text-gray">
                  <template #comp>
                    <ViewUnitFilter @viewFilter="onViewPicked" :viewProps="inqData.views"/>
                  </template>
                </fpLabelFormTemplate>
              </div>
              <div class="mt-4">
                <fpLabelFormTemplate label="Loại tầng" labelClass="text-gray">
                  <template #comp>
                    <FpFloorSelected @floorSelected="onFloorSelect" :unitHeight='inqData.heights'/>
                  </template>
                </fpLabelFormTemplate>
              </div>
            </div>

          </div>
        </div>
        <div class="row d-flex justify-content-center" v-if="notification">
          <div class="col-lg-4 col-md-5 col-8">
            <div class="row mt-4 p-4 d-flex justify-content-center ">
              <div class="process-rent-done d-inline-flex align-items-center rounded-circle"
                   style="width: 60px;height: 60px">
                <img :src="getIconUrl('rentCheck.svg')" class="w-100" alt="">
              </div>
            </div>
            <div class="row ">
              <h2 class="d-flex justify-content-center text-center"><b>Thành công !</b></h2>
            </div>
            <div class="row text-center text-gray">
              Khách hàng {{ cusData.name }} đã được tạo, bạn có thể
              xem tổng quan thông tin của {{ cusData.name }} hoặc ghép căn
              phù hợp với nhu cầu của khách từ bây giờ.
            </div>
            <div class="row justify-content-between p-lg-3 p-2 mt-2">
              <div class="col-12">
                <button class="w-100 gray-button btn-wrap-text text-white bg-dark small p-2"
                        @click="inquiryURL(newInqId)">Ghép nhu cầu
                </button>
              </div>
              <div class="col-12  d-flex justify-content-center mt-md-3 mt-2">
                <a>
                  <span class="text-content" @click="goToURL(cusInfoURL(newCusId))">Chi tiết khách hàng </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--        endregion-->

      <!--        region:mobile-->
      <div class="px-3 h-100">
        <CreateNewCustomerInMobile v-if="isMobileScreen" :cusLocked="cusLocked" @cusCreated="onMobileCusCreated"
                                   @dataUrl="onUpdateAvt"
                                   :projects="projects" :pjBlockRepo="pjBlockRepo"
                                   :step-props="mobileStep" @next-step="onMobileNextStep"
                                   @rentingPick="onRentingPick"
        />
      </div>
      <!--        endregion-->

    </template>
  </FpDefLayout>

  <TourHost
    v-if="isMobileScreen"
    pageName="newSalesCusCreateMobile"
    :tourOptions="pageTour['New Sales Create Cus Mobile']"
    :startDelay="500"
  />
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import {getIconUrl, getItemFromLocalStorage, goToURL, updateAvtUser} from "@/utils/utils";
import {getCompareValue, post} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {breadcrumpProp, defLayoutBehaType} from "@/models/customProp";
import {baseUrl, Roles} from "@/utils/constants";
import FpLabelFormTemplate from "@/components/FpLayout/FpLabelFormTemplate.vue";
import FormMultiTagOptionsPicked from "@/components/FpForm/FormMultiTagOptionsPicked.vue";
import {scrWdtEnum, scrWdtFrom, scrWdtTo} from "@/utils/windowWidth";
import CreateCusInforView from "@/views/SalesView/SalesCusCreatedInMobile/CreateCusInforView.vue";
import FpRentStatusPick from "@/components/FpForm/FpRentStatusPick.vue";
import CreateCusRentStatus from "@/views/SalesView/SalesCusCreatedInMobile/CreateCusRentStatus.vue";
import CreateCusFinance from "@/views/SalesView/SalesCusCreatedInMobile/CreateCusFinance.vue";
import FindPjForCus from "@/views/SalesView/SalesCusCreatedInMobile/MobileInqProjectPick.vue";
import CreateNewCustomerInMobile from "@/views/SalesView/SalesCusCreatedInMobile/CreateNewCustomerInMobile.vue";
import {S_INQ_DETAIL_URL, S_PAIREDINQ, S_PSP_URL} from "@/router/URLs";
import FpCusTag from "@/components/FpTag/FpCusTag.vue";
import EmailField from "@/components/FpInput/FpFields/EmailField.vue";
import Fbfield from "@/components/FpInput/FpFields/Fbfield.vue";
import PickBedroomWUnitType from "@/components/FpForm/PickBedroomWUnitType.vue";
import FpFloorSelected from "@/components/FpForm/FpFloorSelected.vue";
import FormPickBalcony from "@/components/FpForm/FormPickBalcony.vue";
import FpFurniturePick from "@/components/FpForm/FpFurniturePick.vue";
import FpFinanceForm from "@/components/FpForm/FpFinanceForm.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpVnesePhoneField from "@/components/FpForm/FpVnesePhoneField.vue";
import FpRangeSelect from "@/components/FpRange/FpRangeSelect.vue";
import CreateCusAvt from "@/views/SalesView/SalesCusCreatedInMobile/CreateCusAvt.vue";
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import UploadAvt from "@/components/FpImg/UploadAvt.vue";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";
import ViewUnitFilter from "@/components/FpFilter/AgentFilter/LayoutResearch/ViewUnitFilter.vue";
import {parseCeilingPrice} from "@/utils/inqConstant";
import TourHost from "@/views/Guidance/TourHost.vue";
import {pageTour} from "@/views/Guidance/pageTour";


const breadcrumbTitle = {
  1: 'Chọn nhu cầu',
  2: 'Chọn dự án',
  3: 'Chọn dự án',
  4: 'Chọn nội thất',
  5: 'Nhu cầu chi tiết',
  6: 'Mức Tài chính',
  7: 'Thêm khách hàng',
  8: 'Thêm khác hàng',
}
export default {
  components: {
    TourHost,
    ViewUnitFilter,
    CreateCusAvt,
    FpRangeSelect,
    FpIcon,
    FpFurniturePick,
    FormPickBalcony,
    PickBedroomWUnitType,
    FpCusTag,
    CreateNewCustomerInMobile,
    FindPjForCus,
    CreateCusFinance,
    CreateCusRentStatus,
    FpRentStatusPick,
    CreateCusInforView,
    FpLabelFormTemplate,
    FpDefLayout,
    FormMultiTagOptionsPicked,
    EmailField,
    Fbfield,
    FpFloorSelected,
    FpFinanceForm,
    FpVnesePhoneField,
    FpUserImg,
    ButtonView,
    UploadAvt
  },
  data() {
    return {
      cusData: {
        id: -1,
        name: "",
        phone: "",
        email: "",
        fb: "",
        source: "other",
        persona: "",
        preset_avt: 'maleAvatar.png',
      },
      inqData: {
        project: [],
        // unitHeight: "",
        bedroom: "",
        furniture: "",
        rent: true,
        ceilingPrice: 0,
        moveInDay: null,
        balcony: "",
        note: "",
        blocks: [],
        size: 0,
        unitType: 'ap',
        views: []
      },
      //state val
      inqPjs: [],
      pjInput: '',
      sugCus: [],
      pjSelectedList: [],
      pjBlockRepo: [],
      blockSelectedList: [],

      // Trans vars
      projects: [],
      POINTING: "",
      CUSTOMER_SOURCE: "",
      // Controller vars
      nameLocked: false,
      phoneLocked: false,
      creatingCusInq: false,
      //created notification
      notification: false,
      newCusId: -1,
      newInqId: -1,
      createdToast: false,
      alert: false,
      // Meta
      pgMeta: {
        [breadcrumpProp.title]: '',
        [breadcrumpProp.enableRB]: false,
        [breadcrumpProp.behaviorType]: defLayoutBehaType.signal,
      },
      openCusPickAvt: false,
      // temp variable
      dataUrl: {},
      avtRender: {
        url: '',
        type: ''
      },
      mobileStep: 1,
      // import
      pageTour
    }
  },
  // props: {
  //   cusID: {
  //     type: Number
  //   }
  // },
  computed: {
    cusName() {
      return this.cusData.name;
    },
    cusLocked() {
      return this.cusData.id > 0;
    },
    validSubmit() {
      return (
        this.cusData.name &&
        this.inqData.project.length > 0 &&
        this.inqData.rent != null
      );
    },
    isMobileScreen() {
      return !!scrWdtTo(scrWdtEnum.SM);
    },
    unitPjBlockRepo() {
      return this.projects.map(obj1 => {
        return this.pjBlockRepo.find(obj2 => obj2.id === obj1.id);
      })
    },
    onCurrentAvt() {
      if (Object.keys(this.dataUrl).length) {
        return {
          url: this.dataUrl.dataUrl,
          type: 'default'
        }
      } else {
        return getUrlTypeAvtOfCusData(this.cusData)
      }
    },
    cusID() {
      return this.$route.params?.cusID
    }
  },
  methods: {
    parseCeilingPrice,
    getUrlTypeAvtOfCusData,
    getIconUrl,
    goToURL,
    onMobileNextStep(val) {
      this.mobileStep = val
      this.setBreadCrumbWStep()
    },
    onBreadcrumbBackIcon() {
      if (this.mobileStep === 1) {
        this.$router.back()
      }
      this.setBreadCrumbWStep()
      this.handleMobileStep()
    },
    handleMobileStep() {
      if (this.mobileStep === 4 && !this.inqData?.project?.length) {
        this.mobileStep = 2
      } else if (this.mobileStep === 7 && this.inqData.rent) {
        this.mobileStep = 4
      } else if (this.mobileStep === 6 && !this.inqData.rent) {
        this.mobileStep = 4
      } else if (this.mobileStep === 5 && !this.inqData.rent) {
        this.mobileStep = 6
      } else {
        this.mobileStep--
      }
    },
    setBreadCrumbWStep() {
      if (!scrWdtFrom(scrWdtEnum.MD)) {
        this.pgMeta[breadcrumpProp.title] = breadcrumbTitle[this.mobileStep]
      }
    },
    cusInfoURL(id) {
      return baseUrl[Roles.Sales] + "/customer_detail-" + id;
    },
    inquiryURL(id) {
      return this.$router.push({name: 'Sales UInquiry', inqID: id, cusID: this.cusData.id})
      // return S_INQ_DETAIL_URL + '/' + id;
    },
    windowBack() {
      window.history.back();
    },
    watchLock() {
      this.nameLocked = this.phoneLocked = true;
    },

    resetCus() {
      this.cusData.id = -1;
      this.cusData.name = "";
      this.cusData.phone = "";
      this.cusData.email = '';
      this.cusData.fb = '';
      this.cusData.source = ''
      this.alert = false;
    },
    createBtnClk() {
      this.getPjIDFromPjSelectedList()
      if (this.validSubmit) {
        this.createCusInq();
      } else {
        this.alert = true;
      }
    },
    fetchCusData(data) {
      this.cusData = {...this.cusData, ...data};
    },
    cusPicked(cusName, cusPhone, cusId) {
      this.watchLock();
      this.getCusData(cusId);
    },
    nameChanged(event) {
      const selectedCus = event.target.list.querySelector(
        `option[value="${this.cusData.name}"]`
      );
      if (!selectedCus) {
        return;
      }
      const selName = selectedCus.value;
      const selPhone = selectedCus.getAttribute("data-phone");
      const selId = selectedCus.getAttribute("data-id");
      if (selId) {
        this.cusPicked(selName, selPhone, selId);
      }
    },
    onPhoneNumberChange(val) {
      this.cusData.phone = val.phoneNumber
    },
    onEmailChange(val) {
      this.cusData.email = val.email
    },
    onFbChange(val) {
      this.cusData.fb = val.facebook
    },
    onRentingPick(rentStt) {
      this.inqData.rent = rentStt
    },
    setCusPrice(price) {
      this.inqData.ceilingPrice = price
    },
    onFurPick(fur) {
      this.inqData.furniture = fur
    },
    onBalconyChange(balcony) {
      this.inqData.balcony = balcony
    },
    onFloorSelect(floor) {
      this.inqData.heights = floor
    },
    onSizeChange(size) {
      this.inqData.size = size
    },
    onViewPicked(val) {
      this.inqData.views = val
    },
    // Apis
    async getCusData(id = this.cusID) {
      this.watchLock();
      const res = await post("/sales/get_cus_data_api", {
        id: id,
        role: Roles.Sales,
      });
      // console.log(res.returnData, 'cusData')
      if (!res) {
        return;
      }
      this.serverResText = res.resText;
      if (res.succeed) {
        this.fetchCusData(res.returnData);
      }
    },
    async getSugCus() {
      const res = await post("/sales/get_min_customers", {
        selfStats: true,
        name: this.cusData.name,
        phone: this.cusData.phone,
        role: Roles.Sales,
      });
      this.serverResText = res.resText;
      if (res.succeed) {
        this.sugCus = res.returnData;
      }
    },
    async createCusInq() {
      if (this.creatingCusInq) {
        return;
      }
      this.creatingCusInq = true;
      const res = await post("/sales/create_cus_inq_api", {
        cusData: this.cusData,
        inqData: this.inqData,
      });
      // console.log(res)
      if (!res) {
        this.creatingCusInq = false;
        return;
      }
      if (!res.succeed) {
        this.creatingCusInq = false;
        window.alert(res.resText);
        return '';
      }
      this.creatingCusInq = true;
      if (!this.inqData?.project?.length) {
        await this.onPairPSP(res.inqId)
      } else {
        await this.updateAvt(res.cusId)
        this.$router.push({name: 'Sales paired inq', params: {cusID: res.cusId, inqId: res.inqId}})
        this.newCusId = res.cusId;
        this.newInqId = res.inqId;
        this.notification = true;
      }
    },
    async onPairPSP(id) {
      const res = await post('/personal_sp/create_personal_sp', {
        inquiryId: id,
      })
      if (res && res.succeed) {
        this.$router.push(S_PSP_URL + '?pspID=' + res.pspID)
      }
    },
    async getPjs() {
      const res = await post("/sales/sales_new_inq_get_pj", {
        activeOnly: true,
        exIds: this.inqData.project,
      });
      if (!res) {
        return;
      }
      this.serverResText = res.resText;
      if (res.succeed) {
        this.projects = res.returnData;
      }
    },
    async getPjBlockRepo() {
      const res = await post('/sales/get_pjs_w_block_data', {})
      this.pjBlockRepo = res.returnData
      // console.log(res.returnData, 'block')
    },
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.CUSTOMER_SOURCE, DataLibType.POINTING]
      );
      this.CUSTOMER_SOURCE = res.CUSTOMER_SOURCE;
      this.POINTING = res.POINTING;
    },
    sugPicked(id) {
      const index = this.pjBlockRepo.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        const selected = this.pjBlockRepo.splice(index, 1);
        this.pjSelectedList.push(...selected);
      }
    },
    sugUnpick(id) {
      const index = this.pjSelectedList.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        this.pjBlockRepo.push(this.pjSelectedList[index]);
        const unpickBlockId = this.pjSelectedList[index].blkData
        if (unpickBlockId.length > 0) {
          unpickBlockId.map(blk => {
            if (this.blockSelectedList.includes(blk.id)) {
              this.blockSelectedList.splice(this.blockSelectedList.indexOf(blk.id), 1);
            }
          })
        }
        this.pjSelectedList.splice(index, 1);
      }
    },
    pickedHandler(options) {
      if (options.sugPick) {
        this.sugPicked(options.sugPick)
      } else if (options.unpick) {
        this.sugUnpick(options.unpick)
      } else if (options.blockPick) {
        this.onBlockPick(options.blockPick)
      }
    },
    onBedroomUnitTypePick(pickVal) {
      this.inqData.unitType = pickVal.unitType !== undefined ? pickVal.unitType : this.inqData.unitType
      this.inqData.bedroom = pickVal.bedroom !== undefined ? pickVal.bedroom : this.inqData.bedroom
    },
    onBlockPick(blockId) {
      if (this.blockSelectedList.includes(blockId)) {
        this.blockSelectedList.splice(this.blockSelectedList.indexOf(blockId), 1);
      } else {
        this.blockSelectedList.push(blockId);
      }
    },
    onMobileCusCreated(data) {
      this.cusData = this.cusLocked ? this.cusData : data.cusData
      this.inqData = data.inqData
      this.createCusInq()
    },
    getPjIDFromPjSelectedList() {
      this.inqData.project = []
      this.pjSelectedList?.map(pj => {
        this.inqData.project.push(pj.id)
      })
      this.inqData.blocks = []
      this.blockSelectedList?.map(blk => {
        this.inqData.blocks.push(blk)
      })
    },
    async updateAvt(cusId) {
      if (Object.keys(this.dataUrl).length && this.dataUrl) {
        const res = await updateAvtUser(this.dataUrl, cusId)
      }
    },
    onUpdateAvt(val) {
      if (val.dataUrl) {
        this.dataUrl = val
      } else {
        this.cusData.preset_avt = val
      }
    },
  },
  watch: {
    cusName() {
      if (this.nameLocked) {
        this.nameLocked = false;
        return;
      }
      this.getSugCus();
    },
  },
  mounted() {
    this.getDataLib();
    this.getPjs();
    this.getPjBlockRepo()
    if (this.cusID > 0) {
      this.getCusData();
    }
    this.setBreadCrumbWStep()
  }
}
</script>

<style scoped>
.height-85 {
  height: 85vh;
}
</style>
