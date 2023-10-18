<template>
  <div class="unit-card mt-2" v-for="(unit,index) in unitData" :key="index">
    <div class="row h-100">

      <DuoLayout :smFirstBlock="3" :lgFirstBlock="3" :mdFirstBlock="3">

        <template #comp1>
          <LayoutProjectInformation :pjCode="fixedUnitCode(unit.block,unit.floor,unit.unit)" :pjColor="unit.pjData.projectColor"/>
        </template>

        <template #comp2>

          <DuoLayout :smFirstBlock="12" :lgFirstBlock="5" :mdFirstBlock="12">

            <template #comp1>
              <LayoutPricing :unitData="unit"/>
            </template>git
            <template #comp2>

              <DuoLayout :lgFirstBlock="7">

                <template #comp1>
                  <LayoutProjectInformationDetail :bedRoom="unit.bedroom" :size="unit.size" :bathroom="unit.bathroom"
                                                  :furniture="unit.furniture"/>
                </template>
                <template #comp2>
                  <FpText  :text="statusVal(unit.status)" classStyle="rounded-pill bg-white border mt-2 text-center text-wrap"/>
                </template>
              </DuoLayout>

            </template>

          </DuoLayout>

        </template>

      </DuoLayout>
    </div>
  </div>
</template>


<script>
import DuoLayout from "@/components/FpLayout/DuoLayout.vue";
import LayoutProjectInformation from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardLayout/LayoutProjectInformation.vue";
import LayoutPricing from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardLayout/LayoutPricing.vue";
import LayoutProjectInformationDetail
  from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardLayout/LayoutProjectInformationDetail.vue";
import FpText from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpText.vue";
import {translate,fixedUnitCode} from '@/utils/utils'
import {getCompareValue} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";

export default {
  components: {
    DuoLayout,
    LayoutProjectInformation,
    LayoutPricing,
    LayoutProjectInformationDetail,
    FpText
  },
  props: {
    unitData: {
      type: Array,
      default: () => ([])
    },
  },
  data() {
    return {
      UNIT_STATUS: []
    }
  },
  methods: {
    fixedUnitCode,
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.UNIT_STATUS]
      );
      this.UNIT_STATUS = res.UNIT_STATUS
    },
    statusVal(statusData) {
      return  translate(this.UNIT_STATUS, statusData)
    }

  },
  mounted() {
    this.getDataLib()
  }
}
</script>

<style scoped>
.unit-card {
  border-radius: 10px;
  background: #ffffff;
}
</style>