<template>
  <div>
    <label  v-if="label" :class="{'fw-bold':boldLabel}">{{ label }}</label>
    <select :multiple="multiple" v-model="selectedData" class="form-select border-white" :class='requiredData'>
      <option v-if="defaultData" value="">{{ defaultData }}</option>
      <option v-for="(value,index) in optionArr" :key="index" :value="value[valueKey]">{{ value[contentKey] }}</option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedData: '',
    }
  },
  computed: {
    requiredData() {
      return this.required ? (this.selectedData !== '' ? `is-valid ${this.classes}` : `is-invalid ${this.classes}`) : `${this.classes}`;
    }

  },
  props: {
    label: {
      type: String,
      default: ''
    },
    optionArr: {
      type: Array,
      default: () => ([])
    },
    defaultData: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    boldLabel:{
      type:Boolean,
      default:false
    },
    multiple:{
      type:Boolean,
      default:false
    },
    contentKey:{
      type: String,
      default: 'content',
    },
    valueKey:{
      type: String,
      default: 'value',
    },
    classes:{
      type:String,
      default:''
    },
    selectedVal:{
      type:[Number,String],
      default:''
    }
  },
  emits:['selectedData'],
  watch: {
    selectedData(newVal) {
      this.$emit('selectedData', newVal)
    },
    selectedVal()
    {
      this.selectedData = this.selectedVal
    }
  },
}
</script>