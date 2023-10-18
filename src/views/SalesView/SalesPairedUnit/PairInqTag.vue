<template>
  <div class="w-100">
      <div class="row p-4 px-lg-5 py-lg-3 d-flex align-items-center " style="background: #E5ECF6" >
        <div class="col cursor-pointer mt-2 mt-lg-0 first-pair-unit-tour-1" @click="!scrWdtFrom(scrWdtEnum.MD)? mbExtend=!mbExtend : ''">
          <div class="row">
            <FpUserImg :url="getUrlTypeAvtOfCusData(cusInqState.cusData).url"
                       :type="getUrlTypeAvtOfCusData(cusInqState.cusData).type"
                       :size="36" :borderRound="18" class="col-auto"/>
            <div class=" col d-flex align-items-center">
                <span :class="summedInqClass" >{{summedInqText}}</span>
            </div>
          </div>
        </div>
        <div class="col-auto d-md-flex d-none align-items-center">
            <FpPjInformationTag :bathroom="cusInqState.bathroom" :bedroom="cusInqState.bedroom"
                                :size="cusInqState.size" :furniture="cusInqState.furniture" :balcony="cusInqState.balcony"
                                :views="cusInqState.views"
                                :view-icon="true"
            ></FpPjInformationTag>
        </div>
        <div class=" col-auto d-flex justify-content-end align-items-center">
          <div class="row">
            <div class="col-auto border8 p-0  position-relative btn-svg-bg_white first-pair-unit-tour-6" @click="onCartClick">
              <FpIcon src-icon="ShoppingCart.svg" :size="24" style="margin: 4px"></FpIcon>
              <span class="position-absolute  rounded-circle card-total-number" v-if="ttCardItem>0">{{ttCardItem}}</span>
            </div>
            <div class="col-auto border8 p-0 ms-2 btn-svg-bg_white first-pair-unit-tour-5" @click="handleExtendClick">
              <FpIcon src-icon="SquaresFour.svg" :size="24" style="margin: 4px"></FpIcon>
            </div>
          </div>
        </div>

        <div class="row" v-if="mbExtend">
          <div class="col-12">
            <FpPjInformationTag :price="cusInqState.ceilingPrice"
                                :bathroom="cusInqState.bathroom" :bedroom="cusInqState.bedroom"
                                :size="cusInqState.size" :furniture="cusInqState.furniture" :balcony="cusInqState.balcony"
                                :views="cusInqState.views" :rent="cusInqState.rent"
                                :view-icon="true"
            ></FpPjInformationTag>
          </div>
          <div class="col d-flex align-items-end justify-content-end">
            <div class="border8 " style="padding:0;background: rgba(0, 0, 0, 0.05);" @click="mbExtend=false">
              <FpIcon src-icon="arrowLeft.svg" style="transform: rotate(90deg);margin: 4px" :size="20"></FpIcon>
            </div>
          </div>
        </div>
      </div>

  </div>
</template>

<script>
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";
import {getStatusTextByRent, uPriceFullPfx} from "@/utils/unit";
import FpPjInformationTag from "@/components/FpTag/FpPjInformationTag.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
export default {
  data()
  {
    return {
      mbExtend:false
    }
  },
  methods: {
    scrWdtFrom,
    uPriceFullPfx,
    getStatusTextByRent,
    getUrlTypeAvtOfCusData,
    handleExtendClick()
    {
      this.$emit('extendClick')
    },
    onCartClick()
    {
      this.$emit('cartClick')
    }
  },
  components: {FpIcon, FpPjInformationTag, FpUserImg},
  emits:['extendClick','cartClick'],
  props: {
    cusInq:{
      type:Object,
      default:() => {}
    },
    ttCardItem:{
      type:Number,
      default:0
    },
    pjName:{
      type:String,
    }
  },
  computed:{
    scrWdtEnum() {
      return scrWdtEnum
    },
    cusInqState()
    {
      return this.cusInq
    },
    summedInqText()
    {
      const price =  scrWdtFrom(scrWdtEnum.MD) ? this.cusInqState.ceilingPrice + uPriceFullPfx(this.cusInqState.rent) :''
      return `${getStatusTextByRent(this.cusInqState.rent)} ${this.pjName} ${price}`
    },
    summedInqClass()
    {
      return scrWdtFrom(scrWdtEnum.MD) ? 'font-weight-600 text-content' : 'summed-mb-size'
    }
  },



}
</script>

<style scoped>
.card-total-number {
  width: 20px;
  height: 20px;
  top: -8px;
  right: -8px;
  color: white;
  display: flex;
  justify-content: center;
  text-align: center;
  font-weight: 600;
  background: rgb(241,67,67);
}
.summed-mb-size{
  font-size: 14px;
}
.btn-svg-bg_white
{
  background: white;
}
.btn-svg-bg_white:hover
{
  background: #ebedee;
  border: 1px #dfdfdf solid;
}


</style>
