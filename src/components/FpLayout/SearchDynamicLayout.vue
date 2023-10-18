<template>
    <div :class="layoutClass">
      <div class="col" :class="(searching ? 'mt-2 mt-lg-0' : 'mt-0')">
        <FpFormSearch  :inputStyle="inputSearchStyle"
                       :realTimeSearch="true" :placeholderInput="placeholderInput" @search-cancel="cancelPopup"
                       @click="searchExt=true ; searching=true" @searchVal="onSearch" ref="formSearch"/>
      </div>
      <div v-if="searchExt" :class="searchExtClass">
          <slot name="sugData"></slot>
      </div>
    </div>
</template>

<script>
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {getIconUrl} from "@/utils/utils";
import FpFormSearch from "@/components/FpForm/FpFormSearch.vue";
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import { scrWdtEnum, scrWdtFrom, scrWdtTo} from "@/utils/windowWidth";
export default {
  components: {
    FpFormSearch,
    ButtonView,
    FpUserImg
  },
  data()
  {
    return {
      searchExt:false,
      searching:false,
    }
  },
  computed:{
    layoutClass()
    {
     return  scrWdtTo(scrWdtEnum.MD)&&this.searching ? 'right-panel' : 'position-relative'
    },
    searchExtClass()
    {
      return scrWdtFrom(scrWdtEnum.MD) && this.searchExt ? 'isPopup' : ''
    }
  },
  watch:{
    searchExt(newVal)
    {
      this.$emit('searchExt',newVal)
    }
  },
  methods: {
    getIconUrl,
    onSearch(val)
    {
      this.$emit('searchVal',val)
    },
    cancelPopup()
    {
      this.searching=false
      this.searchExt=false
      this.$refs.formSearch.clearSearch()
    }
  },
  emits:['searchVal','searchExt'],
  props:{
    inputSearchStyle: {
      type: String,
    },
    placeholderInput:{
      type:String,
      default:'Tìm khách hàng'
    },
    defaultVal:{
      type:String,
    }
  }
}
</script>

<style scoped>
.isPopup
{
  z-index: 100;
  background-color: white;
  position: absolute;
  width: 100%;
  box-shadow: 0 6px 17px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
}
</style>