<template>
  <FpDefLayout>
    <template #comp>

      <MultiTab :tab-header="tabHeaders">
        <template #comp0>
          <AdmRefDetail/>
        </template>
        <template #comp1>
          <AdmUserStats/>
        </template>
      </MultiTab>

    </template>
  </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import MultiTab from "@/components/FpLayout/MultiTab.vue";
import AdmRefDetail from "@/views/AdminView/AdmRefView/AdmRefDetail.vue";
import AdmUserStats from "@/views/AdminView/AdmRefView/AdmUserStats.vue";

export default {
  components: {
    FpDefLayout,
    AdmRefDetail,
    MultiTab,
    AdmUserStats,
  },
  data() {
    return {
      tabHeaders: [
        'Giới thiệu', 'Thống kê'
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
