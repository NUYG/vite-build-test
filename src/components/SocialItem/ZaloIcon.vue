<template>
  <FpIcon  v-if="phoneNumber && zaloDirect" srcIcon="zalo.svg" :size="size"
          @click="onZaloSvgClick(phoneNumber)"></FpIcon>
</template>

<script>
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {goZaloWebWithPhoneNumbInDesktop, goZaloWebWithPhoneNumbInMobile} from "@/utils/utils";
export default {
  components: {FpIcon},
  props: {
    phoneNumber: {
      type: [Number, String],
      required: true,
    },
    zaloDirect: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 20,
    },
  },
  computed: {

  },
  emits:[],
  methods: {
    onZaloSvgClick(phoneNumb) {
      if (scrWdtFrom(scrWdtEnum.LG)) {
        goZaloWebWithPhoneNumbInDesktop(phoneNumb)
      } else {
        goZaloWebWithPhoneNumbInMobile(phoneNumb)
      }
    },
  }
}
</script>
