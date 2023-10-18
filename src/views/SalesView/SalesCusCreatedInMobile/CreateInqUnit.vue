<template>
    <div  class=" p-3">
      <div v-if="inqData.rent">
        <FpLabelFormTemplate :label="`Tài chính `"
                             labelClass="text-gray">
          <template #comp>
            <FpFinanceForm :rent="true"  @price="setCusPrice" :price="inqData.ceilingPrice" />
          </template>
        </FpLabelFormTemplate>
      </div>
      <div class="mt-3">
        <fpLabelFormTemplate label="Ngày dọn vào" labelClass="text-gray" v-if="inqData.rent">
          <template #comp>
            <input type="date" class="form-control border-0 border-white border py-2" v-model="inqData.moveInDay"/>
          </template>
        </fpLabelFormTemplate>
      </div>
      <div class="mt-3">
        <fpLabelFormTemplate label="View" labelClass="text-gray">
          <template #comp>
            <ViewUnitFilter class="p-3"  @viewFilter="onViewPicked" :viewProps="inqData.views"/>
          </template>
        </fpLabelFormTemplate>
      </div>
      <div class="mt-3">
        <fpLabelFormTemplate label="Chọn Hướng" labelClass="text-gray">
          <template #comp>
            <FormPickBalcony :balconyDefault="inqData.balcony" @balconyPick="onBalconyChange" :basicPointing="true"/>
          </template>
        </fpLabelFormTemplate>
      </div>
      <div class=" mt-3">
        <fpLabelFormTemplate label="Loại tầng" labelClass="text-gray">
          <template #comp>
            <FpFloorSelected @floorSelected="onFloorSelect" :unitHeight='inqData.heights'/>
          </template>
        </fpLabelFormTemplate>
      </div>
      <div class="mt-3">
        <fpLabelFormTemplate label="Diện tích tối thiểu" labelClass="text-gray">
          <template #comp>
            <FpRangeSelect class="py-2" @rangeNumbChanged="onSizeChange" :numbDefault="inqData.size"/>
          </template>
        </fpLabelFormTemplate>
      </div>
    </div>
</template>

<script>
import FpFurniturePick from "@/components/FpForm/FpFurniturePick.vue";
import FpLabelFormTemplate from "@/components/FpLayout/FpLabelFormTemplate.vue";
import FpRangeSelect from "@/components/FpRange/FpRangeSelect.vue";
import FormPickBalcony from "@/components/FpForm/FormPickBalcony.vue";
import ViewUnitFilter from "@/components/FpFilter/AgentFilter/LayoutResearch/ViewUnitFilter.vue";
import FpFloorSelected from "@/components/FpForm/FpFloorSelected.vue";
import CreateCusFinance from "@/views/SalesView/SalesCusCreatedInMobile/CreateCusFinance.vue";
import FpFinanceForm from "@/components/FpForm/FpFinanceForm.vue";
export default {
  components: {
    FpFinanceForm,
    CreateCusFinance,
    ViewUnitFilter, FormPickBalcony, FpRangeSelect, FpLabelFormTemplate, FpFurniturePick,FpFloorSelected},
  props:{
    inqData:{
      type:Object,
      default:() => {}
    }
  },
  methods:{
    onSizeChange(size) {
      this.inqData.size = size
    },
    onBalconyChange(balcony) {
      this.inqData.balcony = balcony
    },
    onViewPicked(views)
    {
      this.inqData.views=views
    },
    onFloorSelect(heights) {
      this.inqData.heights = heights
    },
    setCusPrice(val)
    {
      this.inqData.ceilingPrice=val
    }
  }

}
</script>
