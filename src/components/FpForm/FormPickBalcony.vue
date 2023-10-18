<template>
  <select v-model="balcony" class="form-control-plaintext">
    <option v-for="(point, index) in POINTING" :key="index" :value="point[0]">{{ point[1] }}</option>
  </select>
</template>

<script>
import FpLabelFormTemplate from "@/components/FpLayout/FpLabelFormTemplate.vue";
import {BASIC_POINTING, POINTING} from "@/utils/TransContent";

export default {
  components: {FpLabelFormTemplate},
  data() {
    return {
      balcony: '',
      POINTING: [],
    }
  },
  methods: {
    async getDataLib() {
      this.POINTING = this.basicPointing ? BASIC_POINTING : POINTING;
    },
  },
  async mounted() {
    this.balcony = this.balconyDefault
    await this.getDataLib()
  },
  props: {
    balconyDefault: {
      type: String,
    },
    basicPointing: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['balconyPick'],
  watch:
     {
       balconyDefault(newVal) {
         this.balcony = newVal
       },
       balcony(newVal) {
         this.$emit('balconyPick', newVal)
       }
     }
}
</script>