<template>
  <FpDefLayout>
    <template #comp>

      <MultiTab :tab-header="tabHeaders">
        <template #comp0>
          <AdmRequestDetail/>
        </template>
      </MultiTab>

    </template>
  </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import MultiTab from "@/components/FpLayout/MultiTab.vue";
import AdmRequestDetail from "@/views/AdminView/AdmRequestView/AdmRequestDetail.vue";

export default {
  components: {
    FpDefLayout,
    AdmRequestDetail,
    MultiTab,
  },
  data() {
    return {
      tabHeaders: [
        'Quản lý'
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
