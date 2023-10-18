<template>
  <div :class="groupClass">
    <FilterLayout :labelContent="labelContent" :canExt="canExt"
                  :labelClasses="labelClass" layoutClass="d-flex justify-content-between pe-2"
                  :arrowGray="false" :icon-size="24" :extending="false">
      <template #filterContent>
        <input v-if="status==='text'" class="form-control mt-2" v-model="value"/>
        <input type="number" v-if="status==='number'" class="form-control mt-2" v-model="value" pattern="\d*">
        <input v-if="status==='day'"  type="date" class="form-control border-0 border-white border" v-model="value">
        <FormPick v-if="status==='bedroom' || status==='bathroom'" class="mt-2"  :pickDefault="value"
                  :optionsVal="optionVal"  @optVal="onValChange" :border-box="true" boxClass="" groupBtnClass="p-3"
        />
        <FpRangeSelect v-if="status==='size'" @rangeNumbChanged="onValChange" :numbDefault="value"></FpRangeSelect>
        <FpFurniturePick  :fullFur="value==='fully'" v-if="status==='furniture'" @furniturePick="onValChange"></FpFurniturePick>
        <div v-if="status==='balcony'" class="p-3 border rounded">
          <FormPickBalcony :balconyDefault="value" @balconyPick="onValChange"></FormPickBalcony>
        </div>
      </template>
    </FilterLayout>
  </div>


</template>

<script>

import FilterLayout from "@/components/FpFilter/SalesFilter/FilterLayout.vue";
import FormPick from "@/components/FpForm/FormPick.vue";
import {BathroomVal, BedroomVal} from "@/utils/dataLib";
import FpRangeSelect from "@/components/FpRange/FpRangeSelect.vue";
import FpFurniturePick from "@/components/FpForm/FpFurniturePick.vue";
import SPNewItems from "@/components/FpSaleProcess/SPNewItems.vue";
import FormAddNegotiate from "@/components/FpForm/FormAddNegotiate.vue";
import FpCheckboxField from "@/components/FpForm/FpCheckboxField.vue";
import FormPickBalcony from "@/components/FpForm/FormPickBalcony.vue";

export default {
  components: {
    FormPickBalcony,
    FpCheckboxField,
    FormAddNegotiate,
    FpFurniturePick,
    FpRangeSelect,
    FilterLayout,
    FormPick,
    SPNewItems
  },
  data()
  {
    return {
      value:'',
      selectedItems:['Bao sổ']
    }
  },
  computed:
  {
    optionVal()
    {
      if(this.status==='bedroom')
      {
        return BedroomVal
      }
      else if(this.status==='bathroom')
      {
        return BathroomVal
      }
      return []
    },
  },
  methods:{
    onValChange(val)
    {
      this.value=val
    },
  },
  props:{
    id:{
      type:String,
    },
    status:{
      type:String
    },
    labelContent:{
      type:String
    },
    canExt:{
      type:Boolean,
      default:true
    },
    defaultVal:{
      type:[String,Number,Boolean]
    },
    labelClass:{
      type:String
    },
    groupClass:{
      type:String
    },
    rent:{
      type:Boolean,
      default:false
    },
    selectedValue:{
      type:Array,
      default:() => []
    },
  },
  mounted() {
    if(this.defaultVal)
    {
      this.value=this.defaultVal
    }
  },
  emits:['formFieldData'],
  watch:{
    defaultVal(newVal)
    {
      this.value=newVal
    },
    value(newVal)
    {
        this.$emit('formFieldData',this.id,newVal)
    },
  }
}
</script>