<template>
  <FpDefLayout
    :bc-props="breadCrumbSetting"
    :toast-msg-content="toastMsg"
    @closeToast="toastMsg=''"
  >
    <template #comp>

      <AppointmentsTable :role="Roles.Agent" @copy-schedule="toastMsg='Thành công'"/>

    </template>
  </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import AppointmentsTable from "@/views/CommonView/AppointmentsTable.vue";

import {Roles} from "@/utils/constants";
import {breadcrumpProp} from "@/models/customProp";

export default {
  components: {
    FpDefLayout,
    AppointmentsTable,
  },
  data() {
    return {
      Roles,
      breadCrumbSetting: {
        [breadcrumpProp.title]: 'Lịch hẹn',
      },
      // Controller
      toastMsg: '',
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
