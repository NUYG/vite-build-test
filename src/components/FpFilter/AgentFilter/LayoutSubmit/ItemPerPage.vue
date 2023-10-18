<template>
  <SelectedField class="px-0" label="Độ dài" :boldLabel="true"
                 :optionArr="listLenArr" @selectedData="listLenVal"
  />
</template>

<script>
import SelectedField from "@/components/FpInput/FpFields/SelectedField.vue";

export default {
  components: {
    SelectedField
  },
  props: {
    step: {
      type: Number,
      default: 5
    },
    maxLength: {
      type: Number,
      default: 20
    },
    minLength: {
      type: Number,
      default: 5
    }
  },
  computed: {
    listLenArr() {
      const lengthArr = []
      for (let i = this.minLength; i <= this.maxLength; i++) {
        if (i % this.step === 0) {
          lengthArr.push({'value': i, 'content': i})
        }
      }
      return lengthArr
    }
  },
  emits:['listLen'],
  methods: {
    listLenVal(data) {
      this.$emit('listLen',{['listLen']:data})
    }
  }
}
</script>