<template>
  <FpCheckboxField :items="options" :multiselect="multiselect" @picked-value="onSettingTime" class="text-content" :selected-items="selectedItem"></FpCheckboxField>
</template>

<script>
import FpCheckboxField from "@/components/FpForm/FpCheckboxField.vue";

export default {
  components: {FpCheckboxField},
  emits:['appointmentTime'],
  methods:{
    onSettingTime(value)
    {
        this.$emit('appointmentTime',value)
    }
  },
  props: {
    options:{
      type:Array,
      default:() => []
    },
    multiselect: {
      type: Boolean,
      default: true
    },
    selectedItem:{
      type:Array,
      default:() => []
    }
  }
}
</script>

<style>

</style>
