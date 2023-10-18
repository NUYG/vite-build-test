<template>
  <FpDefLayout>
    <template #comp>

      <MultiTab :tab-header="tabHeaders">
        <template #comp0>
          <AdmHrTele/>
        </template>

        <template #comp1>
          <AdmHrAgent/>
        </template>

        <template #comp2>
          <AdmHrAAS/>
        </template>

        <template #comp3>
          <AdmHrSales/>
        </template>
      </MultiTab>

    </template>
  </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import MultiTab from "@/components/FpLayout/MultiTab.vue";
import AdmHrTele from "@/views/AdminView/AdmHRView/AdmHrTele.vue";
import AdmHrAgent from "@/views/AdminView/AdmHRView/AdmHrAgent.vue";
import AdmHrAAS from "@/views/AdminView/AdmHRView/AdmHrAAS.vue";
import AdmHrSales from "@/views/AdminView/AdmHRView/AdmHrSales.vue";

export default {
  components: {
    FpDefLayout,
    AdmHrTele,
    AdmHrAgent,
    AdmHrAAS,
    AdmHrSales,
    MultiTab,
  },
  data() {
    return {
      tabHeaders: [
        'Tele', 'Agent', 'Agent Assistant', 'Sales'
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
