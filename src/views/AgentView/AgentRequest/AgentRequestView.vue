<template>
  <FpDefLayout>
    <template #comp>
      <AgentRequest/>
    </template>
  </FpDefLayout>
</template>

<script>
import AgentRequest from "@/views/AgentView/AgentRequest/AgentRequest.vue";
import FpDefLayout from "@/views/FpDefLayout.vue";
export default {
  components:{
    FpDefLayout,
    AgentRequest
  }
}
</script>