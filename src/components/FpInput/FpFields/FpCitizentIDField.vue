<template>
  <label class="w-100" :class="labelClass" >Căn cước công dân</label>
  <input
      :placeholder='placeholder'
      type='text'
      v-model='value'
      class='form-control'
      :class='validCheck'
  />
</template>

<script>
import {number} from "yup";

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
    inputClass: {
      type: String,
    },
    defValue: {
      type: String,
      default: ''
    },
    labelClass:{
      type:String,
    },
    borderColor:{
      type:String,
      default:'border-white'
    },
    id:{
      type:String
    },
    lengthRequired:{
      type:Number,
      default:10
    }
  },
  emits:['fieldVal'],
  computed: {
    validCheck() {
      const borderColor = this.error === '' ? '' : !this.error ? ' is-valid ' : ' is-invalid '
      return this.inputClass + borderColor + this.borderColor
    }
  }, methods: {
    isValidPhone(value) {
      const regex = /^\d+$/
      return regex.test(value)
    }
  }, watch: {
    value(newValue) {
      if (this.isValidPhone(newValue) && (newValue.length >= this.lengthRequired)) {
        this.error=false
        this.id ? this.$emit('fieldVal', { [this.id]: newValue }) :  this.$emit('fieldVal', { phoneNumber: newValue })
      }
      else {
        this.error=true
      }
    },

  }
}
</script>