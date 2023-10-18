<template>
  <FpDefLayout :bc-props="breadCrumbSetting">
    <template #comp>
        <AgentPjManagement/>
    </template>
  </FpDefLayout>
</template>
<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import AgentPjManagement from "@/views/AgentView/AgentProject/Project/AgentPjManagement.vue";
import {breadcrumpProp} from "@/models/customProp";

export default {
  components: {
    FpDefLayout,
    AgentPjManagement
  },
  data()
  {
    return{
      breadCrumbSetting: {
        [breadcrumpProp.title]: 'Thông tin dự án',
      },
    }
  }
}
</script>