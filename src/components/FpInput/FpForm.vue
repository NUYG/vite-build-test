<template>
  <div :class="formLayoutClass">
    <fieldset>
      <span>{{ title }}</span>
      <FpInput
          @keydown.enter='handleSubmit()'
          v-for="(field, index) in fields"
          :key="index"
          v-bind="field"
          @formInput="dataInput"
          :class="classes"
          :bold-label="true"
          :input-style="inputStyle"
          :labelDesc="labelDesc"
          :labelClass="labelCLass"
          :custom-input="customInput"
      />
      <slot name="message"></slot>
      <div :class="btnSubmitContainer">
        <ButtonView :class="btnSubmitClass" @btnClick="handleSubmit" class="mt-3" :content="submitText" :status="btnStatus" />
      </div>
    </fieldset>
  </div>
</template>

<script>
import FpInput from './FpInput.vue'
import ButtonView from '../FpButton/ButtonView.vue'

export default {
  data() {
    return {
      formData: {}
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      default: () => ([])
    },
    classes: {
      type: String,
      default: ''
    },
    submitText: {
      type: String,
      default: 'Xác nhận',
    },
    btnStatus: {
      type: String,
      default: 'dark'
    },
    formLayoutClass: {
      type: String,
    },
    btnSubmitContainer: {
      type: String,
    },
    btnSubmitClass: {
      type: String,
    },
    placeholderSizeText:{
      type:Number
    },
    inputStyle:{
      type:String
    },
    labelDesc:{
      type:Boolean,
      default:true
    },
    labelCLass:{
      type:String,
    },
    customInput:{
      type:Boolean,
      default:false
    }
  },
  emits: ['submitData'],
  methods: {
    dataInput() {
      this.formData = {...this.formData, ...arguments[0]}
    },
    handleSubmit() {
      this.$emit('submitData', this.formData)
    }
  },
  components: {
    FpInput,
    ButtonView
  }
}
</script>
