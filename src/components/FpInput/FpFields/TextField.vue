<template>
  <div>
    <input
        :placeholder="placeholder"
        :type="emailType ? 'email' : 'text'"
        v-model="value"
        class="form-control"
        :class="requiredData"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    }
  },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: '',
    },
    emailType:{
      type:Boolean
    },
  },
  computed: {
    requiredData() {
      return this.required ? (this.value !== '' ? 'is-valid' : 'is-invalid ') : ''
    }
  },
  emits:['fieldVal'],
  watch: {
    value(newValue) {
      this.id ? this.$emit('fieldVal', {[this.id]: newValue}) : this.$emit('fieldVal', newValue)
    }
  }
}
</script>
