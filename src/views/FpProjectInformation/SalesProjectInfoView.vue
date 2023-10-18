<template>
  <FpDefLayout :is-loading="!finishLoading" :show-loading="true">
    <template #comp>
      <div class="container-fluid">
        <div class="d-flex justify-content-center row">
          <div class="col-lg-6 col-xxl-5 col-12 ">
            <div class="row pe-0 position-relative">
              <UnitImg :img-src="pjBlockData?.avtData?.imgUrl" :ratio-img="[3,2]" :bottomTag="false"></UnitImg>
              <div class="position-absolute bottom-0 justify-content-center d-flex">
                <div class="bg-white col-6 d-flex align-items-center justify-content-center"
                     style="border-radius: 8px 8px 0 0;">
                  <span class="py-1 text-title more-color font-weight-600">Thông tin dự án</span>
                </div>
              </div>
            </div>
            <div class="row d-flex justify-content-around mt-4">
              <ButtonView v-for="(content,index) in tabContentBtn "
                          :key="index" :content="content" @click="tabActive=index"
                          :text-size="14" class="col-auto"
                          :status="tabActive===index ? 'more-btn' : 'gray-btn'"
              ></ButtonView>

            </div>
            <div class="mt-3 row d-flex align-items-center">
              <span class="col-auto font-weight-600  ps-4" style="font-size: 24px">{{ pjBlockData?.name }} </span>
              <!--              <FpIcon src-icon="Info.svg" :size="32" class="col-auto p-0"></FpIcon>-->
              <p class="text-gray  text-sm-12 ps-4">{{ pjBlockData.address }}</p>
            </div>
            <div class="container-fluid" v-show="tabActive===0">
              <div>
                <br>Mã dự án: {{ validateValue(pjBlockData.code, blankInfoText) }}
                <br>Chủ đầu tư: {{ validateValue(pjBlockData?.investor, blankInfoText) }}
                <br>Diện tích: {{ validateValue(pjBlockData?.size, blankInfoText, ' m²') }}
                <br>Mật độ xây dựng: {{ validateValue(pjBlockData?.density, blankInfoText, '%') }}
                <br>Tổng số căn: {{ validateValue(pjBlockData?.units_count, blankInfoText) }}
                <br>Số tầng: {{ validateValue(pjBlockData?.level, blankInfoText) }}
                <br>Số block: {{ validateValue(pjBlockData?.blkData?.length, blankInfoText) }}
                <br>Tình trạng sổ: {{ getPjHocSts(pjBlockData?.hoc_status) }}
                <br>Ngày làm sổ: {{ validateValue(ddMmYyyy(pjBlockData?.hoc_date), blankInfoText) }}
                <br>Pháp lý: {{ translate(OWN_DUR_STATUS, pjBlockData?.own_dur) }}
                <br>Nhà thầu internet: {{
                  validateValue(getProjectInternet(pjBlockData?.internetData), blankInfoText)
                }}
              </div>
              <FilterLayout label-content="Các loại phí" label-classes="text-content"
                            layout-class="d-flex align-items-center">
                <template #filterContent>
                  <div v-for="(value,key,index) in pjBlockData?.feesData" :key="index" class="mt-2 ps-2">
                    <span v-if="key==='mgmt'">{{ translate(FEES_DATA_STATUS, 'mgmt') }} : {{ value }} ngàn/m²</span>
                    <span v-if="key==='elec'">{{ translate(FEES_DATA_STATUS, 'elec') }} : {{ value }}k /kWh</span>
                    <span v-if="key==='water'">{{ translate(FEES_DATA_STATUS, 'water') }} : {{ value }}k /khối</span>
                    <span
                        v-if="key!=='id' && key!=='elec' && key!=='water' && key!=='mgmt'">{{
                        translate(FEES_DATA_STATUS, key)
                      }} : {{ value }} K/tháng</span>
                  </div>
                </template>
              </FilterLayout>
            </div>
            <div v-show="tabActive===1" class="container-fluid">
              <p class="font-weight-600 text-content">Mặt bằng tầng dự án</p>
              <div v-for="(mpData,index) in pjBlockData.blkData" :key="index" class="row mt-3">
                <FilterLayout :can-ext="true" :icon-size="20" :label-content="`Block ${mpData.name}`" :extending="true">
                  <template #filterContent>
                    <div class="border8 mt-2  w-100 p-0">
                      <FpSwipeProjectBlock :blockData="mpData">
                      </FpSwipeProjectBlock>
                    </div>
                  </template>
                </FilterLayout>
              </div>
            </div>
            <div v-show="tabActive===2" class="mt-2">
              <table class="table" v-if="Object.keys(avgPriceData).length">
                <tr>
                  <th class="col-5"></th>
                  <th scope="col" class="font-weight-600">Thuê (Tr)</th>
                  <th scope="col" class="font-weight-600">Bán (Tỷ)</th>
                </tr>
                <template v-for="(value,key,index) in avgPriceData" :key="index">
                  <tr :class="{'border-top':index>0}">
                    <th class="font-weight-600 col-5">{{ key }} phòng ngủ</th>
                  </tr>
                  <tr>
                    <th class="col-5">Nội thất cơ bản</th>
                    <td class="font-weight-600">
                      {{ (filterPrice(filterFurniture(avgPriceData[index + 1]).partly).rentingData).join(' - ') }}
                    </td>
                    <td class="font-weight-600">
                      {{ (filterPrice(filterFurniture(avgPriceData[index + 1]).partly).sellingData).join(' - ') }}
                    </td>

                  </tr>
                  <tr >
                    <th class="col-5">Full nội thất</th>
                    <td class="font-weight-600 ">

                      {{ (filterPrice(filterFurniture(avgPriceData[index + 1]).fully).rentingData).join(' - ') }}
                    </td>
                    <td class="font-weight-600">
                      {{ (filterPrice(filterFurniture(avgPriceData[index + 1]).fully).sellingData).join(' - ') }}
                    </td>
                  </tr>
                </template>
              </table>
              <span v-else class="fst-italic text-gray text-center">Chưa có thông tin</span>
            </div>
            <div v-show="tabActive===3" >
                <FpGoogleMap :location="pjBlockData?.address"></FpGoogleMap>
            </div>
          </div>
        </div>
      </div>
    </template>
  </FpDefLayout>
</template>

<script>
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import {IMG_URL} from "@/utils/constants";
import FpDefLayout from "@/views/FpDefLayout.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpFormExt from "@/components/FpForm/FpFormExt.vue";
import FilterLayout from "@/components/FpFilter/SalesFilter/FilterLayout.vue";
import FpSwipeProjectBlock from "@/components/FpImg/FpSwipeProjectBlock.vue";
import {post} from "@/utils/dataQuery";
import {getPjHocSts} from "@/utils/TransContent";
import {ddMmYyyy, getDdMm} from "@/utils/dateTimeUtils";
import {FEES_DATA_STATUS, getProjectInternet, OWN_DUR_STATUS, validateValue} from "@/models/pj";
import {findProjectIdByName, floatFixed, replaceCharacter, translate} from "@/utils/utils";
import {breadcrumpProp, defLayoutBehaType} from "@/models/customProp";
import {object} from "yup";
import FpGoogleMap from "@/components/FpMap/FpGoogleMap.vue";
import {mapGetters} from "vuex";

export default {
  components: {FpGoogleMap, FpSwipeProjectBlock, FilterLayout, FpFormExt, FpIcon, ButtonView, FpDefLayout, UnitImg},
  data() {
    return {
      tabActive: 0,
      pjBlockData: [],
      blockActiveExt: 0,
      OWN_DUR_STATUS,
      FEES_DATA_STATUS,
      avgPriceData: {},
      rentingPriceShow: true,
      finishLoading:false,
      blankInfoText:'Đang cập nhật',
      tabContentBtn:['Tổng quan','Mặt bằng tầng','Giá trung bình','Vị trí']
    }
  },
  computed:{
    ...mapGetters(['getPjLibData']),
    getPjName()
    {
      return replaceCharacter(this.$route?.params?.pjName,'-',' ')
    },
    pjID()
    {
      return findProjectIdByName(this.getPjName,this.getPjLibData)
    }
  },
  methods: {
    object,
    floatFixed,
    translate,
    validateValue,
    ddMmYyyy,
    getProjectInternet,
    getDdMm,
    getPjHocSts,
    IMG_URL() {
      return IMG_URL
    },
    async getDataPjBlock() {
      const res = await post('/sales/get_pj_block_masterplan_data', {
        id: this.pjID
      })
      this.pjBlockData = res.returnData
      this.finishLoading=true
    },
    formatNumber(number) {
      let formattedNumber
      const numStr = number.toString();
      if (numStr.length > 3) {
        const integerPart = numStr.slice(0, -3);
        const decimalPart = numStr.slice(-3);
        formattedNumber = integerPart + "." + decimalPart;
      } else {
        formattedNumber = numStr;
      }
      return formattedNumber;
    },
    async getAvgPjPrice() {
      const res = await post('/project/get_pj_avg_prices', {id: this.pjID})
      this.avgPriceData = res.returnData
    },
    // return price by status renting or selling with props furniture
    filterPrice(data) {
      const rentingData = []
      const sellingData = []
      data?.map(status => {
        const rentingStatus = status[0].split('_', -1)
        if (rentingStatus[2] === 'r') {
          rentingData.push(status[1])
        } else {
          sellingData.push(status[1])
        }
      })
      return {
        sellingData: sellingData,
        rentingData: rentingData
      }
    },
    filterFurniture(data) {
      const fully = [];
      const partly = [];

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          const clearDash = key.split('_', -1);
          if (clearDash[1] === 'p') {
            if(value>0)
            {
              partly.push([key, floatFixed(value)]);
            }
          } else {
            if(value>0)
            {
            fully.push([key, floatFixed(value)]);
            }
          }
        }
      }
      return {fully: fully, partly: partly};
    },
  },
  mounted() {
    this.getDataPjBlock()
    this.getAvgPjPrice()
  },
}
</script>


<style scoped>
.swiper-button-next::after,
.swiper-button-prev::after {
  color: black !important;
}

</style>
