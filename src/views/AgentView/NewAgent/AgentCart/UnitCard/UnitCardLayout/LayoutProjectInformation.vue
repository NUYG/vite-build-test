<template>
  <DuoLayout :lgFirstBlock="2" :mdFirstBlock="2" :smFirstBlock="2" class="h-100">
    <template #comp1>
      <UnitProjectTag :tagColor="pjColor" :tagWidth="5" :borderStyle="{'borderRadius':'10px 0px 0px 10px'}"/>
    </template>
    <template #comp2>
      <DuoLayout :lgFirstBlock="2" :mdFirstBlock="2" :smFirstBlock="2" class="h-100">
        <template #comp1>
          <FpDot :dotSize="8" classStyle="mt-lg-3 mt-4" :borderStyle="{'border':'2px solid rgb(153, 153, 153)'}"/>
        </template>
        <template #comp2>
          <FpText tag="h6" :text="pjCode" classStyle="mt-lg-2 mt-3"/>
        </template>
      </DuoLayout>
    </template>
  </DuoLayout>
</template>

<script>
import DuoLayout from "@/components/FpLayout/DuoLayout.vue";
import UnitProjectTag from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/UnitProjectTag.vue";
import FpDot from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpDot.vue";
import FpText from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpText.vue";

export default {
  components: {
    DuoLayout,
    UnitProjectTag,
    FpDot,
    FpText
  },
  props:{
    pjColor:{
      type:String,
      default:''
    },
    pjCode:{
      type:String,
      default:''
    }

  }
}

</script>