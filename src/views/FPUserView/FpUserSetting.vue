<template>
   <FpDefLayout :bc-props="pgMeta">
    <template #comp>
      <div class="container-fluid">
        <FpUserAppointmentSetting></FpUserAppointmentSetting>
        <FpCurrencySetting></FpCurrencySetting>
      </div>
    </template>
   </FpDefLayout>
</template>

<script>
import {breadcrumpProp} from "@/models/customProp";
import FpDefLayout from "@/views/FpDefLayout.vue";
import FpUserAppointmentSetting from "@/views/FPUserView/FpUserAppointmentSetting.vue";
import FpCurrencySetting from "@/views/FPUserView/FpCurrencySetting.vue";

export default {
  components:{FpCurrencySetting, FpUserAppointmentSetting, FpDefLayout},
  data() {
    return {
      pgMeta: {
        [breadcrumpProp.title]: 'Tùy chỉnh',
      },
    }
  },
  mounted() {
  }
}
</script>
