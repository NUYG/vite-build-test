<template>
  <FpDefLayout>
    <template #comp>

      <AppointmentsTable :role="Roles.Sales"/>

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
