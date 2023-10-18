<template>
  <FpDefLayout v-show="!successPageDirect"
               :bc-props="pgMeta"
               ref="pgLayoutComp"
               :toast-msg-content="toastMsg"
               @closeToast="toastMsg=''"
  >
    <template #comp>
      <div class="container-fluid">
        <div class="p-lg-3 ps-4 row d-flex justify-content-center">
          <div class="col-lg-10 col-12">
            <div class="row d-flex justify-content-around">
              <div class="col-lg-6 col-12 p-lg-3 ">
                <div class="pe-4">
                  <fpCusTag :cusId="inqData.cusData?.id" :cusName="inqData.cusData?.name" :phoneNumber="inqData.cusData?.phone"
                            :avtSrc="inqData.cusData" :dotSize="0" />
                </div>
                <div class="row mt-3">
                  <FpRentStatusPick @rent="setInqRenting" :rentProps="inqData.rent" :disable-change="true"/>
                </div>
                <div class="pe-4 mt-3">
                  <fpLabelFormTemplate label="Dự án" labelClass="text-gray" boxClass="p-2">
                    <template #comp>
                      <FormMultiTagOptionsPicked title="Dự án" :sugData="pjBlockRepo" :selectedList="pjSelectedList"
                                                 @selectedHandler="pickedHandler" :blockInqSelect="inqData.blocks" />
                    </template>
                  </fpLabelFormTemplate>
                </div>
                <div class="pe-4 mt-3">
                  <PickBedroomWUnitType :bedroomProps="inqData.bedroom" :unitTypeProps="inqData.unitType"
                                        @bedroomType="onBedroomUnitTypePick"/>
                </div>
                <div class="row pe-3">
                  <div class="col-12 col-md-6 pe-3 mt-3">
                    <fpLabelFormTemplate :label="`Tài chính `"
                                         labelClass="text-gray">
                      <template #comp>
                        <FpFinanceForm :rent="inqData.rent" :price="inqData.ceilingPrice" @price="setInqCeilingPrice"/>
                      </template>
                    </fpLabelFormTemplate>
                  </div>
                  <div class="col-12 col-md-6  pe-3 mt-3">
                    <fpLabelFormTemplate label="Ngày ở dự kiến" labelClass="text-gray">
                      <template #comp>
                        <input v-model="inqData.moveInDay" type="date" class="form-control border-white"/>
                      </template>
                    </fpLabelFormTemplate>
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-12 p-lg-3">
                <div class="row p-3">
<!--                  <FpFurniturePick :fullFur="inqData.furniture==='fully'" @furniturePick="furniturePicked" styleBtn="padding:1.5rem!important"/>-->
                  <FpFurniturePick :fullFur="inqData.furniture==='fully'" styleBtn="padding:1.5rem!important"
                                   @furniturePick="furniturePicked" :compact="true"/>
                </div>
                <div class="pe-4 mt-3">
                  <fpLabelFormTemplate label="Diện tích" labelClass="text-gray">
                    <template #comp>
                      <FpRangeSelect @rangeNumbChanged="setInqSize" :numbDefault="inqData.size"/>
                    </template>
                  </fpLabelFormTemplate>
                </div>
                <div class="pe-4 mt-3">
                  <fpLabelFormTemplate label="Hướng" labelClass="text-gray">
                    <template #comp>
                      <select v-model="inqData.balcony" class="form-control-plaintext">
                        <option v-for="(point, index) in POINTING" :key="index" :value="point[0]">{{ point[1] }}</option>
                      </select>
                    </template>
                  </fpLabelFormTemplate>
                </div>
                <div class="pe-4 mt-3">
                  <fpLabelFormTemplate label="View" labelClass="text-gray" boxClass="p-3">
                    <template #comp>
                      <ViewUnitFilter @viewFilter="onViewPicked" :viewProps="inqData.views"/>
                    </template>
                  </fpLabelFormTemplate>
                </div>
                <div class="pe-4 mt-3">
                  <fpLabelFormTemplate label="Loại tầng" labelClass="text-gray">
                    <template #comp>
                      <FpFloorSelected @floorSelected="onFloorSelect" :unitHeight='inqData.heights'/>
                    </template>
                  </fpLabelFormTemplate>
                </div>
                <div class="pe-4 mt-3">
                  <div class="col-4"><button class="gray-button w-100 rounded btn-wrap-text small" @click="onUpdateCusInq">Cập nhật</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </template>
  </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import FpRentStatusPick from "@/components/FpForm/FpRentStatusPick.vue";
import FormPick from "@/components/FpForm/FormPick.vue";
import FpFinanceForm from "@/components/FpForm/FpFinanceForm.vue";
import fpCusTag from "@/components/FpTag/FpCusTag.vue";
import FpFloorSelected from "@/components/FpForm/FpFloorSelected.vue";
import FpFurniturePick from "@/components/FpForm/FpFurniturePick.vue";
import FpRangeSelect from "@/components/FpRange/FpRangeSelect.vue";
import fpLabelFormTemplate from "@/components/FpLayout/FpLabelFormTemplate.vue";
import FpUnitType from "@/components/FpForm/FpUnitType.vue";
import {getIconUrl, translate, goToURL, floatFixed} from "@/utils/utils";
import {getCompareValue, post} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {breadcrumpProp} from "@/models/customProp";
import {favObj} from "@/utils/favAPI";
import {IMG_URL, Roles} from "@/utils/constants";
import {getDdMm} from "@/utils/dateTimeUtils";
import FormMultiTagOptionsPicked from "@/components/FpForm/FormMultiTagOptionsPicked.vue";
import PickBedroomWUnitType from "@/components/FpForm/PickBedroomWUnitType.vue";
import ViewUnitFilter from "@/components/FpFilter/AgentFilter/LayoutResearch/ViewUnitFilter.vue";
import {parseCeilingPrice} from "@/utils/inqConstant";
// const getData = new URLSearchParams(window.location.href.split("?")[1]);
// const inqID = getData.get("inquiry");

export default {
  components: {
    PickBedroomWUnitType,
    FpDefLayout,
    fpCusTag,
    FpRentStatusPick,
    FormPick,
    FormMultiTagOptionsPicked,
    FpFinanceForm,
    FpFurniturePick,
    FpRangeSelect,
    fpLabelFormTemplate,
    FpFloorSelected,
    FpUnitType,
    ViewUnitFilter
  },
  data() {
    return {
      inqData: {},
      successPageDirect: false,
      unitId: false,
      IMG_URL,
      unit: {},
      // Server communication
      serverResText: "",
      upLocked: false,
      upWaiting: false,
      // Trans var
      FURNITURE: [],
      POINTING: [],
      SALE_PROCESS_STATUS: [],
      HEIGHT: [],
      VIEW: [],

      // Meta
      pgMeta: {
        [breadcrumpProp.title]: '',
        [breadcrumpProp.enableFav]: true,
        [breadcrumpProp.defFav]: false,
        [breadcrumpProp.favObjType]: favObj.UINQUIRY,
        [breadcrumpProp.favObjId]: this.inqID ? this.inqID : -1,
        [breadcrumpProp.enableRB]: false,
        [breadcrumpProp.rBIcon]: 'Info.svg'
      },
      optionsVal: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]],
      pjSelectedList: [],
      pjBlockRepo: [],
      blockSelectedList: [],
      toastMsg:'',
    }
  },
  computed:{
    inqID()
    {
      return parseInt(this.$route?.params?.inqID)
    }
  },
  methods: {
    parseCeilingPrice,
    getIconUrl,
    goToURL,
    getDdMm,
    translate,
    floatFixed,
    showRightBar(show) {
      this.$refs.pgLayoutComp.showRightBar(show);
    },
    onUpdateCusInq()
    {
      this.updateInqData()
    },
    // APIs
    async getUIData() {
      const res = await post("/sales/get_ui_data_api", {
        id: this.inqID ? this.inqID : -1,
        role: Roles.Sales,
      })
      // console.log(res.returnData,'UI DATA')
      this.serverResText = res.resText;
      if (res && res.succeed) {
        this.inqData = res.returnData;
        this.blockSelectedList = res.returnData.blocks
        if (this.inqData.project.length > 0) {
          this.inqData.project.map(pjId => {
            this.sugPicked(pjId)
          })
        }
        // console.log(this.inqData, 'INQUIRY DATA');
        this.pgMeta[breadcrumpProp.defFav] = this.inqData.fav;
      }
    },
    async getPjBlockRepo() {
      const res = await post('/sales/get_pjs_w_block_data', {})
      this.pjBlockRepo = res.returnData
    },
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.FURNITURE, DataLibType.POINTING, DataLibType.SALE_PROCESS_STATUS,
        DataLibType.HEIGHT, DataLibType.VIEW,]
      );
      this.FURNITURE = res.FURNITURE;
      this.POINTING = res.POINTING;
      this.SALE_PROCESS_STATUS = res.SALE_PROCESS_STATUS;
      this.HEIGHT = res.HEIGHT;
      this.VIEW = res.VIEW;
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
    onBlockPick(blockId) {
      if (this.blockSelectedList.includes(blockId)) {
        this.blockSelectedList.splice(this.blockSelectedList.indexOf(blockId), 1);
      } else {
        this.blockSelectedList.push(blockId);
      }

    },
    furniturePicked(fur) {
      this.inqData.furniture = fur
    },
    onFloorSelect(floor) {
      this.inqData.heights = floor
    },
    setInqRenting(renting) {
      this.inqData.rent = renting
    },
    setInqCeilingPrice(price) {
      this.inqData.ceilingPrice = price
    },
    setInqSize(size) {
      this.inqData.size = size
    },
    onViewPicked(val)
    {
      // console.log(val,'data tômghr')
      this.inqData.views=val
    },
    onBedroomUnitTypePick(pickVal) {
      if(pickVal.bedroom || pickVal.bedroom ==='')
      {
        this.inqData.bedroom = pickVal.bedroom
      }
      if(pickVal.unitType || pickVal.unitType==='')
      {
        this.inqData.unitType = pickVal.unitType
      }
    },
    async updateInqData() {
      if(!this.upLocked)
      {
        this.upLocked = true;
        const res = await post("/sales/update_u_inquiry_api", {
          id: this.inqData.id,
          note: this.inqData.note,
          moveInDay: this.inqData.moveInDay,
          ceilingPrice: this.inqData.ceilingPrice,
          furniture: this.inqData.furniture,
          heights: this.inqData.heights,
          bedroom: this.inqData.bedroom,
          balcony: this.inqData.balcony,
          size: this.inqData.size,
          project:this.inqData.project,
          blocks:this.inqData.blocks,
          unitType:this.inqData.unitType==='' ? 'ap' : this.inqData.unitType,
          views:this.inqData.views
        })
        if (!res || !res.succeed) {
          return   this.toastMsg='Cập nhật thất bại!'
        }else
        {
          this.$router.back()
        }
        this.upLocked = false;
      }

    },
  },
  watch: {
    pjSelectedList:{
      handler(newVal){
        {
          this.inqData.project=[]
          newVal.map(pjList => {
            this.inqData.project.push(pjList.id)
          })
        }
      },
      deep: true
    },
    blockSelectedList:{
      handler(newVal){
        {
          this.inqData.blocks=[]
          newVal.map(blk => {
            this.inqData.blocks.push(blk)
          })
        }
      },
      deep: true
    }

  },
  async mounted() {
    await this.getPjBlockRepo()
    await this.getDataLib();
    await this.getUIData();
  }
}
</script>

<style scoped>
</style>
