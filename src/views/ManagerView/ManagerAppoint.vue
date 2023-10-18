<template>
  <FpDefLayout
    :toast-msg-content="toastMsg"
    @closeToast="toastMsg=''"
  >
    <template #comp>

      <AppointmentsTable :role="Roles.Manager" @copy-schedule="toastMsg='Thành công'"/>

    </template>
  </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import AppointmentsTable from "@/views/CommonView/AppointmentsTable.vue";

import {Roles} from "@/utils/constants";

export default {
  components: {
    FpDefLayout,
    AppointmentsTable,
  },
  data() {
    return {
      Roles,
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
