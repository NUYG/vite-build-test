<template>
  <FpDefLayout>
    <template #comp>

      <MultiTab :tab-header="tabHeaders">
        <template #comp0>
          <AdmCSAgent/>
        </template>

        <template #comp1>
          <AdmCSAAS/>
        </template>

        <template #comp2>
          <AdmCSTele/>
        </template>

        <template #comp3>
          <AdmCSRestock/>
        </template>
      </MultiTab>

    </template>
  </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import MultiTab from "@/components/FpLayout/MultiTab.vue";
import AdmCSTele from "@/views/AdminView/AdmCallStatsView/AdmCSTele.vue";
import AdmCSAAS from "@/views/AdminView/AdmCallStatsView/AdmCSAAS.vue";
import AdmCSAgent from "@/views/AdminView/AdmCallStatsView/AdmCSAgent.vue";
import AdmCSRestock from "@/views/AdminView/AdmCallStatsView/AdmCSRestock.vue";

export default {
  components: {
    FpDefLayout,
    AdmCSTele,
    AdmCSAAS,
    AdmCSAgent,
    MultiTab,
    AdmCSRestock,
  },
  data() {
    return {
      tabHeaders: [
        'Agent', 'Agent Assistant', 'Tele', 'Restock'
      ]
    }
  },
  computed: {},
  methods: {},
  watch: {},
  mounted() {
  }
}
</script>

<style scoped>
</style>
