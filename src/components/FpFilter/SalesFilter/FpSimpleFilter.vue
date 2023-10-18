<template>
  <FpDropDown :box-shadow="true" :show-dropdown-icon="false" v-for="(item,index) in filterBtn" :key="index" :id="index" class="col-auto" :class="dropdownBoxClass">
      <template #modalClick>
        <ButtonView :content="item.content" status="gray-btn" :text-size="12" class="py-1">
          <template #btnExt>
            <FpIconRotate :srcIcon="arrowIcon" :size='24' class="p-0 rotate90" ></FpIconRotate>
          </template>
        </ButtonView>
      </template>
      <template #dropContent>
        <div v-if="item.name==='price'" style="min-width: auto">
          <PriceSimpleFilter  @fast-pick-price="onPickedPrice" :renting="renting"></PriceSimpleFilter>
        </div>
        <div class="py-2 col-auto d-flex align-items-center justify-content-center">
          <FilterUnit
              :btnValueProps="contentFilter[item.name]" :fieldName="item.name" :btn-class="item.btnClass"
              class="text-content" @unitPickedFilter="onPickedFilter" :defVal="defaultFilterData[item.name]">
          </FilterUnit>
        </div>

      </template>
  </FpDropDown>
</template>

<script>
import FilterLayout from "@/components/FpFilter/SalesFilter/FilterLayout.vue";
import FpDropDown from "@/components/FpPopup/FpDropDown.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import FpIconRotate from "@/components/FpIcon/FpIconRotate.vue";
import FilterUnit from "@/components/FpFilter/SalesFilter/FilterUnit.vue";
import {contentFilter} from "@/utils/constantFilter";
import FpRangeSelect from "@/components/FpRange/FpRangeSelect.vue";
import FpPriceRange from "@/components/FpRange/FpPriceRange.vue";
import PriceSimpleFilter from "@/components/FpFilter/SalesFilter/PriceSimpleFilter.vue";
export default {
  components: {
    PriceSimpleFilter,
    FpPriceRange, FpRangeSelect, FilterUnit, FpIconRotate, FpDropDown, FilterLayout,ButtonView},
  props:{
    defaultFilterData:{
      type:Object,
      default:() => {}
    },
    renting:{
      type:Boolean,
    },
    dropdownBoxClass:String
  },
  data()
  {
    return {
      filterBtn:[
        {name:'bedroom',content:'Số phòng ngủ',btnClass:'col-3 m-1 ms-2'},
        {name:'furniture',content:'Nội thất',btnClass:'col-10 mt-2 mx-auto'},
        {name:'price',content:'Giá'}]
    }
  },
  emits:['furBedroomFilter','submitFilter'],
  methods:{
    onPickedFilter(value,field)
    {
      this.$emit('furBedroomFilter',field,value)
      this.$emit('submitFilter')
    },
    onPickedPrice(value)
    {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          const field = key;
          const fieldValue = value[key];
          this.onPickedFilter(fieldValue, field);
        }
      }
    }
  },
  computed:{
    contentFilter() {
      return contentFilter
    },
    arrowIcon()
    {
      return this.arrowGray ? 'chevron-right-solid.svg': 'chevron-right.svg'
    }
  }
}
</script>
