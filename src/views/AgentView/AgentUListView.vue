<template>
   <div>
      <AgentUnitTab @unit-clicked="unitClicked"
                    v-for="(unit,index) in units"
                    :key="index"
                    :unit="unit"
                    :POINTING="POINTING"
                    :FURNITURE="FURNITURE"
                    :UNIT_STATUS="UNIT_STATUS"
                    :VIEW="VIEW"
                    :page="page"/>
   </div>
</template>


<script>
import AgentUnitTab from "@/views/AgentView/AgentTab/AgentUnitTab.vue";
import {getCompareValue} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";

export default {
   data() {
      return {
         POINTING: "",
         FURNITURE: "",
         UNIT_STATUS: "",
         VIEW: "",
         currentUnit: false,
      };
   },
   computed: {},
   methods: {
      async getDataLib() {
         const res = await getCompareValue([
            DataLibType.POINTING, DataLibType.UNIT_STATUS,
            DataLibType.VIEW, DataLibType.FURNITURE]
         );
         this.POINTING = res.POINTING;
         this.UNIT_STATUS = res.UNIT_STATUS;
         this.FURNITURE = res.FURNITURE;
         this.VIEW = res.VIEW;
      },
      unitClicked(unit) {
         this.currentUnit = unit;
         this.$emit("unit-tab-clicked", unit);
      },
   },
   props: {
      units: {
         type: Object,
         default: () => {
         },
      },
      page: {
         type: String,
         default: "",
      },
   },
   emits: ["unit-tab-clicked"],
   components: {
      AgentUnitTab,
   },
   mounted() {
      this.getDataLib();
   },
}
</script>