<template>
  <label class="w-100" :class="labelClass" >Số điện thoại</label>
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
  },
  emits:['fieldVal'],
  computed: {
    validCheck() {
      const borderColor = this.error === '' ? '' : !this.error ? ' is-valid ' : ' is-invalid '
      return this.inputClass + borderColor + this.borderColor
    }
  }, methods: {
    isValidPhone() {
      const regex =
          /(84|0[3|5|7|8|9])+([0-9]{8})\b/
      return regex.test(this.value)
    }
  }, watch: {
    value(newValue) {
      const trimmedValue = newValue.replace(/\s/g, '')
      if (this.required) {
        this.error = !this.isValidPhone(trimmedValue);
      }

      if (this.isValidPhone(trimmedValue)  ) {
        this.id ? this.$emit('fieldVal', { [this.id]: trimmedValue }) :  this.$emit('fieldVal', { phoneNumber: trimmedValue })
      }

      this.value = trimmedValue;
    },
    defValue()
    {
      this.value=this.defValue
    }
  }
}
</script>