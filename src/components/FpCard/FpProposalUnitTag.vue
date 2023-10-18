<template>
    <div class="row d-flex justify-content-between" v-if="unitData">
        <div class="col-auto">
          <span :class="isSales ?'text-title font-weight-600 d-block' :'text-gray text-12'" style="order: 2;">{{unitPrice}}</span>
          <span :class="!isSales ? 'text-content font-weight-600 d-flex' :'text-gray text-12'" style="order: 1;">{{unitCode}}</span>
        </div>
        <div class="col-auto" v-if="isSales && canDirectUnitDetail">
          <FpIcon srcIcon="arrowLeft.svg" class="rotate-180" :size="16" @click="goUnitDetail"></FpIcon>
        </div>
    </div>
    <div class="row mt-2" v-if="unitData">
        <div class="col-4 px-0">
          <UnitImg :img-src="unitData?.imgs[0]?.wm_url" :tt-img="unitData?.imgs?.length" style-bottom-text="margin-bottom:40px" style-img="object-fit:cover"></UnitImg>
        </div>
        <div class="col">
            <FpPjInformationTag v-bind="getPjInformation(unitData)" :icon-size="16" :span-margin="!isSales" ></FpPjInformationTag>
          <span v-if="(unitData.view ||unitData.view2 ) " class="text-gray text-content ms-2">View:
                <span v-if="unitData.view">{{ translate(this.VIEW, unitData.view) }} </span>
                <span v-if="unitData.view2">&nbsp{{ translate(this.VIEW, unitData.view2) }}</span>
          </span>
        </div>
        <div class="row d-flex justify-content-end mt-1" v-if="!inChat">
          <button @click="onProposalUnit" class=" text-12 col-auto border8 more-btn">Đề xuất <FpIcon srcIcon="arrowLeft.svg" class="rotate-180 white-svg" :size="12"></FpIcon></button>
        </div>

    </div>
</template>

<script>
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import {getObjField, replaceCharacter, translate} from "@/utils/utils";
import FpPjInformationTag from "@/components/FpTag/FpPjInformationTag.vue";
import UnitpairArchived from "@/views/SalesView/SalesPairedUnit/UnitpairArchived.vue";
import {VIEW} from "@/utils/TransContent";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {getPjDistrict, unitPrice, unitPriceTextExt} from "@/utils/unit";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";

export default {
  components: {FpIcon, UnitpairArchived, FpPjInformationTag, UnitImg},
  data()
  {
    return {
      VIEW
    }
  },
  props:{
    unitData:{
      type:Object,
      default:() => {}
    },
    renting:{
      type:Boolean
    },
    inChat:{
      type:Boolean,
      default:false
    },
    isSales:{
      type:Boolean
    },
    canDirectUnitDetail:{
      type:Boolean,
      default:true
    }
  },
  computed:{
    unit(){
      return this.unitData
    },
    unitPrice()
    {
      return convertVndToUserCurrency(unitPrice(this.renting, this.unit),this.renting,UnitCurrency.extend)
      // return unitPriceTextExt(this.renting,this.unit)
    },
    unitCode()
    {
      return this.isSales ? getPjDistrict(this.unitData.pjData) : this.unitData?.unit_code
    },

  },
  methods:{
    getPjDistrict,
    translate,
    getPjInformation(data) {
      return {
        id: getObjField(data, 'id'),
        bedroom: getObjField(data, 'bedroom'),
        bathroom: getObjField(data, 'bathroom'),
        size: getObjField(data, 'size'),
        furniture: getObjField(data, 'furniture'),
        balcony: getObjField(data, 'balcony'),
        managementCoverage: getObjField(data, 'managementCoverage'),
        block: getObjField(data, 'block'),
        height:getObjField(data, 'height'),
      }
    },
    onProposalUnit()
    {
       this.$emit('proposalUnit', this.unitData.id)
    },
    goUnitDetail()
    {
      this.$router.push(
          {
            name:'Sales Unit Detail',
            params: {
              pjName:replaceCharacter(this.unitData?.pjData?.name,' ','-'),
              unitID: parseInt(this.unitData.id),
              renting: this.renting ? 'thue' : 'ban'
            }
          }
      )
    }

  },
  emits:['proposalUnit']

}
</script>

<style scoped>
.padding-content .pj-information span{
  margin: 0.2rem !important;
}
</style>
