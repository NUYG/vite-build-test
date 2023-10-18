<template>
  <label class="w-100" :class="labelClass" v-if="hasLabel">Email</label>
    <input
        :placeholder='placeholder'
        type='text'
        v-model='value'
        class='form-control' :style="borderStyle"
        :class='validCheck'
    />
</template>

<script>
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
      type: Boolean,
      default: false
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
    hasLabel:{
      type:Boolean,
      default:true
    },
    borderWhite:{
      type:String,
      default:'border-white'
    },
    widthStyleField:{
      type:String,
    }
  },
  computed: {
    validCheck() {
      const borderColor = this.error === '' ? '' : !this.error ? ' is-valid ' : ' is-invalid '
      return this.inputClass + borderColor  + this.borderWhite
    },
    borderStyle()
    {
      return this.widthStyleField
    }

  }, methods: {
    isValidEmail() {
      const regex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return regex.test(this.value)
    }
  }, watch: {
    value(newValue) {
      if (this.required) {
        this.error = !this.isValidEmail(newValue)
      }
      if (this.isValidEmail(newValue)) {
        this.$emit('fieldVal', {email: newValue})
      }
    },
    defValue()
    {
      this.value=this.defValue
    }
  }
}
</script>