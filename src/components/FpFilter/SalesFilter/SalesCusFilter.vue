<template>
  <div :class="layoutStyle">
    <div class="row position-relative mt-3 mt-lg-0" :class="representObjectClass">
      <div class="col" v-if="inputSearch">
        <FpFormSearch :realTimeSearch="realTimeSearch" :placeholderInput="searchPlaceholder" @click="onExtMobile"
                      @searchVal="onSearch"/>
      </div>
      <slot name="customArea">
      </slot>
      <div class="col-auto">
        <div class="row">
          <div class="col-auto px-1" @click="onExtSearch">
            <ButtonView :squarePadding="true" :btnIcon="getIconUrl('search-extend.svg')" :iconSize="24"
                        status="gray-btn" :activeBtn="filtering" onBtnColor="orange"/>
          </div>
          <div class="col-auto new-sales-step-2" v-if="createCusIcon">
            <ButtonView :squarePadding="true" @click="$router.push(S_CREATE_CUS_URL())" content="Tạo" :text-size="14"
                        :btnIcon="getIconUrl('UserCirclePlus.svg')" :iconSize="24" status="gray-btn"/>
          </div>
        </div>
      </div>
    </div>
    <div v-if="searchExt" :class="extBoxStyle">
      <div v-if="cusStatusPick" class="d-flex d-lg-none justify-content-around text-content mt-3"
           style="font-weight: 600;">
        <span @click="active=true" class="col-auto cursor-pointer"
              :class="{'current-process_status':active}">Đang Chăm</span>
        <span @click="active=false" class="col-auto cursor-pointer" :class="{'current-process_status':active===false}">Khách cũ</span>
      </div>
      <div class="mt-2 h-75 h-lg-auto">
        <div class="row">
          <div class="col-auto d-inline-block d-md-none" v-if="rentingPick">
            <FilterUnit
               :btnValueProps="contentFilter[rentPick[0].fieldName]" :fieldName="rentPick[0].fieldName"
               :defVal="rentingStatus"
               :extend="rentPick[0].extent" class="text-content" @unitPickedFilter="onPickedFilter">
            </FilterUnit>
          </div>
          <div class="col mt-2 col-12" :class="{'col-lg-6':rentingPick}" v-if="canSearchPj">
            <ProjectSelected :projectsPick="pjPick" @projectSelected="onPjPick" class="col-12"
                             defaultData="Tất cả dự án"/>
          </div>
        </div>
        <div class="mt-2">
          <FilterLayout v-for="(field,index) in listFieldSelect" :key="index"
                        :labelContent="field.label" :fontWLabel="700" :canExt="field.canExt"
                        labelClasses='pe-0' layoutClass="mt-4"
                        :extending="checkValidValue(extendFilterData[field.fieldName])">
            <template #filterContent>
              <FilterUnit
                 :btnValueProps="contentFilter[field.fieldName]" :fieldName="field.fieldName"
                 :defVal="extendFilterData[field.fieldName]"
                 :extend="field.extent" class="text-content" @unitPickedFilter="onPickedFilter"
                 :selectedOne="field.selectedOne">
              </FilterUnit>
            </template>
          </FilterLayout>
        </div>
      </div>
      <div class="row mt-3 p-3 " v-if="searchExt && isPC">
        <ButtonView @btnClick="onClearFilter" :btnIcon="getIconUrl('return.svg')" :iconSize="20" status="gray-btn"
                    class="col-auto"></ButtonView>
        <ButtonView content="Hoàn thành" status="gray-btn" class="col ms-4" @btnClick="onFilterSubmit"></ButtonView>
      </div>
    </div>
    <div class="row mt-3 p-3 " v-if="searchExt && !isPC">
      <ButtonView @btnClick="onClearFilter" :btnIcon="getIconUrl('return.svg')" :iconSize="20" status="gray-btn"
                  class="col-auto"></ButtonView>
      <ButtonView content="Lọc" status="gray-btn" class="col ms-4" @btnClick="onFilterSubmit"></ButtonView>
    </div>
  </div>

</template>


<script>
import FpFormSearch from "@/components/FpForm/FpFormSearch.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {checkValidValue, getIconUrl} from "@/utils/utils";
import FpIconRotate from "@/components/FpIcon/FpIconRotate.vue";
import RentingStatusFilter from "@/components/FpFilter/SalesFilter/FilterUnit.vue";
import FilterLayout from "@/components/FpFilter/SalesFilter/FilterLayout.vue";
import FilterUnit from "@/components/FpFilter/SalesFilter/FilterUnit.vue";
import {contentFilter} from "@/utils/constantFilter";
import PjPick from "@/views/TeleView/PjPick.vue";
import ProjectSelected from "@/components/FpFilter/AgentFilter/LayoutResidence/ProjectSelected.vue";
import {scrWdtEnum, scrWdtFrom, scrWdtTo} from "@/utils/windowWidth";
import {S_CREATE_CUS_URL} from "@/router/URLs";

export default {
  props: {
    filtering: {
      type: Boolean
    },
    extendFilterData: {
      type: Object,
      default: () => {}
    },
    createCusIcon: {
      type: Boolean,
      default: true
    },
    searchPlaceholder: {
      type: String,
      default: 'Tìm khách hàng'
    },
    rentingPick: {
      type: Boolean,
      default: true
    },
    cusStatusPick: {
      type: Boolean,
      default: true
    },
    projectPick: {
      type: [Number, String]
    },
    realTimeSearch: {
      type: Boolean,
      default: true
    },
    unitRenting: {
      type: Boolean,
    },
    setExtSearch: {
      type: Boolean
    },
    canSearchPj: {
      type: Boolean,
      default: true
    },
    inputSearch: {
      type: Boolean,
      default: true
    },
    extendBoxClass: {
      type: String,
      default: 'w-100'
    },
    representObjectClass: {
      type: String
    },
    activeProps: {
      type: Boolean
    }
  },
  computed: {
    isPC() {
      return scrWdtFrom(scrWdtEnum.MD);
    },
    contentFilter() {
      return contentFilter
    },
    extBoxStyle() {
      return scrWdtFrom(scrWdtEnum.LG) ? `extBox ${this.extendBoxClass}` : `extBoxMobile ${this.extendBoxClass}`
    },
    layoutStyle() {
      if (this.searchExt && scrWdtTo(scrWdtEnum.LG)) {
        return 'right-panel'
      }
      return ''
    },
    rentingStatus() {
      if (this.extendFilterData.rent || this.unitRenting) {
        return 'rent'
      } else if (this.extendFilterData.rent === false || !this.unitRenting) {
        return 'buy'
      }
      return ''
    }
  },
  data() {
    return {
      rentPick: [{label: '', fieldName: 'rent', extent: false, canExt: false}],
      listFieldSelect: [
        {label: 'Nội thất', fieldName: 'furniture', extent: false,},
        {label: 'Phòng ngủ', fieldName: 'bedroom', extent: false},
        {label: 'View', fieldName: 'views', extent: false, selectedOne: false},
        {label: 'Hướng ban công', fieldName: 'balconies', extent: false, selectedOne: false},
          {label: 'Xem nhà dễ / Nhà trống', fieldName: 'availableIn', extent: false, selectedOne: true},
        {label: 'Khác', fieldName: 'unitType', extent: false}],
      active: true,
      searchExt: false,
      search: '',
      pjPick: ''
    }
  },
  methods: {
    checkValidValue,
    S_CREATE_CUS_URL() {
      return S_CREATE_CUS_URL
    },
    getIconUrl,
    onPickedFilter(val, fieldName) {
      this.$emit('cusFilter', fieldName, val)
    },
    onPjPick(val) {
      this.$emit('cusFilter', 'project', val.pj_id)
    },
    onFilterSubmit() {
      this.searchExt = false
      this.$emit('submitFilter')
    },
    onSearch(val) {
      this.$emit('cusFilter', 'search', val)
      this.onFilterSubmit()
    },
    onExtMobile() {
      if (scrWdtTo(scrWdtEnum.LG)) {
        this.searchExt = true
      }
      this.$emit('searchExtending', this.searchExt)
    },
    onClearFilter() {
      this.$emit('resetFilter')
    },
    onExtSearch() {
      this.searchExt = !this.searchExt
      this.$emit('searchExtending', this.searchExt)
    }
  },
  emits: ['cusFilter', 'resetFilter', 'submitFilter', 'searchExtending'],
  watch: {
    active(newVal) {
      this.$emit('cusFilter', 'active', newVal)
    },
    projectPick(newVal) {
      this.pjPick = newVal
    },
    setExtSearch(newVal) {
      this.searchExt = newVal
    },
  },
  mounted() {
    this.pjPick = this.projectPick
    this.active = this.activeProps
  },
  components: {
    ProjectSelected,
    PjPick,
    FilterUnit,
    FilterLayout,
    FpIcon,
    FpFormSearch,
    ButtonView,
    FpIconRotate,
    RentingStatusFilter
  }
}
</script>

<style scoped>
.form-gray select {
  background-color: #ebedee !important;
}

.extBox {
  z-index: 100;
  box-shadow: 0 6px 17px rgba(0, 0, 0, 0.25);
  position: absolute;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
}

.extBoxMobile {
  height: 50vh;
  overflow: scroll;
  padding: 1rem;
}

</style>
