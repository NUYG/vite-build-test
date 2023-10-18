<template>
  <label :class="labelClass">Facebook</label>
    <input
        :placeholder='placeholder'
        type='text'
        v-model='value'
        class='form-control border-white'
        :class='validCheck'
    />
</template>

<script>
import {debounce} from "lodash/function";

export default {
  data() {
    return {
      value: this.defValue,
      error: ''
    }
  },
  props: {
    placeholder: {
      type: String, default: ''
    },
    required: {
      type: Boolean, default: false
    },
    inputClass:{
      type:String,
    },
    defValue:{
      type:String,
      default:''
    },
    labelClass:{
      type:String
    }
  }, computed: {
    validCheck() {
      const borderColor = this.error === '' ? '' : !this.error ? 'is-valid' : 'is-invalid'
      return this.inputClass + borderColor
    }
  },
  methods: {
    isValidFb() {
      const regex =
          /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-.]*\/)*([\w\-.]*)/ig
      return regex.test(this.value)
    },
    handleFbChange: debounce(function(newVal) {
      this.$emit('fieldVal', {facebook: newVal})
    }, 500),

  },
  emits:['fieldVal'],
  watch: {
    value(newValue) {
      if (this.required) {
        this.error = !this.isValidFb(newValue)
      }
      if (this.isValidFb(newValue)) {
        this.handleFbChange(newValue)
      }
    },
    defValue()
    {
      this.value=this.defValue
    }
  }
}
</script>