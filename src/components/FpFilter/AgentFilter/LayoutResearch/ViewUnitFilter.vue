<template>
  <div class="row">
    <FpUnitViewPick :selected-one="false" :default-view="viewProps" @view-pick="onBtnVal"></FpUnitViewPick>
  </div>
</template>

<script>
import ButtonCLickFilter from "@/components/FpFilter/AgentFilter/LayoutAssessment/ButtonCLickFilter.vue";
import {contentFilter} from "@/utils/constantFilter";
import FilterUnit from "@/components/FpFilter/SalesFilter/FilterUnit.vue";
import FpUnitViewPick from "@/components/FpUnit/FpUnitViewPick.vue";
export default {
  computed: {
    contentFilter() {
      return contentFilter
    },
  },
  props:{
    viewProps:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      VIEW: [],
      viewContent:[]
    }
  },

  components: {
    ButtonCLickFilter,
    FilterUnit,
    FpUnitViewPick
  },
  methods: {
    onBtnVal(data) {
      this.$emit('viewFilter',data)
    },
  },
  emits:['viewFilter'],
  mounted() {
  },
  watch:{

  }
}
</script>

<style scoped>
.btn-view-group {
  height: 10%;
}
</style>