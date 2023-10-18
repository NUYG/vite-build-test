<template>
    <textarea class="form-control" rows="3"  :placeholder="placeholder" v-model="value"></textarea>
</template>

<script>
export default {
  data()
  {
    return {
      value:''
    }
  },
  props:{
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
  },
  emits:['fieldVal'],
  watch:{
    value(newValue) {
      this.id ? this.$emit('fieldVal', {[this.id]: newValue}) : this.$emit('fieldVal', newValue)
    }
  }
}
</script>
