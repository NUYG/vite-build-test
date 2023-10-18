<template>
  <div class="row ">
    <label v-if="label" :class="labelStyle"
           class="justify-content-start d-flex align-items-center"
           :for="name">{{ getLabel }}
            <span  v-if="labelDesc" class="ms-1 small text-gray"> {{required ? '' : ' (Không bắt buộc)'}}</span>
    </label>
    <TextField
        :style="widthStyleField"
        :id="id" @fieldVal="fieldData"
        :placeholder="placeholder"
        v-if="type === 'text' || type==='username'"
        :emailType="type==='username'" />
    <EmailField
        @fieldVal="fieldData"
        :hasLabel="false"
        :placeholder="placeholder"
        v-if="type === 'email'"
        :required="required"
        borderWhite=""
        :widthStyleField="widthStyleField"
    />
    <PasswordField
        :id="id"
        @fieldVal="fieldData"
        :placeholder="placeholder"
        v-if="type === 'password'"
        :required="required"
        :style="widthStyleField"
    />
    <note-field v-if="type==='note'" :style="widthStyleField" :id="id" @fieldVal="fieldData" :placeholder="placeholder">
    </note-field>
    <span :style="widthStyleField" >
       <FpVnesePhoneField :id="id" v-if="type==='phone'" border-color="" :placeholder="placeholder" label-class="d-none"
                          :required="required"
                          @field-val="fieldData"

       ></FpVnesePhoneField>
        <FpCitizentIDField v-if="type==='CID'" :placeholder="placeholder" :style="widthStyleField" :required='required'
                           label-class="d-none" border-color="" ></FpCitizentIDField>
    </span>

    <RadioField v-if="type === 'radio'" :style="widthStyleField" />
    <SelectField v-if="type === 'selected'" :style="widthStyleField" />
    <CheckboxField v-if="type === 'checkbox'" :style="widthStyleField" />
    <!--    <span v-if="textUnderForm" class="text-content text-gray mt-2 fst-italic ">{{textUnderForm}}</span>-->
  </div>
</template>


<script>
import TextField from './FpFields/TextField.vue'
import EmailField from './FpFields/EmailField.vue'
import PasswordField from './FpFields/PasswordField.vue'
import RadioField from './FpFields/RadioField.vue'
import SelectField from './FpFields/SelectedField.vue'
import CheckboxField from './FpFields/CheckboxField.vue'
import FpVnesePhoneField from "@/components/FpForm/FpVnesePhoneField.vue";
import FpCitizentIDField from "@/components/FpInput/FpFields/FpCitizentIDField.vue";
import NoteField from "@/components/FpInput/FpFields/noteField.vue";

export default {
  data() {
    return {
      value: {}
    }
  },
  components: {
    NoteField,
    FpVnesePhoneField,
    EmailField,
    PasswordField,
    RadioField,
    SelectField,
    CheckboxField,
    TextField,
    FpCitizentIDField
  },
  methods: {
    fieldData() {
      this.value = {...this.value, ...arguments[0]}
    }
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    boldLabel: {
      type: Boolean,
      default: false
    },
    widthField: {
      type: Number,
      default: 100,
    },
    borderWhite: {
      type: Boolean
    },
    textUnderForm: {
      type: String
    },
    inputStyle: {
      type: String
    },
    labelDesc:{
      type:Boolean,
      default:true
    },
    labelClass:{
      type:String
    },
    customInput:{
      type:Boolean
    }
  },
  computed: {
    getLabel() {
      return this.label ? this.label : this.name
    },
    widthStyleField() {
      return `width:${this.widthField}% !important ;${this.inputStyle} !important`
    },
    labelStyle()
    {
      return this.boldLabel ? `${this.labelClass} ; fw-bold ` : this.labelClass
    },
    placeholderStyle()
    {
      return this.customInput ? 'custom-placeholder' : ''
    }
  },
  emits: ['formInput'],
  watch: {
    value(newVal) {
      this.$emit('formInput', newVal)
    }
  }
}
</script>

<style>
.custom-placeholder input::placeholder {
  color: #999999 !important;
  font-size: 14px;
}
</style>
